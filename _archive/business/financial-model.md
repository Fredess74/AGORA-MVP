# Agora — Financial Model
## 5-Year Projections (Conservative to Aggressive)

**Version**: 0.1
**Date**: 2025-12-23
**Last Updated**: 2025-12-23

---

## 1. KEY ASSUMPTIONS

### Market Assumptions
| Assumption | Value | Source |
|------------|-------|--------|
| AI Agents Market 2025 | $7.84B | MarketsandMarkets |
| AI Agents Market 2030 | $52.62B | MarketsandMarkets |
| CAGR | 46.3% | Calculated |
| Agentic Commerce 2030 | $3-5T | Industry estimates |
| Agora TAM (1% of flows) | $30-50B | Assumption |
| Agora SAM | $5B | Focus segment |

### Business Model Assumptions
| Element | Value | Notes |
|---------|-------|-------|
| **Trust Layer (Free tier)** | $0 | User acquisition |
| **Trust Layer (Pro)** | $49/mo | Analytics, priority |
| **Trust Layer (Enterprise)** | $499/mo | SLA, support, custom |
| **Payment Take Rate** | 1-3% | When payments launch |
| **Avg Transaction Size** | $0.10 | Micropayments |

### Cost Assumptions
| Element | Monthly (Year 1) | Notes |
|---------|------------------|-------|
| Hosting (Railway) | $100-500 | Scales with usage |
| Database | $50-200 | PostgreSQL + Redis |
| Tools/SaaS | $100 | Monitoring, analytics |
| Legal/Admin | $100 | Minimal |
| Marketing | $200-500 | Content, ads |
| Founder Salary | $0 | Bootstrapped |
| **Total Burn** | **$500-1,500/mo** | Very lean |

### Milestones Assumptions
| Milestone | Timeline | Trigger |
|-----------|----------|---------|
| MVP Launch | Month 3 | Beta ready |
| First Revenue | Month 6 | Pro tier launch |
| Payments Launch | Month 12 | Trust layer validated |
| Series Seed | Month 18 | $100K MRR |

---

## 2. REVENUE MODEL

### Revenue Streams

```
┌─────────────────────────────────────────────────────────────┐
│                    REVENUE STREAMS                         │
├─────────────────┬─────────────────┬─────────────────────────┤
│   YEAR 1-2      │    YEAR 2-3     │      YEAR 3-5          │
│   Trust Layer   │  + Payments     │  + Enterprise + Flows   │
├─────────────────┼─────────────────┼─────────────────────────┤
│ - Free tier     │ - Take rate 1%  │ - Custom plans         │
│ - Pro $49/mo    │ - Take rate 2%  │ - Flow templates       │
│ - Enterprise    │ - Enterprise    │ - Insurance/SLA        │
│   $499/mo       │   integrations  │ - Data/analytics       │
└─────────────────┴─────────────────┴─────────────────────────┘
```

### Pricing Tiers (Trust Layer)

| Tier | Price | Features | Target |
|------|-------|----------|--------|
| **Free** | $0 | 1,000 calls/mo, basic score | Indie devs |
| **Pro** | $49/mo | 50,000 calls, analytics, priority | Small teams |
| **Business** | $199/mo | 500,000 calls, API access, support | Growing companies |
| **Enterprise** | $499+/mo | Unlimited, SLA, custom | Enterprise |

### Payment Revenue (Year 2+)

| GMV/Month | Take Rate | Revenue |
|-----------|-----------|---------|
| $10,000 | 2% | $200 |
| $100,000 | 2% | $2,000 |
| $1,000,000 | 1.5% | $15,000 |
| $10,000,000 | 1% | $100,000 |
| $100,000,000 | 0.75% | $750,000 |

---

## 3. 5-YEAR PROJECTIONS

### Scenario A: Conservative (Bootstrapped)

| Metric | Year 1 | Year 2 | Year 3 | Year 4 | Year 5 |
|--------|--------|--------|--------|--------|--------|
| **Users (free)** | 200 | 1,000 | 5,000 | 15,000 | 40,000 |
| **Users (paid)** | 10 | 100 | 500 | 2,000 | 6,000 |
| **ARR (Trust)** | $5K | $60K | $300K | $1.2M | $3.6M |
| **GMV (Payments)** | $0 | $100K | $2M | $20M | $100M |
| **ARR (Payments)** | $0 | $2K | $40K | $300K | $1M |
| **Total ARR** | $5K | $62K | $340K | $1.5M | $4.6M |
| **Burn/mo** | $1K | $3K | $10K | $30K | $80K |
| **Team Size** | 1 | 2 | 5 | 12 | 25 |
| **Runway Left** | $90K | $60K | Self-sus | — | — |

### Scenario B: Moderate (Seed Funded)

| Metric | Year 1 | Year 2 | Year 3 | Year 4 | Year 5 |
|--------|--------|--------|--------|--------|--------|
| **Users (free)** | 500 | 5,000 | 25,000 | 100,000 | 300,000 |
| **Users (paid)** | 20 | 500 | 2,500 | 10,000 | 30,000 |
| **ARR (Trust)** | $12K | $300K | $1.5M | $6M | $18M |
| **GMV (Payments)** | $0 | $1M | $20M | $200M | $1B |
| **ARR (Payments)** | $0 | $20K | $400K | $3M | $10M |
| **Total ARR** | $12K | $320K | $1.9M | $9M | $28M |
| **Burn/mo** | $5K | $30K | $100K | $300K | $800K |
| **Team Size** | 1 | 5 | 15 | 40 | 100 |
| **Funding** | $100K | $2M seed | $10M A | $30M B | $100M C |

### Scenario C: Aggressive (If Everything Works)

| Metric | Year 1 | Year 2 | Year 3 | Year 4 | Year 5 |
|--------|--------|--------|--------|--------|--------|
| **Users (free)** | 1,000 | 20,000 | 200,000 | 1M | 5M |
| **Users (paid)** | 50 | 2,000 | 20,000 | 100,000 | 500,000 |
| **ARR (Trust)** | $30K | $1.2M | $12M | $60M | $300M |
| **GMV (Payments)** | $0 | $10M | $200M | $2B | $20B |
| **ARR (Payments)** | $0 | $150K | $3M | $30M | $200M |
| **Total ARR** | $30K | $1.35M | $15M | $90M | $500M |
| **Burn/mo** | $10K | $100K | $500K | $2M | $5M |
| **Team Size** | 2 | 15 | 50 | 150 | 400 |
| **Funding** | $500K | $5M | $30M | $100M | $300M |

---

## 4. UNIT ECONOMICS

### Trust Layer SaaS

| Metric | Value | Notes |
|--------|-------|-------|
| **ARPU (Pro)** | $49/mo ($588/yr) | Average |
| **ARPU (Blend)** | $80/mo | With enterprise mix |
| **CAC** | $50-100 | Content + developer marketing |
| **LTV (24mo)** | $1,920 | At 80% retention |
| **LTV/CAC** | 19-38x | Excellent |
| **Gross Margin** | 85%+ | Software margins |
| **Payback** | <1 month | Fast |

### Payment Network (Year 2+)

| Metric | Value | Notes |
|--------|-------|-------|
| **Avg Transaction** | $0.10 | Micropayments |
| **Take Rate** | 1-2% | Competitive |
| **Revenue/Tx** | $0.001-0.002 | |
| **Tx to $1 Revenue** | 500-1000 | Need volume |
| **Gross Margin** | 50-70% | After rail costs |

### Blended Economics (Year 3+)

| Metric | Value |
|--------|-------|
| **Revenue Mix** | 60% Trust / 40% Payments |
| **Blended Gross Margin** | 75% |
| **Net Revenue Retention** | 120%+ |
| **Rule of 40** | 80%+ (growth + margin) |

---

## 5. FUNDING SCENARIOS

### Path A: Bootstrap (Your $100K)

```
Year 1: $100K personal → 12-24 months runway at $5K/mo
Year 2: If ARR > $100K → Self-sustaining
Year 3: If ARR > $500K → Consider growth funding
```

**Pros**: Full ownership, no dilution
**Cons**: Slower growth, risk of being outcompeted

### Path B: Angel/Pre-Seed ($250K-500K)

```
Timeline: Month 6-9 (after MVP + traction)
Valuation: $2-3M pre-money
Dilution: 15-20%
Use: Hire 1-2 engineers, marketing
```

**Best For**: Accelerating after PMF signs

### Path C: Seed Round ($1-2M)

```
Timeline: Month 12-18 (after $50K+ MRR)
Valuation: $8-12M pre-money
Dilution: 15-20%
Use: Team of 5-8, growth marketing
```

**Best For**: Scaling proven model

### Recommended Path

```
Month 0-6:   Bootstrap ($100K personal)
Month 6-12:  If PMF → Angel/Pre-Seed ($300K at $3M)
Month 12-24: If growing → Seed ($1.5M at $10M)
Month 24-36: If winning → Series A ($8M at $40M)
```

**Your ownership after Series A**: ~45-50%

---

## 6. PATH TO TRILLION (Long-Term Vision)

### Valuation Milestones

| Stage | Revenue | Multiple | Valuation |
|-------|---------|----------|-----------|
| Seed | $100K ARR | 50x | $5M |
| Series A | $1M ARR | 40x | $40M |
| Series B | $10M ARR | 30x | $300M |
| Series C | $50M ARR | 25x | $1.25B |
| Pre-IPO | $200M ARR | 20x | $4B |
| IPO | $500M ARR | 15x | $7.5B |
| Growth | $2B ARR | 10x | $20B |
| Maturity | $10B ARR | 8x | $80B |
| Dominance | $50B ARR | 6x | $300B |
| Trillion | $150B ARR | 7x | $1T |

### What $150B ARR Means
- 3% of $5T agentic commerce market
- Or 15% of $1T agent payment flows
- Comparable to Visa/Mastercard revenue

### Timeline to Trillion (Aggressive but Possible)

| Year | Revenue | Valuation |
|------|---------|-----------|
| 2025 | $50K | $3M |
| 2027 | $5M | $50M |
| 2030 | $100M | $2B |
| 2035 | $2B | $30B |
| 2040 | $20B | $200B |
| 2045 | $100B | $800B |
| 2050 | $150B+ | $1T+ |

**Likelihood**: <1% — but possible if:
1. Agent economy explodes as predicted
2. Agora becomes the standard
3. Perfect execution over 25 years
4. No major disruptions

---

## 7. BURN & RUNWAY ANALYSIS

### Current Situation

| Resource | Amount |
|----------|--------|
| Personal Capital | $100,000 |
| Monthly Burn (MVP) | $500-1,000 |
| Runway (conservative) | 100 months |
| Runway (realistic) | 20-40 months |

### Burn Breakdown (Year 1)

| Category | Month 1-3 | Month 4-6 | Month 7-12 |
|----------|-----------|-----------|------------|
| Hosting | $50 | $100 | $200 |
| Tools/SaaS | $50 | $100 | $150 |
| Legal | $200 (one-time) | $50 | $50 |
| Marketing | $50 | $200 | $500 |
| Misc | $100 | $100 | $100 |
| **Total** | **$450** | **$550** | **$1,000** |
| **Cumulative** | $1,350 | $3,000 | $9,000 |

**Year 1 Total Burn**: ~$12,000
**Remaining Capital**: ~$88,000

### Break-Even Analysis

| Scenario | Monthly Revenue Needed | Customers (Pro) | Timeline |
|----------|----------------------|-----------------|----------|
| $1K burn | $1,000 | 20 Pro | Month 9-12 |
| $3K burn | $3,000 | 60 Pro | Month 12-18 |
| $5K burn | $5,000 | 100 Pro | Month 18-24 |

---

## 8. KEY FINANCIAL RISKS

| Risk | Impact | Mitigation |
|------|--------|------------|
| No paying customers | Death | Validate before building |
| Burn too fast | Shorter runway | Stay extremely lean |
| Pricing wrong | Low revenue | Test, iterate, upsell |
| Competition undercuts | Margin pressure | Differentiate on trust |
| Market slower than expected | Lower growth | Extend runway, patience |

---

## 9. FINANCIAL RECOMMENDATIONS

### Immediate (Month 1-3)
1. **Minimize burn**: Use free tiers, personal laptop
2. **No legal entity yet**: Operate as sole prop until revenue
3. **Track every dollar**: Simple spreadsheet

### Short-Term (Month 3-12)
1. **Form Wyoming LLC**: When first revenue comes
2. **Keep burn under $1K/mo**: Until $5K+ MRR
3. **Reinvest all revenue**: No salary

### Medium-Term (Month 12-24)
1. **Consider angel funding**: If PMF clear
2. **Pay yourself**: Minimal ($2-3K/mo)
3. **Build safety buffer**: 12 months runway

### Long-Term (Year 2+)
1. **Standard fundraising path**: If scaling
2. **Or bootstrap to profitability**: If lifestyle
3. **Plan for co-founder split**: When hiring #1
