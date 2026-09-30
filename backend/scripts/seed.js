// scripts/seed.js — Loads data/customers_db.json into MongoDB
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import { env } from '../src/config/env.js';
import { Customer } from '../src/models/Customer.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_PATH = path.resolve(__dirname, '../../data/customers_db.json');

async function seed() {
  console.log(`[Seed] Connecting to MongoDB: ${env.mongodbUri}`);
  await mongoose.connect(env.mongodbUri);

  console.log(`[Seed] Reading customer database seed from ${DATA_PATH}...`);
  const raw = fs.readFileSync(DATA_PATH, 'utf-8');
  const records = JSON.parse(raw);

  console.log(`[Seed] Clearing existing customers...`);
  await Customer.deleteMany({});

  console.log(`[Seed] Inserting ${records.length} customers...`);
  const batchSize = 1000;
  let inserted = 0;
  for (let i = 0; i < records.length; i += batchSize) {
    const chunk = records.slice(i, i + batchSize);
    await Customer.insertMany(chunk, { ordered: false });
    inserted += chunk.length;
    process.stdout.write(`\rInserted ${inserted}/${records.length}`);
  }
  console.log(`\nInserted ${inserted}`);

  console.log(`[Seed] Creating index on driver.driving_license_number...`);
  await Customer.collection.createIndex(
    { 'driver.driving_license_number': 1 },
    { unique: true }
  );

  console.log(`[Seed] Seed finished successfully.`);
  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error('[Seed] Error during seeding:', err);
  process.exit(1);
});
