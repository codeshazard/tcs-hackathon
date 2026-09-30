// src/validators/license.validator.js — Driving license normalization and validation
import { ApiError } from '../utils/ApiError.js';

const LICENSE_REGEX = /^[A-Z]{2}\d{2}\d{4}\d{7}$/;

export function normalizeLicense(license) {
  if (!license || typeof license !== 'string') return '';
  return license.replace(/[\s-]/g, '').toUpperCase();
}

export function isValidLicenseFormat(license) {
  const normalized = normalizeLicense(license);
  return LICENSE_REGEX.test(normalized);
}

export function validateLicense(license) {
  const normalized = normalizeLicense(license);
  if (!normalized || !LICENSE_REGEX.test(normalized)) {
    throw new ApiError(
      'INVALID_LICENSE_FORMAT',
      'Driving license must be 15 alphanumeric characters matching standard Indian format (e.g. MH4720231551327).',
      400
    );
  }
  return normalized;
}
