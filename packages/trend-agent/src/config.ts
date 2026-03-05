import { config } from 'dotenv';
config();

export const CONFIG = {
    GITHUB_TOKEN: process.env.GITHUB_TOKEN || '',
    GEMINI_API_KEY: process.env.GEMINI_API_KEY || '',

    // Search queries for MCP/AI ecosystem
    GITHUB_QUERIES: [
        'mcp server',
        'mcp-server',
        'model context protocol',
        'ai agent framework',
        'a2a protocol agent',
    ],

    HN_QUERIES: [
        'MCP',
        'Model Context Protocol',
        'AI agent',
        'AI marketplace',
    ],

    NPM_PACKAGES: [
        '@modelcontextprotocol/sdk',
        '@anthropic-ai/sdk',
        'openai',
        '@google/generative-ai',
        'langchain',
        'llamaindex',
        'autogen',
    ],

    // Competitor GitHub repos to track
    COMPETITOR_REPOS: [
        { name: 'Zauth', repo: 'AgoraAIOrg/Zauth' },
        { name: 'MCP Specification', repo: 'modelcontextprotocol/specification' },
        { name: 'MCP Servers', repo: 'modelcontextprotocol/servers' },
        { name: 'A2A Protocol', repo: 'google/A2A' },
        { name: 'LangChain', repo: 'langchain-ai/langchainjs' },
        { name: 'CrewAI', repo: 'crewAIInc/crewAI' },
        { name: 'AutoGen', repo: 'microsoft/autogen' },
    ],

    DATA_DIR: './data',
    REPORTS_DIR: './reports',
};

export function validateConfig(): boolean {
    const missing: string[] = [];
    if (!CONFIG.GITHUB_TOKEN) missing.push('GITHUB_TOKEN');
    if (!CONFIG.GEMINI_API_KEY) missing.push('GEMINI_API_KEY');

    if (missing.length > 0) {
        console.error(`❌ Missing API keys: ${missing.join(', ')}`);
        console.error('   Copy .env.example to .env and fill in your keys');
        return false;
    }
    return true;
}
