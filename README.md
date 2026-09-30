# Vehicle Insurance Risk Profile Summarizer

> TCS Technology Day · Problem: *Insurance: Automated Risk Profile Summarizer*

An end-to-end system that takes a driving licence number entered by an insurance underwriter and returns a structured risk profile — score, tier, key indicators, and an AI-generated narrative — in under 20 seconds.

## Architecture

```
Officer enters Driving License number
            │
            ▼
   ┌─────────────────┐   GET /api/risk-profile/:license
   │ React frontend  │ ─────────────────────────────────┐
   └─────────────────┘                                   ▼
                                          ┌──────────────────────┐
                                          │ Express backend      │
                                          │ 1. validate license  │
                                          │ 2. MongoDB lookup    │──► MongoDB
                                          │ 3. preprocess/facts  │
                                          │ 4. ML score          │──► ml-service (FastAPI)
                                          │ 5. build indicators  │
                                          │ 6. LLM narrative     │──► LLM API
                                          │ 7. assemble response │
                                          └──────────────────────┘
```

## Prerequisites

- Node.js 18+
- Python 3.10+
- MongoDB (Atlas M0 free tier or local Community Server)

## Run Locally

> _Setup instructions will be added in Prompt 8 (docs pass)._

### Backend

```bash
cd backend
npm install
cp .env.example .env   # fill in MONGODB_URI and LLM_API_KEY
npm run seed           # loads 10 000 customers into MongoDB
npm run dev
```

### ML Service

```bash
cd ml-service
python -m venv .venv && .venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --port 8000
```

### Frontend

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

## Demo Customers

| Scenario | License | Name | Vehicle | Expected tier |
|---|---|---|---|---|
| Fresher on a sports bike | `MH4720231551327` | Aditya Gowda | sports bike | high |
| Fresher on a hatchback | `DL4620261852249` | Aarav Shetty | hatchback | medium |
| Experienced, many claims + violations | `TS2320051440461` | Vivaan Verma | auto-rickshaw | high |
| Experienced, clean, high NCB | `DL5919951456299` | Ananya Singh | hatchback | low |
| Young rider, one claim | `KA1220251258324` | Aditya Iyer | cruiser bike | medium |

## Evaluation

```bash
cd backend
npm run evaluate -- --n 300 --mode mock
```

Results are written to `docs/EVALUATION.md`.

---

> **Disclaimer**: Data is synthetic. System output is decision support for a human underwriter, not an automated decision.
