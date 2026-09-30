# Project Context
Last updated by: Prompt 0 (Scaffold) · 2026-09-30

## Status

| Prompt | Status | Note |
|---|---|---|
| 0 – Scaffold | ✅ done | Monorepo skeleton created; first commit pending |
| 1 – Backend base + MongoDB + lookup | not started | |
| 2 – Preprocessing service | not started | |
| 3 – ML client + mock scorer | not started | |
| 4 – Indicators, LLM, orchestrator, main endpoint | not started | |
| 5 – Frontend scaffold and UI | not started | |
| 6 – Frontend wiring to real API | not started | |
| 7 – Evaluation script | not started | |
| 8 – Documentation deliverables | not started | |
| 9 – ML service implementation | not started | Needs ML teammate's model files |

## File map

| Path | Purpose / key exports |
|---|---|
| `guide/PROJECT_SPEC.md` | Source-of-truth spec (actual location; `docs/PROJECT_SPEC.md` is a redirect) |
| `README.md` | Project overview, prerequisites, demo customers table |
| `.gitignore` | Ignores node_modules, .env, .venv, __pycache__, dist, *.log, *.joblib |
| `docker-compose.yml` | Placeholder; filled in Prompt 8 |
| **data/** | |
| `data/generate_dataset.py` | Placeholder dataset generation script |
| `data/customers_db.json` | DB seed (no labels) → loaded by `backend/scripts/seed.js` |
| `data/customers.json` | Nested records WITH labels → evaluation ground truth |
| `data/customers.csv` | Flat training data for ML teammate (header row only, placeholder) |
| `data/customers_messy.json` | Intentionally dirty records for preprocessing tests |
| **docs/** | |
| `docs/DATA_DICTIONARY.md` | Field reference for customers.csv / customers_db.json |
| `docs/ARCHITECTURE.md` | Placeholder; filled in Prompt 8 |
| `docs/AI_LOGIC.md` | Placeholder; required hackathon deliverable; filled in Prompt 8 |
| `docs/EVALUATION.md` | Placeholder; filled in Prompt 7 |
| **backend/** | Node.js + Express + Mongoose |
| `backend/package.json` | Scripts: dev, start, seed, evaluate, test |
| `backend/.env.example` | Lists all env vars (no values) |
| `backend/src/server.js` | Entry point — Prompt 1 |
| `backend/src/app.js` | Express app, middleware, routes — Prompt 1 |
| `backend/src/config/env.js` | Load + validate env vars — Prompt 1 |
| `backend/src/config/db.js` | Mongoose connection — Prompt 1 |
| `backend/src/models/Customer.js` | Mongoose schema (snake_case, mirrors customers_db.json) — Prompt 1 |
| `backend/src/routes/index.js` | Aggregates all routes under /api — Prompt 1 |
| `backend/src/routes/health.routes.js` | GET /api/health — Prompt 1 |
| `backend/src/routes/customer.routes.js` | GET /api/customers/:licenseNumber — Prompt 1 |
| `backend/src/routes/riskProfile.routes.js` | GET /api/risk-profile/:licenseNumber — Prompt 4 |
| `backend/src/controllers/customer.controller.js` | Raw record lookup — Prompt 1 |
| `backend/src/controllers/riskProfile.controller.js` | Risk profile response — Prompt 4 |
| `backend/src/services/customer.service.js` | `findByLicense(license)` — Prompt 1 |
| `backend/src/services/preprocessing.service.js` | `preprocess(record)` → {cleanRecord, facts, warnings} — Prompt 2 |
| `backend/src/services/mlClient.service.js` | `predict(record)` — mock or remote — Prompt 3 |
| `backend/src/services/mockScorer.js` | Rule-based scorer (ML_MODE=mock) — Prompt 3 |
| `backend/src/services/indicators.service.js` | `buildIndicators()` → 5 cards — Prompt 4 |
| `backend/src/services/llm.service.js` | `generateJson({system,user})` — Prompt 4 |
| `backend/src/services/fallbackSummary.service.js` | Template summary when LLM fails — Prompt 4 |
| `backend/src/services/riskProfile.service.js` | 7-step pipeline orchestrator — Prompt 4 |
| `backend/src/prompts/summaryPrompt.js` | Builds LLM system + user prompts — Prompt 4 |
| `backend/src/constants/featureMap.js` | Feature → indicator map + labels — Prompt 3 |
| `backend/src/validators/license.validator.js` | normalize + validate license — Prompt 1 |
| `backend/src/middleware/errorHandler.js` | Central error handler — Prompt 1 |
| `backend/src/middleware/requestLogger.js` | Morgan-style logger — Prompt 1 |
| `backend/src/middleware/rateLimiter.js` | 60 req/min per IP — Prompt 1 |
| `backend/src/utils/ApiError.js` | Custom error class with code + status — Prompt 1 |
| `backend/src/utils/timer.js` | start/stop latency timer — Prompt 4 |
| `backend/scripts/seed.js` | Loads customers_db.json into MongoDB — Prompt 1 |
| `backend/scripts/evaluate.js` | Accuracy/latency/faithfulness report — Prompt 7 |
| `backend/tests/license.validator.test.js` | Tests for license validator — Prompt 1 |
| `backend/tests/preprocessing.test.js` | Tests for preprocessing service — Prompt 2 |
| `backend/tests/riskProfile.service.test.js` | Integration tests for pipeline — Prompt 4 |
| **ml-service/** | Python FastAPI |
| `ml-service/requirements.txt` | Python dependencies (placeholder versions) |
| `ml-service/app/main.py` | FastAPI: /health, /predict — Prompt 9 |
| `ml-service/app/schemas.py` | Pydantic request/response models — Prompt 9 |
| `ml-service/app/features.py` | Nested record → flat DataFrame row — Prompt 9 |
| `ml-service/app/predictor.py` | Load model, predict, explain — Prompt 9 |
| `ml-service/models/model_meta.json` | Model metadata (placeholder `{}`) |
| `ml-service/tests/sample_io.json` | Parity examples (placeholder `[]`) |
| `ml-service/tests/test_parity.py` | Parity test — Prompt 9 |
| **frontend/** | Vite + React + Tailwind |
| `frontend/package.json` | Scripts: dev, build, preview |
| `frontend/.env.example` | VITE_API_URL |
| `frontend/vite.config.js` | Vite config with React plugin |
| `frontend/index.html` | HTML entry point |
| `frontend/src/main.jsx` | React entry — Prompt 5 |
| `frontend/src/App.jsx` | Router — Prompt 5 |
| `frontend/src/api/client.js` | Axios instance — Prompt 6 |
| `frontend/src/api/riskApi.js` | `getRiskProfile(license)` — Prompt 6 |
| `frontend/src/hooks/useRiskProfile.js` | State machine hook — Prompt 6 |
| `frontend/src/pages/LookupPage.jsx` | Route "/" — Prompt 5 |
| `frontend/src/pages/ProfilePage.jsx` | Route "/profile/:license" — Prompt 5 |
| `frontend/src/components/LicenseSearch.jsx` | Search input — Prompt 5 |
| `frontend/src/components/RiskGauge.jsx` | 0-100 semicircle gauge — Prompt 5 |
| `frontend/src/components/TierBadge.jsx` | low/medium/high badge — Prompt 5 |
| `frontend/src/components/SummaryCard.jsx` | headline, narrative, recommendation — Prompt 5 |
| `frontend/src/components/IndicatorList.jsx` | 5 indicator cards — Prompt 5 |
| `frontend/src/components/IndicatorCard.jsx` | One indicator with severity — Prompt 5 |
| `frontend/src/components/CustomerInfoCard.jsx` | Customer info panel — Prompt 5 |
| `frontend/src/components/VehicleCard.jsx` | Vehicle info panel — Prompt 5 |
| `frontend/src/components/ClaimSummary.jsx` | Claims summary panel — Prompt 5 |
| `frontend/src/components/FresherBanner.jsx` | First-time buyer notice — Prompt 5 |
| `frontend/src/components/LoadingSteps.jsx` | Progress steps while loading — Prompt 6 |
| `frontend/src/components/ErrorState.jsx` | Error display with retry — Prompt 6 |
| `frontend/src/utils/format.js` | formatINR, formatDate, tierLabel — Prompt 5 |
| `frontend/src/styles/index.css` | Global Tailwind CSS — Prompt 5 |

## Implemented API

| Endpoint | What it does | Status |
|---|---|---|
| GET /api/health | Returns `{ status: "ok", uptime }` | not started (Prompt 1) |
| GET /api/customers/:licenseNumber | Raw DB record lookup | not started (Prompt 1) |
| GET /api/risk-profile/:licenseNumber | Full risk profile response (Section 4.1) | not started (Prompt 4) |
| POST /predict (ml-service) | ML prediction (Section 4.2) | not started (Prompt 9) |

## Commands

_(None verified yet — implementations start at Prompt 1)_

| Command | What it does |
|---|---|
| `cd backend && npm install` | Install backend deps |
| `cd backend && npm run dev` | Start backend in watch mode (port 5000) |
| `cd backend && npm run seed` | Load customers_db.json into MongoDB |
| `cd backend && npm test` | Run vitest unit tests |
| `cd backend && npm run evaluate -- --n 300 --mode mock` | Generate EVALUATION.md |
| `cd ml-service && uvicorn app.main:app --port 8000` | Start ML service |
| `cd frontend && npm install && npm run dev` | Start frontend (port 5173) |

## Environment variables in use

**backend/.env**
- `PORT`
- `MONGODB_URI`
- `CORS_ORIGIN`
- `ML_MODE`
- `ML_SERVICE_URL`
- `LLM_PROVIDER`
- `LLM_API_KEY`
- `LLM_MODEL`
- `LLM_TIMEOUT_MS`

**frontend/.env**
- `VITE_API_URL`

## Decisions and deviations from the spec

1. **Spec says `docs/PROJECT_SPEC.md`** but the file arrived in `guide/PROJECT_SPEC.md`. Created `docs/PROJECT_SPEC.md` as a redirect placeholder so the folder structure matches Section 3. The canonical spec is read from `guide/`.

2. **data/ files are empty placeholders** (`[]` or header-only CSV). The spec says "copy the dataset files"; they don't exist in the workspace yet. All data files must be populated before Prompt 1's seed script can run.

## Known issues / TODO

- `data/customers_db.json`, `data/customers.json`, `data/customers.csv`, `data/customers_messy.json` are empty placeholders — real data must be generated or provided before running Prompt 1.
- `docs/PROJECT_SPEC.md` is a redirect; the real spec is at `guide/PROJECT_SPEC.md`.

## Next step

**Prompt 1: Backend base + MongoDB + lookup** — implement Express backend with health route, Customer model, license validator, customer lookup, and seed script. (Requires populated `data/customers_db.json` first.)
