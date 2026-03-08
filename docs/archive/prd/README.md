# Agora PRD Index

All 8 service PRDs with Kano analysis.

| # | Service | Type | Revenue | PRD |
|---|---------|------|---------|-----|
| 1 | [agora-core](01-core.md) | Rust lib | Internal | ✅ |
| 2 | [agora-api](02-api.md) | Actix-Web | Pay-per-use | ✅ |
| 3 | [sdk-typescript](03-sdk-ts.md) | npm | Free | ✅ |
| 4 | [sdk-python](04-sdk-python.md) | PyPI | Free | ✅ |
| 5 | [marketplace](05-marketplace.md) | React | Premium/Ads | ✅ |
| 6 | [a2a-integration](06-a2a.md) | Rust module | Per-verify | ✅ |
| 7 | [ap2-integration](07-ap2.md) | Rust module | 0.5% | ✅ |
| 8 | [x402-integration](08-x402.md) | Rust module | 0.3% | ✅ |

---

## Kano Summary

| Category | Total Features | Done | TODO |
|----------|----------------|------|------|
| Must-Have (P0) | ~35 | ~30 | ~5 |
| Performance (P1) | ~25 | ~5 | ~20 |
| Delighters (P2) | ~20 | 0 | ~20 |

---

## Revenue Streams

| Stream | Source |
|--------|--------|
| API Subscriptions | agora-api |
| Transaction % | ap2, x402 |
| Premium Listings | marketplace |
| Verification Fees | a2a |

---

## Implementation Priority

1. **agora-core** → Foundation (✅ done)
2. **agora-api** → Revenue driver (✅ mostly done)
3. **marketplace** → User acquisition (⚠️ needs work)
4. **SDKs** → Developer experience (⚠️ needs discovery)
5. **Integrations** → Revenue expansion (✅ basic done)
