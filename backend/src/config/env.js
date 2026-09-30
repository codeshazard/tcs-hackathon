// src/config/env.js — Environment variable loader and defaults
import dotenv from 'dotenv';
dotenv.config();

export const env = {
  port: parseInt(process.env.PORT || '5000', 10),
  mongodbUri: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/insurance',
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:5173',

  mlMode: process.env.ML_MODE || 'mock',
  mlServiceUrl: process.env.ML_SERVICE_URL || 'http://localhost:8000',

  llmProvider: process.env.LLM_PROVIDER || 'gemini',
  llmApiKey: process.env.LLM_API_KEY || '',
  llmModel: process.env.LLM_MODEL || 'gemini-3.5-flash-lite',
  llmTimeoutMs: parseInt(process.env.LLM_TIMEOUT_MS || '12000', 10),
};
