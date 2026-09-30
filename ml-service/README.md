# ML Service

FastAPI microservice that serves the risk prediction model.

## Development (before the model file arrives)

The backend runs with `ML_MODE=mock` so the ML service is not required during development.

## Running with the real model (Prompt 9)

```bash
python -m venv .venv
.venv\Scripts\activate          # Windows
# source .venv/bin/activate     # macOS/Linux
pip install -r requirements.txt
uvicorn app.main:app --port 8000 --reload
```

Open http://localhost:8000/health and http://localhost:8000/docs.

## Endpoints

| Method | Path | Description |
|---|---|---|
| GET | /health | Returns `{ status: "ok", model_version }` |
| POST | /predict | Accepts `{ record }`, returns risk score + tier + probabilities + top_factors |

## Adding the model

1. Place `risk_model.joblib` in `models/`.
2. Place `model_meta.json` in `models/`.
3. Place `sample_io.json` in `tests/` and run `pytest`.
4. Set `ML_MODE=remote` and `ML_SERVICE_URL=http://localhost:8000` in `backend/.env`.
