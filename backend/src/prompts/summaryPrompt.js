// src/prompts/summaryPrompt.js — Underwriting summary prompts for LLM

export function buildSummaryPrompt({ cleanRecord, facts, risk, indicators }) {
  const systemPrompt = `You write underwriting risk summaries for vehicle insurance policies.
Strict Rules:
1. Use ONLY the verified facts and numbers provided in the input JSON.
2. NEVER invent, extrapolate, or alter any numbers, claims, violations, or INR amounts.
3. If isFirstTimeBuyer is true: you MUST state explicitly that there is no prior insurance or claims history, and that assessment is based on vehicle classification and driver demographic. You must NEVER describe a first-time buyer's record as "clean".
4. Explicitly state the risk tier and risk score.
5. Lead with the top 2-3 risk drivers identified in topFactors and indicators.
6. Maintain an objective, neutral, professional tone suitable for senior insurance underwriters.
7. Return ONLY valid JSON with no markdown fences, no surrounding commentary, adhering to this exact schema:
{
  "headline": "Underwriter headline (maximum 12 words)",
  "narrative": "Cohesive professional risk narrative (between 90 and 140 words)",
  "recommendation": "Actionable decision support underwriting recommendation (1 to 2 sentences)"
}`;

  const userPayload = {
    customer: {
      name: cleanRecord.driver?.name,
      age: cleanRecord.driver?.age,
      occupation: cleanRecord.driver?.occupation,
      cityTier: cleanRecord.driver?.city_tier,
      drivingExperienceYears: cleanRecord.driver?.driving_experience_years,
    },
    vehicle: {
      category: cleanRecord.vehicle?.category,
      subtype: cleanRecord.vehicle?.subtype,
      engineCc: cleanRecord.vehicle?.engine_cc,
      marketValueInr: cleanRecord.vehicle?.market_value_inr,
      hasModifications: cleanRecord.vehicle?.has_modifications,
    },
    insuranceHistory: {
      isFirstTimeBuyer: facts.isFirstTimeBuyer,
      priorInsuranceYears: facts.priorInsuranceYears,
      ncbPercent: cleanRecord.risk_factors?.ncb_percent,
    },
    claimsAndViolations: {
      claimsLast5y: cleanRecord.claim_history?.claims_last_5y,
      atFaultClaims: cleanRecord.claim_history?.at_fault_claims,
      totalClaimAmountInr: cleanRecord.claim_history?.total_claim_amount_inr,
      trafficViolations3y: cleanRecord.risk_factors?.traffic_violations_3y,
      licenseSuspended: cleanRecord.risk_factors?.license_suspended,
      policyLapse: cleanRecord.risk_factors?.previous_policy_lapse,
    },
    riskAssessment: {
      score: risk.score,
      tier: risk.tier,
      topFactors: risk.topFactors,
    },
    indicators: indicators.map((ind) => ({
      key: ind.key,
      title: ind.title,
      severity: ind.severity,
      fact: ind.fact,
    })),
  };

  const userPrompt = JSON.stringify(userPayload, null, 2);

  return { system: systemPrompt, user: userPrompt };
}
