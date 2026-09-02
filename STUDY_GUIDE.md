# Monolith Technical Study Guide & Deep Learning Reference

> **Personal Knowledge Guide: Mastering COBOL Parsing, Compiler ASTs, Graph Theory, LLM Spec Extraction, and Modern Microservice Codegen**

---

## Table of Contents

1. [Module 1: COBOL, Copybook, and JCL Fundamentals](#module-1-cobol-copybook-and-jcl-fundamentals)
2. [Module 2: Compiler Theory & AST Parsing (Java ProLeap Engine)](#module-2-compiler-theory--ast-parsing-java-proleap-engine)
3. [Module 3: Graph Theory & Risk Scoring Mathematics (NetworkX & FastAPI)](#module-3-graph-theory--risk-scoring-mathematics-networkx--fastapi)
4. [Module 4: RAG & LLM Business Logic Extraction](#module-4-rag--llm-business-logic-extraction)
5. [Module 5: Target Microservice Code Generation](#module-5-target-microservice-code-generation)
6. [Module 6: React 18 + React Flow Graph Architecture](#module-6-react-18--react-flow-graph-architecture)
7. [Module 7: Technical Interview Q&A Cheatsheet](#module-7-technical-interview-qa-cheatsheet)

---

## Module 1: COBOL, Copybook, and JCL Fundamentals

### 1. COBOL Four Primary Divisions

Every COBOL program is strictly structured into four vertical divisions:

```cobol
IDENTIFICATION DIVISION.
PROGRAM-ID. ACCTPROC.

ENVIRONMENT DIVISION.
INPUT-OUTPUT SECTION.
FILE-CONTROL.
    SELECT ACCT-FILE ASSIGN TO ACCTMAST.

DATA DIVISION.
FILE SECTION.
FD  ACCT-FILE.
01  ACCT-REC.
    05  ACCT-ID         PIC X(10).
    05  ACCT-BALANCE    PIC 9(7)V99.
    05  ACCT-STATUS     PIC X(1).
        88 STATUS-ACTIVE    VALUE 'A'.
        88 STATUS-FROZEN    VALUE 'F'.

PROCEDURE DIVISION.
0000-MAIN-PROCEDURE.
    PERFORM 1000-READ-ACCOUNT.
    IF STATUS-ACTIVE THEN
        PERFORM 2000-CALCULATE-INTEREST
    END-IF.
    STOP RUN.
```

1. **`IDENTIFICATION DIVISION`**: Contains metadata like `PROGRAM-ID`, author, and creation date.
2. **`ENVIRONMENT DIVISION`**: Maps physical hardware files (`FILE-CONTROL`, `ASSIGN TO`) to program handles.
3. **`DATA DIVISION`**: Declares variables, record structures, memory layouts, and copybooks.
4. **`PROCEDURE DIVISION`**: Contains procedural execution paragraphs and operational statements.

---

### 2. Understanding Data Division Field Levels

COBOL uses numerical level numbers to represent data hierarchies:

- **`01` Level**: Root record structure container.
- **`05`, `10`, `15` Levels**: Sub-fields and nested record components.
- **`77` Level**: Standalone working-storage variable (independent scalar).
- **`88` Level**: Condition-name boolean flag linked directly to the parent field value.

#### Picture (`PIC`) Clauses:
- `PIC X(10)`: Alphanumeric string of length 10.
- `PIC 9(7)`: 7-digit integer.
- `PIC 9(7)V99`: Fixed-point decimal number (7 digits before decimal, 2 implied decimal places).
- `REDEFINES`: Overlays a new data structure over the exact same memory bytes as another field (similar to a C `union`).

---

### 3. Copybooks (`.cpy`)

A **Copybook** is a shared header file included via `COPY COPYBOOKNAME.`. During compilation, the preprocessor expands `COPY` statements by pasting the copybook file contents directly into the `DATA DIVISION`.

---

### 4. Job Control Language (JCL)

JCL scripts instruct IBM mainframes which batch programs to run, in what order, and which physical datasets to attach:

```jcl
//BATJOB01 JOB (ACCT),'DAILY RECONCILIATION',CLASS=A
//STEP010  EXEC PGM=CUSTMAIN
//STEPLIB  DD DSN=BANK.BATCH.LOADLIB,DISP=SHR
//CUSTDATA DD DSN=BANK.VSAM.CUSTMAST,DISP=SHR
//STEP020  EXEC PGM=TXNLOG
//AUDITLOG DD DSN=BANK.VSAM.AUDITLOG,DISP=(NEW,CATLG,DELETE)
```

- `//STEP010 EXEC PGM=CUSTMAIN`: Executes `CUSTMAIN.cbl`.
- `//CUSTDATA DD DSN=...`: Binds file identifier `CUSTDATA` to dataset `BANK.VSAM.CUSTMAST`.

---

## Module 2: Compiler Theory & AST Parsing (Java ProLeap Engine)

### 1. Abstract Syntax Tree (AST) vs. Abstract Semantic Graph (ASG)

- **Abstract Syntax Tree (AST)**: A tree representation of source code syntax structure produced by lexical analysis and token parsing.
- **Abstract Semantic Graph (ASG)**: An enriched AST where symbol references (variable definitions, `PERFORM` paragraph targets) are resolved and linked.

### 2. ProLeap COBOL Parser Architecture

Monolith uses the Java **ProLeap COBOL Parser** (`parser-sidecar/`):

```java
// Java Sidecar AST Parsing Snippet (parser-sidecar/src/main/java/com/monolith/parser/App.java)
CobolParserParams params = new CobolParserParamsImpl();
CobolParserRunner runner = new CobolParserRunnerImpl();
CobolCompilationUnit unit = runner.parseFile(cobolFile, params);

CobolProgram program = unit.getCobolProgram();
DataDivision dataDivision = program.getDataDivision();
ProcedureDivision procDivision = program.getProcedureDivision();
```

The Java sidecar serializes the parsed AST into a clean JSON structure:
- Extracts all `01` to `88` data level structures.
- Parses `PROCEDURE DIVISION` paragraphs and counts decision statements.
- Extracts `COPY` inclusion statements and `CALL` subprogram references.

---

## Module 3: Graph Theory & Risk Scoring Mathematics (NetworkX & FastAPI)

### 1. Directed Dependency Graph Construction

Monolith builds a directed graph \(G = (V, E)\) using Python **NetworkX**:

- **Node Types \(V\)**:
  - JCL Jobs (`jcl_BATJOB01`)
  - COBOL Programs (`prog_CUSTMAIN`, `prog_ACCTPROC`)
  - Copybooks (`cpy_CUSTREC`)
  - VSAM Files (`file_ACCT-FILE`)
- **Edge Types \(E\)**:
  - `EXECUTES` (JCL Job -> COBOL Program)
  - `CALLS` (COBOL Program -> Subprogram)
  - `COPIES` (COBOL Program -> Copybook)
  - `ACCESSES` (COBOL Program -> File)

---

### 2. McCabe Cyclomatic Complexity Calculation

Cyclomatic complexity measures the number of linearly independent paths through a program's source code:

\[
V(G) = P + 1
\]

Where \(P\) is the number of decision predicate statements inside procedure paragraphs:
- COBOL Decision Keywords: `IF`, `EVALUATE`, `WHEN`, `PERFORM UNTIL`.

```python
# Cyclomatic Complexity Extractor (backend/app/services/parser_client.py)
complexity = 1
for line in proc_body.splitlines():
    u = line.upper()
    if " IF " in u or u.startswith("IF "): complexity += 1
    if " EVALUATE " in u or u.startswith("EVALUATE "): complexity += 1
    if " WHEN " in u or u.startswith("WHEN "): complexity += 1
    if " UNTIL " in u: complexity += 1
```

---

### 3. Multi-Factor Composite Risk Scoring Formula

Monolith evaluates a normalized composite risk score (0 to 100) for every program:

\[
\text{Risk Score} = \min(100, S_{\text{complexity}} + S_{\text{blast}} + S_{\text{sql}} + S_{\text{loc}})
\]

Where:
1. **Complexity Score** (\(S_{\text{complexity}}\)): \(\min(35, \text{Cyclomatic Complexity} \times 2.5)\)
2. **Blast Radius Score** (\(S_{\text{blast}}\)): \(\min(25, (\text{In-degree} \times 5) + (\text{Out-degree} \times 3))\)
3. **Database Penalty Score** (\(S_{\text{sql}}\)): \(20\) if DB2 SQL (`EXEC SQL`) or CICS is present, else \(0\)
4. **Lines of Code Score** (\(S_{\text{loc}}\)): \(\min(20, \frac{\text{LOC}}{20})\)

#### Risk Buckets & Effort Estimation:
- **Low Risk (0 - 29)**: Standard migration effort (~1 to 3 Person-Days).
- **Medium Risk (30 - 44)**: Moderate complexity (~3 to 5 Person-Days).
- **High Risk (45 - 64)**: High complexity & dependencies (~5 to 8 Person-Days).
- **Critical Risk (65 - 100)**: Mission-critical bedrock code (~8+ Person-Days).

---

## Module 4: RAG & LLM Business Logic Extraction

Monolith uses structured LLM prompts (`app/services/llm_summarizer.py`) to convert legacy COBOL paragraphs into validated Pydantic JSON schemas:

```python
class ProgramSpec(BaseModel):
    summary: str
    businessRules: List[str]
    inputs: List[str]
    outputs: List[str]
    edgeCases: List[str]
    migrationNotes: str
```

### Key LLM Pipeline Features:
1. **Prompt Sanitization**: Removes legacy comment headers (`*`, `/`) to save context window tokens.
2. **Fallback Rules Engine**: Generates deterministic technical specs using AST metadata if LLM API keys are unavailable.

---

## Module 5: Target Microservice Code Generation

### 1. Mapping COBOL Data Division to Python Pydantic

| COBOL Data Type | Python Equivalent | Example |
| :--- | :--- | :--- |
| `PIC X(10)` | `str` | `acct_id: str` |
| `PIC 9(7)` | `int` | `acct_number: int` |
| `PIC 9(7)V99` | `Decimal` / `float` | `balance: Decimal` |
| `88 STATUS-ACTIVE VALUE 'A'` | `Enum` / `bool` | `is_active: bool` |

### 2. Multi-Target Output (`app/services/codegen.py`)

Generates dual target architectures:
1. **Python 3.12 Stack**: Modern FastAPI microservice function stubs + matching `pytest` unit test files.
2. **Java 17 Stack**: Spring Boot `@Service` classes + `JUnit 5` test suites.

---

## Module 6: React 18 + React Flow Graph Architecture

### 1. Vertical Stratigraphy Positioning Algorithm

In [`StrataGraphView.tsx`](file:///c:/PROJECTS/Monolith/frontend/src/components/StrataGraphView.tsx), Y-axis depth correlates directly with node layer type:

```typescript
let depthY = 380; // Default Mid Stratum
if (nodeType === 'jcl_job') depthY = 50;       // Stratum I: Surface (0m - 150m)
else if (nodeType === 'copybook') depthY = 200; // Stratum II: Copybooks (150m - 320m)
else if (nodeType === 'file') depthY = 510;     // Stratum IV: VSAM Files (500m - 680m)
else if (risk >= 45) depthY = 660;              // Bedrock Core (680m+)
```

### 2. Interactive Taut Thread Edge Lighting

When a node is hovered (`hoveredNodeId`), connected edges illuminate vividly (`stroke: #A8462E`, `strokeWidth: 3.5`, `opacity: 1`), while un-connected edges dim down to `opacity: 0.12`.

---

## Module 7: Technical Interview Q&A Cheatsheet

### Q1: What is the main problem Monolith solves?
**Answer**: Monolith automates the reverse-engineering of legacy COBOL/JCL mainframes by parsing source code into Abstract Syntax Trees, mapping call graph topologies, evaluating risk scores, and generating target microservices.

### Q2: How does Monolith calculate Cyclomatic Complexity for COBOL?
**Answer**: It parses PROCEDURE DIVISION statements and counts decision predicate keywords (`IF`, `EVALUATE`, `WHEN`, `PERFORM UNTIL`). The formula is \(V(G) = P + 1\).

### Q3: Why does Monolith use a decoupled Java sidecar and Python backend?
**Answer**: Java 17 provides deep AST/ASG parser libraries (ProLeap COBOL Parser), while Python FastAPI and NetworkX excel at graph analytics, risk algorithms, and LLM orchestration.

### Q4: How are COBOL data structures translated into modern code?
**Answer**: COBOL `DATA DIVISION` field levels (`01`, `05`, `77`, `88`) and `PIC` clauses are mapped to modern typed models (Python Pydantic dataclasses or Java 17 records).

### Q5: What is the Geological Stratigraphy metaphor?
**Answer**: It visualizes codebase history as depth. Modern JCL jobs sit at the surface, shared copybooks sit in middle strata, and 1970s primitive COBOL sits at the bedrock depth.
