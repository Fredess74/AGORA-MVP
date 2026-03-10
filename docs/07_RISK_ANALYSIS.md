<!--
purpose: Critical risks, mitigations, SWOT analysis, and strategic pivot triggers.
audience: AI systems, investors, co-founders
reads_after: 06_EVOLUTION_ROADMAP.md
language: English
last_updated: 2026-03-08
-->

> **TL;DR:** 13 risks tracked. Top 3: cold start, funded competitors, no PMF. AI-first burn ($4,900/mo) extends runway. Dual-rail payments mitigate micro-transaction economics. Pre-defined pivot triggers with deadlines.

# Risk Analysis

## Risk Matrix

```
                          IMPACT
                  Low      Medium     High     Critical
            +----------+----------+----------+----------+
High        |          | R7, R8   | R1, R3   |   R2     |
            +----------+----------+----------+----------+
LIKELIHOOD  |          |  R10     | R4, R5   |   R6     |
Medium      +----------+----------+----------+----------+
            |   R12    |  R11     |  R9      |          |
Low         +----------+----------+----------+----------+
```

---

## Critical Risks (Red)

### R1: Cold Start Problem

**Likelihood:** High | **Impact:** High

Marketplaces fail without both sides. Creators will not list without buyers. Buyers will not come without agents.

80% of marketplace startups die from cold start (venture capital research, 2024).

**Mitigation:**

| Action | Timeline |
|--------|----------|
| AI Curation Crawler auto-discovers 30+ MCP servers from registries and GitHub | Week 1-2 |
| Direct outreach to agent developers (15-20 targets) | Months 1-3 |
| Free listing for first 3 months (no commission) | Launch |
| AI Content Generator writes 10+ SEO articles/month | Ongoing |

**Control metric:** 50 listings by end of Month 2.

---

### R2: Competition from Funded Players

**Likelihood:** High | **Impact:** Critical

Existing competitors have live products and user bases. Major platform companies could build trust + marketplace features natively.

**Mitigation:**

| Action | Why It Works |
|--------|-------------|
| ZK proofs as differentiator | Cryptographic trust is harder to replicate than ratings |
| Multi-protocol support (4 protocols) | Competitors are locked to 1 protocol |
| SaaS model (predictable revenue) | Preferred by investors over token models |
| Speed (<10ms vs 500ms+) | Architectural advantage for AI-speed operations |
| Competitive monitoring every 2 weeks | Early detection of new threats |
| Data accumulation priority | Trust data over time creates permanent advantage |

**Control metric:** Feature comparison matrix updated monthly.

---

### R3: No Product-Market Fit

**Likelihood:** High | **Impact:** High

The AI agent market is still forming. Possible that creators are not ready to monetize, or consumers do not want to pay for trust verification.

Supporting data:

- thousands of AI tool servers exist, but 95% are free
- No built-in monetization in the leading protocol
- 42% of developers in industry surveys are willing to pay for verified APIs

**Mitigation:**

| Action | Timeline |
|--------|----------|
| 50 deep interviews with AI tool creators and developers | Before launch |
| Landing page conversion test before building marketplace | Month 1 |
| Iterative approach: minimal marketplace -> collect feedback -> iterate | Months 2-4 |
| Pivot plan ready: if no PMF in 4 months, pivot to B2B Trust API only | Month 5 |

**Control metric:** NPS > 40, 60-day retention > 60%.

---

## High Risks (Orange)

### R4: Third-Party Protocol Dependency

**Likelihood:** Medium | **Impact:** High

MCP, A2A, AP2, x402 are all controlled by large companies. They could change specs, add built-in monetization, or restrict access.

**Mitigation:**

- Protocol-agnostic architecture (trust engine independent of protocol)
- Adapter pattern per protocol (easy to add/remove)
- Own discovery API as fallback
- Contribute to protocol standards for influence

---

### R5: Insufficient Funding / Runway

**Likelihood:** Medium | **Impact:** High

Pre-seed startup without external funding. AI-first burn is $4,900/month, extending runway vs traditional model.

**Mitigation:**

- AI-first burn: $4,900/month (vs $8,400 traditional — 42% lower)
- Revenue-first: launch paid features before fundraising
- Competition grants as bridge funding
- Angel investor outreach (targeted list of 20 in AI/dev-tools)
- Revenue milestone: $1K MRR before seed pitch

---

### R6: Regulatory Risk

**Likelihood:** Medium | **Impact:** Critical

AI agent transactions touch financial regulation, EU AI Act, KYC/AML for payments.

**Mitigation:**

- SaaS model (no token) avoids securities regulation
- Payment processor handles KYC/AML compliance
- Privacy-by-design: ZK proofs minimize personal data storage
- Terms of Service and Privacy Policy before launch
- US-first launch (more predictable SaaS regulatory environment)
- Legal advisor on retainer by Month 6

---

## Medium Risks (Yellow)

### R7: Technical Debt / Scaling

**Likelihood:** High | **Impact:** Medium

MVP built rapidly. Potential bottlenecks at scale: database with 1M+ events/day, memory limits, caching overhead.

**Mitigation:** TimescaleDB hypertables already configured. Horizontal scaling via container orchestration. Load testing before each milestone.

### R8: Single Founder

**Likelihood:** High | **Impact:** Medium

All knowledge, code, and contacts concentrated in one person.

**Mitigation:** All decisions documented. Active co-founder search for technical partner. Advisory board (3 advisors: AI, business, legal) by Month 6.

### R9: Marketplace Fraud

**Likelihood:** Low | **Impact:** High

Fake listings, scam agents, fake reviews, trust score manipulation.

**Mitigation:** 4 anti-gaming detectors built into trust engine. Identity verification via code repository OAuth. AI Dispute Resolver handles 90%+ cases automatically. Community reporting system planned. Automatic suspension after 3+ disputes.

### R10-R12: Additional Risks

| # | Risk | Likelihood | Impact | Mitigation |
|---|------|-----------|--------|-----------|
| R10 | Slow protocol ecosystem growth | Medium | Medium | Diversify: AI agents + automations, not just one protocol |
| R11 | Price pressure (race to bottom) | Low | Medium | Value-based pricing + trust differentiation |
| R12 | Creator churn | Low | Low | Analytics dashboard, reliable payouts, community |

### R13: AI Operations Dependency

**Likelihood:** Medium | **Impact:** Medium

Agora's AI-first model depends on AI API providers for content, support, disputes, and curation. API outages, price increases, or quality degradation could impact operations.

**Mitigation:**

- Multi-provider strategy (no single AI vendor dependency)
- Graceful degradation: human fallback for critical AI agent failures
- Monthly cost monitoring with alerts at 2x baseline
- Core business logic (trust engine, payments) never depends on external AI

---

## SWOT Analysis

```
+-------------------------------+-------------------------------+
|       STRENGTHS               |       WEAKNESSES              |
|                               |                               |
| ZK proofs (unique)            | Solo founder                  |
| <10ms latency                 | Zero users / zero revenue     |
| Multi-protocol (4)            | Limited runway                |
| Working MVP (170+ tests)      | No payment processing yet     |
| AI-first ops ($4,900/mo burn) | No brand awareness            |
| SaaS model (predictable)      | AI provider dependency        |
+-------------------------------+-------------------------------+
|       OPPORTUNITIES           |       THREATS                 |
|                               |                               |
| 10K+ AI tool servers exist    | Funded competitors live       |
| AI agent market -> $93B       | Major platforms may enter     |
| No monetization in protocols  | Regulatory changes            |
| AI-first cost advantage       | AI hype cycle correction      |
| Competition prize opportunity | Protocol spec changes         |
| First-mover in trust + MCP   | AI API price increases        |
+-------------------------------+-------------------------------+
```

---

## Strategic Pivot Triggers

If key metrics are missed, these pre-defined actions activate:

| Signal | Action |
|--------|--------|
| 0 paying customers after 4 months post-launch | Pivot to B2B Trust API only |
| Competitor launches full marketplace | Accelerate differentiation + protocol focus |
| Major platform adds native trust layer | Pivot to complementary positioning |
| Creator 30-day retention < 40% | Reassess creator value proposition |
| $0 revenue by Q3 2026 | Radical pivot or wind down |
| All 4 streams combined <$1K MRR by Month 6 | Reduce to Trust API only, cut burn |

---

## Risks Added From Ethics Audit

### R13: Trust Score Gaming (Goodhart's Law)

**Likelihood:** Medium | **Impact:** High

Any metric that becomes a target ceases to be a good metric. If Agora's trust score becomes the standard, creators will optimize for the score, not actual quality.

**Mitigation:** Anti-Goodhart principle — approximate weights published, exact values adjusted periodically. Anti-gaming thresholds never disclosed. 4 detectors active. Future: ML-based anomaly detection.

### R14: Data Jurisdiction (GDPR/Privacy)

**Likelihood:** Medium | **Impact:** Medium

Trust scores contain behavioral data about agents and indirectly about users. GDPR applies if any EU user uses the platform.

**Mitigation:** ZK proofs minimize data exposure. Trust computation uses aggregate metrics, not individual user data. Legal review required before EU launch.

### R15: Liability for Recommendations

**Likelihood:** Low | **Impact:** High

If Agora's trust score says an agent is 0.9 and that agent causes financial damage, is Agora liable?

**Mitigation:** Terms of Service: trust scores are informational, not guarantees. Agora provides data, not advice. Legal review required.

---

## Open Questions

1. **What if x402 adoption is slower than projected?** Fiat prepaid rail carries all revenue. x402 is additive, not critical.
2. **Resolved:** Prepaid balance regulatory risk eliminated — Stripe manages customer funds, Agora never holds money.
3. **Hypothesis:** 90%+ dispute auto-resolution rate. Will validate with first 50 disputes.
4. **New:** What regulatory classification applies? (marketplace vs payment processor vs rating agency) — needs legal opinion before EU launch.
