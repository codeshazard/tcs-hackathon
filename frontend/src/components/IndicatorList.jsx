// src/components/IndicatorList.jsx — Container for the 5 underwriting risk indicators
import React from 'react';
import IndicatorCard from './IndicatorCard';

// Feature to indicator key mapping as per Section 4.4
const FEATURE_TO_INDICATOR = {
  vehicle_category: 'vehicle',
  vehicle_subtype: 'vehicle',
  vehicle_engine_cc: 'vehicle',
  vehicle_has_modifications: 'vehicle',
  vehicle_vehicle_age_years: 'vehicle',
  vehicle_fuel_type: 'vehicle',
  vehicle_market_value_inr: 'vehicle',
  vehicle_usage: 'vehicle',
  vehicle_annual_km: 'vehicle',

  claim_history_claims_last_5y: 'claims',
  claim_history_at_fault_claims: 'claims',
  claim_history_total_claim_amount_inr: 'claims',

  risk_factors_traffic_violations_3y: 'violations',
  risk_factors_license_suspended: 'violations',

  driver_age: 'driver',
  driver_driving_experience_years: 'driver',
  driver_occupation: 'driver',
  driver_marital_status: 'driver',
  driver_city_tier: 'driver',
  risk_factors_night_driving_pct: 'driver',
  risk_factors_telematics_score: 'driver',

  insurance_history_prior_years: 'history',
  insurance_history_is_first_time_buyer: 'history',
  risk_factors_ncb_percent: 'history',
  risk_factors_previous_policy_lapse: 'history',
};

export default function IndicatorList({ indicators = [], topFactors = [] }) {
  if (!indicators || indicators.length === 0) return null;

  // Determine which indicator keys correspond to the top 2 risk drivers
  const topKeys = new Set();
  if (topFactors && topFactors.length > 0) {
    topFactors.slice(0, 2).forEach((factor) => {
      const mappedKey = FEATURE_TO_INDICATOR[factor.feature];
      if (mappedKey) topKeys.add(mappedKey);
    });
  }

  // Ensure canonical order: vehicle, claims, violations, driver, history
  const ORDER = ['vehicle', 'claims', 'violations', 'driver', 'history'];
  const sortedIndicators = [...indicators].sort((a, b) => {
    const idxA = ORDER.indexOf(a.key);
    const idxB = ORDER.indexOf(b.key);
    return (idxA === -1 ? 99 : idxA) - (idxB === -1 ? 99 : idxB);
  });

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
            Risk Parameters & Ground Facts
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            5 key operational parameters evaluated by deterministic rules and ML model
          </p>
        </div>
        <span className="text-xs font-semibold text-slate-400 bg-slate-100 px-2.5 py-1 rounded-full">
          5 of 5 Analyzed
        </span>
      </div>

      <div className="flex flex-col gap-3">
        {sortedIndicators.map((indicator, index) => {
          const isTopWeighted = topKeys.has(indicator.key) || indicator.modelWeight > 0.15;
          return (
            <IndicatorCard
              key={indicator.key || index}
              indicator={indicator}
              isTopWeighted={isTopWeighted}
              orderIndex={index + 1}
            />
          );
        })}
      </div>
    </div>
  );
}
