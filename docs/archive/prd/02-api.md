# PRD: agora-api — REST API Service

## Overview

| Field | Value |
|-------|-------|
| **Service** | agora-api |
| **Type** | Actix-Web REST API |
| **Revenue** | Pay-per-call, tiered subscriptions |
| **Owner** | Platform Team |

---

## Customer Journey Touchpoints

```
┌─────────────────────────────────────────────────────┐
│ 1. REGISTER    2. QUERY TRUST   3. REPORT EVENTS   │
│ POST /agents   GET /trust/{did} POST /events       │
│                                                     │
│ 4. DISCOVER    5. MONETIZE                         │
│ GET /discovery AP2/x402 hooks                      │
└─────────────────────────────────────────────────────┘
```

---

## Revenue Model

| Tier | Price | Limits | Features |
|------|-------|--------|----------|
| **Free** | $0 | 1K calls/mo | Basic endpoints |
| **Growth** | $49/mo | 50K calls/mo | + Discovery, webhooks |
| **Enterprise** | Custom | Unlimited | + SLA, dedicated support |

**Transaction fees**: 0.5% on AP2/x402 verified payments

---

## Features — Kano Analysis

### Must-Have (P0) — Missing = Unusable

| Feature | Endpoint | Status |
|---------|----------|--------|
| Health check | `GET /v1/health` | ✅ Done |
| Register agent | `POST /v1/agents` | ✅ Done |
| Get agent info | `GET /v1/agents/{did}` | ✅ Done |
| Get trust score | `GET /v1/trust/{did}` | ✅ Done |
| Report event | `POST /v1/events` | ✅ Done |
| API key auth | `X-Agora-Key` header | ✅ Done |
| Rate limiting | Per-key limits | ✅ Done |

### Performance (P1) — More = Better

| Feature | Endpoint | Status |
|---------|----------|--------|
| Batch trust query | `POST /v1/trust/batch` | ✅ Done |
| Agent discovery | `GET /v1/discovery` | ✅ Done |
| Batch discovery | `POST /v1/discovery/batch` | ✅ Done |
| Redis caching | 5min TTL for scores | ⚠️ Partial |
| Response compression | gzip/brotli | ❌ TODO |
| Pagination | offset/limit | ✅ Done |

### Delighters (P2) — Unexpected Wow

| Feature | Description | Status |
|---------|-------------|--------|
| WebSocket | Real-time trust updates | ❌ TODO |
| GraphQL | Flexible queries | ❌ TODO |
| Webhooks | Event notifications | ❌ TODO |
| SDK-less mode | Browser-direct API | ❌ TODO |

---

## Technical Spec

### Endpoints Map

| Method | Path | Description |
|--------|------|-------------|
| GET | `/v1/health` | Health check |
| GET | `/v1/ready` | Readiness check |
| POST | `/v1/agents` | Register agent |
| GET | `/v1/agents/{did}` | Get agent info |
| GET | `/v1/trust/{did}` | Get trust score |
| POST | `/v1/trust/batch` | Batch trust query |
| POST | `/v1/events` | Report event |
| GET | `/v1/events/{did}` | List agent events |
| GET | `/v1/discovery` | Discover agents |
| POST | `/v1/discovery/batch` | Batch discovery |

### Authentication

```
Authorization: Bearer agora_xxx...
X-Agora-Key: agora_xxx...
```

### Rate Limits

| Tier | Requests/sec | Burst |
|------|--------------|-------|
| Free | 10 | 50 |
| Growth | 100 | 500 |
| Enterprise | 1000 | 5000 |

### Error Format (RFC 7807)

```json
{
  "type": "https://agora.dev/errors/rate-limit",
  "title": "Rate Limit Exceeded",
  "status": 429,
  "detail": "You have exceeded 10 requests/second"
}
```

---

## Infrastructure

| Component | Technology |
|-----------|------------|
| Runtime | Rust + Tokio |
| Framework | Actix-Web 4 |
| Database | PostgreSQL 15 + TimescaleDB |
| Cache | Redis 7 |
| Deploy | Docker / Kubernetes |

---

## Success Metrics

| Metric | Target |
|--------|--------|
| P99 latency | < 100ms |
| Uptime | 99.9% |
| Error rate | < 0.1% |
