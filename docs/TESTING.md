# ClaimNova Testing Documentation

## Overview

ClaimNova validates reliability using multiple testing approaches to ensure consistent claim processing, correct settlement computation, and deterministic decision routing.

Testing strategy includes:

1. Automated Unit Testing
2. Manual Scenario Validation

---

# 1) Automated Unit Testing

Framework used:

**Vitest**

Command:

```bash id="rjlwm1"
npm run test
```

Current result:

```text id="0jce1e"
Test Files: 3 passed
Tests: 11 passed
Status: PASS
```

---

## Coverage Areas

### Settlement Engine

Validated:

* depreciation application
* deductible application
* zero depreciation handling
* NCB adjustment
* non-negative settlement logic

---

### Fraud Detection

Validated:

* low fraud classification
* medium fraud classification
* high fraud classification

---

### ClaimNova Decision Engine

Validated:

* low fraud → auto approve
* medium fraud → manual review
* very high fraud → escalate
* high amount → manual review

---

# 2) Manual Scenario Validation

Operational workflows manually validated.

## Scenario Matrix

| Scenario                     | Fraud Score |   Amount | Expected Decision | Result |
| ---------------------------- | ----------: | -------: | ----------------- | ------ |
| Minor damage                 |          12 |   ₹9,400 | Auto Approve      | PASS   |
| Medium anomaly               |          42 |   ₹8,200 | Manual Review     | PASS   |
| Severe fraud indicators      |          85 |   ₹6,500 | Escalate          | PASS   |
| High payout                  |          10 |  ₹45,000 | Manual Review     | PASS   |
| Low confidence vision result |          18 | variable | Manual Review     | PASS   |

---

# Workflow Validation

Validated:

✔ registration flow
✔ OTP verification
✔ login flow
✔ policy verification
✔ claim submission
✔ document upload
✔ AI analysis
✔ ClaimNova agent execution
✔ officer review workflow
✔ surveyor assignment workflow
✔ settlement routing

---

# Reliability Summary

ClaimNova currently demonstrates:

* deterministic routing
* stable settlement calculation
* reproducible fraud scoring
* explainable decision traces
* successful automated unit validation
* successful manual workflow validation
