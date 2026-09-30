// src/controllers/customer.controller.js — Raw customer record lookup controller
import { findByLicense } from '../services/customer.service.js';
import { validateLicense } from '../validators/license.validator.js';

export async function getCustomerByLicense(req, res, next) {
  try {
    const cleanLicense = validateLicense(req.params.licenseNumber);
    const customer = await findByLicense(cleanLicense);
    return res.status(200).json(customer);
  } catch (error) {
    next(error);
  }
}
