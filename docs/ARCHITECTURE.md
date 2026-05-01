# ClaimNova Architecture

## Overview

ClaimNova is a configurable **Agentic AI decision engine** built for intelligent motor insurance claims processing.

It powers **ClaimSettle AI**, the customer-facing insurance workflow platform.

Unlike conventional prompt-response AI systems, ClaimNova uses a structured reasoning loop with tool execution, observation feedback, and explainable final decision generation.

Core objectives:

* automate claim processing
* reduce manual survey dependency
* improve fraud detection
* generate explainable decisions
* maintain IRDAI settlement compliance
* support configurable business policies

---

# High-Level System Architecture

```text id="n1w4qv"
Claimant UI
   ↓
Authentication Layer
   ↓
Policy Verification Layer
   ↓
Claim Submission Layer
   ↓
Document Upload Layer
   ↓
AI Vision Analysis Layer
   ↓
Fraud Detection Layer
   ↓
ClaimNova Agent Engine
   ↓
Settlement Engine
   ↓
Workflow Routing Layer
   ↓
Officer / Surveyor / Admin Panels
   ↓
Notifications Layer
   ↓
Supabase Storage + PostgreSQL
```

---

## Complete Architecture

![ClaimNova Architecture Overview](architecture/architecture-overview.png)

---

# Core System Modules

## 1) Frontend Layer

Built using:

* React
* Next.js App Router
* Tailwind CSS
* Material UI
* ShadCN UI
* Framer Motion

Responsibilities:

* claimant onboarding
* claim filing
* document upload
* claim tracking
* officer dashboard
* surveyor workflow
* admin controls

---

## 2) Authentication Layer

Supports:

* registration
* OTP verification
* JWT login
* secure cookie sessions
* RBAC authorization

Roles:

* claimant
* officer
* surveyor
* admin

---

## 3) Vision AI Layer

Primary model:

Groq Vision

Fallback:

Google Gemini

Fallback chain:

```text id="p1ybjp"
Groq → Gemini → Mock Analysis
```

Outputs:

* damaged parts
* severity
* repair estimate
* fraud indicators
* confidence score

---

## 4) Fraud Detection Engine

Signals evaluated:

* EXIF metadata anomalies
* timestamp inconsistency
* suspicious image framing
* staged collision indicators
* pre-existing damage evidence
* repeated claims
* metadata tampering

Classification:

```text id="lyf99u"
0–29   = Low Risk
30–69  = Medium Risk
70+    = High Risk
```

---

## 5) ClaimNova Agent Engine

ClaimNova is implemented as a configurable reasoning loop.

Execution pattern:

```text id="qhjlwm"
THOUGHT
↓
ACTION
↓
ACTION_INPUT
↓
TOOL EXECUTION
↓
OBSERVATION
↓
NEXT THOUGHT
↓
FINAL ANSWER
```

This follows a **ReAct-style execution architecture**.

---

# Tool Execution Layer

ClaimNova invokes structured tools:

## analyze_damage

Evaluates:

* damaged parts
* severity
* repairability
* confidence

---

## check_fraud

Evaluates:

* fraud score
* detected flags
* claim anomaly indicators

---

## calculate_settlement

Applies:

* depreciation
* deductible
* NCB adjustment
* labour costs
* settlement approval rules

---

## lookup_history

Checks:

* prior claims
* claim frequency
* policy risk profile

---

# Configurable Policy Layer

Central configuration file:

```text id="jlwm74"
src/config/agent-config.ts
```

Configurable:

## Models

* vision model
* reasoning model
* fallback model

## Fraud Controls

* fraud thresholds
* fraud signals
* escalation logic

## Settlement Controls

* deductible slabs
* depreciation schedules
* labour rates
* approval caps
* confidence limits

## Execution Controls

* max iterations
* token limits
* delay
* tool order

This allows policy updates without code changes.

---

# Explainability

Every execution stores:

* iteration number
* reasoning thought
* selected action
* tool observation
* execution duration
* final recommendation

This creates:

* transparent decision trace
* auditable AI behavior
* reviewer visibility
* operational accountability

---

# Database Layer

Storage:

* PostgreSQL
* Supabase
* Drizzle ORM

Stores:

* users
* policies
* claims
* documents
* surveyor assignments
* settlement details
* fraud metadata
* audit records

---

# Security Controls

Implemented:

* JWT auth
* RBAC
* secure cookie sessions
* controlled AI iterations
* environment-based secret management
* bounded execution loops

Planned:

* rate limiting
* audit trails
* configuration versioning

---

# Scalability

Future-ready upgrades:

* planner module
* persistent memory
* self-reflection loop
* dynamic tool routing
* observability
* CI/CD
* Docker deployment
