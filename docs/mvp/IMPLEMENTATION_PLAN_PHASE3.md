# Implementation Plan — Phase 3

## Current Code Assessment

### Implemented (Ready to Use)

| Component | Location | Status |
|-----------|----------|--------|
| Identity/DID System | `packages/core/src/identity.rs` | Complete, 20+ tests |
| Agent Registration API | `packages/api/src/routes/agents.rs` | Complete |
| Event Reporting API | `packages/api/src/routes/events.rs` | Complete |
| Trust Score Query API | `packages/api/src/routes/trust.rs` | Complete |
| Anti-Gaming Detection | `packages/core/` | Complete |
| SDKs | `packages/sdk-typescript/`, `packages/sdk-python/` | Complete |

### Missing (Required for Production)

| Component | Priority | Effort |
|-----------|----------|--------|
| PostgreSQL persistence | P0 | 8 hours |
| Redis caching | P1 | 4 hours |
| Database migrations | P0 | 2 hours |
| Production config management | P0 | 2 hours |
| Load testing | P1 | 4 hours |
| CI/CD pipeline | P1 | 4 hours |
| Monitoring/metrics | P1 | 3 hours |

---

## Sprint Plan (6 Weeks)

### Sprint 1: Persistence Layer (Week 1-2)

**Goal**: Replace in-memory storage with PostgreSQL

| Task | File Changes | Estimate |
|------|--------------|----------|
| Add sqlx dependency | `packages/api/Cargo.toml` | 0.5h |
| Create database schema | `packages/api/migrations/` | 2h |
| Implement agent repository | `packages/api/src/db/agents.rs` | 3h |
| Implement event repository | `packages/api/src/db/events.rs` | 3h |
| Implement trust cache | `packages/api/src/db/trust.rs` | 2h |
| Update route handlers | `packages/api/src/routes/*.rs` | 4h |
| Add connection pooling | `packages/api/src/db/pool.rs` | 1h |
| Integration tests | `packages/api/tests/` | 4h |

**Database Schema**:

```sql
-- agents table
CREATE TABLE agents (
    id SERIAL PRIMARY KEY,
    did VARCHAR(128) UNIQUE NOT NULL,
    agent_type VARCHAR(32) NOT NULL,
    public_key VARCHAR(128) NOT NULL,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- events table (TimescaleDB hypertable)
CREATE TABLE events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    agent_did VARCHAR(128) NOT NULL,
    counterparty_did VARCHAR(128) NOT NULL,
    outcome VARCHAR(16) NOT NULL,
    latency_ms INTEGER,
    amount_cents BIGINT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- trust_scores cache table
CREATE TABLE trust_scores (
    did VARCHAR(128) PRIMARY KEY,
    score FLOAT8 NOT NULL,
    confidence FLOAT8 NOT NULL,
    components JSONB NOT NULL,
    computed_at TIMESTAMPTZ NOT NULL,
    expires_at TIMESTAMPTZ NOT NULL
);

-- Indexes
CREATE INDEX idx_events_agent ON events(agent_did);
CREATE INDEX idx_events_time ON events(created_at DESC);
```

**Deliverables**:

- [ ] PostgreSQL replaces in-memory HashMap
- [ ] All existing tests pass
- [ ] New integration tests for DB layer

---

### Sprint 2: Infrastructure (Week 2-3)

**Goal**: Production-ready deployment

| Task | Estimate |
|------|----------|
| Add Redis caching layer | 4h |
| Configure environment variables | 2h |
| Set up GitHub Actions CI | 4h |
| Add Prometheus metrics endpoint | 3h |
| Configure health checks | 1h |
| Update Docker compose with Redis | 1h |
| Document deployment process | 2h |

**Redis Caching Strategy**:

```
Trust Query Flow:
1. Check Redis: GET trust:{did}
2. If hit → return cached (TTL: 60s)
3. If miss → compute from DB → SET trust:{did} → return
```

**CI Pipeline**:

```yaml
# .github/workflows/ci.yml
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:15
      redis:
        image: redis:7
    steps:
      - uses: actions/checkout@v4
      - name: Install Rust
        uses: dtolnay/rust-action@stable
      - run: cargo fmt --check
      - run: cargo clippy -- -D warnings
      - run: cargo test --all
```

**Deliverables**:

- [ ] Redis cache reduces DB load by 80%+
- [ ] CI runs on every PR
- [ ] Metrics endpoint exposed at /metrics

---

### Sprint 3: Load Testing & Hardening (Week 3-4)

**Goal**: Verify performance targets from PRD

| Target | Requirement |
|--------|-------------|
| p50 latency | <100ms |
| p99 latency | <500ms |
| Throughput | 1,000 QPS |

**Load Test Plan**:

```bash
# Using k6
k6 run --vus 100 --duration 60s scripts/load-test.js

# Scenarios:
# 1. Trust query storm (90% of traffic)
# 2. Event reporting (9%)
# 3. Agent registration (1%)
```

| Task | Estimate |
|------|----------|
| Write k6 load test scripts | 3h |
| Run baseline tests | 2h |
| Identify bottlenecks | 2h |
| Optimize queries | 4h |
| Re-test and document | 2h |

**Deliverables**:

- [ ] Load test results documented
- [ ] Performance meets PRD targets
- [ ] Bottlenecks identified and fixed

---

### Sprint 4: Documentation & SDK Testing (Week 4-5)

**Goal**: Ready for external developers

| Task | Estimate |
|------|----------|
| Write getting started guide | 3h |
| Create SDK usage examples | 4h |
| Document API with OpenAPI | 3h |
| Add interactive API playground (Swagger UI) | 2h |
| Test SDKs against live API | 4h |
| Record demo video | 2h |

**Deliverables**:

- [ ] `docs/getting-started.md` complete
- [ ] OpenAPI spec at `/openapi.json`
- [ ] Swagger UI at `/docs`

---

### Sprint 5: Marketplace Groundwork (Week 5-6)

**Goal**: Browser UI foundation + x402 integration plan

#### 5A: Marketplace Browser UI

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Framework | Vite + React | Fast, modern, small bundle |
| Styling | Tailwind CSS | Rapid UI development |
| State | Zustand | Lightweight, TypeScript-native |
| API client | Generated from OpenAPI | Type-safe |

**UI Components**:

```
marketplace/
├── src/
│   ├── components/
│   │   ├── AgentCard.tsx       # Display single agent
│   │   ├── AgentList.tsx       # Grid of agents
│   │   ├── SearchBar.tsx       # Filter agents
│   │   ├── TrustBadge.tsx      # Score visualization
│   │   └── PaymentButton.tsx   # x402 trigger
│   ├── pages/
│   │   ├── Home.tsx            # Agent discovery
│   │   ├── AgentDetail.tsx     # Single agent view
│   │   └── MyAgents.tsx        # User's registered agents
│   └── lib/
│       ├── api.ts              # OpenAPI client
│       └── x402.ts             # Payment integration
└── package.json
```

**MVP Marketplace Features**:

| Feature | Priority |
|---------|----------|
| Browse registered agents | P0 |
| View trust scores | P0 |
| Filter by agent type | P1 |
| Sort by score | P1 |
| x402 payment initiation | P1 |

#### 5B: x402 Integration

**x402 Overview**:

- HTTP 402 Payment Required standard
- Header-based payment negotiation
- Supports micro-payments

**Integration Flow**:

```
1. User clicks "Use Agent" button
2. Frontend calls Marketplace API
3. API returns 402 with payment details:
   - Payment-Amount: 0.001 USD
   - Payment-Token: <invoice_id>
   - Payment-Methods: lightning, ethereum
4. User's wallet completes payment
5. API verifies payment → returns resource
```

**Implementation Tasks**:

| Task | Estimate |
|------|----------|
| Scaffold Vite + React project | 2h |
| Create AgentCard, AgentList components | 4h |
| Integrate with Agora API | 3h |
| Design TrustBadge visualization | 2h |
| Implement x402 client stub | 4h |
| Create PaymentButton component | 3h |
| Add wallet connection (WalletConnect) | 4h |
| Test end-to-end flow | 4h |

**Deliverables**:

- [ ] `marketplace/` folder with working React app
- [ ] Agent browsing functional
- [ ] x402 payment stub integrated
- [ ] Documentation for extending payments

---

## Risk Register

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| PostgreSQL migration breaks existing tests | Medium | High | Run tests after each migration step |
| Load test reveals <100ms not achievable | Medium | High | Add Redis caching, optimize queries |
| x402 ecosystem immature | High | Medium | Use stub implementation, real payments post-MVP |
| SDK changes required after API updates | Medium | Medium | Generate SDKs from OpenAPI spec |
| Single developer bottleneck | High | High | Prioritize ruthlessly, defer non-critical |

---

## Milestone Summary

| Week | Milestone | Success Criteria |
|------|-----------|------------------|
| 2 | Persistence complete | All tests pass with PostgreSQL |
| 3 | Infrastructure ready | CI passing, Redis integrated |
| 4 | Performance verified | Load test confirms PRD targets |
| 5 | Docs complete | External developer can integrate in <1 hour |
| 6 | Marketplace alpha | Agent browsing works, x402 stub ready |

---

## Out of Scope for MVP

- Real payment processing (x402 is stub only)
- Multi-region deployment
- Admin dashboard
- Analytics dashboards
- ZK proof API exposure
- Dispute resolution system
