# AGORA PROJECT CONTEXT

## Для использования в других AI-чатах

Скопируйте этот документ в начало нового чата, чтобы AI понимал контекст проекта.

---

## 🎯 ЧТО ТАКОЕ AGORA

**Agora** — это **Trusted AI Agent Marketplace** — безопасный маркетплейс для монетизации AI-агентов, MCP-сервисов и автоматизаций.

Два ключевых компонента:

1. **Trust Layer** — криптографически верифицируемый Trust Score (ZK-proofs) для AI-агентов
2. **Marketplace** — платформа где создатели могут листить и монетизировать своих AI-агентов, MCP-серверы, автоматизации

Когда AI-агент хочет купить услугу — Agora гарантирует trust + обеспечивает payment + discovery.

**Аналогия**: App Store для AI-агентов с enterprise-grade безопасностью

---

## 🏗️ ТЕКУЩИЙ СТАТУС

### MVP ЗАВЕРШЁН (Январь 2026)

| Компонент | Статус | Описание |
|-----------|--------|----------|
| Core Library (Rust) | ✅ 100% | Алгоритм доверия, Merkle trees, ZK типы |
| REST API (Actix) | ✅ 100% | 8 эндпоинтов, auth, rate limiting |
| ZK Circuits (Circom) | ✅ 100% | Proof of trust без раскрытия данных |
| TypeScript SDK | ✅ 100% | Async клиент для Node.js |
| Python SDK | ✅ 100% | Async клиент для Python |
| Protocol Integrations | ✅ 100% | A2A, AP2, x402 hooks |
| Docker/K8s Deployment | ✅ 100% | Production-ready configs |

**Код**: ~58 файлов, 170+ юнит-тестов

---

## 🚀 КОНЕЧНАЯ ЦЕЛЬ

### Компания стоимостью $1B+ (2028-2030)

**Thesis**: К 2028 году рынок AI-агентов достигнет $50B+. Создателям нужна платформа для монетизации, а покупателям — доверие. Agora — безопасный маркетплейс с trust layer.

**Revenue Model (multi-stream)**:

- Marketplace commission: 5-15% от транзакций
- Trust API calls: $0.001/call
- Premium listings: $99-499/mo
- Enterprise: $50K-500K/year
- ZK proofs: $0.01/proof

**Competitive Moat** (vs Zauth — прямой конкурент):

1. **Marketplace lock-in** — двусторонний network effect
2. **ZK proofs** — криптографические гарантии (Zauth не имеет)
3. **Multi-protocol**: MCP + A2A + AP2 + x402 (Zauth: только x402)
4. **Performance**: <10ms vs 500-1100ms у Zauth
5. **SaaS model** — предсказуемая выручка vs спекулятивный токен

---

## 📂 СТРУКТУРА ПРОЕКТА

```
agora/
├── packages/
│   ├── core/           # Rust: trust algorithm, Merkle, ZK
│   ├── api/            # Rust: REST server (Actix-web)
│   ├── sdk-typescript/ # TypeScript SDK
│   └── sdk-python/     # Python SDK
├── circuits/           # Circom ZK circuits
└── deploy/             # Docker, Kubernetes
```

---

## 🔧 ТЕХНОЛОГИИ

- **Backend**: Rust (безопасность, производительность)
- **Database**: PostgreSQL + TimescaleDB (time-series)
- **Crypto**: SHA-256, Poseidon, Groth16 ZK-SNARKs
- **Protocols**: MCP, A2A, AP2, x402

---

## 📋 ЧТО ДЕЛАТЬ ДАЛЬШЕ

1. **Сейчас**: Marketplace UI прототип + MCP registry
2. **Март 2026**: 5 MCP-серверов залистить + trust scores
3. **Q2 2026**: Marketplace public beta + investor deck v2
4. **Q3 2026**: Seed раунд $3-7M
5. **2027**: Series A, 10K+ listed products, $200K+ MRR
6. **2028+**: Market leadership, $36M+ ARR

---

## 🧠 КОНТЕКСТ ДЛЯ AI-ПОМОЩНИКА

При работе над Agora помни:

- Мы строим ПЛАТФОРМУ (Marketplace + Trust Infrastructure)
- Качество кода enterprise-grade (строгая типизация, тесты)
- Privacy-first (ZK proofs, минимум данных)
- Interoperability (MCP + A2A + AP2 + x402)
- **Главный конкурент**: Zauth (zauthx402.com) — см. docs/strategic/
- Целевая аудитория: создатели и покупатели AI-агентов/автоматизаций
