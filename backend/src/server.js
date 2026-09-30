// src/server.js — Backend HTTP server entry point
import app from './app.js';
import { connectDB } from './config/db.js';
import { env } from './config/env.js';

async function startServer() {
  await connectDB();

  const server = app.listen(env.port, () => {
    console.log(`[Server] Risk Profile Backend running on http://localhost:${env.port}`);
    console.log(`[Server] Health check: http://localhost:${env.port}/api/health`);
    console.log(`[Server] ML Mode: ${env.mlMode}`);
  });

  const shutdown = () => {
    console.log('[Server] Gracefully shutting down...');
    server.close(() => {
      console.log('[Server] HTTP server closed.');
      process.exit(0);
    });
  };

  process.on('SIGTERM', shutdown);
  process.on('SIGINT', shutdown);
}

startServer().catch((err) => {
  console.error('[Server] Fatal startup error:', err);
  process.exit(1);
});
