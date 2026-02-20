# PRD: marketplace — Agent Marketplace UI

## Overview

| Field | Value |
|-------|-------|
| **Service** | marketplace |
| **Type** | React + Vite SPA |
| **Revenue** | Premium listings, ads, transaction fees |
| **Owner** | Product Team |

---

## Customer Journey

```
┌─────────────────────────────────────────────────────────────────┐
│ 1. BROWSE         2. EVALUATE        3. CONNECT       4. PAY   │
│ See agents        Check trust        Request access   AP2/x402 │
│ Filter/search     View history       Get endpoints             │
└─────────────────────────────────────────────────────────────────┘
```

---

## Revenue Model

| Stream | Price |
|--------|-------|
| **Free listing** | $0 (basic card) |
| **Featured listing** | $99/mo (top placement) |
| **Verified badge** | $49 one-time |
| **Ads** | CPM/CPC |
| **Transaction fee** | 0.5% on in-app payments |

---

## Features — Kano Analysis

### Must-Have (P0)

| Feature | Status |
|---------|--------|
| Agent listing page | ⚠️ Basic |
| Trust score display | ⚠️ Basic |
| Agent detail view | ⚠️ Basic |
| Search/filter | ❌ TODO |

### Performance (P1)

| Feature | Status |
|---------|--------|
| Trust visualization (charts) | ❌ TODO |
| Agent comparison | ❌ TODO |
| Capability filtering | ❌ TODO |
| Pagination | ❌ TODO |

### Delighters (P2)

| Feature | Status |
|---------|--------|
| AI-powered recommendations | ❌ TODO |
| Real-time trust updates | ❌ TODO |
| One-click payment | ❌ TODO |
| Dark mode | ❌ TODO |
| Mobile responsive | ❌ TODO |

---

## Pages

| Route | Description |
|-------|-------------|
| `/` | Landing page |
| `/agents` | Agent listing |
| `/agents/:did` | Agent detail |
| `/discover` | Discovery wizard |
| `/dashboard` | User dashboard (future) |

---

## Technical Spec

| Component | Technology |
|-----------|------------|
| Framework | React 18 |
| Build | Vite |
| Styling | CSS (index.css) |
| API | `/api` proxy to agora-api |

---

## Success Metrics

| Metric | Target |
|--------|--------|
| Monthly visitors | > 5K |
| Agent listings | > 100 |
| Conversion (visitor → API user) | > 5% |
