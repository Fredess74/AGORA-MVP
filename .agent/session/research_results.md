# Research Results — April 11, 2026

> Chief Strategist session: Competitive landscape audit + protocol war analysis

---

## KEY FACTS WITH SOURCES

### Protocol War — New Entrants (April 2026)

1. **Visa Intelligent Commerce Connect** — launched April 8, 2026. Protocol-agnostic "on-ramp" supporting TAP, MPP, ACP, UCP. Pilot with AWS, Aldar, Highnote, Mesh, Payabli, Diddo, Sumvin. Full rollout H2 2026.
   - Source: visa.com, afp.com, techinformed.com

2. **Google UCP (Universal Commerce Protocol)** — open-source, launched Jan 2026. Partners: Shopify, Etsy, Wayfair, Target, Walmart. Supports MCP, A2A, AP2 bindings. Merchant remains MoR.
   - Source: blog.google, googleblog.com, klaviyo.com

3. **Google AP2 (Agent Payments Protocol)** — 60+ partners including Mastercard, PayPal, Coinbase, Salesforce, Adyen, AmEx, Etsy. Uses W3C Verifiable Credentials + Mandates.
   - Source: google.com, mastercard.com, pymnts.com

4. **Mastercard Verifiable Intent** — launched March 2026. Open-source. Cryptographic proof that user authorized specific agent action. Interoperable with AP2 and UCP.
   - Source: mastercard.com, pymnts.com, agenticplug.ai

5. **OpenAI ACP** — co-developed with Stripe. Pivot from Instant Checkout to ChatGPT Apps. Focus on discovery via product feeds (CSV/JSON). Shopify/Etsy platform-level integration.
   - Source: digitalcommerce360.com, ekamoira.com, geekseller.com

6. **Coinbase x402** — now under x402 Foundation (Linux Foundation). $24M volume in 30 days (April 2026). Supports EVM + Solana. Extensions: Bazaar (service discovery), Permit2 (gasless approvals).
   - Source: nevermined.ai, coinmarketcap.com, linuxfoundation.org

7. **Stripe MPP** — launched March 18, 2026. Session-based streaming micropayments. $0.01 USDC minimum. Batch settlement. Supports stablecoins + fiat.
   - Source: workos.com, formo.so, dwellir.com

8. **Nevermined + Visa IC + x402** — Visa card enrollment → spending mandates → x402 protocol for digital purchases → fiat settlement via Stripe. $24M/30 days.
   - Source: nevermined.ai, morningstar.com, cryptobriefing.com

### Standards Consolidation

9. **Agentic AI Foundation (AAIF)** — Linux Foundation. 170+ members (April 2026). Governs: MCP (Anthropic), goose (Block), AGENTS.md (OpenAI). x402 also being codified.
   - Source: linuxfoundation.org, anthropic.com

10. **WebMCP** — W3C Draft (Feb 10, 2026). `navigator.modelContext` browser API. Chrome 146 Canary preview.
    - Source: W3C Community Group Report

### Direct Competitors — Updated

11. **FabricLayer** — $2.5M seed (Feb 2026). "Trust Index" scoring AI tools on transparency, data handling, performance.
    - Source: yutori.com

12. **OpenBox AI** — $5M seed (Mar 2026). Enterprise AI trust platform: governance, verification, oversight.
    - Source: yutori.com

13. **Trent AI** — €11M seed (Apr 2026). Layered security for agentic era workflows.
    - Source: eu-startups.com

14. **Tumeryk** — AI Trust Score™ (trademarked). Adversarial testing for hallucination, prompt injection, exploitability.
    - Source: search results

15. **Akto** — First MCP security platform (Jun 2025). Discovery + red teaming + real-time monitoring.
    - Source: akto.io, tracxn.com

16. **$40M+ in seed rounds** deployed to pure-play MCP security startups by early 2026.
    - Source: softwarestrategiesblog.com

### Market Context

17. **Anthropic Claude Marketplace** — launched March 2026. B2B. 0% commission. Limited preview. Snowflake, Harvey, Replit, GitLab as partners.
    - Source: thenextweb.com, futurumgroup.com

18. **EU AI Act** — August 2, 2026 main enforcement. High-risk providers: €193K-600K initial compliance. €150K/year ongoing. €35M or 7% turnover fines.
    - Source: europa.eu, aoshearman.com, sqmagazine.co.uk

19. **Stablecoin volume** — $33 trillion in 2025. Visa processing $3.5B/year in stablecoin settlements.
    - Source: forbes.com, cryptorank.io

20. **AI agent trust/security sector** — $400M+ in seed-stage investment in last 6 months (as of Feb 2026).
    - Source: crunchbase.com

21. **MCP ecosystem** — 16,000+ public servers. Discovery via `.well-known/mcp.json`. Smithery, Glama, Composio leading marketplaces.
    - Source: composio.dev, contentgrip.com

22. **Cloud Security Alliance** — Agentic Trust Framework (ATF). Zero trust for agents. Continuous verification.
    - Source: cloudsecurityalliance.org

---

## ADDITIONAL FINDINGS — April 11, 2026 (Session 2: Document Audit)

23. **Recall Network** — $42M total funding (Multicoin Capital, Coinbase Ventures). Born from merger of Textile + 3Box Labs. AgentRank = on-chain reputation via competitive arenas + $RECALL staking. Built on Base L2. Token launched Oct 2025.
    - $RECALL token = $0.04 (April 2026), -95% from ATH ($0.84). Market cap ~$10-35M.
    - AgentRank uses: Performance (head-to-head competitions) + Certainty (staking). Skill-specific ratings.
    - **Key difference from Agora:** Web3 approach (staking, on-chain) vs our Web2 SaaS approach.
    - Source: coinmarketcap.com, recall.network, blocktelegraph.io, bitget.com

24. **FabricLayer Trust Index** — officially launched **March 2026**. 5,800+ AI services scanned (up from ~2,500 at seed announcement). 23 sub-signals across 6 dimensions. Scoring 0-5.0. **FREE API** for programmatic trust checks. Featured Publisher Reports available (e.g., LangChain ecosystem).
    - 6 dimensions: Vulnerability & Safety (25%), Operational Health (20%), Maintenance Activity (20%), Adoption (15%), Transparency (10%), Publisher Trust (10%).
    - **All static/pre-deploy signals.** No behavioral/runtime scoring.
    - Source: fabriclayer.ai, trust.fabriclayer.ai

25. **Creator Economy for AI Developers (2026 trends):**
    - Outcome-based pricing replacing flat subscriptions: charge for results, not tokens/compute.
    - "Tool fatigue" driving consolidation: creators want single dashboards.
    - Data sovereignty: creators increasingly want to own their audience data.
    - "Vibe coding" commoditized development speed → competitive advantage shifts to finding revenue signals.
    - Source: medium.com, stan.store, kdnuggets.com

26. **Marketplace Phase Strategy (Etsy/Shopify precedent):**
    - Phase 1: Supply & Velocity — focus on DX, community-led growth, simple monetization.
    - Phase 2: Utility & Trust — orchestration, governance, sandbox/testing.
    - Phase 3: Enterprise B2B — outcome-based pricing, strategic partnerships, human-in-the-loop.
    - Etsy model = marketplace owns discovery. Shopify model = merchant owns relationship. Agora = hybrid.
    - Source: multiple (mercury.com, chargebee.com, ibm.com, medium.com)
