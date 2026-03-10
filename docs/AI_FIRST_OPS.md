<!--
purpose: AI-First Operations Playbook — how Agora runs as an AI-native company
audience: Founders, investors, co-founders, AI systems
reads_after: 04_BUSINESS_MODEL.md
language: English
last_updated: 2026-03-10
-->

# AI-First Operations Playbook

> **TL;DR:** Agora is not a company that "uses AI." It's a company where **AI is the default operator** and humans intervene only when AI cannot proceed. Every business process has an AI owner, escalation criteria, and self-improvement feedback loop. This reduces burn from $45K/mo (traditional) to $4.9K/mo while increasing speed 10-50x.

---

## Core Principle: AI Default, Human Exception

Traditional startups: **Human does work → AI assists.**  
Agora: **AI does work → Human reviews exceptions.**

This is not aspirational — it's architectural. Every process below is designed AI-first:

| Layer | Traditional | Agora AI-First |
| --- | --- | --- |
| Decision | Human decides, AI suggests | AI decides, human overrides |
| Execution | Human executes, AI automates parts | AI executes, human monitors metrics |
| Quality | Human reviews everything | AI self-monitors, human reviews anomalies |
| Learning | Manual process improvement | AI agents adjust parameters automatically |

---

## Operations Map: Every Process → AI Owner

### 1. Supply (Getting agents listed)

| Process | AI Agent | Human Role | Escalation Trigger |
| --- | --- | --- | --- |
| Discover new tools | **Curation Crawler** — scans MCP registries, GitHub, npm | Review weekly batch, reject bad fits | If human rejects >50% of drafts |
| Create listings | **Onboarding Assistant** — creator pastes URL, AI fills fields | None (self-serve) | If completion rate <70% |
| Quality gate | **Auto-Auditor** — runs test calls, checks response times | Review flagged agents | If agent fails basic smoke test |
| Ongoing monitoring | **Performance Monitor** — tracks uptime, latency, error rates | None | If agent drops below SLA threshold |

**Metric:** Time from tool discovery → listed on Agora: **Target: <24 hours (vs 2-4 weeks manual)**

### 2. Demand (Getting users to discover and use)

| Process | AI Agent | Human Role | Escalation Trigger |
| --- | --- | --- | --- |
| Content creation | **Content Generator** — writes blogs, social, docs from marketplace data | Approve content calendar | If posts get <100 views for 2 weeks |
| SEO optimization | **Content Generator** — optimizes listings for search | None | Monthly manual review |
| User education | **Support Bot** — answers "how to use X" questions | None | If satisfaction <70% |
| Competitive positioning | **Competitive Monitor** — tracks competitor changes | Strategic decisions only | New competitor enters market |

**Metric:** CAC (Customer Acquisition Cost): **Target: <$20 for individual, <$200 for business**

### 3. Trust & Quality (Core value proposition)

| Process | AI Agent | Human Role | Decision Authority |
| --- | --- | --- | --- |
| Trust scoring | **Trust Calculator** (adaptive, 4-tier) | Algorithm design | AI calculates, human designs algorithm |
| Dispute resolution | **Dispute Resolver** — analyzes logs, auto-resolves 90% | Review appeals | AI resolves unless >$100 or repeat offender |
| Fraud detection | **Anti-Gaming Detector** (Phase 2) | Review flagged agents | AI flags, human bans |
| Verification audits | **Auto-Auditor** (for trust scoring) | Final sign-off | AI runs audit, human approves results |

**Metric:** Dispute resolution time: **Target: <1 hour (vs 72-hour manual queue)**

### 4. Revenue & Finance

| Process | AI Agent | Human Role | Escalation Trigger |
| --- | --- | --- | --- |
| Transaction processing | **Payment System** (Stripe + x402 auto-routing) | None | Payment failures >5% |
| Commission collection | **Ledger Service** (automatic 10% deduction) | None | Manual override for enterprise deals |
| Financial reporting | **Finance Agent** — MRR dashboards, cohort analysis | Review monthly P&L | Cross-validation anomalies |
| Tax preparation | **Finance Agent** — auto-categorizes transactions | Review annual filing | Complex jurisdictional questions |

**Metric:** Revenue recognition accuracy: **Target: 99.5%+**

### 5. Operations & Infrastructure

| Process | AI Agent | Human Role | Escalation Trigger |
| --- | --- | --- | --- |
| Deployment | **CI/CD pipeline** (GitHub Actions) | Approve production deploys | Build failures |
| Monitoring | **Alerting system** (Supabase + custom) | On-call for P0 incidents | >1% error rate |
| Customer support | **Support Bot** — handles 95%+ tickets | Handle edge cases, empathy-needed situations | Satisfaction <70% or legal questions |
| Security | **Automated scanning** + Supabase RLS | Security incident response | Any security breach |

**Metric:** Support tickets per 1,000 users: **Target: <5 (vs 50 industry average)**

---

## Agent Deployment Schedule

```
Phase 0 — NOW (pre-launch):
├── CTO Agent (you/AI) — architecture, code, decisions        ✅ Active
├── Curation Crawler — discovers tools from MCP/GitHub         🔄 Week 1-2
└── Content Generator — creates listing descriptions           🔄 Week 1-2

Phase 1 — Launch:
├── Trust Calculator — adaptive 4-tier scoring                 ✅ Built
├── Support Bot — handles user questions                       🔄 Month 1
└── Onboarding Assistant — creator self-serve listings         🔄 Month 1

Phase 2 — Revenue:
├── Dispute Resolver — auto-resolves transaction disputes      📋 Month 3-4
├── Finance Agent — dashboards, cohort analysis, tax prep      📋 Month 3-4
└── Anti-Gaming Detector — sybil/velocity/pattern detection    📋 Month 3-4

Phase 3 — Scale:
├── Competitive Monitor — tracks market changes                📋 Month 6+
├── Auto-Auditor — verified badge audits                       📋 Month 6+
└── Performance Monitor — SLA enforcement                      📋 Month 6+
```

---

## Decision Framework: When Does AI Escalate?

### The 4 Escalation Rules

1. **Money >$100** — Any financial decision involving more than $100 → human approval
2. **Banning** — Removing an agent or user from the platform → human approval
3. **Legal** — Any question involving legal compliance → human
4. **Anomaly** — AI detects a pattern it hasn't seen before → flag for human review

### Everything Else → AI Decides

- Listing approval/rejection for quality ← AI
- Trust score calculation ← AI  
- Dispute resolution <$100 ← AI
- Content publishing ← AI (with pre-approved guidelines)
- Price recommendations ← AI
- Alert triage ← AI

---

## Feedback Loops: How AI Agents Self-Improve

### Loop 1: Outcomes → Algorithm (Weekly)

```
Trust scores → Agent performance → Correlation analysis
→ Are high-trust agents actually performing better?
→ If not → adjust weights in adaptive scoring
```

### Loop 2: User Actions → Ranking (Daily)

```
User selects agent → Completes task → Rates agent
→ Did trust score predict user satisfaction?
→ If yes → reinforce weights. If no → investigate.
```

### Loop 3: Support Tickets → Knowledge Base (Real-time)

```
User asks question → Support Bot answers
→ User satisfied? → Add to knowledge base
→ User not satisfied? → Escalate + log failure pattern
```

### Loop 4: Market Data → Strategy (Monthly)

```
Competitive Monitor data → New competitors / pricing changes
→ Alert founders → Adjust pricing / positioning
```

---

## Cost Comparison: AI-First vs Traditional

| Role | Traditional Cost | Agora (AI-First) | Savings |
| --- | --- | --- | --- |
| CTO | $15,000/mo | $0 (founder) | $15,000 |
| Support (2 people) | $8,000/mo | $30/mo (AI) | $7,970 |
| Content/Marketing | $5,000/mo | $40/mo (AI) | $4,960 |
| Bookkeeper | $2,000/mo | $20/mo (AI) | $1,980 |
| Business Analyst | $8,000/mo | $50/mo (AI) | $7,950 |
| DevOps | $7,000/mo | $60/mo (CI/CD) | $6,940 |
| **Total** | **$45,000/mo** | **$4,900/mo** | **$40,100/mo** |

**Break-even at $25,500/mo** instead of $45,000/mo. Reached **6 months earlier** than traditional model.

---

## Organizational Structure

```
┌─────────────────────────────────────────────┐
│            FOUNDERS (3 humans)               │
│                                              │
│  Strategy • Architecture • Investor Relations│
│  Sales (enterprise only) • Legal sign-off    │
└─────────────────┬───────────────────────────┘
                  │
    ┌─────────────┼─────────────┐
    │             │             │
┌───▼───┐  ┌─────▼─────┐  ┌───▼───┐
│SUPPLY │  │TRUST+QUAL │  │REVENUE│
│ TEAM  │  │   TEAM    │  │ TEAM  │
│(AI×3) │  │  (AI×3)   │  │(AI×2) │
├───────┤  ├───────────┤  ├───────┤
│Crawler│  │Calculator │  │Ledger │
│Onboard│  │Dispute Res│  │Finance│
│Monitor│  │Anti-Gaming│  └───────┘
└───────┘  └───────────┘
```

**3 humans + 8 AI agents = startup that operates like a 15-person company.**

---

## References

- Cost model details: [04_BUSINESS_MODEL.md](04_BUSINESS_MODEL.md) (canonical for pricing)
- Trust scoring specification: [technical/TRUST_ENGINE.md](technical/TRUST_ENGINE.md)
- Adaptive algorithm: `packages/orchestrator/src/trust/calculator.ts`
- Architecture: [technical/ARCHITECTURE.md](technical/ARCHITECTURE.md)
