# Monolith

> AI-Powered COBOL Legacy Intelligence & Migration Engine

Point Monolith at a raw COBOL/JCL codebase and it reverse-engineers the business logic, maps every dependency, flags migration risk, and scaffolds modern Python replacements.

```
┌─────────────────┐      ┌──────────────────────┐      ┌───────────────────┐
│  COBOL/JCL       │      │  Parser Sidecar        │      │  FastAPI Backend    │
│  Source Files    │─────▶│  (Java, ProLeap)       │─────▶│  (Python 3.12)      │
│  (.cbl/.cpy/.jcl) │      │  AST + ASG to JSON     │      │  - Orchestration  │
└─────────────────┘      └──────────────────────┘      │  - NetworkX graph │
                                                           │  - Risk scoring   │
                                                           │  - LLM pipeline   │
                                                           └─────────┬─────────┘
                                                                     │
                                         ┌───────────────────────────┼───────────────────────────┐
                                         ▼                           ▼                           ▼
                               ┌──────────────────┐      ┌──────────────────────┐      ┌──────────────────┐
                               │ LLM Engine        │      │ Modern Codegen       │      │ React Flow       │
                               │ (Claude / OpenAI │      │ Python stub & test   │      │ Dark Mainframe   │
                               │  + fallback)     │      │ skeleton generator   │      │ Dashboard        │
                               └──────────────────┘      └──────────────────────┘      └──────────────────┘
```

## Repository Structure

```
parser-sidecar/   Java 17 service wrapping ProLeap COBOL Parser -> JSON AST output
backend/          Python FastAPI: NetworkX graph builder, risk scorer, LLM pipeline, API
frontend/         React 18 + React Flow + Vite dark mainframe dashboard
demo-cobol/       Sample multi-module banking legacy codebase (CUSTMAIN, ACCTPROC, INTRCALC, TXNLOG, JCL)
docs/             Planning documentation and staged agent build prompts
```

## Quick Start

### 1. Build Parser Sidecar (Java 17 + Maven)
```bash
$env:JAVA_HOME="C:\Program Files\Java\jdk-17"
tools\apache-maven-3.9.9\bin\mvn.cmd clean package -f parser-sidecar/pom.xml
```

### 2. Run Backend (FastAPI)
```bash
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
$env:PYTHONPATH="backend"; python -m pytest backend/tests
uvicorn app.main:app --reload --port 8000
```

### 3. Run Frontend (React + Vite)
```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173` in your browser.

## Demo Walkthrough

1. **Click "Ingest Demo"**: Automatically parses `demo-cobol/` files, computes cyclomatic complexity, builds the directed dependency graph, and calculates composite risk scores.
2. **Explore Dependency Graph**: Inspect node relationships color-coded by risk bucket (Green = Low, Blue = Medium, Orange = High, Red = Critical). Click `INTRCALC` or `CUSTMAIN`.
3. **Inspect Business Logic Spec**: View the side-by-side split screen showing raw COBOL source code on the left and structured LLM business rules, inputs, outputs, and edge cases on the right.
4. **Generate Python Codegen**: Click "Generate Modern Python Code" to preview target Python 3.12 function stubs and pytest test skeletons.
5. **Analyze Risk Heatmap**: Switch to the Risk Matrix view to sort and filter all codebase programs by composite score, lines of code, and embedded SQL penalties.
