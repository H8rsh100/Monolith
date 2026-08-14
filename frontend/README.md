# Monolith React Dashboard

Vite + React 18 + TypeScript + React Flow UI dashboard for visual legacy intelligence, risk heatmaps, side-by-side COBOL business logic specs, and modern codegen previews.

## Features

- **Dependency Graph View**: Interactive React Flow graph color-coded by composite risk score (Green/Blue/Orange/Red).
- **Risk Heatmap Matrix**: Sortable table ranking COBOL programs by composite risk, cyclomatic complexity, and blast radius.
- **Program Intelligence Viewer**: Two-column layout with raw COBOL source code viewer on the left and LLM-generated business logic spec on the right.
- **Modern Codegen Preview**: Target Python 3.12 service stub and pytest skeleton generator with copy-to-clipboard support.

## Running Locally

```bash
cd frontend
npm install
npm run dev
```

The app will run at `http://localhost:5173`.
