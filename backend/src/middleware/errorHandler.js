// src/middleware/errorHandler.js — Central Express error handling middleware
export function errorHandler(err, req, res, next) {
  const status = err.status || 500;
  const code = err.code || (status === 400 ? 'INVALID_LICENSE_FORMAT' : status === 404 ? 'LICENSE_NOT_FOUND' : 'INTERNAL');
  const message = err.message || 'An internal server error occurred.';

  console.error(`[Error] [${code}] ${message} (${req.method} ${req.originalUrl})`);

  return res.status(status).json({
    error: {
      code,
      message,
    },
  });
}
