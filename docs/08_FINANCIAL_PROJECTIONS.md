<!--
purpose: Financial projections, scenarios, and funding requirements. AI-first cost model. Agent economy timing.
audience: Investors, co-founders
reads_after: 07_RISK_ANALYSIS.md
language: English
last_updated: 2026-03-10
-->

# Financial Projections

> **TL;DR:** Two scenarios (bear/base). AI-first model breaks even at $25,500/mo instead of $45,000/mo — 6 months earlier. 4 revenue streams. Month 1 revenue = $0 (payment system not yet built). First real revenue Month 2-3. Runway: 6-7 months without prize money, 9-14 months with.

## Revenue Model: 4 Streams

Revenue details and pricing: [04_BUSINESS_MODEL.md](04_BUSINESS_MODEL.md)

| Stream | Year 1 Bear | Year 1 Base | Revenue Type |
|--------|------------|------------|-------------|
| Marketplace Commission | $18,000 | $48,000 | Per-transaction (10%) |
| Trust API | $6,000 | $18,000 | SaaS subscriptions |
| Prepaid Balance Float | $200 | $1,200 | Interest on deposits |
| Premium API | $2,400 | $9,600 | Creator subscriptions |
| **Total Year 1** | **$26,600** | **$76,800** | |

## Monthly Projection (Base Case — Revised March 10, 2026)

> **Note:** Month 1 revenue = $0 because Stripe Connect is not yet integrated. Revenue projections start from first payment capability.

| Month | Listings | Active Consumers | Commission | Trust API | Promoted | Float | Total Revenue | Burn | Net |
|-------|---------|-----------------|-----------|----------|---------|-------|--------------|------|-----|
| 1 | 200 | 0 | $0 | $0 | $0 | $0 | $0 | $4,900 | -$4,900 |
| 2 | 250 | 10 | $30 | $0 | $0 | $0 | $30 | $4,900 | -$4,870 |
| 3 | 350 | 25 | $100 | $58 | $0 | $2 | $160 | $4,900 | -$4,740 |
| 4 | 450 | 60 | $300 | $145 | $0 | $8 | $453 | $4,900 | -$4,447 |
| 5 | 500 | 120 | $700 | $290 | $0 | $20 | $1,010 | $4,900 | -$3,890 |
| 6 | 600 | 200 | $1,500 | $435 | $100 | $40 | $2,075 | $4,900 | -$2,825 |
| 7 | 700 | 350 | $2,800 | $700 | $300 | $65 | $3,865 | $25,500 | -$21,635 |
| 8 | 800 | 500 | $4,200 | $900 | $500 | $90 | $5,690 | $25,500 | -$19,810 |
| 9 | 900 | 700 | $6,000 | $1,200 | $750 | $120 | $8,070 | $25,500 | -$17,430 |
| 10 | 1,000 | 900 | $8,500 | $1,500 | $1,000 | $160 | $11,160 | $25,500 | -$14,340 |
| 11 | 1,100 | 1,200 | $11,000 | $1,800 | $1,300 | $210 | $14,310 | $25,500 | -$11,190 |
| 12 | 1,250 | 1,500 | $14,000 | $2,200 | $1,700 | $280 | $18,180 | $25,500 | -$7,320 |

**Key changes from previous projection (March 8):**

- Month 1: $25 → **$0** (payment system not built yet)
- Month 3: $492 → **$160** (more realistic consumer acquisition timeline)
- Month 1 listings: 30 → **200** (Curation Crawler auto-populates from MCP registries)
- Month 7 burn jumps: seed round closes Month 6, team grows to 3-5

**Revenue accelerators from agent economy (not modeled yet):**

- x402 agent-to-agent micro-transactions (could 3-5x commission revenue)
- Coinbase Agentic Wallets integration (reduces payment friction to zero)
- Circle Nanopayments (makes $0.001 transactions profitable)

### Runway Analysis (Pre-Seed)

| Scenario | Starting Cash | Monthly Burn | Runway |
|----------|-------------|-------------|--------|
| No prize money | $30,000 | $4,900 | **~6 months** (danger zone Month 6) |
| Suffolk: $15K (1st from $40K) | $45,000 | $4,900 | **~9 months** |
| Suffolk: $40K (grand prize) | $70,000 | $4,900 | **~14 months** |

---

## Bear Case

Same structure, 40% lower conversion, 2-month delay on every milestone.

| Metric | Bear | Base |
|--------|------|------|
| Year 1 Revenue | $26,600 | $76,800 |
| Break-even month | 24 | 18 |
| Month 12 MRR | $8,200 | $19,700 |
| Month 12 listings | 600 | 1,250 |
| First paid transaction | Month 4 | Month 2 |

---

## AI-First Cost Advantage

| Category | Traditional Startup | Agora (AI-First) | Savings |
|----------|-------------------|------------------|---------|
| Support (1 hire) | $4,000/mo | $30/mo (AI bot) | 99% |
| Content (freelancer) | $1,500/mo | $20/mo (AI generator) | 99% |
| Bookkeeping | $1,000/mo | $15/mo (AI finance) | 99% |
| Dispute resolution | $3,000/mo | $25/mo (AI resolver) | 99% |
| Total non-engineering ops | $9,500/mo | $200/mo | **98%** |
| **Phase 1 total burn** | **$8,400/mo** | **$4,900/mo** | **42%** |
| **Break-even revenue** | **$45,000/mo** | **$25,500/mo** | **43%** |

This is not cost-cutting — it's a structural competitive advantage. Competitors need 3-5x more revenue to reach profitability.

---

## Funding

### Pre-Seed (Current)

| Source | Amount | Status |
|--------|--------|--------|
| Personal savings | $30,000 | Committed |
| Competition prize (Suffolk 40K) | $10,000-40,000 | Applied |
| Runway at $4,900/mo | 6-8 months | |

### Seed Round (Month 6-9)

| Item | Amount |
|------|--------|
| Ask | $250,000 |
| Valuation | $2.5M (pre-money) |
| Use: Engineering (2-3 hires) | $150,000 |
| Use: Infrastructure scaling | $30,000 |
| Use: Legal + compliance | $20,000 |
| Use: Marketing + growth | $30,000 |
| Use: Reserve | $20,000 |
| Runway at $25,500/mo | 18 months |

**Trigger:** $2K MRR + 500 listings + 100 active consumers.

---

## Key Metrics to Track

| Metric | Target | Alert Threshold |
|--------|--------|----------------|
| MRR growth | 15-20% MoM | <10% for 2 consecutive months |
| Gross margin | >85% (prepaid) / >95% (x402) | <70% |
| LTV/CAC | >3x | <2x |
| Revenue per employee (AI-adjusted) | $50K+ ARR per human | <$30K |
| AI ops cost | <$200/mo | >$500/mo → reassess scope |

---

## Open Questions

1. **Hypothesis:** Month 7 burn jump assumes seed closes on schedule. If delayed, extend Phase 1 burn and slow hiring.
2. **Hypothesis:** Promoted listings revenue assumes 5-10% creator conversion. Will validate with first cohort.
3. **Unknown:** Float revenue depends on interest rates. Currently 4.5% APY. If rates drop to 2%, float becomes negligible.
4. **Agent economy acceleration:** If x402 agent-to-agent transactions grow faster than projected (currently $600M annualized), commission revenue could 3-5x the base case. Circle Nanopayments making micro-transactions economically viable could dramatically increase transaction volume.
5. **Payment infrastructure readiness:** Coinbase Agentic Wallets + Circle Nanopayments + Stripe x402 all launched Jan-Feb 2026. The payment rails are ready — the question is adoption speed.
