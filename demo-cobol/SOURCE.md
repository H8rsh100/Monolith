# Demo Legacy COBOL Banking Codebase

## Overview
This directory contains a realistic, multi-module COBOL and JCL legacy banking application designed for testing Monolith reverse-engineering, dependency graph parsing, cyclomatic complexity calculation, and LLM spec generation.

## Components
- **CUSTMAIN.cbl**: Main Customer Management Driver Program
- **ACCTPROC.cbl**: Account Transaction Processing Module (includes DB2 SQL operations)
- **INTRCALC.cbl**: Interest Calculation Engine (high-complexity business rules)
- **TXNLOG.cbl**: Transaction Audit Logger (CICS commands)
- **CUSTREC.cpy**: Customer Data Structure Copybook
- **ACCTREC.cpy**: Account Balance Data Structure Copybook
- **TXNREC.cpy**: Transaction Audit Data Structure Copybook
- **BATJOB01.jcl**: Daily Customer Batch Reconciliation Job
- **BATJOB02.jcl**: Monthly Interest Run Job

## License & Attribution
Open-source reference mainframe banking architecture for legacy modernization research.
