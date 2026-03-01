# 💰 AGORA — Бизнес-Модель

> **Версия**: 1.0 | **Дата**: 28 февраля 2026  
> **Тип**: Multi-sided Marketplace + SaaS Hybrid

---

## 1. МОДЕЛЬ: MARKETPLACE + INFRASTRUCTURE SaaS

Agora комбинирует две проверенные бизнес-модели:

| Компонент | Модель | Аналог |
|-----------|--------|--------|
| **Marketplace** | Двусторонняя платформа (commission) | App Store, Shopify App Store |
| **Trust API** | Usage-based SaaS (pay-per-call) | Stripe, Twilio |
| **Premium Tiers** | Subscription SaaS | GitHub Pro, Vercel Pro |

**Почему гибрид?** Чистый API-бизнес ($0.001/call) — гонка к дну. Marketplace commission (5-15%) создаёт устойчивую маржу + network effects.

---

## 2. REVENUE STREAMS (6 ИСТОЧНИКОВ)

### Stream 1: 💳 Marketplace Commission (40% целевой revenue)

Комиссия с каждой транзакции между покупателем и создателем.

| Тип транзакции | Комиссия | Пример |
|----------------|----------|--------|
| Pay-per-call (MCP/API) | 10% | Вызов MCP-сервера: $0.01 → Agora: $0.001 |
| Subscription | 10% | $29/mo подписка → Agora: $2.90/mo |
| One-time purchase | 15% | Автоматизация: $99 → Agora: $14.85 |
| Enterprise contract | 5% | $50K/year → Agora: $2,500/year |

**Обоснование 10%**: App Store берёт 30%, Shopify — 15-20%, Gumroad — 10%. Мы устанавливаем 10% как конкурентный и справедливый уровень для привлечения создателей.

**Механика**: Агент/покупатель платит через Stripe Connect → Agora автоматически удерживает комиссию → остаток переводится на счёт создателя еженедельно.

---

### Stream 2: 🔐 Trust API Calls (20% целевой revenue)

Верификация доверия по запросу — core infrastructure product.

| Tier | Цена | Включено | Аудитория |
|------|------|----------|-----------|
| **Free** | $0 | 10,000 calls/mo | Indie разработчики, тестирование |
| **Growth** | $49/mo | 100,000 calls/mo + webhooks | Растущие продукты |
| **Scale** | $199/mo | 500,000 calls/mo + priority | Средние компании |
| **Enterprise** | Custom | Unlimited + SLA + dedicated | Крупные клиенты |

**Overage**: $0.0008/call сверх лимита (Growth), $0.0005/call (Scale).

**Обоснование ценообразования**: Twilio SMS стоит $0.0075/msg. Stripe — 2.9% + $0.30. Наша модель ($0.001/verification) значительно дешевле и привлекательнее для volume use cases.

---

### Stream 3: ⭐ Premium Listings (15% целевой revenue)

Создатели платят за повышенную видимость и верификацию.

| Tier | Цена | Преимущества |
|------|------|-------------|
| **Verified** | $49/mo | ✅ Badge, приоритет в поиске, analytics dashboard |
| **Featured** | $149/mo | ✅ Verified + Featured placement на главной, email highlights |
| **Spotlight** | $499/mo | ✅ Featured + dedicated landing page, co-marketing |

**Обоснование**: Shopify App Store charges $99/mo for verified partner. AWS Marketplace Partner — $5K+/year. Наш порог входа ниже, но масштабируется.

---

### Stream 4: 🏢 Enterprise Contracts (15% целевой revenue)

Индивидуальные контракты для крупных клиентов.

| Package | Цена | Включает |
|---------|------|----------|
| **Team** | $500/mo | Private registry, 5 seats, SSO, audit logs |
| **Business** | $2,000/mo | Dedicated instance, 25 seats, SLA 99.9%, custom integrations |
| **Enterprise** | $5,000-50,000/mo | Multi-region, unlimited seats, 99.99% SLA, on-premise option |

---

### Stream 5: 🔒 ZK Proof Generation (5% целевой revenue)

Криптографическое доказательство доверия для mission-critical сценариев.

| Тип | Цена | Use Case |
|-----|------|----------|
| Standard proof | $0.01/proof | Верификация trust score для одного агента |
| Batch proof | $0.005/proof (10+) | Mass verification для fleet management |
| Audit proof | $0.05/proof | Compliance-ready с timestamps |

---

### Stream 6: 📢 Discovery & Promoted Placement (5% целевой revenue)

| Формат | Модель | Пример цены |
|--------|--------|-------------|
| Promoted search results | CPC | $0.10-0.50/click |
| Category sponsorship | CPM | $5-15 CPM |
| "Recommended" section | Monthly flat | $99-299/mo |

**Примечание**: Активируется только при достижении 500+ листингов (Q4 2026). До этого — нерелевантно.

---

## 3. UNIT ECONOMICS

### Creator Side (Supply)

| Метрика | Значение | Обоснование |
|---------|----------|-------------|
| **ARPU** (Monthly) | $200 | $50 commission + $49 premium + usage surplus |
| **CAC** | $80 | Developer marketing: content + community + referrals |
| **LTV** | $4,800 | $200 × 24 месяца average retention |
| **LTV/CAC** | 60x | Отличный показатель (benchmark >3x) |
| **Payback** | <1 месяц | Creators сразу монетизируют |
| **Churn** | ~4%/mo | Target: снижение до 2.5% через lock-in |

### Consumer Side (Demand)

| Метрика | Значение | Обоснование |
|---------|----------|-------------|
| **ARPU** (Monthly) | $50 | $30 trust API + $20 marketplace purchases |
| **CAC** | $30 | SEO + product-led growth + dev docs |
| **LTV** | $1,200 | $50 × 24 месяца |
| **LTV/CAC** | 40x | Strong |
| **Churn** | ~5%/mo | Higher than creators (typical for demand side) |

### Platform Margins

| Компонент | Gross Margin | Обоснование |
|-----------|-------------|-------------|
| Commission revenue | **90%** | Почти чистая маржа (только Stripe fees ~2.9%) |
| Trust API | **85%** | Инфраструктура стоит <15% от revenue |
| Premium listings | **95%** | Чисто software |
| Enterprise | **75%** | Требует support + custom work |
| **Blended Gross Margin** | **~85%** | На уровне лучших SaaS компаний |

---

## 4. ЦЕНОВАЯ СТРАТЕГИЯ

### Принцип: Value-Based Pricing

Мы не продаём "API calls" — мы продаём **доверие и безопасность**.

```
Для создателя:
  Без Agora: $0 дохода от MCP-сервера (нет канала монетизации)
  С Agora: $500+/mo пассивный доход
  Value created: $500+/mo → мы берём 10% = $50/mo (справедливо)

Для покупателя:
  Без Agora: 1 из 5 API-провайдеров — мошенник или ненадёжный
  Потери: $500-5000/месяц на downtime, fraud, рефалы
  С Agora: Верифицированные агенты, trust scores, ZK proofs
  Мы берём: $49/mo → ROI: 10-100x
```

### Competitor Pricing Comparison

| Сервис | Модель | Наша позиция |
|--------|--------|-------------|
| Stripe | 2.9% + $0.30 per tx | Дешевле на малых транзакциях |
| Twilio | $0.0075/SMS | Наша цена: $0.001/trust check — в 7x дешевле |
| Shopify | 15-30% take rate | Мы берём только 10% |
| AWS Marketplace | 15-20% commission | Мы: 5-15% — привлекательнее для creators |

---

## 5. FLYWHEEL (МАХОВИК РОСТА)

```
┌─────────────────────────────────────────────┐
│                                             │
│   Больше создателей листят продукты         │
│          ↑                    ↓              │
│   Creators зарабатывают    Больше продуктов  │
│   больше (word-of-mouth)   в каталоге        │
│          ↑                    ↓              │
│   Больше покупателей       Покупатели        │
│   платят                   находят нужное    │
│          ↑                    ↓              │
│   Растёт GMV              Больше trust data  │
│          ↑                    ↓              │
│   Agora зарабатывает       Trust scores      │
│   на commission            точнее             │
│                                             │
└─────────────────────────────────────────────┘
```

Ключевой момент: **Каждая транзакция делает платформу умнее** (больше данных → лучше trust → больше доверия → больше транзакций). Это моат, который невозможно скопировать за деньги.

---

## 6. BREAK-EVEN АНАЛИЗ

| Допущение | Значение |
|-----------|----------|
| Monthly burn rate (pre-revenue) | $8,000 |
| Avg. revenue per listing | $50/mo (commission) |
| Avg. trust API revenue | $0.50/user/mo |
| Premium listing rate | 15% of creators |

**Break-even формула**:

```
$8,000 / ($50 × 15% premium + $35 avg commission) = ~110 активных листингов
```

**Вывод**: При 110-150 активных листингах с регулярными транзакциями — Agora выходит на окупаемость операционных расходов.

**Целевой срок**: 6-8 месяцев после запуска marketplace.
