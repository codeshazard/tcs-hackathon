// src/api/riskApi.js — Risk profile API service
import client from './client';
import { normalizeLicense } from '../utils/format';
import { getMockProfile } from '../mocks/sampleResponse';

/**
 * Fetch risk profile for a driving license
 * @param {string} licenseNumber 
 * @param {object} options 
 * @returns {Promise<object>}
 */
export async function getRiskProfile(licenseNumber, options = {}) {
  const cleanLicense = normalizeLicense(licenseNumber);
  const { signal, forceMock = false } = options;

  if (forceMock) {
    const mock = getMockProfile(cleanLicense);
    if (!mock) {
      const err = new Error('No customer found for this license in mock database');
      err.code = 'LICENSE_NOT_FOUND';
      throw err;
    }
    return mock;
  }

  try {
    const response = await client.get(`/risk-profile/${cleanLicense}`, { signal });
    return response.data;
  } catch (error) {
    // If backend returns structured error from API
    if (error.response?.data?.error) {
      const apiErr = new Error(error.response.data.error.message || 'API Error');
      apiErr.code = error.response.data.error.code || 'API_ERROR';
      apiErr.status = error.response.status;
      throw apiErr;
    }
    
    // Check if network error (e.g. backend server not up yet) and mock is available
    if (error.code === 'ERR_NETWORK' || error.message?.includes('Network Error')) {
      const fallback = getMockProfile(cleanLicense);
      if (fallback) {
        console.warn(`[API] Backend unreachable (${client.defaults.baseURL}). Serving offline demo record for ${cleanLicense}.`);
        return {
          ...fallback,
          meta: {
            ...fallback.meta,
            isOfflineDemo: true,
          }
        };
      }
      
      const netErr = new Error('Cannot reach backend server. Please verify the API is running at ' + client.defaults.baseURL);
      netErr.code = 'NETWORK_ERROR';
      throw netErr;
    }

    if (error.name === 'CanceledError' || error.code === 'ERR_CANCELED') {
      const cancelErr = new Error('Request was cancelled');
      cancelErr.code = 'CANCELLED';
      throw cancelErr;
    }

    if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
      const timeoutErr = new Error('Request timed out after 25 seconds');
      timeoutErr.code = 'TIMEOUT';
      throw timeoutErr;
    }

    throw error;
  }
}
