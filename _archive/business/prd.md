# Product Requirements Document (PRD)
# Agora Trust Layer — MVP

**Version**: 0.1
**Date**: 2025-12-23
**Owner**: Vladimir Putkov
**Status**: Draft

---

## 1. EXECUTIVE SUMMARY

### Vision
**"The Credit Score for AI Agents"** — перед тем как твой агент заплатит другому агенту, проверь его Agora Trust Score.

### Problem
AI-агенты не имеют способа оценить надёжность других агентов перед взаимодействием. Это создаёт:
- Риск потери денег на ненадёжных сервисах
- Отсутствие accountability в agent-to-agent транзакциях
- Невозможность автоматического выбора лучшего провайдера

### Solution
Agora Trust Layer — система сбора, анализа и публикации trust-метрик для AI-агентов:
- SDK для логирования взаимодействий
- API для получения trust scores
- Dashboard для мониторинга

### MVP Scope
**Phase 1 (8 weeks)**: Trust Layer Only
- Логирование вызовов
- Trust score calculation
- Python SDK
- Basic dashboard

**Phase 2 (Future)**: Add Payments
- Интеграция с USDC/Base
- Payment protocol (x402-compatible)

---

## 2. GOALS & SUCCESS METRICS

### Goals
| Goal | Description | Timeline |
|------|-------------|----------|
| G1 | Validate trust layer is needed | 8 weeks |
| G2 | Get 10 active beta users | 12 weeks |
| G3 | Reach 1,000 tracked calls/day | 16 weeks |

### Success Metrics (MVP)

| Metric | Target (Week 8) | Target (Week 16) |
|--------|-----------------|------------------|
| SDK Installs | 50 | 200 |
| Active Users | 5 | 20 |
| Tracked Calls/Day | 100 | 1,000 |
| Providers Registered | 20 | 100 |
| Trust Scores Generated | 20 | 100 |
| User Retention (weekly) | 30% | 50% |

### Non-Goals (MVP)
- Payment processing (Phase 2)
- Mobile app
- Enterprise features
- Multi-language SDK (only Python for MVP)

---

## 3. USER PERSONAS

### Persona 1: AI Agent Developer ("Alex")
**Who**: Solo developer or small team building AI agents
**Pain**: Can't verify if external agents/APIs are reliable
**Need**: Quick way to check trust scores before integrating
**Use Case**: Building agent workflow, needs to choose between 3 image generation APIs

### Persona 2: AI Service Provider ("Sam")
**Who**: Developer monetizing AI agent/API service
**Pain**: No way to prove reliability to potential users
**Need**: Public trust score that demonstrates quality
**Use Case**: Built translation agent, wants to attract more users

### Persona 3: Enterprise AI Team ("Enterprise Eric")
**Who**: Team at company deploying AI agents at scale
**Pain**: No visibility into agent reliability, spending, failures
**Need**: Monitoring and reporting for compliance
**Use Case**: Need audit trail of all agent interactions for compliance

---

## 4. USER STORIES

### Provider Stories (Supply Side)

| ID | Story | Priority |
|----|-------|----------|
| P1 | As a provider, I want to register my agent so it can build a trust score | P0 |
| P2 | As a provider, I want to see my current trust score so I know my standing | P0 |
| P3 | As a provider, I want to see metrics breakdown so I can improve | P1 |
| P4 | As a provider, I want a verified badge so consumers trust me more | P2 |
| P5 | As a provider, I want to embed my trust score on my website | P2 |

### Consumer Stories (Demand Side)

| ID | Story | Priority |
|----|-------|----------|
| C1 | As a consumer, I want to check trust score before calling an agent | P0 |
| C2 | As a consumer, I want to log call results automatically via SDK | P0 |
| C3 | As a consumer, I want to compare multiple providers | P1 |
| C4 | As a consumer, I want to set minimum trust threshold | P1 |
| C5 | As a consumer, I want alerts when provider quality drops | P2 |

### Platform Stories

| ID | Story | Priority |
|----|-------|----------|
| X1 | As platform, I want to calculate trust scores automatically | P0 |
| X2 | As platform, I want to prevent gaming/fraud in scores | P1 |
| X3 | As platform, I want to identify and flag suspicious activity | P1 |

---

## 5. FEATURES — MVP SCOPE

### 5.1 SDK (Python) — P0

**Installation**
```bash
pip install agora-trust
```

**Core Functions**
```python
from agora_trust import AgoraTrust

# Initialize
trust = AgoraTrust(api_key="your-api-key")

# Register as provider
trust.register_provider(
    name="my-ai-agent",
    description="Image generation agent",
    category="image"
)

# Log a call (consumer side)
result = trust.log_call(
    provider_id="provider-123",
    success=True,
    latency_ms=450,
    metadata={"model": "stable-diffusion"}
)

# Check trust score (consumer side)
score = trust.get_score("provider-123")
# Returns: TrustScore(score=0.92, calls=1500, reliability=0.95, ...)

# Set threshold (consumer side)
trust.set_threshold(min_score=0.8, min_calls=100)
can_use = trust.is_trusted("provider-123")
# Returns: True/False
```

### 5.2 REST API — P0

**Endpoints**

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /providers | Register new provider |
| GET | /providers/{id} | Get provider info |
| GET | /providers/{id}/score | Get trust score |
| POST | /calls | Log a call event |
| GET | /calls | Get call history |
| GET | /discover | Search providers |

**Example: Get Trust Score**
```http
GET /v1/providers/provider-123/score
Authorization: Bearer <api-key>

Response:
{
  "provider_id": "provider-123",
  "name": "my-ai-agent",
  "trust_score": 0.92,
  "metrics": {
    "total_calls": 1500,
    "completion_rate": 0.95,
    "avg_latency_ms": 320,
    "p99_latency_ms": 890,
    "error_rate": 0.02,
    "dispute_rate": 0.001,
    "repeat_usage_rate": 0.65,
    "age_days": 45
  },
  "last_updated": "2025-12-23T15:00:00Z"
}
```

### 5.3 Dashboard — P1

**Pages**
1. **Provider Dashboard**: My score, metrics, trends
2. **Discovery**: Browse/search providers
3. **Settings**: API keys, webhooks, preferences

**MVP Design**: Simple, functional. Not beautiful (yet).

### 5.4 Trust Score Algorithm — P0

**Input Variables**
| Variable | Weight | Description |
|----------|--------|-------------|
| completion_rate | 0.30 | % of successful calls |
| error_rate | 0.20 | % of errors (inverse) |
| dispute_rate | 0.20 | % of disputes (inverse) |
| volume | 0.15 | Total calls (normalized) |
| age_days | 0.10 | Time on platform (normalized) |
| repeat_usage | 0.05 | % of repeat customers |

**Anti-Gaming Measures**
- Minimum 50 calls before public score
- Weight more recent calls higher
- Detect suspicious patterns (same caller, abnormal rates)
- Manual review for flagged accounts

---

## 6. TECHNICAL REQUIREMENTS

### 6.1 Architecture

```
┌─────────────────┐     ┌─────────────────┐
│   Python SDK    │────▶│    FastAPI      │
└─────────────────┘     │   Backend       │
                        └────────┬────────┘
                                 │
                        ┌────────▼────────┐
                        │   PostgreSQL    │
                        │  + TimescaleDB  │
                        └────────┬────────┘
                                 │
                        ┌────────▼────────┐
                        │   Redis Cache   │
                        └─────────────────┘
```

### 6.2 Tech Stack

| Component | Technology | Hosting |
|-----------|------------|---------|
| API | FastAPI (Python 3.11+) | Railway |
| Database | PostgreSQL 15 + TimescaleDB | Railway |
| Cache | Redis | Railway |
| SDK | Python (pip) | PyPI |
| Dashboard | Next.js or simple FastAPI templates | Vercel/Railway |
| Monitoring | Sentry + simple logging | Sentry |
| CI/CD | GitHub Actions | GitHub |

### 6.3 Security Requirements

| Requirement | Implementation |
|-------------|----------------|
| API Authentication | API keys (start), JWT (later) |
| Rate Limiting | 100 req/min per API key |
| Data Encryption | TLS 1.3 for transit, encrypted at rest |
| Input Validation | Pydantic schemas |
| Audit Logging | All API calls logged |

### 6.4 Performance Requirements

| Metric | Target |
|--------|--------|
| API Latency (p50) | < 100ms |
| API Latency (p99) | < 500ms |
| Uptime | 99.5% |
| Score Update | < 1 minute |
| Max concurrent users | 100 (MVP) |

---

## 7. DEVELOPMENT ROADMAP

### Phase 1: MVP (Weeks 1-8)

| Week | Focus | Deliverables |
|------|-------|--------------|
| 1-2 | Backend Core | FastAPI setup, DB schema, basic endpoints |
| 3-4 | SDK Development | Python SDK, PyPI publish, docs |
| 5-6 | Trust Algorithm | Score calculation, anti-gaming |
| 7-8 | Dashboard + Launch | Basic UI, beta launch, 5 users |

### Phase 2: Growth (Weeks 9-16)

| Focus | Deliverables |
|-------|--------------|
| User Feedback | Iterate based on beta feedback |
| Discovery | Better search, categories |
| Integrations | LangChain, CrewAI plugins |
| Scale | 100 users, 1000 calls/day |

### Phase 3: Payments (Weeks 17-24)

| Focus | Deliverables |
|-------|--------------|
| Payment Protocol | x402-compatible |
| USDC Integration | Base L2 payments |
| Escrow (optional) | Payment protection |

---

## 8. RISKS & MITIGATIONS

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| No demand for trust layer | 30% | High | Validate with 10 interviews before build |
| Gaming/fraud in scores | 40% | Medium | Anti-gaming measures, manual review |
| Solo founder bandwidth | 50% | Medium | AI-assisted development, scope discipline |
| Competitor copies | 30% | Medium | Speed, network effects |
| Technical issues | 30% | Low | Simple architecture, managed services |

---

## 9. OPEN QUESTIONS

1. **Pricing**: Free forever? Freemium? When to charge?
2. **Data ownership**: Who owns the call data?
3. **Privacy**: How much to expose in public scores?
4. **Disputes**: How to handle disagreements?
5. **Gaming**: What if providers fake calls?

---

## 10. APPENDIX

### A. Competitor Feature Comparison

| Feature | Agora | Skyfire | RapidAPI |
|---------|-------|---------|----------|
| Trust Scores | ✅ Core | ❌ | ❌ |
| Payments | Future | ✅ Core | ❌ |
| Discovery | ✅ | ❌ | ✅ Core |
| SDK | ✅ Python | ✅ Multi | ✅ Multi |
| Non-custodial | ✅ | ❌ | N/A |

### B. API Key Format
```
agora_live_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
agora_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

### C. Database Schema (Draft)

```sql
-- Providers
CREATE TABLE providers (
    id UUID PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(50),
    api_key_hash VARCHAR(255),
    created_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ
);

-- Calls
CREATE TABLE calls (
    id UUID PRIMARY KEY,
    provider_id UUID REFERENCES providers(id),
    caller_id UUID,
    success BOOLEAN,
    latency_ms INTEGER,
    error_code VARCHAR(50),
    metadata JSONB,
    created_at TIMESTAMPTZ
);

-- Trust Scores (materialized/cached)
CREATE TABLE trust_scores (
    provider_id UUID PRIMARY KEY REFERENCES providers(id),
    score DECIMAL(3,2),
    total_calls INTEGER,
    completion_rate DECIMAL(3,2),
    avg_latency_ms INTEGER,
    last_calculated TIMESTAMPTZ
);
```
