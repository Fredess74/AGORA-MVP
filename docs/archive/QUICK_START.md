# AGORA QUICK START

## Для быстрого запуска нового AI-помощника

---

## ⚡ TL;DR

**Agora** = Trust Score для AI агентов

- **Проблема**: AI агенты не могут доверять друг другу при транзакциях
- **Решение**: Криптографически верифицируемый рейтинг доверия  
- **Бизнес**: $0.001 за проверку × миллиарды проверок = 🦄

---

## 📁 Важные файлы

```
docs/
├── PROJECT_CONTEXT.md  ← Полный контекст проекта
├── ROADMAP.md         ← План до 2030 (цель $1B)
├── PROGRESS.md        ← Что уже сделано
└── QUICK_START.md     ← Этот файл

packages/
├── core/              ← Rust библиотека (алгоритмы)
├── api/               ← REST API сервер
├── sdk-typescript/    ← TypeScript клиент
└── sdk-python/        ← Python клиент

circuits/              ← ZK proof схемы (Circom)
deploy/                ← Docker, Kubernetes
```

---

## 🔧 Технологии

| Компонент | Технология |
|-----------|------------|
| Backend | Rust + Actix-web |
| Database | PostgreSQL + TimescaleDB |
| ZK Proofs | Circom + Groth16 |
| SDKs | TypeScript, Python |

---

## 🎯 Текущие приоритеты

1. Запустить демо для инвесторов
2. Найти 5 пилотных партнёров
3. Подготовить Seed pitch

---

## 💬 Как использовать этот контекст

Скопируй `PROJECT_CONTEXT.md` в начало чата с любым AI (Claude, GPT, Gemini) чтобы он понимал проект.

---

## 🚀 Запуск локально

```bash
cd deploy/docker
docker-compose up -d
# API: http://localhost:8080
```

---

## 📫 Ключевые термины

- **Trust Score**: Рейтинг 0-1 (или 0-10000)
- **DID**: Decentralized Identifier (`did:agora:agent:xxx`)
- **Merkle Root**: Криптографический коммит истории
- **ZK Proof**: Доказательство без раскрытия данных
- **A2A/AP2**: Протоколы Google для AI агентов
- **x402**: HTTP-native платежи (Coinbase)
