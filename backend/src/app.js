// src/app.js — Express application setup
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { env } from './config/env.js';
import { requestLogger } from './middleware/requestLogger.js';
import { rateLimiter } from './middleware/rateLimiter.js';
import { errorHandler } from './middleware/errorHandler.js';
import apiRoutes from './routes/index.js';

const app = express();

// Security and utility middleware
app.use(helmet());
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow any local port or configured origin for hackathon pair programming
      if (!origin || origin.includes('localhost') || origin.includes('127.0.0.1')) {
        return callback(null, true);
      }
      return callback(null, origin === env.corsOrigin);
    },
    credentials: true,
  })
);

app.use(express.json({ limit: '2mb' }));
app.use(requestLogger);
app.use(rateLimiter);

// API routes mounted at /api
app.use('/api', apiRoutes);

// Catch-all 404 for unmatched routes
app.use((req, res) => {
  res.status(404).json({
    error: {
      code: 'ROUTE_NOT_FOUND',
      message: `Cannot ${req.method} ${req.originalUrl}`,
    },
  });
});

// Central error handler
app.use(errorHandler);

export default app;
