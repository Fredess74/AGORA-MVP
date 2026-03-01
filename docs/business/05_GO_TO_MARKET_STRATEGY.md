# 🚀 AGORA — Go-to-Market Strategy

> **Версия**: 1.0 | **Дата**: 28 февраля 2026  
> **Метод**: Sequoia Arc + PLG (Product-Led Growth) + Community-Led Growth

---

## 1. GTM THESIS

> **Мы строим marketplace. У marketplace-стартапов одна задача: решить chicken-and-egg problem.**

**Наше решение**: Supply-first → поставлять ценность создателям ПРЕЖДЕ, чем начнём привлекать покупателей.

```
Phase 1: Supply (Creators)  →  Phase 2: Demand (Buyers)  →  Phase 3: Network Effects
    "Листишь бесплатно"          "Находишь проверенное"       "Маховик крутится"
    (месяц 1-3)                  (месяц 3-6)                  (месяц 6+)
```

**Почему supply-first?**

- Создателям нечего терять (листинг бесплатный)
- Seed content = более привлекательный marketplace для покупателей
- Каждый creator приводит 5-10 users через own network
- Uber, Airbnb, Etsy — все начинали с supply-side

---

## 2. ПЯТЬ ФАЗ GTM

### Phase 0: Pre-Launch (Март 2026) — "Stealth Seeding"

| Действие | Цель | KPI |
|----------|------|-----|
| Seed content: вручную залистить 20 лучших open-source MCP-серверов | Marketplace не выглядит пустым | 20 listings |
| Landing page с waitlist | Validate demand + collect emails | 200 signups |
| 50 custdev интервью (Zoom/Discord) | Validate PMF hypotheses | 70%+ confirm pain |
| Suffolk Competition pitch | Funding + visibility + validation | Win or top-3 |
| DevRel content: "How to monetize your MCP server" blog post | SEO + thought leadership | 1,000 views |

**Каналы сбора creators**:

- GitHub: DM авторам top-starred MCP repos
- Discord: MCP community server, AI builders communities
- Reddit: r/MCP, r/LocalLLaMA, r/MachineLearning
- X/Twitter: AI builder circle

---

### Phase 1: Supply Acquisition (Апрель-Май 2026) — "Creator First"

**Цель**: 50 активных создателей с залистенными продуктами.

| Канал | Тактика | Target | Cost |
|-------|---------|--------|------|
| **Direct outreach** | Персональные DM к 100 MCP-авторам на GitHub | 20 listings | $0 (time) |
| **Content marketing** | Серия статей: "MCP Monetization Guide", "Trust Score Explained" | Organic traffic | $500 |
| **Community** | Запуск Agora Discord, weekly creator calls | 50 members | $0 |
| **Referrals** | Early creators → invite friends → bonus: 1 month free premium | 10 referral listings | $0 |
| **Partnerships** | Коллабы с MCP framework авторами (smithery.ai, mcp.run) | Co-marketing | $0 |

**Офер для Early Creators** (first 50):

- ✅ Free listing навсегда
- ✅ 0% commission первые 3 месяца (потом 10%)
- ✅ Free "Verified" badge  
- ✅ Featured на главной странице
- ✅ Priority support в Discord
- ✅ Co-marketing (мы пишем case study о ваших продуктах)

---

### Phase 2: Demand Generation (Июнь-Август 2026) — "Buyer Magnet"

**Цель**: 300 активных покупателей, первые платные транзакции.

| Канал | Тактика | Target | Cost |
|-------|---------|--------|------|
| **SEO / Content** | Landing page SEO + blog → "best MCP servers for [task]" | 5K organic visits/mo | $1,000/mo |
| **Developer Documentation** | Comprehensive docs site → SDKs, guides, tutorials | Dev trust + adoption | $500 |
| **Product-Led Growth** | Free tier (10K API calls/mo) → upgrade path | 60% of signups start free | $0 |
| **MCP Config** | `npx mcp-add agora://service-name` — instant integration | Low friction adoption | $0 |
| **Integrations** | Claude Desktop, Cursor, VS Code → Agora as MCP source | Distribution through tools | $0 |
| **Social proof** | Trust badges on creator repos: "Verified on Agora ✅" | Brand visibility | $0 |

**Product-Led Funnel**:

```
Visit agora.dev (SEO/referral)
    ↓ 40% bounce
Browse marketplace
    ↓ 25% signup
Create account (GitHub OAuth)
    ↓ 60% activation
Connect first MCP service (free)
    ↓ 15% conversion
Upgrade to paid plan
    ↓ Monthly usage
Expansion revenue
```

**Target conversion**:

- Visit → Signup: 10%
- Signup → Activation: 60%
- Free → Paid: 15%
- Monthly expansion: +5% ARPU

---

### Phase 3: Growth Loops (Сентябрь-Декабрь 2026) — "Flywheel"

**Цель**: Self-sustaining growth без линейного увеличения маркетинг-бюджета.

#### Loop 1: Creator → Buyer Loop

```
Creator листит продукт → Sharing в свою аудиторию → 
Buyers приходят → Транзакции → Creator зарабатывает → 
Creator листит больше → Больше buyers...
```

#### Loop 2: Trust Data Loop

```
Больше транзакций → Точнее trust scores →
Buyers доверяют больше → Больше транзакций →
Data moat растёт → Конкурентам невозможно повторить
```

#### Loop 3: Agent-to-Agent Loop

```
AI Agent A находит Agent B через Agora →
Transaction logged → Trust updated →
Agent A recommends Agora to other agents →
Network grows → More agents discover Agora
```

---

### Phase 4: Scale (2027+) — "Market Expansion"

| Expansion Vector | Когда | Как |
|-----------------|-------|-----|
| **Geographic**: US → Europe → Asia | Q2 2027 | Multi-language, local payments |
| **Vertical**: MCP → AI Agents → Automations → Data APIs | Q3 2027 | Category expansion |
| **Enterprise**: Self-serve → Sales-assisted | Q4 2027 | Dedicated sales team (2 reps) |
| **Platform**: Tools → Workflows → Agent orchestration | 2028 | Platform play |

---

## 3. КАНАЛЫ ПРИВЛЕЧЕНИЯ — ПРИОРИТИЗАЦИЯ

| # | Канал | Impact | CAC | Скорость | Приоритет |
|---|-------|--------|-----|----------|-----------|
| 1 | **Direct GitHub outreach** | High | $0 | Fast | 🔴 P0 |
| 2 | **SEO / Content marketing** | High | $20-40 | Slow (3-6 mo) | 🔴 P0 |
| 3 | **Developer community** (Discord, Reddit) | Medium | $0 | Medium | 🔴 P0 |
| 4 | **Product-led growth** (free tier) | High | $0 | Medium | 🔴 P0 |
| 5 | **Referral program** | Medium | $10-20 | Medium | 🟠 P1 |
| 6 | **MCP ecosystem partnerships** | High | $0 | Slow | 🟠 P1 |
| 7 | **Hackathons / Competitions** | Medium | $500/event | Fast | 🟠 P1 |
| 8 | **Influencer / DevRel** | Medium | $500-2K | Fast | 🟡 P2 |
| 9 | **Paid ads** (Google, X) | Low-Med | $50-100 | Fast | 🟡 P2 |
| 10 | **Enterprise sales** | High | $500+ | Very slow | 🟡 P2 (Year 2) |

**Year 1 Focus**: Каналы #1-4 (бесплатные + high-impact)  
**Year 2 Focus**: Добавляем #5-8 (scalable growth)  
**Year 3 Focus**: Добавляем #9-10 (paid + enterprise)

---

## 4. СОДЕРЖАТЕЛЬНАЯ СТРАТЕГИЯ (CONTENT PLAN)

### Blog Posts (SEO-focused)

| Статья | Target keyword | Timing |
|--------|---------------|--------|
| "How to Monetize Your MCP Server in 2026" | monetize mcp server | March |
| "Top 20 MCP Servers for AI Developers" | best mcp servers | April |
| "Trust Scores for AI Agents: Complete Guide" | ai agent trust score | May |
| "MCP vs A2A vs x402: Protocol Comparison" | mcp vs a2a protocol | June |
| "How Agora Protects Against AI Fraud with ZK-Proofs" | zk proofs ai agents | July |
| "Building Passive Income with AI Automations" | passive income ai | August |

### Social Media (X/Twitter + LinkedIn)

| Формат | Частота | Пример |
|--------|---------|--------|
| Product updates | 2x/week | "🚀 New: Trust scores now update in <10ms" |
| Creator spotlights | 1x/week | "Meet @dev — earning $500/mo with their MCP server on Agora" |
| Educational threads | 1x/week | "🧵 How ZK-proofs work in 5 tweets" |
| Market insights | 1x/week | "AI agent market hits $5B. Here's why trust matters" |

---

## 5. PRICING & PACKAGING STRATEGY

### Positioning Matrix

```
                    PRICE
                Low           High
         ┌──────────────┬──────────────┐
         │              │              │
  Basic  │  FREE TIER   │   GROWTH     │
  Value  │  10K calls   │   $49/mo     │
         │  Basic trust │   100K calls │
         │              │   Analytics  │
         ├──────────────┼──────────────┤
         │              │              │
  High   │  VERIFIED    │  ENTERPRISE  │
  Value  │  LISTING     │   Custom     │
         │  $49/mo      │   $2K+/mo    │
         │  Featured    │   SLA, SSO   │
         │              │              │
         └──────────────┴──────────────┘
```

### Conversion Strategy

```
FREE (бесплатно навсегда)
├── 10K trust API calls/mo
├── 1 listing
├── Basic analytics
└── Community support
     ↓ 15% upgrade after 30 days
GROWTH ($49/mo)
├── 100K calls
├── 5 listings
├── Advanced analytics + webhooks
└── Priority support
     ↓ 10% upgrade after 90 days
SCALE ($199/mo)
├── 500K calls
├── Unlimited listings
├── Custom domain + white-label badge
└── Dedicated support channel
```

---

## 6. ПЕРВЫЕ 90 ДНЕЙ — TACTICAL PLAYBOOK

### Неделя 1-2: Foundation

- [ ] Launch landing page с waitlist и CTA
- [ ] Seed 20 MCP-серверов в marketplace (ручной листинг)
- [ ] Publish blog #1: "How to Monetize Your MCP Server"
- [ ] Create Agora Discord server
- [ ] Send 30 personalized DMs to MCP creators on GitHub

### Неделя 3-4: First Creators

- [ ] Onboard first 10 real creators (помочь залистить лично)
- [ ] Publish blog #2: "Top 20 MCP Servers"
- [ ] Suffolk Competition pitch
- [ ] Launch social media: Twitter + LinkedIn accounts
- [ ] Start weekly creator call (Discord/Zoom)

### Неделя 5-6: Beta Launch

- [ ] Open marketplace for public signups (GitHub OAuth)
- [ ] First public announcement: ProductHunt post
- [ ] Publish blog #3: "Trust Scores for AI Agents"
- [ ] Start tracking: signups, listings, first transactions
- [ ] Iterate on UX based on first 50 users feedback

### Неделя 7-8: First Revenue

- [ ] Enable paid plans (Stripe integration)
- [ ] Activate premium listings for first 5 creators
- [ ] Begin referral program
- [ ] Publish first creator spotlight: "How [Creator] earns with Agora"
- [ ] Apply to MassChallenge / Y Combinator if applicable

### Неделя 9-12: Growth

- [ ] Target: 50 listings, 100 signups, first $500 revenue
- [ ] Partnership outreach: Claude Desktop, Cursor, VS Code MCP support
- [ ] Investor deck v2 preparation
- [ ] Seed round soft-circle opens
- [ ] Publish case study with metrics

---

## 7. МЕТРИКИ GTM (NORTH STAR + SUPPORTING)

### North Star Metric

> **Weekly Active Transactions (WAT)** — количество платных транзакций в неделю

*Почему это North Star?*  

- Отражает обе стороны marketplace (supply + demand)  
- Коррелирует с revenue  
- Leading indicator роста

### Supporting Metrics

| Metric | Target (Month 3) | Target (Month 6) | Target (Month 12) |
|--------|------------------|-------------------|---------------------|
| **WAT** | 50 | 500 | 5,000 |
| **Listings** | 30 | 80 | 150 |
| **Monthly signups** | 50 | 200 | 500 |
| **Activation rate** | 40% | 55% | 65% |
| **Creator retention** (30-day) | 60% | 70% | 80% |
| **NPS** | >30 | >40 | >50 |
| **Organic traffic** | 1K/mo | 5K/mo | 15K/mo |
| **MRR** | $200 | $1,000 | $2,500 |

---

## 8. COMPETITIVE POSITIONING MESSAGING

### vs Zauth
>
> "Zauth проверяет endpoints. Agora монетизирует целую экосистему."

### vs Generic MCP directories
>
> "Directories — это список. Agora — это платформа с trust, payments, и analytics."

### vs Building your own billing
>
> "Зачем тратить 80 часов на Stripe integration, если Agora делает это за 10 минут?"

### vs No solution (status quo)
>
> "10,000 MCP-серверов. Ноль монетизации. Сколько вы уже потеряли?"

---

## 9. ПАРТНЁРСКАЯ СТРАТЕГИЯ

| Партнёр | Тип | Value для нас | Value для них | Timing |
|---------|-----|--------------|---------------|--------|
| **Anthropic** (Claude/MCP) | Platform | Distribution в MCP ecosystem | Trust layer для MCP | Q3 2026 |
| **Cursor / VS Code** | Integration | Built-in Agora as MCP source | Curated, trusted MCP catalog | Q3 2026 |
| **Stripe** | Technology | Best-in-class payments + credibility | New vertical (AI marketplace) | Q2 2026 |
| **Google** (A2A) | Protocol | A2A-compatible trust layer | Trust gap solved | Q4 2026 |
| **DigitalOcean / Vercel** | Infrastructure | Hosting credits + co-marketing | AI marketplace on their cloud | Q2 2026 |
| **MCP framework owners** | Ecosystem | Creator pipeline | Monetization for their users | Q2 2026 |

**Approach**: Start with small technical integrations → grow into strategic partnerships.

---

## 10. BUDGET ALLOCATION (Year 1 Marketing)

| Category | Monthly | Annual | % |
|----------|---------|--------|---|
| Content creation (blog, social) | $300 | $3,600 | 45% |
| Community (Discord events, swag) | $100 | $1,200 | 15% |
| ProductHunt / launches | $50 | $600 | 8% |
| Hackathon sponsorship | $100 | $1,200 | 15% |
| Paid experiments (last resort) | $100 | $1,200 | 15% |
| Tools (analytics, SEO) | $15 | $180 | 2% |
| **Total** | **$665** | **$8,000** | **100%** |

**Принцип**: 85% budget на organic/community, 15% на эксперименты с paid. Стартап с $24K ARR не может позволить paid acquisition как основной канал.
