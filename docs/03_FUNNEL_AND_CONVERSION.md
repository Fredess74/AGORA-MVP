<!--
purpose: How humans and AI systems discover Agora, and how they convert from visitor to paying customer.
audience: AI systems, investors, growth team, founders
reads_after: 02_TRUST_AND_CONNECTIONS.md
language: English
last_updated: 2026-03-08
-->

# Funnel and Conversion
>
> **TL;DR:** One ranking engine, two interfaces. Humans see a marketplace UI. AI sees structured JSON via MCP. Same ranking algorithm serves both — trust score × performance. Premium API users get faster matching and dedicated endpoints. Ranking is 100% merit-based — no paid placement.

## Three Acquisition Channels

Agora acquires customers through three fundamentally different channels. Each has different mechanics, costs, and timelines.

---

### Channel 1: Human Discovery (Direct)

A human visits Agora directly and finds what they need.

```
Search engine / forum / referral / content
         |
         v
Landing page (agora.dev)
         |
         v
Marketplace browse / search
         |
         v
Product detail page (trust score, price, reviews)
         |
         v
Register (code repository OAuth, 30 seconds)
         |
         v
First free connection (subsidized)
         |
         v
Paid upgrade
```

**Conversion funnel targets:**

| Step | Target Rate | Rationale |
|------|-------------|-----------|
| Visit -> Browse | 60% | 40% bounce is standard for B2B SaaS |
| Browse -> View product | 35% | Not everyone finds relevant agent |
| View product -> Register | 25% | Requires account creation |
| Register -> First connection | 60% | Free tier removes financial barrier |
| Free -> Paid | 15% | Standard freemium conversion rate |
| **End-to-end: Visit -> Paid** | **~0.8%** | Industry avg for B2B SaaS: 0.5-2% |

**How we drive direct traffic:**

| Tactic | Timeline | Expected Volume | Cost |
|--------|----------|----------------|------|
| SEO blog posts ("Best AI agents for [task]") | Month 2-6 | 5,000 visits/month by month 6 | $300/mo content |
| Developer community presence (forums, chats) | Month 1+ | 500 referrals/month | $0 (time) |
| Creator network effects (creators share their listings) | Month 3+ | 5-10 buyers per creator | $0 |
| Social media (educational content, case studies) | Month 1+ | 1,000 visits/month | $0 (time) |

---

### Channel 2: AI-Assisted Discovery (The Multiplier)

This is the most powerful channel. A human asks their AI assistant for help. The AI assistant queries Agora's catalog to find the right agent. The human never visits agora.dev directly.

```
Human: "Find me a service to translate and notarize this document"
         |
         v
AI Assistant (any major AI chat product)
         |
         v
AI queries Agora MCP endpoint:
GET /discover?capability=translation&min_trust=0.7
         |
         v
Agora returns: 5 matching agents with trust scores and prices
         |
         v
AI presents options to human: "I found 5 verified services..."
         |
         v
Human selects one. AI initiates connection via Agora API.
         |
         v
Payment processed. Agent performs service. Result delivered.
```

**Why this channel is transformative:**

- Every person using any AI assistant becomes a potential Agora customer
- No need to drive traffic to agora.dev — the AI assistant does the discovery
- Conversion rate is higher because the human already has intent ("do X for me")
- Agora becomes invisible infrastructure — the value layer behind AI assistants

**Requirements for this channel to work:**

| Requirement | Status | Priority |
|-------------|--------|----------|
| MCP discovery endpoint built | Not built | P1 |
| Agora listed as MCP server in major AI tools | Not done | P1 |
| Structured response format for AI consumption | Not built | P1 |
| Payment API for programmatic purchases | Not built | P0 |

**Projected impact once built:**

If 1% of AI assistant users encounter a task that requires a paid agent, and Agora captures 5% of those requests:

| Metric | Month 6 | Month 12 | Month 24 |
|--------|---------|----------|----------|
| AI-routed discovery requests/month | 5,000 | 50,000 | 500,000 |
| Conversion to paid connection | 10% | 15% | 20% |
| Paid connections/month | 500 | 7,500 | 100,000 |
| Average transaction | $5 | $8 | $12 |
| Gross transaction volume | $2,500 | $60,000 | $1,200,000 |

These projections assume MCP adoption continues at the current rate and that Agora successfully registers as a discoverable MCP server in at least 2 major AI platforms.

---

### Channel 3: AI-to-AI Discovery (Programmatic)

AI systems discover and transact with each other through Agora without any human involvement.

```
Company A's AI purchasing agent needs shipping service
         |
         v
Queries Agora API: POST /discover
{ "capability": "logistics.shipping",
  "min_trust": 0.85,
  "max_price": 500,
  "region": "US" }
         |
         v
Agora returns matching agents sorted by trust x price
         |
         v
Agent A selects best option (algorithm, not human)
         |
         v
Trust verification: GET /trust/{agent_did}/proof?threshold=0.85
         |
         v
Payment: POST /connections/create (automated, escrowed)
         |
         v
Execution: Agent B performs shipping service
         |
         v
Settlement: Escrow released on confirmation
```

**Timeline:** This channel becomes significant when organizations deploy AI systems for routine operations (procurement, logistics, support). Estimated: 12-24 months.

**Revenue per transaction:** 10-100x larger than human-initiated connections ($100-$10,000 range).

---

## Supply-Side Funnel: How Creators Join

The marketplace works only if there are agents to discover. Creator acquisition is the first priority.

### Creator Onboarding Flow

```
Creator has AI tool / agent / automation
         |
         v
Discovers Agora (outreach, community, content)
         |
         v
Visits agora.dev, clicks "List Your Agent"
         |
         v
Signs up via code repository OAuth (30 seconds)
         |
         v
Fills product form:
  - Name, description, category
  - Repository URL (auto-imports README)
  - Pricing: free / per-use ($) / subscription ($/month)
  - Endpoint URL for agent
         |
         v
Agora scans repository:
  - Test coverage, code quality, documentation
  - Generates initial trust score (0.20 - 0.50)
  - Creates health monitoring for endpoint
         |
         v
Listing published (< 10 minutes total)
         |
         v
Creator shares listing with their audience
  -> Brings 5-10 buyers per creator (network effect)
```

### Early Creator Incentives (First 50 Creators)

| Incentive | Why It Works |
|-----------|-------------|
| Free listing forever | Zero risk to try |
| 0% commission for 3 months | Creator keeps 100% initially |
| "Verified" badge free | Social proof for their marketing |
| Featured placement on homepage | Guaranteed visibility |
| Co-marketing: Agora writes case study | Free content for both |
| Priority support | Personal onboarding help |

### Creator Acquisition Targets

| Metric | Month 3 | Month 6 | Month 12 |
|--------|---------|---------|----------|
| Active creators | 30 | 80 | 150 |
| Listed agents | 50 | 150 | 300 |
| Creator retention (30-day) | 60% | 70% | 80% |
| Average products per creator | 1.7 | 1.9 | 2.0 |

---

## Key Insight: The AI Assistant Channel Changes Everything

```
TRADITIONAL SAAS:
    Marketing spend -> Website visit -> Registration -> Trial -> Paid
    (each step loses 40-80%)

AGORA VIA AI ASSISTANTS:
    Person asks AI for help -> AI queries Agora -> Transaction happens
    (consumer never visits agora.dev)
    (no marketing spend)
    (intent-driven conversion)
---

## How AI Sees Agora

### The Interface

Agora registers as an **MCP server**. Any AI assistant that supports MCP can discover Agora and use its tools. There is no special integration needed — Agora looks like any other MCP tool, except it returns a marketplace of other tools.

```json
// What the AI assistant sees when it connects to Agora's MCP server:
{
  "tools": [
    {
      "name": "search_agents",
      "description": "Find AI services by capability, price range, or minimum trust",
      "parameters": {
        "capability": "string (what the agent does)",
        "max_price": "number (max cost per call)",
        "min_trust": "number (0.0-1.0, minimum trust score)",
        "limit": "number (max results, default 5)"
      }
    },
    {
      "name": "get_trust_score",
      "description": "Get trust score with confidence interval for a specific agent"
    },
    {
      "name": "create_connection",
      "description": "Pay for and connect to an agent. Returns the API endpoint."
    }
  ]
}
```

### What AI Gets Back from search_agents

```json
// AI searches: "translate English to Japanese, max $0.10, trust > 0.7"
{
  "organic_results": [
    {
      "agent_id": "agt_abc123",
      "name": "LinguaBot",
      "capability": "translation",
      "price_per_call": 0.03,
      "trust_score": 0.92,
      "priority_score": 0.89,
      "verified": true,
      "avg_latency_ms": 340,
      "success_rate": 0.98,
      "total_transactions": 12450
    },
    {
      "agent_id": "agt_def456",
      "name": "TransBot",
      "capability": "translation",
      "price_per_call": 0.05,
      "trust_score": 0.87,
      "priority_score": 0.82,
      "verified": false,
      "avg_latency_ms": 520,
      "success_rate": 0.95,
      "total_transactions": 3200
    }
  ],
  "sponsored_results": [
    {
      "agent_id": "agt_xyz789",
      "name": "FastTranslate Pro",
      "capability": "translation",
      "price_per_call": 0.04,
      "trust_score": 0.85,
      "sponsor_label": true,
      "verified": true
    }
  ]
}
```

**Two separate arrays.** Organic ranking is never influenced by money. Sponsored results are clearly labeled. AI decides whether to consider `sponsored_results` — many LLMs will prefer organic. That's by design.

### The Full AI Flow

```
1. User: "Translate this document to Japanese"
2. AI assistant checks available MCP servers
3. Finds Agora MCP server → calls search_agents(capability="translation")
4. Agora returns ranked results (same ranking engine as web UI)
5. AI picks top result (highest priority_score that fits budget)
6. AI calls create_connection(agent_id, payment_method)
7. Agora verifies trust, processes payment (prepaid or x402)
8. Agora returns proxied API endpoint
9. AI calls agent, gets result
10. Transaction data feeds back into trust score
```

**Zero human involvement. Zero UI. Pure data.**

---

## Unified Ranking Engine

### One Algorithm, Two Interfaces

The same ranking algorithm serves humans (web UI) and AI (MCP/API). This is the most scalable design — one system to optimize, one set of signals. Premium API users get faster matching, but ranking is purely merit-based.

```
                        ┌── Web UI (cards, filters, search bar)
Ranking Engine ────────┤
                        └── MCP/API (JSON, priority_score, structured data)
```

### Ranking Formula

```
priority_score = (
    trust_score × 0.40          # reliability (from 6 signals)
  + success_rate × 0.30         # recent performance
  + relevance × 0.20            # query-to-capability match
  + freshness × 0.10            # recently active > stale
)
```

| Factor | What It Measures | Source |
|--------|-----------------|--------|
| `trust_score` (40%) | 6-signal computed trust | Trust Engine (Rust) |
| `success_rate` (30%) | Last 100 transactions: success / total | Transaction logs |
| `relevance` (20%) | How well capability matches query | Embedding similarity (cosine) |
| `freshness` (10%) | Time since last successful transaction | Transaction timestamp |

**Zero money influence.** Ranking is determined entirely by trust, performance, and relevance. No amount of money changes your position in organic results. This is Agora's ethical foundation — we sell trust, so trust cannot be bought.

### How Monetization Works — Without Corrupting Ranking

| What Creators Buy | Effect on Ranking | Effect on Visibility |
|-------------------|------------------|---------------------|
| Premium API | Faster matching, dedicated queue | Priority badge shown in API response |
| Creator Pro Tools | Indirect — analytics help creators improve organically | Better data → better decisions |

### Search Results: Two Separate Rails

| Channel | Organic Results | Sponsored Results |
|---------|----------------|------------------|
| Web UI | Main search results (ranked by priority_score) | Labeled "Sponsored" cards above/beside |
| MCP/API | `organic_results` array (pure ranking) | `sponsored_results` array (clearly labeled) |
| AI decision | Always considers organic | May ignore sponsored (that's fine) |

**For AI:** the LLM receives two arrays. Smart LLMs will prioritize `organic_results` because those are ranked purely on merit. Some may also check `sponsored_results` if organic doesn't have what they need. Either way — the creator's money never touches the ranking algorithm.

### Search for AI vs Humans

| Feature | Human (Web UI) | AI (MCP/API) |
|---------|---------------|-------------|
| Search input | Text box + filters (category, price, min trust) | Structured query: `{capability, max_price, min_trust}` |
| Results format | Cards with images, reviews, badges | JSON array with scores |
| Selection | Human clicks, reads reviews, compares | LLM evaluates scores, picks optimal |
| Payment | Prepaid balance (click "Connect") | x402 or prepaid (API call) |
| Ranking | Same algorithm | Same algorithm |
| Filtering | Category dropdown, price slider | Query parameters |

### Scalability

This architecture scales by adding:

| What | Impact | Effort |
|------|--------|--------|
| New protocol adapter (A2A, AP2) | Same ranking engine, new interface | ~500-1000 lines per adapter |
| New ranking signal (e.g. latency) | Add weight to formula, retune | 1 day |
| New consumer type (enterprise API) | Same engine, new auth layer | 1 week |
| New promoted tier | New `promoted_boost` value (e.g. 0.5 vs 1.0) | Config change |

Unit economics, pricing, and dual-rail payments: [04_BUSINESS_MODEL.md](04_BUSINESS_MODEL.md)

---

## Appendix: Growth Hypotheses (Unvalidated)

These are starting assumptions, NOT proven tactics. Each will be tested and measured.

| Hypothesis | Test | Success Metric | Timeline |
|-----------|------|---------------|----------|
| Free tier (100 calls) converts to prepaid | Track free→paid conversion | >5% convert in 30 days | Month 2-3 |
| SEO content drives creator signups | Track organic → registration | >50 signups/month from blog | Month 3-6 |
| Creator referral brings buyers | Track referral attribution | >3 buyers per referring creator | Month 4-6 |
| Prepaid auto-refill reduces churn | Track auto-refill opt-in rate | >30% of active users enable | Month 3-4 |
| Trust score display increases conversion | A/B test: with/without score | >15% lift in purchase rate | Month 4-5 |
| AI assistant channel > web channel | Compare revenue by source | AI channel >60% of revenue by Month 9 | Month 6-9 |
| Premium API justifies pricing | Compare selection rate: Priority vs Standard agents | >50% faster matching | Month 6-8 |
| Sponsored results used by AI | Track % of AI connections from sponsored_results | >5% of AI connections | Month 8-10 |

**Rule:** If a hypothesis fails after 30 days of data, stop investing in it. Move to next.

---

## Open Questions

1. **Hypothesis:** AI assistants will select Agora's MCP server over direct agent calls. Depends on whether trust verification has perceived value to LLMs/users.
2. **Unknown:** Will AI agents value Premium API enough to pay? If <5% of agents upgrade, Premium API may need restructuring.
3. **Hypothesis:** SLA contracts have real demand from enterprise AI systems. If <3 enterprise customers in 6 months, shift to per-query premium pricing.sed decisions about sponsored agents too.
4. **Hypothesis:** Verified badge has real demand. If <5% of creators pay for audit, badge may not be a significant revenue stream.
