<!--
purpose: What the MVP is, who it's for, what's in it. Musk Algorithm applied.
audience: Team, judges, investors
language: English
last_updated: 2026-04-11
-->

# MVP Concept — Agora

## The One-Liner (Pick Your Audience)

| Audience | One-Liner |
|----------|--------|
| **Everyone** | **"The place where AI tool creators publish, get trust-verified, and earn — the Etsy for the AI economy."** |
| Investors | "Creator platform + behavioral trust engine. Indie devs publish AI tools. Buyers find trusted ones. Creators earn per use." |
| Developers | "List your AI agent. Get a behavioral trust score. Embed a badge. Get paid. No sales team needed." |
| Enterprise | "42% of companies abandoned AI in 2025 because they picked wrong vendors. We score agents on behavior, not marketing." |
| Press | "16,000 AI tools exist. Zero way to know which ones actually work. We're building the quality layer." |
| Pitch Hook | "$40M in seed funding went to AI security startups this quarter. But nobody built where creators earn and buyers find trusted tools. We did." |

---

## The Horror Stories That Prove We Need to Exist

These are real. 2025-2026. Not hypothetical.

| What Happened | Who | Cost | Agora Prevents This |
|--------------|-----|------|-------------------|
| AI vendor Paradox.ai leaked 64M applicant records | **McDonald's** | Millions in liability | Trust score includes code quality + security scan |
| AI software unit accumulated operating losses | **VW (Cariad)** | **$7.5 billion** | Trust score shows uptime, repo health, test coverage |
| Companies lost revenue from underperforming AI models | **Average enterprise** | **6% of annual revenue (~$406M)** | Trust score computed from real transaction success rates |
| AI projects abandoned due to wrong vendor selection | **42% of companies** | Billions across industry | Marketplace with verified, scored agents |
| Claude went down globally for hours | **Anthropic** | Unknown (businesses lost productivity) | Multi-agent fallback — Agora shows who's UP right now |
| Deepfake AI impersonated executives on video call | **Arup** | **$25 million stolen** | ZK proofs — cryptographic identity, not just credentials |

**The pattern:** Every one of these disasters happened because there's no way to verify AI reliability BEFORE trusting it. That's our market.

---

## Who Is It For

### Creator: "The Solo Builder"

A developer who built something great but has zero distribution.

**Today:** Pushes to GitHub. Hopes someone finds it. Gets 3 stars. Makes $0.
**With Agora:** Lists in 5 minutes. Gets trust score. AI assistants start recommending it. Makes $500/mo.

### Buyer: "The AI-Powered Business"

A small business or AI system that needs services but can't evaluate vendors.

**Today:** Googles "best AI translation tool." Gets SEO spam. Picks randomly. Gets burned.
**With Agora:** Searches Agora. Sees trust scores. Picks top-rated. Pays $2. Done.

---

## What's In the MVP — 5 Things. That's It

Musk Step 2: deleted 3 features from previous version. If we're not adding them back 10% of the time, we didn't delete enough.

| # | Feature | Why It's Essential |
|---|---------|-------------------|
| 1 | **Agent Catalog** — searchable list with trust scores | Without this, no marketplace |
| 2 | **Trust Score on Every Card** — 0.0-1.0, computed, not rated | This IS Agora. Remove this = remove the company |
| 3 | **Creator Listing Flow** — sign up, list your agent, see analytics | Without supply = no marketplace |
| 4 | **MCP Server** — AI assistants discover us automatically | Primary growth channel |
| 5 | **Embeddable Trust Badge** — SVG for GitHub README | Viral distribution (Shields.io model) |

### What We DELETED from MVP (and status)

| Feature | Status | Why |
|---------|--------|-----|
| ~~Stripe Checkout~~ | Deferred to post-LLC (Aug 2026) | F-1 visa blocks revenue |
| ~~x402 Crypto Payments~~ | Deferred | Fiat first, post-LLC |
| ~~Escrow/Disputes~~ | Deferred | Honor system first |
| ~~CLI Tool `npx agora-trust`~~ | P0 post-pitch | Developer flywheel entry point |
| ~~Trust API (public endpoint)~~ | P0 post-pitch | Core revenue product |

---

## The Demo (60 Seconds, Not 90)

```
[0:00-0:10] SHOCK
"McDonald's AI vendor leaked 64 million records.
 There was no way to check if it was safe. We built that check."

[0:10-0:25] SEARCH
→ Open Agora → search "code review"
→ 3 agents. Trust scores: 0.91, 0.84, 0.72
→ Click top one: uptime 99.2%, success rate 94%, code quality A

[0:25-0:40] BUY
→ Click "Use" → $2.00 deducted → result in 3 seconds
→ "Found. Verified. Paid. Done. 4 steps."

[0:40-0:55] AI DISCOVERY
→ Open Claude → "Review my code"
→ Claude queries Agora → picks best agent → executes
→ "Your AI just hired another AI. Through us."

[0:55-1:00] CLOSE
→ Creator dashboard: "$89 earned, 47 transactions"
→ "That developer listed 2 weeks ago. 
    No cold emails. No sales team. Just quality."
```

---

## Revenue — Updated (SaaS-First)

**Primary: Trust API SaaS subscriptions**

| Tier | Price | What You Get |
|------|-------|-------------|
| Free | $0 | 100 trust queries/mo, basic badge |
| Pro | $29/mo | 5K queries, analytics dashboard, priority badge |
| Business | $99/mo | 50K queries, CI/CD integration, bulk scoring |
| Enterprise | $199/mo | Unlimited, SLA, compliance reports |

**Secondary: 10% marketplace commission** (bonus, not core — Claude Marketplace offers 0%)

> **Why SaaS-first:** Anthropic, Google, OpenAI all building zero-fee marketplaces. Commission = race to zero. Trust data = monopoly asset nobody else has.

Burn: ~$850/mo. Break-even at ~30 Pro subscribers or ~85 transactions/day.

---

## Timeline — 3 Weeks, Not 4

| Week | What | Done When |
|------|------|-----------|
| 1 | MCP server + Stripe | AI discovers us + users can pay |
| 2 | Catalog + listing flow + search | End-to-end marketplace works |
| 3 | Trust scores display + polish + demo | Pitch-ready |

---

## Success = One Simple Test

**Can a developer list an agent, and can a buyer find it, trust-verify it, and pay for it — all in under 60 seconds?**

If yes → we have a product.
If no → we don't.
