// src/components/TierBadge.jsx — Visual badge for risk tier
import React from 'react';

const TIER_STYLES = {
  low: {
    bg: 'bg-emerald-50 border-emerald-200 text-emerald-800',
    dot: 'bg-emerald-500',
    label: 'Low Risk',
  },
  medium: {
    bg: 'bg-amber-50 border-amber-200 text-amber-800',
    dot: 'bg-amber-500',
    label: 'Medium Risk',
  },
  high: {
    bg: 'bg-rose-50 border-rose-200 text-rose-800',
    dot: 'bg-rose-500',
    label: 'High Risk',
  },
};

export default function TierBadge({ tier = 'low', size = 'md', className = '' }) {
  const normalizedTier = (tier || 'low').toLowerCase();
  const config = TIER_STYLES[normalizedTier] || TIER_STYLES.medium;

  const sizeClasses = size === 'lg' 
    ? 'text-sm px-3.5 py-1.5 font-semibold gap-2'
    : size === 'sm'
    ? 'text-xs px-2 py-0.5 font-medium gap-1.5'
    : 'text-xs px-2.5 py-1 font-semibold gap-2';

  return (
    <span
      className={`inline-flex items-center rounded-full border ${config.bg} ${sizeClasses} uppercase tracking-wider ${className}`}
    >
      <span className={`w-2 h-2 rounded-full ${config.dot} animate-pulse`} />
      {config.label}
    </span>
  );
}
