import time
from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from .schemas import PredictRequest, PredictResponse, HealthResponse
from .predictor import predictor

app = FastAPI(
    title="SureRisk Insurance Risk Prediction Service",
    description="FastAPI service serving Random Forest Regressor for motor insurance underwriting risk scoring.",
    version="1.0.0"
)

# Enable CORS for Express backend and dev frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health", response_model=HealthResponse)
def health():
    return {
        "status": "ok",
        "model_version": predictor.model_version
    }

@app.post("/predict", response_model=PredictResponse)
def predict(payload: PredictRequest):
    start_time = time.perf_counter()
    try:
        record = payload.record
        if not record:
            raise HTTPException(status_code=400, detail="Missing record in request body")
        
        result = predictor.predict(record)
        latency_ms = (time.perf_counter() - start_time) * 1000
        print(f"[ML-Service] Scored license {record.get('driver', {}).get('driving_license_number', 'unknown')} -> Score: {result['risk_score']} ({result['risk_tier']}) in {latency_ms:.1f}ms")
        return result
    except Exception as e:
        print(f"[ML-Service] Prediction error: {e}")
        raise HTTPException(status_code=422, detail=f"Inference error: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=False)
