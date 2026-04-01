# Agora Issues Tracker v2

> Audit: 2026-04-01 | Sources: NotebookLM (42 docs), web research (6 queries), code review
> Previous issues preserved + 20 new findings

---

## 🔴 TOP 10 CRITICAL — Что мы делаем неправильно или игнорируем

### CRIT-01: НЕТ developer flywheel — почему разработчики ПРИХОДЯТ?

- **Severity:** 🔴 CRITICAL
- **Progress:** 0%
- **Problem:** Вся GTM стратегия говорит "Auto-Crawler seeds 100+ agents Day 1" и "Direct outreach to 50 developers." Это фейковый supply. Листинг без владельца = мёртвый листинг. У нас нет ответа на 4 ключевых вопроса:
  1. **Чем привлекаем?** — Просто каталог MCP серверов? Glama.ai, Smithery, mcpmarket.com, Apigene уже делают то же самое БЕСПЛАТНО
  2. **Почему возвращаются?** — Нет analytics dashboard, нет usage stats, нет revenue от листинга
  3. **Почему делятся?** — Нет вирального цикла. npm вырос потому что `npm install` был утилитой. У нас нет утилиты
  4. **Как переходим в AI economy?** — Нет моста от "каталог для людей" к "инфраструктура для агентов"
- **Root cause:** Мы строим marketplace сверху вниз (pitch → docs → код), а не снизу вверх (utility → retention → growth)
- **Benchmark:** npm вырос через утилиту (`npm install`). PyPI — через стандартную экосистему. Мы не предлагаем ничего, что разработчик использует ЕЖЕДНЕВНО.
- **Fix:** Создать developer value prop: free trust badge (embeddable SVG), free analytics, `npx agora-check <github-repo>` CLI tool
- **Effort:** L (2-3 недели)
- **Impact:** БЕЗ ЭТОГО весь бизнес = wishful thinking

### CRIT-02: Платёжная инфраструктура = 0 строк кода

- **Severity:** 🔴 CRITICAL
- **Progress:** 0%
- **Problem:** Бизнес модель проецирует $2,075 revenue к Month 6. В кодовой базе НОЛЬ платежного кода. Нет Stripe Connect, нет x402 handlers, нет escrow. Каждая финансовая проекция основана на инфраструктуре, которая не существует.
- **Risk:** Инвестор спросит "покажите транзакцию" → нечего показать
- **Fix:** Stripe Connect MVP (test mode) — даже демо-flow покажет серьёзность
- **Effort:** M (1 неделя)
- **Blocked by:** LLC formation (August 2026 OPT)

### CRIT-03: F-1 виза vs финансовые проекции — легальное противоречие

- **Severity:** 🔴 CRITICAL
- **Progress:** 0% (задокументировано, но НЕ исправлено в projections)
- **Problem:** Финансовая модель показывает revenue с Month 2. F-1 виза ЗАПРЕЩАЕТ генерацию прибыли до LLC + OPT (August 2026). Все проекции на первые 6 месяцев — легально невозможны.
- **Risk:** Судья Suffolk считает даты и видит противоречие
- **Fix:** Переформулировать Month 1-6 как "pre-revenue validation phase." Revenue starts post-LLC (Month 7+)
- **Effort:** S (обновить 08_FINANCIAL_PROJECTIONS.md + pitch)

### CRIT-04: Anthropic 0% commission — уничтожает наш revenue stream #1

- **Severity:** 🔴 CRITICAL
- **Progress:** 20% (defense documented, но стратегия не адаптирована)
- **Problem:** Claude Marketplace запущен с 0% комиссией. Если enterprises покупают инструменты ПРЯМО через Claude, они обходят Agora полностью. Наша 10% комиссия = мёртвый revenue stream если Anthropic/OpenAI/Google все запустят свои zero-fee маркетплейсы.
- **Fix:** Перестать позиционировать commission как primary revenue. Trust API SaaS ($29-199/mo) должен быть ОСНОВНЫМ stream с Day 1. Commission — бонус.
- **Effort:** M (перестроить pitch narrative + financial model)

### CRIT-05: Питч-дек не совпадает с кодом (trust signals)

- **Severity:** 🔴 CRITICAL
- **Progress:** 0%
- **Problem:** Pitch deck claims 6 signals: Uptime, Transaction Success, Code Quality, Repo Health, User Reviews, Account Age. РЕАЛЬНЫЙ код: Identity, Capability Match, Response Time, Execution Quality, Peer Review, History. Это РАЗНЫЕ сигналы.
- **Risk:** Судья спрашивает "покажите Code Quality signal" → его нет в коде
- **Fix:** Sync pitch с реальностью (`calculator.ts`)
- **Effort:** S (2 часа)

### CRIT-06: "Zero CAC через MCP" — непроверенное допущение

- **Severity:** 🔴 CRITICAL
- **Progress:** 0%
- **Problem:** Вся GTM строится на предположении что Claude/Gemini/ChatGPT будут запрашивать наш MCP сервер для поиска агентов. Это НИКОГДА не тестировалось. Anthropic, Google и OpenAI строят СОБСТВЕННЫЕ маркетплейсы. Зачем им маршрутизировать трафик через нас?
- **Evidence:** Claude Marketplace, Google Vertex Agent Builder, OpenAI GPT Store — все три Big Tech компании строят closed ecosystems
- **Fix:** Разработать план B: Direct-to-developer acquisition через контент, CLI tools, GitHub integrations. MCP — бонус, не основа.
- **Effort:** M (переписать GTM strategy)

### CRIT-07: 10+ MCP registries уже существуют — мы не unique

- **Severity:** 🟠 HIGH
- **Progress:** 0%
- **Problem:** Glama.ai, Smithery, Apigene, mcpservers.org, MCP Market, NeuralTrust, Akto — все предлагают discovery. Многие с security scoring. Некоторые бесплатно. Наша pitch claim "нет стандартизированного trust" уже не полностью верна.
- **Evidence:** BlueRock.io сканирует 9,000+ MCP серверов бесплатно. Akto предлагает automated discovery + security scanning
- **Fix:** Перепозиционировать: мы не "единственные" — мы BEHAVIORAL trust (runtime), другие только STATIC (pre-deploy). Разные слои.
- **Effort:** S (обновить competitive analysis + pitch)

### CRIT-08: x402 объёмы раздуты — 40-50% wash trading

- **Severity:** 🟠 HIGH
- **Progress:** 0%
- **Problem:** Мы цитируем "$600M annualized x402 volume" в market sizing. Наш собственный deep research показывает 40-50% wash trading. Реальный daily volume ~$28K. Строить market sizing на inflated crypto metrics = потеря доверия.
- **Fix:** Переключиться на Circle Nanopayments ($43M real, 140M transactions) как primary proof point
- **Effort:** S (обновить docs)

### CRIT-09: Enterprise liability contradiction

- **Severity:** 🟠 HIGH
- **Progress:** 0%
- **Problem:** Мы продаём $199/mo SLA guarantees и маркетируем решение для enterprise disasters ($7.5B VW loss). При этом ToS говорит: "trust scores are informational, not guarantees" и "Agora provides data, not advice." Enterprise с €35M EU AI Act штрафами не заплатит за сервис который отказывается нести ответственность.
- **Fix:** Определить чёткий liability framework. Тiers: Free = no liability, Enterprise = limited liability с cap. Legal review required.
- **Effort:** L (legal review)

### CRIT-10: Auto-Crawler ≠ marketplace — ghost town risk

- **Severity:** 🟠 HIGH
- **Progress:** 0%
- **Problem:** Scraping public registries on Day 1 создаёт каталог без владельцев. 100+ листингов = 100 ghost profiles. Ни один разработчик не "claimed" свой профиль. Нет транзакций, нет reviews, нет engagement. Инвестор скажет: "это справочник, а не marketplace."
- **Fix:** Claimed profiles flow: Auto-Crawler создаёт → отправляет GitHub notification/PR создателю → разработчик claims → получает badge + analytics. **Incentive**: free trust badge для README
- **Effort:** M (1 неделя)

---

## 🟢 TOP 10 OPPORTUNITIES — Фишки для роста

### OPP-01: CLI Tool `npx agora-score` — Developer Flywheel Entry Point

- **Potential:** 🔴 GAME CHANGER
- **Status:** Not started
- **Idea:** Бесплатный CLI tool: `npx agora-score <github-url>` → мгновенный trust report (code quality, deps, activity, license). Как `npx eslint` но для trust. Работает без аккаунта. Результат: Agora trust badge для README.
- **Why it works:** npm вырос через утилиту. Agora score tool = наша утилита. Каждый запуск = data point для нашего Trust Engine. Developer получает value → делится badge → другие разработчики хотят свой → flywheel.
- **Revenue bridge:** Free tool → trust dashboard ($0) → analytics pro ($19/mo) → priority listing ($29/mo) → enterprise API ($199/mo)
- **Market expansion:** 16,000+ MCP servers + миллионы npm/PyPI пакетов = massive TAM для standalone trust scoring
- **Effort:** M (1-2 недели)

### OPP-02: Embeddable Trust Badge — Viral Distribution

- **Potential:** 🔴 GAME CHANGER
- **Status:** Component exists (`TrustBadge.tsx`), not embeddable
- **Idea:** SVG/HTML badge для GitHub README: `[![Agora Trust Score](https://agora.market/badge/agent-id.svg)](https://agora.market/agent/...)`. Как Shields.io но для trust. Every README with our badge = free marketing impression.
- **Why it works:** Shields.io badges get BILLIONS of impressions/month. One trust badge = one developer who chose Agora as their credibility layer. Viral: developer sees badge on competitor's README → wants their own.
- **Data flywheel:** Badge serves trigger trust score recalculation → more data → better scores → more trust in the system
- **Effort:** S (3-5 дней)

### OPP-03: Compliance-as-a-Service (EU AI Act = $70B RegTech market)

- **Potential:** 🔴 BILLION-DOLLAR EXPANSION
- **Status:** Conceptual (docs reference EU AI Act alignment)
- **Idea:** Pivot Trust Engine → Compliance Engine. EU AI Act enforcement August 2, 2026. Enterprises face €319K-€600K compliance cost PER high-risk AI system. Agora already satisfies 6/7 requirements architecturally. Package trust data as "cryptographic proof of compliance."
- **Revenue:** Enterprise compliance SaaS: $5,000-50,000/year per organization (vs $29-199/mo for trust API)
- **Market:** RegTech = $70B by 2030. AI Governance = $15.8B by 2030.
- **Effort:** L (3-6 months, needs legal partner)

### OPP-04: White-Label Trust API for Payment Rails

- **Potential:** 🔴 INFRASTRUCTURE PLAY
- **Status:** Documented but not prioritized
- **Idea:** Google UCP, Mastercard Agent Pay, Coinbase, Circle — ALL building payment rails. NONE doing behavioral trust scoring. License our Trust API to payment rails. Agora becomes invisible risk layer (like Visa fraud-check).
- **Revenue:** Per-query pricing at scale: $0.001-0.01 per trust check × millions of transactions/day = massive revenue without marketplace
- **Market:** $3-5T agent-mediated commerce by 2030 (McKinsey). Trust check on 1% = $30-50B addressable
- **Why now:** Payment rails launching NOW (2026). They need trust. First mover advantage.
- **Effort:** L (6+ months, needs partnerships)

### OPP-05: "Skills" Marketplace — Third Product Category

- **Potential:** 🟢 QUICK WIN + DIFFERENTIATOR
- **Status:** 50% (10 skills in database, not marketed)
- **Idea:** Database уже содержит 10 production-ready Skills (Code Review, Data Pipeline, Prompt Engineering, etc.). Pitch и marketing упоминают ТОЛЬКО "Agents" и "MCP Servers." Skills = reusable instruction sets = marketplace for prompt engineering = unique category nobody else has.
- **Revenue bridge:** Skills can be priced $5-50 each (one-time purchase) → low-friction revenue before SaaS subscriptions kick in
- **Effort:** S (1-2 дня — добавить в pitch + create Skills page)

### OPP-06: Trust Breakdown Visualization — Instant WOW Factor

- **Potential:** 🟢 QUICK WIN для PITCH
- **Status:** Backend built (`buildTrustBreakdown()`), UI missing
- **Idea:** MCP server generates detailed 6-component breakdown с EWMA formula, adaptive weights, и reasoning. Web UI только показывает простой modal. Визуализировать: radar chart + component bars + mathematical formula = instant proof of rigor. Judges see MATH, not just a number.
- **Effort:** S (4-6 часов)

### OPP-07: SSE Audit Trail → Enterprise-Grade Logging

- **Potential:** 🟡 ENTERPRISE REVENUE
- **Status:** SSE events exist (11 per pipeline run), not persisted
- **Idea:** Orchestrator broadcasts task_formulated → trust_update events. Currently only for UI progress bars. If persistently logged → "enterprise-grade audit trail" satisfying EU AI Act Article 12. Minimal code change, massive positioning value.
- **Revenue:** "Compliance logging" as enterprise feature: $99-199/mo tier
- **Effort:** M (1 day)

### OPP-08: Agent-to-Agent Autonomous Procurement (Phase 2 GTM Bridge)

- **Potential:** 🟡 TRANSITION TO AI ECONOMY
- **Status:** Conceptual
- **Idea:** Phase 1 = humans search marketplace. Phase 2 = AI agents autonomously discover, evaluate, and hire other agents through Agora API. The transition requires:
  1. Agent identity (DID-based agent accounts, not just developer accounts)
  2. Programmatic trust queries (already built: MCP server)
  3. Automated payment (needs Stripe Connect or x402)
  4. Machine-readable listings (structured JSON, not just UI cards)
- **Why critical:** Без этого перехода мы остаёмся каталогом для людей. С ним — мы инфраструктура для $3-5T agent commerce.
- **Effort:** L (Phase 2, Month 6-18)

### OPP-09: "State of AI Agent Trust" Report — Content Flywheel

- **Potential:** 🟡 FREE MARKETING
- **Status:** Not started
- **Idea:** Quarterly report on AI agent ecosystem trust metrics. Data from our Trust Engine + public registry scans. Like Cloudflare's Internet reports or npm's State of JavaScript. Free PR, positions Agora as thought leader, drives backlinks and press coverage.
- **Content:** "We scanned 16,000+ MCP servers. Here's what we found: X% have no tests, Y% have critical vulnerabilities, Z% are abandoned. Trust matters."
- **Effort:** M (1 week per report)

### OPP-10: GitHub Actions Integration — CI/CD Trust Gate

- **Potential:** 🟡 DEVELOPER ADOPTION
- **Status:** Not started
- **Idea:** GitHub Action: `agora/trust-check@v1` — runs trust score check on every PR. Fail CI if trust drops below threshold. Integrates Agora into developer DAILY workflow (not just "visit marketplace").
- **Why it works:** Addresses CRIT-01 (no flywheel). CI/CD = daily touchpoint. Every repo using the action = continuous Agora brand impression + data stream.
- **Effort:** M (1 week)

---

## 📊 GTM Flywheel: Developer → AI Economy Transition

```
PHASE 1: DEVELOPER ACQUISITION (Month 0-6)
    ┌─────────────────────────────────────────────┐
    │  Entry: Free CLI tool (npx agora-score)     │
    │  Hook: Trust badge for README               │
    │  Retention: Analytics dashboard + trends     │
    │  Viral: Badge visible on GitHub → others     │
    │         want theirs → flywheel               │
    │  Revenue: Free → $19/mo analytics → $29/mo   │
    │           priority listing                   │
    └──────────────────┬──────────────────────────┘
                       │
    PHASE 2: PLATFORM STICKINESS (Month 6-12)
    ┌──────────────────▼──────────────────────────┐
    │  CI/CD Integration (GitHub Actions)          │
    │  Trust API for programmatic queries          │
    │  Skills marketplace (prompt engineering)     │
    │  Claimed profiles + verified developer badge │
    │  Revenue: Trust API SaaS $29-199/mo          │
    └──────────────────┬──────────────────────────┘
                       │
    PHASE 3: AI ECONOMY TRANSITION (Month 12-24)
    ┌──────────────────▼──────────────────────────┐
    │  Agent identity (DID-based accounts)         │
    │  Agent-to-agent autonomous discovery + pay   │
    │  White-label Trust API for payment rails     │
    │  Compliance Engine for regulated industries  │
    │  Revenue: Enterprise SaaS $5K-50K/year       │
    │           + white-label licensing             │
    └─────────────────────────────────────────────┘
```

---

## 📊 Metrics Summary

| Category | Count | Closed |
|----------|-------|--------|
| 🔴 Critical (делаем неправильно) | 10 | 0 |
| 🟢 Opportunities (фишки для роста) | 10 | 0 |
| **Total** | **20** | **0** |

---

## Priority Matrix for dev-autopilot

| # | Issue | Effort | Impact | Action |
|---|-------|--------|--------|--------|
| CRIT-05 | Pitch ≠ code signals | S | 🔴 Demo-breaking | Fix NOW |
| CRIT-08 | x402 inflated metrics | S | 🟠 Credibility | Fix NOW |
| CRIT-03 | F-1 vs projections | S | 🔴 Legal risk | Fix NOW |
| OPP-05 | Skills category | S | 🟡 Differentiator | Add to pitch |
| OPP-06 | Trust breakdown UI | S | 🔴 WOW factor | Build it |
| OPP-02 | Embeddable badge | S | 🔴 Viral growth | Build it |
| CRIT-04 | Commission → SaaS pivot | M | 🔴 Revenue model | Reframe pitch |
| CRIT-06 | Zero CAC assumption | M | 🔴 GTM realism | Plan B |
| CRIT-07 | 10+ competitors exist | S | 🟠 Positioning | Update analysis |
| OPP-01 | CLI trust tool | M | 🔴 Developer flywheel | Build it |
| CRIT-01 | No developer flywheel | L | 🔴 Business viability | Strategy |
| OPP-07 | SSE audit trail | M | 🟡 Enterprise | Phase 2 |
| CRIT-10 | Ghost town risk | M | 🟠 Cold start | Claimed flow |
| OPP-03 | Compliance-as-a-Service | L | 🔴 $70B market | Strategy |
| OPP-04 | White-label Trust API | L | 🔴 Infrastructure | Phase 2-3 |
