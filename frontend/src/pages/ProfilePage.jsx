// src/pages/ProfilePage.jsx — Underwriter Risk Profile Dashboard
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useRiskProfile } from '../hooks/useRiskProfile';
import { maskLicense, humanize } from '../utils/format';

import RiskGauge from '../components/RiskGauge';
import SummaryCard from '../components/SummaryCard';
import IndicatorList from '../components/IndicatorList';
import CustomerInfoCard from '../components/CustomerInfoCard';
import VehicleCard from '../components/VehicleCard';
import ClaimSummary from '../components/ClaimSummary';
import FresherBanner from '../components/FresherBanner';
import LoadingSteps from '../components/LoadingSteps';
import ErrorState from '../components/ErrorState';

export default function ProfilePage() {
  const { licenseNumber } = useParams();
  const { status, data, error, refetch } = useRiskProfile(licenseNumber);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
      {/* Top Navigation Bar */}
      <header className="border-b border-slate-200/80 bg-white sticky top-0 z-30 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              to="/"
              className="no-print p-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
              title="Return to License Search"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </Link>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-bold text-slate-900 leading-tight">
                  SureRisk Underwriting Analysis
                </h1>
                <span className="hidden sm:inline-block px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-slate-100 text-slate-600 font-semibold">
                  {maskLicense(licenseNumber)}
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Automated Risk Profile & Underwriting Decision Support
              </p>
            </div>
          </div>

          {/* Action buttons on Top Bar */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={handlePrint}
              type="button"
              className="no-print inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded-xl shadow-2xs transition-colors"
            >
              <svg className="w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
              </svg>
              <span>Print Summary</span>
            </button>

            <Link
              to="/"
              className="no-print hidden sm:inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs transition-colors"
            >
              <span>New Search</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Body */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {status === 'loading' && (
          <LoadingSteps licenseNumber={licenseNumber} />
        )}

        {status === 'error' && (
          <ErrorState
            error={error}
            licenseNumber={licenseNumber}
            onRetry={refetch}
          />
        )}

        {status === 'success' && data && (
          <div className="space-y-6">
            {/* Header Identity Bar */}
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-3">
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                    {data.customer?.name || 'Insured Applicant'}
                  </h2>
                  <span className="font-mono text-xs sm:text-sm bg-slate-100 px-2.5 py-1 rounded-lg text-slate-700 font-semibold">
                    {maskLicense(data.customer?.licenseNumber || licenseNumber)}
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500 mt-1.5 font-medium">
                  <span>Age: <strong className="text-slate-700">{data.customer?.age || '—'} yrs</strong></span>
                  <span>•</span>
                  <span>Occupation: <strong className="text-slate-700">{humanize(data.customer?.occupation)}</strong></span>
                  <span>•</span>
                  <span>Territory: <strong className="text-slate-700">{humanize(data.customer?.cityTier)}</strong></span>
                  <span>•</span>
                  <span>Customer ID: <strong className="text-slate-700 font-mono">{data.customer?.customerId}</strong></span>
                </div>
              </div>

              {/* Refresh / Re-evaluate button */}
              <button
                onClick={refetch}
                type="button"
                className="no-print self-start sm:self-center inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-indigo-600 bg-slate-50 hover:bg-indigo-50/50 px-3 py-2 rounded-xl border border-slate-200 transition-colors"
                title="Re-run assessment pipeline"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <span>Re-score</span>
              </button>
            </div>

            {/* Offline demo notification if served from local cache */}
            {data.meta?.isOfflineDemo && (
              <div className="bg-amber-50 border border-amber-200 text-amber-900 rounded-xl p-3 text-xs flex items-center justify-between">
                <span>
                  <strong>Demo Mode active:</strong> Backend server at {import.meta.env.VITE_API_URL || 'http://localhost:5000/api'} is offline. Displaying pre-seeded benchmark response.
                </span>
                <span className="font-semibold uppercase text-[10px] bg-amber-200/80 px-2 py-0.5 rounded">
                  Mock Fallback
                </span>
              </div>
            )}

            {/* Two Column Layout (Responsive desktop first down to 375px) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left / Main Column (7 cols on lg) */}
              <div className="lg:col-span-7 space-y-6">
                {/* Risk Gauge Card */}
                <RiskGauge risk={data.risk} />

                {/* AI Underwriter Summary */}
                <SummaryCard summary={data.summary} meta={data.meta} />

                {/* 5 Ordered Risk Indicators */}
                <IndicatorList
                  indicators={data.indicators}
                  topFactors={data.risk?.topFactors}
                />
              </div>

              {/* Right / Side Column (5 cols on lg) */}
              <div className="lg:col-span-5 space-y-6">
                {/* Fresher Notification Banner if applicable */}
                <FresherBanner insuranceHistory={data.insuranceHistory} />

                {/* Insured Vehicle Card */}
                <VehicleCard vehicle={data.vehicle} />

                {/* Demographics Card */}
                <CustomerInfoCard customer={data.customer} />

                {/* Historical Claims & NCB Card */}
                <ClaimSummary
                  insuranceHistory={data.insuranceHistory}
                  indicators={data.indicators}
                />
              </div>
            </div>

            {/* Print Only Underwriter Signature Block */}
            <div className="hidden print:block border-t border-slate-300 pt-6 mt-8">
              <div className="grid grid-cols-2 gap-8 text-xs text-slate-700">
                <div>
                  <div className="border-b border-slate-400 pb-8 mb-2"></div>
                  <p className="font-bold">Underwriter Signature & Stamp</p>
                  <p className="text-slate-500">Date: {new Date().toLocaleDateString('en-IN')}</p>
                </div>
                <div>
                  <div className="border-b border-slate-400 pb-8 mb-2"></div>
                  <p className="font-bold">Branch / Audit Reviewer</p>
                  <p className="text-slate-500">Decision Support System Verified</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer Line with Latency Breakdown & Model Version */}
      <footer className="border-t border-slate-200/80 bg-white py-3.5 px-4 sm:px-6 lg:px-8 mt-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2 font-mono">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>Model: {data?.risk?.modelVersion || 'mock-rules-0.1'}</span>
            <span className="text-slate-300">|</span>
            <span>ML Mode: {data?.meta?.mlMode || 'mock'}</span>
          </div>

          {data?.meta?.latencyMs ? (
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-slate-500">
              <span className="font-semibold text-slate-700">Latency:</span>
              <span>DB: <strong className="text-slate-900">{data.meta.latencyMs.db || 0}ms</strong></span>
              <span>ML: <strong className="text-slate-900">{data.meta.latencyMs.ml || 0}ms</strong></span>
              <span>LLM: <strong className="text-slate-900">{data.meta.latencyMs.llm || 0}ms</strong></span>
              <span>Total: <strong className="text-indigo-600">{data.meta.latencyMs.total || 0}ms</strong></span>
            </div>
          ) : (
            <div className="text-[11px] text-slate-400">
              Target Latency &lt;6s · Decision Support Engine
            </div>
          )}
        </div>
      </footer>
    </div>
  );
}
