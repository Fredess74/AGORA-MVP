<!--
purpose: How Agora makes money. 4 revenue streams in Year 1. AI-first cost structure.
audience: AI systems, investors, co-founders
reads_after: 03_FUNNEL_AND_CONVERSION.md
language: English
last_updated: 2026-03-30
-->

# Business Model

> **TL;DR:** Agora is a marketplace and counterparty risk engine for AI agents. We earn from 3 streams in Year 1: marketplace commission (10%), Trust API subscriptions ($29-99/mo), and prepaid balance convenience fees (3%). Monthly burn: ~$400-700 (tools + infrastructure, no salaries). Fourth stream (Premium API) added Month 4-6. **⚠️ No payment processing code exists yet — all payment flows described below are target architecture.**

## Core Principle

Agora is a marketplace where AI agents discover each other, and a credibility engine that evaluates their counterparty risk. We earn a cut of every transaction and sell access to our credibility data via API.

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

**Fact:** Trust engine is built (6-component adaptive trust engine). MCP server is built (8 tools via MCP SDK). Orchestrator has 5 REST endpoints. This stream is ready to sell once payment processing is live.

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

### Stream 4: Premium API Access — Month 4-6

AI agents and their operators pay for **better service quality**, not ads or badges. In an AI-to-AI economy, agents don't see ads and don't need visual badges — they need faster resolution, guaranteed uptime, and richer data.

#### 4A. Priority Resolution

Agents with Priority status get faster matching, lower latency, and priority queue access during high-demand periods.

| Plan | Price | What Agent Gets |
|------|-------|-----------------|
| Standard | Free | Normal queue, best-effort matching |
| Priority | $29/month | 2x faster matching, dedicated queue, retry on failure |
| Enterprise Priority | $99/month | Guaranteed <100ms matching, dedicated infrastructure, SLA |

#### 4B. Guaranteed SLA Contracts

For enterprise AI systems that need contractual uptime guarantees and dispute resolution.

| Plan | Price | SLA |
|------|-------|-----|
| Basic | $49/month | 99.5% uptime, 4-hour response |
| Business | $99/month | 99.9% uptime, 1-hour response, dedicated endpoint |
| Enterprise | $199/month | 99.95% uptime, 15-min response, custom integration |

#### 4C. Enhanced Trust Data

Richer trust analytics for operators who want deeper insights into agent reliability.

| Feature | Price | What It Does |
|---------|-------|--------------|
| Historical trust trends | $19/month | 30-day trust score history, anomaly detection |
| Competitor benchmarking | $29/month | Compare your agent's trust vs category average |
| Custom trust model | $99/month | Train custom scoring weights for your use case |

**Hypothesis.** 5-10% of active API users upgrade to Priority or SLA. At 500 active agents: $2,000-5,000/mo. Enterprise SLA is the real revenue driver long-term.

### Future Streams — Year 2+ (Not Before $500K ARR)

| Stream | Trigger | Why Wait |
|--------|---------|---------|
| Enterprise contracts (annual, custom) | First enterprise asks | Don't build sales motion before PMF |
| Creator Analytics Pro ($9/mo) | 1,000+ creators | Data insufficient before scale |
| White-label trust engine | Inbound demand | Distraction until core is profitable |

---

## Payment System (Target Architecture)

> **⚠️ Status: NOT YET BUILT.** No payment code exists in the codebase. Stripe Connect is not integrated. x402 handlers are hooks only. The payment flows described below are the target implementation.

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

> **⚠️ Status: NOT YET BUILT.** x402 integration is Phase 2. Launch with Stripe Connect (prepaid balance) first.
>
> **x402 reality check:** Headline figure is $600M annualized / 50M+ transactions. However, internal deep research found ~40-50% is wash trading (bots trading with themselves). Real daily volume is closer to ~$28K. Still growing, but not the scale the headline suggests. Build crypto AFTER 10 paying fiat customers.

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

x402 has processed 50M+ payments (headline). Real non-wash daily volume: ~$28K. Coinbase facilitator: first 1,000 tx/month free, then $0.001/tx. Stripe x402 integration live.

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

**Total AI cost:** ~$50-150/month (API calls, scaling with usage). These agents are the reason we don't need to hire support, content, and bookkeeping staff — saving $8,000-15,000/mo versus a traditionally staffed startup.

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
| Phase 1 (0-6 mo) | 3 co-founders | 4-6 | ~$850 (tools + infra + legal, no salaries) |
| Phase 2 (6-18 mo) | 3-5 + hires | 7+ | ~$20,000-30,000 (with salaries) |
| Phase 3 (18-36 mo) | 8-15 | 50+ | ~$60,000-80,000 |

### Phase 1 Burn Rate — Line-Item Breakdown

> These are the ACTUAL costs for running Agora as a 3-person startup with AI-augmented operations.

| Category | Service | Cost/mo | Notes |
|---------|---------|---------|-------|
| **Google Ecosystem** | | | |
| | Google One AI Premium (×3) | $60 | $20×3 — Gemini Advanced, 2TB storage each |
| | Google Workspace Business | $25 | $8.40×3 — custom email, Drive, Meet |
| | Additional Google services | $115 | User-confirmed: total Google spend ~$200/mo |
| **AI Dev Tools** | | | |
| | Cursor Pro | $60 | $20×3 seats |
| | Claude Pro / ChatGPT Plus | $40-60 | At least 2 seats for dev + research |
| | Windsurf / other AI tools | $0-20 | As needed |
| **Infrastructure** | | | |
| | Supabase Pro | $25 | Production database + auth |
| | Vercel Pro | $20 | Frontend hosting + edge functions |
| | Render (backend) | $25-50 | Orchestrator + MCP server (production instances) |
| | Domain (agora.market + others) | $8 | ~$35-50/year main domain + $50/year extras |
| | SSL / CDN | $0 | Included with Vercel |
| | Monitoring (Sentry/LogRocket) | $0-29 | Free tier initially, then paid |
| **Production APIs** | | | |
| | Gemini API (orchestrator) | $30-80 | Inference for trust scoring + agent routing |
| | Stripe | $0 | Pay-per-transaction only, no monthly fee |
| | Other APIs (GitHub, npm, etc.) | $0-10 | Free tiers initially |
| **Legal & Compliance** | | | |
| | Delaware LLC filing (amortized) | $15 | ~$180/year (filing + state fee) |
| | Registered agent service | $12 | ~$150/year |
| | Delaware franchise tax | $25 | $300/year minimum |
| | Legal consultations (amortized) | $50-100 | ~$600-$1,200/year for startup legal basics |
| **Marketing (minimal)** | | | |
| | Social media ads / content boost | $50-100 | LinkedIn, Twitter promotion |
| | Gamma Pro (pitch decks) | $10 | Presentation tool |
| | Design tools (Figma/Canva) | $0-15 | Free tier or Pro |
| **Miscellaneous** | | | |
| | Communication (Slack/Discord) | $0 | Free tiers |
| | GitHub (free tier) | $0 | Public repos, free Actions minutes |
| | Contingency | $50 | Unexpected tool costs, overages |
| | | | |
| **TOTAL** | | **$625-1,150** | **Realistic: ~$850/mo. No salaries.** |

> **Note:** No founder stipends. All 3 co-founders work without pay in Phase 1. Revenue goes back into the company.
>
> **Google spend confirmed at ~$200/mo** by Vladimir (includes AI Premium + Workspace + additional services).
>
> **Comparison:** A traditional startup with equivalent output would spend $12,000-20,000/mo on the same roles (support, content, bookkeeping, DevOps hires). AI agents cost us $50-150/mo in API calls.

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
| 1 | $0-50 | Free tier only | ~$800 | Validating |
| 3 | $200-500 | Commission + first Trust API subs | ~$800 | First revenue |
| 6 | $2,000-5,000 | Commission + Trust API + Premium API | ~$1,000 | Revenue covers 2-5x burn |
| 9 | $8,000-15,000 | All 4 streams | ~$25,000 | Seed round (hires begin) |
| 12 | $18,000-25,000 | All 4 streams at scale | ~$25,000 | Approaching break-even |

**AI-first advantage:** Phase 1 break-even at ~$800-1,100/mo instead of $12,000-20,000/mo. Revenue exceeds burn by Month 3-4.

---

## Open Questions (Hypotheses to Validate)

1. **Is 10% commission right?** Review after 100 paid transactions. If avg transaction <$5, add $0.05 minimum.
2. **Will creators accept weekly payouts?** Monitor payout-related support tickets. If >20% ask for faster, add daily option.
3. **Does Trust API have standalone demand?** Track signups separate from marketplace. If <10 API-only customers in 6 months, bundle into marketplace.
4. **Does Priority Resolution justify premium?** Track selection rate improvement for Priority vs Standard agents.
5. **Is prepaid balance a friction barrier?** Track drop-off at top-up step. If >40% abandon, add "pay-per-call" option for first 5 calls.

---

## References

- Payment model details: this document (canonical)
- Trust score specification: [02_TRUST_AND_CONNECTIONS.md](02_TRUST_AND_CONNECTIONS.md)
- Roadmap phases: [06_EVOLUTION_ROADMAP.md](06_EVOLUTION_ROADMAP.md)
- Financial projections: [08_FINANCIAL_PROJECTIONS.md](08_FINANCIAL_PROJECTIONS.md)
- Architecture: [technical/ARCHITECTURE.md](technical/ARCHITECTURE.md)
