# Monolith Parser Sidecar

Java 17 microservice wrapping ProLeap COBOL Parser for parsing legacy COBOL source files, copybooks, and JCL batch job files into structured JSON AST outputs.

## Build

```bash
# Build fat executable JAR
$env:JAVA_HOME="C:\Program Files\Java\jdk-17"
..\tools\apache-maven-3.9.9\bin\mvn.cmd clean package
```

## Usage

### 1. Parse Single COBOL File
```bash
java -jar target/parser-sidecar-1.0.0.jar parse ../demo-cobol/CUSTMAIN.cbl ../demo-cobol
```

### 2. Parse Single JCL Job File
```bash
java -jar target/parser-sidecar-1.0.0.jar parseJcl ../demo-cobol/BATJOB01.jcl
```

### 3. Parse Directory (Batch Mode)
```bash
java -jar target/parser-sidecar-1.0.0.jar parseDirectory ../demo-cobol target/output ../demo-cobol
```

## Output Schema
Emits structured JSON containing:
- `programName`: Name of the program
- `linesOfCode`: Clean lines of code
- `paragraphs`: Array of `{name, statementCount, cyclomaticComplexity}`
- `calls`: Static program call targets
- `dynamicCalls`: Boolean indicator of variable calls
- `copybooks`: Included copybook targets
- `fileIO`: File declarations with access modes and organization
- `sqlBlocks`: Embedded SQL/CICS code blocks and target tables
- `dataDivision`: 01-level layouts with PIC clauses and REDEFINES
