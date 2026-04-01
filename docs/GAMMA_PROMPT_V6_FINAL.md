# 🎯 GAMMA PROMPT v6 — Agora Pitch Deck (FINAL)

> ## ИНСТРУКЦИЯ ДЛЯ ТЕБЯ (НЕ КОПИРОВАТЬ В GAMMA):
> 
> 1. Зайди на https://gamma.app → нажми "Create new" → выбери **"Presentation"**
> 2. Нажми **"Paste in text"** (НЕ "Generate" — нам нужен наш контент, не AI-генерация)
> 3. Скопируй ВСЁ между маркерами `===COPY START===` и `===COPY END===`
> 4. Поставь **11 cards** (слайдов)
> 5. Выбери **тёмную тему** → нажми **Generate**
> 6. После генерации нажми иконку **AI Agent** (правый верхний угол) и напиши:
>    - `"Make all backgrounds pure black #0A0A0A. All headings electric blue #4169E1. All body text white. Font: Inter or Montserrat bold. Remove any decorative backgrounds."`
> 7. Пройди по каждому слайду — замени placeholder-картинки на наши скриншоты
> 8. Экспорт → PDF или PPTX

---

===COPY START===

Create an 11-slide pitch deck presentation. This is for the Suffolk University $40K Pitch Competition on April 16, 2026. The company is called Agora — the trust layer for the AI agent economy.

DESIGN REQUIREMENTS:
- Pure black background (#0A0A0A) on every single slide
- All headings in electric blue (#4169E1), very large, bold sans-serif font
- Body text in pure white (#FFFFFF)
- Accent color: red (#DC1A00) for warnings only
- Maximum 15 words per slide. Presenter speaks — slide shows ONE visual concept
- Use emoji as visual icons, not clip art
- Reference style: Revolut 2015 Seed Deck — dark, minimal, high-contrast

---

SLIDE 1 — TITLE

Large glowing text centered on black:

AGORA
The Trust Layer for the AI Economy

Small text bottom-right:
Vladimir Putkov | Amirsaid Velikhanov | Egor Nikotin
Suffolk University | April 16, 2026

---

SLIDE 2 — THE PROBLEM

Heading: "The AI Economy Has Zero Quality Control"

Show three columns:

Column 1 — 😡 Expensive Failures
"233 AI incidents in 2024. Up 56% from 2023."
Source: Stanford AI Index 2025

Column 2 — 😤 No Trust Standard  
"10,000+ AI tools online. Zero behavioral trust scores."

Column 3 — 💸 $600M Unverified
"$600M in annual AI agent transactions. No one verifies which agents are reliable."

Bottom text with blue arrow:
→ "Five trillion-dollar companies built payment rails. Nobody built the verification layer."

---

SLIDE 3 — MARKET SIZE

Heading: "Market Size"

Show three large gold circles with massive numbers:

Circle 1: $7.8B — AI Agent Market Today (2025)
Circle 2: $52B — Projected 2030 (46% CAGR, MarketsandMarkets)
Circle 3: 97M — MCP Protocol SDK Downloads

Bottom text:
→ "62% of enterprises are already experimenting with AI agents. The market is here."

---

SLIDE 4 — THE SOLUTION

Heading: "Carfax for AI — Discover, Verify, Transact"

Three columns showing product flow:

Column 1 — 🔍 DISCOVER
"Search 10,000+ AI agents, MCP servers, and Skills by capability or trust score"

Column 2 — 🛡️ VERIFY  
"6-signal adaptive trust score (0.0–1.0). Computed from behavioral data. Not reviews."

Column 3 — 💰 TRANSACT
"Pay only verified agents. Trust API subscriptions. Escrow protection."

Bottom text:
"Open algorithm. Proprietary behavioral data. The formula is public — the dataset is the moat."

This slide should include a product screenshot showing the marketplace search interface.

---

SLIDE 5 — HOW THE TRUST SCORE WORKS

Heading: "6-Signal Trust Engine — Computed, Not Rated"

Show a visual diagram or table of 6 signals:

Signal 1: Identity (10-35%) — Verified agent identity (DID, OAuth)
Signal 2: Capability Match (10-30%) — Keyword overlap with task requirements  
Signal 3: Response Time (15-25%) — Actual latency during execution
Signal 4: Execution Quality (15-30%) — Task success rate, error handling
Signal 5: Peer Review (5-15%) — QA Inspector + independent auditor ratings
Signal 6: History (0-15%) — Transaction count, dispute rate, longevity

Bottom insight box:
"Weights are ADAPTIVE. New agents are judged on claims (65% identity+capability). Veterans are judged on results (55% execution+response). Trust is earned, not bought."

Anti-gaming: Wilson Score cold-start + EWMA persistence + 2× failure penalty + 30-day decay

---

SLIDE 6 — BUSINESS MODEL

Heading: "4 Revenue Streams — Trust API is Primary"

Four quadrants:

Quadrant 1 — 🔑 Trust API Subscriptions (PRIMARY — Day 1 post-LLC)
"Free: 100/mo. Developer: $29/mo. Business: $99/mo. Enterprise: $199/mo. Pay-per-query: $0.001."

Quadrant 2 — 💳 Marketplace Commission (Day 1 post-LLC)
"10% of every transaction. Bonus revenue — not core."

Quadrant 3 — 💰 Prepaid Balance Fees (Post-LLC)
"3% convenience fee on Stripe top-ups."

Quadrant 4 — ⚡ Premium API (Month 4-6 post-LLC)
"Priority matching: $29-99/mo. SLA guarantees: $49-199/mo."

Bottom stats bar:
Why SaaS not Commission: Claude Marketplace charges 0%. Google, OpenAI building same. Trust API SaaS is immune to commission wars.
AI-First: ~$850/mo burn (tools + infra + legal, no salaries). Pre-revenue until LLC + OPT (Aug 2026).

---

SLIDE 7 — DISTRIBUTION (GO-TO-MARKET)

Heading: "Developer Flywheel → Platform → AI Economy"

Show a 3-phase flow:

Phase 1 — Developer Flywheel (Months 0-6, pre-LLC)
🛠️ Free CLI tool: `npx agora-score` → instant trust report for any repo
🏅 Embeddable trust badge for GitHub README → viral distribution
📊 Free analytics dashboard → developer retention
🔄 Claimed profiles: Auto-Crawler discovers → developer claims → gets badge

Phase 2 — Platform Stickiness (Post-LLC)
🔑 Trust API SaaS ($29-199/mo)
⚡ CI/CD integration (GitHub Actions trust gate)
📰 "State of AI Trust" quarterly reports → thought leadership

Phase 3 — AI Economy Bridge (12-24 months)
🤖 Agent-to-agent autonomous discovery + payments
⚖️ Compliance Engine for EU AI Act enterprises
🏭 White-label Trust API for payment rails

Key insight: "Entry = free utility → Retention = analytics → Sharing = badge visibility → Revenue = Trust API SaaS"

---

SLIDE 8 — COMPETITION

Heading: "Everyone Scans Code. Nobody Tracks Behavior."

Show a table with clear structure:

LAYER | WHO BUILDS IT | AGORA'S ROLE
Intelligence (LLMs) | OpenAI, Google, Anthropic | Not our layer
Connectivity (protocols) | MCP, A2A, UCP | Not our layer  
Identity (who is this?) | Skyfire ($14.5M), Scalekit ($5.5M) | Not our layer
Payments (how to pay) | Stripe, Coinbase, Circle | Not our layer
Static Security (safe code?) | BlueRock, Glama, Smithery (10+ tools) | Not our layer
Behavioral Trust (reliable?) | NOBODY | THIS IS US ✅

Bottom insight:
"10+ tools scan MCP code for vulnerabilities before deployment. NONE track behavioral reliability AFTER deployment. Skyfire validates WHO. BlueRock validates WHAT. Agora validates HOW WELL — from real transactions, not static analysis."

---

SLIDE 9 — ROADMAP

Heading: "Roadmap"

Horizontal timeline with three phases:

PHASE 1 — NOW (Months 0-6)
• 3 co-founders + 7 AI agents
• ~$850/mo burn (tools + infra + legal only)
• Working marketplace + MCP server + Trust Engine
• Seed 50 verified agents
• Suffolk 40K Competition

PHASE 2 — GROW (Months 6-18)
• 3-5 humans, 7+ AI agents, $25,500/mo
• Trust API beta launch
• 1,000 listings, $45K MRR target
• EU AI Act enforcement (Aug 2, 2026)
• $250K Seed Round

PHASE 3 — SCALE (Months 18-36)
• 8-15 humans, 50+ AI agents, $80,500/mo
• 5,000+ listings, $400K+ MRR
• Enterprise customers
• Series A

---

SLIDE 10 — TEAM

Heading: "The Team"

Show three team member cards side by side:

Card 1 (red accent):
Vladimir Putkov — CEO / Chief Strategy Officer
Suffolk University, B.S. Business Analytics + Marketing
Built the Agora stack. Strategy, vision, pitch, investor relations.
Previous: Proxima (competition finalist)

Card 2 (blue accent):
Amirsaid Velikhanov — CFO / Head of Finance & Analytics
3-year financial model, unit economics, market sizing.
Defends every number in front of judges.

Card 3 (green accent):
Egor Nikotin — Head of DevOps / Product Lead
Production deployment, MCP server catalog, live demo.
If it works on stage — it's because of Egor.

Right side — AI Operations:
"3 founders + AI agents = output of a 12-person team"

Show cost comparison:
Traditional startup: $8,000-15,000/mo burn (support, content, bookkeeping, disputes)
Agora AI-First: ~$850/mo burn (same output, 95%+ savings)

~$100/mo in AI API calls replaces $12,000/mo in human salaries

"We don't just talk about AI infrastructure — we prove it works by running on it."

---

SLIDE 11 — THE ASK

Heading (very large): "$10,000"

Three deliverables:
→ Free CLI tool + embeddable trust badge → developer flywheel launched
→ Trust API beta ready for post-LLC monetization
→ 50+ claimed profiles (not ghost listings)

Bottom — summary row:
THE PROBLEM | THE SOLUTION | THE ASK
$600M in agent transactions, nobody tracks reliability | 6-signal behavioral trust engine | $10,000

Large closing text:
AGORA — Verify AI. Trust the Future.

Contact: Vladimir.Putkov@su.suffolk.edu

===COPY END===

---

## Чеклист после генерации в Gamma

- [ ] Все фоны чёрные (#0A0A0A) без узоров/градиентов
- [ ] Заголовки электрик-синие (#4169E1), размер 48pt+
- [ ] Шрифт Inter/Montserrat, НЕ дефолтный Gamma
- [ ] Заменить placeholder-скриншоты на реальные UI Agora
- [ ] Добавить реальные фото Vladimir, Amir, Egor на слайд Team  
- [ ] Проверить: каждый слайд читается за 3 секунды
- [ ] Убрать лого/водяные знаки Gamma
- [ ] Тайминг: 25-30 секунд на слайд = ~5 минут всего
- [ ] Прогнать вслух 3 раза

## Источники данных (для жюри если спросят)

| Факт | Источник |
|------|---------|
| 233 AI incidents, +56% YoY | Stanford HAI AI Index 2025 |
| $7.8B→$52.6B market, 46% CAGR | MarketsandMarkets 2025 |
| 97M MCP SDK downloads | npm/PyPI cumulative, workos.com |
| 10,000+ MCP servers registered | PulseMCP registry |
| 16,000+ published servers | dev.to, MCP registries |
| 62% orgs experimenting with agents | cmarix.com/MarketsandMarkets |
| $600M annualized agent transactions | The Block, MEXC |
| EU AI Act enforcement Aug 2, 2026 | europa.eu |
| €35M / 7% revenue fines | AI Act Article 99 |
| Recall Network $42M funding | Bessemer Venture Partners |
| Skyfire $14.5M funding | Coinbase Ventures, a16z |
| Composio $29M funding | Lightspeed |
| Scalekit $5.5M funding | Together Fund, Z47 |
| $300-500B agentic commerce by 2030 (US) | Bain & Company |
| ~$850/mo burn rate | Agora internal (line-item breakdown in 04_BUSINESS_MODEL.md) |
| Break-even ~$850-1,100/mo (Phase 1) | Agora financial model |

## Q&A Подготовка (Top-5 жёстких вопросов)

**"You're just a small team."**
→ "Three co-founders plus AI agents. Vladimir leads strategy, Amir owns financials, Egor runs product and DevOps. ~$850/month burn — that's a survival advantage, not a weakness."

**"You have zero users."**
→ "We have a developer flywheel: free CLI tool, embeddable trust badges, analytics dashboard. Developers come for the utility, stay for the data, share through GitHub badges."

**"What about F-1 visa?"**
→ "LLC and revenue are delayed until August 2026 OPT. But the trust engine and developer community are being built now. We're accumulating behavioral data — the asset that makes trust scores valuable."

**"10+ MCP tools exist. What's different?"**
→ "They scan code BEFORE deployment — static analysis. We track behavior AFTER deployment — runtime reliability. Different layer entirely. They're code linters. We're credit bureaus."

**"Anthropic/Google charge 0% commission."**
→ "Exactly why our primary revenue is Trust API SaaS, not commission. Platform players will subsidize transactions forever. Nobody subsidizes independent trust verification."
