// src/models/Customer.js — Mongoose schema mirroring customers_db.json
import mongoose from 'mongoose';

const customerSchema = new mongoose.Schema(
  {
    customer_id: { type: String, required: true, unique: true },
    driver: {
      driving_license_number: { type: String, required: true, unique: true, index: true },
      name: { type: String, required: true },
      age: { type: Number, required: true },
      driving_experience_years: { type: Number, required: true },
      occupation: { type: String, default: 'unknown' },
      city_tier: { type: String, required: true },
      marital_status: { type: String },
    },
    vehicle: {
      category: { type: String, required: true },
      subtype: { type: String, required: true },
      fuel_type: { type: String },
      vehicle_age_years: { type: Number, required: true },
      engine_cc: { type: Number, required: true },
      market_value_inr: { type: Number, required: true },
      usage: { type: String, required: true },
      annual_km: { type: Number, default: null },
      has_modifications: { type: Boolean, default: false },
    },
    insurance_history: {
      is_first_time_buyer: { type: Boolean, required: true },
      prior_insurance_years: { type: Number, default: 0 },
    },
    claim_history: {
      claims_last_5y: { type: Number, default: 0 },
      at_fault_claims: { type: Number, default: 0 },
      total_claim_amount_inr: { type: Number, default: 0 },
      claim_types: [{ type: String }],
      months_since_last_claim: { type: Number, default: null },
    },
    risk_factors: {
      traffic_violations_3y: { type: Number, default: 0 },
      license_suspended: { type: Boolean, default: false },
      previous_policy_lapse: { type: Boolean, default: false },
      ncb_percent: { type: Number, default: 0 },
      night_driving_pct: { type: Number, default: 0 },
      telematics_score: { type: Number, default: null },
    },
  },
  {
    timestamps: true,
  }
);

export const Customer = mongoose.models.Customer || mongoose.model('Customer', customerSchema);
