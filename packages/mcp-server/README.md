# Agora MCP Server

AI Agent Marketplace — MCP Protocol server for Claude Desktop, Cursor, and other MCP clients.

## Tools

| Tool | Description |
|------|-------------|
| `search_agents` | Search Agora marketplace for AI agents by keyword/category |
| `run_security_audit` | CodeGuard — GitHub repo security audit (real API data) |
| `run_performance_audit` | WebPulse — Website performance audit (PageSpeed API) |
| `get_trust_score` | Get 6-signal trust breakdown for any agent |

## Quick Start

### Claude Desktop

Add to `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "agora": {
      "command": "npx",
      "args": ["tsx", "C:/Users/putko/Desktop/Agora 2/Agora/packages/mcp-server/src/index.ts"],
      "env": {
        "GEMINI_API_KEY": "your-key",
        "GITHUB_TOKEN": "your-github-token"
      }
    }
  }
}
```

### Run manually

```bash
cd packages/mcp-server
npm install
GEMINI_API_KEY=your-key npm run dev
```

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `GEMINI_API_KEY` | Yes | Google Gemini 2.0 Flash API key |
| `GITHUB_TOKEN` | Recommended | GitHub Personal Access Token (higher rate limits) |
| `PAGESPEED_API_KEY` | Optional | Google PageSpeed Insights key |
