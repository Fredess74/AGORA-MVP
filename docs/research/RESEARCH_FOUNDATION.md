<!--
purpose: Operational map — which deep research formulas apply where in Agora's architecture
audience: Developers, AI systems, founders
source: docs/research/DEEP_RESEARCH_VERIFIABLE_AI.md
last_updated: 2026-03-29
-->

# Research Foundation — Agora Trust Architecture

> **This document maps academic research to production implementation.**
> It bridges the gap between deep research and code.
> Source research: [DEEP_RESEARCH_VERIFIABLE_AI.md](../research/DEEP_RESEARCH_VERIFIABLE_AI.md)

---

## 1. Trust Engine Enhancements (Phase 2)

### 1.1 Bayesian Truth Serum for Peer Review

**Current state:** Peer Review component = Gemini evaluation (single model, no diversity).
**Research upgrade:** BTS guarantees honest reporting as a strictly dominant strategy.

**Formula:**
```
Score_auditor = log(x_i / ȳ_i)
```
- `x_i` = actual fraction of auditors with answer i
- `ȳ_i` = average prediction about fraction of answer i

**Agora-adapted formula:**
```
R_auditor = max(0, log(x / ȳ) × τ_auditor × quality_weight)
```
- `τ_auditor` = auditor's own trust score (prevents low-trust manipulation)
- `quality_weight` = depth of audit (shallow/deep)

**Where in code:** Replace single QAInspector → multi-auditor BTS pool.
**File:** `packages/orchestrator/src/agents/qaInspector.ts` (future)
**Prerequisite:** >100 transactions/day for statistical power.

### 1.2 Nonlinear Slashing for Anti-Sybil

**Current state:** No anti-gaming detectors built (4 designed, 0 implemented).
**Research upgrade:** Superlinear penalties destroy Sybil economics.

**Formula:**
```
Φ_v(x) = S_v · (k · C/S_total)^γ

Where:
  S_v = validator stake
  C = total correlated failures
  S_total = total stake all validators
  k = 2 (scaling constant)
  γ = 1.5 (superlinear exponent)
```

**Anti-correlation penalty:**
```
penalty_i = base_penalty × (1 + β × correlation_with_others)
```

**Impact table:**
| Scenario | C/S_total | Penalty |
|----------|-----------|---------|
| Solo failure | 0.01 | 2.8% of stake |
| Coordinated 20% | 0.20 | 17.9% of stake |
| Coordinated 50% | 0.50 | 70.7% of stake |

**Where in code:** New `packages/orchestrator/src/trust/antiSybil.ts`
**File touches:** `calculator.ts` (add correlation check), `supabase.ts` (trust_history queries)

### 1.3 Cascading Entropy Monitor ("The 95% Trap")

**Current state:** Pipeline has no reliability math for multi-agent chains.
**Research upgrade:** Even 95% per-agent reliability yields 77% system reliability over 5 agents.

**Formula:**
```
P_success(chain) = ∏ p_i · exp(-Σ H_cascade(i))
```

**Simple approximation for pipeline:**
```
P_chain = p₁ × p₂ × p₃ × ... × pₙ
P_chain(5 agents at 0.95) = 0.95⁵ = 0.774
```

**Where in code:** `packages/orchestrator/src/pipeline/manager.ts`
- Add `chainReliability()` calculation before pipeline start
- If P_chain < threshold (0.80) → add redundancy or warn client
- Log `chain_entropy` to `trust_history` for each pipeline run

### 1.4 EigenTrust Critique — Why We DON'T Use PageRank

**Current state:** No PageRank/EigenTrust in design.
**Research validation:** Correct decision. EigenTrust fails against:
1. Swarm Collusion (mutual rating amplification)
2. Pre-trust exploitation (bootstrapped identities)
3. Convergence attacks (strategic eigenvalue manipulation)

**Key insight for pitch:**
> "Creating a new AI agent is free — unlike creating a website for PageRank.
> EigenTrust's core assumption (link creation is costly) breaks in AI economy."

**Our defense:** BTS + Nonlinear Slashing + Wilson Score cold-start > EigenTrust.

---

## 2. Discovery Engine Upgrades (Phase 2)

### 2.1 Poincaré Ball Embeddings

**Current state:** No semantic search built. Plan = pgvector (euclidean/cosine).
**Research upgrade:** Hyperbolic embeddings are 10-50x more efficient for hierarchies.

**Formula:**
```
d_P(u, v) = arcosh(1 + 2·||u-v||² / ((1-||u||²)(1-||v||²)))
```

**Why better than euclidean:**
- Skill trees are hierarchical: "programming" → "python" → "ML" → "transformer fine-tuning"
- Euclidean volume grows polynomially → information loss for hierarchies
- Hyperbolic volume grows exponentially → preserves hierarchy naturally
- **2-5 dim hyperbolic > 100 dim euclidean** for hierarchically structured data

**Where in code:** Replace future `pgvector` with Poincaré ball model.
**New file:** `packages/orchestrator/src/discovery/poincare.ts`
**Supabase:** Custom distance function vs. native pgvector support trade-off.
**Prerequisite:** Need >50 agents for meaningful embedding space.

### 2.2 Trust-Weighted Poincaré Distance

**Current state:** Discovery ranking = FTS relevance only (no trust integration).
**Research upgrade:** Single unified metric for trust + semantic similarity.

**Formula:**
```
d_TWP(u, v) = (1 / √(τ_u · τ_v)) · d_P(u, v)
```

**Behavior:**
- High trust (τ=0.9) → distance shrinks → agent appears "closer" to query
- Low trust (τ=0.3) → distance expands → agent pushed away
- Two agents equidistant semantically → higher trust agent wins

**Where in code:** `packages/mcp-server/src/index.ts` → `search_agents` tool
**Integration:** Replace simple FTS+trust_score sorting with d_TWP ranking.

### 2.3 VCG Auction for API Routing

**Current state:** ProcurementAgent selects best agent via simple trust ranking.
**Research upgrade:** Provably incentive-compatible allocation.

**Formulas:**
```
Allocation: x* = argmax Σ vᵢ(x)
Payment:    pᵢ = Σⱼ≠ᵢ vⱼ(x*₋ᵢ) - Σⱼ≠ᵢ vⱼ(x*)
```

**Properties:**
- DSIC: Agents cannot improve utility by lying about capabilities/latency
- Allocative efficiency: Maximizes social welfare
- Individual rationality: Participation ≥ non-participation

**Agora-specific bid function:**
```
bid_i = w₁·trust_i + w₂·capability_match_i + w₃·(1/latency_i) + w₄·(1/price_i)
```

**Where in code:** `packages/orchestrator/src/agents/procurementAgent.ts`
**When:** Phase 2 when we have >5 competing agents for same capability.

---

## 3. Verification Layer (Phase 2-3)

### 3.1 TEE Remote Attestation (Phase 2 — FIRST verification)

**Current state:** Zero verification. Agent says "I used GPT-4" — we believe it.
**Research upgrade:** Hardware-backed proof with <10% overhead.

**Attestation flow:**
```
1. Provider runs inference in SGX/TDX enclave
2. Enclave generates attestation report:
   - MRENCLAVE (hash of code)
   - MRSIGNER (hash of developer signature)
   - PCR[model_id] (custom: model_hash + input_hash + output_hash)
3. Client verifies via Intel/AMD attestation service
4. Verification time: <1 second
```

**Overhead:** <10% latency, <5% compute.
**Where in code:** New `packages/orchestrator/src/verification/tee.ts`
**Cloud support:** Azure Confidential Computing, GCP Confidential VMs, AWS Nitro Enclaves

### 3.2 Stochastic ZK-Spot-Checks (Phase 3)

**Current state:** No ZK integration (circuit exists but unused).
**Research upgrade:** Probabilistic ZK — verify 5% of queries, detect fraud with 99% confidence after 90 queries.

**Formula:**
```
P(spot_check) = ρ = 0.05
Expected cost per query = ρ × C_zk = 0.05 × $1.40 = $0.07
Detection after K queries: P(detect) = 1 - (1-ρ)^K
  K=45: P > 90%
  K=90: P > 99%
```

**Where in code:** `packages/orchestrator/src/verification/zkSpotCheck.ts`
**Integration with:** `circuits/trust_proof/` (existing Circom circuit)

### 3.3 PoEA — Proof of Efficient Attribution (Phase 3)

**Formula:**
```
1. Model Registry: hash(model_weights) → model_id
2. TEE attestation: PCR[model_id] → enclave report
3. ZK-proof: prove(model_id ∈ Registry) without revealing weights
```

**Where in code:** Combines TEE (3.1) + ZK (3.2) + new Model Registry.
**New Supabase table:** `model_registry` (model_id, weight_hash, provider, version)

### 3.4 opML Bisection Protocol (Phase 3)

**For dispute resolution:**
```
1. Challenger posts dispute bond D
2. Bisection game: O(log N) rounds
3. Final round: single operation verified on-chain
4. Loser forfeits deposit D
```

**Where in code:** `packages/orchestrator/src/verification/opml.ts`
**Needs:** Smart contract for bond management (post-Phase 2).

---

## 4. Items Explicitly NOT in Scope

| Component | Phase | Why NOT now |
|-----------|-------|-------------|
| Full zkML (every inference) | Phase 4+ | T_prove ≈ 45-180 min for 70B model |
| FHE Blind Matching (CKKS) | Phase 4+ | 1000x overhead vs plaintext |
| GAT Intent Decomposition | Phase 3 | Need >20 agents for meaningful DAG |
| MDP Chain Optimization | Phase 3 | Need agent network scale |
| KZG Polynomial Commitments | Phase 3 | Requires trusted setup ceremony |

---

## 5. Pitch Ammunition from Research

### Slides / Talking Points

1. **"The 95% Trap"** — `0.95⁵ = 0.774`. Five 95%-reliable agents = 77% pipeline. We measure and manage this.

2. **"EigenTrust is Broken for AI"** — EigenTrust/PageRank fails because creating AI agents is free (unlike websites). We use BTS + nonlinear slashing instead.

3. **"Verifiability Trilemma"** — No single technology solves verification. We use TEE (fast), opML (disputes), zkML (critical) — hybrid architecture.

4. **"Model Downgrade Attack"** — Provider claims GPT-4, uses GPT-3.5, pockets 97% margin. Our TEE attestation catches this with <10% overhead.

5. **"VCG Auctions = Truth-Telling"** — Our routing mechanism is provably incentive-compatible. Agents literally cannot benefit from lying about their capabilities.

6. **"Hyperbolic > Euclidean"** — 5-dimensional Poincaré embeddings outperform 100-dimensional euclidean for skill hierarchies. We search smarter, not bigger.
