import os
import uuid
from typing import Dict, Any, Optional
from fastapi import APIRouter, HTTPException, Body, Query
from pydantic import BaseModel

from app.services.parser_client import ParserClient
from app.services.graph_builder import GraphBuilder
from app.services.risk_scorer import RiskScorer
from app.services.llm_summarizer import LLMSummarizer, ProgramSpec
from app.services.codegen import CodegenGenerator

router = APIRouter()

# In-memory storage for ingested codebases
codebase_store: Dict[str, Dict[str, Any]] = {}

class IngestRequest(BaseModel):
    codebase_dir: str

@router.post("/codebase/ingest")
def ingest_codebase(payload: IngestRequest):
    codebase_path = payload.codebase_dir
    if not os.path.isabs(codebase_path):
        candidates = [
            os.path.abspath(codebase_path),
            os.path.abspath(os.path.join(os.getcwd(), codebase_path)),
            os.path.abspath(os.path.join(os.getcwd(), "..", codebase_path)),
            os.path.abspath(os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), codebase_path))
        ]
        for cand in candidates:
            if os.path.exists(cand):
                codebase_path = cand
                break

    codebase_id = os.path.basename(codebase_path.rstrip("/\\")) or str(uuid.uuid4())[:8]

    # Step 1: Parse COBOL and JCL files (with fallback)
    parser_client = ParserClient()
    programs, jcl_jobs = parser_client.parse_codebase(codebase_path)

    # Step 2: Build Dependency Graph
    graph_builder = GraphBuilder()
    graph = graph_builder.build_dependency_graph(programs, jcl_jobs)

    # Step 3: Score Risk
    risk_scorer = RiskScorer()
    risk_scores = risk_scorer.score_all_programs(programs, graph)

    # Step 4: Format Graph for React Flow
    react_flow_graph = graph_builder.to_react_flow_json(graph, risk_scores)

    # Store state
    codebase_store[codebase_id] = {
        "id": codebase_id,
        "path": codebase_path,
        "programs": {p.programName: p for p in programs},
        "jcl_jobs": jcl_jobs,
        "graph": graph,
        "react_flow_graph": react_flow_graph,
        "risk_scores": risk_scores,
        "llm_specs": {}
    }

    return {
        "codebaseId": codebase_id,
        "programCount": len(programs),
        "jclJobCount": len(jcl_jobs),
        "message": "Codebase ingested successfully"
    }

@router.get("/codebases")
def list_codebases():
    return [
        {
            "id": cid,
            "path": cdata["path"],
            "programCount": len(cdata["programs"]),
            "jclJobCount": len(cdata["jcl_jobs"])
        }
        for cid, cdata in codebase_store.items()
    ]

@router.get("/codebase/{cid}/graph")
def get_codebase_graph(cid: str):
    if cid not in codebase_store:
        # Auto-ingest fallback if accessed directly
        ingest_codebase(IngestRequest(codebase_dir="demo-cobol"))
    return codebase_store.get(cid, {}).get("react_flow_graph", {"nodes": [], "edges": []})

@router.get("/codebase/{cid}/programs")
def get_codebase_programs(cid: str, risk_bucket: Optional[str] = None):
    if cid not in codebase_store:
        ingest_codebase(IngestRequest(codebase_dir="demo-cobol"))

    cdata = codebase_store.get(cid, codebase_store.get("demo-cobol", {}))
    if not cdata:
        return []

    result = []
    for pname, prog in cdata.get("programs", {}).items():
        risk_info = cdata.get("risk_scores", {}).get(pname, {})
        bucket = risk_info.get("bucket", "Low")
        if risk_bucket and bucket.lower() != risk_bucket.lower():
            continue
        has_spec = pname in cdata.get("llm_specs", {})
        result.append({
            "programName": pname,
            "linesOfCode": prog.linesOfCode,
            "riskScore": risk_info.get("score", 0),
            "riskBucket": bucket,
            "riskColor": risk_info.get("color", "#10b981"),
            "paragraphCount": len(prog.paragraphs),
            "callCount": len(prog.calls),
            "copybookCount": len(prog.copybooks),
            "hasSqlOrCics": len(prog.sqlBlocks) > 0 or prog.dynamicCalls,
            "hasSpec": has_spec
        })

    return sorted(result, key=lambda x: x["riskScore"], reverse=True)

@router.get("/codebase/{cid}/programs/{name}")
def get_program_detail(cid: str, name: str):
    if cid not in codebase_store:
        ingest_codebase(IngestRequest(codebase_dir="demo-cobol"))

    cdata = codebase_store.get(cid, codebase_store.get("demo-cobol", {}))
    pname = name.upper()
    if pname not in cdata.get("programs", {}):
        pname = list(cdata.get("programs", {}).keys())[0] if cdata.get("programs") else "CUSTMAIN"

    prog = cdata["programs"][pname]
    risk_info = cdata["risk_scores"].get(pname, {})
    llm_spec = cdata["llm_specs"].get(pname, None)

    return {
        "program": prog,
        "risk": risk_info,
        "spec": llm_spec
    }

@router.post("/codebase/{cid}/programs/{name}/summarize")
def summarize_single_program(cid: str, name: str):
    if cid not in codebase_store:
        ingest_codebase(IngestRequest(codebase_dir="demo-cobol"))

    cdata = codebase_store.get(cid, codebase_store.get("demo-cobol", {}))
    pname = name.upper()
    if pname not in cdata.get("programs", {}):
        pname = list(cdata.get("programs", {}).keys())[0] if cdata.get("programs") else "CUSTMAIN"

    prog = cdata["programs"][pname]
    summarizer = LLMSummarizer()
    spec = summarizer.summarize_program(prog)

    # Cache spec in memory
    cdata["llm_specs"][pname] = spec.model_dump()
    return spec

@router.post("/codebase/{cid}/summarize-all")
def summarize_all_programs(cid: str):
    if cid not in codebase_store:
        ingest_codebase(IngestRequest(codebase_dir="demo-cobol"))

    cdata = codebase_store.get(cid, codebase_store.get("demo-cobol", {}))
    summarizer = LLMSummarizer()
    results = {}

    for pname, prog in cdata.get("programs", {}).items():
        spec = summarizer.summarize_program(prog)
        cdata["llm_specs"][pname] = spec.model_dump()
        results[pname] = spec.model_dump()

    return {
        "summarizedCount": len(results),
        "specs": results
    }

@router.post("/codebase/{cid}/programs/{name}/codegen")
def generate_program_codegen(cid: str, name: str, lang: str = Query("python")):
    if cid not in codebase_store:
        ingest_codebase(IngestRequest(codebase_dir="demo-cobol"))

    cdata = codebase_store.get(cid, codebase_store.get("demo-cobol", {}))
    pname = name.upper()
    if pname not in cdata.get("programs", {}):
        pname = list(cdata.get("programs", {}).keys())[0] if cdata.get("programs") else "CUSTMAIN"

    if pname not in cdata["llm_specs"]:
        prog = cdata["programs"][pname]
        summarizer = LLMSummarizer()
        spec = summarizer.summarize_program(prog)
        cdata["llm_specs"][pname] = spec.model_dump()

    spec_data = cdata["llm_specs"][pname]
    generator = CodegenGenerator()
    return generator.generate_codegen(pname, spec_data, target_language=lang)

@router.get("/codebase/{cid}/export/report")
def export_audit_report(cid: str):
    if cid not in codebase_store:
        ingest_codebase(IngestRequest(codebase_dir="demo-cobol"))

    cdata = codebase_store.get(cid, codebase_store.get("demo-cobol", {}))
    programs = cdata.get("programs", {})
    risk_scores = cdata.get("risk_scores", {})

    total_loc = sum(p.linesOfCode for p in programs.values())
    total_effort = sum(risk_scores[pname]["migrationEffort"]["personDays"] for pname in programs)
    target_python_loc = sum(risk_scores[pname]["migrationEffort"]["targetPythonLoc"] for pname in programs)
    avg_risk = round(sum(risk_scores[pname]["score"] for pname in programs) / max(1, len(programs)), 1)

    buckets = {"Low": 0, "Medium": 0, "High": 0, "Critical": 0}
    for pname in programs:
        b = risk_scores[pname]["bucket"]
        buckets[b] = buckets.get(b, 0) + 1

    return {
        "codebaseId": cid,
        "summary": {
            "totalPrograms": len(programs),
            "totalJclJobs": len(cdata.get("jcl_jobs", [])),
            "totalCobolLoc": total_loc,
            "estimatedTargetLoc": target_python_loc,
            "averageRiskScore": avg_risk,
            "estimatedEffortPersonDays": total_effort,
            "riskBucketDistribution": buckets
        },
        "programDetails": [
            {
                "name": pname,
                "loc": prog.linesOfCode,
                "riskScore": risk_scores[pname]["score"],
                "riskBucket": risk_scores[pname]["bucket"],
                "effortPersonDays": risk_scores[pname]["migrationEffort"]["personDays"],
                "paragraphsCount": len(prog.paragraphs),
                "sqlCount": len(prog.sqlBlocks)
            }
            for pname, prog in programs.items()
        ]
    }
