import networkx as nx
from typing import List, Dict, Any
from app.services.parser_client import ProgramAnalysis, JclJob

class GraphBuilder:
    def build_dependency_graph(
        self, programs: List[ProgramAnalysis], jcl_jobs: List[JclJob]
    ) -> nx.DiGraph:
        G = nx.DiGraph()

        # Add Program Nodes
        for prog in programs:
            p_id = f"prog_{prog.programName}"
            total_complexity = sum(p.cyclomaticComplexity for p in prog.paragraphs)
            G.add_node(
                p_id,
                node_type="program",
                label=prog.programName,
                name=prog.programName,
                loc=prog.linesOfCode,
                total_complexity=total_complexity,
                dynamic_calls=prog.dynamicCalls,
                sql_count=len(prog.sqlBlocks),
            )

            # Add COPYBOOK edges
            for cpy in prog.copybooks:
                cpy_id = f"cpy_{cpy}"
                if not G.has_node(cpy_id):
                    G.add_node(cpy_id, node_type="copybook", label=cpy, name=cpy)
                G.add_edge(p_id, cpy_id, relation="COPIES")

            # Add CALL edges
            for call_target in prog.calls:
                target_id = f"prog_{call_target}"
                if not G.has_node(target_id):
                    G.add_node(target_id, node_type="program", label=call_target, name=call_target, loc=0, total_complexity=0)
                G.add_edge(p_id, target_id, relation="CALLS")

            # Add File I/O edges
            for fio in prog.fileIO:
                file_id = f"file_{fio.name}"
                if not G.has_node(file_id):
                    G.add_node(file_id, node_type="file", label=fio.name, name=fio.name, assignTo=fio.assignTo, organization=fio.organization)
                G.add_edge(p_id, file_id, relation="ACCESSES")

        # Add JCL Job Nodes & Edges
        for jcl in jcl_jobs:
            job_id = f"jcl_{jcl.jobName}"
            G.add_node(job_id, node_type="jcl_job", label=jcl.jobName, name=jcl.jobName, step_count=len(jcl.steps))
            for step in jcl.steps:
                prog_id = f"prog_{step.program}"
                if not G.has_node(prog_id):
                    G.add_node(prog_id, node_type="program", label=step.program, name=step.program, loc=0, total_complexity=0)
                G.add_edge(job_id, prog_id, relation="EXECUTES", step=step.stepName)

        return G

    def to_react_flow_json(self, G: nx.DiGraph, risk_scores: Dict[str, Any] = None) -> Dict[str, Any]:
        risk_scores = risk_scores or {}
        nodes = []
        edges = []

        # Position layout offsets
        type_y_map = {
            "jcl_job": 50,
            "program": 200,
            "copybook": 380,
            "file": 380,
        }

        counts = {"jcl_job": 0, "program": 0, "copybook": 0, "file": 0}

        for n, attrs in G.nodes(data=True):
            ntype = attrs.get("node_type", "program")
            name = attrs.get("name", n)
            idx = counts.get(ntype, 0)
            counts[ntype] = idx + 1

            x_pos = 100 + (idx * 220)
            y_pos = type_y_map.get(ntype, 200)

            risk_info = risk_scores.get(name, {})

            nodes.append({
                "id": n,
                "type": ntype,
                "position": {"x": x_pos, "y": y_pos},
                "data": {
                    "label": attrs.get("label", n),
                    "name": name,
                    "nodeType": ntype,
                    "loc": attrs.get("loc", 0),
                    "totalComplexity": attrs.get("total_complexity", 0),
                    "riskScore": risk_info.get("score", 0),
                    "riskBucket": risk_info.get("bucket", "Low"),
                    "riskColor": risk_info.get("color", "#10b981"),
                }
            })

        edge_counter = 0
        for src, tgt, attrs in G.edges(data=True):
            edge_counter += 1
            edges.append({
                "id": f"edge_{src}_{tgt}_{edge_counter}",
                "source": src,
                "target": tgt,
                "label": attrs.get("relation", ""),
                "animated": attrs.get("relation") in ["CALLS", "EXECUTES"],
                "style": {"stroke": "#64748b", "strokeWidth": 2}
            })

        return {"nodes": nodes, "edges": edges}
