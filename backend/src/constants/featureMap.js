// src/constants/featureMap.js — Mapping model features to indicator keys and labels

export const FEATURE_MAP = {
  // vehicle
  vehicle_category: 'vehicle',
  vehicle_subtype: 'vehicle',
  vehicle_engine_cc: 'vehicle',
  vehicle_has_modifications: 'vehicle',
  vehicle_vehicle_age_years: 'vehicle',
  vehicle_fuel_type: 'vehicle',
  vehicle_market_value_inr: 'vehicle',
  vehicle_usage: 'vehicle',
  vehicle_annual_km: 'vehicle',

  // claims
  claim_history_claims_last_5y: 'claims',
  claim_history_at_fault_claims: 'claims',
  claim_history_total_claim_amount_inr: 'claims',
  claim_history_months_since_last_claim: 'claims',

  // violations
  risk_factors_traffic_violations_3y: 'violations',
  risk_factors_license_suspended: 'violations',

  // driver
  driver_age: 'driver',
  driver_driving_experience_years: 'driver',
  driver_occupation: 'driver',
  driver_marital_status: 'driver',
  driver_city_tier: 'driver',
  risk_factors_night_driving_pct: 'driver',
  risk_factors_telematics_score: 'driver',

  // history
  insurance_history_prior_years: 'history',
  insurance_history_is_first_time_buyer: 'history',
  risk_factors_ncb_percent: 'history',
  risk_factors_previous_policy_lapse: 'history',
};

export const FEATURE_LABELS = {
  vehicle_category: 'Vehicle Category',
  vehicle_subtype: 'Vehicle Subtype',
  vehicle_engine_cc: 'Engine Capacity (CC)',
  vehicle_has_modifications: 'Vehicle Modifications',
  vehicle_vehicle_age_years: 'Vehicle Age',
  vehicle_fuel_type: 'Fuel Type',
  vehicle_market_value_inr: 'Market Value (IDV)',
  vehicle_usage: 'Vehicle Usage',
  vehicle_annual_km: 'Annual Mileage (km)',

  claim_history_claims_last_5y: 'Claims in Last 5 Years',
  claim_history_at_fault_claims: 'At-Fault Claims',
  claim_history_total_claim_amount_inr: 'Total Claims Amount',
  claim_history_months_since_last_claim: 'Months Since Last Claim',

  risk_factors_traffic_violations_3y: 'Traffic Violations (3y)',
  risk_factors_license_suspended: 'License Suspended Status',

  driver_age: 'Driver Age',
  driver_driving_experience_years: 'Driving Experience (Years)',
  driver_occupation: 'Occupation',
  driver_marital_status: 'Marital Status',
  driver_city_tier: 'City Tier',
  risk_factors_night_driving_pct: 'Night Driving Ratio',
  risk_factors_telematics_score: 'Telematics Score',

  insurance_history_prior_years: 'Prior Policy Tenure',
  insurance_history_is_first_time_buyer: 'First Time Insurance Applicant',
  risk_factors_ncb_percent: 'No Claim Bonus (NCB %)',
  risk_factors_previous_policy_lapse: 'Previous Policy Lapse',
};

export function featureToIndicator(feature) {
  return FEATURE_MAP[feature] || 'driver';
}

export function getFeatureLabel(feature) {
  return FEATURE_LABELS[feature] || feature.replace(/_/g, ' ');
}
