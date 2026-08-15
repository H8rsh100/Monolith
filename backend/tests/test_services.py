import pytest
import networkx as nx
from app.services.parser_client import ProgramAnalysis, ParagraphInfo, FileIOInfo, SqlBlockInfo, classify_crud
from app.services.graph_builder import GraphBuilder
from app.services.risk_scorer import RiskScorer
from app.services.codegen import CodegenGenerator

def test_risk_scorer_buckets():
    scorer = RiskScorer()
    g = nx.DiGraph()

    # Low risk program
    low_prog = ProgramAnalysis(
        programName="LOWPROG",
        linesOfCode=40,
        paragraphs=[ParagraphInfo(name="MAIN", statementCount=5, cyclomaticComplexity=2)]
    )
    low_risk = scorer.calculate_program_risk(low_prog, g)
    assert low_risk["bucket"] == "Low"
    assert low_risk["score"] < 25.0
    assert "migrationEffort" in low_risk

    # Critical risk program
    high_prog = ProgramAnalysis(
        programName="HIGHPROG",
        linesOfCode=400,
        dynamicCalls=True,
        paragraphs=[ParagraphInfo(name="COMPLEX", statementCount=50, cyclomaticComplexity=45)],
        sqlBlocks=[SqlBlockInfo(type="SQL", rawText="SELECT * FROM TAB", targetTables=["TAB"])]
    )
    g.add_node("prog_HIGHPROG")
    for i in range(10):
        g.add_edge(f"caller_{i}", "prog_HIGHPROG")
        g.add_edge("prog_HIGHPROG", f"callee_{i}")

    high_risk = scorer.calculate_program_risk(high_prog, g)
    assert high_risk["bucket"] in ["High", "Critical"]
    assert high_risk["score"] > 50.0
    assert high_risk["migrationEffort"]["personDays"] > 10.0

def test_graph_builder_edge_creation():
    builder = GraphBuilder()
    progs = [
        ProgramAnalysis(
            programName="PROGA",
            calls=["PROGB"],
            copybooks=["CPYA"],
            fileIO=[FileIOInfo(name="F1", assignTo="DS1")]
        ),
        ProgramAnalysis(programName="PROGB")
    ]
    graph = builder.build_dependency_graph(progs, [])

    assert graph.has_node("prog_PROGA")
    assert graph.has_node("prog_PROGB")
    assert graph.has_node("cpy_CPYA")
    assert graph.has_node("file_F1")

    assert graph.has_edge("prog_PROGA", "prog_PROGB")
    assert graph.has_edge("prog_PROGA", "cpy_CPYA")
    assert graph.has_edge("prog_PROGA", "file_F1")

def test_crud_classifier():
    assert classify_crud("SELECT * FROM USERS") == "READ"
    assert classify_crud("INSERT INTO LOGS VALUES (1)") == "WRITE"
    assert classify_crud("UPDATE ACCOUNTS SET BAL = 100") == "UPDATE"
    assert classify_crud("DELETE FROM SESSIONS") == "DELETE"

def test_codegen_generator_multi_language():
    generator = CodegenGenerator()
    spec = {
        "summary": "Sample calculation service",
        "businessRules": ["Rule 1: Verify credit balance"],
        "inputs": ["CUST-ID"],
        "outputs": ["BALANCE"],
        "edgeCases": ["Negative balance handling"],
        "migrationNotes": "Use Spring Data JPA"
    }

    # Python generation
    py_res = generator.generate_codegen("ACCTPROC", spec, "python")
    assert py_res["stubFilename"] == "acctproc_stub.py"
    assert "class ACCTPROCService:" in py_res["stubCode"]

    # Java Spring Boot generation
    java_res = generator.generate_codegen("ACCTPROC", spec, "java")
    assert java_res["stubFilename"] == "AcctprocService.java"
    assert "@Service" in java_res["stubCode"]
    assert "class AcctprocService" in java_res["stubCode"]
