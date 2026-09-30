// src/services/mlClient.service.js — Client for ML model scoring
import axios from 'axios';
import { env } from '../config/env.js';
import { scoreCustomer } from './mockScorer.js';
import { ApiError } from '../utils/ApiError.js';

export async function predict(cleanRecord) {
  if (env.mlMode === 'remote') {
    try {
      const response = await axios.post(
        `${env.mlServiceUrl}/predict`,
        { record: cleanRecord },
        { timeout: 3000 }
      );
      return response.data;
    } catch (err) {
      console.warn(`[MLClient] Remote ML service error: ${err.message}.`);
      throw new ApiError('ML_UNAVAILABLE', 'Risk model service is currently unavailable.', 503);
    }
  }

  // ML_MODE=mock (or default)
  return scoreCustomer(cleanRecord);
}
