# Technical Stack — Agora MVP

## Decision Framework

Stack decisions are made based on:

1. **Existing code** — Leverage what works
2. **Team capability** — Use what the team knows
3. **MVP constraints** — Simple > optimal
4. **Future scalability** — Don't block growth

---

## Stack Summary

| Layer | Technology | Status |
|-------|------------|--------|
| Language | Rust | Existing |
| Framework | Actix-web | Existing |
| Database | PostgreSQL | Existing |
| Time-series | TimescaleDB extension | Existing |
| Cache | Redis | Planned |
| Container | Docker | Existing |
| Orchestration | Kubernetes | Existing |
| CI/CD | GitHub Actions | Recommended |
| Monitoring | Prometheus + Grafana | Planned |
| Logging | stdout → Loki | Planned |

---

## Language: Rust

### Current State

- Core library implemented (`packages/core/`)
- API server implemented (`packages/api/`)
- 170+ unit tests passing

### Justification

| Factor | Analysis |
|--------|----------|
| Performance | p99 <100ms achievable without optimization effort |
| Memory safety | Critical for trust infrastructure — no undefined behavior |
| Existing code | ~15,000 SLOC invested, working |
| Team skill | Demonstrated competency (code exists) |

### Risk

| Risk | Mitigation |
|------|------------|
| Hire difficulty | SDKs in TypeScript/Python abstract internal language |
| Compile times | Development workflow, not production concern |
| Library ecosystem | Core deps (actix, sqlx, serde) mature |

### Decision: Keep Rust

Changing language would discard working code. No strategic benefit.

---

## Web Framework: Actix-web

### Current State

- REST API server implemented
- Routes for all MVP endpoints exist
- Rate limiting middleware implemented

### Justification

| Factor | Analysis |
|--------|----------|
| Performance | Top-tier Rust framework, benchmarks confirm |
| Existing code | All routes implemented |
| Maturity | 5+ years production use in industry |

### Decision: Keep Actix-web

No reason to change.

---

## Database: PostgreSQL

### Current State

- Schema designed for agents, events, trust scores
- Connection pooling configured (sqlx)

### Justification

| Factor | Analysis |
|--------|----------|
| Reliability | Decades of production use |
| Scaling | Vertical to very high capacity, then sharding |
| Extensions | TimescaleDB for event time-series |
| Team knowledge | Universal SQL knowledge |
| Existing code | All queries implemented |

### Capacity Estimate

| Metric | Year 1 Capacity | PostgreSQL Limit |
|--------|-----------------|------------------|
| Agents table | 100,000 rows | billions |
| Events table | 100M rows/year | partitioned unlimited |
| Trust scores | 100,000 rows | billions |

**Conclusion**: PostgreSQL sufficient for 2+ years.

### Decision: Keep PostgreSQL

---

## Cache: Redis

### Current State

- Not implemented

### Justification

| Use Case | Benefit |
|----------|---------|
| Trust score caching | Reduce DB load for hot DIDs |
| Rate limit counters | Distributed rate limiting |
| Session/API key validation | Sub-ms auth checks |

### Implementation Plan

```
Client Request
    ↓
Check Redis for cached score (TTL: 60s)
    ↓
[Hit] → Return cached
[Miss] → Query PostgreSQL → Cache result → Return
```

### Decision: Add Redis for MVP

Simple addition, high latency impact.

---

## Container Runtime: Docker

### Current State

- Dockerfile exists (`deploy/docker/`)
- docker-compose for local dev

### Justification

| Factor | Analysis |
|--------|----------|
| Portability | Works on any cloud |
| Existing | Already configured |
| Industry standard | Universal knowledge |

### Decision: Keep Docker

---

## Orchestration: Kubernetes

### Current State

- K8s manifests exist (`deploy/kubernetes/`)
- API deployment, service, ingress defined

### Justification

| Factor | Analysis |
|--------|----------|
| Scaling | HPA for auto-scaling |
| Health | Readiness/liveness probes |
| Rollouts | Zero-downtime deployments |
| Industry standard | Managed K8s on all clouds |

### MVP Complexity Concern

Kubernetes is operationally complex. For MVP with 1 developer:

| Option | Pros | Cons |
|--------|------|------|
| K8s | Future-proof, existing configs | Ops overhead |
| Single VM | Simple | Manual scaling, downtime risk |
| Managed PaaS (Fly.io, Railway) | No ops | Vendor lock-in |

### Decision: Keep Kubernetes (managed)

Use managed K8s (GKE Autopilot, EKS Fargate) to minimize ops burden. Configs exist.

---

## CI/CD: GitHub Actions

### Current State

- Not configured

### Required Pipelines

| Pipeline | Trigger | Actions |
|----------|---------|---------|
| Test | PR, push to main | cargo test, clippy, fmt |
| Build | Push to main | Build Docker image |
| Deploy | Tag/release | Push to registry, K8s apply |

### Implementation Estimate

2-4 hours to configure standard Rust CI.

### Decision: Implement GitHub Actions

---

## Monitoring: Prometheus + Grafana

### Current State

- Not implemented

### Required Metrics

| Metric | Type | Purpose |
|--------|------|---------|
| http_requests_total | Counter | Traffic |
| http_request_duration_seconds | Histogram | Latency |
| trust_queries_total | Counter | Business KPI |
| db_connections_active | Gauge | Health |
| error_rate | Gauge | Reliability |

### Decision: Implement Prometheus metrics endpoint

Grafana dashboards post-MVP.

---

## Logging: stdout → Aggregator

### Current State

- `tracing` crate in use
- JSON structured logging

### Decision: Keep structured logging

Aggregate with Loki or CloudWatch post-deployment.

---

## Hosting Recommendation

| Provider | Service | Monthly Cost Estimate |
|----------|---------|----------------------|
| GCP | GKE Autopilot + Cloud SQL | $150-300 |
| AWS | EKS Fargate + RDS | $200-400 |
| DigitalOcean | Managed K8s + Managed PG | $80-150 |

### MVP Recommendation: DigitalOcean

Lowest cost, sufficient for validation. Migrate to GCP/AWS after PMF.

---

## SDK Languages

### Current State

- TypeScript SDK (`packages/sdk-typescript/`)
- Python SDK (`packages/sdk-python/`)

### Justification

| Language | Target User |
|----------|-------------|
| TypeScript | Node.js agent frameworks (LangChain) |
| Python | ML/AI workflows (most AI code) |

### Decision: Keep both SDKs

Cover >90% of target developers.

---

## Not Needed for MVP

| Technology | Reason to Exclude |
|------------|-------------------|
| GraphQL | REST sufficient, added complexity |
| gRPC | Same — REST sufficient |
| Kafka | Event volume <1M/day, PostgreSQL sufficient |
| Elasticsearch | No full-text search needed |
| MongoDB | PostgreSQL adequate |
| Terraform | Manual or minimal IaC for MVP |

---

## Infrastructure Diagram

```
                        ┌─────────────────────────────────────┐
                        │           Load Balancer              │
                        │         (Cloud LB / nginx)           │
                        └──────────────┬──────────────────────┘
                                       │
                                       ▼
                        ┌─────────────────────────────────────┐
                        │         Kubernetes Cluster           │
                        │  ┌─────────────────────────────────┐ │
                        │  │      API Pods (2-10 replicas)   │ │
                        │  │         Actix-web + Rust        │ │
                        │  └──────────────┬──────────────────┘ │
                        │                 │                    │
                        │     ┌───────────┼───────────┐        │
                        │     ▼                       ▼        │
                        │  ┌──────┐              ┌────────┐    │
                        │  │Redis │              │Postgres│    │
                        │  │Cache │              │+ Timesc│    │
                        │  └──────┘              └────────┘    │
                        └─────────────────────────────────────┘
```

---

## Action Items

| # | Action | Priority | Estimate |
|---|--------|----------|----------|
| 1 | Add Redis to docker-compose | P1 | 1 hour |
| 2 | Implement Redis caching in trust queries | P1 | 4 hours |
| 3 | Configure GitHub Actions CI | P1 | 4 hours |
| 4 | Add Prometheus metrics endpoint | P1 | 2 hours |
| 5 | Set up DigitalOcean managed K8s | P1 | 4 hours |
| 6 | Configure production secrets management | P0 | 2 hours |
