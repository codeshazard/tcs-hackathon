// src/mocks/sampleResponse.js — Sample mock responses conforming strictly to Section 4.1

export const SAMPLE_RESPONSES = {
  // Scenario 1: Fresher on a sports bike (Aditya Gowda) -> High Risk
  'MH4720231551327': {
    customer: {
      customerId: "CUST000041",
      licenseNumber: "MH4720231551327",
      name: "Aditya Gowda",
      age: 23,
      occupation: "salaried",
      cityTier: "metro"
    },
    vehicle: {
      category: "two_wheeler",
      subtype: "sports_bike",
      engineCc: 165,
      ageYears: 2,
      marketValueInr: 210000,
      usage: "personal",
      hasModifications: false
    },
    insuranceHistory: {
      isFirstTimeBuyer: true,
      priorInsuranceYears: 0
    },
    risk: {
      score: 69,
      tier: "high",
      probabilities: {
        low: 0.02,
        medium: 0.21,
        high: 0.77
      },
      modelVersion: "mock-rules-0.1",
      topFactors: [
        { feature: "vehicle_subtype", value: "sports_bike", impact: 0.24, direction: "increases_risk" },
        { feature: "driver_age", value: 23, impact: 0.18, direction: "increases_risk" },
        { feature: "driver_driving_experience_years", value: 1, impact: 0.14, direction: "increases_risk" },
        { feature: "driver_city_tier", value: "metro", impact: 0.09, direction: "increases_risk" },
        { feature: "vehicle_engine_cc", value: 165, impact: 0.08, direction: "increases_risk" }
      ]
    },
    indicators: [
      {
        key: "vehicle",
        title: "Vehicle Profile",
        severity: "high",
        fact: "Sports bike (165 cc, 2 yrs old): performance two-wheelers in metro regions exhibit significantly higher accident severity.",
        sourceFields: ["vehicle.category", "vehicle.subtype", "vehicle.engine_cc"]
      },
      {
        key: "claims",
        title: "Claim History",
        severity: "info",
        fact: "No prior claim history available: first-time buyer assessed entirely on driver demographic and vehicle classification.",
        sourceFields: ["claim_history.claims_last_5y"]
      },
      {
        key: "violations",
        title: "Traffic Violations",
        severity: "low",
        fact: "0 traffic infractions recorded and driver license in good standing over the evaluated period.",
        sourceFields: ["risk_factors.traffic_violations_3y", "risk_factors.license_suspended"]
      },
      {
        key: "driver",
        title: "Driver Profile",
        severity: "high",
        fact: "Age 23 with under 2 years licensed experience operating in high-congestion Metro tier traffic.",
        sourceFields: ["driver.age", "driver.driving_experience_years", "driver.city_tier"]
      },
      {
        key: "history",
        title: "Insurance History",
        severity: "info",
        fact: "First-time vehicle insurance applicant (0 years prior coverage, 0% NCB baseline).",
        sourceFields: ["insurance_history.is_first_time_buyer", "risk_factors.ncb_percent"]
      }
    ],
    summary: {
      headline: "High risk: first-time buyer operating a sports bike in metro traffic",
      narrative: "Aditya Gowda is a 23-year-old first-time insurance buyer residing in a metro tier zone. He operates a 165 cc sports bike valued at ₹2,10,000. Because the applicant is a first-time buyer, there is no prior insurance or claim history, and risk is determined primarily by the vehicle category and youthful driver profile. Performance two-wheelers in high-density urban environments carry elevated collision frequency. The absence of previous policy tenure and an experience level under two years amplify exposure.",
      recommendation: "Issue policy with mandatory higher deductible, inspect anti-theft gear, and suggest installation of telematics for premium adjustment.",
      source: "llm"
    },
    meta: {
      isFallbackSummary: false,
      mlMode: "mock",
      latencyMs: { db: 14, ml: 6, llm: 1850, total: 1870 }
    }
  },

  // Scenario 2: Experienced, clean, high NCB (Ananya Singh) -> Low Risk
  'DL5919951456299': {
    customer: {
      customerId: "CUST000892",
      licenseNumber: "DL5919951456299",
      name: "Ananya Singh",
      age: 44,
      occupation: "professional",
      cityTier: "tier2"
    },
    vehicle: {
      category: "car",
      subtype: "hatchback",
      engineCc: 1198,
      ageYears: 5,
      marketValueInr: 450000,
      usage: "personal",
      hasModifications: false
    },
    insuranceHistory: {
      isFirstTimeBuyer: false,
      priorInsuranceYears: 12
    },
    risk: {
      score: 24,
      tier: "low",
      probabilities: {
        low: 0.88,
        medium: 0.10,
        high: 0.02
      },
      modelVersion: "mock-rules-0.1",
      topFactors: [
        { feature: "risk_factors_ncb_percent", value: 50, impact: -0.28, direction: "decreases_risk" },
        { feature: "claim_history_claims_last_5y", value: 0, impact: -0.22, direction: "decreases_risk" },
        { feature: "driver_driving_experience_years", value: 16, impact: -0.18, direction: "decreases_risk" },
        { feature: "vehicle_category", value: "car", impact: -0.12, direction: "decreases_risk" },
        { feature: "driver_age", value: 44, impact: -0.09, direction: "decreases_risk" }
      ]
    },
    indicators: [
      {
        key: "vehicle",
        title: "Vehicle Profile",
        severity: "low",
        fact: "Hatchback car (1198 cc, 5 yrs old): standard family passenger vehicle with low loss frequency.",
        sourceFields: ["vehicle.category", "vehicle.subtype", "vehicle.engine_cc"]
      },
      {
        key: "claims",
        title: "Claim History",
        severity: "low",
        fact: "0 claims filed over the past 5 consecutive years, demonstrating consistent disciplined operation.",
        sourceFields: ["claim_history.claims_last_5y"]
      },
      {
        key: "violations",
        title: "Traffic Violations",
        severity: "low",
        fact: "Clean violation record with zero traffic citations or suspensions in the past 3 years.",
        sourceFields: ["risk_factors.traffic_violations_3y"]
      },
      {
        key: "driver",
        title: "Driver Profile",
        severity: "low",
        fact: "Age 44 professional with over 16 years of driving experience in tier-2 city driving conditions.",
        sourceFields: ["driver.age", "driver.driving_experience_years"]
      },
      {
        key: "history",
        title: "Insurance History",
        severity: "low",
        fact: "12 continuous years of uninterrupted coverage with maximum 50% No Claim Bonus earned.",
        sourceFields: ["insurance_history.prior_insurance_years", "risk_factors.ncb_percent"]
      }
    ],
    summary: {
      headline: "Low risk: seasoned driver with impeccable 50% NCB and zero claims",
      narrative: "Ananya Singh is a 44-year-old experienced motorist driving an unmodified 1198 cc hatchback valued at ₹4,50,000. She possesses 16 years of driving experience and maintains 12 years of continuous insurance coverage. With zero claims in the preceding five years and zero traffic violations, she qualifies for the maximum 50% No Claim Bonus. Operating in a tier-2 city, her low exposure profile ranks in the lowest risk tier.",
      recommendation: "Approve standard renewal immediately with full preferential rate discount and optional engine-protect add-on.",
      source: "llm"
    },
    meta: {
      isFallbackSummary: false,
      mlMode: "mock",
      latencyMs: { db: 11, ml: 4, llm: 1420, total: 1435 }
    }
  },

  // Scenario 3: Experienced, many claims + violations (Vivaan Verma) -> High Risk
  'TS2320051440461': {
    customer: {
      customerId: "CUST000219",
      licenseNumber: "TS2320051440461",
      name: "Vivaan Verma",
      age: 38,
      occupation: "commercial_driver",
      cityTier: "metro"
    },
    vehicle: {
      category: "three_wheeler",
      subtype: "auto_rickshaw",
      engineCc: 236,
      ageYears: 4,
      marketValueInr: 180000,
      usage: "commercial",
      hasModifications: true
    },
    insuranceHistory: {
      isFirstTimeBuyer: false,
      priorInsuranceYears: 8
    },
    risk: {
      score: 62,
      tier: "high",
      probabilities: {
        low: 0.05,
        medium: 0.28,
        high: 0.67
      },
      modelVersion: "mock-rules-0.1",
      topFactors: [
        { feature: "claim_history_claims_last_5y", value: 4, impact: 0.26, direction: "increases_risk" },
        { feature: "risk_factors_traffic_violations_3y", value: 3, impact: 0.21, direction: "increases_risk" },
        { feature: "vehicle_usage", value: "commercial", impact: 0.16, direction: "increases_risk" },
        { feature: "vehicle_has_modifications", value: true, impact: 0.12, direction: "increases_risk" },
        { feature: "risk_factors_previous_policy_lapse", value: true, impact: 0.10, direction: "increases_risk" }
      ]
    },
    indicators: [
      {
        key: "vehicle",
        title: "Vehicle Profile",
        severity: "medium",
        fact: "Modified commercial auto-rickshaw (236 cc, commercial transit usage) subject to heavy daily mileage.",
        sourceFields: ["vehicle.category", "vehicle.usage", "vehicle.has_modifications"]
      },
      {
        key: "claims",
        title: "Claim History",
        severity: "high",
        fact: "4 claims reported in the last 5 years with 3 at-fault determinations totaling ₹78,000 in payouts.",
        sourceFields: ["claim_history.claims_last_5y", "claim_history.at_fault_claims"]
      },
      {
        key: "violations",
        title: "Traffic Violations",
        severity: "high",
        fact: "3 traffic infractions recorded in 36 months, including reckless lane violations in metro limits.",
        sourceFields: ["risk_factors.traffic_violations_3y"]
      },
      {
        key: "driver",
        title: "Driver Profile",
        severity: "medium",
        fact: "Age 38 commercial operator logging high exposure hours across busy metropolitan traffic routes.",
        sourceFields: ["driver.age", "driver.occupation", "driver.city_tier"]
      },
      {
        key: "history",
        title: "Insurance History",
        severity: "high",
        fact: "8 years prior tenure disrupted by a recent policy lapse and forfeiture of No Claim Bonus (0% NCB).",
        sourceFields: ["insurance_history.prior_insurance_years", "risk_factors.previous_policy_lapse"]
      }
    ],
    summary: {
      headline: "High risk: commercial vehicle with recurring at-fault claims and citations",
      narrative: "Vivaan Verma is a 38-year-old commercial transport operator with 8 years of history. Over the past five years, he has filed 4 claims, with 3 marked as at-fault incidents. The policy experienced a lapse, resetting NCB to zero. Furthermore, the driver has accumulated 3 traffic violations in the last 3 years, and operates a modified three-wheeler under intensive commercial wear. The cumulative claim velocity and compliance profile indicate heightened risk.",
      recommendation: "Apply commercial high-risk surcharge, require physical vehicle fitness inspection, and restrict third-party liability limits.",
      source: "llm"
    },
    meta: {
      isFallbackSummary: false,
      mlMode: "mock",
      latencyMs: { db: 16, ml: 5, llm: 1720, total: 1741 }
    }
  },

  // Scenario 4: Fresher on a hatchback (Aarav Shetty) -> Medium Risk
  'DL4620261852249': {
    customer: {
      customerId: "CUST000078",
      licenseNumber: "DL4620261852249",
      name: "Aarav Shetty",
      age: 26,
      occupation: "engineer",
      cityTier: "metro"
    },
    vehicle: {
      category: "car",
      subtype: "hatchback",
      engineCc: 1197,
      ageYears: 1,
      marketValueInr: 650000,
      usage: "personal",
      hasModifications: false
    },
    insuranceHistory: {
      isFirstTimeBuyer: true,
      priorInsuranceYears: 0
    },
    risk: {
      score: 51,
      tier: "medium",
      probabilities: {
        low: 0.18,
        medium: 0.68,
        high: 0.14
      },
      modelVersion: "mock-rules-0.1",
      topFactors: [
        { feature: "insurance_history_is_first_time_buyer", value: true, impact: 0.22, direction: "increases_risk" },
        { feature: "driver_city_tier", value: "metro", impact: 0.15, direction: "increases_risk" },
        { feature: "vehicle_category", value: "car", impact: -0.14, direction: "decreases_risk" },
        { feature: "driver_age", value: 26, impact: 0.08, direction: "increases_risk" },
        { feature: "vehicle_has_modifications", value: false, impact: -0.06, direction: "decreases_risk" }
      ]
    },
    indicators: [
      {
        key: "vehicle",
        title: "Vehicle Profile",
        severity: "low",
        fact: "New hatchback passenger car (1197 cc, 1 yr old) with standard safety equipment.",
        sourceFields: ["vehicle.category", "vehicle.subtype", "vehicle.engine_cc"]
      },
      {
        key: "claims",
        title: "Claim History",
        severity: "info",
        fact: "No prior claim history available: first-time buyer assessed on passenger car safety and driver metrics.",
        sourceFields: ["claim_history.claims_last_5y"]
      },
      {
        key: "violations",
        title: "Traffic Violations",
        severity: "low",
        fact: "Zero recorded traffic infractions and clean license record.",
        sourceFields: ["risk_factors.traffic_violations_3y"]
      },
      {
        key: "driver",
        title: "Driver Profile",
        severity: "medium",
        fact: "Age 26 salaried engineer with 2 years of driving experience in Metro conditions.",
        sourceFields: ["driver.age", "driver.driving_experience_years"]
      },
      {
        key: "history",
        title: "Insurance History",
        severity: "info",
        fact: "First-time insurance buyer with no previous policy tenure or accumulated NCB discount.",
        sourceFields: ["insurance_history.is_first_time_buyer"]
      }
    ],
    summary: {
      headline: "Medium risk: first-time buyer with safe hatchback passenger vehicle",
      narrative: "Aarav Shetty is a 26-year-old first-time vehicle insurance applicant purchasing coverage for a new 1197 cc hatchback valued at ₹6,50,000. As a first-time buyer, there is no prior insurance or claim history on file, meaning underwriting evaluation relies on vehicle characteristics and driver profile rather than historical losses. The low-risk hatchback vehicle category balances out the driver's limited licensed experience in metro transit.",
      recommendation: "Issue standard comprehensive policy with regular deductible; offer zero-depreciation rider.",
      source: "llm"
    },
    meta: {
      isFallbackSummary: false,
      mlMode: "mock",
      latencyMs: { db: 13, ml: 5, llm: 1610, total: 1628 }
    }
  },

  // Scenario 5: Young rider, one claim (Aditya Iyer) -> Medium Risk
  'KA1220251258324': {
    customer: {
      customerId: "CUST000512",
      licenseNumber: "KA1220251258324",
      name: "Aditya Iyer",
      age: 28,
      occupation: "marketing",
      cityTier: "metro"
    },
    vehicle: {
      category: "two_wheeler",
      subtype: "cruiser",
      engineCc: 350,
      ageYears: 3,
      marketValueInr: 195000,
      usage: "personal",
      hasModifications: false
    },
    insuranceHistory: {
      isFirstTimeBuyer: false,
      priorInsuranceYears: 3
    },
    risk: {
      score: 53,
      tier: "medium",
      probabilities: {
        low: 0.15,
        medium: 0.72,
        high: 0.13
      },
      modelVersion: "mock-rules-0.1",
      topFactors: [
        { feature: "vehicle_subtype", value: "cruiser", impact: 0.18, direction: "increases_risk" },
        { feature: "claim_history_claims_last_5y", value: 1, impact: 0.15, direction: "increases_risk" },
        { feature: "driver_city_tier", value: "metro", impact: 0.11, direction: "increases_risk" },
        { feature: "insurance_history_prior_years", value: 3, impact: -0.10, direction: "decreases_risk" },
        { feature: "risk_factors_ncb_percent", value: 20, impact: -0.08, direction: "decreases_risk" }
      ]
    },
    indicators: [
      {
        key: "vehicle",
        title: "Vehicle Profile",
        severity: "medium",
        fact: "Cruiser motorcycle (350 cc, 3 yrs old): moderate-displacement two-wheeler driven in metro traffic.",
        sourceFields: ["vehicle.category", "vehicle.subtype", "vehicle.engine_cc"]
      },
      {
        key: "claims",
        title: "Claim History",
        severity: "medium",
        fact: "1 single claim recorded in past 5 years (minor repair under ₹12,000, non-fatal).",
        sourceFields: ["claim_history.claims_last_5y"]
      },
      {
        key: "violations",
        title: "Traffic Violations",
        severity: "low",
        fact: "No active traffic violations or license penalty points on record.",
        sourceFields: ["risk_factors.traffic_violations_3y"]
      },
      {
        key: "driver",
        title: "Driver Profile",
        severity: "medium",
        fact: "Age 28 rider with 4 years experience navigating urban commuter corridors.",
        sourceFields: ["driver.age", "driver.driving_experience_years"]
      },
      {
        key: "history",
        title: "Insurance History",
        severity: "medium",
        fact: "3 years continuous coverage holding 20% No Claim Bonus following prior minor settlement.",
        sourceFields: ["insurance_history.prior_insurance_years", "risk_factors.ncb_percent"]
      }
    ],
    summary: {
      headline: "Medium risk: cruiser rider with 3 years tenure and one isolated claim",
      narrative: "Aditya Iyer is a 28-year-old rider in a metro city operating a 350 cc cruiser motorcycle valued at ₹1,95,000. He possesses 3 years of prior coverage with a single recorded claim. With 20% active NCB and zero traffic infractions, the single claim is balanced by continuous policy tenure and responsible record keeping.",
      recommendation: "Approve standard policy with standard two-wheeler excess and optional roadside assistance.",
      source: "llm"
    },
    meta: {
      isFallbackSummary: false,
      mlMode: "mock",
      latencyMs: { db: 12, ml: 4, llm: 1530, total: 1546 }
    }
  }
};

export const DEMO_CUSTOMERS = [
  {
    license: "MH4720231551327",
    name: "Aditya Gowda",
    scenario: "Fresher on sports bike",
    vehicle: "Sports bike (165 cc)",
    expectedTier: "high",
    expectedScore: 69
  },
  {
    license: "DL4620261852249",
    name: "Aarav Shetty",
    scenario: "Fresher on hatchback",
    vehicle: "Hatchback (1197 cc)",
    expectedTier: "medium",
    expectedScore: 51
  },
  {
    license: "TS2320051440461",
    name: "Vivaan Verma",
    scenario: "Experienced, claims + violations",
    vehicle: "Auto-rickshaw",
    expectedTier: "high",
    expectedScore: 62
  },
  {
    license: "DL5919951456299",
    name: "Ananya Singh",
    scenario: "Experienced, clean, high NCB",
    vehicle: "Hatchback (1198 cc)",
    expectedTier: "low",
    expectedScore: 24
  },
  {
    license: "KA1220251258324",
    name: "Aditya Iyer",
    scenario: "Young rider, one claim",
    vehicle: "Cruiser (350 cc)",
    expectedTier: "medium",
    expectedScore: 53
  }
];

export function getMockProfile(licenseNumber) {
  const clean = (licenseNumber || '').replace(/[\s-]/g, '').toUpperCase();
  return SAMPLE_RESPONSES[clean] || null;
}
