// src/routes/health.routes.js — Healthcheck endpoint
import { Router } from 'express';
import { isDbConnected } from '../config/db.js';
import { env } from '../config/env.js';

const router = Router();

router.get('/', (req, res) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    dbConnected: isDbConnected(),
    mlMode: env.mlMode,
  });
});

export default router;
