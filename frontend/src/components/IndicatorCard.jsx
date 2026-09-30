// src/components/IndicatorCard.jsx — Individual indicator card with severity badge & fact
import React from 'react';

const SEVERITY_CONFIG = {
  high: {
    badge: 'bg-rose-50 text-rose-700 border-rose-200',
    border: 'border-rose-200/60',
    glow: 'hover:border-rose-300',
    label: 'High Severity',
    iconColor: 'text-rose-600',
    iconBg: 'bg-rose-100/70',
  },
  medium: {
    badge: 'bg-amber-50 text-amber-700 border-amber-200',
    border: 'border-amber-200/60',
    glow: 'hover:border-amber-300',
    label: 'Medium Severity',
    iconColor: 'text-amber-600',
    iconBg: 'bg-amber-100/70',
  },
  low: {
    badge: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    border: 'border-emerald-200/60',
    glow: 'hover:border-emerald-300',
    label: 'Low Severity',
    iconColor: 'text-emerald-600',
    iconBg: 'bg-emerald-100/70',
  },
  info: {
    badge: 'bg-sky-50 text-sky-700 border-sky-200',
    border: 'border-sky-200/60',
    glow: 'hover:border-sky-300',
    label: 'Info / No Prior History',
    iconColor: 'text-sky-600',
    iconBg: 'bg-sky-100/70',
  },
};

function getIndicatorIcon(key) {
  switch (key) {
    case 'vehicle':
      return (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M8 7h8m-8 4h8m-9 8h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      );
    case 'claims':
      return (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      );
    case 'violations':
      return (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      );
    case 'driver':
      return (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      );
    case 'history':
    default:
      return (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      );
  }
}

export default function IndicatorCard({ indicator, isTopWeighted = false, orderIndex = 1 }) {
  if (!indicator) return null;

  const severityKey = (indicator.severity || 'low').toLowerCase();
  const config = SEVERITY_CONFIG[severityKey] || SEVERITY_CONFIG.low;

  return (
    <div
      className={`relative bg-white rounded-xl border ${
        isTopWeighted ? 'border-indigo-400 ring-2 ring-indigo-50 shadow-sm' : config.border
      } p-4 transition-all duration-200 ${config.glow}`}
    >
      <div className="flex items-start justify-between gap-3 mb-2.5">
        <div className="flex items-center gap-3">
          <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${config.iconBg} ${config.iconColor}`}>
            {getIndicatorIcon(indicator.key)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                0{orderIndex}
              </span>
              <h4 className="text-sm font-bold text-slate-800 tracking-tight">
                {indicator.title}
              </h4>
            </div>
            {indicator.sourceFields && indicator.sourceFields.length > 0 && (
              <span className="text-[10px] text-slate-400 font-mono">
                {indicator.sourceFields.join(', ')}
              </span>
            )}
          </div>
        </div>

        <div className="flex flex-col items-end gap-1">
          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold border ${config.badge}`}>
            {indicator.severity?.toUpperCase()}
          </span>

          {isTopWeighted && (
            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 px-1.5 py-0.5 rounded">
              ★ Key Risk Driver
            </span>
          )}
        </div>
      </div>

      {/* Fact Statement */}
      <p className="text-xs md:text-sm text-slate-600 font-normal leading-relaxed pl-12">
        {indicator.fact}
      </p>
    </div>
  );
}
