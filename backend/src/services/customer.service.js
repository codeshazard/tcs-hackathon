// src/services/customer.service.js — Customer data lookup with Mongo and JSON fallback
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { Customer } from '../models/Customer.js';
import { isDbConnected } from '../config/db.js';
import { ApiError } from '../utils/ApiError.js';
import { normalizeLicense } from '../validators/license.validator.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_PATH = path.resolve(__dirname, '../../../data/customers_db.json');

// In-memory lazy index for quick lookup when MongoDB is offline
let memoryCache = null;

function loadMemoryData() {
  if (memoryCache) return memoryCache;
  try {
    if (fs.existsSync(DATA_PATH)) {
      const raw = fs.readFileSync(DATA_PATH, 'utf-8');
      const list = JSON.parse(raw);
      memoryCache = new Map();
      for (const item of list) {
        if (item.driver?.driving_license_number) {
          memoryCache.set(normalizeLicense(item.driver.driving_license_number), item);
        }
      }
    }
  } catch (err) {
    console.warn(`[CustomerService] Could not preload JSON fallback: ${err.message}`);
    memoryCache = new Map();
  }
  return memoryCache;
}

export async function findByLicense(licenseNumber) {
  const cleanLicense = normalizeLicense(licenseNumber);

  // 1. Try MongoDB first if connected
  if (isDbConnected()) {
    try {
      const doc = await Customer.findOne({
        'driver.driving_license_number': cleanLicense,
      }).lean();
      if (doc) return doc;
    } catch (err) {
      console.warn(`[CustomerService] Mongo query error: ${err.message}. Falling back to JSON cache.`);
    }
  }

  // 2. Try JSON memory cache fallback
  const cache = loadMemoryData();
  if (cache && cache.has(cleanLicense)) {
    return JSON.parse(JSON.stringify(cache.get(cleanLicense)));
  }

  // 3. Not found
  throw new ApiError(
    'LICENSE_NOT_FOUND',
    `No customer found for license number ${cleanLicense}`,
    404
  );
}
