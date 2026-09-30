// src/components/SummaryCard.jsx — Executive underwriting narrative card
import React, { useState } from 'react';

export default function SummaryCard({ summary, meta }) {
  const [copied, setCopied] = useState(false);

  if (!summary) return null;

  const isFallback = summary.source === 'fallback' || meta?.isFallbackSummary;

  const handleCopy = () => {
    const fullText = `UNDERWRITING SUMMARY\n${summary.headline}\n\n${summary.narrative}\n\nRecommendation: ${summary.recommendation}`;
    navigator.clipboard.writeText(fullText).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 relative">
      {/* Top badges and actions */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-4 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-semibold">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Underwriter Assessment
          </span>

          {isFallback ? (
            <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-amber-50 text-amber-800 border border-amber-200">
              Template Summary
            </span>
          ) : (
            <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-600">
              AI-generated · decision support
            </span>
          )}
        </div>

        <button
          onClick={handleCopy}
          type="button"
          className="no-print inline-flex items-center gap-1 text-xs font-medium text-slate-500 hover:text-indigo-600 transition-colors py-1 px-2 rounded hover:bg-slate-50"
          title="Copy narrative to clipboard"
        >
          {copied ? (
            <>
              <svg className="w-3.5 h-3.5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-emerald-600">Copied</span>
            </>
          ) : (
            <>
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              <span>Copy</span>
            </>
          )}
        </button>
      </div>

      {/* Headline */}
      <h2 className="text-lg md:text-xl font-bold text-slate-900 leading-snug tracking-tight mb-3">
        {summary.headline}
      </h2>

      {/* Narrative */}
      <p className="text-slate-600 leading-relaxed text-sm md:text-base font-normal mb-5 whitespace-pre-line">
        {summary.narrative}
      </p>

      {/* Recommendation Block */}
      {summary.recommendation && (
        <div className="bg-slate-50 rounded-xl p-4 border-l-4 border-indigo-600">
          <div className="flex items-center gap-2 mb-1">
            <svg className="w-4 h-4 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-800">
              Underwriting Recommendation
            </span>
          </div>
          <p className="text-sm text-slate-700 font-medium">
            {summary.recommendation}
          </p>
        </div>
      )}
    </div>
  );
}
