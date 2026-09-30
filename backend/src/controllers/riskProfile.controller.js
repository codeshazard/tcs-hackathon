// src/controllers/riskProfile.controller.js — Risk profile evaluation controller
import { getRiskProfileForLicense } from '../services/riskProfile.service.js';

export async function getRiskProfile(req, res, next) {
  try {
    const { licenseNumber } = req.params;
    const profile = await getRiskProfileForLicense(licenseNumber);
    return res.status(200).json(profile);
  } catch (error) {
    next(error);
  }
}
