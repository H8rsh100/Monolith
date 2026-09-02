# Monolith: AI-Powered COBOL Mainframe Modernization Platform

> **Academic Project Proposal & Executive Pitch Guide**

---

## 1. Executive Summary

Trillions of dollars in global financial transactions, core banking ledgers, and insurance claims still run on legacy **COBOL** and **JCL (Job Control Language)** systems written in the 1970s and 1980s. As senior mainframe engineers retire, organizations face a critical risk: lost institutional knowledge, high maintenance costs, and high failure rates in manual cloud migration projects.

**Monolith** solves this enterprise challenge by automating legacy system reverse-engineering. It parses raw COBOL source files, Copybooks, and JCL batch job scripts into structured Abstract Syntax Trees (AST), constructs a directed dependency call graph, evaluates multi-factor risk scores, distills human-readable business logic specifications via LLM pipelines, and scaffolds modern microservices in Python 3.12 and Java 17 Spring Boot.

---

## 2. Core Metaphor: The Geological Dig Site

Instead of treating legacy code as a static file dashboard, Monolith models codebases as **Geological Core Samples**:

- **Vertical Stratigraphy**: Program depth correlates directly with age, complexity, and risk.
  - **Stratum I (0m to 150m)**: Modern Surface Integration & JCL Batch Jobs (`BATJOB01`, `BATJOB02`).
  - **Stratum II (150m to 320m)**: Shared Copybook Data Layouts (`CUSTREC`, `ACCTREC`, `TXNREC`).
  - **Stratum III (320m to 500m)**: COBOL Business Logic (`CUSTMAIN`, `ACCTPROC`).
  - **Stratum IV (500m to 680m)**: Subprogram Logic & VSAM File Data Stores (`INTRCALC`, `ACCT-FILE`).
  - **Bedrock Core (680m+)**: 1970s Primitive Subroutine Logic (`TXNLOG`).
- **Interactive Taut Thread Topology**: Hovering any node pulls its dependency connections taut, highlighting upstream execution triggers and downstream dataset blast radiuses.

---

## 3. High-Level Technical Architecture

```
┌───────────────────────────┐
│   COBOL / Copybook / JCL  │
│   Legacy Source Files     │
└─────────────┬─────────────┘
              │
              ▼
┌───────────────────────────┐
│  Java 17 Parser Sidecar   │  ProLeap AST & ASG Engine
│  (AST Extraction Service) │  Converts raw COBOL/JCL into JSON AST
└─────────────┬─────────────┘
              │
              ▼
┌───────────────────────────┐
│  FastAPI Python Backend   │  NetworkX Call Graph Engine
│  (Port 8001 / REST API)   │  McCabe Complexity & Composite Risk Scoring
└──────┬──────────────┬─────┘  LLM Spec & Multi-Language Codegen Engine
       │              │
       ▼              ▼
┌──────────────┐   ┌──────────────────────────────────────────────┐
│ LLM Pipeline │   │ React 18 + React Flow Visualizer             │
│ Spec & Rules │   │ Vertical Stratigraphy & Core Log Inspector   │
└──────────────┘   └──────────────────────────────────────────────┘
```

---

## 4. Key Engineering Innovations

1. **Hybrid Parser Architecture**:
   - Primary: Java 17 service wrapping the enterprise ProLeap COBOL Parser for complete AST and Abstract Semantic Graph (ASG) extraction.
   - Fallback: Native Python regex-based AST engine ensuring 100% execution uptime even when Java environments are unavailable.

2. **Multi-Factor Legacy Risk Engine**:
   Evaluates a composite risk score (0 to 100) using four weighted pillars:
   - **McCabe Cyclomatic Complexity Score** (Paragraph decision branches: `IF`, `EVALUATE`, `PERFORM UNTIL`).
   - **Graph Blast Radius Score** (In-degree callers + out-degree callees via NetworkX).
   - **Embedded Database & Legacy SQL Penalty** (Presence of DB2 `EXEC SQL` or CICS commands).
   - **Lines of Code (LOC) Score** (Raw procedure statements).

3. **Automated Business Logic Extraction**:
   Uses LLMs (Claude 3.5 / GPT-4o) to translate verbose COBOL paragraphs into structured technical specifications, capturing business rules, expected inputs, outputs, and edge-case vulnerabilities.

4. **Multi-Target Microservice Generation**:
   Generates target Python 3.12 (FastAPI + Pytest) and Java 17 (Spring Boot + JUnit 5) microservice stubs directly from extracted AST schemas and data division field definitions (`01`, `05`, `77`, `88` levels).

---

## 5. Demo Codebase Benchmark Results

When evaluated on the reference multi-module banking system (`demo-cobol/`):

| Program / Job | Type | LOC | Cyclomatic Complexity | Risk Score | Risk Bucket | Target Effort (Person-Days) |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **`ACCTPROC`** | COBOL Program | 148 | 14 | 45.8 | **High** | 6.2 Days |
| **`INTRCALC`** | COBOL Subprogram | 92 | 8 | 42.1 | **High** | 5.4 Days |
| **`CUSTMAIN`** | COBOL Program | 110 | 9 | 39.3 | **Medium** | 4.8 Days |
| **`TXNLOG`** | COBOL Program | 78 | 6 | 34.1 | **Medium** | 3.9 Days |
| **`BATJOB01`** | JCL Batch Job | 16 | N/A | 15.0 | **Low** | 1.2 Days |
| **`BATJOB02`** | JCL Batch Job | 14 | N/A | 15.0 | **Low** | 1.2 Days |

---

## 6. How to Present This to Professors & Evaluators

When pitching Monolith:

1. **Start with the Enterprise Problem**: Mention that $3 Trillion in daily transactions rely on COBOL, but 70% of legacy modernization projects fail due to poor documentation.
2. **Highlight the Architecture**: Point out your decoupled multi-language stack (Java 17 AST Sidecar, Python FastAPI & NetworkX backend, React 18 frontend).
3. **Showcase the Algorithmic Rigor**: Explain how McCabe Cyclomatic Complexity combined with NetworkX graph centrality metrics produces quantitative risk scores.
4. **Demonstrate Live**: Run through the 4 tabs:
   - **Tab I (Topology Map)**: Show the stratigraphy graph and hover lighting.
   - **Tab II (Risk Matrix)**: Show the sorted risk table and DB2 penalties.
   - **Tab III (Inspector)**: Show side-by-side COBOL source code and extracted business rules.
   - **Tab IV (Codegen Scaffold)**: Show generated Python/Java microservice code and unit tests.
