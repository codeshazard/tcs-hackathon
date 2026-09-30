// src/components/FresherBanner.jsx — Explanatory banner for first-time insurance buyers
import React from 'react';

export default function FresherBanner({ insuranceHistory }) {
  if (!insuranceHistory?.isFirstTimeBuyer) return null;

  return (
    <div className="bg-gradient-to-r from-sky-50 via-indigo-50/40 to-slate-50 border border-sky-200 rounded-xl p-4 flex items-start gap-3.5 shadow-xs">
      <div className="w-8 h-8 rounded-full bg-sky-100 flex items-center justify-center shrink-0 text-sky-600 mt-0.5">
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>

      <div>
        <div className="flex items-center gap-2">
          <h4 className="text-sm font-bold text-sky-900">
            First-Time Insurance Applicant (Fresher)
          </h4>
          <span className="text-[10px] bg-sky-200/70 text-sky-800 font-semibold px-2 py-0.5 rounded-full">
            Zero Prior Record
          </span>
        </div>
        <p className="text-xs text-sky-800/90 mt-1 leading-relaxed">
          No prior insurance history on file. Zero claims and 0% NCB reflect a blank slate rather than a proven track record. Risk assessment is driven primarily by vehicle classification and driver demographic risk weighting.
        </p>
      </div>
    </div>
  );
}
