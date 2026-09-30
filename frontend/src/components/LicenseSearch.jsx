// src/components/LicenseSearch.jsx — Search card with auto-formatting and demo customer chips
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { normalizeLicense, isValidLicense } from '../utils/format';
import { DEMO_CUSTOMERS } from '../mocks/sampleResponse';

export default function LicenseSearch({ initialValue = '', onSearch }) {
  const [inputVal, setInputVal] = useState(initialValue);
  const [touchError, setTouchError] = useState('');
  const navigate = useNavigate();

  const cleanVal = normalizeLicense(inputVal);
  const isValid = isValidLicense(cleanVal);

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    if (!cleanVal) {
      setTouchError('Please enter a driving license number.');
      return;
    }
    if (!isValid) {
      setTouchError('License must be 15 alphanumeric characters (e.g. MH4720231551327).');
      return;
    }

    setTouchError('');
    if (onSearch) {
      onSearch(cleanVal);
    } else {
      navigate(`/profile/${cleanVal}`);
    }
  };

  const handleSelectDemo = (demo) => {
    setInputVal(demo.license);
    setTouchError('');
    if (onSearch) {
      onSearch(demo.license);
    } else {
      navigate(`/profile/${demo.license}`);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Search Input Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 text-indigo-600 mb-3">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
            Underwriter License Lookup
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-md mx-auto">
            Input a 15-character Indian Driving License to evaluate vehicle exposure, claims frequency and AI-synthesized risk profiles.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <label htmlFor="license-input" className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
              Driving License Number
            </label>
            <div className="relative flex items-center">
              <input
                id="license-input"
                type="text"
                value={inputVal}
                onChange={(e) => {
                  setInputVal(e.target.value);
                  if (touchError) setTouchError('');
                }}
                maxLength={18} // leeway for spaces/hyphens
                placeholder="e.g. MH4720231551327"
                autoComplete="off"
                spellCheck="false"
                className={`w-full px-4 py-3.5 pr-28 rounded-xl font-mono text-base uppercase font-semibold text-slate-900 placeholder:text-slate-400 border transition-all ${
                  touchError
                    ? 'border-rose-300 ring-2 ring-rose-100 focus:border-rose-500 focus:outline-none'
                    : isValid
                    ? 'border-emerald-300 ring-2 ring-emerald-50 focus:border-indigo-600 focus:outline-none'
                    : 'border-slate-300 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 focus:outline-none'
                }`}
              />

              {/* Format Badge & Clear button inside input */}
              <div className="absolute right-3 flex items-center gap-2">
                {inputVal && (
                  <button
                    type="button"
                    onClick={() => {
                      setInputVal('');
                      setTouchError('');
                    }}
                    className="text-slate-400 hover:text-slate-600 p-1"
                    title="Clear input"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}

                <span
                  className={`text-[11px] font-mono font-medium px-2 py-0.5 rounded ${
                    isValid
                      ? 'bg-emerald-100 text-emerald-800'
                      : cleanVal.length === 15
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  {cleanVal.length}/15
                </span>
              </div>
            </div>

            {touchError && (
              <p className="text-xs text-rose-600 mt-1.5 flex items-center gap-1 font-medium">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {touchError}
              </p>
            )}

            <p className="text-[11px] text-slate-400 mt-1.5">
              Standard format: <span className="font-mono font-medium text-slate-600">State(2)</span> + <span className="font-mono font-medium text-slate-600">RTO(2)</span> + <span className="font-mono font-medium text-slate-600">Year(4)</span> + <span className="font-mono font-medium text-slate-600">Serial(7)</span>
            </p>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-semibold text-sm shadow-md hover:shadow-lg transition-all duration-150 flex items-center justify-center gap-2"
          >
            <span>Evaluate Risk Profile</span>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </button>
        </form>
      </div>

      {/* Demo Customer Chips Section */}
      <div className="mt-8">
        <div className="flex items-center justify-between mb-3 px-1">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Or try a demo customer benchmark
          </span>
          <span className="text-[11px] text-slate-400">Click to assess instantly</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {DEMO_CUSTOMERS.map((demo) => {
            const tierBadgeColor =
              demo.expectedTier === 'high'
                ? 'bg-rose-50 text-rose-700 border-rose-200'
                : demo.expectedTier === 'medium'
                ? 'bg-amber-50 text-amber-700 border-amber-200'
                : 'bg-emerald-50 text-emerald-700 border-emerald-200';

            return (
              <button
                key={demo.license}
                type="button"
                onClick={() => handleSelectDemo(demo)}
                className="text-left bg-white hover:bg-indigo-50/50 border border-slate-200 hover:border-indigo-300 rounded-xl p-3 transition-all duration-150 group shadow-2xs flex flex-col justify-between"
              >
                <div className="flex items-center justify-between w-full mb-1">
                  <span className="font-semibold text-xs text-slate-900 group-hover:text-indigo-600 transition-colors">
                    {demo.name}
                  </span>
                  <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full border ${tierBadgeColor}`}>
                    {demo.expectedTier} ({demo.expectedScore})
                  </span>
                </div>

                <div className="text-[11px] text-slate-500 mb-1.5">
                  {demo.scenario} · <span className="text-slate-700 font-medium">{demo.vehicle}</span>
                </div>

                <div className="font-mono text-[10px] text-slate-400 group-hover:text-indigo-500 transition-colors">
                  {demo.license} →
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
