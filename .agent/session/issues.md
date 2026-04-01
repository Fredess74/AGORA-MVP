# Agora Issues Tracker
> Generated from NotebookLM deep analysis — 2026-03-31
> Source: 54 documents, 5 cross-referenced queries

---

## 🔴 Critical Issues (Demo/Pitch Breaking)

### ISSUE-001: Pitch Deck Trust Signals ≠ Code Signals
- **Severity:** 🔴 CRITICAL
- **Progress:** 0%
- **Source:** NLM Query 3 (docs-vs-code gaps)
- **Problem:** Pitch deck slide 5 claims 6 signals: Uptime (25%), Transaction Success (25%), Code Quality (20%), Repo Health (15%), User Reviews (10%), Account Age (5%). The ACTUAL code computes completely different signals: Identity, Capability Match, Response Time, Execution Quality, Peer Review, History. Docs even admit the pitch signals are "ASPIRATIONAL... FUTURE design" and "NOT currently computed."
- **Risk:** Judge asks "show me the code quality signal" → it doesn't exist
- **Fix:** Update pitch deck to match real signals OR label clearly as roadmap
- **Effort:** S (1-2 hours)
- **Next step:** Sync pitch deck slide 5 with `calculator.ts` reality

### ISSUE-002: ZK Proofs Claimed But Never Integrated
- **Severity:** 🔴 CRITICAL  
- **Progress:** 0%
- **Source:** NLM Query 3
- **Problem:** Pitch claims "Circom + Groth16, cryptographically verifiable" ZK proofs. Reality: circuit file exists in `circuits/trust_proof/` but is NEVER called from any code path. HONEST_ARCHITECTURE.md explicitly admits this.
- **Risk:** Judge asks "show me the ZK proof" → can't demo it
- **Fix:** Remove ZK claims from pitch OR add honest disclaimer
- **Effort:** S (pitch edit) / L (actual integration)
- **Next step:** Remove from pitch Traction slide, add to Roadmap

### ISSUE-003: Rust Trust Engine Myth
- **Severity:** 🟡 HIGH
- **Progress:** 0%
- **Source:** NLM Query 3
- **Problem:** Old docs (COFOUNDER_MEMO) claim "Rust Trust Engine, 170+ tests." Reality: only Cargo.toml exists, no src/ directory, 1 test file with 209 lines. Pitch slide 12 still says "Rust, TypeScript-based."
- **Fix:** Remove all Rust claims. Engine is TypeScript only.
- **Effort:** S

---

## 🟠 Economic Contradictions

### ISSUE-004: Cold Start Circular Dependency
- **Severity:** 🟠 HIGH
- **Progress:** 30% (Wilson Score cold-start built)
- **Source:** NLM Query 1 (economic contradictions)
- **Problem:** Trust scores need transaction data → transactions need trust scores → circular. Platform has ZERO real transactions. Wilson Score (0.35-0.50 for new agents) is a temporary band-aid.
- **Mitigation in place:** Wilson Score lower bound, AI Curation Crawler concept, Builder Credits (0% commission)
- **Next step:** Generate 5-10 synthetic demo transactions to prove EWMA persistence works live

### ISSUE-005: Payment Processing = Zero Code
- **Severity:** 🟠 HIGH
- **Progress:** 0%
- **Source:** NLM Query 1
- **Problem:** Business model projects $2,075 revenue by Month 6. ZERO payment code exists. No Stripe Connect, no x402 handlers. Every financial projection assumes infrastructure that hasn't been built. Docs explicitly warn: "⚠️ No payment code exists."
- **Risk:** Revenue milestones are meaningless without payment rails
- **Fix:** "Coming Soon" placeholders already in UI ✅ but code path = empty
- **Next step:** Build Stripe Connect integration post-LLC (August 2026)

### ISSUE-006: x402 Volume Inflation (40-50% Wash Trading)
- **Severity:** 🟡 MEDIUM
- **Progress:** 0%
- **Source:** NLM Query 1
- **Problem:** Market sizing claims "$600M annualized x402 volume." Deep research reveals 40-50% is wash trading (bots farming airdrops). Real daily volume ~$28K. Using raw $600M in projections = massive overestimation.
- **Fix:** Use Circle Nanopayments data ($43M real volume, 140M transactions) as primary proof point instead
- **Effort:** S (docs update)

### ISSUE-007: F-1 Visa Revenue Impossibility (Months 1-6)
- **Severity:** 🟡 MEDIUM
- **Progress:** 100% (documented in roadmap)
- **Source:** NLM Query 1
- **Problem:** Financial projections show revenue starting Month 2. F-1 visa LEGALLY PROHIBITS revenue generation until LLC + OPT (August 2026). All pre-LLC work must be academic.
- **Status:** Already documented in STRATEGIC_ROADMAP_5YEAR.md ✅
- **Risk:** Judge calculates timeline and spots contradiction

### ISSUE-008: Commission Margin Compression (Anthropic 0%)
- **Severity:** 🟠 HIGH
- **Progress:** 20% (defense documented)
- **Source:** NLM Queries 1 & 5
- **Problem:** Agora charges 10% commission. Anthropic Claude Marketplace launched with 0% commission as loss leader. If MCP tools are discovered via Claude directly, Agora's entire commission stream gets bypassed.
- **Defense:** Cross-platform neutrality, Trust API SaaS as commission-independent revenue
- **Next step:** Accelerate Trust API as primary revenue, de-emphasize commission in pitch

---

## 🟡 Hidden Strengths (Currently Wasted)

### ISSUE-009: Trust Breakdown Function Not Exposed in UI
- **Severity:** 🟢 QUICK WIN
- **Progress:** 0%
- **Source:** NLM Query 4 (quick wins)
- **Problem:** `buildTrustBreakdown()` in MCP server generates detailed 6-component breakdown with EWMA formula, adaptive weights, and reasoning. Web UI only shows a simple modal. Exposing this visually = instant proof of mathematical rigor.
- **Fix:** Add trust breakdown visualization to ProductDetailPage
- **Effort:** S (4-6 hours)
- **Impact:** HIGH — judges see real math, not just a number

### ISSUE-010: Trust Badges Not Rendered
- **Severity:** 🟢 QUICK WIN
- **Progress:** 0%
- **Source:** NLM Query 4
- **Problem:** Badge criteria (🟢 Verified, ⭐ Rising Star, 🏆 Top Rated, 🛡️ Enterprise Ready) defined and computation module marked complete, but NOT rendered in marketplace UI.
- **Fix:** Add badge icons to ProductCard component
- **Effort:** S (2-3 hours)

### ISSUE-011: "Skills" Category Not Marketed
- **Severity:** 🟡 MEDIUM
- **Progress:** 50% (code exists, pitch ignores)
- **Source:** NLM Query 2 (hidden strengths)
- **Problem:** Database has 10 real Skills (Code Review, Data Pipeline, SQL Optimizer, etc.) but pitch deck and marketing only mention "Agents" and "MCP Servers." Skills = reusable prompt engineering marketplace = unique differentiator.
- **Fix:** Add Skills mention to pitch as third product category
- **Effort:** S

### ISSUE-012: SSE Telemetry Not Persisted as Audit Trail
- **Severity:** 🟡 MEDIUM
- **Progress:** 0%
- **Source:** NLM Query 4
- **Problem:** Orchestrator broadcasts 11 SSE events per pipeline run (task_formulated → trust_update). Currently used only for UI progress bars. If persistently logged, could be marketed as "enterprise-grade audit trail" satisfying EU AI Act Article 12.
- **Fix:** Log SSE events to Supabase `usage_logs` table
- **Effort:** M (1 day)

### ISSUE-013: GitHub Raw Metrics Discarded After Audit
- **Severity:** 🟢 LOW
- **Progress:** 0%
- **Source:** NLM Query 4
- **Problem:** CodeGuard fetches stars, contributors, issues, languages, dependencies from GitHub API — then feeds it to Gemini and throws away the raw data. Displaying raw metrics on agent profile = instant visual trust.
- **Effort:** M

---

## 🔵 Blind Spots (Unaddressed Risks)

### ISSUE-014: "Neutrality" Defense vs Big Tech is Weak
- **Severity:** 🟠 HIGH
- **Progress:** 0%
- **Source:** NLM Query 5 (blind spots)
- **Problem:** Risk analysis dismisses AWS/Azure threat by claiming they "can't be neutral." Reality: enterprises prioritize integration over neutrality. If AWS adds basic trust badges to Bedrock, enterprises will choose the frictionless incumbient over an unproven startup.
- **Fix:** Develop concrete "Enterprise can't get THIS from AWS" proof points
- **Next step:** Research if AWS/Azure/Google have announced scoring features

### ISSUE-015: Open Algorithm = Open-Source Fork Risk
- **Severity:** 🟠 HIGH
- **Progress:** 0%
- **Source:** NLM Query 5
- **Problem:** Agora plans "Radical Transparency" — publishing trust algorithm as "Linux of AI Trust." Risk: community forks the formula, applies it to ERC-8004 raw data, provides trust scoring for FREE. Destroys Trust API SaaS revenue ($29-99/mo).
- **Defense needed:** Publish formula but keep anti-gaming thresholds private. Moat = data, not algorithm.

### ISSUE-016: x402/Crypto Money Transmitter Risk
- **Severity:** 🟡 MEDIUM
- **Progress:** 0%
- **Source:** NLM Query 5
- **Problem:** Risk docs focus on EU AI Act but ignore US FinCEN money transmitter laws for x402 crypto rail. Facilitating USDC transactions + extracting 10% commission could trigger KYC/AML/MSB requirements.
- **Fix:** Legal review before x402 activation. Document compliance pathway.
- **Effort:** L (legal review needed)

### ISSUE-017: MCP Protocol Abandonment Risk
- **Severity:** 🟡 MEDIUM
- **Progress:** 20% (adapter pattern documented)
- **Source:** NLM Query 5
- **Problem:** Agora is deeply tied to MCP protocol. If Anthropic updates MCP to include native zero-fee discovery, or if a competing protocol wins, Agora's discovery layer becomes redundant.
- **Current defense:** Protocol-agnostic adapter pattern, own discovery API as fallback
- **Next step:** Add A2A/AP2 adapters to demonstrate protocol independence

### ISSUE-018: "Good Enough" Static Security May Win
- **Severity:** 🟡 MEDIUM
- **Progress:** 0%
- **Source:** NLM Query 5
- **Problem:** BlueRock offers free 22-rule static security scanning. For risk-averse enterprise procurement, a checkbox "passed security scan" may be sufficient. Agora's complex 6-signal behavioral scoring may be over-engineering for the initial market.
- **Fix:** Position as complementary: "BlueRock = pre-deploy safety; Agora = runtime reliability"

---

## 📊 Metrics

| Category | Count | Closed |
|----------|-------|--------|
| 🔴 Critical | 3 | 0 |
| 🟠 High | 4 | 0 |
| 🟡 Medium | 6 | 0 |
| 🟢 Quick Win | 3 | 0 |
| 🔵 Blind Spot | 5 | 0 |
| **Total** | **18** | **0** |

---

## Priority Matrix (for Suffolk $40K Demo)

| # | Issue | Effort | Demo Impact | Action |
|---|-------|--------|-------------|--------|
| 001 | Pitch signals ≠ code | S | 🔴 CRITICAL | Fix NOW |
| 002 | ZK proofs fake | S | 🔴 CRITICAL | Remove claims |
| 003 | Rust myth | S | 🟡 HIGH | Remove claims |
| 009 | Trust breakdown UI | S | 🔴 WOW factor | Build it |
| 010 | Trust badges UI | S | 🟡 Visual impact | Build it |
| 011 | Skills not marketed | S | 🟡 Differentiator | Add to pitch |
| 008 | Commission compression | M | 🟠 Story risk | Reframe pitch |
| 012 | SSE audit trail | M | 🟡 Enterprise appeal | Phase 2 |
