# Monolith FastAPI Backend

Python 3.12+ FastAPI backend service for legacy codebase ingestion, NetworkX dependency graph construction, composite risk scoring, and LLM business logic extraction.

## Setup

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
```

## Running the API

```bash
uvicorn app.main:app --reload --port 8000
```

## Running Tests

```bash
pytest tests/
```

## API Endpoints

- `POST /api/codebase/ingest`: Parses legacy codebase directory and builds graph + risk scores.
- `GET /api/codebases`: Lists all ingested codebases.
- `GET /api/codebase/{id}/graph`: Returns React Flow formatted graph JSON.
- `GET /api/codebase/{id}/programs`: Returns all programs with risk scores and filter parameters.
- `GET /api/codebase/{id}/programs/{name}`: Full analysis detail for a single program.
