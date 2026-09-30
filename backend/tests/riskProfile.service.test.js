// tests/riskProfile.service.test.js — Integration test for end-to-end risk profile pipeline
import { describe, it, expect } from 'vitest';
import { getRiskProfileForLicense } from '../src/services/riskProfile.service.js';

describe('RiskProfile Service Orchestrator', () => {
  it('generates a full risk profile response matching Section 4.1 for demo customer', async () => {
    // Aditya Gowda — Fresher on a sports bike
    const response = await getRiskProfileForLicense('MH4720231551327');

    expect(response).toBeDefined();
    expect(response.customer.name).toBe('Aditya Gowda');
    expect(response.customer.licenseNumber).toBe('MH4720231551327');
    expect(response.insuranceHistory.isFirstTimeBuyer).toBe(true);

    // Verify risk score & tier
    expect(response.risk.score).toBeGreaterThan(0);
    expect(response.risk.tier).toBeDefined();
    expect(response.risk.probabilities).toBeDefined();
    expect(response.risk.topFactors).toHaveLength(5);

    // Verify exactly 5 indicators in canonical order
    expect(response.indicators).toHaveLength(5);
    const indicatorKeys = response.indicators.map((i) => i.key);
    expect(indicatorKeys).toEqual(['vehicle', 'claims', 'violations', 'driver', 'history']);

    // Verify summary shape
    expect(response.summary).toBeDefined();
    expect(response.summary.headline).toBeDefined();
    expect(response.summary.narrative).toBeDefined();
    expect(response.summary.recommendation).toBeDefined();

    // Verify latency metadata
    expect(response.meta.latencyMs).toBeDefined();
    expect(response.meta.latencyMs.total).toBeGreaterThanOrEqual(0);
  });
});
