from pydantic import BaseModel, Field
from typing import Dict, Any, List

class TopFactor(BaseModel):
    feature: str
    value: Any
    impact: float
    direction: str # "increases_risk" or "reduces_risk"

class PredictRequest(BaseModel):
    record: Dict[str, Any]

class PredictResponse(BaseModel):
    risk_score: int = Field(..., ge=0, le=100)
    risk_tier: str # "low", "medium", "high"
    probabilities: Dict[str, float]
    top_factors: List[TopFactor]
    model_version: str

class HealthResponse(BaseModel):
    status: str
    model_version: str
