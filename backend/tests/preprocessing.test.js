// tests/preprocessing.test.js — Unit tests for record preprocessing and fact generation
import { describe, it, expect } from 'vitest';
import { preprocess } from '../src/services/preprocessing.service.js';

describe('Preprocessing Service', () => {
  it('cleans messy data and generates correct facts for a first-time buyer', () => {
    const raw = {
      customer_id: 'CUST0001',
      driver: {
        driving_license_number: '  mh4720231551327  ',
        name: 'Aditya Gowda',
        age: '23',
        driving_experience_years: '1',
        occupation: 'SALARIED',
        city_tier: '  METRO ',
      },
      vehicle: {
        category: 'TWO_WHEELER',
        subtype: 'SPORTS_BIKE',
        engine_cc: '165',
        market_value_inr: '210000',
        usage: 'PERSONAL',
        has_modifications: false,
      },
      insurance_history: {
        is_first_time_buyer: true,
      },
    };

    const { cleanRecord, facts } = preprocess(raw);

    expect(cleanRecord.driver.age).toBe(23);
    expect(cleanRecord.driver.occupation).toBe('salaried');
    expect(cleanRecord.driver.city_tier).toBe('metro');
    expect(cleanRecord.vehicle.category).toBe('two_wheeler');
    expect(cleanRecord.vehicle.subtype).toBe('sports_bike');

    expect(facts.isFirstTimeBuyer).toBe(true);
    expect(facts.claimsPerYear).toBeNull();
    expect(facts.vehicleRiskClass).toBe('high');
    expect(facts.ageBand).toBe('18-24');
    expect(facts.experienceBand).toBe('<2');
  });

  it('calculates claimsPerYear and atFaultRatio for tenured drivers', () => {
    const raw = {
      customer_id: 'CUST0002',
      driver: {
        driving_license_number: 'DL5919951456299',
        name: 'Ananya Singh',
        age: 44,
        driving_experience_years: 16,
        city_tier: 'tier2',
      },
      vehicle: {
        category: 'private_car',
        subtype: 'hatchback',
        market_value_inr: 450000,
      },
      insurance_history: {
        is_first_time_buyer: false,
        prior_insurance_years: 12,
      },
      claim_history: {
        claims_last_5y: 0,
        at_fault_claims: 0,
        total_claim_amount_inr: 0,
      },
    };

    const { facts } = preprocess(raw);

    expect(facts.isFirstTimeBuyer).toBe(false);
    expect(facts.claimsPerYear).toBe(0);
    expect(facts.atFaultRatio).toBe(0);
    expect(facts.vehicleRiskClass).toBe('low');
  });
});
