import networkx as nx
from typing import Dict, Any, List
from app.services.parser_client import ProgramAnalysis

# Named Constants for Composite Risk Score Weighting
WEIGHT_COMPLEXITY = 0.35
WEIGHT_BLAST_RADIUS = 0.30
WEIGHT_SQL_CICS_PENALTY = 0.20
WEIGHT_LOC = 0.15

# Normalization Thresholds
MAX_NORMALIZED_COMPLEXITY = 50.0
MAX_NORMALIZED_BLAST_RADIUS = 10.0
MAX_NORMALIZED_LOC = 300.0

class RiskScorer:
    def calculate_program_risk(
        self, program: ProgramAnalysis, graph: nx.DiGraph
    ) -> Dict[str, Any]:
        p_node = f"prog_{program.programName}"

        # 1. Complexity Score
        total_complexity = sum(p.cyclomaticComplexity for p in program.paragraphs)
        complexity_norm = min(1.0, total_complexity / MAX_NORMALIZED_COMPLEXITY)
        complexity_score = complexity_norm * 100.0

        # 2. Blast Radius (In-Degree + Out-Degree in Dependency Graph)
        in_degree = graph.in_degree(p_node) if graph.has_node(p_node) else 0
        out_degree = graph.out_degree(p_node) if graph.has_node(p_node) else 0
        blast_count = in_degree + out_degree
        blast_norm = min(1.0, blast_count / MAX_NORMALIZED_BLAST_RADIUS)
        blast_score = blast_norm * 100.0

        # 3. Embedded SQL / CICS Penalty
        has_sql_or_cics = len(program.sqlBlocks) > 0 or program.dynamicCalls
        sql_penalty_score = 100.0 if has_sql_or_cics else 0.0

        # 4. Lines of Code Score
        loc_norm = min(1.0, program.linesOfCode / MAX_NORMALIZED_LOC)
        loc_score = loc_norm * 100.0

        # Weighted Total Score (0-100)
        final_score = round(
            (complexity_score * WEIGHT_COMPLEXITY)
            + (blast_score * WEIGHT_BLAST_RADIUS)
            + (sql_penalty_score * WEIGHT_SQL_CICS_PENALTY)
            + (loc_score * WEIGHT_LOC),
            1
        )
        final_score = min(100.0, max(0.0, final_score))

        # Risk Bucket Classification
        if final_score < 25.0:
            bucket = "Low"
            color = "#10b981"
        elif final_score < 50.0:
            bucket = "Medium"
            color = "#3b82f6"
        elif final_score < 75.0:
            bucket = "High"
            color = "#f59e0b"
        else:
            bucket = "Critical"
            color = "#ef4444"

        return {
            "programName": program.programName,
            "score": final_score,
            "bucket": bucket,
            "color": color,
            "breakdown": {
                "totalComplexity": total_complexity,
                "complexityScore": round(complexity_score * WEIGHT_COMPLEXITY, 1),
                "callersCount": in_degree,
                "calleesCount": out_degree,
                "blastRadiusScore": round(blast_score * WEIGHT_BLAST_RADIUS, 1),
                "hasSqlOrCics": has_sql_or_cics,
                "sqlPenaltyScore": round(sql_penalty_score * WEIGHT_SQL_CICS_PENALTY, 1),
                "linesOfCode": program.linesOfCode,
                "locScore": round(loc_score * WEIGHT_LOC, 1),
            }
        }

    def score_all_programs(
        self, programs: List[ProgramAnalysis], graph: nx.DiGraph
    ) -> Dict[str, Dict[str, Any]]:
        results = {}
        for prog in programs:
            results[prog.programName] = self.calculate_program_risk(prog, graph)
        return results
