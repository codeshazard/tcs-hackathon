// src/services/riskProfile.service.js — 7-step risk profile pipeline orchestrator
import { validateLicense } from '../validators/license.validator.js';
import { findByLicense } from './customer.service.js';
import { preprocess } from './preprocessing.service.js';
import { predict } from './mlClient.service.js';
import { buildIndicators } from './indicators.service.js';
import { buildSummaryPrompt } from '../prompts/summaryPrompt.js';
import { generateJson } from './llm.service.js';
import { generateFallbackSummary } from './fallbackSummary.service.js';
import { LatencyTimer } from '../utils/timer.js';
import { env } from '../config/env.js';

export async function getRiskProfileForLicense(rawLicense) {
  const timer = new LatencyTimer();

  // 1. Validate Driving License
  const cleanLicense = validateLicense(rawLicense);

  // 2. Database Lookup
  const rawRecord = await timer.measure('db', async () => {
    return await findByLicense(cleanLicense);
  });

  // 3. Preprocessing & Derived Facts
  const { cleanRecord, facts } = preprocess(rawRecord);

  // 4. ML Model Scoring (Mock or Remote)
  const mlResult = await timer.measure('ml', async () => {
    return await predict(cleanRecord);
  });

  const risk = {
    score: mlResult.risk_score,
    tier: mlResult.risk_tier,
    probabilities: mlResult.probabilities,
    modelVersion: mlResult.model_version,
    topFactors: (mlResult.top_factors || []).map((f) => ({
      feature: f.feature,
      value: f.value,
      impact: f.impact,
      direction: f.direction,
    })),
  };

  // 5. Build the 5 Canonical Indicators
  const indicators = buildIndicators({
    cleanRecord,
    facts,
    ml: mlResult,
  });

  // 6. Generate LLM Narrative (with Template Fallback)
  let summary = null;
  let isFallbackSummary = false;

  const promptBundle = buildSummaryPrompt({
    cleanRecord,
    facts,
    risk,
    indicators,
  });

  try {
    summary = await timer.measure('llm', async () => {
      const generated = await generateJson(promptBundle);
      return {
        ...generated,
        source: 'llm',
      };
    });
  } catch (err) {
    console.warn(`[RiskProfile] LLM generation failed (${err.message}). Using verified template fallback.`);
    isFallbackSummary = true;
    summary = generateFallbackSummary({
      cleanRecord,
      facts,
      risk,
      indicators,
    });
  }

  // 7. Assemble Exact Public API Response
  const latencies = timer.getResults();

  const responsePayload = {
    customer: {
      customerId: cleanRecord.customer_id,
      licenseNumber: cleanRecord.driver?.driving_license_number,
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
      ageYears: cleanRecord.vehicle?.vehicle_age_years,
      marketValueInr: cleanRecord.vehicle?.market_value_inr,
      usage: cleanRecord.vehicle?.usage,
      hasModifications: cleanRecord.vehicle?.has_modifications,
      fuelType: cleanRecord.vehicle?.fuel_type,
    },
    insuranceHistory: {
      isFirstTimeBuyer: facts.isFirstTimeBuyer,
      priorInsuranceYears: facts.priorInsuranceYears,
      ncbPercent: cleanRecord.risk_factors?.ncb_percent,
      claimsLast5y: cleanRecord.claim_history?.claims_last_5y,
      atFaultClaims: cleanRecord.claim_history?.at_fault_claims,
    },
    risk,
    indicators,
    summary,
    meta: {
      isFallbackSummary,
      mlMode: env.mlMode,
      latencyMs: latencies,
    },
  };

  return responsePayload;
}
