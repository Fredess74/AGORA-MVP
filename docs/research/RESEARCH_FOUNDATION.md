<!--
purpose: Master mapping of Deep Research formulas → code implementation status
audience: Developers, technical investors, AI systems
source: AGORA DEEP research.docx (2026-03-29)
last_updated: 2026-03-30
-->

# Research Foundation — Formula ↔ Code Map

> **Rule:** Every formula from the Deep Research document is listed here with its exact code location or "NOT BUILT" status.
> **Source:** `AGORA DEEP research.docx` — 3 Parts, ~25 pages of formal mathematics.
> **Code Truth:** `packages/orchestrator/src/` and `packages/mcp-server/src/`

---

## Overview: Three Parts of the Research

| Part | Topic | Pages | Code Status | Target Phase |
|------|-------|-------|-------------|-------------|
| **Part 1** | Hyperbolic Geometry + Trust-Weighted Poincaré Distance | ~10 | ⚠️ ~15% (basic trust scoring only) | Phase 2-3 |
| **Part 2** | Cascading Entropy + DAG Validation + Graph Attention Networks | ~8 | ❌ 0% | Phase 2-3 |
| **Part 3** | FHE Intent Discovery (CKKS + VeriSimplePIR) | ~7 | ❌ 0% | Phase 4+ |

---

## Part 1: Hyperbolic Geometry + Trust Scoring

### 1.1 Poincaré Distance (Hyperbolic Metric)

**Research formula:**
```
d_P(u, v) = arcosh(1 + 2 · ‖u - v‖² / ((1 - ‖u‖²)(1 - ‖v‖²)))
```

> In the Poincaré ball model 𝔹ⁿ, this metric captures hierarchical relationships exponentially more efficiently than Euclidean space. 2-5 dimensional hyperbolic embeddings outperform 100+ dimensional Euclidean embeddings for tree-like structures.

**Code status:** ❌ NOT BUILT
**Current implementation:** Flat keyword matching via `computeCapabilityMatch()` in `calculator.ts:106-120`
**Target file:** `packages/orchestrator/src/discovery/poincare.ts` (new)
**Target phase:** Phase 3

---

### 1.2 Trust-Weighted Poincaré Distance

**Research formula:**
```
d_TWP(u, v) = (1 / √(τ_u · τ_v)) · d_P(u, v)

Where:
  τ_u = trust score of initiator
  τ_v = trust score of agent
```

> Higher trust reduces effective distance — trusted agents appear "closer" in the discovery space. This creates a natural gravity toward reliable agents.

**Code status:** ❌ NOT BUILT
**Current implementation:** Trust score is computed AFTER agent selection, not during discovery ranking.
**Architectural note:** In the current pipeline, `ProcurementAgent` selects based on Gemini evaluation + keyword match, then trust is calculated separately. The research proposes integrating trust INTO the matching metric.
**Target phase:** Phase 3

---

### 1.3 Adaptive Trust Score (6-Component Weighted Sum)

**Research context:** The deep research builds on top of this foundational scoring.

**Implementation formula:**
```
Trust Score = Σ (component_score × adaptive_weight[tier])

Components: identity, capability_match, response_time, execution_quality, peer_review, history
Tiers: new (0-2 txns), low (3-10), medium (11-50), high (50+)
```

**Code status:** ✅ IMPLEMENTED
**Code location:** `packages/orchestrator/src/trust/calculator.ts` lines 34-103
**Verification:**
- `TIER_WEIGHTS` record: lines 34-71
- `getConfidenceTier()`: lines 74-79
- `calculateCompositeScore()`: lines 97-103
- `LiveTrustTracker` class: lines 153-308

---

### 1.4 EWMA Persistence (Exponentially Weighted Moving Average)

**Implementation formula:**
```
T_new = α × adjustedScore + (1 - α) × T_old_decayed
```

**Code status:** ✅ IMPLEMENTED
**Code location:** `packages/orchestrator/src/db/supabase.ts` lines 272-275

---

### 1.5 Dynamic α via Sigmoid Curve

**Implementation formula:**
```
α(N) = 0.12 + 0.58 / (1 + e^(0.08 × (N - 30)))

Behavior:
  N=1:    α ≈ 0.67 (very responsive)
  N=10:   α ≈ 0.48 (moderately responsive)
  N=30:   α ≈ 0.41 (midpoint)
  N=50:   α ≈ 0.24 (stabilizing)
  N=100+: α ≈ 0.12 (veteran — hard to move)
```

**Code status:** ✅ IMPLEMENTED
**Code location:** `packages/orchestrator/src/db/supabase.ts` lines 265-270
**Verification:** Constants `SLOPE=0.08`, `MIDPOINT=30`, `ALPHA_MIN=0.12`, `ALPHA_MAX=0.70`

---

### 1.6 Wilson Score Lower Bound (Cold-Start Protection)

**Implementation formula:**
```
W = (p̂ + z²/2n - z√(p̂(1-p̂)/n + z²/4n²)) / (1 + z²/n)

Applied when: N < 5 transactions
z = 1.96 (95% confidence)
```

> Prevents 1/1 (100%) from outranking 98/100 (98%). Small sample sizes are heavily penalized.

**Code status:** ✅ IMPLEMENTED
**Code location:** `packages/orchestrator/src/db/supabase.ts` lines 237-256

---

### 1.7 Trust Decay (30-Day Half-Life)

**Implementation formula:**
```
T_decayed = T_old × 0.5^(days_since_last_txn / 30)

After 30 days: trust halved
After 60 days: quartered
After 90 days: ⅛ of original
```

**Code status:** ✅ IMPLEMENTED
**Code location:** `packages/orchestrator/src/db/supabase.ts` lines 227-235

---

### 1.8 Asymmetric Penalty (Loss Aversion)

**Implementation formula:**
```
if score < 0.5:
    adjustedScore = max(0, score - (0.5 - score))
    
Example: score 0.3 → adjusted to 0.1 (double the deficit)
Example: score 0.1 → adjusted to 0.0 (max penalty)
Example: score 0.4 → adjusted to 0.3 (mild penalty)
```

> Failures are penalized 2× harder than successes reward. Applied to the raw score BEFORE EWMA, not to α itself (which would break EWMA math).

**Code status:** ✅ IMPLEMENTED
**Code location:** `packages/orchestrator/src/db/supabase.ts` lines 258-263

---

## Part 2: Cascading Entropy + DAG Validation

### 2.1 Cascading Entropy — Pipeline Reliability ("The 95% Trap")

**Research formula:**
```
P_success(chain) = ∏ p_i · exp(-Σ H_cascade(i))

Simplified (Phase 2):
P_chain = ∏ p_i

Example: 5 agents at 95% each
  P_chain = 0.95⁵ = 0.774 (only 77.4%!)
  
Example: 3 agents at 90%
  P_chain = 0.90³ = 0.729 (only 72.9%!)
```

> The deep research adds the entropy term `exp(-Σ H_cascade)` which models error amplification at chain junctions. The simplified version (product of probabilities) is sufficient for Phase 2.

**Code status:** ❌ NOT BUILT
**Current state:** The pipeline runs 8 agents in fixed sequence with no reliability check.
**Target file:** `packages/orchestrator/src/pipeline/reliability.ts` (new)
**Target phase:** Phase 2 (simplified, no entropy term)
**Action:** Add `chainReliability(agents)` check before pipeline start. Warn if reliability < 80%.

---

### 2.2 Graph Attention Networks (GAT) for Intent Decomposition

**Research formula:**
```
α_ij = softmax(LeakyReLU(aᵀ · [W·h_i ‖ W·h_j]))

h_i' = σ(Σ_{j∈N(i)} α_ij · W · h_j)

Where:
  h_i = node feature vector (intent embedding)
  W = learnable weight matrix
  α_ij = attention coefficient (how much node j influences node i)
  ‖ = concatenation
  a = attention mechanism vector
```

> GAT decomposes complex multi-step intents into subtask DAGs. Each node is a subtask, each edge represents dependency. Attention weights determine which subtasks are most critical.

**Code status:** ❌ NOT BUILT
**Current implementation:** Single `FormulatorAgent` (one Gemini prompt) handles intent formulation.
**Target phase:** Phase 3

---

### 2.3 Markov Decision Process (MDP) for Optimal Routing

**Research formula (Bellman equation):**
```
V*(s) = max_a [R(s,a) + γ · Σ P(s'|s,a) · V*(s')]

Agora adaptation:
  State s = current agent in chain
  Action a = select next agent from candidates
  Reward R = trust_score × (1/latency) × capability_match
  Transition P = historical success rate for pair (agent_i, agent_j)
  γ = 0.95 (discount factor)
```

> Instead of fixed pipeline (Formulator→Procurement→Specialist→QA), MDP would find the optimal agent sequence for each query.

**Code status:** ❌ NOT BUILT
**Current implementation:** Fixed 8-agent linear pipeline.
**Target phase:** Phase 3

---

### 2.4 β-Coefficient (Graph Topological Integrity)

**Research formula:**
```
β = 1 - H_cascade / H_max

Where:
  H_cascade = accumulated entropy at junction points
  H_max = maximum possible entropy for the graph
  
If β < β_threshold → graph is unstable, abort pipeline
```

**Code status:** ❌ NOT BUILT
**Target phase:** Phase 3

---

### 2.5 Validator Nodes — Traffic Light Architecture

**Research concept:**
```
Green Light  → Continue pipeline (confidence > 0.8)
Amber Light  → Route to revision (0.5 < confidence < 0.8)
Red Light    → Abort pipeline (confidence < 0.5)

Validators act as "heat sinks" — absorbing excess entropy at chain junctions.
Deploy at every junction between independent subtask DAGs.
```

> Validators (Evaluator agents) assess output quality at pipeline junctions, preventing cascading failures from propagating through the chain.

**Code status:** ❌ NOT BUILT
**Current implementation:** Single QAInspector at end of pipeline (binary pass/fail).
**Target phase:** Phase 3

---

## Part 2 — Mechanism Design (Anti-Gaming)

### 2.6 Bayesian Truth Serum (BTS) for Peer Review

**Research formula:**
```
Score_auditor = log(x_i / ȳ_i)

Where:
  x_i = actual fraction of auditors giving answer i
  ȳ_i = average prediction of fraction for answer i

Agora adaptation:
  R_auditor = max(0, log(x / ȳ) × τ_auditor × quality_weight)
  
Where:
  τ_auditor = auditor's own trust score (0-1)
  quality_weight = depth of audit: shallow=0.5, deep=1.0
```

> **Key property:** BTS makes honest reporting a Strictly Dominant Strategy (SPNE). Auditors who report truthfully earn higher scores than auditors who collude or free-ride. This eliminates the "reciprocal positive review" problem.

> **Application for dev tools:** Instead of a single QAInspector, deploy 3+ auditor pool. Each auditor reports quality AND predicts what others will report. Surprisingly accurate ("surprisingly common") answers are rewarded with higher BTS scores.

**Code status:** ❌ NOT BUILT
**Current implementation:** Single `QAInspectorAgent` in `buyer-chain.ts:83-117` — one Gemini call, one rating.
**Target file:** Refactor `qaInspector.ts` → multi-auditor with BTS scoring
**Target phase:** Phase 2
**Prerequisite:** >100 transactions/day for statistical power

---

### 2.7 Nonlinear Slashing (Anti-Sybil Economics)

**Research formula:**
```
Φ_v(x) = S_v · (k · C / S_total)^γ

Where:
  S_v = validator stake (trust score or deposit)
  C = total correlated failures across validators
  S_total = total stake of all validators
  k = 2 (correlation amplifier)
  γ = 1.5 (superlinearity exponent)
```

**Impact table:**
```
| Scenario                | C/S_total | Penalty as % of stake |
|------------------------|-----------|----------------------|
| Solo failure (1%)      | 0.01      | 2.8%                 |
| Small group (5%)       | 0.05      | 6.3%                 |
| Coordinated 20%        | 0.20      | 17.9%                |
| Coordinated 50%        | 0.50      | 70.7%                |
| Massive attack (90%)   | 0.90      | 170.3% (total loss)  |
```

> **Key property:** Penalties grow superlinearly with correlation. Solo failures are cheap. Coordinated attacks are economically suicidal. This makes Sybil attacks (creating many fake agents to manipulate trust) unprofitable.

**Code status:** ❌ NOT BUILT
**Target file:** New `packages/orchestrator/src/trust/antiSybil.ts`
**Target phase:** Phase 3 (full), Phase 2 (simplified anti-correlation penalty)

---

### 2.8 Anti-Correlation Penalty (Simplified Sybil Detection)

**Simplified formula for Phase 2:**
```
penalty = base_penalty × (1 + β × correlation_coefficient)

Where:
  β = 2.0 (correlation amplifier)
  correlation_coefficient = how similar reviews are to a known cluster
  
If two agents consistently give each other 5/5 reviews:
  correlation → 1.0
  penalty → 3× base (devastating)
```

**Code status:** ❌ NOT BUILT
**Target file:** New `packages/orchestrator/src/trust/antiCorrelation.ts`
**Target phase:** Phase 2

---

### 2.9 VCG Auction for Agent Routing

**Research formula:**
```
Allocation: x* = argmax Σ vᵢ(x)     (social welfare maximization)
Payment:    pᵢ = Σⱼ≠ᵢ vⱼ(x*₋ᵢ) - Σⱼ≠ᵢ vⱼ(x*)

Simplified bid function for Phase 2:
  bid_i = w₁·trust + w₂·capability_match + w₃·(1/latency) + w₄·(1/price)
  
Default weights: w₁=0.4, w₂=0.3, w₃=0.15, w₄=0.15
```

> **Key property:** VCG is DSIC (Dominant Strategy Incentive Compatible) — agents literally cannot benefit from misrepresenting their capabilities or prices. This is a mathematical guarantee, not a policy.

> **Application for dev tools:** Instead of ProcurementAgent selecting via Gemini prompt, use VCG auction where agents bid with their trust scores + capabilities. The winner provides maximum social welfare.

**Code status:** ❌ NOT BUILT
**Current implementation:** `ProcurementAgent` in `buyer-chain.ts:45-79` uses Gemini to select "best" agent.
**Target file:** Enhance `packages/orchestrator/src/agents/procurementAgent.ts`
**Target phase:** Phase 2+

---

## Part 2 — Verifiable AI Execution

### 2.10 TEE Remote Attestation (First Verification Layer)

**Research protocol:**
```
Flow:
  1. Provider runs inference inside SGX/TDX enclave
  2. Enclave generates attestation report:
     - MRENCLAVE (enclave identity hash)
     - MRSIGNER (developer signing key)
     - PCR values: [model_hash, input_hash, output_hash]
  3. Client verifies report via Intel/AMD attestation service
  4. If valid → agent's "model integrity" flag = true

Performance: <1 second verification, <10% computational overhead
```

> **Problem solved:** "Model Downgrade Attack" — provider claims to run GPT-4 but secretly uses GPT-3.5, pocketing 97% profit margin. TEE attestation proves which model actually ran.

**Code status:** ❌ NOT BUILT
**Target file:** New `packages/orchestrator/src/verification/tee.ts`
**Target phase:** Phase 2

---

### 2.11 Stochastic ZK-Spot-Checks

**Research concept:**
```
- Don't verify every query (impractical, expensive)
- Random 5% spot checks using ZK proofs
- $0.07 per check (average)
- After 90 queries: 99% probability of detecting cheating

Traffic Light Architecture:
  85% of queries: TEE only
  12% of queries: TEE + ZK spot check  
  3% of queries: Full zkML verification
```

**Code status:** ❌ NOT BUILT
**Target phase:** Phase 3

---

### 2.12 opML Bisection Protocol (Dispute Resolution)

**Research concept:**
```
When client and provider disagree on output quality:
  1. Both submit their claimed output
  2. Arbitrator bisects computation into steps
  3. Find first divergence point
  4. Resolve in O(log N) rounds (instead of replaying entire computation)
  
Cost: ~$0.10 per dispute step
Time: ~5 minutes per resolution
```

**Code status:** ❌ NOT BUILT
**Target phase:** Phase 3

---

### 2.13 EigenTrust Critique

**Research conclusion:**
> EigenTrust (PageRank for trust) fails for AI agents because:
> 1. Agent creation is free (unlike websites — no "effort" to create)
> 2. Swarm collusion is trivial (create 1000 agents that review each other)
> 3. No identity cost (same entity can operate unlimited agents)
>
> Agora's BTS + Nonlinear Slashing + Wilson Score approach is mathematically superior because:
> - BTS makes honest reporting strictly dominant
> - Nonlinear slashing makes collusion economically irrational
> - Wilson Score prevents cold-start gaming
>
> **Pitch point:** "EigenTrust fails against Swarm Collusion. We have BTS."

---

## Part 3: FHE Intent Discovery (Phase 4+)

> **Note:** Part 3 is entirely Phase 4+ material. No code work is planned before 2028.
> Included here for completeness and pitch narrative.

### 3.1 CKKS Scheme for Approximate Arithmetic

**Research formula:**
```
Encoding: vector z ∈ ℂ^(N/2) → polynomial m(x) ∈ ℤ[X]/(X^N + 1)
Scaling factor Δ preserves floating-point precision

Homomorphic operations:
  ⟦x⟧ ⊕ ⟦y⟧ = ⟦x + y⟧    (encrypted addition)
  ⟦x⟧ ⊗ ⟦y⟧ = ⟦x · y⟧    (encrypted multiplication)

Security basis: Ring Learning With Errors (RLWE) — post-quantum resistant
```

> CKKS is uniquely suited for Agora because trust scores and hyperbolic embeddings are continuous real-valued variables (unlike BFV/BGV which work only with integers).

**Code status:** ❌ NOT BUILT — Phase 4+
**Target phase:** Phase 4 (2028-2029)

---

### 3.2 Polynomial Approximation of Poincaré Distance in FHE

**Research innovation:**
```
Problem: arcosh() and division are non-polynomial → can't compute in FHE directly

Solution: Exploit monotonicity.
  Since arcosh(x) is strictly monotonically increasing for x ∈ [1, ∞),
  we can minimize the ARGUMENT instead of computing arcosh itself.

  δ = 1 + 2 · ‖u - v‖² / ((1 - ‖u‖²)(1 - ‖v‖²))

Client-side precomputation (avoid homomorphic division):
  C_u = 1 / (1 - ‖u‖²)    (computed in plaintext by initiator)
  C_v = 1 / (1 - ‖v‖²)    (computed in plaintext by agent)

FHE computation (pure polynomial — additions + multiplications only):
  ⟦δ⟧ = ⟦1⟧ ⊕ (⟦2⟧ ⊗ ⟦C_u⟧ ⊗ ⟦C_v⟧ ⊗ ⟦‖u-v‖²⟧)

Trust integration:
  ⟦D_match⟧ = ⟦δ⟧ ⊗ ⟦τ_v⁻¹⟧
```

> The network returns the routing result WITHOUT having decryption keys — neither the query intent nor the agent profile is ever revealed.

**Code status:** ❌ NOT BUILT — Phase 4+

---

### 3.3 VeriSimplePIR (Verifiable Private Information Retrieval)

**Research comparison:**
```
| Protocol          | Client State (8 GiB DB) | Latency       | Verification |
|-------------------|-------------------------|---------------|-------------|
| Basic FHE Search  | ~8 GiB (full download)  | Minutes/hours | None        |
| SimplePIR         | >1 GiB                 | Fast          | None        |
| VeriSimplePIR     | ~512 KiB (2000× better)| Fast          | Cryptographic|
```

> Based on vLHE (Verifiable Linearly Homomorphic Encryption) using Ring LWE + SIS. MIT CSAIL research. Post-quantum secure.

> Allows the Agora router to access encrypted agent profiles with ultra-low latency and perform blind matching across hundreds of candidates in parallel.

**Code status:** ❌ NOT BUILT — Phase 4+
**Target phase:** Phase 4 (2028-2029)

---

## Cross-Reference: Research → Current Code

### What IS Implemented (Phase 0 — Current)

| # | Feature | Code File | Lines | Status |
|---|---------|-----------|-------|--------|
| 1 | 6-component scoring | `trust/calculator.ts` | 34-103 | ✅ Production |
| 2 | Adaptive 4-tier weights | `trust/calculator.ts` | 34-71 | ✅ Production |
| 3 | LiveTrustTracker (real-time) | `trust/calculator.ts` | 153-308 | ✅ Production |
| 4 | EWMA persistence | `db/supabase.ts` | 272-275 | ✅ Production |
| 5 | Sigmoid α | `db/supabase.ts` | 265-270 | ✅ Production |
| 6 | Wilson Score cold start | `db/supabase.ts` | 237-256 | ✅ Production |
| 7 | Trust decay (30-day) | `db/supabase.ts` | 227-235 | ✅ Production |
| 8 | Asymmetric 2× penalty | `db/supabase.ts` | 258-263 | ✅ Production |
| 9 | MCP search (8 tools) | `mcp-server/index.ts` | 1-620 | ✅ Production |
| 10 | Keyword capability match | `trust/calculator.ts` | 106-120 | ✅ Production |
| 11 | QA validation (single) | `agents/buyer-chain.ts` | 83-117 | ✅ Production |

### What is NOT Built (with target phases)

| # | Feature | Target Phase | Dependencies |
|---|---------|-------------|-------------|
| 1 | Cascading Entropy (simplified) | Phase 2 | None |
| 2 | Anti-Correlation Penalty | Phase 2 | Trust history data |
| 3 | Multi-Auditor QA (BTS-lite) | Phase 2 | >100 txns/day |
| 4 | VCG-lite Agent Selection | Phase 2+ | Semantic search |
| 5 | pgvector Semantic Search | Phase 2 | Supabase pgvector |
| 6 | TEE Remote Attestation | Phase 2 | SGX/TDX infrastructure |
| 7 | Poincaré Ball Embeddings | Phase 3 | Semantic search foundation |
| 8 | Nonlinear Slashing (full) | Phase 3 | Staking mechanism |
| 9 | Traffic Light Validators | Phase 3 | Multi-agent pipeline |
| 10 | GAT Intent Decomposition | Phase 3 | ML infrastructure |
| 11 | MDP Optimal Routing | Phase 3 | Historical pair data |
| 12 | Stochastic ZK Spot Checks | Phase 3 | ZK circuit infrastructure |
| 13 | opML Bisection Protocol | Phase 3 | Dispute resolution system |
| 14 | CKKS FHE Matching | Phase 4 | FHE library integration |
| 15 | VeriSimplePIR | Phase 4 | PIR library + scale |
| 16 | Full zkML | Phase 4+ | Practical zkML for large models |

---

## References

- Deep Research source: `AGORA DEEP research.docx` (2026-03-29)
- Trust engine implementation: `packages/orchestrator/src/trust/calculator.ts`
- Persistence implementation: `packages/orchestrator/src/db/supabase.ts`
- MCP server implementation: `packages/mcp-server/src/index.ts`
- Architecture overview: `docs/technical/HONEST_ARCHITECTURE.md`
- Trust engine spec: `docs/technical/TRUST_ENGINE.md`
