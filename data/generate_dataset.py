"""
Generate customers.csv (flat training CSV) from customers.json (nested with labels).
Output: data/customers.csv
"""
import json, csv, os

src = os.path.join(os.path.dirname(__file__), "customers.json")
dst = os.path.join(os.path.dirname(__file__), "customers.csv")

with open(src, "r", encoding="utf-8") as f:
    records = json.load(f)

fieldnames = [
    "customer_id",
    "driver_name",
    "driver_driving_license_number",
    "driver_age",
    "driver_driving_experience_years",
    "driver_occupation",
    "driver_marital_status",
    "driver_city_tier",
    "vehicle_category",
    "vehicle_subtype",
    "vehicle_fuel_type",
    "vehicle_age_years",
    "vehicle_engine_cc",
    "vehicle_market_value_inr",
    "vehicle_usage",
    "vehicle_annual_km",
    "vehicle_has_modifications",
    "insurance_history_is_first_time_buyer",
    "insurance_history_prior_insurance_years",
    "claim_history_claims_last_5y",
    "claim_history_at_fault_claims",
    "claim_history_total_claim_amount_inr",
    "claim_history_months_since_last_claim",
    "claim_history_claim_types",
    "risk_factors_traffic_violations_3y",
    "risk_factors_license_suspended",
    "risk_factors_ncb_percent",
    "risk_factors_previous_policy_lapse",
    "risk_factors_night_driving_pct",
    "risk_factors_telematics_score",
    "label_risk_score",
    "label_risk_tier",
]

def flatten(r):
    d = r.get("driver", {})
    v = r.get("vehicle", {})
    ih = r.get("insurance_history", {})
    ch = r.get("claim_history", {})
    rf = r.get("risk_factors", {})
    lb = r.get("label", {})
    return {
        "customer_id": r.get("customer_id"),
        "driver_name": d.get("name"),
        "driver_driving_license_number": d.get("driving_license_number"),
        "driver_age": d.get("age"),
        "driver_driving_experience_years": d.get("driving_experience_years"),
        "driver_occupation": d.get("occupation"),
        "driver_marital_status": d.get("marital_status"),
        "driver_city_tier": d.get("city_tier"),
        "vehicle_category": v.get("category"),
        "vehicle_subtype": v.get("subtype"),
        "vehicle_fuel_type": v.get("fuel_type"),
        "vehicle_age_years": v.get("vehicle_age_years"),
        "vehicle_engine_cc": v.get("engine_cc"),
        "vehicle_market_value_inr": v.get("market_value_inr"),
        "vehicle_usage": v.get("usage"),
        "vehicle_annual_km": v.get("annual_km"),
        "vehicle_has_modifications": v.get("has_modifications"),
        "insurance_history_is_first_time_buyer": ih.get("is_first_time_buyer"),
        "insurance_history_prior_insurance_years": ih.get("prior_insurance_years"),
        "claim_history_claims_last_5y": ch.get("claims_last_5y"),
        "claim_history_at_fault_claims": ch.get("at_fault_claims"),
        "claim_history_total_claim_amount_inr": ch.get("total_claim_amount_inr"),
        "claim_history_months_since_last_claim": ch.get("months_since_last_claim"),
        "claim_history_claim_types": ",".join(ch.get("claim_types") or []),
        "risk_factors_traffic_violations_3y": rf.get("traffic_violations_3y"),
        "risk_factors_license_suspended": rf.get("license_suspended"),
        "risk_factors_ncb_percent": rf.get("ncb_percent"),
        "risk_factors_previous_policy_lapse": rf.get("previous_policy_lapse"),
        "risk_factors_night_driving_pct": rf.get("night_driving_pct"),
        "risk_factors_telematics_score": rf.get("telematics_score"),
        "label_risk_score": lb.get("risk_score"),
        "label_risk_tier": lb.get("risk_tier"),
    }

with open(dst, "w", newline="", encoding="utf-8") as f:
    writer = csv.DictWriter(f, fieldnames=fieldnames)
    writer.writeheader()
    for r in records:
        writer.writerow(flatten(r))

print(f"Written {len(records)} rows to {dst}")
