// src/components/ClaimSummary.jsx — Historical insurance and claims record summary
import React from 'react';
import { formatCurrencyINR, formatPercent } from '../utils/format';

export default function ClaimSummary({ insuranceHistory, indicators = [] }) {
  if (!insuranceHistory) return null;

  // Find claims and history indicators if available for fast fact extraction
  const claimsIndicator = indicators.find((i) => i.key === 'claims');
  const violationsIndicator = indicators.find((i) => i.key === 'violations');

  const isFresher = insuranceHistory.isFirstTimeBuyer;

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-5">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
          Claims & Insurance History
        </h3>
        <span
          className={`text-[11px] font-semibold px-2 py-0.5 rounded ${
            isFresher
              ? 'bg-sky-50 text-sky-700 border border-sky-200'
              : 'bg-slate-100 text-slate-700'
          }`}
        >
          {isFresher ? 'New Policyholder' : `${insuranceHistory.priorInsuranceYears || 0} Years Tenured`}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-y-3.5 gap-x-4 text-xs">
        <div>
          <span className="text-slate-400 block mb-0.5">Prior Policy Tenure</span>
          <span className="font-semibold text-slate-800">
            {isFresher ? '0 years (Fresher)' : `${insuranceHistory.priorInsuranceYears} years`}
          </span>
        </div>

        <div>
          <span className="text-slate-400 block mb-0.5">No Claim Bonus (NCB)</span>
          <span className="font-semibold text-slate-900 font-mono">
            {insuranceHistory.ncbPercent !== undefined
              ? formatPercent(insuranceHistory.ncbPercent)
              : isFresher
              ? '0%'
              : '—'}
          </span>
        </div>

        <div>
          <span className="text-slate-400 block mb-0.5">Claims (Last 5 Yrs)</span>
          <span className="font-semibold text-slate-800">
            {isFresher ? '0 (No History)' : insuranceHistory.claimsLast5y ?? '0'}
          </span>
        </div>

        <div>
          <span className="text-slate-400 block mb-0.5">At-Fault Incidents</span>
          <span
            className={`font-semibold ${
              (insuranceHistory.atFaultClaims || 0) > 0
                ? 'text-rose-600'
                : 'text-slate-800'
            }`}
          >
            {insuranceHistory.atFaultClaims ?? (isFresher ? '0' : '0')}
          </span>
        </div>
      </div>

      {/* Snapshot notes */}
      {claimsIndicator?.fact && (
        <div className="mt-3.5 pt-3 border-t border-slate-100 text-[11px] text-slate-500 leading-normal">
          <span className="font-semibold text-slate-700">Claims Log: </span>
          {claimsIndicator.fact}
        </div>
      )}
    </div>
  );
}
