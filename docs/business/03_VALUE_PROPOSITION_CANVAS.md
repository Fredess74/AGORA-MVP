# 🎯 AGORA — Value Proposition Canvas

> **Версия**: 1.0 | **Дата**: 28 февраля 2026  
> **Метод**: Osterwalder Value Proposition Canvas (двусторонний — Creators + Consumers)

---

## VP CANVAS #1: СОЗДАТЕЛЬ (Supply Side) — "Алекс"

### 👤 Customer Profile

#### Customer Jobs (Задачи создателя)

| # | Задача | Тип | Приоритет |
|---|--------|-----|-----------|
| J1 | Монетизировать свой MCP-сервер / AI-агент | **Functional** | 🔴 Критический |
| J2 | Найти покупателей / пользователей | Functional | 🔴 Критический |
| J3 | Получать деньги за свою работу регулярно и надёжно | Functional | 🔴 Критический |
| J4 | Не тратить время на биллинг, поддержку, инфраструктуру | Functional | 🟠 Важный |
| J5 | Понимать, как используют мой продукт (аналитика) | Functional | 🟠 Важный |
| J6 | Получить признание в developer community | Social | 🟡 Желательный |
| J7 | Чувствовать, что моя работа имеет ценность | Emotional | 🟡 Желательный |

#### Pains (Боли)

| # | Боль | Интенсивность | Реальные данные |
|---|------|---------------|-----------------|
| P1 | **Нет канала монетизации** — MCP/AI products не имеют встроенного billing | 🔴 Extreme | MCP spec не предусматривает payments |
| P2 | **Дистрибуция** — продукт утонул в 10,000+ других MCP-серверов | 🔴 High | GitHub stars ≠ revenue |
| P3 | **Billing сложный** — построить свой Stripe flow = 2-4 недели работы | 🟠 Medium | Stripe Connect onboarding ~ 30 мин vs self-build ~ 80 часов |
| P4 | **Нет доверия покупателей** — как доказать, что мой сервис надёжен? | 🟠 Medium | 73% devs проверяют trust перед integration (SO Survey 2025) |
| P5 | **Нет аналитики** — не знаю кто использует, сколько раз, с какими ошибками | 🟡 Low | Большинство MCP-серверов не логируют usage |

#### Gains (Выгоды, которые хочет)

| # | Выгода | Тип |
|---|--------|-----|
| G1 | Пассивный доход от своего кода | **Must-have** |
| G2 | Минимум усилий: залистил → зарабатываю | Expected |
| G3 | Dashboard с метриками и доходом в реальном времени | Expected |
| G4 | Trust badge → социальное доказательство качества | Desired |
| G5 | Community вокруг моего продукта | Unexpected |

---

### 📦 Value Map (Что мы предлагаем создателю)

#### Products & Services

| Что предлагаем | → Решает задачу |
|---------------|----------------|
| Marketplace listing (free) | → J1, J2: Монетизация + Discovery |
| Stripe Connect integration | → J3: Надёжные выплаты |
| Usage analytics dashboard | → J5: Понимание использования |
| Trust Score badge | → J6: Признание качества |
| GitHub repo auto-import | → J4: Минимум усилий при создании листинга |

#### Pain Relievers (Снимаем боли)

| Боль | → Как снимаем |
|------|--------------|
| P1: Нет монетизации | → **Готовый billing**: free / per-call / subscription — одна форма |
| P2: Нет дистрибуции | → **Marketplace + SEO + search**: покупатели находят через поиск + категории |
| P3: Billing сложный | → **Stripe Connect Express**: подключение за 3 минуты, мы берём всё на себя |
| P4: Нет доверия | → **ZK-verified Trust Score**: математически доказуемое качество |
| P5: Нет аналитики | → **Usage dashboard**: calls, users, revenue, latency — всё в реальном времени |

#### Gain Creators (Создаём выгоды)

| Выгода | → Как создаём |
|--------|--------------|
| G1: Пассивный доход | → Commission-based: мы берём 10%, вы получаете 90% |
| G2: Минимум усилий | → GitHub repo → auto-import README → Trust Score → Published за <10 минут |
| G3: Dashboard | → DashboardPage: доход, использование, отзывы в одном месте |
| G4: Trust badge | → TrustBadge компонент с score 0-1, три уровня (high/medium/low) |
| G5: Community | → Reviews, ratings, Q&A на Product Page |

---

### 🔑 FIT Score (Creator)

| Критерий | Score | Обоснование |
|----------|-------|-------------|
| Problem-Solution Fit | 9/10 | MCP literally нет монетизации — мы единственное решение |
| Pain severity | 8/10 | Создатели тратят 100+ часов на код, получают $0 |
| Competitive alternatives | 9/10 | Нет прямого marketplace для MCP с trust+payments |
| Willingness to pay | 7/10 | 10% commission — справедливо, но нужна валидация |
| **Overall Fit** | **8.25/10** | **Сильный Product-Solution Fit** |

---

## VP CANVAS #2: ПОКУПАТЕЛЬ (Demand Side) — "Мария"

### 👤 Customer Profile

#### Customer Jobs (Задачи покупателя)

| # | Задача | Тип | Приоритет |
|---|--------|-----|-----------|
| J1 | Быстро найти надёжный MCP-сервер / AI-агент для своего проекта | **Functional** | 🔴 Критический |
| J2 | Убедиться, что сервис работает и не упадёт в продакшене | Functional | 🔴 Критический |
| J3 | Интегрировать за минуты, а не часы | Functional | 🟠 Важный |
| J4 | Не переплачивать — pay for what I use | Functional | 🟠 Важный |
| J5 | Сравнить альтернативы по качеству и цене | Functional | 🟡 Желательный |
| J6 | Уверенность, что мой AI-stack enterprise-ready | Social | 🟡 Желательный |

#### Pains (Боли)

| # | Боль | Интенсивность | Реальные данные |
|---|------|---------------|-----------------|
| P1 | **Тысячи MCP-серверов, непонятно какой надёжный** | 🔴 High | 10,000+ серверов, нет рейтингов |
| P2 | **Downtime и ненадёжность** — вчера работало, сегодня 500 error | 🔴 High | 35% open-source APIs без maintenance |
| P3 | **Fragmented discovery** — искать по GitHub, npm, HuggingFace, Reddit | 🟠 Medium | 5+ источников для поиска |
| P4 | **Нет стандартизированных отзывов** | 🟡 Low | GitHub stars ≠ quality |
| P5 | **Безопасность** — можно ли доверять чужому коду? | 🟠 Medium | Supply chain attacks выросли на 430% (Sonatype 2025) |

#### Gains (Выгоды)

| # | Выгода | Тип |
|---|--------|-----|
| G1 | Один каталог для ВСЕХ AI tools с рейтингами | **Must-have** |
| G2 | Copy-paste интеграция (1 command) | Expected |
| G3 | Cryptographic proof что сервис safe | Desired |
| G4 | Pay only for what I use (metered billing) | Expected |
| G5 | Enterprise compliance (SOC2-ready stack) | Unexpected |

---

### 📦 Value Map (Что мы предлагаем покупателю)

#### Products & Services

| Что предлагаем | → Решает задачу |
|---------------|----------------|
| Marketplace с поиском и фильтрами | → J1, J5: Discovery + Comparison |
| Trust Scores (ZK-verified) | → J2: Верификация надёжности |
| One-click MCP config (`npx mcp-add agora://name`) | → J3: Быстрая интеграция |
| Flexible pricing (free/per-call/subscription) | → J4: Pay for what you use |
| Enterprise tier with SLA | → J6: Enterprise readiness |

#### Pain Relievers

| Боль | → Как снимаем |
|------|--------------|
| P1: Непонятно какой надёжный | → **Trust Score 0-1**: high/medium/low с component breakdown |
| P2: Downtime | → **Uptime monitoring**: trust score учитывает reliability |
| P3: Fragmented discovery | → **Единый маркетплейс**: MCP + AI agents + automations в одном месте |
| P4: Нет отзывов | → **Reviews + ratings**: 5-star system с модерацией |
| P5: Безопасность | → **ZK-proofs**: криптографическое доказательство без раскрытия данных |

#### Gain Creators

| Выгода | → Как создаём |
|--------|--------------|
| G1: Единый каталог | → MarketplacePage: search, categories, filters, sorting |
| G2: Quick integration | → MCP config snippet на ProductDetailPage — copy & paste |
| G3: Cryptographic safety | → ZK proof generation + verification |
| G4: Metered billing | → Usage tracking + pay-per-call модель |
| G5: Enterprise compliance | → Audit logs, SLA, dedicated deployment |

---

### 🔑 FIT Score (Consumer)

| Критерий | Score | Обоснование |
|----------|-------|-------------|
| Problem-Solution Fit | 7/10 | Discovery pain реальна, но рынок только формируется |
| Pain severity | 7/10 | Не life-or-death, но productivity и cost impact |
| Competitive alternatives | 8/10 | Нет аналога с trust + payments в одном |
| Willingness to pay | 6/10 | Devs предпочитают free — нужен compelling free tier |
| **Overall Fit** | **7.0/10** | **Хороший fit, но нужна валидация** |

---

## 3. ДВУСТОРОННИЙ VALUE PROPOSITION STATEMENT

### Для создателей

> **Agora позволяет создателям MCP-серверов, AI-агентов и автоматизаций монетизировать свою работу за 10 минут**, получая пассивный доход с cryptographically verified trust score — без необходимости строить биллинг, дистрибуцию или инфраструктуру.

### Для покупателей

> **Agora — единственный маркетплейс, где AI-разработчики находят и подключают проверенные MCP-серверы и AI-агенты** с математически доказуемым доверием (ZK-proofs), гибким ценообразованием и интеграцией в один клик.

### Для инвесторов

> **Agora — App Store для экономики AI-агентов**: маркетплейс с ZK-verified trust layer, который решает проблему монетизации для 10,000+ MCP-серверов и создаёт data moat через network effects. SaaS модель с multi-stream revenue, gross margin 85%+, и path к $36M+ ARR через двусторонний marketplace lock-in.

---

## 4. UNIQUE VALUE PROPOSITION vs КОНКУРЕНТЫ

```
┌─────────────────────────────────────────────────────────────┐
│               AGORA's Unique Value Stack                     │
│                                                              │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │ Layer 5: MARKETPLACE NETWORK EFFECTS                    │ │
│  │ "More creators → more consumers → more data → better   │ │
│  │  trust → more creators" (unstoppable flywheel)          │ │
│  ├─────────────────────────────────────────────────────────┤ │
│  │ Layer 4: ZK-PROOFS (Unique to Agora)                    │ │
│  │ "Mathematically provable trust without exposing data"   │ │
│  ├─────────────────────────────────────────────────────────┤ │
│  │ Layer 3: MULTI-PROTOCOL (MCP + A2A + AP2 + x402)       │ │
│  │ "4x wider than any competitor"                          │ │
│  ├─────────────────────────────────────────────────────────┤ │
│  │ Layer 2: PERFORMANCE (<10ms vs 500ms+)                  │ │
│  │ "100x faster trust verification"                        │ │
│  ├─────────────────────────────────────────────────────────┤ │
│  │ Layer 1: SaaS MODEL (predictable ARR)                   │ │
│  │ "Real revenue, not speculative token"                   │ │
│  └─────────────────────────────────────────────────────────┘ │
│                                                              │
│  Zauth has NONE of these layers combined.                    │
│  Google/AWS don't have trust + marketplace.                  │
│  Nobody else has ZK-proofs for AI agent trust.               │
└─────────────────────────────────────────────────────────────┘
```

---

## 5. VALIDATION PLAN

| Гипотеза | Метод валидации | Target | Deadline |
|----------|----------------|--------|----------|
| Creators хотят монетизировать MCP | 30 интервью с MCP creators | 70%+ confirmed | Март 2026 |
| Consumers будут платить за verified agents | Landing page conversion test | >3% signup rate | Март 2026 |
| 10% commission приемлема | A/B test на landing page | 80%+ acceptance | Апрель 2026 |
| Trust Score влияет на выбор | Clickthrough test: with vs without score | 2x CTR с score | Май 2026 |
| $49/mo premium listing worth it | First 10 premium creators survey | NPS > 40 | Июнь 2026 |
