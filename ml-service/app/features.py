import os
import pandas as pd

# Load vehicle catalog once
CATALOG_PATH = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../data/vehicles_catalog.csv"))
cat_cols = [
    'power_bhp', 'kerb_weight_kg', 'top_speed_kmph', 'ex_showroom_price_inr',
    'airbags_typical', 'power_to_weight_bhp_per_tonne', 'has_abs',
    'accident_proneness_index', 'theft_risk_index', 'repair_cost_index',
    'vehicle_risk_index', 'is_high_risk'
]

_cat_cache = None

def get_catalog_map():
    global _cat_cache
    if _cat_cache is None:
        if os.path.exists(CATALOG_PATH):
            df = pd.read_csv(CATALOG_PATH)
            _cat_cache = df.groupby("subtype")[cat_cols].mean(numeric_only=True).to_dict(orient="index")
        else:
            _cat_cache = {}
    return _cat_cache

FEATURE_ORDER = [
    'driver_age', 'driver_driving_experience_years', 'driver_occupation', 'driver_city_tier',
    'driver_marital_status', 'vehicle_category', 'vehicle_subtype', 'vehicle_fuel_type',
    'vehicle_vehicle_age_years', 'vehicle_engine_cc', 'vehicle_market_value_inr', 'vehicle_usage',
    'vehicle_annual_km', 'vehicle_has_modifications', 'insurance_history_is_first_time_buyer',
    'insurance_history_prior_insurance_years', 'claim_history_claims_last_5y', 'claim_history_at_fault_claims',
    'claim_history_total_claim_amount_inr', 'claim_history_months_since_last_claim',
    'risk_factors_traffic_violations_3y', 'risk_factors_license_suspended',
    'risk_factors_previous_policy_lapse', 'risk_factors_ncb_percent', 'risk_factors_night_driving_pct',
    'risk_factors_telematics_score', 'cat_power_bhp', 'cat_kerb_weight_kg', 'cat_top_speed_kmph',
    'cat_ex_showroom_price_inr', 'cat_airbags_typical', 'cat_power_to_weight_bhp_per_tonne',
    'cat_has_abs', 'cat_accident_proneness_index', 'cat_theft_risk_index', 'cat_repair_cost_index',
    'cat_vehicle_risk_index', 'cat_is_high_risk'
]

def prepare_features(record: dict) -> pd.DataFrame:
    """
    Extract and flatten nested customer record into the exact 38 columns required by the RF pipeline.
    """
    d = record.get("driver", {})
    v = record.get("vehicle", {})
    ih = record.get("insurance_history", {})
    ch = record.get("claim_history", {})
    rf = record.get("risk_factors", {})
    
    sub = v.get("subtype")
    cat_map = get_catalog_map()
    specs = cat_map.get(sub, {})
    
    # Handle possible aliases for vehicle_age_years
    veh_age = v.get("vehicle_age_years") if v.get("vehicle_age_years") is not None else v.get("ageYears", 0)
    
    row = {
        'driver_age': d.get("age", 30),
        'driver_driving_experience_years': d.get("driving_experience_years", 5),
        'driver_occupation': d.get("occupation", "salaried"),
        'driver_city_tier': d.get("city_tier", "tier2"),
        'driver_marital_status': d.get("marital_status", "married"),
        'vehicle_category': v.get("category", "private_car"),
        'vehicle_subtype': v.get("subtype", "hatchback"),
        'vehicle_fuel_type': v.get("fuel_type", "petrol"),
        'vehicle_vehicle_age_years': veh_age,
        'vehicle_engine_cc': v.get("engine_cc", 1200),
        'vehicle_market_value_inr': v.get("market_value_inr", 500000),
        'vehicle_usage': v.get("usage", "personal"),
        'vehicle_annual_km': v.get("annual_km", 10000),
        'vehicle_has_modifications': bool(v.get("has_modifications", False)),
        'insurance_history_is_first_time_buyer': bool(ih.get("is_first_time_buyer", False)),
        'insurance_history_prior_insurance_years': ih.get("prior_insurance_years", 0),
        'claim_history_claims_last_5y': ch.get("claims_last_5y", 0),
        'claim_history_at_fault_claims': ch.get("at_fault_claims", 0),
        'claim_history_total_claim_amount_inr': ch.get("total_claim_amount_inr", 0),
        'claim_history_months_since_last_claim': ch.get("months_since_last_claim"),
        'risk_factors_traffic_violations_3y': rf.get("traffic_violations_3y", 0),
        'risk_factors_license_suspended': bool(rf.get("license_suspended", False)),
        'risk_factors_previous_policy_lapse': bool(rf.get("previous_policy_lapse", False)),
        'risk_factors_ncb_percent': rf.get("ncb_percent", 0),
        'risk_factors_night_driving_pct': rf.get("night_driving_pct", 10),
        'risk_factors_telematics_score': rf.get("telematics_score", 70),
        'cat_power_bhp': specs.get("power_bhp", 0),
        'cat_kerb_weight_kg': specs.get("kerb_weight_kg", 0),
        'cat_top_speed_kmph': specs.get("top_speed_kmph", 0),
        'cat_ex_showroom_price_inr': specs.get("ex_showroom_price_inr", 0),
        'cat_airbags_typical': specs.get("airbags_typical", 0),
        'cat_power_to_weight_bhp_per_tonne': specs.get("power_to_weight_bhp_per_tonne", 0),
        'cat_has_abs': specs.get("has_abs", False),
        'cat_accident_proneness_index': specs.get("accident_proneness_index", 0),
        'cat_theft_risk_index': specs.get("theft_risk_index", 0),
        'cat_repair_cost_index': specs.get("repair_cost_index", 0),
        'cat_vehicle_risk_index': specs.get("vehicle_risk_index", 0),
        'cat_is_high_risk': specs.get("is_high_risk", False)
    }
    
    return pd.DataFrame([row])[FEATURE_ORDER]
