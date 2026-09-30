// src/config/db.js — Mongoose connection management
import mongoose from 'mongoose';
import { env } from './env.js';

let isConnected = false;

export async function connectDB() {
  if (isConnected) return;

  try {
    const conn = await mongoose.connect(env.mongodbUri, {
      serverSelectionTimeoutMS: 2500,
    });
    isConnected = true;
    console.log(`[DB] MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.warn(`[DB] MongoDB connection failed (${error.message}). In-memory / file fallback will be used.`);
    isConnected = false;
  }
}

export function isDbConnected() {
  return isConnected && mongoose.connection.readyState === 1;
}
