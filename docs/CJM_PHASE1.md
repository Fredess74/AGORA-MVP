<!--
purpose: Customer Journey Map — Phase 1 (Indie Creators). Realistic, grounded in 2026 B2D research.
audience: Team, investors, pitch prep
language: Russian + English (technical terms)
last_updated: 2026-04-11
-->

# Customer Journey Map — Phase 1: Indie Developer Creators

> **TL;DR:** CJM для первой фазы Agora. Два независимых пути — **Creator (supply)** и **Buyer (demand)**. Каждый этап с реалистичными метриками, эмоциями, болями и нашими touchpoints. Конверсии основаны на индустриальных бенчмарках B2D marketplace 2025-2026.

---

## Философия продукта (Phase 1)

**Кто наш клиент:** Инди-разработчик, который построил AI инструмент (MCP server, API, agent, automation) и хочет чтобы его кто-то нашёл и заплатил.

**Какую проблему мы решаем:**

| Проблема | Как сейчас | С Agora |
|----------|-----------|---------|
| **Невидимость** | Публикует на GitHub → 3 звезды → $0 | Листинг на Agora → AI-ассистенты рекомендуют → $500/mo |
| **Нет монетизации** | MCP протокол не имеет встроенного billing | Agora — платёжный слой + trust слой |
| **Нет доверия** | Buyer не может проверить качество | Behavioral trust score 0.0-1.0 |
| **Нет обратной связи** | Zero analytics на usage | Creator dashboard с метриками |

**Привлечение (как узнают о нас):**
- Dev communities (Discord, Reddit r/MCP, r/LocalLLaMA, r/SideProject)
- GitHub (README badges, trending, issues)
- Technical content (dev.to, Hashnode, YouTube process content)
- MCP ecosystem (Smithery, official MCP directory)
- AI-assisted discovery (Cursor, Claude, ChatGPT рекомендуют нас)
- Word-of-mouth от первых creators

> **Исследование (2026):** Developers обнаруживают инструменты через peer-driven communities, technical content и AI-ассистентов. Cold DMs и "check out my product" посты не работают. Documentation-first и process content — основные каналы.

---

## 🟢 ПУТЬ A: CREATOR (Supply Side)

### Персона: "Алекс" — 28 лет, full-stack разработчик

- Построил MCP server для code review на GitHub
- 47 звёзд, 3 форка, 0 дохода
- Видит что 73% MCP серверов невидимы для AI-ассистентов
- Хочет: чтобы люди нашли его инструмент и заплатили за него
- Боится: что платформа будет пустой, что никто не будет платить

---

### Этап 1: AWARENESS (Осведомлённость)

**Триггер:** Алекс натыкается на Agora

```
┌─────────────────────────────────────────────────────────────────┐
│  Каналы обнаружения (откуда реально узнают)                     │
│                                                                 │
│  40% — Dev community (Reddit, Discord, HN пост)                │
│  25% — GitHub (увидел badge на чьём-то README)                  │
│  20% — Technical article (dev.to, "How I monetize my MCP")      │
│  10% — AI-assistant recommendation                              │
│   5% — Direct SEO search ("sell my AI tool")                    │
└─────────────────────────────────────────────────────────────────┘
```

| Аспект | Детали |
|--------|--------|
| **Что видит** | Пост на Reddit: "I listed my MCP server on Agora and made $89 in 2 weeks" |
| **Эмоция** | Любопытство + скепсис ("ещё один рынок, который умрёт") |
| **Главный вопрос** | "Есть ли там ПОКУПАТЕЛИ? Или это пустой маркетплейс?" |
| **Барьер** | 80% marketplace стартапов умирают от cold start |
| **Что мы делаем** | Показываем РЕАЛЬНЫЕ метрики: "47 agents listed, 312 trust queries/day, 23 paid transactions" |
| **Метрика** | Site visits from dev channels → **target: 500/mo by Month 3** |

**⚠️ Честный момент:** На ранних этапах (первые 30 дней) нет покупателей. Мы привлекаем creators ценностью trust score + visibility, а не объёмом транзакций. Это "Single-Player Mode" — инструмент полезен даже без buyers.

---

### Этап 2: CONSIDERATION (Изучение)

**Действие:** Алекс заходит на agora.dev и изучает

```
Алекс → agora.dev
  → Смотрит главную (что это, для кого)
  → Ищет: "how it works" / "for creators"
  → Видит: trust score formula (open algorithm)
  → Проверяет: документацию (< 5 минут на решение)
  → Ключевой момент: видит BADGES на GitHub README других creators
```

| Аспект | Детали |
|--------|--------|
| **Что оценивает** | 1) Время на листинг (< 10 min?) 2) Цена (free?) 3) Что за trust score 4) Есть ли другие creators |
| **Эмоция** | Заинтересован, но осторожен. "Попробую, это бесплатно" |
| **Главный вопрос** | "Что я получу, если залищу — прямо сейчас?" |
| **Барьер** | Если надо заполнять 15 полей / ждать одобрения → уходит |
| **Что мы делаем** | Free listing. OAuth signup (30 sec). Auto-import из GitHub README. Мгновенный trust score |
| **Метрика** | Visit → Signup conversion: **target 12-15%** (B2D benchmark: 8-25%) |

**Time to First Value:**
- Benchmark B2D: < 15 минут для freemium
- **Наш target: < 5 минут** от signup до опубликованного листинга с trust score

---

### Этап 3: ACTIVATION ("Aha!" Moment)

**Действие:** Алекс создаёт листинг и получает trust score

```
Signup (GitHub OAuth, 30 sec)
  → Paste repo URL
  → Agora scans: tests, docs, code quality, uptime
  → Trust Score: 0.47 (New agent, tier "Emerging")
  
  ★ AHA MOMENT: "Мой код получил объективную оценку. 
    Я вижу ЧТО надо улучшить чтобы поднять score."
  
  → Badge ready: ![Trust Score](https://agora.dev/badge/agt_abc123)
  → "Вставь в README → получи трафик"
```

| Аспект | Детали |
|--------|--------|
| **Что чувствует** | Удовлетворение: получил tangible result (число, badge, listing) |
| **Aha! Moment** | Trust score breakdown: "Code Quality: 0.72, Tests: 0.39, Docs: 0.81" — actionable feedback |
| **Главный вопрос** | "Как поднять score?" → "Кто меня найдёт?" |
| **Барьер** | Если score кажется несправедливым → разочарование |
| **Что мы делаем** | Показываем: что влияет на score, как улучшить. Tips: "Add 3 tests → +0.08 score" |
| **Метрика** | Signup → Listing created: **target 60%** |

---

### Этап 4: ENGAGEMENT (Первый опыт)

**Действие:** Алекс вставляет badge в README и следит за метриками

```
Week 1: Badge in README → 12 badge views → 0 transactions
Week 2: Share listing on Twitter → 45 badge views → 0 transactions  
Week 3: Adds tests, docs → score 0.47 → 0.63 → 2 trust queries
Week 4: First buyer discovers via MCP → $3.00 earned

Total Month 1: $3.00 revenue, 84 badge views, 2 transactions
```

| Аспект | Детали |
|--------|--------|
| **Что чувствует** | Надежда + нетерпение. "Работает, но медленно" |
| **Главный вопрос** | "Стоит ли продолжать? Когда будут реальные деньги?" |
| **Барьер** | Если 4 недели и $0 → churn. **Это критическая точка** |
| **Что мы делаем** | Creator dashboard с: badge views, trust queries, score trend. Email: "Your trust score increased to 0.63" |
| **Метрика** | 30-day retention: **target 50-60%** (marketplace creator benchmark) |

**⚠️ Честная реальность:** Большинство creators в первый месяц заработают $0-10. Наша стратегия — **gamification of trust score improvement**, не revenue promises.

---

### Этап 5: RETENTION (Долгосрочное вовлечение)

**Действие:** Алекс остаётся и развивает свой profile

```
Month 2: Score 0.63 → 0.78 (added monitoring, fixed latency)
  5 transactions → $14.50 revenue
  
Month 3: Score 0.78 → 0.84
  Listed 2nd tool
  18 transactions → $42.00 revenue
  First AI-assistant referral (Claude recommended his tool)

Month 6: Score 0.84 → 0.91 (Veteran tier)
  3 tools listed
  ~120 transactions/mo → $360/mo
  "Featured Creator" badge earned
```

| Аспект | Детали |
|--------|--------|
| **Что чувствует** | Гордость: "Я — verified, high-trust creator". Зависимость: dashboard check daily |
| **Retention Driver** | Trust score as professional credential (like GitHub stars, but verified) |
| **Главный вопрос** | "Как добавить ещё инструменты? Могу ли я уйти с работы?" |
| **Барьер** | Если 6 месяцев и < $100/mo → "не стоит времени" |
| **Что мы делаем** | Creator Pro tools ($29/mo): analytics, CI/CD integration, priority badge. Community slack |
| **Метрика** | 6-month retention: **target 40%** | Creator LTV: **target $200-500** |

---

### Этап 6: ADVOCACY (Евангелизм)

**Действие:** Алекс привлекает других creators

```
Алекс пишет пост: "How I earn $360/mo from my MCP server on Agora"
  → 5 new creators sign up from his referral
  → Each brings 2-3 buyers
  
Creator flywheel:
  Creator posts badge → Developers see it → Some become creators → They post badges → ...
```

| Аспект | Детали |
|--------|--------|
| **Что чувствует** | Принадлежность к ecosystem. "Я — early adopter, это растёт" |
| **Retention Driver** | Social proof + community + growing revenue |
| **Что мы делаем** | Referral program: "Invite creator → both get 0% commission for 1 month" |
| **Метрика** | Referral rate: **target 15-20%** (each active creator brings 1-2 new creators) |

---

## 🔵 ПУТЬ B: BUYER (Demand Side)

### Персона: "Мария" — Product Manager в стартапе (15 чел.)

- Команда использует AI для задач: translation, code review, data extraction
- Устала от: broken API tools, undocumented agents, hallucinated outputs
- Хочет: надёжный AI инструмент, verified, с SLA
- Боится: выбрать wrong vendor (42% компаний abandoned AI in 2025 из-за этого)

---

### Этап 1: AWARENESS

**Триггер:** Мария ищет решение проблемы

```
┌─────────────────────────────────────────────────────────────────┐
│  Каналы обнаружения (buyer)                                     │
│                                                                 │
│  35% — AI assistant recommended Agora tool                      │
│        ("Find me a translation API" → Claude queries Agora MCP) │
│  25% — Google search ("best AI code review tool 2026")          │
│  20% — Dev colleague recommendation                             │
│  15% — SEO article ("Top 5 AI tools for [task]")                │
│   5% — Direct browse on agora.dev                               │
└─────────────────────────────────────────────────────────────────┘
```

| Аспект | Детали |
|--------|--------|
| **Что видит** | AI assistant: "I found 3 code review tools on Agora. Top rated: CodeBot (trust 0.91)" |
| **Эмоция** | Облегчение: "наконец кто-то это ранжирует по качеству, а не по маркетингу" |
| **Главный вопрос** | "Можно ли реально доверять этому score?" |
| **Барьер** | Если score кажется fake/gameable → не доверяет |
| **Что мы делаем** | Показываем формулу (open algorithm), breakdown по 6 сигналам, history |
| **Метрика** | Discovery → Click: **35% conversion** (intent-driven, AI-mediated) |

**Ключевое отличие Phase 1:** 35% buyers приходят через AI-ассистентов, минуя наш сайт. Это **zero acquisition cost** канал.

---

### Этап 2: EVALUATION

**Действие:** Мария сравнивает инструменты

```
Agora marketplace:
  
  CodeBot    — Trust 0.91 ★ | Uptime 99.2% | 342 txns | $0.03/call
  ReviewPro  — Trust 0.84   | Uptime 97.1% | 128 txns | $0.05/call
  QuickLint  — Trust 0.72   | Uptime 94.3% |  23 txns | $0.02/call
  
  Мария кликает на CodeBot:
  → Trust breakdown: ResponseTime 0.95, Quality 0.89, Identity 0.87...
  → Success rate: 96% (last 100 calls)
  → "Last incident: 14 days ago (resolved in 2h)"
```

| Аспект | Детали |
|--------|--------|
| **Что оценивает** | Trust score, price, success rate, uptime, # transactions |
| **Эмоция** | Уверенность: данные прозрачные, объективные, не маркетинговые |
| **Главный вопрос** | "Сколько стоит? Есть ли free trial?" |
| **Барьер** | Если нет free tier → уходит. Если нет отзывов → подозрительно |
| **Что мы делаем** | Free tier: 100 calls/mo. Trust breakdown открыт всем. Transaction history |
| **Метрика** | View → Try (free tier): **target 25%** (B2D freemium benchmark) |

---

### Этап 3: FIRST TRANSACTION

**Действие:** Мария использует инструмент через Agora

```
Option A (Direct): 
  Click "Use" on agora.dev → Code submitted → Result in 3 sec → $0.03 deducted

Option B (AI-mediated):
  Мария: "Claude, review this code"
  Claude → Agora MCP → CodeBot (trust 0.91) → Result delivered
  Мария даже не знала что использовала Agora

★ AHA MOMENT: "Это просто РАБОТАЕТ. И я вижу
  что инструмент прошёл проверку качества."
```

| Аспект | Детали |
|--------|--------|
| **Что чувствует** | Удивление: "Быстрее чем искать на GitHub и проверять самому" |
| **Aha! Moment** | Trust-verified result + instant delivery + transparent pricing |
| **Барьер** | Payment friction. Если надо вводить карту для $0.03 → уходит |
| **Что мы делаем** | Prepaid balance ($5 minimum top-up). AI-mediated path = zero friction |
| **Метрика** | Free → First paid transaction: **target 8-12%** (B2D freemium→paid benchmark: 5-15%) |

---

### Этап 4: REPEAT USAGE

**Действие:** Мария начинает использовать регулярно

```
Week 1:  3 transactions ($0.09)
Week 2:  8 transactions ($0.24) — shared with team
Week 3: 22 transactions ($0.66) — team adopted
Week 4: 45 transactions ($1.35) — daily usage

Month 1 total: 78 transactions, $2.34 spent
Month 3 total: ~500 transactions, $15/mo → upgrades to Trust API Pro ($29/mo)
```

| Аспект | Детали |
|--------|--------|
| **Что чувствует** | Привычка: "Agora — место где я нахожу AI инструменты" |
| **Retention Driver** | AI-mediated path = invisible infrastructure. Мария даже не переключается |
| **Главный вопрос** | "Могу ли получить SLA? Compliance reports?" |
| **Барьер** | Если инструмент подводит и спора нет → теряет доверие |
| **Что мы делаем** | Auto-refund for clear failures. Trust score penalty visible. Dispute system (planned) |
| **Метрика** | 30-day buyer retention: **target 65-70%** | Average buyer LTV: **$50-150** |

---

## 📊 СВОДНАЯ ВОРОНКА (Phase 1, Month 6)

### Creator Funnel

```
Awareness:   1,000 devs видят Agora       (100%)
  ↓ 15%
Signup:        150 создают аккаунт          
  ↓ 60%        
Listing:        90 публикуют agent          
  ↓ 55%
Active (30d):   50 остаются через месяц     
  ↓ 60%
Retained (6mo): 30 активных creators        
  ↓ 20%
Advocates:       6 пишут посты/referrals    

Каждый advocate приносит ~3 creators → 18 новых creators → flywheel
```

### Buyer Funnel

```
Discovery:    5,000 encounters (web + AI-mediated)  (100%)
  ↓ 35%
Explore:      1,750 смотрят listings                
  ↓ 25%
Try (free):     437 используют free tier            
  ↓ 10%
1st payment:     44 первая оплата                   
  ↓ 65%
Retained:        29 регулярных buyers               
  ↓ varies
Upsell (API):   3-5 покупают Trust API Pro ($29/mo)
```

### Unit Economics (Month 6, Base Case)

| Метрика | Значение |
|---------|----------|
| Active Creators | ~50 |
| Listed Agents | ~90 |
| Active Buyers | ~29 regular, ~100 sporadic |
| Monthly transactions | ~300-500 |
| Average transaction | $2-5 |
| Commission revenue (10%) | ~$100-250/mo |
| Trust API subscribers | 3-5 |
| Trust API revenue | $87-145/mo |
| **Total MRR** | **~$200-400/mo** |
| Monthly burn | ~$850 |
| **Gap to break-even** | **~$450-650/mo** |

> **⚠️ Честная оценка:** На Month 6 мы НЕ будем break-even. Break-even в best case — Month 9 post-LLC (Feb 2027). Это нормально при $850/mo burn и 35-53 month runway.

---

## 🎯 КРИТИЧЕСКИЕ МОМЕНТЫ ИСТИНЫ

### Creator Side — 3 момента где теряем людей

| # | Момент | Когда | Причина потери | Решение |
|---|--------|-------|---------------|---------|
| 1 | **"Empty marketplace"** | Day 1 consideration | "Тут 3 листинга, кому это нужно?" | Single-Player Mode: trust score + badge полезны даже без buyers |
| 2 | **"$0 after 30 days"** | Week 4 | "Я трачу время, а дохода нет" | Gamification: score improvement notifications. "You improved from 0.47 → 0.63" |
| 3 | **"Unfair score"** | After first scoring | "Мой код лучше чем 0.47!" | Transparent formula. Show EXACTLY what lowers score. Actionable tips |

### Buyer Side — 3 момента где теряем людей

| # | Момент | Когда | Причина потери | Решение |
|---|--------|-------|---------------|---------|
| 1 | **"Что это за score?"** | First view | "Почему я должен доверять ВАШЕЙ оценке?" | Open algorithm. Show formula + data sources. Not a black box |
| 2 | **"Payment friction"** | First purchase | "Ввести карту ради $0.03?" | Prepaid balance. AI-mediated = invisible payment |
| 3 | **"Tool failed, no recourse"** | After bad experience | "Купил по score 0.89 и оно не сработало" | Auto-refund for clear failures. Trust score penalty visible to ALL |

---

## 🔄 FLYWHEEL — Как CJM масштабируется

```
                    ┌──────────────┐
                    │   Creators   │
                    │  list tools  │
                    └──────┬───────┘
                           │
                           ▼
                ┌──────────────────┐
                │ Trust scores     │
                │ computed         │◄──── MORE data
                └──────┬───────────┘      = better scores
                       │
                       ▼
             ┌─────────────────────┐
             │ AI assistants       │
             │ recommend tools     │
             └──────┬──────────────┘
                    │
                    ▼
           ┌────────────────────┐
           │ Buyers transact    │
           │ (some via AI)      │
           └──────┬─────────────┘
                  │
                  ▼
        ┌─────────────────────────┐
        │ Transaction data feeds  │
        │ back into trust scores  │───────► MORE creators
        │ + creators earn $$$     │         attracted by $$$
        └─────────────────────────┘
```

**Когда flywheel начинает вращаться:** ~Month 4-6, когда первые creators публикуют "I earned $X on Agora" и AI-assistants начинают regularly querying MCP endpoint.

---

## 📋 ЧТО НУЖНО ПОСТРОИТЬ ДЛЯ CJM (по приоритету)

| # | Feature | CJM Stage | Priority | Status |
|---|---------|-----------|----------|--------|
| 1 | GitHub OAuth signup + auto-import | Creator Activation | P0 | ✅ Built |
| 2 | Trust score display on cards | Both Evaluation | P0 | ✅ Built |
| 3 | Creator listing flow | Creator Activation | P0 | ✅ Built |
| 4 | MCP server for AI discovery | Buyer Awareness | P0 | ✅ Built |
| 5 | **Embeddable badge** | Creator Engagement | P0 | ⬜ Not built |
| 6 | **Creator dashboard** (views, score trend) | Creator Retention | P0 | ⬜ Not built |
| 7 | **Trust score breakdown** (6 signals) | Both Evaluation | P1 | ⬜ Partial |
| 8 | Prepaid balance | Buyer 1st Transaction | P1 | ⬜ Not built (post-LLC) |
| 9 | Score improvement tips | Creator Engagement | P1 | ⬜ Not built |
| 10 | Email notifications (score changes) | Creator Retention | P2 | ⬜ Not built |

---

## 🔬 ГИПОТЕЗЫ ДЛЯ ВАЛИДАЦИИ

| # | Гипотеза | Тест | Метрика успеха | Deadline |
|---|----------|------|---------------|----------|
| H1 | Trust score badge drives creator signups | Track: badge view → agora.dev visit → signup | > 3% badge-to-signup conversion | Month 3 |
| H2 | AI-mediated discovery is #1 buyer channel | Track: MCP queries vs direct browse | > 50% buyers come via AI by Month 6 | Month 6 |
| H3 | Score improvement gamification retains creators | Track: 30-day retention with vs without score notifications | > 60% 30-day retention with notifs | Month 4 |
| H4 | Free tier converts to paid at B2D benchmarks | Track: free → paid conversion | > 8% within 60 days | Month 6 |
| H5 | Creators earn enough to stay ($100+/mo) | Track: average creator revenue at Month 6 | > $100/mo for top 20% creators | Month 6 |

> **Если H5 fails:** Pivot — Trust API only (B2B), drop marketplace commission model.

---

## ИСТОЧНИКИ

- Developer tool discovery patterns: dev.to, strategicnerds.com (2026)
- B2D conversion benchmarks: userpilot.com, growthunhinged.com (2025)
- Freemium→Paid rates: 5-15% (B2D avg), Time to First Value: < 15 min target
- MCP monetization challenges: andrewbaker.ninja, reddit.com/r/MCP (2026)
- Marketplace cold start: Reforge, Sharetribe research (2025)
- Creator economy monetization: Developer tool builder surveys (2026)
