// src/services/mockScorer.js — Deterministic rule-based scorer matching Section 4.2 spec

export function scoreCustomer(record) {
  const driver = record.driver || {};
  const vehicle = record.vehicle || {};
  const insHistory = record.insurance_history || {};
  const claimHistory = record.claim_history || {};
  const riskFactors = record.risk_factors || {};

  const isFirstTime = Boolean(insHistory.is_first_time_buyer);

  // Base points
  let score = 18;
  const factorContributions = [];

  // Vehicle Category points
  let vehPoints = 0;
  const cat = (vehicle.category || '').toLowerCase();
  if (cat === 'two_wheeler') {
    vehPoints += 10;
  } else if (cat === 'commercial') {
    vehPoints += 9;
  } else if (cat === 'three_wheeler') {
    vehPoints += 6;
  }
  factorContributions.push({
    feature: 'vehicle_category',
    value: vehicle.category,
    points: vehPoints,
  });

  // Vehicle Subtype points
  let subPoints = 0;
  const sub = (vehicle.subtype || '').toLowerCase();
  if (sub === 'sports_bike') subPoints += 9;
  else if (sub === 'cruiser') subPoints += 4;
  else if (sub === 'heavy_truck') subPoints += 6;
  else if (sub === 'bus') subPoints += 5;
  else if (sub === 'luxury') subPoints += 5;
  else if (sub === 'suv') subPoints += 2;

  factorContributions.push({
    feature: 'vehicle_subtype',
    value: vehicle.subtype,
    points: subPoints,
  });

  // First time buyer vehicle weight adjustment
  if (isFirstTime) {
    const extraVeh = (vehPoints + subPoints) * 0.4 + 5;
    score += extraVeh;
    factorContributions.push({
      feature: 'insurance_history_is_first_time_buyer',
      value: true,
      points: Math.round(extraVeh * 10) / 10,
    });
  }
  score += vehPoints + subPoints;

  // City Tier
  const tier = (driver.city_tier || '').toLowerCase();
  let cityPoints = 0;
  if (tier === 'metro') cityPoints = 6;
  else if (tier === 'tier2') cityPoints = 3;
  else if (tier === 'rural') cityPoints = -2;
  score += cityPoints;
  factorContributions.push({
    feature: 'driver_city_tier',
    value: driver.city_tier,
    points: cityPoints,
  });

  // Age
  const age = Number(driver.age) || 30;
  let agePoints = 0;
  if (age < 25) agePoints = 14;
  else if (age < 30) agePoints = 6;
  else if (age > 62) agePoints = 5;
  score += agePoints;
  factorContributions.push({
    feature: 'driver_age',
    value: age,
    points: agePoints,
  });

  // Driving Experience
  const exp = Number(driver.driving_experience_years) || 0;
  let expPoints = 0;
  if (exp < 2) expPoints = 10;
  else if (exp < 5) expPoints = 4;
  score += expPoints;
  factorContributions.push({
    feature: 'driver_driving_experience_years',
    value: exp,
    points: expPoints,
  });

  // Vehicle Modification
  if (vehicle.has_modifications) {
    score += 6;
    factorContributions.push({
      feature: 'vehicle_has_modifications',
      value: true,
      points: 6,
    });
  }

  // Claims
  if (!isFirstTime) {
    const claims = Math.min(5, Number(claimHistory.claims_last_5y) || 0);
    const atFault = Number(claimHistory.at_fault_claims) || 0;
    const claimPoints = claims * 6 + atFault * 4;
    score += claimPoints;
    factorContributions.push({
      feature: 'claim_history_claims_last_5y',
      value: claimHistory.claims_last_5y || 0,
      points: claimPoints,
    });
  }

  // Traffic Violations
  const violations = Number(riskFactors.traffic_violations_3y) || 0;
  if (violations > 0) {
    const violPoints = violations * 3.5;
    score += violPoints;
    factorContributions.push({
      feature: 'risk_factors_traffic_violations_3y',
      value: violations,
      points: violPoints,
    });
  }

  // License Suspended
  if (riskFactors.license_suspended) {
    score += 12;
    factorContributions.push({
      feature: 'risk_factors_license_suspended',
      value: true,
      points: 12,
    });
  }

  // Policy Lapse
  if (!isFirstTime && riskFactors.previous_policy_lapse) {
    score += 5;
    factorContributions.push({
      feature: 'risk_factors_previous_policy_lapse',
      value: true,
      points: 5,
    });
  }

  // Night driving
  const nightPct = Number(riskFactors.night_driving_pct) || 0;
  if (nightPct > 0) {
    const nightPoints = nightPct * 0.15;
    score += nightPoints;
  }

  // NCB discount
  if (!isFirstTime) {
    const ncb = Number(riskFactors.ncb_percent) || 0;
    const ncbPoints = ncb * -0.1;
    score += ncbPoints;
    factorContributions.push({
      feature: 'risk_factors_ncb_percent',
      value: ncb,
      points: ncbPoints,
    });
  }

  // Clamp 0-100
  const finalScore = Math.min(100, Math.max(0, Math.round(score)));

  // Risk Tier: <35 low, <60 medium, else high
  let riskTier = 'low';
  if (finalScore >= 60) riskTier = 'high';
  else if (finalScore >= 35) riskTier = 'medium';

  // Softmax-like probability spread centered on the tier
  let probabilities;
  if (riskTier === 'high') {
    const highProb = Math.min(0.92, Math.max(0.65, 0.60 + (finalScore - 60) * 0.008));
    const rem = 1 - highProb;
    probabilities = {
      low: Number((rem * 0.15).toFixed(2)),
      medium: Number((rem * 0.85).toFixed(2)),
      high: Number(highProb.toFixed(2)),
    };
  } else if (riskTier === 'medium') {
    const medProb = 0.70;
    const isUpper = finalScore >= 48;
    probabilities = {
      low: isUpper ? 0.12 : 0.20,
      medium: medProb,
      high: isUpper ? 0.18 : 0.10,
    };
  } else {
    const lowProb = Math.min(0.95, Math.max(0.75, 0.75 + (35 - finalScore) * 0.006));
    const rem = 1 - lowProb;
    probabilities = {
      low: Number(lowProb.toFixed(2)),
      medium: Number((rem * 0.85).toFixed(2)),
      high: Number((rem * 0.15).toFixed(2)),
    };
  }

  // Top 5 factors sorted by absolute impact
  const topFactors = factorContributions
    .sort((a, b) => Math.abs(b.points) - Math.abs(a.points))
    .slice(0, 5)
    .map((f) => ({
      feature: f.feature,
      value: f.value,
      impact: Number((Math.abs(f.points) / 50).toFixed(2)),
      direction: f.points >= 0 ? 'increases_risk' : 'decreases_risk',
    }));

  return {
    risk_score: finalScore,
    risk_tier: riskTier,
    probabilities,
    top_factors: topFactors,
    model_version: 'mock-rules-0.1',
  };
}
