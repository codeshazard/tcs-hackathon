// src/services/indicators.service.js — Deterministic indicator generation for 5 core parameters
import { featureToIndicator } from '../constants/featureMap.js';

export function buildIndicators({ cleanRecord, facts, ml }) {
  const driver = cleanRecord.driver || {};
  const vehicle = cleanRecord.vehicle || {};
  const claimHistory = cleanRecord.claim_history || {};
  const riskFactors = cleanRecord.risk_factors || {};
  const insHistory = cleanRecord.insurance_history || {};

  // Compute model weight for each indicator based on ml.top_factors
  const weights = {
    vehicle: 0,
    claims: 0,
    violations: 0,
    driver: 0,
    history: 0,
  };

  if (ml?.top_factors && Array.isArray(ml.top_factors)) {
    ml.top_factors.forEach((f) => {
      const indKey = featureToIndicator(f.feature);
      if (weights[indKey] !== undefined) {
        weights[indKey] += Math.abs(f.impact || 0.1);
      }
    });
  }

  // 1. Vehicle Indicator
  let vehSeverity = 'low';
  let vehFact = '';
  if (facts.vehicleRiskClass === 'high') {
    vehSeverity = 'high';
    vehFact = `${vehicle.subtype?.replace(/_/g, ' ')}, ${vehicle.engine_cc} cc: performance two-wheelers and heavy vehicles carry higher road accident severity`;
  } else if (facts.vehicleRiskClass === 'medium') {
    vehSeverity = 'medium';
    vehFact = `${vehicle.subtype?.replace(/_/g, ' ')}, ${vehicle.engine_cc} cc: commercial or multi-occupant vehicle with moderate exposure`;
  } else {
    vehSeverity = 'low';
    vehFact = `${vehicle.subtype?.replace(/_/g, ' ')}, ${vehicle.engine_cc} cc: passenger car category with standard safety profile`;
  }
  if (vehicle.has_modifications) {
    vehFact += ' (contains aftermarket modifications)';
  }

  const vehicleIndicator = {
    key: 'vehicle',
    title: 'Vehicle type',
    severity: vehSeverity,
    fact: vehFact,
    sourceFields: ['vehicle.category', 'vehicle.subtype', 'vehicle.engine_cc'],
    modelWeight: Number(weights.vehicle.toFixed(2)),
  };

  // 2. Claims Indicator
  let claimSeverity = 'low';
  let claimFact = '';
  if (facts.isFirstTimeBuyer) {
    claimSeverity = 'info';
    claimFact = 'No claim history: first-time buyer, risk assessed on vehicle and driver profile';
  } else if (claimHistory.claims_last_5y >= 3 || claimHistory.at_fault_claims >= 2) {
    claimSeverity = 'high';
    claimFact = `${claimHistory.claims_last_5y} claims in last 5 years (${claimHistory.at_fault_claims} at-fault) totaling ₹${claimHistory.total_claim_amount_inr?.toLocaleString('en-IN')}`;
  } else if (claimHistory.claims_last_5y >= 1) {
    claimSeverity = 'medium';
    claimFact = `${claimHistory.claims_last_5y} claim in last 5 years totaling ₹${claimHistory.total_claim_amount_inr?.toLocaleString('en-IN')}`;
  } else {
    claimSeverity = 'low';
    claimFact = '0 claims filed in the last 5 years with a clean loss history';
  }

  const claimsIndicator = {
    key: 'claims',
    title: 'Claim history',
    severity: claimSeverity,
    fact: claimFact,
    sourceFields: ['claim_history.claims_last_5y', 'claim_history.at_fault_claims', 'claim_history.total_claim_amount_inr'],
    modelWeight: Number(weights.claims.toFixed(2)),
  };

  // 3. Violations Indicator
  let violSeverity = 'low';
  let violFact = '';
  if (riskFactors.license_suspended) {
    violSeverity = 'high';
    violFact = `License currently or previously suspended with ${riskFactors.traffic_violations_3y} traffic violations in 3 years`;
  } else if (riskFactors.traffic_violations_3y >= 2) {
    violSeverity = 'high';
    violFact = `${riskFactors.traffic_violations_3y} recorded traffic violations over the past 3 years`;
  } else if (riskFactors.traffic_violations_3y === 1) {
    violSeverity = 'medium';
    violFact = '1 recorded traffic violation over the past 3 years';
  } else {
    violSeverity = 'low';
    violFact = '0 traffic violations recorded in the past 3 years';
  }

  const violationsIndicator = {
    key: 'violations',
    title: 'Traffic violations',
    severity: violSeverity,
    fact: violFact,
    sourceFields: ['risk_factors.traffic_violations_3y', 'risk_factors.license_suspended'],
    modelWeight: Number(weights.violations.toFixed(2)),
  };

  // 4. Driver Indicator
  let driverSeverity = 'low';
  let driverFact = '';
  if (driver.age < 25 && driver.driving_experience_years < 2) {
    driverSeverity = 'high';
    driverFact = `Age ${driver.age} with ${driver.driving_experience_years} years driving experience in ${driver.city_tier} city tier`;
  } else if (driver.age < 30 || driver.driving_experience_years < 4 || driver.city_tier === 'metro') {
    driverSeverity = 'medium';
    driverFact = `Age ${driver.age} with ${driver.driving_experience_years} years driving experience in ${driver.city_tier} conditions`;
  } else {
    driverSeverity = 'low';
    driverFact = `Age ${driver.age} with ${driver.driving_experience_years} years experience in ${driver.city_tier} conditions`;
  }

  const driverIndicator = {
    key: 'driver',
    title: 'Driver profile',
    severity: driverSeverity,
    fact: driverFact,
    sourceFields: ['driver.age', 'driver.driving_experience_years', 'driver.city_tier'],
    modelWeight: Number(weights.driver.toFixed(2)),
  };

  // 5. History Indicator
  let histSeverity = 'low';
  let histFact = '';
  if (facts.isFirstTimeBuyer) {
    histSeverity = 'info';
    histFact = 'First-time insurance applicant with no prior policy history (0% NCB baseline)';
  } else if (riskFactors.previous_policy_lapse) {
    histSeverity = 'high';
    histFact = `Prior policy lapse recorded with ${riskFactors.ncb_percent}% No Claim Bonus after ${insHistory.prior_insurance_years} years tenure`;
  } else if (riskFactors.ncb_percent >= 35) {
    histSeverity = 'low';
    histFact = `${insHistory.prior_insurance_years} years continuous insurance holding ${riskFactors.ncb_percent}% No Claim Bonus`;
  } else {
    histSeverity = 'medium';
    histFact = `${insHistory.prior_insurance_years} years policy history holding ${riskFactors.ncb_percent}% No Claim Bonus`;
  }

  const historyIndicator = {
    key: 'history',
    title: 'Insurance history',
    severity: histSeverity,
    fact: histFact,
    sourceFields: ['insurance_history.prior_insurance_years', 'risk_factors.ncb_percent', 'risk_factors.previous_policy_lapse'],
    modelWeight: Number(weights.history.toFixed(2)),
  };

  // Strictly 5 items in this order: vehicle, claims, violations, driver, history
  return [
    vehicleIndicator,
    claimsIndicator,
    violationsIndicator,
    driverIndicator,
    historyIndicator,
  ];
}
