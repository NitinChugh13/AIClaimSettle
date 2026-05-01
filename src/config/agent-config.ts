/**
 * AGENT CONFIGURATION
 * -------------------
 * All parameters that control agent behaviour, prompts, and decision rules
 * are defined here. Judges and reviewers can modify these values to change
 * how the agent behaves — no code changes required.
 *
 * These values are imported by:
 *   - src/lib/ai/prompts.ts      (vision prompt rules)
 *   - src/lib/agent/agent-executor.ts  (agent decision rules)
 *   - src/lib/ai/groq.ts         (model selection)
 *   - src/lib/ai/gemini.ts       (fallback model)
 */

export const AgentConfig = {

  // ── Models ────────────────────────────────────────────────────────────────
  models: {
    vision: 'meta-llama/llama-4-scout-17b-16e-instruct', // Groq vision model
    agent: 'llama-3.3-70b-versatile',                    // Agent reasoning model
    fallbackVision: 'gemini-2.0-flash',                  // Gemini fallback
  },

  // ── Vision Analysis ───────────────────────────────────────────────────────
  vision: {
    maxPhotos: 3,           // Max photos sent to vision model (Groq limit: 5)
    imageMaxPx: 512,        // Max image dimension before compression
    imageQuality: 60,       // JPEG quality (0-100)
  },

  // ── IRDAI Settlement Rules ────────────────────────────────────────────────
  settlement: {
    autoApprovalLimit: 20000,       // Max amount (₹) for auto-approval
    maxFraudScoreForApproval: 25,   // Fraud score above this = manual review
    minConfidenceForApproval: 75,   // Confidence below this = manual review

    compulsoryDeductible: {
      carSmallEngine: 1000,   // Private car < 1500cc
      carLargeEngine: 2000,   // Private car >= 1500cc
      twoWheeler: 100,
      commercial: 2000,
    },
  },

  // ── IRDAI Depreciation Schedule ───────────────────────────────────────────
  depreciation: {
    rubberPlasticNylon: 50, // % — always 50% regardless of age

    metalGlassOther: [
      { maxAgeMonths: 6,   rate: 5  },
      { maxAgeMonths: 12,  rate: 15 },
      { maxAgeMonths: 24,  rate: 20 },
      { maxAgeMonths: 36,  rate: 25 },
      { maxAgeMonths: 48,  rate: 35 },
      { maxAgeMonths: 60,  rate: 40 },
      { maxAgeMonths: Infinity, rate: 50 },
    ],
  },

  // ── Labour Rates by City Tier ─────────────────────────────────────────────
  labourRates: {
    tier1: { min: 600, max: 800, label: 'Mumbai/Delhi/Bangalore etc.' },
    tier2: { min: 400, max: 600, label: 'Tier 2 cities' },
    tier3: { min: 250, max: 400, label: 'Tier 3 cities' },
  },

  // ── Agent Behaviour ───────────────────────────────────────────────────────
  agent: {
    maxIterations: 5,
    iterationDelayMs: 1500,   // Delay between iterations (rate limit protection)
    maxTokensPerCall: 500,
    temperature: 0.1,         // Low = deterministic, High = creative

    // Decision rules (agent reads these via system prompt)
    rules: {
      highFraudThreshold: 70,    // fraud_score > this → ESCALATE
      mediumFraudThreshold: 30,  // fraud_score > this → MANUAL_REVIEW
      // fraud_score < mediumFraudThreshold AND amount <= autoApprovalLimit → AUTO_APPROVE
    },

    // Tool execution order (agent is instructed to follow this)
    toolOrder: [
      'analyze_damage',       // Step 1: always first
      'check_fraud',          // Step 2: always second
      'calculate_settlement', // Step 3: after fraud check passes
      'lookup_history',       // Step 4: optional context
    ],
  },

  // ── Fraud Detection Signals ───────────────────────────────────────────────
  fraudSignals: [
    'inconsistent_damage_pattern',
    'pre_existing_rust_at_damage_edge',
    'staged_damage_indicators',
    'suspicious_photo_angles',
    'exif_metadata_anomaly',
    'timestamp_inconsistency',
    'claim_history_frequency',
  ],

} as const;

export type AgentConfigType = typeof AgentConfig;