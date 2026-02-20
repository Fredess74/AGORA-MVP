# Agora — Legal Structure & Entity Plan

**Version**: 0.1
**Date**: 2025-12-23
**Status**: Planning

---

## 1. EXECUTIVE SUMMARY

### Recommended Path

| Phase | Entity | Jurisdiction | Purpose |
|-------|--------|--------------|---------|
| **MVP (Month 0-6)** | Sole Proprietor | N/A | Test, no revenue yet |
| **Revenue (Month 6-12)** | Wyoming LLC | USA | First revenue, crypto-friendly |
| **Growth (Month 12-24)** | + Singapore Pte. Ltd. | Singapore | International ops, banking |
| **Scale (24+ mo)** | Delaware C-Corp | USA | If raising US VC |

### Why This Path
1. **Minimal upfront costs** — don't incorporate until revenue
2. **Wyoming LLC** — most crypto-friendly US state, cheap, fast
3. **Singapore later** — international credibility, easier banking
4. **Delaware C-Corp** — only if/when raising institutional VC

---

## 2. PHASE 1: SOLE PROPRIETOR (Month 0-6)

### What It Means
- No formal company
- You = business
- Personal liability (low risk for software)
- Report income on personal taxes

### When to Use
- Building MVP
- No revenue or customers yet
- Testing product-market fit

### How to Start
1. Use personal bank account
2. Track all expenses in spreadsheet
3. Keep receipts for tax deductions
4. Can accept small payments via personal PayPal/Venmo

### Limitations
- Can't raise investment
- Limited credibility
- Personal liability
- Tax inefficient if income grows

### Transition Trigger
**Form LLC when**: First $1,000 in revenue OR signing first enterprise customer

---

## 3. PHASE 2: WYOMING LLC (Month 6-12)

### Why Wyoming

| Factor | Wyoming | Delaware | California |
|--------|---------|----------|------------|
| **Crypto Laws** | 🟢 Most friendly | 🟡 Neutral | 🔴 Hostile |
| **Annual Fee** | $60/year | $300/year | $800+ |
| **Privacy** | 🟢 No public record | 🟡 Partial | 🔴 Full disclosure |
| **DAO Support** | ✅ Legal DAO LLC | ❌ | ❌ |
| **State Income Tax** | ❌ None | ❌ None | ✅ High |
| **Startup Reputation** | 🟡 Medium | 🟢 Gold standard | 🟡 Medium |

### Formation Process

1. **Choose Name**: "Agora Trust LLC" or "Agora Labs LLC"
2. **Registered Agent**: Wyoming-based (Northwest, $125/year)
3. **File Articles of Organization**: ~$100
4. **Operating Agreement**: Template + customize
5. **EIN (Tax ID)**: Free from IRS
6. **Bank Account**: Mercury, Relay, or Brex

### Total Setup Cost: ~$300

### Timeline: 1-2 weeks

### Documents Needed
- [x] Articles of Organization
- [x] Operating Agreement (single-member)
- [x] EIN Application (IRS Form SS-4)
- [x] Bank account application

### Banking Options for Crypto-Adjacent Startups

| Bank | Crypto Friendly | Monthly Fee | Notes |
|------|-----------------|-------------|-------|
| **Mercury** | 🟢 Yes | $0 | Best for startups |
| **Relay** | 🟢 Yes | $0 | Good alternative |
| **Brex** | 🟡 Somewhat | $0 | Good for credit |
| **Traditional banks** | 🔴 No | Varies | Will likely reject |

**Recommendation**: Mercury first, Relay as backup

---

## 4. PHASE 3: SINGAPORE PTE. LTD. (Month 12-24)

### Why Singapore (Later)

| Factor | Benefit |
|--------|---------|
| **International Credibility** | Neutral, respected jurisdiction |
| **Banking** | Easy, crypto-friendly |
| **No Russian Stigma** | Cleaner for US/EU partners |
| **Tax** | 17% corporate, exemptions available |
| **Hub** | Access to Asia market |
| **MAS** | Clear fintech regulations |

### When to Add Singapore
- When doing international business
- When US banking becomes problematic
- When enterprise customers require it
- Before Series A (for clean structure)

### Formation Cost: ~$3,000-5,000
- Incorporation: $1,500
- Nominee director (year 1): $1,500
- Registered address: $500
- Annual compliance: $1,000

### Structure with Singapore
```
Vladimir Putkov (100% owner)
        │
        ▼
Wyoming LLC (US Ops)
        │
        ▼
Singapore Pte. Ltd. (International Ops)
```

---

## 5. PHASE 4: DELAWARE C-CORP (If Raising VC)

### Why Delaware for C-Corp
- **Standard** for US VCs
- **Predictable** corporate law
- **Familiar** to investors
- **Convertible notes** work cleanly

### When to Convert
- Raising institutional seed ($1M+)
- VCs require it
- Preparing for exit

### Structure Post-Conversion
```
Agora Inc. (Delaware C-Corp)
   ├── Vladimir Putkov Shares: 80-85%
   ├── Investor Shares: 15-20%
   └── Option Pool: 10-15%
        │
        ├── Wyoming LLC (US Ops) — 100% subsidiary
        └── Singapore Pte. Ltd. (Intl) — 100% subsidiary
```

### Conversion Cost: $5,000-15,000 (with lawyer)

---

## 6. REGULATORY CONSIDERATIONS

### Non-Custodial = Key Strategy

| Activity | If Custodial | If Non-Custodial |
|----------|--------------|------------------|
| Hold user funds | 🔴 Money Transmitter License | 🟢 None |
| Process payments | 🔴 State licenses | 🟢 Just connect wallets |
| Crypto | 🔴 SEC/CFTC questions | 🟢 Cleaner |
| Liability | 🔴 High | 🟢 Low |

**Rule**: NEVER hold user funds. Non-custodial = regulatory arbitrage.

### Trust Layer (Phase 1) — Minimal Regulation
- Software service, not financial
- No payments processed
- No money transmission
- Standard SaaS terms

### Payment Layer (Phase 2) — More Careful
- Still non-custodial
- User-to-user payments via smart contracts
- Agora only provides discovery + trust
- Consult lawyer before launching

### International Considerations
- EU: MiCA compliance if serving EU
- UK: FCA authorization potentially
- Singapore: MAS licensing if payments

---

## 7. INTELLECTUAL PROPERTY

### What to Protect

| Asset | Protection | Priority | Cost |
|-------|------------|----------|------|
| **Brand "Agora"** | Trademark | P1 | $350+ |
| **Trust Algorithm** | Trade Secret | P0 | $0 |
| **SDK Code** | Copyright (auto) | Auto | $0 |
| **Protocol Spec** | Open source? | Decision | $0 |
| **Domain** | Buy it | P0 | $10-50 |

### Trademark Strategy
1. **Search first**: Is "Agora" available?
2. **Classes**: Class 9 (software), Class 42 (SaaS)
3. **Jurisdiction**: USA first, then international
4. **Cost**: $350-500 per class (USPTO)
5. **Timeline**: 8-12 months

**Note**: "Agora" is a common word — may have conflicts. Consider:
- "Agora Trust"
- "AgoraTrust"
- "Agora Protocol"

### Trade Secrets
Keep algorithms and business logic private:
- Trust score formula
- Anti-gaming measures
- Customer data

---

## 8. CONTRACTS NEEDED

### For MVP Launch

| Contract | Purpose | Template Source |
|----------|---------|-----------------|
| **Terms of Service** | User agreement | Termly, lawyer |
| **Privacy Policy** | Data handling | Termly, lawyer |
| **API Terms** | Developer agreement | Stripe ToS as model |
| **Cookie Policy** | Compliance | Termly |

### For Growth

| Contract | Purpose | When Needed |
|----------|---------|-------------|
| **NDA** | Partner discussions | When talking to partners |
| **Enterprise Agreement** | Large customers | First enterprise deal |
| **Advisor Agreement** | Advisors | When adding advisors |
| **Contractor Agreement** | Freelancers | When hiring help |

### Cost: $500-2,000 (templates + review)

---

## 9. TAX CONSIDERATIONS

### Year 1 (Sole Prop/LLC)
- **Federal**: Income taxed at personal rate
- **State**: No Wyoming income tax
- **Self-Employment**: 15.3% on net income
- **Deductions**: Home office, equipment, software, travel

### Estimated Taxes
If net income = $50K:
- Federal: ~$7,000 (14%)
- Self-employment: ~$7,650 (15.3%)
- State: $0 (Wyoming)
- **Total**: ~$14,650 (29%)

### Tax Optimization Strategies
1. **S-Corp Election**: When net > $40K, save on self-employment
2. **Qualified Business Income (QBI)**: 20% deduction possible
3. **Retirement**: Solo 401(k) — $23K+ deductible
4. **Health Insurance**: Deductible for self-employed

### International Tax (If Singapore)
- Singapore: 17% corporate (exemptions for startups)
- US: GILTI rules may apply
- Consult international tax lawyer if adding entities

---

## 10. COMPLIANCE CHECKLIST

### Before Launch
- [ ] Form entity (LLC)
- [ ] Get EIN
- [ ] Open business bank account
- [ ] Terms of Service drafted
- [ ] Privacy Policy drafted
- [ ] Domain secured
- [ ] Trademark search completed

### Quarterly
- [ ] Bookkeeping up to date
- [ ] Estimated taxes paid
- [ ] Contractor 1099s prepared (if any)

### Annually
- [ ] Wyoming annual report ($60)
- [ ] Federal tax return
- [ ] Review ToS/Privacy Policy

---

## 11. IMMEDIATE ACTION ITEMS

### Week 1
1. [x] Research complete (this document)
2. [ ] Reserved domain: agoratrust.io or agora.network
3. [ ] Trademark search on "Agora Trust"

### Month 1-3
4. [ ] Continue as sole prop during MVP
5. [ ] Track all expenses

### Month 4-6 (If Revenue)
6. [ ] Form Wyoming LLC
7. [ ] Get EIN
8. [ ] Open Mercury bank account
9. [ ] Finalize Terms of Service
10. [ ] Finalize Privacy Policy

---

## 12. VISA CONSIDERATIONS (FOR VLADIMIR)

### Current: F-1 Student

### Path Forward

| Visa | Requirement | Timeline | Likelihood |
|------|-------------|----------|------------|
| **OPT** | Graduate, apply | 1-2 months post-grad | 🟢 High |
| **STEM OPT** | STEM degree | +24 months | 🟡 If degree qualifies |
| **O-1** | Extraordinary ability | Need achievements | 🔴 Hard early |
| **EB-1** | Green card | Need significant success | 🔴 Long-term |

### Strategy
1. **Use OPT**: Work on Agora during OPT
2. **Build achievements**: Press, revenue, funding
3. **Apply O-1**: When you have a track record
4. **Alternative**: Run company from abroad if visa issues

### Note: Consult immigration lawyer for current rules

---

## 13. APPENDIX: SAMPLE OPERATING AGREEMENT OUTLINE

```markdown
# Operating Agreement of Agora Trust LLC

## Article I: Organization
- Name: Agora Trust LLC
- State: Wyoming
- Purpose: Software development and services

## Article II: Members
- Vladimir Putkov: 100% ownership

## Article III: Management
- Member-managed (single member)

## Article IV: Capital Contributions
- Initial: $[amount]

## Article V: Allocations and Distributions
- All profits/losses to member
- Distributions at member discretion

## Article VI: Dissolution
- At member's decision or legal requirement

## Article VII: Miscellaneous
- Amendments: Written consent
- Governing law: Wyoming
```

**Note**: Use template from Northwest, LegalZoom, or lawyer.
