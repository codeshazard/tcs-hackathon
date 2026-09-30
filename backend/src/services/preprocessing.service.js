// src/services/preprocessing.service.js — Data normalization and deterministic facts calculation

/**
 * Preprocess customer record: validates, cleans and extracts derived underwriting facts
 * @param {object} rawRecord 
 * @returns {{ cleanRecord: object, facts: object, warnings: string[] }}
 */
export function preprocess(rawRecord) {
  const warnings = [];
  const r = JSON.parse(JSON.stringify(rawRecord || {}));

  // Coerce number helper
  const cleanNumber = (val, path, def = 0) => {
    if (val === null || val === undefined || val === '') return null;
    if (typeof val === 'number') return isNaN(val) ? def : val;
    if (typeof val === 'string') {
      const parsed = parseFloat(val.trim());
      if (!isNaN(parsed)) {
        warnings.push(`Coerced string "${val}" to number ${parsed} at ${path}`);
        return parsed;
      }
    }
    warnings.push(`Invalid number at ${path}, defaulting to ${def}`);
    return def;
  };

  // String cleaner
  const cleanStr = (val, path, toLower = false, def = '') => {
    if (val === null || val === undefined) {
      warnings.push(`Missing string at ${path}`);
      return def;
    }
    let res = String(val).trim();
    if (toLower) res = res.toLowerCase();
    return res || def;
  };

  // Clean Driver
  const driver = r.driver || {};
  let occupation = cleanStr(driver.occupation, 'driver.occupation', true, 'unknown');
  if (!occupation) occupation = 'unknown';

  const cleanDriver = {
    driving_license_number: cleanStr(driver.driving_license_number, 'driver.driving_license_number').toUpperCase().replace(/[\s-]/g, ''),
    name: cleanStr(driver.name, 'driver.name', false, 'Unknown Applicant'),
    age: cleanNumber(driver.age, 'driver.age', 30) ?? 30,
    driving_experience_years: cleanNumber(driver.driving_experience_years, 'driver.driving_experience_years', 0) ?? 0,
    occupation,
    city_tier: cleanStr(driver.city_tier, 'driver.city_tier', true, 'tier2'),
    marital_status: cleanStr(driver.marital_status, 'driver.marital_status', true, 'single'),
  };

  // Clean Vehicle
  const vehicle = r.vehicle || {};
  const cleanVehicle = {
    category: cleanStr(vehicle.category, 'vehicle.category', true, 'private_car'),
    subtype: cleanStr(vehicle.subtype, 'vehicle.subtype', true, 'hatchback'),
    fuel_type: cleanStr(vehicle.fuel_type, 'vehicle.fuel_type', true, 'petrol'),
    vehicle_age_years: cleanNumber(vehicle.vehicle_age_years, 'vehicle.vehicle_age_years', 1) ?? 1,
    engine_cc: cleanNumber(vehicle.engine_cc, 'vehicle.engine_cc', 1200) ?? 1200,
    market_value_inr: cleanNumber(vehicle.market_value_inr, 'vehicle.market_value_inr', 400000) ?? 400000,
    usage: cleanStr(vehicle.usage, 'vehicle.usage', true, 'personal'),
    annual_km: cleanNumber(vehicle.annual_km, 'vehicle.annual_km', null),
    has_modifications: Boolean(vehicle.has_modifications),
  };

  // Clean Insurance History
  const insHistory = r.insurance_history || {};
  const isFirstTimeBuyer = Boolean(insHistory.is_first_time_buyer);
  const priorInsuranceYears = isFirstTimeBuyer
    ? 0
    : (cleanNumber(insHistory.prior_insurance_years, 'insurance_history.prior_insurance_years', 0) ?? 0);

  const cleanInsuranceHistory = {
    is_first_time_buyer: isFirstTimeBuyer,
    prior_insurance_years: priorInsuranceYears,
  };

  // Clean Claim History
  const claimHistory = r.claim_history || {};
  const claimsLast5y = isFirstTimeBuyer ? 0 : (cleanNumber(claimHistory.claims_last_5y, 'claim_history.claims_last_5y', 0) ?? 0);
  const atFaultClaims = isFirstTimeBuyer ? 0 : (cleanNumber(claimHistory.at_fault_claims, 'claim_history.at_fault_claims', 0) ?? 0);
  const totalClaimAmountInr = isFirstTimeBuyer ? 0 : (cleanNumber(claimHistory.total_claim_amount_inr, 'claim_history.total_claim_amount_inr', 0) ?? 0);
  const monthsSinceLastClaim = isFirstTimeBuyer ? null : cleanNumber(claimHistory.months_since_last_claim, 'claim_history.months_since_last_claim', null);

  const cleanClaimHistory = {
    claims_last_5y: claimsLast5y,
    at_fault_claims: atFaultClaims,
    total_claim_amount_inr: totalClaimAmountInr,
    claim_types: Array.isArray(claimHistory.claim_types) ? claimHistory.claim_types : [],
    months_since_last_claim: monthsSinceLastClaim,
  };

  // Clean Risk Factors
  const riskFactors = r.risk_factors || {};
  const cleanRiskFactors = {
    traffic_violations_3y: cleanNumber(riskFactors.traffic_violations_3y, 'risk_factors.traffic_violations_3y', 0) ?? 0,
    license_suspended: Boolean(riskFactors.license_suspended),
    previous_policy_lapse: isFirstTimeBuyer ? false : Boolean(riskFactors.previous_policy_lapse),
    ncb_percent: isFirstTimeBuyer ? 0 : (cleanNumber(riskFactors.ncb_percent, 'risk_factors.ncb_percent', 0) ?? 0),
    night_driving_pct: cleanNumber(riskFactors.night_driving_pct, 'risk_factors.night_driving_pct', 0) ?? 0,
    telematics_score: cleanNumber(riskFactors.telematics_score, 'risk_factors.telematics_score', null),
  };

  const cleanRecord = {
    customer_id: r.customer_id || 'CUST_UNKNOWN',
    driver: cleanDriver,
    vehicle: cleanVehicle,
    insurance_history: cleanInsuranceHistory,
    claim_history: cleanClaimHistory,
    risk_factors: cleanRiskFactors,
  };

  // --- Compute Facts (Deterministic Underwriting Metrics) ---
  const yearsForRatio = Math.max(1, Math.min(5, priorInsuranceYears));
  const claimsPerYear = isFirstTimeBuyer ? null : Number((claimsLast5y / yearsForRatio).toFixed(2));
  const avgClaimAmountInr = claimsLast5y > 0 ? Math.round(totalClaimAmountInr / claimsLast5y) : 0;
  const claimToVehicleValuePct = cleanVehicle.market_value_inr > 0
    ? Number(((totalClaimAmountInr / cleanVehicle.market_value_inr) * 100).toFixed(1))
    : 0;
  const atFaultRatio = claimsLast5y > 0 ? Number((atFaultClaims / claimsLast5y).toFixed(2)) : 0;

  // Age band
  let ageBand = '65+';
  const age = cleanDriver.age;
  if (age <= 24) ageBand = '18-24';
  else if (age <= 34) ageBand = '25-34';
  else if (age <= 49) ageBand = '35-49';
  else if (age <= 64) ageBand = '50-64';

  // Experience band
  let experienceBand = '10+';
  const exp = cleanDriver.driving_experience_years;
  if (exp < 2) experienceBand = '<2';
  else if (exp <= 5) experienceBand = '2-5';
  else if (exp <= 10) experienceBand = '5-10';

  // Vehicle Risk Class
  // "high" for two_wheeler sports_bike/cruiser and heavy_truck/bus,
  // "medium" for other two_wheelers, three_wheelers and commercial vehicles,
  // "low" for private cars
  let vehicleRiskClass = 'low';
  const cat = cleanVehicle.category;
  const sub = cleanVehicle.subtype;
  if (
    (cat === 'two_wheeler' && (sub === 'sports_bike' || sub === 'cruiser')) ||
    sub === 'heavy_truck' ||
    sub === 'bus'
  ) {
    vehicleRiskClass = 'high';
  } else if (cat === 'two_wheeler' || cat === 'three_wheeler' || cat === 'commercial' || cleanVehicle.usage === 'commercial') {
    vehicleRiskClass = 'medium';
  } else {
    vehicleRiskClass = 'low';
  }

  const hasTelematics = cleanRiskFactors.telematics_score !== null;

  const facts = {
    isFirstTimeBuyer,
    priorInsuranceYears,
    claimsPerYear,
    avgClaimAmountInr,
    claimToVehicleValuePct,
    monthsSinceLastClaim,
    atFaultRatio,
    ageBand,
    experienceBand,
    vehicleRiskClass,
    hasTelematics,
  };

  return { cleanRecord, facts, warnings };
}
