// src/utils/ApiError.js — Custom API error class
export class ApiError extends Error {
  constructor(code, message, status = 500) {
    super(message);
    this.name = 'ApiError';
    this.code = code;
    this.status = status;
    Error.captureStackTrace(this, this.constructor);
  }
}
