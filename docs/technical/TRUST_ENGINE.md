<!--
purpose: How the trust scoring system actually works in the current codebase
audience: Developers, AI systems, technical investors
last_updated: 2026-03-10
-->

# Trust Engine — Technical Specification

> **This document describes the CURRENT TypeScript implementation (EWMA + ADAPTIVE 4-TIER).**
> Updated Session 16 (2026-03-10) to reflect EWMA scoring, trust decay, and asymmetric penalties.
> The canonical source code is `packages/orchestrator/src/trust/calculator.ts` + `db/supabase.ts`.

## Current Implementation

### Language & Location

| Item | Value |
| --- | --- |
| Language | TypeScript |
| File | `packages/orchestrator/src/trust/calculator.ts` |
| Lines | 219 |
| Runtime | Node.js (Express server) |
| Persistence | Supabase (PostgreSQL) |
| Real-time | SSE (Server-Sent Events) |

### Adaptive Trust Score Components

The trust score is a weighted sum of 6 components, each scored 0.0–1.0. **Weights are ADAPTIVE** — they change based on the agent's transaction history:

| Tier | Transactions | Identity | Capability | Response | Execution | Peer | History |
| --- | --- | --- | --- | --- | --- | --- | --- |
| **Cold Start** (`new`) | 0-2 | **35%** | **30%** | 15% | 15% | 5% | 0% |
| **Emerging** (`low`) | 3-10 | 25% | 20% | 25% | 20% | 5% | 5% |
| **Established** (`medium`) | 11-50 | 15% | 15% | 25% | 25% | 10% | 10% |
| **Veteran** (`high`) | 50+ | 10% | 10% | 25% | 25% | **15%** | **15%** |

**Key insight:** New agents are judged on what they CLAIM (identity/capability). Veteran agents are judged on what they've PROVEN (history/peer review).

### Per-Transaction Score

```
txn_score = Σ (component_score × adaptive_weight[tier])
```

### EWMA Score Persistence (Dynamic Formula)

Trust scores are **NOT overwritten** — they use Exponential Weighted Moving Average:

```
T_new = α × adjustedScore + (1 - α) × T_old_decayed
```

#### Dynamic α via Logistic (Sigmoid) Curve

Instead of discrete tiers (which create mathematical cliffs), α follows a smooth sigmoid:

```
α(N) = 0.12 + 0.58 / (1 + e^(0.08 × (N - 30)))
```

| Transaction Count | α (approx) | Behavior |
| --- | --- | --- |
| N = 1 | ~0.67 | Very responsive, building quickly |
| N = 10 | ~0.48 | Moderately responsive |
| N = 30 | ~0.41 | Midpoint — transitioning |
| N = 50 | ~0.24 | Becoming stable |
| N = 100+ | ~0.12 | Veteran — hard to move |

#### Cold-Start Protection: Wilson Score Lower Bound

For agents with < 5 transactions, EWMA is bypassed. Instead, the **Wilson Score Confidence Interval** prevents 1/1 (100%) from outranking 98/100 (98%):

```
W = (p̂ + z²/2n - z√(p̂(1-p̂)/n + z²/4n²)) / (1 + z²/n)
```

With z = 1.96 (95% confidence). Small sample sizes are heavily penalized.

#### Asymmetric Penalty (Loss Aversion)

Failures are penalized **2× harder** than successes reward. Instead of adjusting α (which can break EWMA math), the **raw score is adjusted**:

```
if score < 0.5:
    adjustedScore = max(0, score - (0.5 - score))
    // Example: score 0.3 → adjusted to 0.1 (not 0.3)
```

### Trust Decay (30-day Half-Life)

Inactive agents lose trust over time:

```
T_decayed = T_old × 0.5^(days_since_last_txn / 30)
```

After 30 days of inactivity: trust halved. After 60 days: quartered.

### Trust Levels

| Level | Range | Display |
| --- | --- | --- |
| `unrated` | 0 | New agent, no interactions |
| `low` | < 0.45 | ⚠️ Low reliability |
| `medium` | 0.45 – 0.75 | 🔶 Moderate |
| `high` | ≥ 0.75 | ✅ Reliable |

### How Components Are Computed During Demo

| Component | Demo Default | Live Update | Source |
| --- | --- | --- | --- |
| `identity` | 0.70 | Set when agent is validated | DID format check |
| `capability_match` | 0.50 | Updated by ProcurementAgent | Gemini evaluation |
| `response_time` | 0.50 | Measured during execution | Actual latency |
| `execution_quality` | 0.50 | Updated by QAInspector | Gemini evaluation |
| `peer_review` | 0.50 | Updated by DeliveryAgent | Cross-validation |
| `history` | 0.50 | Updated from Supabase records | Historical data |

### Real-time Updates via SSE

During a demo session, the trust calculator emits SSE events as each component is computed:

```json
{
  "type": "trust_component_update",
  "metadata": {
    "component": "response_time",
    "score": 0.85,
    "weight": 0.25,
    "allComponents": [...],
    "compositeScore": 0.742,
    "confidence": "medium",
    "dataPoints": 4
  }
}
```

The DemoPage UI renders these as live-updating progress bars.

### Persistence (EWMA)

Trust scores are updated in Supabase via `updateAgentMetrics()` using EWMA:

1. Read current `trust_score`, `updated_at`, `total_calls` from agent record
2. Apply decay: `decayed = trust_score × 0.5^(daysSinceUpdate / 30)`
3. Choose α based on `total_calls` tier
4. Apply asymmetric α if failure (score < 0.4)
5. EWMA update: `new_score = α × txn_score + (1 - α) × decayed`
6. Write `trust_score`, increment `total_calls`, update `avg_latency_ms`

---

## What Does NOT Exist (Phase 2)

> The following features are designed but NOT implemented in code.
> **Deep Research (2026-03-29)** provides formal mathematical foundations for each.
> See: [RESEARCH_FOUNDATION.md](../research/RESEARCH_FOUNDATION.md)

### Rust Trust Engine

- **Status:** Not started. Only `packages/core/Cargo.toml` exists (no `src/` directory)
- **When needed:** If TypeScript performance becomes a bottleneck (unlikely before 100K+ agents)

### Anti-Gaming Detectors (4 designed → Research-Backed Upgrade Path)

1. **Sybil Detection** → **Nonlinear Slashing** (Phase 2): `Φ_v(x) = S_v · (k · C/S_total)^γ`
2. **Review Pattern Anomaly** → **BTS P2P Audit** (Phase 2): `Score = log(x_i / ȳ_i)`
3. **Transaction Velocity Anomaly** → **Anti-Correlation Penalty**: `penalty × (1 + β × correlation)`
4. **Score Manipulation Detection** → **Cascading Entropy**: `P_chain = ∏ p_i · exp(-Σ H_cascade)`

All four now have **formal mathematical foundations** from deep research.

### ZK Proofs (Circom/Groth16) → Hybrid Verification Architecture

- **Status:** Circuit file exists in `circuits/trust_proof/` but is NOT integrated
- **Research upgrade path:**
  - Phase 2: **TEE Remote Attestation** (<10% overhead, <1s verification)
  - Phase 3: **Stochastic ZK-Spot-Checks** (5% of queries, $0.07/check, 99% detection after 90 queries)
  - Phase 3: **opML Bisection Protocol** (dispute resolution, O(log N) rounds)
  - Phase 4: **Full zkML** (every inference — currently impractical for large models)
- **Architecture:** Traffic Light model — 85% TEE, 12% TEE+SpotZK, 3% full zkML

### Merkle Tree Score History

- **Status:** Not built. `schema.sql` defines `merkle_roots` table but it's not deployed
- **When needed:** Audit trail requirement from enterprise customers

---

## Phase 2 Roadmap — Research-Backed Upgrades

> **Source:** Deep Research (2026-03-29) — Verifiable AI Execution + Mechanism Design
> See full formulas: [DEEP_RESEARCH_VERIFIABLE_AI.md](../research/DEEP_RESEARCH_VERIFIABLE_AI.md)

### 2.1 Bayesian Truth Serum (BTS) for Peer Review

Replaces single QAInspector evaluation with multi-auditor pool using BTS.
**BTS guarantees honest reporting as a strictly dominant strategy (SPNE).**

```
Score_auditor = log(x_i / ȳ_i)

Agora-adapted:
R_auditor = max(0, log(x / ȳ) × τ_auditor × quality_weight)

Where:
  x_i = actual fraction of auditors with answer i
  ȳ_i = average prediction about fraction of answer i
  τ_auditor = auditor's own trust score
  quality_weight = depth of audit (shallow/deep)
```

**Target file:** `packages/orchestrator/src/agents/qaInspector.ts` (multi-auditor refactor)
**Prerequisite:** >100 transactions/day for statistical power.

### 2.2 Nonlinear Slashing (Anti-Sybil Economics)

Superlinear penalties make Sybil attacks economically irrational:

```
Φ_v(x) = S_v · (k · C/S_total)^γ

Where:
  S_v = validator stake
  C = total correlated failures
  S_total = total stake all validators
  k = 2, γ = 1.5 (recommended)

Impact:
  Solo failure (1%):      2.8% of stake
  Coordinated 20%:       17.9% of stake
  Coordinated 50%:       70.7% of stake
```

**Target file:** New `packages/orchestrator/src/trust/antiSybil.ts`

### 2.3 Cascading Entropy — "The 95% Trap"

Multi-agent pipeline reliability math:

```
P_success(chain) = ∏ p_i · exp(-Σ H_cascade(i))

Example: 5 agents at 95% each
  P_chain = 0.95⁵ = 0.774 (only 77%!)
```

**Target file:** `packages/orchestrator/src/pipeline/manager.ts`
**Action:** Add `chainReliability()` check before pipeline start.

### 2.4 VCG Auction for API Routing

Provably incentive-compatible agent selection:

```
Allocation: x* = argmax Σ vᵢ(x)
Payment:    pᵢ = Σⱼ≠ᵢ vⱼ(x*₋ᵢ) - Σⱼ≠ᵢ vⱼ(x*)

Bid function:
  bid_i = w₁·trust + w₂·capability_match + w₃·(1/latency) + w₄·(1/price)
```

**Property:** DSIC — agents literally cannot benefit from lying.
**Target file:** `packages/orchestrator/src/agents/procurementAgent.ts`

### 2.5 TEE Remote Attestation (First Verification Layer)

```
Flow:
  1. Provider runs inference in SGX/TDX enclave
  2. Enclave generates: MRENCLAVE + MRSIGNER + PCR[model_hash, input_hash, output_hash]
  3. Client verifies via Intel/AMD attestation service
  4. Verification: <1 second, <10% overhead
```

Solves **Model Downgrade Attack** (provider claims GPT-4, uses GPT-3.5, pockets 97% margin).
**Target file:** New `packages/orchestrator/src/verification/tee.ts`

### 2.6 Poincaré Ball Embeddings for Discovery

Hyperbolic geometry for hierarchical skill matching:

```
d_P(u, v) = arcosh(1 + 2·||u-v||² / ((1-||u||²)(1-||v||²)))

Trust-Weighted:
d_TWP(u, v) = (1 / √(τ_u · τ_v)) · d_P(u, v)
```

**Why:** 2-5 dim hyperbolic > 100 dim euclidean for skill hierarchies.
**Target file:** New `packages/orchestrator/src/discovery/poincare.ts`

### 2.7 EigenTrust Critique (Validation of Current Approach)

EigenTrust (PageRank for trust) fails for AI agents because agent creation is free (unlike websites). Our BTS + Nonlinear Slashing + Wilson Score approach is mathematically superior.

**Pitch point:** "EigenTrust fails against Swarm Collusion. We have BTS."

---

## ERC-8004 Integration (Roadmap)

> ERC-8004 ("Trustless Agents") is **LIVE on Ethereum mainnet** since January 2026 with **10,000+ registered agents**.
> Co-authored by MetaMask, Ethereum Foundation, Google, and Coinbase.

### 3 Registries

| Registry | What It Stores | Agora Integration Status |
| --- | --- | --- |
| **Identity Registry** | ERC-721 agent NFT passport + capabilities | ❌ Not integrated |
| **Reputation Registry** | On-chain feedback from clients | ❌ Not integrated |
| **Validation Registry** | TEE/zkML proof of work quality | ❌ Not integrated |

### Agora's Role

ERC-8004 stores **raw data** (identity, feedback, validation proofs).
Agora is the **scoring engine** that interprets this data into actionable trust scores.

**Minimum Viable Integration:**

1. Read from Identity Registry to verify agent DID
2. Submit trust_score to Reputation Registry after each transaction
3. Store Agora composite score as attestation

---

## Integration Points

### Supabase Tables Used

```sql
-- Agent data stored in 'listings' table
-- Trust score stored as EWMA field on agent record
-- Transactions logged in 'transactions' table
-- API usage in 'usage_logs' table
```

### SSE Event Types for Trust

| Event Type | When Emitted |
| --- | --- |
| `trust_component_update` | Each component calculated |
| `trust_updated` | Final composite score ready |
| `api_call` | Each API call with success/failure status |

### Config Dependencies

```typescript
// packages/orchestrator/src/config.ts
GEMINI_API_KEY   // Required for agent reasoning
SUPABASE_URL     // Database and auth
SUPABASE_KEY     // Anon key for client access
```
