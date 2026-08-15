# Monolith

> **Enterprise COBOL Mainframe Modernization & Intelligence Platform**

Monolith is an end-to-end legacy mainframe intelligence engine. It parses complex COBOL, Copybook, and JCL codebases into Abstract Syntax Trees (AST), constructs dependency call graphs, evaluates multi-factor risk metrics, extracts business logic specifications via LLM pipelines, and scaffolds target microservices in Python 3.12 and Java Spring Boot.

---

## Key Platform Capabilities

- **Deep AST & ASG Parsing Engine**: Java 17 ProLeap wrapper extracts DATA DIVISION hierarchy (01, 05, 77, 88 levels, REDEFINES clauses), PROCEDURE DIVISION paragraphs, and JCL job steps into structured JSON AST representations.
- **Dependency Graph & Call Topology**: Powered by NetworkX, Monolith maps program-to-program `CALL` statements, copybook `COPY` inclusions, and VSAM dataset file access into a directed graph.
- **Composite Risk & Effort Assessment**: Multi-factor scoring model calculating McCabe Cyclomatic Complexity, Lines of Code (LOC), DB2 SQL query count, and call graph fan-in/fan-out degree to estimate migration effort in person-days.
- **LLM Business Spec Extraction**: Automatically distills raw COBOL paragraphs into structured technical specifications, identifying core business rules, inputs, outputs, and edge case vulnerabilities.
- **Multi-Language Microservice Codegen**: Scaffolds modern target microservice code and matching test suites (Python 3.12 + Pytest or Java 17 Spring Boot + JUnit 5).
- **Vertical Stratigraphy Topology Visualizer**: React 18 + React Flow UI featuring depth-driven program stratigraphy, topographic contour elevation lines, and an annotated core-sample log inspector with a vertical depth ruler.

---

## Architectural Overview

```
 ┌───────────────────────────┐
 │   COBOL / Copybook / JCL  │
 │   Legacy Source Files     │
 └─────────────┬─────────────┘
               │
               ▼
 ┌───────────────────────────┐
 │  Java 17 Parser Sidecar   │  ProLeap AST & ASG Engine
 │  (AST Extraction Service) │  Outputs structured JSON AST schemas
 └─────────────┬─────────────┘
               │
               ▼
 ┌───────────────────────────┐
 │  FastAPI Python Backend   │  NetworkX Call Graph Engine
 │  (Port 8001 / REST API)   │  McCabe Complexity & Risk Scoring
 └──────┬──────────────┬─────┘  LLM Spec & Target Codegen Pipeline
        │              │
        ▼              ▼
 ┌──────────────┐   ┌──────────────────────────────────────────────┐
 │ LLM Pipeline │   │ React 18 + React Flow Topology Visualizer    │
 │ Spec & Rules │   │ Vertical Stratigraphy & Core Log Inspector   │
 └──────────────┘   └──────────────────────────────────────────────┘
```

---

## System Components

| Component | Stack | Description |
| :--- | :--- | :--- |
| **`parser-sidecar/`** | Java 17, Maven, ProLeap COBOL | Static analysis parser extracting COBOL AST, Data Division schemas, and JCL steps. |
| **`backend/`** | Python 3.12, FastAPI, NetworkX | Microservice API for graph building, risk modeling, LLM specification, and codegen. |
| **`frontend/`** | React 18, Vite, React Flow, Tailwind | Modern cartographer UI with stratigraphy graph, risk matrix, and code inspector. |
| **`demo-cobol/`** | COBOL, Copybooks, JCL | Reference multi-module banking system (`CUSTMAIN`, `ACCTPROC`, `INTRCALC`, `TXNLOG`). |

---

## Getting Started

### 1. Build Parser Sidecar (Java 17 + Maven)
```bash
mvn clean package -f parser-sidecar/pom.xml
```

### 2. Launch FastAPI Backend
```bash
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
$env:PYTHONPATH="backend"; uvicorn app.main:app --host 0.0.0.0 --port 8001
```

### 3. Launch React Frontend
```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173` in your browser.

---

## Verification & Testing

Run the automated backend test suite covering parser integration, CRUD classification, risk modeling, and target codegen:

```bash
$env:PYTHONPATH="backend"; pytest backend/tests -v
```

---

## License

Enterprise Proprietary Architecture. Built for Mainframe Modernization & Cloud Migration Workflows.
