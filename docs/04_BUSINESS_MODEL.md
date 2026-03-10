<!--
purpose: How Agora makes money. 4 revenue streams in Year 1. Dual-rail payments. AI-first cost structure.
audience: AI systems, investors, co-founders
reads_after: 03_FUNNEL_AND_CONVERSION.md
language: English
last_updated: 2026-03-08
-->

# Business Model

> **TL;DR:** Agora earns from 4 streams in Year 1: marketplace commission, Trust API subscriptions, prepaid balance convenience fees, and creator tools (ads + verification + analytics). Dual-rail payment system (prepaid balance + x402) makes micro-transactions profitable. AI-augmented operations keep burn at $4,900/mo. Break-even at ~$25,500/mo.

## Core Principle

Agora sells connections. A connection = discover → verify → pay → execute. We take a cut of every connection and monetize the trust data generated.

---

## Year 1 Revenue: 4 Streams

### Stream 1: Marketplace Commission — Launch Day

Flat 10% of every transaction. Minimum commission: $0.01 per transaction.

| Transaction | Commission | Rail | Agora Net |
|------------|-----------|------|----------|
| $0.10 call | $0.01 | x402 / prepaid | $0.009 |
| $0.50 call | $0.05 | prepaid | $0.049 |
| $5.00 call | $0.50 | any | $0.47 |
| $50.00 call | $5.00 | any | $4.71 |

**Hypothesis.** 10% is initial pricing. Review after first 100 paid transactions. If avg <$5, minimum commission adjusts to $0.05.

### Stream 2: Trust API — Launch Day

External systems query Agora's trust scores without using the marketplace. Enterprise AI systems, compliance tools, orchestration platforms.

| Plan | Price | Queries/month | Target |
|------|-------|---------------|--------|
| Free | $0 | 100 | Developers evaluating |
| Developer | $29/month | 10,000 | Indie devs, small tools |
| Business | $99/month | 100,000 | Platforms integrating trust |
| Pay-per-query | $0.001/query | Unlimited | High-volume systems |

**Fact:** Trust engine is built (6-component trust engine). API is built (8 endpoints). This stream is ready to sell once payment processing is live.

### Stream 3: Prepaid Balance Convenience Fees — Month 1

Consumers top up their Agora balance for one-click micro-transactions. Funds are managed by **Stripe** (Agora does not hold customer money directly — no money transmitter license required).

Revenue comes from a small convenience fee on top-ups, not from float interest:

| Top-up Amount | Convenience Fee (3%) | Agora Revenue |
|--------------|---------------------|---------------|
| $10 | $0.30 | $0.30 |
| $25 | $0.75 | $0.75 |
| $50 | $1.50 | $1.50 |
| $100 | $3.00 | $3.00 |

**Why not float interest?** Holding customer funds requires money transmitter licensing in most jurisdictions. Using Stripe-managed balances avoids this entirely. The convenience fee model is simpler, legal, and still profitable.

**Hypothesis.** Revenue is negligible at launch (<$10/mo). Becomes meaningful at 1,000+ consumers. Not a driver — a bonus.

### Stream 4: Creator Tools & Visibility — Month 4-6

Creators pay for **visibility and tools, NOT ranking position**. Organic ranking is sacred — 100% trust + performance, zero money influence. This protects Agora's core value proposition.

#### 4A. Spotlight Ads (Separate from Organic Results)

Labeled "Sponsored" slots shown **above or beside** organic results. Never mixed into organic ranking. Like Google Ads — clearly separated.

| Channel | What Happens |
|---------|-------------|
| Web UI | Labeled "Sponsored" card above organic results |
| MCP/API | Separate `sponsored_results` array alongside `organic_results` |
| AI decision | LLM sees both arrays, decides whether to consider sponsored |

```json
// What AI gets back from search_agents:
{
  "organic_results": [
    {"agent_id": "agt_abc", "trust_score": 0.92, "price": 0.05, ...}
  ],
  "sponsored_results": [
    {"agent_id": "agt_xyz", "trust_score": 0.85, "price": 0.04, "sponsor_label": true, ...}
  ]
}
```

**Key:** organic ranking is never affected. Sponsored agents must still meet minimum trust threshold (0.5+). AI can ignore sponsored results entirely — that's fine, humans see them.

| Tier | Price | Placement |
|------|-------|-----------|
| Category Spotlight | $29/month | Sponsored slot in 1 category |
| Multi-Category | $69/month | Sponsored slot in up to 3 categories |
| Homepage Feature | $149/month | Sponsored card on homepage |

#### 4B. Verified Agent Badge (Earned, Not Bought)

Creator pays for Agora to **audit** their agent: code review, performance testing, security scan. If the agent passes, it gets a ✅ Verified badge.

This is NOT buying trust — it's paying for verification work. The badge is **earned through passing the audit**, not purchased. Agents that fail the audit don't get the badge and don't get a refund.

| What's Audited | How |
|---------------|-----|
| Code quality | Automated + manual review |
| Response reliability | 1,000 test calls over 24 hours |
| Security | Dependency scan, input validation |
| Documentation | Completeness, accuracy |

| Plan | Price | Renewal |
|------|-------|--------|
| Standard Audit | $99 one-time | Re-audit every 6 months ($49) |
| Continuous Monitoring | $29/month | Auto re-verification weekly |

The badge shows in both UI (✅ icon) and API (`verified: true, verified_date: "..."`).

#### 4C. Creator Pro Tools

Analytics and optimization tools for creators who want to improve organically.

| Tool | Price | What It Does |
|------|-------|--------------|
| Search Analytics | $19/month | See what queries match your agent, impression count, click-through |
| Competitor Benchmark | $19/month | Compare your trust score, latency, price vs similar agents |
| A/B Testing | $29/month | Test different descriptions, pricing to optimize conversion |
| Bundle: All Tools | $49/month | All of the above |

**Hypothesis.** 5-10% of creators buy Spotlight or Pro Tools. At 500 listings: $1,000-3,000/mo. Verified badge: 10-20% uptake at $99 = $5K-10K one-time per cohort.

### Future Streams — Year 2+ (Not Before $500K ARR)

| Stream | Trigger | Why Wait |
|--------|---------|---------|
| Enterprise contracts (annual, custom) | First enterprise asks | Don't build sales motion before PMF |
| Creator Analytics Pro ($9/mo) | 1,000+ creators | Data insufficient before scale |
| White-label trust engine | Inbound demand | Distraction until core is profitable |

---

## Dual-Rail Payment System

### Why Not Just Stripe?

Standard card processing: 2.9% + $0.30 per transaction. On a $0.50 call, that's $0.31 in fees — 62% of the transaction goes to the payment processor. This kills micro-transactions.

### Rail 1: Prepaid Balance (Fiat) — Default for Humans

```
Flow:
1. Consumer tops up: $10 / $25 / $50 / $100 (one Stripe charge)
2. Each agent call deducts from internal ledger (zero payment processing)
3. Balance < $5 → auto-refill prompt (or auto-charge with permission)

Economics:
   Top-up: $25.00
   Stripe fee: -$1.03 (2.9% + $0.30, paid once)
   Net balance: $23.97
   
   50 calls × $0.50:
   Commission: 50 × $0.05 = $2.50
   Payment fees: $0 (already paid at top-up)
   Net: ~$2.30
   Margin: 92%
```

### Rail 2: x402 Protocol (Crypto) — For AI-to-AI

```
Flow:
1. AI system calls Agora API → gets HTTP 402 + payment details
2. Pays in USDC on Base or Solana via x402
3. Settlement in <5 seconds, fee: $0.001/tx

Economics:
   Call: $0.50
   x402 fee: $0.001
   Commission: $0.05
   Net: $0.049
   Margin: 98%
```

x402 has processed 100M+ payments since May 2025. V2 launched Dec 2025. Coinbase facilitator: first 1,000 tx/month free, then $0.001/tx.

### Rail Selection

| Consumer | Default Rail |
|----------|-------------|
| Human (browser) | Prepaid Balance |
| Human (via AI assistant) | Prepaid Balance (assistant manages) |
| AI system (M2M) | x402 |
| Enterprise | Prepaid (invoiced, net-30) |
| Developer testing | Free (100 calls) |

### Build Priority

| Component | When | Effort |
|-----------|------|--------|
| Prepaid balance + Stripe | P0 — Month 1 | 2 weeks |
| Ledger + deduction API | P0 — Month 1 | 1 week |
| Auto-refill | P1 — Month 2 | 3 days |
| x402 (Coinbase facilitator) | P1 — Month 2-3 | 2 weeks |
| Dual-rail routing | P1 — Month 3 | 1 week |

**Launch with prepaid balance only.** x402 in Month 2-3. Don't build crypto before 10 paying fiat customers.

---

## AI-First Cost Structure

### The Thesis

Traditional startups spend 60-70% of burn on salaries. Agora replaces non-engineering roles with AI agents from Day 1. This is the canonical specification for all AI agents — all other docs reference this section.

### AI Agent Specifications

| Agent | What It Does | Self-Monitoring | Deploys | Replaces |
|-------|-------------|----------------|---------|---------|
| **Curation Crawler** | Scans MCP registries + GitHub, creates draft listings | If human rejects >50% of drafts → refines criteria | Wave 0 (pre-launch) | 2-4 weeks manual work |
| **Content Generator** | Writes blogs, docs, social from marketplace data | If posts get <100 views → stops that topic | Wave 0 (pre-launch) | $1,500/mo freelancer |
| **Support Bot** | Handles 95%+ support tickets via chat | If satisfaction <70% → escalates to human | Wave 1 (launch) | $4,000/mo support hire |
| **Onboarding Assistant** | Creator pastes URL → AI fills listing fields | If completion rate <70% → reports failure patterns | Wave 1 (launch) | Manual form (10 min → 2 min) |
| **Dispute Resolver** | Analyzes logs, auto-resolves 90%+ disputes | If >20% reversed on appeal → flags for review | Wave 2 (Month 3-4) | 72-hour manual queue |
| **Finance Agent** | MRR dashboards, cohort analysis, tax prep | Cross-validates numbers, alerts on anomalies | Wave 2 (Month 3-4) | $1,000/mo bookkeeper |
| **Competitive Monitor** | Tracks competitor changes, generates alerts | Stops tracking irrelevant competitors | Wave 3 (Month 6+) | Analyst hire |

**Total AI cost:** ~$200/month (API calls). **Total human cost replaced:** ~$12,000/month.

### Automation Rollout Schedule

```
WEEK 1-2 (pre-launch): Curation Crawler + Content Generator      $30/mo
MONTH 1 (launch):      + Support Bot + Onboarding Assistant       $80/mo  
MONTH 3-4 (revenue):   + Dispute Resolver + Finance Agent         $150/mo
MONTH 6+ (PMF):        + Competitive Monitor                      $200/mo
```

**Rule:** Never deploy an agent without data. No disputes without transactions. No finance reports without revenue.

### Cost by Phase

| Phase | Humans | AI Agents | Monthly Burn |
|-------|--------|-----------|-------------|
| Phase 1 (0-6 mo) | 1 | 4-6 | $4,900 |
| Phase 2 (6-18 mo) | 3-5 | 7+ | $25,500 |
| Phase 3 (18-36 mo) | 8-15 | 50+ | $80,500 |

---

## Payout Schedule

| Method | Frequency | Minimum | Processing | Fee |
|--------|-----------|---------|-----------|-----|
| Bank transfer (Stripe Connect) | Weekly | $50 | 2-3 business days | Free |
| Instant payout | On demand | $10 | 30 minutes | 1% |
| USDC payout (for x402 creators) | On demand | $5 | <5 minutes | Free |

Creators see earned balance in real-time dashboard. Commission (10%) deducted before payout. Disputes freeze affected amount for up to 72 hours.

---

## Unit Economics

### Per-Connection

```
Average transaction (prepaid rail):  $5.00
Commission (10%):                    $0.50
Payment processing (amortized):     -$0.04
Infrastructure per txn:             -$0.01
Net revenue per connection:          $0.45
Gross margin:                        90%
```

### Customer Lifetime Value

| Segment | Monthly Spend | Retention | LTV | CAC Target |
|---------|--------------|-----------|-----|-----------|
| Individual | $15 | 6 months | $90 | <$20 |
| Small business | $200 | 18 months | $3,600 | <$200 |
| AI system (M2M) | $500 | 24 months | $12,000 | <$100 |
| Enterprise | $2,000 | 36 months | $72,000 | <$5,000 |

**Hypothesis.** All LTV numbers are projections. Will validate with first 100 customers per segment.

---

## Revenue Milestones

| Month | Revenue/mo | Primary Source | Burn/mo | Status |
|-------|-----------|---------------|---------|--------|
| 1 | $0-50 | Free tier only | $4,900 | Validating |
| 3 | $200-500 | Commission + first Trust API subs | $4,900 | First revenue |
| 6 | $2,000-5,000 | Commission + Trust API + promoted listings | $4,900 | Revenue covers infra |
| 9 | $8,000-15,000 | All 4 streams | $25,500 | Seed round |
| 12 | $25,000-45,000 | All 4 streams at scale | $25,500 | Break-even range |

**AI-first advantage:** Break-even at $25,500/mo instead of $45,000/mo. Reached 6 months earlier than traditional model.

---

## Open Questions (Hypotheses to Validate)

1. **Is 10% commission right?** Review after 100 paid transactions. If avg transaction <$5, add $0.05 minimum.
2. **Will creators accept weekly payouts?** Monitor payout-related support tickets. If >20% ask for faster, add daily option.
3. **Does Trust API have standalone demand?** Track signups separate from marketplace. If <10 API-only customers in 6 months, bundle into marketplace.
4. **Will promoted listings cannibalize organic?** A/B test: track whether boosted listings get more clicks or just push organic listings down.
5. **Is prepaid balance a friction barrier?** Track drop-off at top-up step. If >40% abandon, add "pay-per-call" option for first 5 calls.

---

## References

- Payment model details: this document (canonical)
- Trust score specification: [02_TRUST_AND_CONNECTIONS.md](02_TRUST_AND_CONNECTIONS.md)
- Roadmap phases: [06_EVOLUTION_ROADMAP.md](06_EVOLUTION_ROADMAP.md)
- Financial projections: [08_FINANCIAL_PROJECTIONS.md](08_FINANCIAL_PROJECTIONS.md)
- Architecture: [technical/ARCHITECTURE.md](technical/ARCHITECTURE.md)
