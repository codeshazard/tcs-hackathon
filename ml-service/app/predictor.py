import os
import joblib
import numpy as np
import pandas as pd
from typing import Dict, Any, List
from .features import prepare_features

MODEL_PATH = os.path.abspath(os.path.join(os.path.dirname(__file__), "../models/rf_insurance_model.pkl"))

class Predictor:
    def __init__(self):
        self.model = None
        self.features = None
        self.target = None
        self.model_version = "rf-v1.0"
        self._load()

    def _load(self):
        if not os.path.exists(MODEL_PATH):
            raise FileNotFoundError(f"Model file not found at {MODEL_PATH}")
        data = joblib.load(MODEL_PATH)
        if isinstance(data, dict):
            self.model = data["model"]
            self.features = data.get("features")
            self.target = data.get("target", "label_risk_score")
        else:
            self.model = data
            self.features = getattr(data, "feature_names_in_", None)
        print(f"[ML-Predictor] Loaded model successfully (version {self.model_version})")

    def _compute_probabilities(self, score: int, tier: str) -> Dict[str, float]:
        if tier == "low":
            p_low = round(min(0.95, max(0.65, 0.70 + 0.25 * ((35 - score) / 35.0))), 2)
            p_med = round((1.0 - p_low) * 0.8, 2)
            p_high = round(max(0.01, 1.0 - p_low - p_med), 2)
        elif tier == "medium":
            p_med = round(min(0.90, max(0.60, 0.65 + 0.20 * (1.0 - abs(score - 47.5) / 12.5))), 2)
            if score < 47.5:
                p_low = round((1.0 - p_med) * 0.75, 2)
                p_high = round(max(0.01, 1.0 - p_med - p_low), 2)
            else:
                p_high = round((1.0 - p_med) * 0.75, 2)
                p_low = round(max(0.01, 1.0 - p_med - p_high), 2)
        else: # high
            p_high = round(min(0.95, max(0.65, 0.70 + 0.25 * ((score - 60) / 40.0))), 2)
            p_med = round((1.0 - p_high) * 0.8, 2)
            p_low = round(max(0.01, 1.0 - p_high - p_med), 2)
        
        # normalize
        total = p_low + p_med + p_high
        return {
            "low": round(p_low / total, 2),
            "medium": round(p_med / total, 2),
            "high": round(p_high / total, 2)
        }

    def _compute_top_factors(self, record: dict, score: int) -> List[Dict[str, Any]]:
        d = record.get("driver", {})
        v = record.get("vehicle", {})
        ih = record.get("insurance_history", {})
        ch = record.get("claim_history", {})
        rf = record.get("risk_factors", {})

        factors = []
        
        # 1. Vehicle Subtype & Category
        sub = v.get("subtype", "hatchback")
        if sub in ["sports_bike", "cruiser"]:
            factors.append({
                "feature": "vehicle_subtype",
                "value": sub,
                "impact": 0.26,
                "direction": "increases_risk"
            })
        elif sub in ["heavy_truck", "bus"]:
            factors.append({
                "feature": "vehicle_subtype",
                "value": sub,
                "impact": 0.22,
                "direction": "increases_risk"
            })
        elif sub in ["hatchback", "sedan"] and v.get("category") == "private_car":
            factors.append({
                "feature": "vehicle_subtype",
                "value": sub,
                "impact": 0.15,
                "direction": "reduces_risk"
            })

        # 2. Claims history
        claims_5y = ch.get("claims_last_5y", 0)
        at_fault = ch.get("at_fault_claims", 0)
        if claims_5y >= 2 or at_fault >= 1:
            factors.append({
                "feature": "claim_history_claims_last_5y",
                "value": claims_5y,
                "impact": min(0.35, 0.18 + 0.06 * claims_5y),
                "direction": "increases_risk"
            })
        elif claims_5y == 0 and not ih.get("is_first_time_buyer"):
            factors.append({
                "feature": "claim_history_claims_last_5y",
                "value": 0,
                "impact": 0.18,
                "direction": "reduces_risk"
            })

        # 3. First time buyer
        if ih.get("is_first_time_buyer"):
            factors.append({
                "feature": "insurance_history_is_first_time_buyer",
                "value": True,
                "impact": 0.22,
                "direction": "increases_risk"
            })

        # 4. Driver experience & age
        exp = d.get("driving_experience_years", 5)
        age = d.get("age", 30)
        if exp < 2:
            factors.append({
                "feature": "driver_driving_experience_years",
                "value": exp,
                "impact": 0.24,
                "direction": "increases_risk"
            })
        elif exp >= 8:
            factors.append({
                "feature": "driver_driving_experience_years",
                "value": exp,
                "impact": 0.20,
                "direction": "reduces_risk"
            })

        if age < 25:
            factors.append({
                "feature": "driver_age",
                "value": age,
                "impact": 0.19,
                "direction": "increases_risk"
            })

        # 5. Violations & License suspension
        violations = rf.get("traffic_violations_3y", 0)
        if rf.get("license_suspended"):
            factors.append({
                "feature": "risk_factors_license_suspended",
                "value": True,
                "impact": 0.30,
                "direction": "increases_risk"
            })
        elif violations >= 2:
            factors.append({
                "feature": "risk_factors_traffic_violations_3y",
                "value": violations,
                "impact": 0.21,
                "direction": "increases_risk"
            })
        elif violations == 0:
            factors.append({
                "feature": "risk_factors_traffic_violations_3y",
                "value": 0,
                "impact": 0.12,
                "direction": "reduces_risk"
            })

        # 6. NCB percent
        ncb = rf.get("ncb_percent", 0)
        if ncb >= 35:
            factors.append({
                "feature": "risk_factors_ncb_percent",
                "value": ncb,
                "impact": min(0.25, 0.10 + 0.003 * ncb),
                "direction": "reduces_risk"
            })

        # 7. Telematics score
        telematics = rf.get("telematics_score")
        if telematics is not None:
            if telematics >= 80:
                factors.append({
                    "feature": "risk_factors_telematics_score",
                    "value": telematics,
                    "impact": 0.14,
                    "direction": "reduces_risk"
                })
            elif telematics < 55:
                factors.append({
                    "feature": "risk_factors_telematics_score",
                    "value": telematics,
                    "impact": 0.16,
                    "direction": "increases_risk"
                })

        # Deduplicate features and sort by impact descending
        seen_features = set()
        unique_factors = []
        for f in sorted(factors, key=lambda x: x["impact"], reverse=True):
            if f["feature"] not in seen_features:
                seen_features.add(f["feature"])
                unique_factors.append(f)

        # Pad with general factors if fewer than 5
        if len(unique_factors) < 5:
            if "vehicle_category" not in seen_features:
                unique_factors.append({
                    "feature": "vehicle_category",
                    "value": v.get("category", "private_car"),
                    "impact": 0.08,
                    "direction": "increases_risk" if v.get("category") == "two_wheeler" else "reduces_risk"
                })

        return unique_factors[:5]

    def predict(self, record: dict) -> Dict[str, Any]:
        df = prepare_features(record)
        raw_pred = float(self.model.predict(df)[0])
        score = int(round(max(0.0, min(100.0, raw_pred))))
        tier = "low" if score < 35 else ("medium" if score < 60 else "high")
        probs = self._compute_probabilities(score, tier)
        top_factors = self._compute_top_factors(record, score)

        return {
            "risk_score": score,
            "risk_tier": tier,
            "probabilities": probs,
            "top_factors": top_factors,
            "model_version": self.model_version
        }

predictor = Predictor()
