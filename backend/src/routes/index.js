// src/routes/index.js — Route aggregator for /api
import { Router } from 'express';
import healthRoutes from './health.routes.js';
import customerRoutes from './customer.routes.js';
import riskProfileRoutes from './riskProfile.routes.js';

const router = Router();

router.use('/health', healthRoutes);
router.use('/customers', customerRoutes);
router.use('/risk-profile', riskProfileRoutes);

export default router;
