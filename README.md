# 🚗 ClaimNova — Agentic Motor Claims Processing System

### *Powering ClaimSettle AI — Intelligent, Explainable & Configurable Motor Insurance Automation*

[![Live Demo](https://img.shields.io/badge/Live-Demo-00C853?style=for-the-badge\&logo=vercel\&logoColor=white)](https://ai-claims-settle.vercel.app/)
[![Framework](https://img.shields.io/badge/Framework-Next.js-black?style=for-the-badge\&logo=nextdotjs)]
[![Database](https://img.shields.io/badge/Database-Supabase-3ECF8E?style=for-the-badge\&logo=supabase)]
[![ORM](https://img.shields.io/badge/ORM-Drizzle-blue?style=for-the-badge)]
[![AI](https://img.shields.io/badge/AI-Groq%20%7C%20Gemini-purple?style=for-the-badge)]
[![Architecture](https://img.shields.io/badge/Architecture-Agentic%20AI-orange?style=for-the-badge)]
[![Testing](https://img.shields.io/badge/Testing-Vitest-green?style=for-the-badge)]

> **ClaimSettle AI** is a full-stack intelligent insurance claims platform powered by **ClaimNova**, a configurable multi-step reasoning engine designed for motor insurance damage assessment, fraud analysis, and IRDAI-compliant settlement automation.

---

# 🌐 Live Demo

**Application:** https://ai-claims-settle.vercel.app/

Experience:

* AI-driven vehicle damage assessment
* Explainable claim processing
* Fraud detection pipeline
* Automated settlement recommendation
* Multi-role workflow (Claimant / Officer / Surveyor / Admin)

---

# Executive Summary

ClaimNova is an **Agentic AI claims processing engine** engineered for the Indian motor insurance ecosystem.

Unlike conventional prompt-response AI systems, ClaimNova follows a structured reasoning workflow:

```text
Goal → Think → Select Tool → Execute → Observe → Continue → Final Decision
```

This architecture enables:

* explainable decisions
* deterministic execution
* configurable operational rules
* fraud-aware approvals
* IRDAI-compliant settlement computation
* production-ready workflow orchestration

ClaimNova powers **ClaimSettle AI**, the customer-facing claims processing platform.

---

# Problem Statement

Traditional motor insurance claims are:

* slow
* manual
* inconsistent
* fraud-prone
* expensive to process
* difficult to audit

ClaimNova solves this by automating:

✔ damage understanding
✔ fraud assessment
✔ settlement computation
✔ approval routing
✔ officer workflow
✔ explainable AI decisions

---

# Why Agentic AI

Conventional flow:

```text
Input → Prompt → LLM → Response
```

ClaimNova flow:

```text
Claim Context
    ↓
Reasoning
    ↓
Tool Invocation
    ↓
Observation
    ↓
Decision Refinement
    ↓
Final Settlement Decision
```

This produces:

* better control
* auditable reasoning
* modular execution
* safer automation
* business-rule alignment

---

# Core Features

## 📸 AI Damage Assessment

Vehicle damage images are analyzed using vision models to detect:

* damaged parts
* severity
* repair vs replacement
* cost estimate
* fraud indicators
* confidence score

Primary model:

**Groq Vision**

Fallback:

**Google Gemini**

Fallback chain:

```text
Groq → Gemini → Mock Analysis
```

---

## 🤖 ClaimNova Agent Engine

ClaimNova executes a multi-step reasoning loop.

Available tools:

1. `analyze_damage`
2. `check_fraud`
3. `calculate_settlement`
4. `lookup_history`

Execution pattern:

```text
THOUGHT
↓
ACTION
↓
ACTION_INPUT
↓
OBSERVATION
↓
NEXT THOUGHT
↓
FINAL ANSWER
```

Every execution stores:

* iteration logs
* reasoning trace
* selected tools
* observations
* final recommendation
* confidence score
* fraud score

This enables **Explainable AI**.

---

## ⚙ Configurable Prompt + Policy Layer

Operational rules are centralized in:

```text
src/config/agent-config.ts
```

Configurable parameters include:

### Models

* vision model
* reasoning model
* fallback model

### AI Controls

* max iterations
* token limits
* temperature
* delay controls

### Fraud Rules

* fraud thresholds
* fraud signals
* escalation conditions

### Settlement Rules

* deductible slabs
* depreciation schedules
* labour rate tiers
* approval limits
* confidence thresholds

### Tool Execution

* configurable tool order

No business logic rewrite required.

---

# Fraud Detection Engine

Fraud detection evaluates:

* EXIF anomalies
* timestamp mismatch
* suspicious angles
* staged damage indicators
* metadata inconsistency
* prior damage evidence
* claim history frequency

Fraud classification:

```text
0–29   → Low Risk
30–69  → Medium Risk
70+    → High Risk
```

Routing:

* Low → Auto approve possible
* Medium → Manual review
* High → Escalate

---

# IRDAI-Compliant Settlement Engine

ClaimNova computes settlement using:

* depreciation schedules
* compulsory deductible
* zero depreciation add-on logic
* NCB adjustments
* labour rate tiers
* IDV validation

Settlement pipeline:

```text
Gross Cost
 ↓
Depreciation
 ↓
NCB Adjustment
 ↓
Deductible
 ↓
Final Approved Amount
```

---

# System Architecture

## High-Level Flow

```text
Claimant
   ↓
Claim Submission
   ↓
Document Upload
   ↓
Vision Analysis
   ↓
Fraud Engine
   ↓
ClaimNova Agent Loop
   ↓
Settlement Engine
   ↓
Decision Routing
   ↓
Officer / Surveyor / Admin Workflow
   ↓
Database + Notifications
```

---

## Architecture Diagram

## Architecture Overview

![ClaimNova Architecture](docs/architecture/architecture-overview.png)
---

# API Documentation

Detailed API docs:

📄 [API Reference](docs/API.md)

Coverage includes:

* Authentication APIs
* Claims APIs
* AI Analysis APIs
* Agent Execution APIs
* Officer APIs
* Surveyor APIs
* Admin APIs

---

# Testing

ClaimNova validates reliability using:

## 1) Automated Unit Testing

Implemented with **Vitest**

Coverage:

* settlement calculation
* fraud classification
* approval logic
* decision routing

## 2) Manual Scenario Validation

Scenarios validated:

* low fraud + low amount → auto approve
* medium fraud → manual review
* very high fraud → escalate
* high amount → manual review
* low confidence → manual review

Detailed testing:

📄 [Testing Documentation](docs/TESTING.md)

---

# Security

Implemented:

✔ JWT authentication
✔ role-based access control
✔ secure cookies
✔ image sanitization
✔ environment-based secret management
✔ controlled AI execution limits
✔ bounded iteration loops

Planned:

* rate limiting
* audit logs
* secret rotation automation

---

# Tech Stack

## Frontend

* React
* Next.js App Router
* Tailwind CSS
* Material UI
* ShadCN UI
* Framer Motion

## Backend

* Next.js API Routes
* JWT Auth
* RBAC

## Database

* PostgreSQL
* Supabase
* Drizzle ORM

## AI

* Groq
* Gemini

## Services

* Fast2SMS
* Courier
* Resend

---

# Project Structure

```text
Ai-ClaimSettle/
├── docs/
│   ├── API.md
│   ├── ARCHITECTURE.md
│   ├── TESTING.md
│   └── architecture/
│       ├── system-architecture.png
│       ├── claimnova-agent-flow.png
│       └── database-er-diagram.png
│
├── src/
├── public/
├── package.json
├── README.md
└── .env.example
```

---

# Setup

Clone:

```bash
git clone <repo-url>
cd Ai-ClaimSettle
```

Install:

```bash
npm install
```

Configure:

```bash
cp .env.example .env.local
```

Run:

```bash
npm run dev
```

Tests:

```bash
npm run test
```

---

# Deployment

**Frontend:** Vercel
**Database:** Supabase PostgreSQL

Production:

https://ai-claims-settle.vercel.app/

---

# Future Roadmap

Planned upgrades:

* dynamic planner layer
* persistent memory
* adaptive tool selection
* self-reflection loop
* admin prompt editor
* configuration dashboard
* CI/CD pipeline
* Docker support
* observability & tracing

---

# Conclusion

ClaimNova demonstrates how **Agentic AI can power regulated, real-world operational workflows** through:

* reasoning
* tool orchestration
* fraud awareness
* policy control
* explainability
* scalable automation

**ClaimSettle AI is not simply an AI wrapper — it is an explainable decision engine for motor claims automation.**
