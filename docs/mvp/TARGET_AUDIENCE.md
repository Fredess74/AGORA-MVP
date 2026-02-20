# Target Audience Analysis — Agora MVP

## Problem Statement

Current documentation lists target audience as: "AI agents, autonomous vehicles, robots, IoT devices"

This is not an audience. This is a technology category. An audience is a **person who makes purchasing decisions**.

---

## Candidate Segments

### Segment A: AI Agent Framework Developers

**Who**: Engineering teams building agent orchestration tools (LangChain, CrewAI, AutoGen competitors)

| Attribute | Value |
|-----------|-------|
| Company size | 5-50 engineers |
| Funding stage | Seed to Series A |
| Decision maker | CTO or Lead Engineer |
| Geography | US, Europe |
| Example companies | LangChain Inc, CrewAI, AutoGPT, BabyAGI |

**Pain Points**:

1. Agents call external APIs but cannot verify provider reliability
2. Payment integration is complex — each provider has different billing
3. No standard for agent-to-agent trust verification

**Current Workaround**: Manual API key management, custom retry logic, hope-based trust

**Desperation Level**: MEDIUM — problem exists but not blocking revenue

**Willingness to Pay**: Unknown — must validate

---

### Segment B: AI API Providers (Supply Side)

**Who**: Teams monetizing AI capabilities as APIs

| Attribute | Value |
|-----------|-------|
| Company size | 2-20 engineers |
| Funding stage | Pre-seed to Seed |
| Decision maker | Founder |
| Geography | Global |
| Examples | Specialized ML model providers, niche AI tools |

**Pain Points**:

1. Billing infrastructure is expensive to build
2. Cannot differentiate from unreliable competitors
3. Fraud/abuse from anonymous API consumers

**Current Workaround**: Stripe billing (expensive %), self-built rate limiting

**Desperation Level**: MEDIUM-HIGH — billing is real cost center

**Willingness to Pay**: Would pay to avoid Stripe fees + get trust signal

---

### Segment C: Enterprise AI Platform Teams

**Who**: Internal teams at large companies adopting agent workflows

| Attribute | Value |
|-----------|-------|
| Company size | 1000+ employees |
| Funding stage | Public or late private |
| Decision maker | VP Engineering, CISO |
| Geography | US, Europe, Japan |
| Examples | Banks, Insurance, Healthcare |

**Pain Points**:

1. Compliance requires audit trails for AI decisions
2. Cannot deploy autonomous agents without controls
3. Need proof of vendor reliability

**Current Workaround**: Avoid autonomous agents, use human-in-loop

**Desperation Level**: LOW — will wait for mature solutions

**Willingness to Pay**: High $ but long sales cycle (12-18 months)

---

### Segment D: Autonomous Vehicle / Robotics OEMs

**Who**: Companies building self-driving cars, delivery robots, drones

| Attribute | Value |
|-----------|-------|
| Company size | 100-10,000 employees |
| Decision maker | VP Software, Chief Product Officer |
| Geography | US, China, Germany, Japan |
| Examples | Tesla, Waymo, Nuro, Aurora |

**Pain Points**:

1. Vehicles need to negotiate with infrastructure (chargers, tolls)
2. Machine-to-machine payments without human involvement
3. Trust verification for unknown service providers

**Current Workaround**: Proprietary integrations, partnerships

**Desperation Level**: LOW — 2-3 year roadmap items

**Willingness to Pay**: Very high but very slow decision cycles

---

## Segment Ranking

| Segment | Desperation | Speed to Close | $ Value | Validation Feasibility | Score |
|---------|-------------|----------------|---------|----------------------|-------|
| B — API Providers | 4/5 | Fast (weeks) | Low | Easy | **15** |
| A — Agent Frameworks | 3/5 | Medium (months) | Medium | Medium | **12** |
| C — Enterprise | 2/5 | Slow (year+) | High | Hard | 8 |
| D — AV/Robotics | 1/5 | Very slow | Very high | Very hard | 5 |

**Recommendation**: Start with **Segment B (AI API Providers)** for MVP validation.

---

## Ideal Customer Profile (ICP) for MVP

### Primary Target

**Small AI API provider (2-10 people) that currently uses Stripe for billing and loses 2.9%+ on every transaction.**

| Attribute | Requirement |
|-----------|-------------|
| Revenue | $10K-$500K/month API revenue |
| Billing pain | Using Stripe, complaining about fees |
| Trust need | Has received abuse/fraud from API consumers |
| Technical | Can integrate SDK in <1 day |
| Urgency | Looking for solution now (not "someday") |

### Where to Find Them

1. Indie Hackers (<https://indiehackers.com>) — search "API billing"
2. Hacker News — "Show HN" posts about API products
3. Twitter/X — search "Stripe fees" + "API"
4. ProductHunt — recently launched API products
5. GitHub — trending API projects looking to monetize

### Disqualifying Signals

| Signal | Why Disqualify |
|--------|----------------|
| No revenue yet | Cannot validate willingness to pay |
| Enterprise sales motion | Too slow for MVP validation |
| Already built custom billing | Switching cost too high |
| No fraud/abuse problems | Trust value prop doesn't resonate |
| "Interested in the future" | Not desperate now |

---

## Validation Script (10 Interviews)

### Questions to Ask

1. **Current state**: "How do you handle billing for your API today?"
2. **Pain**: "What's the worst thing about your current billing setup?"
3. **Quantified pain**: "How much do you pay in fees per month?"
4. **Trust**: "Have you ever had problems with abusive API consumers?"
5. **Workaround**: "What do you do when that happens?"
6. **Spend**: "Would you pay $X/month to eliminate that problem?"
7. **Alternative**: "What would you do if this solution didn't exist?"

### Success Criteria

| Metric | Threshold |
|--------|-----------|
| Interviews completed | ≥10 |
| "Would pay" responses | ≥5/10 |
| Quantified pain | ≥$500/month lost to fees/fraud |
| Urgency | ≥3/10 say "would try today" |

### If Validation Fails

If <5/10 would pay, **pivot ICP to Segment A** (agent frameworks) and repeat.

---

## Non-Targets (Explicitly Exclude from MVP)

| Segment | Why Exclude |
|---------|-------------|
| Crypto projects | Regulatory complexity, small market |
| Consumers | We are B2B infrastructure |
| Hobbyists | Cannot pay |
| Big tech | Will build their own |
| Hardware companies | 3+ year sales cycle |

---

## Action Items

| # | Action | Owner | Deadline |
|---|--------|-------|----------|
| 1 | Find 20 potential Segment B companies | Founder | Week 1 |
| 2 | Send cold outreach to 20, get 10 interviews | Founder | Week 2 |
| 3 | Complete 10 interviews, document findings | Founder | Week 3 |
| 4 | Decide: proceed with Segment B or pivot | Founder | Week 4 |
