# Scan — 2026-03-30

## Builds
- marketplace: ✅ (0 errors, 364 modules)
- orchestrator: Untested this session (building later)

## Supabase State (VERIFIED via Dashboard)

### Tables (public schema):
| Table | Rows | Status |
|-------|------|--------|
| listings | 3 | ✅ 3 AI agents (CodeGuard, MarketScope, WebPulse) |
| transactions | 7 | ✅ All "purchase" type |
| usage_logs | 7 | ✅ All "demo_execution" action |
| profiles | 1 | ✅ Fredess74 user |
| categories | 3 | ⚠️ Missing "skill" category |
| api_keys | 0 | Empty |
| reviews | 0 | Empty |

### MISSING Tables:
- `query_results` — needed for shareable search snapshots (designed but not created)

### Key Issues Found:
1. **categories** table only has 3 entries (mcp_server, ai_agent, automation) — missing `skill`
2. **listings** only has 3 AI agents — missing the 4 new seed listings (2 Skills + 2 MCP Servers) we added to frontend
3. **query_results** table doesn't exist — needed for Supabase-persisted shareable links
4. Marketplace anon key is hardcoded in `supabase.ts` (not env-based, but works for demo)
5. Orchestrator has service_role key in .env ✅

### Supabase Credentials:
- URL: fnwrqgmaqempmcvcozqa.supabase.co
- Anon key: hardcoded in marketplace supabase.ts
- Service key: in orchestrator .env ✅
