// src/pages/LookupPage.jsx — Landing and search page for driving license evaluation
import React from 'react';
import LicenseSearch from '../components/LicenseSearch';

export default function LookupPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
      {/* Top Navbar */}
      <header className="border-b border-slate-200/80 bg-white sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-xs">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <div>
              <h1 className="text-base font-bold text-slate-900 leading-tight">
                SureRisk AI
              </h1>
              <span className="text-[10px] text-slate-400 font-medium">
                Automated Vehicle Insurance Risk Profile Summarizer
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-100">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-600" />
              Underwriter Edition
            </span>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12 flex flex-col justify-center">
        <LicenseSearch />
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200/80 bg-white py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-2">
          <div>
            TCS Technology Day Challenge · Insurance Underwriting Decision Support
          </div>
          <div className="flex items-center gap-4">
            <span>Deterministic Rules + ML + Verifiable LLM Narratives</span>
            <span>Target Latency: &lt;6s</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
