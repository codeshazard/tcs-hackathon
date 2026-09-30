// src/components/LoadingSteps.jsx — 3-step progressive loader during risk analysis
import React, { useState, useEffect } from 'react';

const STEPS = [
  {
    title: 'Fetching customer record',
    description: 'Querying database and validating driving license registry',
    duration: 800,
  },
  {
    title: 'Scoring risk profile',
    description: 'Running ML pipeline and deterministic underwriting rules',
    duration: 1100,
  },
  {
    title: 'Generating underwriting summary',
    description: 'Synthesizing verified facts and executive recommendation',
    duration: 1500,
  },
];

export default function LoadingSteps({ licenseNumber }) {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const timer1 = setTimeout(() => setCurrentStep(1), STEPS[0].duration);
    const timer2 = setTimeout(() => setCurrentStep(2), STEPS[0].duration + STEPS[1].duration);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  return (
    <div className="max-w-md mx-auto my-12 bg-white rounded-2xl border border-slate-200/90 shadow-sm p-8 text-center">
      {/* Top spinner */}
      <div className="relative w-16 h-16 mx-auto mb-6 flex items-center justify-center">
        <div className="absolute inset-0 rounded-full border-4 border-indigo-100 animate-pulse" />
        <div className="w-16 h-16 rounded-full border-4 border-indigo-600 border-t-transparent animate-spin" />
        <svg className="w-6 h-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      </div>

      <h3 className="text-lg font-bold text-slate-900 mb-1">
        Evaluating Risk Profile
      </h3>
      <p className="text-xs text-slate-500 font-mono mb-6">
        License: {licenseNumber || 'Processing...'}
      </p>

      {/* Step progression checklist */}
      <div className="space-y-4 text-left border-t border-slate-100 pt-6">
        {STEPS.map((step, idx) => {
          const isDone = currentStep > idx;
          const isCurrent = currentStep === idx;

          return (
            <div
              key={step.title}
              className={`flex items-start gap-3 transition-opacity duration-300 ${
                isDone || isCurrent ? 'opacity-100' : 'opacity-40'
              }`}
            >
              <div className="mt-0.5 shrink-0">
                {isDone ? (
                  <div className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center">
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                ) : isCurrent ? (
                  <div className="w-5 h-5 rounded-full border-2 border-indigo-600 border-t-transparent animate-spin" />
                ) : (
                  <div className="w-5 h-5 rounded-full border border-slate-300 bg-slate-50" />
                )}
              </div>

              <div>
                <p className={`text-xs font-semibold ${isCurrent ? 'text-indigo-600' : isDone ? 'text-slate-800' : 'text-slate-500'}`}>
                  {step.title}
                </p>
                <p className="text-[11px] text-slate-400">
                  {step.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
