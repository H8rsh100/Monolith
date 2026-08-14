import os
import uuid
from typing import Dict, Any, Optional
from fastapi import APIRouter, HTTPException, Body
from pydantic import BaseModel

from app.services.parser_client import ParserClient
from app.services.graph_builder import GraphBuilder
from app.services.risk_scorer import RiskScorer
from app.services.llm_summarizer import LLMSummarizer, ProgramSpec

router = APIRouter()

# In-memory storage for ingested codebases
codebase_store: Dict[str, Dict[str, Any]] = {}

class IngestRequest(BaseModel):
    codebase_dir: str

@router.post("/codebase/ingest")
def ingest_codebase(payload: IngestRequest):
    codebase_path = payload.codebase_dir
    if not os.path.isabs(codebase_path):
        codebase_path = os.path.abspath(codebase_path)

    if not os.path.exists(codebase_path):
        raise HTTPException(status_code=404, detail=f"Codebase directory not found: {codebase_path}")

    codebase_id = os.path.basename(codebase_path.rstrip("/\\")) or str(uuid.uuid4())[:8]

    # Step 1: Parse COBOL and JCL files
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
        raise HTTPException(status_code=404, detail=f"Codebase '{cid}' not found")
    return codebase_store[cid]["react_flow_graph"]

@router.get("/codebase/{cid}/programs")
def get_codebase_programs(cid: str, risk_bucket: Optional[str] = None):
    if cid not in codebase_store:
        raise HTTPException(status_code=404, detail=f"Codebase '{cid}' not found")

    cdata = codebase_store[cid]
    result = []

    for pname, prog in cdata["programs"].items():
        risk_info = cdata["risk_scores"].get(pname, {})
        bucket = risk_info.get("bucket", "Low")
        if risk_bucket and bucket.lower() != risk_bucket.lower():
            continue
        has_spec = pname in cdata["llm_specs"]
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
        raise HTTPException(status_code=404, detail=f"Codebase '{cid}' not found")

    cdata = codebase_store[cid]
    pname = name.upper()
    if pname not in cdata["programs"]:
        raise HTTPException(status_code=404, detail=f"Program '{name}' not found in codebase '{cid}'")

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
        raise HTTPException(status_code=404, detail=f"Codebase '{cid}' not found")

    cdata = codebase_store[cid]
    pname = name.upper()
    if pname not in cdata["programs"]:
        raise HTTPException(status_code=404, detail=f"Program '{name}' not found in codebase '{cid}'")

    prog = cdata["programs"][pname]
    summarizer = LLMSummarizer()
    spec = summarizer.summarize_program(prog)

    # Cache spec in memory
    cdata["llm_specs"][pname] = spec.model_dump()
    return spec

@router.post("/codebase/{cid}/summarize-all")
def summarize_all_programs(cid: str):
    if cid not in codebase_store:
        raise HTTPException(status_code=404, detail=f"Codebase '{cid}' not found")

    cdata = codebase_store[cid]
    summarizer = LLMSummarizer()
    results = {}

    for pname, prog in cdata["programs"].items():
        spec = summarizer.summarize_program(prog)
        cdata["llm_specs"][pname] = spec.model_dump()
        results[pname] = spec.model_dump()

    return {
        "summarizedCount": len(results),
        "specs": results
    }
