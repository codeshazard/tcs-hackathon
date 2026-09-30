// src/components/VehicleCard.jsx — Insured vehicle specifications card
import React from 'react';
import { humanize, formatCurrencyINR } from '../utils/format';

export default function VehicleCard({ vehicle }) {
  if (!vehicle) return null;

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-5">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
          Insured Vehicle Specs
        </h3>
        <span className="text-[11px] font-semibold text-indigo-700 bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded">
          {humanize(vehicle.category)}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-y-3.5 gap-x-4 text-xs">
        <div>
          <span className="text-slate-400 block mb-0.5">Subtype</span>
          <span className="font-semibold text-slate-800 text-sm">
            {humanize(vehicle.subtype)}
          </span>
        </div>

        <div>
          <span className="text-slate-400 block mb-0.5">Engine Capacity</span>
          <span className="font-semibold text-slate-800 text-sm">
            {vehicle.engineCc ? `${vehicle.engineCc} cc` : '—'}
          </span>
        </div>

        <div>
          <span className="text-slate-400 block mb-0.5">Vehicle Age</span>
          <span className="font-semibold text-slate-800">
            {vehicle.ageYears !== undefined ? `${vehicle.ageYears} yrs` : '—'}
          </span>
        </div>

        <div>
          <span className="text-slate-400 block mb-0.5">Market Value (IDV)</span>
          <span className="font-semibold text-slate-900 font-mono">
            {formatCurrencyINR(vehicle.marketValueInr)}
          </span>
        </div>

        <div>
          <span className="text-slate-400 block mb-0.5">Intended Usage</span>
          <span className="font-semibold text-slate-800">
            {humanize(vehicle.usage)}
          </span>
        </div>

        <div>
          <span className="text-slate-400 block mb-0.5">Modifications</span>
          <span
            className={`font-semibold inline-flex items-center px-1.5 py-0.5 rounded text-[11px] ${
              vehicle.hasModifications
                ? 'bg-rose-50 text-rose-700 border border-rose-200'
                : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
            }`}
          >
            {vehicle.hasModifications ? 'Modified' : 'Standard / OEM'}
          </span>
        </div>
      </div>
    </div>
  );
}
