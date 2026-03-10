<!--
purpose: How Agora captures a blue ocean market — positioning, channels, tactics, and competitive response.
audience: AI systems, founders, growth team, investors
reads_after: 09_PHILOSOPHY.md
language: English
last_updated: 2026-03-08
-->

# Marketing Strategy — Capturing the Blue Ocean

> **TL;DR:** Position = "The Equal Marketplace." Four unconventional tactics: open trust algorithm (viral credibility), free trust dashboard (massive funnel), community Agent of the Week (zero-cost content), builder credits (cold start killer). No paid ads until $10K MRR.

---

## Positioning: "The Equal Marketplace"

Every marketplace claims to be "the best." We claim something different: **we're the fairest.**

Agora is the marketplace where the best agent wins — not the richest company. Rankings are purely merit-based. Trust scores are computed from real data, not purchased. The algorithm is public.

This positioning hits every audience:

| Audience | What They Hear | Why It Resonates |
|----------|---------------|-----------------|
| Indie developers | "My good code beats a big company's budget" | They've been priced out of every other marketplace |
| Enterprise buyers | "Selection is merit-based — no vendor bias" | Procurement teams need defensible decisions |
| Investors | "Ethical moat + lower regulatory risk" | ESG-aligned, sustainable competitive advantage |
| Press | "The anti-corruption AI marketplace" | Contrarian story, easy to write about |
| AI agents (MCP) | Structured data, no manipulation | Machines choose optimal option by default |

---

## The Challenges — And How We Address Each

### Challenge 1: Cold Start (No Agents, No Buyers)

**The problem:** Marketplace chicken-and-egg. 80% of marketplace startups die here.

**Our approach:**

| Tactic | How | Timeline |
|--------|-----|---------|
| AI Curation Crawler | Auto-discovers 30+ existing MCP servers from GitHub/registries, creates listings | Week 1-2 |
| Builder Credits | 0% commission Month 1, 5% Month 2, 10% Month 3 — zero risk for creators | Launch |
| Free Trust Dashboard | Any agent gets a score, even without listing — pulls them into ecosystem | Month 1 |
| Direct outreach | 15-20 agent developers contacted personally | Month 1-3 |

**Target:** 50 listings by end of Month 2. If not → pivot to Trust API only.

### Challenge 2: Discovery (Nobody Knows We Exist)

**The problem:** Brand awareness is zero.

**Our approach — Organic Only (no ads until $10K MRR):**

| Channel | Cost | Mechanism | Expected Impact |
|---------|------|-----------|----------------|
| GitHub Trust Badge | $0 | Developers embed trust score widget in READMEs → viral | 1,000+ impressions per badge per month |
| AI-generated SEO | $5/mo | AI Content Generator writes "Best AI agents for X" articles | 3,000 organic visits/month by Month 6 |
| MCP server registration | $0 | Register Agora as MCP server on major AI platforms | 5,000+ AI discovery queries/month |
| Agent of the Week | $0 | Community-voted spotlight → blog + social | 500+ views/week, creates ritual engagement |
| Dev conference talks | $500/talk | Credibility + leads | 50-100 leads per talk, Month 6+ |

**Key insight:** Our primary channel is MCP — AI assistants discover Agora automatically when users ask for services. This is zero-CAC, intent-driven growth. No marketing spend needed for this channel.

### Challenge 3: Trust in the Trust System (Who Trusts the Trust Provider?)

**The problem:** We sell trust. But why should anyone trust US?

**Our approach — Radical Transparency:**

| What We Do | Why It Works |
|-----------|-------------|
| **Publish trust algorithm** (weights, formula, signals) | Community audits it. Researchers cite it. Open = credible |
| **ZK proofs** — cryptographic verification | Don't trust Agora's word → verify mathematically |
| **Published audit logs** | Every score change is traceable and explainable |
| **Clear dispute resolution** (AI → human → arbitration, max 72h) | Users know exactly what happens when things go wrong |

This is our deepest moat. Once developers trust our scoring, they won't switch to a black-box competitor. Transparency creates lock-in without lock-in.

### Challenge 4: Competition (Skyfire, Masumi, Big Platforms)

**The problem:** Funded competitors exist. Cloud platforms could build this.

**Our approach — Be Unforkable:**

| Our Advantage | Why Competitors Can't Copy |
|--------------|--------------------------|
| Transaction history | Must be earned over time. Day 1 competitor starts at zero |
| Network effects | Agent → buyer → more agents. Takes 6-12 months to reach critical mass |
| Protocol agnosticism | Competitors locked to 1-2 protocols. We support 4 |
| Open algorithm trust | Competitors use black-box scoring — less trustworthy |
| Speed (<10ms queries) | Architectural choice in Rust. Retrofit is expensive |

**Competitive response playbook:**

- If Skyfire adds trust scoring → they lack marketplace + discovery. We co-exist
- If MCP adds native payments → we add trust on top. Trust is the hard part
- If AWS/Google builds this → we pivot to B2B Trust API (they won't build that too)
- If nobody cares about trust → we pivot to pure marketplace (remove trust features)

### Challenge 5: Monetization (Getting People to Pay)

**The problem:** 95% of AI tools are free today. Will anyone pay?

**Our approach — Make Free Users Profitable:**

```
Free tier (100 calls) → demonstrates value
   ↓
Prepaid balance ($25 minimum) → micro-transaction economics work
   ↓
Trust API subscription ($29-99/mo) → for developers who want to integrate scores
   ↓
Premium API ($29-199/mo) → priority resolution, SLA, enhanced trust data
```

**Key:** The free tier is not charity. Free users generate trust data (their transactions feed the scoring engine). Their data makes the whole system more valuable. Every free user makes the paid product better.

---

## Four Unique Tactics

### 1. Open Trust Algorithm

**What:** Publish the trust score weights, formula, and computation method. Keep anti-gaming detection details private.

**Why this is unusual:** Every trust/rating company hides their algorithm (FICO, Google PageRank, Uber ratings). We publish ours.

**Why it works:**

- Creates credibility: "We have nothing to hide"
- Attracts academic research and citations
- Community spots bugs and suggests improvements
- Positions Agora as the "Linux of AI trust" — open standard, company monetizes services on top
- Makes switching to a black-box competitor feel like a downgrade

**What we DON'T publish:** Anti-gaming detector thresholds, exact penalty values, fraud detection methods. These stay private to prevent gaming.

### 2. Free Trust Dashboard

**What:** Any AI agent (even not listed on Agora) can get a free trust score at `agora.dev/score?repo=github.com/user/agent`. No signup required.

**Why this is unusual:** We give away our core product for free.

**Why it works:**

- Massive top-of-funnel: every developer wants to know their score
- Viral: developers put trust badges in GitHub READMEs
- 10-20% of free users list on the marketplace
- Creates dependency on Agora's scoring even outside the marketplace
- Each badge = permanent advertisement

### 3. Agent of the Week

**What:** Weekly community-voted spotlight on the best agent.

**How it works:**

1. Community nominates agents (Twitter/Discord/forum)
2. Top 5 nominees shown on Agora
3. Community votes (1 vote per verified account)
4. Winner gets: blog post, social promotion, homepage feature for 1 week

**Why this is unusual:** Most marketplaces curate algorithmically or sell featured spots. We let the community decide.

**Why it works:**

- Zero-cost content marketing
- Creates emotional attachment to the platform
- Agents compete on quality (community rewards quality)
- Weekly ritual creates habitual engagement
- Winners share their wins → viral loop

### 4. Builder Credits (Graduated Commission)

**What:**

- Month 1: 0% commission
- Month 2: 5% commission
- Month 3+: 10% commission (standard)

**Why this is unusual:** Every marketplace launches at full take rate. We start at zero.

**Why it works:**

- Eliminates cold start friction ("it's literally free to sell here")
- Creates goodwill and word-of-mouth among early creators
- After 3 months, creators have revenue, reviews, and customers → won't leave over 10%
- Total cost: ~$500-2,000 in foregone commission (tiny investment for cold start)

---

## Metrics That Matter

| Metric | Month 3 Target | Month 6 Target | Month 12 Target |
|--------|---------------|----------------|-----------------|
| Listed agents | 100 | 300 | 1,000 |
| Monthly active consumers | 50 | 200 | 1,000 |
| Trust API subscribers | 5 | 20 | 100 |
| MRR | $500 | $3,000 | $15,000 |
| Trust badge embeds | 200 | 1,000 | 5,000 |
| MCP discovery queries/month | 1,000 | 10,000 | 100,000 |

**Kill metric:** If MRR < $1,000 at Month 6 → pivot to pure Trust API (SaaS, no marketplace).

---

## What We Don't Do

- **No paid ads** until $10K MRR. All growth is organic + MCP channel
- **No influencer deals.** Trust company buying influence = contradiction
- **No fake metrics.** We report real numbers. No "users" that are actually signups with zero activity
- **No competitor bashing.** We acknowledge competitors' strengths. Our advantage is being complete, not being superior at any one thing
