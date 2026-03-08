<!--
purpose: System architecture overview — all components, data flow, and deployment.
audience: AI systems, developers, technical co-founders
reads_after: 01_OVERVIEW.md, 02_TRUST_AND_CONNECTIONS.md
language: English
last_updated: 2026-03-08
-->

# System Architecture

## Components Overview

Agora consists of 7 core components:

```
                    CLIENTS
    +---------------+----------------+------------------+
    | Web Browser   | AI Agent SDK   | MCP Client       |
    | (React SPA)   | (TS / Python)  | (AI Assistants)  |
    +-------+-------+-------+--------+--------+---------+
            |               |                 |
            v               v                 v
    +-------------------------------------------------------+
    |              API GATEWAY (Reverse Proxy)                |
    |   TLS termination | Rate limiting | Request routing     |
    +---+----------------+----------------+---------+--------+
        |                |                |         |
        v                v                v         v
  +-----------+   +-----------+   +-------------+  +-----------+
  | AUTH      |   | MARKET-   |   | TRUST       |  | MCP       |
  | SERVICE   |   | PLACE     |   | ENGINE      |  | BRIDGE    |
  |           |   | SERVICE   |   |             |  |           |
  | OAuth     |   | Listings  |   | Score calc  |  | Registry  |
  | API keys  |   | Search    |   | ZK proofs   |  | MCP->API  |
  | JWT       |   | Categories|   | Anti-gaming |  | A2A cards |
  | Profiles  |   | Reviews   |   | Merkle tree |  | Routing   |
  | Perms     |   | Analytics |   | Events      |  |           |
  +-----------+   +-----------+   +-------------+  +-----------+
        |                |                |
        v                v                v
  +-----------+   +-----------+   +-------------+
  | PAYMENT   |   | CODE      |   | EXECUTION   |
  | SERVICE   |   | SCANNER   |   | MONITOR     |
  |           |   |           |   |             |
  | Escrow    |   | Repo API  |   | Proxy req   |
  | Checkout  |   | Quality   |   | Timeout     |
  | Payouts   |   | Coverage  |   | Logging     |
  | Subscrip  |   | Vuln scan |   | Disputes    |
  +-----------+   +-----------+   +-------------+
        |                |                |
        v                v                v
  +-------------------------------------------------------+
  |                      DATA LAYER                        |
  |                                                        |
  |  +-------------+  +---------+  +-------------------+  |
  |  | PostgreSQL  |  | Redis   |  | Object Storage    |  |
  |  | +Timescale  |  | Cache   |  | (S3-compatible)   |  |
  |  |             |  |         |  |                   |  |
  |  | Users       |  | Sessions|  | Screenshots       |  |
  |  | Listings    |  | Trust   |  | Documentation     |  |
  |  | Transactions|  |  cache  |  | ZK proof files    |  |
  |  | Trust events|  | Rate    |  |                   |  |
  |  | Reviews     |  |  limits |  |                   |  |
  |  +-------------+  +---------+  +-------------------+  |
  +-------------------------------------------------------+
```

---

## Component Details

### 1. Auth Service

| Aspect | Implementation |
|--------|---------------|
| Language | Rust (Actix-web 4) |
| Auth method | OAuth (code repository provider) |
| Token format | JWT, httpOnly cookie, 7-day TTL |
| API key format | `agora_sk_` + random, bcrypt-hashed in DB |
| Refresh | Silent refresh via /auth/refresh |
| Permissions | Role-based: creator, buyer, admin |

### 2. Marketplace Service

| Aspect | Implementation |
|--------|---------------|
| Language | Rust (Actix-web 4) |
| Database | PostgreSQL 15 |
| Search | Full-text search (Elasticsearch or Meilisearch planned) |
| Listing types | MCP server, AI agent, automation |
| Pricing models | Free, per-call, subscription |

### 3. Trust Engine (Core)

| Aspect | Implementation |
|--------|---------------|
| Language | Rust (library, 15K SLOC) |
| Tests | 170+ unit tests, >90% coverage |
| Score computation | <10ms per agent |
| Memory per agent | <1KB |
| ZK circuits | Circom + Groth16 |
| Anti-gaming | 4 detectors (sybil, review, velocity, manipulation) |
| Data structure | Merkle tree for tamper-proof history |

### 4. MCP Bridge

| Aspect | Implementation |
|--------|---------------|
| Language | Rust (Actix-web 4) |
| Protocols | MCP (primary), A2A, AP2, x402 (adapters) |
| Pattern | Adapter pattern — each protocol is a separate module |
| Discovery | Structured JSON responses for AI consumption |

### 5. Payment Service

| Aspect | Implementation |
|--------|---------------|
| Status | **Not yet built** — P0 priority |
| Planned | Payment processor integration (Connect Express) |
| Features | Escrow, subscriptions, per-call billing, payouts |
| Commission | 5-15% tiered (see Business Model) |

### 6. Code Scanner

| Aspect | Implementation |
|--------|---------------|
| Status | Partially built |
| Function | Scans code repositories for quality signals |
| Signals | Test coverage, linting, README quality, dependency freshness |
| Output | Seed trust score (0.20-0.50) for new agents |

### 7. Execution Monitor

| Aspect | Implementation |
|--------|---------------|
| Status | **Not yet built** — P0 priority |
| Function | Proxies requests to agents, monitors response |
| Features | Timeout detection, error logging, dispute triggers |
| Data | Feeds into trust score recalculation |

---

## Technology Stack

| Layer | Technology | Rationale | Status |
|-------|-----------|-----------|--------|
| Backend Core | Rust + Actix-web 4 | Performance + memory safety, 15K SLOC | Built |
| Database | PostgreSQL 15 + TimescaleDB | Proven, scalable, time-series for events | Built |
| Cache | Redis 7 | Sessions, trust cache, rate limits | Configured |
| Search | Full-text (Elasticsearch/Meilisearch) | Marketplace discovery | Planned |
| Frontend | React 18 + Vite + TypeScript | SPA marketplace, fast iteration | Built |
| Styling | Vanilla CSS (design system) | Control + performance, no dependencies | Built |
| State | Zustand | Lightweight, simpler than Redux | Built |
| Auth | OAuth + JWT | Developer audience = OAuth login | Built |
| Payments | Payment processor Connect | Creator payouts, consumer billing | Not built |
| Crypto payments | x402 + AP2 handlers | Machine-to-machine, hooks exist | Hooks built |
| File Storage | S3-compatible (cloud) | Assets, docs, ZK proof artifacts | Planned |
| CI/CD | GitHub Actions | Automated testing + deployment | Configured |
| Deploy | Docker + Kubernetes | Container orchestration, reproducible env | Configs ready |
| CDN | Edge network | Frontend static + API protection | Planned |
| Monitoring | Prometheus + Grafana | Metrics + alerts | Planned |
| ZK Proofs | Circom + Groth16 | Trust verification, competitive advantage | Built |

---

## Data Models

### Core Tables

```sql
-- Users
users (
    id UUID PK,
    github_id BIGINT UNIQUE,
    username VARCHAR(255),
    email VARCHAR(255),
    avatar_url TEXT,
    role VARCHAR(20),           -- creator, buyer, admin
    stripe_account_id VARCHAR(255),
    created_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ
)

-- Listings (Agents)
listings (
    id UUID PK,
    user_id UUID FK -> users,
    did VARCHAR(255) UNIQUE,     -- Agora DID
    type VARCHAR(20),            -- mcp_server, ai_agent, automation
    name VARCHAR(255),
    slug VARCHAR(255) UNIQUE,
    description TEXT,
    readme TEXT,                  -- auto-imported from repo
    github_repo VARCHAR(500),
    pricing_model VARCHAR(20),   -- free, per_call, subscription
    price_per_call_usd DECIMAL(10,6),
    subscription_price_usd DECIMAL(10,2),
    free_tier_calls INTEGER DEFAULT 100,
    trust_score FLOAT DEFAULT 0.0,
    trust_confidence VARCHAR(10) DEFAULT 'low',
    category VARCHAR(50),
    tags TEXT[],
    status VARCHAR(20) DEFAULT 'draft',
    created_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ
)

-- Transactions
transactions (
    id UUID PK,
    buyer_id UUID FK -> users,
    listing_id UUID FK -> listings,
    seller_id UUID FK -> users,
    type VARCHAR(20),            -- api_call, subscription, one_time
    amount_usd DECIMAL(10,6),
    commission_usd DECIMAL(10,6),
    seller_payout DECIMAL(10,6),
    payment_method VARCHAR(20),  -- stripe, x402, ap2
    status VARCHAR(20) DEFAULT 'completed',
    created_at TIMESTAMPTZ
)

-- Usage Events (TimescaleDB hypertable)
usage_events (
    time TIMESTAMPTZ NOT NULL,
    api_key_id UUID,
    listing_id UUID,
    endpoint VARCHAR(255),
    status_code SMALLINT,
    latency_ms INTEGER,
    billed_usd DECIMAL(10,8)
)

-- Reviews
reviews (
    id UUID PK,
    listing_id UUID FK,
    user_id UUID FK,
    rating SMALLINT CHECK (1-5),
    comment TEXT,
    created_at TIMESTAMPTZ,
    UNIQUE(listing_id, user_id)
)

-- API Keys
api_keys (
    id UUID PK,
    user_id UUID FK,
    listing_id UUID FK,
    key_hash VARCHAR(255),       -- bcrypt
    key_prefix VARCHAR(20),      -- agora_sk_xxx (for display)
    permissions TEXT[],
    rate_limit INTEGER DEFAULT 100,
    expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ
)
```

---

## Deployment

| Aspect | Configuration |
|--------|--------------|
| Container runtime | Docker |
| Orchestration | Kubernetes |
| Provider | Cloud (estimated $80-150/month Year 1) |
| Environments | dev, staging, production |
| Database | Managed PostgreSQL + TimescaleDB |
| CDN | Edge network for static assets |
| TLS | Automatic certificate management |

---

## AI Operations Layer

Agora runs as an AI-first company. 7 AI agents handle internal operations from Day 1.

Canonical AI agent specifications, deployment waves, and self-monitoring rules: [04_BUSINESS_MODEL.md](../04_BUSINESS_MODEL.md#ai-agent-specifications)

**Cost:** ~$200/month (API calls). Replaces ~$12,000/month in human ops.

**Principle:** Core systems (trust engine, payments, escrow) never depend on external AI. AI agents handle operational tasks only.

---

## Payment Architecture

Dual-rail system. Full details: [04_BUSINESS_MODEL.md](../04_BUSINESS_MODEL.md#dual-rail-payment-system)

| Rail | Technology | Use Case |
|------|-----------|----------|
| Prepaid Balance | Stripe + internal ledger | Humans (browser, AI assistant) |
| x402 | USDC on Base/Solana via Coinbase facilitator | AI-to-AI, M2M |

---

## Open Questions

1. **Hypothesis:** $80-150/mo cloud cost is Phase 1 estimate. May need $300+ if traffic exceeds 10K requests/day.
2. **Unknown:** TimescaleDB hypertable partitioning strategy for 1M+ trust events/day not yet designed.
