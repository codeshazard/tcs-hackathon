// src/services/fallbackSummary.service.js — Deterministic template summary when LLM is unavailable

export function generateFallbackSummary({ cleanRecord, facts, risk, indicators }) {
  const driver = cleanRecord.driver || {};
  const vehicle = cleanRecord.vehicle || {};
  const claimHistory = cleanRecord.claim_history || {};
  const riskFactors = cleanRecord.risk_factors || {};

  const score = risk.score;
  const tier = risk.tier;
  const isFirstTime = facts.isFirstTimeBuyer;

  let headline = '';
  let narrative = '';
  let recommendation = '';

  const vehDesc = `${vehicle.subtype?.replace(/_/g, ' ')} (${vehicle.engine_cc} cc)`;

  if (isFirstTime) {
    if (tier === 'high') {
      headline = `High risk: first-time buyer on a ${vehDesc}`;
      narrative = `${driver.name} is a ${driver.age}-year-old first-time insurance buyer in ${driver.city_tier} operating a ${vehDesc} valued at ₹${vehicle.market_value_inr?.toLocaleString('en-IN')}. Because the applicant is a first-time buyer, there is no prior insurance or claim history, and risk is determined primarily by the vehicle category and youthful driver profile. Performance two-wheelers in high-density urban environments carry elevated collision frequency. The absence of previous policy tenure and an experience level under two years amplify exposure.`;
      recommendation = `Require higher standard deductible and anti-theft inspection; offer telematics-linked renewal.`;
    } else {
      headline = `${tier.toUpperCase()} risk: first-time buyer with ${vehDesc}`;
      narrative = `${driver.name} is a ${driver.age}-year-old first-time insurance applicant in ${driver.city_tier} operating a ${vehDesc} valued at ₹${vehicle.market_value_inr?.toLocaleString('en-IN')}. As a first-time buyer, there is no prior insurance history on file, so the assessment relies on vehicle classification and driver profile without historical loss experience. The vehicle segment presents manageable exposure for this demographic.`;
      recommendation = `Approve standard coverage with standard policy excess; offer roadside assistance rider.`;
    }
  } else {
    // Experienced driver
    if (tier === 'low') {
      headline = `Low risk: experienced driver with ${riskFactors.ncb_percent}% NCB and clean record`;
      narrative = `${driver.name} is a ${driver.age}-year-old experienced driver in ${driver.city_tier} operating a ${vehDesc} valued at ₹${vehicle.market_value_inr?.toLocaleString('en-IN')}. The applicant maintains ${facts.priorInsuranceYears} years of prior insurance history with 0 claims in the last 5 years and ${riskFactors.traffic_violations_3y} traffic violations. With ${riskFactors.ncb_percent}% No Claim Bonus earned, the driver demonstrates consistent safe vehicle operation across multiple underwriting cycles.`;
      recommendation = `Approve preferred policy renewal with maximum NCB discount and optional comprehensive riders.`;
    } else if (tier === 'high') {
      headline = `High risk: driver with ${claimHistory.claims_last_5y} claims and ${riskFactors.traffic_violations_3y} violations`;
      narrative = `${driver.name} is a ${driver.age}-year-old driver in ${driver.city_tier} operating a ${vehDesc} valued at ₹${vehicle.market_value_inr?.toLocaleString('en-IN')}. The customer has accumulated ${claimHistory.claims_last_5y} claims (${claimHistory.at_fault_claims} at-fault) over the past 5 years totaling ₹${claimHistory.total_claim_amount_inr?.toLocaleString('en-IN')}, along with ${riskFactors.traffic_violations_3y} traffic violations in the last 3 years. These elevated claim frequencies and infractions indicate significant underwriting exposure requiring premium adjustment.`;
      recommendation = `Apply high-risk underwriting loading, adjust compulsory excess, and verify vehicle condition.`;
    } else {
      headline = `Medium risk: moderate exposure with ${claimHistory.claims_last_5y} claims on ${vehDesc}`;
      narrative = `${driver.name} is a ${driver.age}-year-old motorist in ${driver.city_tier} driving a ${vehDesc} valued at ₹${vehicle.market_value_inr?.toLocaleString('en-IN')}. The applicant holds ${facts.priorInsuranceYears} years of continuous insurance coverage with ${claimHistory.claims_last_5y} claims and ${riskFactors.ncb_percent}% NCB. The operational exposure remains within standard underwriting parameters with manageable loss frequency.`;
      recommendation = `Accept at standard baseline rates with regular deductible terms.`;
    }
  }

  return {
    headline,
    narrative,
    recommendation,
    source: 'fallback',
  };
}
