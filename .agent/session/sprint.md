# Sprint — 2026-03-30 (Supabase Focus)

## CTO Decision Logic

**Q1: "Если инвестор нажмёт кнопку демо ЗАВТРА — это помешает?"**
- Marketplace работает на seed data даже без Supabase (3s timeout fallback) ✅
- НО: listings в Supabase содержат только 3 agent'а, а seed имеет 8 — рассинхрон
- SearchPage работает на seed data и НЕ зависит от Supabase ✅

**Q2: "Что улучшит WOW-эффект?"**
- Синхронизация seed data → Supabase: Trends page показывает LIVE данные из Supabase
- Если listings в Supabase = 3, а на UI = 8, инвестор увидит рассинхрон на /trends

**Вердикт**: 3 задачи на сессию:

---

### Задача 1: Seed новые listings в Supabase (Skills + MCP)
**Усилие:** S
**Влияние на demo:** HIGH — Trends page и SearchPage должны видеть одни данные
**Файлы:** SQL в Supabase SQL Editor
**AC:** `listings` таблица содержит 8 записей (3 agent + 2 skill + 2 MCP + 1 exist GitHub MCP)
**Risk:** Column mismatch между seed data и реальной schema

### Задача 2: Добавить `skill` категорию в `categories` таблицу
**Усилие:** XS
**Влияние на demo:** MEDIUM — marketplace фильтрация по Skills должна работать
**Файлы:** SQL в Supabase
**AC:** categories содержит 4 записи

### Задача 3: Создать `query_results` таблицу для shareable snapshots
**Усилие:** M
**Влияние на demo:** HIGH — позволит перенести shareable URLs из localStorage в Supabase
**Файлы:** SQL migration + update SearchPage.tsx to use Supabase
**AC:** `/search?q=...` URLs работают через Supabase, не localStorage
**Risk:** RLS policy нужна для public read
