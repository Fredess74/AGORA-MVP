<!--
purpose: Definitive 5-year development roadmap with sub-phases, F-1 constraints, and milestones.
audience: Co-founders, investors, technical advisors
language: English
last_updated: 2026-03-30
-->

# Agora Strategic Roadmap — 5-Year Plan

> **TL;DR:** 7 phases from current state (Phase 0) to AGI-economy infrastructure (Phase 6). Each phase has sub-phases (marked +). LLC formation in August 2026 is the critical legal gate. F-1 visa compliance requires all pre-LLC work to be research/academic, not revenue-generating.

---

## Legal Framework: F-1 Visa Compliance

### Timeline Constraint
```
NOW → August 2026: F-1 student status
  - ✅ Allowed: Academic research, open-source development, competition entries
  - ❌ Prohibited: Revenue generation, client work, employment
  - ⚠️ Gray area: LLC formation (must be after OPT authorization)

August 2026: LLC formation + OPT self-employment authorization
  - ✅ Allowed: Revenue generation, customer billing, hiring
  - Must file I-765 for OPT EAD card
  - Must have valid DSO recommendation for self-employment
```

### What This Means for Development
- **Phases 0-1** (now through August 2026): Research, architecture, documentation, open-source code only
- **Phase 1+**: Infrastructure prep — payment integration CODE can be written but NOT activated. No money flows.
- **Phase 2** (post-LLC): First customer transactions, Stripe activation, revenue tracking
- All pre-LLC work is classified as "academic research and capstone project"

---

## Phase 0: Truth & Foundations (NOW — May 2026)

**Goal:** Establish honest, verifiable technical foundation. Make every claim in documentation backed by running code.

### Phase 0 — Core
| # | Task | Status | Target |
|---|------|--------|--------|
| 1 | Truth audit — all docs vs code | ✅ Complete | March 2026 |
| 2 | RESEARCH_FOUNDATION.md — formula↔code map | ✅ Complete | March 2026 |
| 3 | TRUST_SCORE_EXPLAINED.md — developer guide | ✅ Complete | March 2026 |
| 4 | DISCOVERY_PROTOCOL.md — flow spec | ✅ Complete | March 2026 |
| 5 | VALIDATION_PROTOCOL.md — QA spec | ✅ Complete | March 2026 |
| 6 | UNIFIED_SYSTEM.md — integrated architecture | ✅ Complete | March 2026 |
| 7 | Fix MCP weight sync with calculator.ts | ✅ Complete | March 2026 |
| 8 | chainReliability() — pipeline reliability check | ✅ Complete | March 2026 |
| 9 | Trust badges computation module | ✅ Complete | March 2026 |

### Phase 0+ — Hardening
| # | Task | Status | Target |
|---|------|--------|--------|
| 1 | Seed Supabase with 10+ realistic test agents | ⏳ Blocked (DNS) | April 2026 |
| 2 | End-to-end pipeline test with seeded data | ⏳ Pending | April 2026 |
| 3 | MCP server: add `get_trust_history` tool | ❌ Not started | April 2026 |
| 4 | MCP server: add `compute_chain_reliability` tool | ❌ Not started | April 2026 |
| 5 | EWMA test suite — verify decay, sigmoid, Wilson edge cases | ❌ Not started | April 2026 |
| 6 | Competition pitch deck update with honest architecture | ❌ Not started | May 2026 |

**Deliverables:** Fully honest documentation set, 2 new code modules, synced MCP weights.
**Risk:** Supabase DNS connectivity blocks live testing.

---

## Phase 1: Developer Experience (June — August 2026)

**Goal:** Make the platform usable by 10 beta developer-testers. Focus on agent listing, discovery, and trust transparency.

### Phase 1 — Core
| # | Feature | Description |
|---|---------|-------------|
| 1 | Developer onboarding flow | CLI tool: `agora init`, `agora publish`, `agora status` |
| 2 | Agent SDK (TypeScript) | Simple wrapper: define tool, set schema, publish to marketplace |
| 3 | Trust dashboard (web) | Real-time trust score viewer with component breakdown |
| 4 | Semantic search (pgvector) | Replace ILIKE with Gemini embeddings + cosine similarity |
| 5 | Trust history table | Supabase table tracking every score change with metadata |
| 6 | Badge display (marketplace UI) | Show computed badges on agent cards |

### Phase 1+ — Infrastructure Prep
| # | Feature | Description | F-1 Status |
|---|---------|-------------|------------|
| 1 | Stripe Connect integration code | Controller-mode connect accounts for agents | ⚠️ Code only, NOT activated |
| 2 | Usage metering schema | Supabase tables for tracking API calls per user | ⚠️ Schema only |
| 3 | Billing API endpoints | REST endpoints for balance, invoice, refund | ⚠️ Code only |
| 4 | Agent analytics dashboard | Impressions, clicks, conversion funnel per agent | ✅ Allowed |

**Users:** 10 beta testers (fellow students, open-source contributors)
**Revenue model:** $0 (F-1 compliance — no revenue pre-LLC)
**Deliverables:** CLI + SDK + dashboard + semantic search

---

## Phase 2: Market Launch (September 2026 — March 2027)

> **Gate:** LLC formed. OPT EAD approved. Self-employment authorized.

**Goal:** First paying customers. 100+ agents listed. Multi-auditor validation. Revenue: $1K MRR by end of phase.

### Phase 2 — Core
| # | Feature | Description | Priority |
|---|---------|-------------|----------|
| 1 | **Payment activation** | Stripe Connect live, per-call billing, prepaid balances | P0 |
| 2 | **Multi-auditor QA** | 3+ auditor pool with BTS-lite scoring | P0 |
| 3 | **Anti-correlation detection** | Flag suspiciously correlated reviews | P1 |
| 4 | **VCG-lite agent routing** | Mathematical agent selection (supplement Gemini) | P1 |
| 5 | **Chain reliability check in pipeline** | Warn/abort if reliability < threshold | P1 |
| 6 | **Kano feature categorization** | Basic/Performance/Delighter framework applied to agent features | P2 |

### Phase 2+ — Growth
| # | Feature | Description |
|---|---------|-------------|
| 1 | Agent Partner Program | 3-tier commission: Standard (85/15), Premium (90/10), Enterprise (custom) |
| 2 | API rate limiting | Per-plan limits: Free (50/day), Pro (1000/day), Enterprise (unlimited) |
| 3 | Referral program | Agent creators earn 5% of referred agents' revenue for 6 months |
| 4 | TEE attestation (basic) | Remote attestation for infrastructure agents (SGX/TDX) |
| 5 | Dispute resolution system | Human-in-loop arbitration for quality disputes |
| 6 | Multi-model QA | QA uses Claude + GPT-4 + Gemini to cross-validate quality |

**Metrics target:** 100 agents, 500 users, $1K MRR, <2% dispute rate
**Business model:** 15% platform commission on all transactions
**Revenue streams:** Commission (85%), convenience fees (10%), featured listings (5%)

---

## Phase 3: Intelligence Layer (April 2027 — December 2027)

**Goal:** Transform from simple marketplace to an intelligent routing network. Trust becomes the connective tissue for autonomous agent chains.

### Phase 3 — Core
| # | Feature | Description |
|---|---------|-------------|
| 1 | **Poincaré Ball embeddings** | Hyperbolic space for agent capability matching |
| 2 | **Trust-weighted discovery** | Trust score modifies effective distance in discovery |
| 3 | **DAG pipeline support** | Multi-agent task graphs (not just linear chains) |
| 4 | **Traffic Light validators** | Green/amber/red at every pipeline junction |
| 5 | **Nonlinear slashing** | Superlinear penalties for correlated failures |
| 6 | **Full BTS scoring** | Bayesian Truth Serum with 3+ independent auditors |
| 7 | **GAT intent decomposition** | Graph Attention Networks decompose complex intents into subtask DAGs |

### Phase 3+ — Scale
| # | Feature | Description |
|---|---------|-------------|
| 1 | MDP optimal routing | Markov Decision Process for optimal agent sequencing |
| 2 | Stochastic ZK spot checks | 5% random verification with ZK proofs |
| 3 | opML bisection disputes | O(log N) dispute resolution protocol |
| 4 | Agent reputation portability | Export trust score with cryptographic proof |
| 5 | Enterprise SLA tier | 99.9% uptime guarantee, dedicated support, custom routing |
| 6 | Multi-cloud deployment | AWS + GCP + Azure for geographic redundancy |

**Metrics target:** 1K agents, 10K users, $50K MRR
**Key innovation:** Trust-weighted hyperbolic discovery (2-5 dims > 100-dim Euclidean)

---

## Phase 4: Privacy Layer (January 2028 — December 2028)

**Goal:** Deploy encrypted discovery and matching. Users can find agents WITHOUT revealing their intent. Agents can prove capabilities WITHOUT revealing their code.

### Phase 4 — Core
| # | Feature | Description |
|---|---------|-------------|
| 1 | **CKKS FHE matching** | Encrypted intent ↔ agent capability matching |
| 2 | **VeriSimplePIR** | Private information retrieval with cryptographic verification |
| 3 | **Polynomial Poincaré in FHE** | Client-precomputed curvature, encrypted distance calculation |
| 4 | **End-to-end encrypted routing** | Router operates on encrypted data, never sees plaintext intent |

### Phase 4+ — Compliance
| # | Feature | Description |
|---|---------|-------------|
| 1 | SOC 2 Type II certification | Enterprise compliance for regulated industries |
| 2 | GDPR/CCPA data controls | User data portability, right to deletion, consent management |
| 3 | HIPAA-ready pipeline | Healthcare agent routing with full audit trail |
| 4 | FedRAMP exploration | US government agent marketplace potential |

**Metrics target:** 5K agents, 50K users, $500K MRR
**Key innovation:** Private discovery — "blind matching" at scale
**Research partnerships:** University collaborations on FHE + hyperbolic ML

---

## Phase 5: Autonomous Economy (2029 — 2030)

**Goal:** Agents autonomously transact, negotiate, and form teams without human intervention. The platform becomes an economic substrate.

### Phase 5 — Core
| # | Feature | Description |
|---|---------|-------------|
| 1 | **Agent-to-agent negotiation** | AI agents negotiate scope, price, and terms autonomously |
| 2 | **Dynamic team formation** | Agents self-organize into task-specific teams |
| 3 | **Reputation marketplace** | Trust scores become tradeable/stakeable assets |
| 4 | **Cross-platform identity** | Agora trust scores portable to other platforms |

### Phase 5+ — Ecosystem
| # | Feature | Description |
|---|---------|-------------|
| 1 | Agent incubator program | Fund promising agent creators with revenue advances |
| 2 | Vertical-specific marketplaces | Spin out security, healthcare, legal as sub-marketplaces |
| 3 | Real-time trust arbitrage | Agents compete on trust × price × speed in real-time auctions |
| 4 | Global agent governance | DAO-like governance for platform rules and fee structures |

**Metrics target:** 50K agents, 500K users, $5M MRR
**Key shift:** From "marketplace" to "economic infrastructure"

---

## Phase 6: AGI-Economy Infrastructure (2030+)

**Goal:** Agora becomes the trust layer for AGI-to-AGI commerce. When AGI systems need services, they use Agora's trust protocol to select, verify, and pay.

### Phase 6 — Vision
| # | Feature | Description |
|---|---------|-------------|
| 1 | **AGI trust standards** | Standardized trust protocol for autonomous AI systems |
| 2 | **Self-upgrading trust engine** | Trust scoring model evolves with market complexity |
| 3 | **Interplanetary readiness** | Latency-tolerant trust propagation for distributed compute |
| 4 | **Quantum-resistant crypto** | Post-quantum signatures for all trust attestations |
| 5 | **Universal agent passport** | Cross-platform identity recognized by all agent frameworks |

**This is the 10-year vision. Everything before this is a step toward making it possible.**

---

## Timeline Summary

```
2026 Q2:   Phase 0  — Truth & Foundations ← WE ARE HERE
2026 Q3:   Phase 1  — Developer Experience
2026 Q3:   ──────── LLC FORMATION (August) ────────
2026 Q4:   Phase 2  — Market Launch (revenue begins)
2027 Q1:   Phase 2+ — Growth & Multi-auditor
2027 Q2:   Phase 3  — Intelligence Layer
2028:      Phase 4  — Privacy Layer (FHE)
2029-2030: Phase 5  — Autonomous Economy
2030+:     Phase 6  — AGI Infrastructure
```

```
Revenue Projection (conservative):
  Phase 0: $0        (F-1 academic)
  Phase 1: $0        (F-1 academic)
  Phase 2: $1K MRR   (first customers)
  Phase 3: $50K MRR  (1K agents, 10K users)
  Phase 4: $500K MRR (5K agents, enterprise)
  Phase 5: $5M MRR   (50K agents, autonomy)
  Phase 6: $50M+ MRR (AGI infrastructure)
```

---

## Kano Model: Feature Prioritization

### Must-Be (Basic) — Table stakes, absence causes disqualification
- Agent listing and search (✅ DONE)
- Trust scoring (✅ DONE)
- Quality validation (✅ DONE — single auditor)
- Payment processing (Phase 2)
- Agent SDK + onboarding tools (Phase 1)

### Performance — More is better, linearly improves satisfaction
- Search quality (keyword → semantic → hyperbolic)
- Validation depth (1 auditor → 3 → TEE)
- Trust transparency (score → breakdown → history → badges)
- Pipeline reliability (no check → threshold → entropy)
- API response time (10s → 5s → 2s → <1s)

### Excitement (Delighters) — Unexpected features that create delight
- Privacy-preserving discovery (FHE — Phase 4)
- Agent team auto-formation (Phase 5)
- Trust score portability across platforms
- Real-time pipeline visualization
- "Agent of the Month" recognition + viral badges

### Indifferent — Effort that doesn't improve satisfaction
- ~~Custom UI themes~~ (developers don't care)
- ~~Social features~~ (likes, follows — wrong audience)
- ~~Mobile app~~ (CLI + API is the primary interface)

### Reverse — Features that DECREASE satisfaction if present
- ~~Mandatory phone verification~~ (friction kills adoption)
- ~~Gamification points~~ (developers see through it)
- ~~AI-generated reviews~~ (erodes trust in trust system)

---

## Business Model by Phase

| Phase | Revenue Model | Commission | Payment | Notes |
|-------|-------------|-----------|---------|-------|
| 0-1 | None | N/A | N/A | F-1 — academic research only |
| 2 | Per-transaction | 15% | Stripe Connect | Prepaid balance model to avoid MSB |
| 3 | Tiered commission | 10-15% | Stripe + x402 | Premium agents get lower commission |
| 4 | Enterprise licensing | Custom | Enterprise contracts | SOC 2 + HIPAA + custom SLA |
| 5 | Platform fees + staking | 5-15% | Multi-rail | Trust staking generates yield |
| 6 | Protocol fees | 1-5% | Protocol-level | Infrastructure revenue |

---

## References

- Research foundation: `docs/research/RESEARCH_FOUNDATION.md`
- Trust score guide: `docs/developer/TRUST_SCORE_EXPLAINED.md`
- Discovery protocol: `docs/developer/DISCOVERY_PROTOCOL.md`
- Validation protocol: `docs/developer/VALIDATION_PROTOCOL.md`
- Unified system: `docs/technical/UNIFIED_SYSTEM.md`
- Business model: `docs/04_BUSINESS_MODEL.md`
- Risk analysis: `docs/07_RISK_ANALYSIS.md`
- Financial projections: `docs/08_FINANCIAL_PROJECTIONS.md`
