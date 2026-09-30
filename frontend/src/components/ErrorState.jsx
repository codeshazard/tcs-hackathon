// src/components/ErrorState.jsx — Robust error screen handling all spec error codes
import React from 'react';
import { Link } from 'react-router-dom';

const ERROR_DETAILS = {
  INVALID_LICENSE_FORMAT: {
    title: 'Invalid Driving License Format',
    message: 'The driving license number entered does not match the 15-character standard Indian DL format (e.g. MH4720231551327). Please check the state code and year digits.',
    badge: '400 Bad Request',
  },
  LICENSE_NOT_FOUND: {
    title: 'Customer Not Found',
    message: 'No insured customer record exists in the database for this driving license number. Please verify the license or select a verified demo customer.',
    badge: '404 Not Found',
  },
  ML_UNAVAILABLE: {
    title: 'Risk Model Service Unavailable',
    message: 'The Machine Learning risk prediction microservice is currently unreachable. Please try again or check backend service logs.',
    badge: '503 Unavailable',
  },
  TIMEOUT: {
    title: 'Request Timed Out',
    message: 'The risk assessment request took longer than 25 seconds to complete. The pipeline or LLM provider may be experiencing high latency.',
    badge: '504 Gateway Timeout',
  },
  NETWORK_ERROR: {
    title: 'Backend Unreachable',
    message: 'Could not connect to the backend API server. Make sure the Node.js server is started on the configured port.',
    badge: 'Connection Error',
  },
};

export default function ErrorState({ error, licenseNumber, onRetry }) {
  const code = error?.code || 'UNKNOWN_ERROR';
  const config = ERROR_DETAILS[code] || {
    title: 'Assessment Failed',
    message: error?.message || 'An unexpected error occurred while analyzing the risk profile.',
    badge: 'Error',
  };

  return (
    <div className="max-w-md mx-auto my-12 bg-white rounded-2xl border border-rose-200/80 shadow-sm p-8 text-center">
      {/* Error Icon */}
      <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600">
        <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      </div>

      <span className="inline-block px-2.5 py-0.5 mb-2 rounded-full text-[11px] font-mono font-semibold bg-rose-50 text-rose-700 border border-rose-200">
        {config.badge}
      </span>

      <h3 className="text-lg font-bold text-slate-900 mb-2">
        {config.title}
      </h3>

      <p className="text-xs text-slate-600 leading-relaxed mb-4">
        {config.message}
      </p>

      {licenseNumber && (
        <div className="bg-slate-50 border border-slate-200 rounded-lg py-1.5 px-3 mb-6 inline-block font-mono text-xs text-slate-700">
          Target License: <span className="font-bold">{licenseNumber}</span>
        </div>
      )}

      {/* Action buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
        {onRetry && (
          <button
            onClick={onRetry}
            type="button"
            className="w-full sm:w-auto px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors"
          >
            Retry Assessment
          </button>
        )}

        <Link
          to="/"
          className="w-full sm:w-auto px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-colors inline-block text-center"
        >
          ← Back to Search
        </Link>
      </div>
    </div>
  );
}
