// src/components/CustomerInfoCard.jsx — Driver demographic and customer identity details
import React from 'react';
import { humanize, maskLicense } from '../utils/format';

export default function CustomerInfoCard({ customer }) {
  if (!customer) return null;

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-5">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
          Driver & Customer Profile
        </h3>
        <span className="text-[11px] font-mono font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
          {customer.customerId || 'ID: —'}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-y-3.5 gap-x-4 text-xs">
        <div>
          <span className="text-slate-400 block mb-0.5">Full Name</span>
          <span className="font-semibold text-slate-800 text-sm">{customer.name || '—'}</span>
        </div>

        <div>
          <span className="text-slate-400 block mb-0.5">Age</span>
          <span className="font-semibold text-slate-800 text-sm">
            {customer.age ? `${customer.age} yrs` : '—'}
          </span>
        </div>

        <div>
          <span className="text-slate-400 block mb-0.5">Driving License</span>
          <span className="font-mono font-semibold text-slate-800">
            {maskLicense(customer.licenseNumber)}
          </span>
        </div>

        <div>
          <span className="text-slate-400 block mb-0.5">City Tier</span>
          <span className="font-semibold text-slate-800">
            {humanize(customer.cityTier)}
          </span>
        </div>

        <div>
          <span className="text-slate-400 block mb-0.5">Occupation</span>
          <span className="font-semibold text-slate-800">
            {humanize(customer.occupation)}
          </span>
        </div>

        {customer.drivingExperienceYears !== undefined && (
          <div>
            <span className="text-slate-400 block mb-0.5">Experience</span>
            <span className="font-semibold text-slate-800">
              {customer.drivingExperienceYears} years
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
