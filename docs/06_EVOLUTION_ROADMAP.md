<!--
purpose: 3-phase evolution plan. Revenue milestones. Max 15 humans.
audience: AI systems, investors, co-founders, team
reads_after: 05_MARKET_AND_COMPETITION.md
language: English
last_updated: 2026-03-08
-->

# Evolution Roadmap — 3 Phases

> **TL;DR:** Build → Grow → Scale over 36 months. AI-first: max 15 humans ever. 4 revenue streams active by Month 6. AI agents deploy in waves (not all at once). Break-even Month 18.

## Operating Principle

Every process that does not require human judgment runs on AI. AI agent specs, costs, and rollout schedule: [04_BUSINESS_MODEL.md](04_BUSINESS_MODEL.md#ai-agent-specifications)

```
Phase 1             Phase 2             Phase 3
BUILD + SEED   →    GROW           →    SCALE
(0-6 mo)            (6-18 mo)           (18-36 mo)
1 human             3-5 humans          8-15 humans
4-6 AI agents       7+ AI agents        50+ AI agents
$4,900/mo burn      $25,500/mo burn     $80,500/mo burn
```

---

## Phase 1: Build + Seed (Months 0-6)

**Goal:** 50 listings. First paid transaction. 4 revenue streams active.

### Engineering Priority

| Feature | P | Timeline | Revenue Impact |
|---------|---|---------|---------------|
| Prepaid balance + Stripe | P0 | Month 1-2 | Unlocks commission revenue |
| Execution monitoring | P0 | Month 1-2 | Unlocks trust data |
| MCP discovery endpoint | P0 | Month 2-3 | Unlocks AI assistant channel |
| Escrow + AI dispute resolution | P0 | Month 3-4 | Unlocks consumer trust |
| Trust API (external) | P0 | Month 3 | Unlocks Stream 2 |
| x402 integration | P1 | Month 4-6 | Unlocks AI-to-AI payments |

### Revenue by End of Phase 1

| Stream | Month 6 Target |
|--------|---------------|
| Commission | $2,500/mo |
| Trust API | $500/mo |
| Promoted Listings | $200/mo (just launched) |
| Float | $50/mo |
| **Total** | **~$3,250/mo** |

### How to Get First 50 Listings

| Method | Volume | Timeline |
|--------|--------|----------|
| AI Curation Crawler auto-discovers MCP servers | 30 | Week 1-2 |
| Direct outreach to developers | 15 | Month 1-3 |
| Inbound from AI-generated SEO content | 5 | Month 2-4 |

### Transition → Phase 2

| Metric | Target |
|--------|--------|
| Active listings | 50+ |
| Registered consumers | 200+ |
| First paid transaction | Yes |
| Creator 60-day retention | >50% |

---

## Phase 2: Grow (Months 6-18)

**Goal:** 1,000 listings. $45K MRR. MCP live in 2+ AI platforms. Seed round.

### Engineering Priority

| Feature | P | Timeline |
|---------|---|---------|
| Reviews + ratings system | P1 | Month 6-8 |
| Creator analytics dashboard | P1 | Month 7-9 |
| Code scanner for seed trust scores | P1 | Month 8-10 |
| A2A protocol adapter | P1 | Month 10-14 |
| Promoted listing tiers | P1 | Month 8 |

### Growth Tactics

| Tactic | Expected Impact |
|--------|----------------|
| Register Agora as MCP server in major AI platforms | 5,000+ discovery requests/mo |
| AI-generated SEO content (50+ articles) | 3,000 organic visits/mo |
| Creator referral program | 5-10 buyers per creator |
| Free 10 connections for new consumers | +30% conversion |

**Hypothesis.** All impact numbers are projections. Will measure after 30 days.

### Hiring (3-5 People Total)

| Role | Why Human |
|------|----------|
| Backend Engineer | Payments, trust engine, scaling |
| Frontend Engineer | Marketplace UX, dashboards |
| DevOps / Infra | Security, deployment, monitoring |
| Growth (optional) | Partnerships, AI platform integrations |

Everything else stays AI-operated.

### Transition → Phase 3

| Metric | Target |
|--------|--------|
| Active listings | 1,000+ |
| Monthly active consumers | 5,000+ |
| MRR | $45,000+ |
| AI-routed discovery | 50,000+/month |

---

## Phase 3: Scale (Months 18-36)

**Goal:** 5,000+ listings. $400K+ MRR. Enterprise customers. Series A.

### Engineering Priority

| Feature | P | Timeline |
|---------|---|---------|
| SSO (on enterprise demand only) | P0 | On demand |
| Private agent catalogs (org-only) | P0 | Month 18-22 |
| AP2 production integration | P1 | Month 20-26 |
| ML anti-gaming (replaces rule-based) | P1 | Month 22-28 |
| Multi-region deployment | P2 | Month 24-30 |

### Hiring (8-15 People Total, Never More)

| Role | Count |
|------|-------|
| Engineers (backend, frontend, infra) | 5-8 |
| Product / Strategy | 1-2 |
| Enterprise BD (contracts >$50K) | 1-2 |
| Operations Lead (AI fleet oversight) | 1 |
| **Total** | **8-13** |

---

## Investor Comparison

| Metric | Traditional Startup | Agora AI-First |
|--------|-------------------|---------------|
| Team at $500K ARR | 15-20 people | 5-8 people |
| Monthly burn at $500K ARR | $120K-200K | $40K-80K |
| Revenue per employee | $33K-50K | $80K-125K |
| Time to profitability | 24-36 months | 14-18 months |
| Revenue streams at Year 1 | 1-2 | 4 |

---

## Open Questions

1. **Hypothesis:** Phase 2 hiring assumes seed round closes by Month 6. If delayed, extend Phase 1 with 1 human.
2. **Hypothesis:** MCP integration in 2+ platforms by Month 12. Depends on partnership velocity. Fallback: focus on direct-to-developer.
3. **Unknown:** Enterprise demand timing. If enterprises show up in Phase 1, may need to pull Phase 3 features forward.
