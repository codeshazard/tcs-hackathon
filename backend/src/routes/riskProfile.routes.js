// src/routes/riskProfile.routes.js — Public risk profile endpoint
import { Router } from 'express';
import { getRiskProfile } from '../controllers/riskProfile.controller.js';

const router = Router();

router.get('/:licenseNumber', getRiskProfile);

export default router;
