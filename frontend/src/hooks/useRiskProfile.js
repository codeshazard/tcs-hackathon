// src/hooks/useRiskProfile.js — State machine hook for risk profile fetching
import { useState, useEffect, useRef, useCallback } from 'react';
import { getRiskProfile } from '../api/riskApi';
import { normalizeLicense, isValidLicense } from '../utils/format';

/**
 * Custom hook to fetch and cache risk profile by driving license
 * @param {string} licenseNumber 
 * @returns {{
 *   status: 'idle' | 'loading' | 'success' | 'error',
 *   data: object | null,
 *   error: object | null,
 *   refetch: () => void
 * }}
 */
export function useRiskProfile(licenseNumber) {
  const [status, setStatus] = useState('idle');
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  const cleanLicense = normalizeLicense(licenseNumber);
  const activeRequestRef = useRef(null);
  const lastFetchedLicenseRef = useRef(null);

  const fetchProfile = useCallback(async (forced = false) => {
    if (!cleanLicense) {
      setStatus('idle');
      setData(null);
      setError(null);
      return;
    }

    // Client-side quick check for license validity
    if (!isValidLicense(cleanLicense)) {
      setStatus('error');
      setError({
        code: 'INVALID_LICENSE_FORMAT',
        message: 'License must be exactly 15 characters (e.g. MH4720231551327: State, RTO, Year, Serial).'
      });
      setData(null);
      return;
    }

    // Avoid duplicate requests for same license unless forced
    if (!forced && lastFetchedLicenseRef.current === cleanLicense && data) {
      return;
    }

    // Cancel any ongoing inflight request
    if (activeRequestRef.current) {
      activeRequestRef.current.abort();
    }

    const controller = new AbortController();
    activeRequestRef.current = controller;

    setStatus('loading');
    setError(null);

    try {
      const result = await getRiskProfile(cleanLicense, {
        signal: controller.signal,
      });

      lastFetchedLicenseRef.current = cleanLicense;
      setData(result);
      setStatus('success');
      setError(null);
    } catch (err) {
      if (err.name === 'CanceledError' || err.code === 'CANCELLED') {
        // Ignored if cancelled
        return;
      }
      setStatus('error');
      setError({
        code: err.code || 'UNKNOWN_ERROR',
        message: err.message || 'An unexpected error occurred while fetching risk profile.',
      });
    } finally {
      activeRequestRef.current = null;
    }
  }, [cleanLicense, data]);

  useEffect(() => {
    fetchProfile();

    return () => {
      if (activeRequestRef.current) {
        activeRequestRef.current.abort();
      }
    };
  }, [cleanLicense]);

  return {
    status,
    data,
    error,
    refetch: () => fetchProfile(true),
  };
}
