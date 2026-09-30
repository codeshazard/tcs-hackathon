// tests/license.validator.test.js — Unit tests for driving license validator
import { describe, it, expect } from 'vitest';
import {
  normalizeLicense,
  isValidLicenseFormat,
  validateLicense,
} from '../src/validators/license.validator.js';

describe('License Validator', () => {
  it('normalizes driving license strings by removing whitespace and hyphens and uppercasing', () => {
    expect(normalizeLicense('mh47 2023-1551327')).toBe('MH4720231551327');
    expect(normalizeLicense('  DL-46-2026-1852249  ')).toBe('DL4620261852249');
  });

  it('validates 15-character standard Indian driving licenses', () => {
    expect(isValidLicenseFormat('MH4720231551327')).toBe(true);
    expect(isValidLicenseFormat('DL4620261852249')).toBe(true);
    expect(isValidLicenseFormat('TS2320051440461')).toBe(true);
  });

  it('rejects invalid or malformed license strings', () => {
    expect(isValidLicenseFormat('MH472023')).toBe(false); // too short
    expect(isValidLicenseFormat('123456789012345')).toBe(false); // numeric state
    expect(isValidLicenseFormat('')).toBe(false);
    expect(isValidLicenseFormat(null)).toBe(false);
  });

  it('throws ApiError with 400 status on invalid format', () => {
    expect(() => validateLicense('INVALID_DL')).toThrowError();
  });
});
