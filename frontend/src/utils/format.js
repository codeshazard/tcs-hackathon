// src/utils/format.js — formatting utilities for currency, dates, license numbers and text

/**
 * Format number as Indian Rupee (INR)
 * e.g. 210000 -> ₹2,10,000
 */
export function formatCurrencyINR(amount) {
  if (amount === null || amount === undefined || isNaN(amount)) return '—';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Normalise driving license number
 * Strips whitespace, hyphens and forces uppercase
 */
export function normalizeLicense(license) {
  if (!license) return '';
  return license.replace(/[\s-]/g, '').toUpperCase();
}

/**
 * Validate 15-character Indian Driving License format
 * Format: State(2) + RTO(2) + Issue Year(4) + Serial(7)
 */
export function isValidLicense(license) {
  const normalized = normalizeLicense(license);
  return /^[A-Z]{2}\d{2}\d{4}\d{7}$/.test(normalized);
}

/**
 * Mask license number for privacy in headers
 * e.g. MH4720231551327 -> MH47 •••• •••• 1327
 */
export function maskLicense(license) {
  if (!license) return '';
  const clean = normalizeLicense(license);
  if (clean.length !== 15) return clean;
  return `${clean.slice(0, 4)} •••• •••• ${clean.slice(11)}`;
}

/**
 * Humanize snake_case or kebab-case strings
 * e.g. "two_wheeler" -> "Two Wheeler", "sports_bike" -> "Sports Bike"
 */
export function humanize(text) {
  if (!text) return '—';
  return text
    .toString()
    .replace(/[_-]+/g, ' ')
    .trim()
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

/**
 * Format percentage
 * e.g. 0.77 -> "77%" or 25 -> "25%"
 */
export function formatPercent(value, isRatio = false) {
  if (value === null || value === undefined || isNaN(value)) return '0%';
  const num = isRatio ? value * 100 : value;
  return `${Math.round(num)}%`;
}
