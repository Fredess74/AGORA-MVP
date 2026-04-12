# Agora — Decision Log

---

### DEC-011: 2026-04-11 — CJM PHASE 1: Realistic Creator + Buyer Journey

**Сделал:** Created comprehensive CJM for Phase 1 (`docs/CJM_PHASE1.md`). Researched B2D marketplace conversion benchmarks, developer tool discovery patterns, MCP monetization pain points.
**Ключевые выводы:** Creator Aha = trust score breakdown (not revenue). 35% buyers via AI-assistants (zero CAC). Month 6 MRR ~$200-400 (honest). Single-Player Mode critical. Gamify score improvement to retain creators.
**Файл:** `docs/CJM_PHASE1.md`

---

### DEC-010: 2026-04-11 (late) — THREE-PHASE MARKET: Creator → Business → Autonomous

**Сделал:** Fixed A2A-primary market tiers in 01_OVERVIEW.md. Researched marketplace phase strategies (Etsy/Shopify precedent). Aligned tiers with DEC-009 Creator Platform positioning.
**Решение:** Three explicit phases with overlapping timelines:
- **Phase 1 (Now–Month 12): Creators** — Indie devs publish AI tools, discover each other, build for niche markets. Human decision-makers. $3–50 avg txn.
- **Phase 2 (Month 6–24): Businesses** — Companies integrate as legal entities. Procurement, compliance, team accounts. $50–$10K avg txn.
- **Phase 3 (Month 18–36+): Autonomous** — A2A/M2M. Agents autonomously discover, evaluate, hire other agents. $0.01–$500 avg txn.
**Обоснование:** (1) A2A/M2M is inevitable but needs human ecosystem first. (2) Phase 1 attracts decision-makers who will NEED a platform when A2A arrives. (3) Trust data from human transactions → feeds automated scoring. (4) Proven by Etsy (niche creators → discovery platform) and Shopify (SMB → enterprise). (5) Government use = Phase 3+ only.
**Документы обновлены:** 01_OVERVIEW.md (market tiers), 05_MARKET_AND_COMPETITION.md (Recall Network restored), PROTOCOLS.md (x402 $600M → $24M), technical/ (dates + framing), research/02_COMPETITORS.md (superseded notice).
**Условия отмены:** If 0 creator listings by Month 3 → accelerate B2B/enterprise pivot.

### DEC-010B: Recall Network Assessment

**Сделал:** Web research on Recall Network status (previously lost from competitive docs).
**Вывод:** Recall Network ($42M, Multicoin/Coinbase Ventures) is live on Base L2 with $RECALL token at $0.04 (-95% ATH). AgentRank uses on-chain competitions + staking.
**Стратегическая оценка:** DIFFERENT APPROACH, not direct competitor. They = Web3 (token staking, on-chain arenas). We = Web2 SaaS (behavioral EWMA, creator platform). Their token crash (-95%) suggests Web3 approach has adoption friction. Our Web2 approach has lower barrier to entry for indie creators.
**Действие:** Restored to 05_MARKET_AND_COMPETITION.md and HONEST_ARCHITECTURE.md competitive charts.

---

### DEC-009: 2026-04-11 (evening) — STRATEGIC CORRECTION: Creator Platform + Trust Engine

**Сделал:** Challenged the earlier pure-pivot decision. Re-analyzed the market from creator's perspective. Researched indie dev monetization gap, Shopify-for-AI analogies, creator economy patterns.
**Решение:** **Corrected pivot**: Not "kill the marketplace" → "reposition the marketplace as a Creator Platform." Agora = **Etsy for AI tools + FICO for AI quality.** The marketplace LIVES — but as a creator empowerment platform, not as an App Store competitor.
**Key insight:** Nobody serves the indie AI developer. Glama/Smithery = free directories (0 monetization). Claude Marketplace = enterprise-only. Google UCP = for Walmart. AWS Marketplace = $25K minimum. **Agora is the only place where a solo creator can publish, get trust-verified, and earn.**
**Обоснование:** (1) Big Tech serves corporations, not indie creators. (2) 16K+ MCP servers, 0 monetization for creators. (3) Marketplace + Trust Engine = category creation. (4) Trust = quality layer of marketplace, not standalone product. (5) Revenue: SaaS primary, commission secondary, creator upsells = new stream.
**Narrative:** "Every creator economy needs a quality layer. The AI economy doesn't have one. We're building it."
**Documents updated:** CONTEXT.md, 01_OVERVIEW.md, 05_MARKET_AND_COMPETITION.md, MVP_CONCEPT.md, GAMMA_PROMPT_V6_FINAL.md
**Условия отмены:** Month 3: <20 creator listings and 0 CLI downloads → pivot to standalone Trust API.

### 2026-04-11 — STRATEGIC PIVOT: Infrastructure-First (CORRECTED by DEC-009)
**Решение:** ~~Marketplace → pure infrastructure~~ → **Corrected**: Marketplace LIVES as Creator Platform. Trust Engine = quality layer.
**Файлы:** Updated in DEC-009 sweep.

### 2026-04-11 — POSITIONING: "Missing Piece in the Trust Stack" (CONFIRMED)
**Решение:** ✅ CONFIRMED — Complementary to Big Tech + Creator Platform that Big Tech doesn't serve.
**Файлы:** Updated in DEC-009 sweep.

---

### 2026-04-01 — Trust API SaaS as PRIMARY revenue
**Сделал:** Repositioned Trust API SaaS ($29-199/mo) as primary revenue stream across all docs. Commission (10%) moved to "bonus, not core."
**Почему:** Anthropic Claude Marketplace launched with 0% commission. Google and OpenAI building same. Commission revenue is vulnerable to platform subsidies. Trust API SaaS = defensible — nobody else has behavioral trust data.
**Файлы:** PITCH_DECK_v6.md, GAMMA_PROMPT_V6_FINAL.md, 08_FINANCIAL_PROJECTIONS.md

### 2026-04-01 — F-1 pre-revenue phase explicit
**Сделал:** Added "Pre-Revenue Phase: Developer Flywheel" section to financials. All revenue projections now explicitly start "post-LLC (Aug 2026)."
**Почему:** F-1 visa PROHIBITS revenue generation before LLC + OPT. Previous projections showed revenue from Month 2 — legally impossible. Suffolk judges count dates.
**Файлы:** 08_FINANCIAL_PROJECTIONS.md, PITCH_DECK_v6.md

### 2026-04-01 — Developer Flywheel GTM (replaces Zero CAC)  
**Сделал:** Replaced "Every AI Assistant = Our Free Frontend" slide with "Developer Flywheel → Platform → AI Economy" 3-phase approach.
**Почему:** "Zero CAC via MCP" assumed Big Tech would route traffic through our server. Anthropic, Google, OpenAI all building closed marketplaces. Developer flywheel (free CLI → badge → analytics → paid API) is proven model (npm, Shields.io).
**Файлы:** GAMMA_PROMPT_V6_FINAL.md, PITCH_DECK_v6.md

### 2026-04-01 — Honest competitive positioning
**Сделал:** Acknowledged 10+ discovery competitors (Glama, Smithery, BlueRock) in risk table and competition slide. Repositioned from "nobody does trust" to "nobody does BEHAVIORAL trust."
**Почему:** Claiming "no competitor" when 10+ exist = instant credibility loss with any VC or judge who googles "MCP marketplace."
**Файлы:** GAMMA_PROMPT_V6_FINAL.md, PITCH_DECK_v6.md

### 2026-04-01 — Removed inflated x402 $600M figure
**Сделал:** Replaced x402 "$600M annualized" with Circle Nanopayments "$43M real volume, 140M transactions."
**Почему:** Our own research showed 40-50% of x402 volume is wash trading. Real daily volume ~$28K. Circle data is verified and from a trusted source.
**Файлы:** 08_FINANCIAL_PROJECTIONS.md

### 2026-04-01 — Skills as 3rd product category
**Сделал:** Added Skills (reusable instruction sets) alongside Agents and MCP Servers in solution slide.
**Почему:** Database already has 10 production-ready Skills. Not mentioning them = leaving differentiator on the table. No competitor has a Skills marketplace.
**Файлы:** PITCH_DECK_v6.md, GAMMA_PROMPT_V6_FINAL.md
