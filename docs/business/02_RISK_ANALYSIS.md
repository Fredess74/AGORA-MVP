# ⚠️ AGORA — Матрица Рисков и Стратегии Минимизации

> **Версия**: 1.0 | **Дата**: 28 февраля 2026  
> **Метод**: PESTEL + SWOT + Risk Matrix (вероятность × воздействие)

---

## 1. СВОДНАЯ МАТРИЦА РИСКОВ

```
                    ВОЗДЕЙСТВИЕ
                  Низкое    Среднее    Высокое    Критическое
            ┌──────────┬──────────┬──────────┬──────────┐
Высокая     │          │  R7, R8  │  R1, R3  │    R2    │
            ├──────────┼──────────┼──────────┼──────────┤
ВЕРОЯТНОСТЬ │          │   R10    │  R4, R5  │    R6    │
Средняя     ├──────────┼──────────┼──────────┼──────────┤
            │   R12    │   R11    │   R9     │          │
Низкая      ├──────────┼──────────┼──────────┼──────────┤
            │          │          │   R13    │          │
            └──────────┴──────────┴──────────┴──────────┘
```

---

## 2. ДЕТАЛЬНЫЙ АНАЛИЗ КАЖДОГО РИСКА

### R1: 🔴 Cold Start Problem (Chicken-and-Egg)

**Категория**: Продуктовый  
**Вероятность**: Высокая | **Воздействие**: Высокое

**Описание**: Маркетплейс не работает без обеих сторон. Создатели не придут без покупателей. Покупатели не придут без продуктов.

**Реальные данные**: Из 100 marketplace-стартапов, ~80% погибают именно от cold start problem (Andreessen Horowitz, 2024).

**Минимизация**:

| Действие | Срок | Ответственный |
|----------|------|---------------|
| **Seed content**: Вручную залистить 20-30 лучших open-source MCP-серверов с trust scores | Март 2026 | Founder |
| **Supply-first GTM**: Привлечь 50 создателей через целевой outreach в GitHub, Discord, HackerNews | Апрель 2026 | BD |
| **Free tier**: Создатели листят бесплатно первые 3 месяца | Launch | Product |
| **Content marketing**: SEO-статьи "How to monetize your MCP server" | Ongoing | Marketing |
| **Community seeding**: Создать Discord/Slack → регулярные созвоны с early creators | Ongoing | Community |

**Метрика контроля**: 50 листингов к концу 2-го месяца.

---

### R2: 🔴 Конкуренция — Zauth и Новые Игроки

**Категория**: Конкурентный  
**Вероятность**: Высокая | **Воздействие**: Критическое

**Описание**: Zauth уже имеет работающий продукт, торгуемый токен ($ZAUTH), и базу x402-эндпоинтов. Крупные игроки (Google, AWS, Stripe) могут выйти на этот рынок.

**Реальные данные по Zauth**:

- Latency: 500-1100ms (наши <10ms — **100x преимущество**)
- Протоколы: только x402 (мы: MCP + A2A + AP2 + x402)
- Безопасность: зафиксированы эксплойты (drain USDC из кошельков)
- Модель: спекулятивный токен (мы: SaaS — предсказуемая выручка)

**Минимизация**:

| Действие | Почему это работает |
|----------|---------------------|
| **ZK-proofs как уникальный moat** | Zauth не имеет → криптографическое преимущество, которое нельзя добавить за месяц |
| **Мульти-протокольность** (MCP + A2A + AP2 + x402) | Zauth привязан к x402 → мы в 4x шире |
| **SaaS модель** | Инвесторы предпочитают предсказуемый ARR токену |
| **Скорость** (<10ms vs 500ms+) | Critical path performance для AI-агентов |
| **Competitive intelligence**: отслеживание Zauth, Masumi, Skyfire каждые 2 недели | Раннее обнаружение угроз |
| **Ecosystem lock-in**: MCP registry + trust data → чем больше данных, тем точнее trust → network effect | Data moat нельзя скопировать |

**Метрика контроля**: Feature comparison matrix — обновлять ежемесячно.

---

### R3: 🔴 Отсутствие Product-Market Fit

**Категория**: Продуктовый  
**Вероятность**: Высокая | **Воздействие**: Высокое

**Описание**: Рынок AI-агентов ещё формируется. Возможно, что создатели MCP-серверов не готовы монетизироваться, или покупатели не хотят платить за trust verification.

**Реальные данные**:

- 10,000+ MCP-серверов существуют, но 95%+ бесплатны  
- У MCP нет встроенной монетизации (подтверждено MCP спецификацией)
- 42% респондентов в StackOverflow Developer Survey 2025 готовы платить за верифицированные API

**Минимизация**:

| Действие | Срок |
|----------|------|
| **Custdev**: 50 глубинных интервью с MCP-создателями и AI-разработчиками | До launch |
| **Landing page тест**: Измерить conversion rate до постройки marketplace | Март 2026 |
| **Итеративный подход**: Запустить minimal marketplace → собрать feedback → итерировать | Q2 2026 |
| **Pivot readiness**: Если PMF не найден за 4 месяца → pivot plan (B2B Trust API only) | Q3 2026 |

**Метрика контроля**: NPS > 40, retention > 60% через 3 месяца.

---

### R4: 🟠 Зависимость от Протоколов Третьих Сторон

**Категория**: Технологический  
**Вероятность**: Средняя | **Воздействие**: Высокое

**Описание**: MCP (Anthropic), A2A (Google), x402 (Coinbase) — все контролируются крупными компаниями. Они могут изменить спецификацию, добавить встроенную монетизацию, или закрыть API.

**Минимизация**:

| Действие | Обоснование |
|----------|-------------|
| **Protocol-agnostic архитектура** | Trust Engine не зависит от конкретного протокола |
| **Adapter pattern** | Каждый протокол — отдельный adapter, легко добавлять/убирать |
| **Участие в стандартизации** | Contributions в MCP/A2A specs → influence |
| **Собственный discovery протокол** | Agora Discovery API как fallback |

---

### R5: 🟠 Недостаток Финансирования / Runway

**Категория**: Финансовый  
**Вероятность**: Средняя | **Воздействие**: Высокое

**Описание**: Pre-seed стартап без внешнего финансирования. Burn rate ограничен personal savings. Без Seed раунда — runway 6-9 месяцев.

**Реальные данные**:

- Median pre-seed raise (US, 2025): $500K-1.5M
- Median seed raise (AI startups, 2025): $3-5M
- Runway при $8K/mo burn: ~6 месяцев без funding

**Минимизация**:

| Действие | Срок |
|----------|------|
| **Минимальный burn**: $5-8K/mo (только хостинг + tools, без зарплат) | Now |
| **Revenue-first**: Запустить платные listings и API до начала fundraising | Q2 2026 |
| **Конкурсные гранты**: Suffolk competition, MassChallenge, Y Combinator | Q1-Q2 2026 |
| **Angel outreach**: Целевой пул из 20 angel investors в AI/dev-tools | Q2 2026 |
| **Revenue milestone**: $1K MRR перед Seed pitch (credibility) | Q3 2026 |

---

### R6: 🟠 Регуляторные Риски

**Категория**: Правовой  
**Вероятность**: Средняя | **Воздействие**: Критическое

**Описание**: Крипто-платежи (x402), ZK-proofs и AI agent transactions попадают в зоны неопределённости: EU AI Act, SEC крипто-регулирование, KYC/AML для платежей.

**Минимизация**:

| Действие | Обоснование |
|----------|-------------|
| **SaaS модель** (не токен) | Избегаем SEC рисков в отличие от Zauth ($ZAUTH token) |
| **Stripe как платёжный процессор** | Stripe берёт на себя KYC/AML compliance |
| **Privacy-by-design** | ZK-proofs минимизируют хранение PII → GDPR compliance |
| **Terms of Service + Privacy Policy** | Юридическая база до launch |
| **Legal advisor**: Найти специализированного AI/fintech юриста | Q2 2026 |
| **US-first launch**: Регуляторная среда США более предсказуема для SaaS | Launch |

---

### R7: 🟡 Технический Долг / Масштабирование

**Категория**: Технологический  
**Вероятность**: Высокая | **Воздействие**: Среднее

**Описание**: MVP построен за 1 месяц. Возможны bottleneck'и при масштабировании: PostgreSQL при 1M+ events/day, Supabase limitations для marketplace, Redis memory.

**Минимизация**:

| Действие | Обоснование |
|----------|-------------|
| **TimescaleDB hypertables** | Уже настроены для time-series данных |
| **Horizontal scaling blueprint** | K8s configs уже готовы |
| **Load testing** | k6 тесты в `tests/load/` — запускать перед каждым milestone |
| **Supabase → self-hosted PostgreSQL** | Plan B при превышении Supabase лимитов |
| **Caching strategy** | Redis для trust scores (уже реализовано) |

---

### R8: 🟡 Команда — Single Founder Risk

**Категория**: Организационный  
**Вероятность**: Высокая | **Воздействие**: Среднее

**Описание**: Одиночный founder = bus factor 1. Все знания, код и бизнес-контакты сконцентрированы в одном человеке.

**Минимизация**:

| Действие | Срок |
|----------|------|
| **Документация**: Все решения документированы (docs/, CONTEXT.md) | Ongoing |
| **Co-founder search**: CTO profiled for Rust/crypto experience | Q2 2026 |
| **Advisory board**: 3 advisors (AI expert, business, legal) | Q2 2026 |
| **Freelancers / part-time**: Для frontend/design tasks | As needed |
| **Suffolk University network**: Использовать alumni база | Now |

---

### R9: 🟡 Fraud и Abuse на Marketplace

**Категория**: Безопасность  
**Вероятность**: Низкая | **Воздействие**: Высокое

**Описание**: Fake listings, scam agents, fake reviews, trust score manipulation.

**Минимизация**:

| Механизм | Статус |
|----------|--------|
| **Anti-gaming detection** (velocity, sybil, burst, uniform) | ✅ Реализовано в core |
| **GitHub identity verification** | ✅ OAuth через Supabase |
| **Manual review queue** для первых 100 листингов | Planned |
| **Community reporting** | Planned |
| **Automatic suspension** при 3+ disputes | Designed |

---

### R10-R13: Дополнительные Риски

| # | Риск | Вероятность | Воздействие | Минимизация |
|---|------|-------------|-------------|-------------|
| R10 | Медленный рост MCP-экосистемы | Средняя | Среднее | Диверсификация: AI agents + automations, не только MCP |
| R11 | Ценовое давление (race to bottom) | Низкая | Среднее | Value-based pricing + differentiation через trust |
| R12 | Churn создателей | Низкая | Низкое | Analytics dashboard, payouts, community |
| R13 | Cyber-атака / data breach | Низкая | Высокое | Ed25519, hashed API keys, ZK-proofs, no PII storage |

---

## 3. SWOT-АНАЛИЗ

```
┌─────────────────────────────┬─────────────────────────────┐
│       STRENGTHS (S)         │       WEAKNESSES (W)        │
│                             │                             │
│ ✅ ZK-proofs (уникально)    │ ❌ Solo founder             │
│ ✅ <10ms latency (100x)     │ ❌ 0 users / 0 revenue      │
│ ✅ Multi-protocol            │ ❌ Ограниченный runway      │
│ ✅ MVP завершён (58 файлов)  │ ❌ Marketplace ещё MVP      │
│ ✅ Rust (performance + safe) │ ❌ No brand awareness       │
│ ✅ SaaS модель (предсказ.)   │ ❌ No partnerships yet     │
├─────────────────────────────┼─────────────────────────────┤
│       OPPORTUNITIES (O)     │       THREATS (T)           │
│                             │                             │
│ 🚀 MCP: 10K+ серверов       │ ⚠️ Zauth — live competitor  │
│ 🚀 AI Agent market →$52B    │ ⚠️ Google/AWS может войти   │
│ 🚀 MCP нет монетизации      │ ⚠️ Регуляторные изменения   │
│ 🚀 Enterprise demand растёт │ ⚠️ AI hype bubble burst     │
│ 🚀 Suffolk competition      │ ⚠️ Protocol changes         │
│ 🚀 First-mover в trust+MCP  │ ⚠️ Crypto market volatility │
└─────────────────────────────┴─────────────────────────────┘
```

---

## 4. TRIGGER POINTS — КОГДА МЕНЯТЬ СТРАТЕГИЮ

| Сигнал | Действие |
|--------|----------|
| 0 платящих через 4 месяца после launch | Pivot к B2B Trust API only |
| Zauth запускает marketplace | Ускорить differentiation + MCP focus |
| Google добавляет trust в A2A | Pivot к complementary positioning |
| Creator retention < 40% | Пересмотреть value prop для creators |
| $0 revenue к Q3 2026 | Радикальный pivot или shutdown |
| CAC > $200 устойчиво | Сменить GTM канал |

---

## 5. РЕЗЮМЕ

**Топ-3 критических риска**:

1. 🔴 **Cold start** → решение: supply-first GTM + seed content
2. 🔴 **Конкуренция Zauth** → решение: ZK moat + мульти-протокольность + speed
3. 🔴 **Отсутствие PMF** → решение: 50 custdev + итеративный launch

**Честная оценка**: Рынок AI-агентов **реален, но ранний**. Мы делаем ставку на то, что growth будет экспоненциальным (исторически верно для platform markets: Uber, Airbnb, Shopify все начинали в "too early" рынках). Ключ — **выжить до momentum** и **построить data moat** до прихода крупных игроков.
