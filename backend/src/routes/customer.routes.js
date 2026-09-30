// src/routes/customer.routes.js — Raw customer record route
import { Router } from 'express';
import { getCustomerByLicense } from '../controllers/customer.controller.js';

const router = Router();

router.get('/:licenseNumber', getCustomerByLicense);

export default router;
