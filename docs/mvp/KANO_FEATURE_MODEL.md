# Kano Feature Model — Agora MVP

## Scope

This analysis covers **Identity + Trust services only** (MVP scope). Other 6 services from ecosystem vision are deferred.

---

## Feature Classification

### Must-Have (Basic Expectations)

Without these, product is non-functional. Absence causes extreme dissatisfaction. Presence does not create satisfaction — it's expected.

| Feature | Description | Current Status |
|---------|-------------|----------------|
| Agent DID Registration | Create unique decentralized identifier | Implemented |
| Trust Score Query | GET /v1/trust/{did} returns score | Implemented |
| Event Reporting | POST /v1/events to report interactions | Implemented |
| API Authentication | Bearer token auth | Implemented |
| Basic Rate Limiting | Prevent abuse | Implemented |
| SDK Availability | TypeScript + Python clients | Implemented |
| API Uptime | 99%+ availability | Not verified |
| Data Persistence | Trust data survives restarts | Not verified |

**MVP Readiness: 6/8 verified**

---

### Linear (Performance Payoff)

More is linearly better. Customer satisfaction increases proportionally with improvement.

| Feature | Metric | Current | Target | Priority |
|---------|--------|---------|--------|----------|
| Query Latency | p99 response time | Unknown | <100ms | P0 |
| Throughput | Queries/second | Unknown | 1,000 QPS | P1 |
| Documentation Quality | Time to first integration | Unknown | <1 hour | P0 |
| SDK Languages | Number supported | 2 | 2 (sufficient) | P2 |
| Trust Score Granularity | Confidence intervals | Basic | Detailed | P2 |
| Audit Trail | Transaction history depth | Unknown | 90 days | P1 |

**Action Required**: Load testing, user experience testing

---

### Delighters (Attractive Quality)

Unexpected positives. Absence doesn't disappoint, presence creates strong positive reaction.

| Feature | Description | Current Status | Priority |
|---------|-------------|----------------|----------|
| ZK Proofs | Prove trust without revealing history | Implemented | P2 |
| Batch Queries | Query multiple DIDs in one call | Implemented | — |
| Merkle Commitments | Cryptographic audit trail | Implemented | — |
| OpenAPI Spec | Auto-generated client SDKs | Not implemented | P2 |
| Interactive Docs | Swagger/Postman playground | Not implemented | P1 |
| Webhooks | Push notifications on events | Not implemented | P2 |
| Multi-region | Geographic redundancy | Not implemented | P3 |

**Observation**: ZK proofs implemented before Linear features stabilized — this is premature optimization. Delighters before basics is a risk.

---

### Indifferent (Neutral)

Customers don't care either way. No impact on satisfaction.

| Feature | Reason for Indifference |
|---------|------------------------|
| Admin Dashboard UI | Agents don't need GUI |
| Multi-language Error Messages | Machine clients parse codes not text |
| Branding/Logo in API | No human sees it |
| API versioning beyond v1 | Premature for MVP |
| Mobile SDK | Agents run on servers |

**Action**: Do not build these for MVP. Zero priority.

---

### Reverse (Avoid)

Presence causes dissatisfaction. More is worse.

| Feature | Why It's Harmful | Current Status |
|---------|------------------|----------------|
| Mandatory KYC | Friction for registration | Not required — good |
| Complex Onboarding | Multi-step setup | Risk — monitor |
| Required Credit Card | Payment before value | Not required — good |
| Vendor Lock-in | Proprietary formats | DID standard — good |
| Unclear Pricing | Hidden costs | Risk — need clear pricing |
| Slow Response to Issues | Support latency | Unknown |

**Observation**: Current design avoids most reverse features. Keep it this way.

---

## Priority Matrix

| Category | Count | MVP Priority |
|----------|-------|--------------|
| Must-Have | 8 | Verify all work |
| Linear | 6 | Load test, docs |
| Delighter | 7 | Defer most |
| Indifferent | 5 | Do not build |
| Reverse | 6 | Avoid adding |

---

## MVP Feature Set Decision

### Include in MVP

| Feature | Category | Rationale |
|---------|----------|-----------|
| DID Registration | Must-Have | Core functionality |
| Trust Score Query | Must-Have | Core functionality |
| Event Reporting | Must-Have | Feeds trust algorithm |
| API Auth | Must-Have | Security |
| TypeScript SDK | Must-Have | Primary user language |
| Python SDK | Must-Have | Secondary user language |
| Documentation Site | Linear | Adoption blocker |
| Interactive API Playground | Delighter | Significantly helps adoption |

### Defer Post-MVP

| Feature | Category | Rationale |
|---------|----------|-----------|
| ZK Proof Generation | Delighter | No customer asked for it |
| Merkle Commitments | Delighter | Enterprise feature |
| Multi-region | Delighter | Scale problem, not MVP problem |
| Webhooks | Delighter | Polling sufficient for MVP scale |
| Mobile SDKs | Indifferent | Not our users |

### Never Build

| Feature | Rationale |
|---------|-----------|
| Admin GUI | Not needed |
| KYC flow | Friction |

---

## Risk: Over-Engineering Detected

Current codebase includes:

- Circom ZK circuits (implemented)
- Merkle tree commitments (implemented)
- Multiple protocol integrations (A2A, AP2, x402)

These are **Delighter** features built before **Linear** features are verified.

**Recommendation**: Do not remove existing code, but do not expand it. Focus remaining effort on:

1. Load testing (Linear)
2. Documentation (Linear)
3. Customer discovery (not a feature — a process)

---

## Validation Plan

| Feature Category | How to Validate |
|------------------|-----------------|
| Must-Have | Functional tests (exist: 170+) |
| Linear | Load tests (not done) |
| Delighter | Customer interviews ("would you pay more for X?") |
| Indifferent | Skip |
| Reverse | Customer complaints |
