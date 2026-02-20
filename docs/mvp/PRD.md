# Product Requirements Document — Agora MVP

**Version**: 1.0  
**Date**: 2026-02-05  
**Status**: Draft

---

## 1. Product Overview

### 1.1 Purpose

Agora MVP provides machine-readable trust verification for AI agents and API providers. The product enables one agent to query the reliability of another before initiating a transaction.

### 1.2 Scope

This PRD covers **Identity + Trust services only**. Other 6 services from ecosystem vision are out of scope.

| In Scope | Out of Scope |
|----------|--------------|
| Agent DID registration | Marketplace |
| Trust score queries | Payments/Settlement |
| Interaction event reporting | Agent Chains/Orchestration |
| Basic anti-gaming detection | Analytics products |
| REST API + SDKs | Risk management policies |
| — | Dispute resolution |

### 1.3 Success Criteria

| Metric | Target | Measurement Method |
|--------|--------|-------------------|
| Registered agents | 100 DIDs | Database count |
| Daily queries | 1,000/day | API logs |
| Paying customers | 1 | Signed contract |
| API uptime | 99% | Monitoring |
| Mean query latency | <100ms | p50 |
| Security incidents | 0 critical | Incident log |

---

## 2. User Personas

### 2.1 Primary: API Provider (Supply Side)

**Name**: "Alex the API Builder"  
**Role**: Solo founder or lead engineer at small AI API company  
**Needs**:

- Differentiate from unreliable competitors
- Reduce fraud/abuse from anonymous consumers
- Signal trustworthiness to potential clients

**Usage**: Registers API as agent, builds trust score through successful transactions

### 2.2 Secondary: Agent Orchestrator (Demand Side)

**Name**: "Jordan the Integrator"  
**Role**: Engineer building multi-agent workflows  
**Needs**:

- Verify reliability before calling external APIs
- Avoid wasting budget on failing services
- Automate provider selection based on trust

**Usage**: Queries trust scores before agent-to-agent calls

---

## 3. Functional Requirements

### 3.1 Agent Registration

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-101 | System MUST allow registration of new agent with metadata | P0 |
| FR-102 | System MUST generate unique DID in format `did:agora:{type}:{id}` | P0 |
| FR-103 | System MUST store agent type (ai, vehicle, robot, iot, contract) | P0 |
| FR-104 | System MUST store optional display name | P1 |
| FR-105 | System MUST store optional metadata JSON | P2 |
| FR-106 | System MUST reject duplicate registrations | P0 |
| FR-107 | System MUST return API key for registered agent | P0 |

### 3.2 Trust Score Query

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-201 | System MUST return trust score (0.0-1.0) for any registered DID | P0 |
| FR-202 | System MUST return confidence level (0.0-1.0) | P0 |
| FR-203 | System MUST return component breakdown (completion, disputes, latency, volume, age) | P1 |
| FR-204 | System MUST return "unrated" status for agents with <10 interactions | P0 |
| FR-205 | System MUST support batch queries (up to 100 DIDs) | P1 |
| FR-206 | System MUST return 404 for unknown DIDs | P0 |
| FR-207 | Query latency MUST be <100ms p50, <500ms p99 | P0 |

### 3.3 Event Reporting

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-301 | System MUST accept interaction events (success, failure, dispute) | P0 |
| FR-302 | System MUST require DID of reporter | P0 |
| FR-303 | System MUST require DID of counterparty | P0 |
| FR-304 | System MUST accept optional latency_ms field | P1 |
| FR-305 | System MUST accept optional transaction value | P2 |
| FR-306 | System MUST update trust scores asynchronously after event | P0 |
| FR-307 | System MUST prevent self-reporting (same agent as reporter and counterparty) | P0 |

### 3.4 Anti-Gaming Detection

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-401 | System MUST detect velocity anomalies (>100 events/hour same pair) | P0 |
| FR-402 | System MUST detect sybil patterns (>50% interactions with one counterparty) | P0 |
| FR-403 | System MUST flag suspicious agents for manual review | P1 |
| FR-404 | Flagged agents MUST NOT have trust scores modified until reviewed | P1 |

### 3.5 Authentication & Authorization

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-501 | All non-public endpoints MUST require API key authentication | P0 |
| FR-502 | API keys MUST be revocable | P0 |
| FR-503 | Rate limiting MUST apply per API key (1000 req/hour default) | P0 |
| FR-504 | Rate limit exceeded MUST return 429 | P0 |

---

## 4. API Specification

### 4.1 Endpoints

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | /v1/health | None | Health check |
| POST | /v1/agents | API Key | Register new agent |
| GET | /v1/agents/{did} | API Key | Get agent profile |
| GET | /v1/trust/{did} | API Key | Get trust score |
| POST | /v1/trust/batch | API Key | Batch trust query |
| POST | /v1/events | API Key | Report interaction |

### 4.2 Request/Response Schemas

#### POST /v1/agents

**Request**:

```json
{
  "agent_type": "ai",
  "display_name": "My Agent",
  "metadata": {"version": "1.0"}
}
```

**Response** (201):

```json
{
  "did": "did:agora:ai:abc123",
  "api_key": "agora_live_xxxxx",
  "created_at": "2026-02-05T12:00:00Z"
}
```

#### GET /v1/trust/{did}

**Response** (200):

```json
{
  "did": "did:agora:ai:abc123",
  "score": 0.87,
  "confidence": 0.92,
  "components": {
    "completion_rate": 0.95,
    "dispute_rate": 0.02,
    "avg_latency_ms": 120,
    "total_interactions": 1542,
    "account_age_days": 90
  },
  "status": "rated",
  "updated_at": "2026-02-05T11:55:00Z"
}
```

#### POST /v1/events

**Request**:

```json
{
  "counterparty_did": "did:agora:ai:xyz789",
  "event_type": "success",
  "latency_ms": 150,
  "amount_usd": 0.001
}
```

**Response** (202):

```json
{
  "event_id": "evt_123456",
  "status": "accepted"
}
```

---

## 5. Non-Functional Requirements

### 5.1 Performance

| Metric | Requirement |
|--------|-------------|
| API latency (p50) | <100ms |
| API latency (p99) | <500ms |
| Throughput | 1,000 QPS sustained |
| Trust score update latency | <5 seconds |

### 5.2 Availability

| Metric | Requirement |
|--------|-------------|
| Uptime | 99% monthly |
| Planned maintenance window | <4 hours/month |
| Maximum unplanned downtime | 4 hours/incident |

### 5.3 Security

| Requirement | Priority |
|-------------|----------|
| TLS 1.3 for all connections | P0 |
| API keys stored hashed (argon2) | P0 |
| No PII stored | P0 |
| Rate limiting per API key | P0 |
| SQL injection prevention (parameterized queries) | P0 |

### 5.4 Scalability

| Aspect | Initial Capacity | Growth Path |
|--------|------------------|-------------|
| Agents | 10,000 | Horizontal DB sharding |
| Events/day | 1,000,000 | TimescaleDB partitioning |
| QPS | 1,000 | Kubernetes HPA |

---

## 6. Constraints

| Constraint | Rationale |
|------------|-----------|
| Rust backend | Performance + security, existing code |
| PostgreSQL | Existing choice, proven at scale |
| Single region initially | Cost; multi-region post-validation |
| No mobile SDKs | Target users are servers |
| No GUI dashboard | Machine-to-machine product |

---

## 7. Dependencies

| Dependency | Type | Risk |
|------------|------|------|
| PostgreSQL hosting | Infrastructure | Low |
| Domain + TLS cert | Infrastructure | Low |
| Docker/K8s platform | Infrastructure | Medium (ops overhead) |
| DNS | Infrastructure | Low |

---

## 8. Open Questions

| Question | Needed By | Owner |
|----------|-----------|-------|
| Final pricing model ($X per query) | Launch | Business |
| Free tier limits | Launch | Product |
| GDPR compliance for EU users | Launch | Legal |
| Terms of Service | Launch | Legal |

---

## 9. Out of Scope

The following are explicitly NOT in MVP:

- Payment processing
- Agent marketplace/discovery
- Multi-agent orchestration
- Analytics/BI dashboards
- ZK proof generation APIs (code exists but not exposed)
- Webhook notifications
- GraphQL API
