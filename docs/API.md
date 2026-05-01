# ClaimNova API Documentation

## Base URL

```text
https://ai-claims-settle.vercel.app/api
```

ClaimNova exposes a structured REST API supporting:

* Public access routes
* Claimant workflows
* Officer workflows
* Surveyor workflows
* Admin operations
* AI analysis routes
* Agent execution routes

Authentication uses **JWT in secure cookies**.

---

# Authentication APIs

## Register User

### POST `/api/auth/register`

Creates claimant account and sends OTP.

### Request

```json
{
  "full_name": "Nitin Chugh",
  "mobile": "9876543210",
  "email": "nitin@example.com",
  "password": "password123"
}
```

### Response

```json
{
  "success": true,
  "message": "OTP sent"
}
```

---

## Verify Registration OTP

### POST `/api/auth/verify-register-otp`

Completes registration verification.

---

## Login

### POST `/api/auth/login`

Authenticates claimant.

---

## Current User

### GET `/api/auth/me`

Returns authenticated user profile.

---

## Logout

### POST `/api/auth/logout`

Clears session.

---

# Policy APIs

## Verify Policy

### POST `/api/policies/verify`

Checks:

* policy validity
* vehicle match
* expiry
* activation state

---

## My Policy

### GET `/api/policies/my-policy`

Returns linked policy details.

---

# Claims APIs

## Submit Claim

### POST `/api/claims/submit`

Creates claim record.

Input:

```json
{
  "incident_date": "2026-04-01",
  "incident_time": "14:30",
  "incident_location": "Delhi",
  "incident_type": "collision",
  "incident_description": "Front bumper collision",
  "estimated_repair_cost": 12000
}
```

---

## Upload Claim Documents

### POST `/api/claims/{id}/upload-document`

Uploads:

* images
* documents
* supporting proofs

Uses Supabase Storage.

---

## Run AI Vision Analysis

### POST `/api/claims/{id}/analyze`

Pipeline:

```text
Images → Groq Vision → Gemini Fallback → Damage Output
```

Returns:

* damaged parts
* confidence
* estimate
* fraud indicators

---

## Execute ClaimNova Agent

### POST `/api/agent/analyze`

Runs multi-step reasoning loop.

Input:

```json
{
  "claimId": "uuid"
}
```

Returns:

```json
{
  "steps": [],
  "finalDecision": {
    "recommendation": "auto_approve",
    "amount": 9400,
    "confidence": 82,
    "fraudScore": 14
  }
}
```

---

## Claim History

### GET `/api/claims/my-claims`

Returns claimant claim history.

---

## Public Claim Search

### GET `/api/claims/search`

Search via claim number.

---

# AI Analysis API

## POST `/api/ai/analyze`

Direct vision analysis endpoint.

Processes:

* photo damage understanding
* severity estimation
* fraud cues
* cost estimation

---

# Officer APIs

## GET `/api/officer/claims`

Officer review queue.

---

## GET `/api/officer/claims/{id}`

Detailed claim review.

---

## PATCH `/api/officer/claims/{id}/approve`

Approves claim.

---

## PATCH `/api/officer/claims/{id}/reject`

Rejects claim.

---

## PATCH `/api/officer/claims/{id}/assign-surveyor`

Assigns field surveyor.

---

## GET `/api/officer/stats`

Officer dashboard stats.

---

# Surveyor APIs

## POST `/api/surveyor/auth/login`

Surveyor authentication.

---

## GET `/api/surveyor/assignments`

Assigned inspections.

---

## PATCH `/api/surveyor/assignments/{id}/report`

Submit inspection report.

---

# Admin APIs

## POST `/api/admin/auth/login`

Admin login.

---

## GET `/api/admin/stats`

Platform analytics.

---

## GET `/api/admin/users`

User management.

---

## GET `/api/admin/claims`

All claims listing.

---

## GET `/api/admin/surveyors`

Surveyor management.

---

## PATCH `/api/admin/surveyors/{id}/toggle`

Availability toggle.

---

# API Workflow Summary

```text
Register
 ↓
Verify OTP
 ↓
Login
 ↓
Submit Claim
 ↓
Upload Documents
 ↓
Vision Analysis
 ↓
ClaimNova Agent Execution
 ↓
Decision
 ↓
Officer / Surveyor Workflow
 ↓
Settlement
```
