// src/components/RiskGauge.jsx — 0-100 semicircle SVG risk gauge
import React from 'react';
import TierBadge from './TierBadge';
import { formatPercent } from '../utils/format';

export default function RiskGauge({ risk }) {
  if (!risk) return null;

  const score = Math.min(100, Math.max(0, Math.round(risk.score || 0)));
  const tier = (risk.tier || 'low').toLowerCase();
  const probabilities = risk.probabilities || { low: 0, medium: 0, high: 0 };

  // Tier color mapping
  const tierColors = {
    low: {
      stroke: '#10b981', // emerald-500
      text: 'text-emerald-700',
      fillBg: '#ecfdf5',
    },
    medium: {
      stroke: '#f59e0b', // amber-500
      text: 'text-amber-700',
      fillBg: '#fffbeb',
    },
    high: {
      stroke: '#ef4444', // red-500
      text: 'text-rose-700',
      fillBg: '#fef2f2',
    },
  };

  const currentColor = tierColors[tier] || tierColors.medium;

  // Arc calculation for semicircle
  // Radius = 85, center at (100, 95)
  // Arc length for semicircle: PI * R = 3.14159 * 85 ~= 267.03
  const radius = 80;
  const strokeWidth = 14;
  const arcLength = Math.PI * radius; // 251.32
  const progressLength = (score / 100) * arcLength;
  const strokeDashoffset = arcLength - progressLength;

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 flex flex-col items-center">
      <div className="w-full flex items-center justify-between mb-2">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
          Underwriting Risk Score
        </h3>
        <TierBadge tier={tier} size="md" />
      </div>

      {/* SVG Semicircle Gauge */}
      <div className="relative w-64 h-36 flex items-end justify-center mt-2">
        <svg
          viewBox="0 0 200 115"
          className="w-full h-full overflow-visible"
        >
          {/* Background track */}
          <path
            d="M 20 100 A 80 80 0 0 1 180 100"
            fill="none"
            stroke="#f1f5f9"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />

          {/* Reference tick marks at 35 (low/med) and 60 (med/high) */}
          {/* 35% angle: 180 - (35 * 1.8) = 117 deg */}
          {/* 60% angle: 180 - (60 * 1.8) = 72 deg */}

          {/* Active colored arc */}
          <path
            d="M 20 100 A 80 80 0 0 1 180 100"
            fill="none"
            stroke={currentColor.stroke}
            strokeWidth={strokeWidth}
            strokeDasharray={arcLength}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
        </svg>

        {/* Center score readout */}
        <div className="absolute inset-x-0 bottom-1 flex flex-col items-center pointer-events-none">
          <div className="flex items-baseline gap-1">
            <span className={`text-4xl font-extrabold tracking-tight ${currentColor.text}`}>
              {score}
            </span>
            <span className="text-slate-400 font-medium text-sm">/ 100</span>
          </div>
          <span className="text-[11px] text-slate-500 uppercase tracking-widest font-semibold mt-0.5">
            {tier} Risk Range
          </span>
        </div>
      </div>

      {/* Threshold indicator helper */}
      <div className="w-full flex justify-between text-[11px] text-slate-400 px-4 mt-2 font-mono">
        <span>0 (Safe)</span>
        <span>35</span>
        <span>60</span>
        <span>100 (Critical)</span>
      </div>

      {/* Probabilities Distribution */}
      <div className="w-full mt-5 pt-4 border-t border-slate-100">
        <div className="flex items-center justify-between text-xs text-slate-600 mb-2">
          <span className="font-semibold text-slate-700">Model Probability Spread</span>
          <span className="text-[11px] text-slate-400">softmax confidence</span>
        </div>

        {/* Split progress bar */}
        <div className="h-2.5 w-full bg-slate-100 rounded-full flex overflow-hidden">
          <div
            style={{ width: `${(probabilities.low || 0) * 100}%` }}
            className="bg-emerald-500 transition-all duration-700"
            title={`Low Risk: ${formatPercent(probabilities.low, true)}`}
          />
          <div
            style={{ width: `${(probabilities.medium || 0) * 100}%` }}
            className="bg-amber-400 transition-all duration-700"
            title={`Medium Risk: ${formatPercent(probabilities.medium, true)}`}
          />
          <div
            style={{ width: `${(probabilities.high || 0) * 100}%` }}
            className="bg-rose-500 transition-all duration-700"
            title={`High Risk: ${formatPercent(probabilities.high, true)}`}
          />
        </div>

        {/* Legend */}
        <div className="grid grid-cols-3 gap-2 mt-2.5 text-center text-xs">
          <div className="bg-emerald-50/70 border border-emerald-100 rounded-lg py-1 px-1.5">
            <div className="text-[10px] text-slate-500 uppercase font-medium">Low</div>
            <div className="font-bold text-emerald-800">
              {formatPercent(probabilities.low, true)}
            </div>
          </div>
          <div className="bg-amber-50/70 border border-amber-100 rounded-lg py-1 px-1.5">
            <div className="text-[10px] text-slate-500 uppercase font-medium">Medium</div>
            <div className="font-bold text-amber-800">
              {formatPercent(probabilities.medium, true)}
            </div>
          </div>
          <div className="bg-rose-50/70 border border-rose-100 rounded-lg py-1 px-1.5">
            <div className="text-[10px] text-slate-500 uppercase font-medium">High</div>
            <div className="font-bold text-rose-800">
              {formatPercent(probabilities.high, true)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
