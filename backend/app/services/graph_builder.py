from typing import List, Dict, Any
import networkx as nx
from app.services.parser_client import ProgramAnalysis, JclJob

class GraphBuilder:
    def build_dependency_graph(
        self, programs: List[ProgramAnalysis], jcl_jobs: List[JclJob]
    ) -> nx.DiGraph:
        graph = nx.DiGraph()

        # Add program nodes
        for prog in programs:
            p_node = f"prog_{prog.programName}"
            graph.add_node(
                p_node,
                label=prog.programName,
                nodeType="program",
                linesOfCode=prog.linesOfCode,
                dynamicCalls=prog.dynamicCalls
            )

            # Add copybook nodes and edges
            for cpy in prog.copybooks:
                cpy_node = f"cpy_{cpy}"
                if not graph.has_node(cpy_node):
                    graph.add_node(cpy_node, label=cpy, nodeType="copybook")
                graph.add_edge(p_node, cpy_node, relation="COPIES")

            # Add file IO nodes and edges
            for f_io in prog.fileIO:
                f_name = f_io.get("name") or "FILE"
                file_node = f"file_{f_name}"
                if not graph.has_node(file_node):
                    graph.add_node(
                        file_node,
                        label=f_name,
                        nodeType="file",
                        assignTo=f_io.get("assignTo", ""),
                        mode=f_io.get("mode", "")
                    )
                graph.add_edge(p_node, file_node, relation="ACCESSES")

            # Add subprogram calls
            for call_target in prog.calls:
                target_node = f"prog_{call_target}"
                if not graph.has_node(target_node):
                    graph.add_node(target_node, label=call_target, nodeType="program", linesOfCode=0)
                graph.add_edge(p_node, target_node, relation="CALLS")

        # Add JCL jobs and step execution edges
        for job in jcl_jobs:
            j_node = f"jcl_{job.jobName}"
            graph.add_node(j_node, label=job.jobName, nodeType="jcl_job")
            for step in job.steps:
                exec_prog = step.get("execProgram")
                if exec_prog:
                    target_prog = f"prog_{exec_prog}"
                    if not graph.has_node(target_prog):
                        graph.add_node(target_prog, label=exec_prog, nodeType="program", linesOfCode=0)
                    graph.add_edge(j_node, target_prog, relation="EXECUTES")

        return graph

    def to_react_flow_json(self, graph: nx.DiGraph, risk_scores: Dict[str, Dict[str, Any]]) -> Dict[str, Any]:
        nodes = []
        edges = []

        # Layered hierarchy assignment
        layers = {"jcl_job": 0, "program": 1, "copybook": 2, "file": 3}
        layer_counts = {0: 0, 1: 0, 2: 0, 3: 0}

        y_gap = 260
        x_gap = 380

        for node_id, data in graph.nodes(data=True):
            ntype = data.get("nodeType", "program")
            l_idx = layers.get(ntype, 1)
            col_idx = layer_counts[l_idx]
            layer_counts[l_idx] += 1

            x_pos = 100 + col_idx * x_gap
            y_pos = 80 + l_idx * y_gap

            risk_info = risk_scores.get(data.get("label", ""), {})

            nodes.append({
                "id": node_id,
                "type": ntype,
                "position": {"x": x_pos, "y": y_pos},
                "data": {
                    "label": data.get("label", node_id),
                    "name": data.get("label", node_id),
                    "nodeType": ntype,
                    "riskScore": risk_info.get("score", 0),
                    "riskBucket": risk_info.get("bucket", "Low"),
                    "riskColor": risk_info.get("color", "#10b981"),
                    "linesOfCode": data.get("linesOfCode", 0)
                }
            })

        for u, v, data in graph.edges(data=True):
            relation = data.get("relation", "DEPENDS")
            edges.append({
                "id": f"e_{u}_{v}",
                "source": u,
                "target": v,
                "label": relation,
                "animated": True,
                "style": {"stroke": "#2DE2E6", "strokeWidth": 2}
            })

        return {"nodes": nodes, "edges": edges}
