# AGORA

**Trust Infrastructure для AI-агентов** — криптографически верифицируемый доверительный слой.

## Stack

| Layer | Tech | Location |
|-------|------|----------|
| Core | Rust | `packages/core/` |
| API | Actix-web | `packages/api/` |
| ZK Proofs | Circom | `circuits/` |
| SDKs | TS, Python | `packages/sdk-*` |

## Архитектура

```
Client → REST API → Trust Engine → PostgreSQL
                ↓
            ZK Proofs (Groth16)
```

## Текущий статус

✅ MVP завершён (Январь 2026)
🎯 Фокус: демо для инвесторов + пилоты

## Подробнее

- [PROJECT_CONTEXT.md](docs/PROJECT_CONTEXT.md) — полный контекст
- [PROGRESS.md](docs/PROGRESS.md) — текущий прогресс
- [ROADMAP.md](docs/ROADMAP.md) — планы развития

## Команды разработки

```
/dev-init     # Начать coding-сессию
/dev-fix      # Исправить баг
/dev-feature  # Добавить фичу
```
