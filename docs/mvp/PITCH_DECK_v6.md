# Agora — Pitch Deck v6

> Last updated: 2026-04-01 | Suffolk 40K Competition Ready
> Canonical burn rate: ~$850/mo | Team: 3 co-founders + AI agents

---

## Slide 1: Executive Summary

**Agora — The Credibility Infrastructure for the AI Agent Economy**

AI agents are becoming autonomous economic actors — buying services, sharing data, executing transactions. But there's no way to verify which agent is trustworthy.

**Agora solves this.** We provide the credibility layer that lets AI agents, humans, and organizations discover, evaluate, and transact with each other safely.

- **What:** Marketplace + Trust Engine + MCP Server for AI agents
- **How:** Cryptographic trust scoring, real-time validation, multi-protocol discovery
- **Why now:** $12B market in 2026 → $53B by 2030. No incumbent owns trust.
- **Ask:** $40K Suffolk prize → 35+ months runway at ~$850/mo burn

---

## Slide 2: Problem

### AI Agents Have No Way to Prove They're Trustworthy

The agentic economy is emerging — but it has a critical infrastructure gap:

1. **No credibility signal.** When an AI agent needs to hire another agent, transfer data, or execute a transaction, there is no standardized way to evaluate counterparty reliability.

2. **Discovery is fragmented.** MCP registries, A2A directories, and API marketplaces are siloed. No single place to find, compare, and connect with AI agents across protocols.

3. **No dispute resolution.** When an autonomous transaction fails, there's no adjudication layer. The AI economy has no "consumer protection."

**The result:** Enterprises won't deploy agents for high-value tasks. Developers can't monetize their agents. The $53B market is bottlenecked by trust.

> "Every economy needs a credibility layer. The AI economy doesn't have one yet."

---

## Slide 3: Solution

### Agora = Discovery + Trust + Payments for AI Agents

Three integrated components that work together:

**1. Marketplace (agora.market) — Agents, MCP Servers, and Skills**
- Search and discover AI agents, MCP servers, and reusable Skills
- Filter by capability, trust score, protocol, pricing
- 3 product categories: Agents (API services), MCP Servers (tool integrations), Skills (reusable instruction sets)

**2. Trust Engine (6 signals — built and running in production code)**
- Adaptive scoring (0.0–1.0) based on 6 real signals:
  - **Identity** (10-35%) — verified agent identity (DID, OAuth)
  - **Capability Match** (10-30%) — keyword overlap with task requirements
  - **Response Time** (15-25%) — actual latency during execution
  - **Execution Quality** (15-30%) — task success rate, error handling
  - **Peer Review** (5-15%) — QA Inspector + independent auditor ratings
  - **History** (0-15%) — transaction count, dispute rate, longevity
- EWMA persistence + Wilson Score cold-start + 2× failure penalty + 30-day decay
- Weights are ADAPTIVE by tier: new agents judged on claims, veterans on results

**3. MCP Server (8 tools)**
- Any AI agent can query Agora programmatically
- `search_agents`, `get_trust_score`, `verify_attestation`, `check_compliance`
- Protocol-agnostic: works with MCP, A2A, REST, x402

---

## Slide 4: Technology Architecture

### Production Stack — Built and Working

```
┌─────────────────────────────────────────────┐
│              agora.market (React/Vite)       │
│         Search • Listings • Analytics        │
├─────────────────────────────────────────────┤
│            Orchestrator (Express.js)         │
│     7 AI Specialist Agents + Pipeline        │
│  WebPulse • CodeGuard • TrustCalc • Scribe  │
├─────────────────────────────────────────────┤
│          MCP Server (8 tools)                │
│  search • trust_score • verify • compliance  │
├─────────────────────────────────────────────┤
│         Supabase (DB + Auth + RLS)           │
│        Trust Engine (TypeScript)             │
└─────────────────────────────────────────────┘
```

**What's built:**
- ✅ Marketplace UI with search, categories, trust badges
- ✅ Trust Engine with multi-factor scoring
- ✅ MCP Server with 8 operational tools
- ✅ Orchestrator with 7 AI specialist agents
- ✅ Auto-Crawler for supply seeding

**What's NOT built (transparency):**
- ❌ Payment processing (Stripe Connect integration)
- ❌ Escrow and dispute resolution
- ❌ MCP endpoint for agent self-registration
- ❌ Execution monitoring pipeline

---

## Slide 5: Market Opportunity

### $12B → $53B in 4 Years

| Metric | 2026 | 2030 |
|--------|------|------|
| AI Agent Market | $12B | $53B |
| Agentic Commerce (US) | $50B | $300-500B |
| CAGR | — | 45% |

**Why trust is the bottleneck:**
- 73% of enterprises cite "trust and safety" as #1 barrier to agent deployment (Gartner 2025)
- No incumbent owns credibility infrastructure for AI-to-AI transactions
- Regulatory pressure (EU AI Act) creates compliance demand

**Comparable funded companies:**
- Composio: $29M (Lightspeed) — agent tooling, no trust
- Scalekit: $5.5M (Together Fund) — auth infrastructure, no agents
- Neither provides discovery + trust + payments in one platform

**Agora's position:** The credibility layer that sits between all of them.

---

## Slide 6: Value Proposition

### For Each User Segment

**For AI Agent Developers:**
- Get discovered by consumers who need your capabilities
- Trust score as competitive differentiator
- Monetize through Agora's payment rails
- One listing → visible across MCP, A2A, REST

**For Businesses Using AI Agents:**
- Find verified, reliable agents for your workflows
- Trust scores reduce risk of deploying autonomous agents
- SLA guarantees backed by escrow
- Compliance documentation for regulators

**For Enterprises & Governments:**
- Audit trail for every agent interaction
- Compliance Engine for EU AI Act, FinCEN, SOC 2
- Custom trust policies per organization
- Enterprise API: $199/mo for unlimited queries

**Key insight:** We don't compete with agents — we make ALL agents more valuable by proving their credibility.

---

## Slide 7: Revenue Model

### 4 Revenue Streams — Trust API SaaS is Primary

| Stream | Price | Launch | Type |
|--------|-------|--------|------|
| **Trust API Subscriptions** (PRIMARY) | $29-199/mo | Post-LLC (Aug 2026) | SaaS — immune to marketplace commission wars |
| **Marketplace Commission** | 10% per transaction | Post-LLC | Transactional — bonus, not core |
| **Prepaid Balance Fees** | 3% convenience fee | Post-LLC | Top-up fees via Stripe |
| **Premium API Access** | $29-199/mo | Month 4-6 post-LLC | Priority matching + SLA |

**Why Trust API SaaS, not Commission:**
- Anthropic Claude Marketplace: 0% commission (loss leader). Google, OpenAI building same.
- Commission revenue = vulnerable to platform subsidies
- Trust API SaaS = defensible — nobody else has behavioral trust data
- Unit economics: $58/mo avg subscriber vs $5 avg commission

**Pre-revenue Phase (now through Aug 2026 — F-1 visa constraint):**
- Build trust data & developer community. No revenue legally possible.
- LLC + OPT authorization: August 2026
- Revenue projections start post-LLC

**Path to Break-Even (post-LLC):**

| Month (post-LLC) | Trust API | Commission | Total Revenue | Burn | Net |
|-------|---------|------|------|------|-----|
| 1 | $0 | $0 | $0 | $850 | -$850 |
| 3 | $145 | $100 | $245 | $850 | -$605 |
| 6 | $435 | $300 | $735 | $900 | -$165 |
| 9 | $1,200 | $700 | $1,900 | $1,000 | +$900 |

**Break-even: ~Month 9 post-LLC.** Conservative, honest projection.

---

## Slide 8: Adoption Strategy (Go-to-Market)

### Phase 1: Developer Flywheel (Months 0-6, pre-LLC)

**The question:** Why do developers come? Why stay? Why share?

1. **Free CLI tool:** `npx agora-score <github-url>` → instant trust report for any repo
2. **Embeddable trust badge:** SVG for GitHub README (like Shields.io but for trust)
3. **Free analytics dashboard:** usage stats, trust trends, competitor comparison
4. **Claimed profiles:** Auto-Crawler discovers agents → notifies developer → they claim profile → get badge
5. **Viral loop:** Developer sees badge on competitor's README → wants their own → flywheel

**Why this works (npm model):** Entry = free utility → Retention = analytics → Sharing = badge visibility

### Phase 2: Platform Stickiness (Months 6-12, post-LLC)

1. **Trust API SaaS** for programmatic queries ($29-199/mo)
2. **Skills marketplace** — reusable instruction sets for AI agents
3. **CI/CD integration:** GitHub Action `agora/trust-check@v1` — trust gate in every PR
4. **"State of AI Agent Trust"** quarterly reports — free PR, thought leadership
5. **Content marketing:** Developer communities, Discord, HackerNews

### Phase 3: AI Economy Transition (Months 12-24)

1. **Agent-to-agent autonomous discovery + payments** (machine-readable listings)
2. **Compliance Engine** for EU AI Act ($5K-50K/year enterprise contracts)
3. **White-label Trust API** for payment rails (Google UCP, Mastercard Agent Pay, Coinbase)
4. **Enterprise API** with SLA guarantees

**AI-First Advantage:**
- 3 co-founders + AI agents handle all operations
- ~$850/mo burn (tools + infra + legal, no salaries)
- Traditional startup equivalent: $12,000-20,000/mo

---

## Slide 9: Risk Analysis & Mitigation

| Risk | Likelihood | Mitigation |
|------|-----------|------------|
| **Cold start** (no agents) | High | CLI tool + badges create developer flywheel. Claimed profiles, not ghost listings. |
| **10+ discovery competitors** | High | Glama, Smithery, BlueRock do static scanning. We do behavioral trust — different layer. |
| **Anthropic/Google 0% commission** | High | Trust API SaaS is primary revenue — immune to commission wars. |
| **No product-market fit** | Medium | Pivot triggers at Month 3 & 6 (see below) |
| **F-1 visa legal constraint** | Certain | No revenue until LLC + OPT (Aug 2026). Pre-revenue phase = data accumulation. |

**Financial resilience:**
- ~$850/mo burn = 35 months runway on savings alone
- With $40K prize = 82+ months runway
- No salaries → can survive any downturn

**Pivot triggers (pre-defined):**
- Month 3: If <50 claimed profiles → pivot to standalone Trust API
- Month 6 post-LLC: If <$500/mo revenue → pivot to enterprise compliance tool

**Honest gaps (what's NOT built):**
- ❌ Payment processing (Stripe Connect — post-LLC priority)
- ❌ Agent self-registration endpoint
- ❌ Execution monitoring pipeline

---

## Slide 10: Team

### 3 Co-Founders + AI Workforce

| Name | Role | Focus |
|------|------|-------|
| **Vladimir Putkov** | CEO / Strategy | Business development, pitch, partnerships |
| **Amir** | CFO / Finance | Financial modeling, compliance, investor relations |
| **Egor** | CTO / Product & DevOps | Architecture, code, infrastructure, AI agents |

**AI Agents (7 operational):**
- WebPulse: Web intelligence & monitoring
- CodeGuard: Code quality analysis
- TrustCalc: Trust score computation
- Scribe: Documentation & content
- Support Agent: Customer service
- Bookkeeper: Financial tracking
- Monitor: Infrastructure uptime

**Why this works:**
- All 3 founders work without salaries in Phase 1
- AI agents replace $12,000+/mo in human labor
- ~$850/mo total burn vs $15,000+ traditional startup
- $40K prize = years of runway, not months

---

## Slide 11: Conclusion & Q&A

### Agora — The Credibility Infrastructure for the AI Economy

**The opportunity:** $53B market by 2030. Everyone builds payment rails — nobody builds trust verification.

**What we've built:** Working marketplace + 6-signal trust engine + MCP server + CLI tools.

**What makes us different:**
- Only platform computing BEHAVIORAL trust (not static code scans)
- Trust API SaaS as primary revenue — immune to commission wars
- Developer flywheel: free CLI → badge → analytics → paid API
- AI-first operations: ~$850/mo burn, not $15K
- 35-82 months runway without external funding

**The ask:** $40K Suffolk 40K Competition prize
- Funds 82+ months of runway
- Accelerates Phase 2 hiring
- Validates the business for seed investors

**Contact:**
- Web: agora.market
- Email: team@agora.market
- GitHub: github.com/Fredess74/AGORA-MVP

> "Every economy needs a credibility layer. We're building it for the AI economy."
