import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL || 'https://fnwrqgmaqempmcvcozqa.supabase.co';
// Use service key for writing
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_ANON_KEY || 'sb_publishable_BtBZ62BMM3i2QP1rVj_H7w_5fRZKDSC';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const agents = [
    {
        did: 'did:agora:codeguard-security-v1',
        slug: 'codeguard-security',
        name: 'CodeGuard Security',
        description: 'Automated vulnerability scanning and dependency analysis for GitHub repositories. Detects CVEs, outdated packages, hardcoded secrets, and insecure configurations using real GitHub API data. Provides actionable remediation roadmaps.',
        type: 'mcp_server',
        category: 'security',
        author_name: 'Agora Verified',
        pricing_model: 'free',
        price_per_call: 0,
        trust_score: 0.95,
        total_calls: 12500,
        total_users: 3400,
        avg_latency_ms: 1240,
        uptime: 99.99,
        tags: ['security', 'audit', 'github', 'sast', 'cve-detection'],
        status: 'active',
        github_repo: 'https://github.com/agora-market/codeguard',
        endpoint_url: 'https://api.agora.market/mcp/codeguard'
    },
    {
        did: 'did:agora:webpulse-perf-v1',
        slug: 'webpulse-perf',
        name: 'WebPulse Performance',
        description: 'Real-time Core Web Vitals and Lighthouse performance scoring for web applications. Measures LCP, FID, CLS, FCP, TTI on both mobile and desktop using Google PageSpeed Insights API.',
        type: 'mcp_server',
        category: 'performance',
        author_name: 'Agora Verified',
        pricing_model: 'per_call',
        price_per_call: 0.02,
        trust_score: 0.88,
        total_calls: 8400,
        total_users: 1200,
        avg_latency_ms: 3500,
        uptime: 99.95,
        tags: ['performance', 'lighthouse', 'web-vitals', 'audit', 'seo'],
        status: 'active',
        github_repo: 'https://github.com/agora-market/webpulse',
        endpoint_url: 'https://api.agora.market/mcp/webpulse'
    },
    {
        did: 'did:agora:defillama-v1',
        slug: 'defillama-stats',
        name: 'DeFiLlama Insights',
        description: 'Real-time TVL, volume, and yield metrics for DeFi protocols across 200+ chains. Track protocol health, compare yields, and monitor liquidity flows.',
        type: 'mcp_server',
        category: 'analytics',
        author_name: 'DeFi Analytics Inc.',
        pricing_model: 'subscription',
        price_per_call: 0,
        trust_score: 0.75,
        total_calls: 4200,
        total_users: 500,
        avg_latency_ms: 800,
        uptime: 99.50,
        tags: ['defi', 'crypto', 'tvl', 'analytics'],
        status: 'active',
        github_repo: '',
        endpoint_url: 'https://api.agora.market/mcp/defillama'
    },
    {
        did: 'did:agora:marketscope-v1',
        slug: 'marketscope-analytics',
        name: 'MarketScope Analytics',
        description: 'Cross-platform technology trend analysis using npm Registry, HackerNews Algolia, and GitHub Search APIs. Identifies emerging frameworks, rising packages, and developer sentiment shifts.',
        type: 'mcp_server',
        category: 'analytics',
        author_name: 'Agora Verified',
        pricing_model: 'free',
        price_per_call: 0,
        trust_score: 0.91,
        total_calls: 9800,
        total_users: 2100,
        avg_latency_ms: 2200,
        uptime: 99.97,
        tags: ['npm', 'trends', 'market-research', 'hackernews', 'github'],
        status: 'active',
        github_repo: 'https://github.com/agora-market/marketscope',
        endpoint_url: 'https://api.agora.market/mcp/marketscope'
    },
    {
        did: 'did:agora:compliance-checker-v1',
        slug: 'compliance-checker',
        name: 'EU AI Act Compliance Checker',
        description: 'Automated compliance assessment for AI systems against EU AI Act requirements (Articles 9-15). Generates risk classification, gap analysis, and documentation checklists.',
        type: 'mcp_server',
        category: 'security',
        author_name: 'RegTech Solutions',
        pricing_model: 'per_call',
        price_per_call: 0.10,
        trust_score: 0.82,
        total_calls: 3100,
        total_users: 420,
        avg_latency_ms: 4500,
        uptime: 99.80,
        tags: ['compliance', 'eu-ai-act', 'regulation', 'risk-assessment'],
        status: 'active',
        github_repo: '',
        endpoint_url: 'https://api.agora.market/mcp/compliance'
    },
    {
        did: 'did:agora:apihealth-v1',
        slug: 'apihealth-monitor',
        name: 'API Health Monitor',
        description: 'Real-time uptime monitoring and latency tracking for REST and GraphQL APIs. Provides SLA compliance reports, incident detection, and historical reliability metrics.',
        type: 'mcp_server',
        category: 'performance',
        author_name: 'UptimeForge',
        pricing_model: 'per_call',
        price_per_call: 0.01,
        trust_score: 0.86,
        total_calls: 15200,
        total_users: 1800,
        avg_latency_ms: 350,
        uptime: 99.99,
        tags: ['monitoring', 'uptime', 'api', 'latency', 'sla'],
        status: 'active',
        github_repo: 'https://github.com/uptimeforge/apihealth',
        endpoint_url: 'https://api.agora.market/mcp/apihealth'
    },
    {
        did: 'did:agora:docgen-v1',
        slug: 'docgen-ai',
        name: 'DocGen AI',
        description: 'Automatic API documentation generator. Reads OpenAPI specs, code comments, and type definitions to produce comprehensive, styled documentation with interactive examples.',
        type: 'mcp_server',
        category: 'general',
        author_name: 'DevTools Co.',
        pricing_model: 'free',
        price_per_call: 0,
        trust_score: 0.72,
        total_calls: 5600,
        total_users: 900,
        avg_latency_ms: 6200,
        uptime: 98.50,
        tags: ['documentation', 'openapi', 'code-generation', 'developer-tools'],
        status: 'active',
        github_repo: 'https://github.com/devtoolsco/docgen',
        endpoint_url: 'https://api.agora.market/mcp/docgen'
    },
    {
        did: 'did:agora:sentimentai-v1',
        slug: 'sentimentai',
        name: 'SentimentAI',
        description: 'Multi-language sentiment analysis for product reviews, social media, and customer feedback. Supports 12 languages with emotion classification and topic extraction.',
        type: 'mcp_server',
        category: 'analytics',
        author_name: 'NLP Works',
        pricing_model: 'per_call',
        price_per_call: 0.005,
        trust_score: 0.79,
        total_calls: 24000,
        total_users: 3200,
        avg_latency_ms: 180,
        uptime: 99.92,
        tags: ['nlp', 'sentiment', 'text-analysis', 'multilingual'],
        status: 'active',
        github_repo: '',
        endpoint_url: 'https://api.agora.market/mcp/sentimentai'
    }
];

async function seed() {
    console.log('Seeding initial verified agents to Supabase...');
    
    // Check if they exist to avoid duplicates
    const { data: existing } = await supabase.from('listings').select('did');
    const existingDids = new Set(existing?.map(e => e.did) || []);
    
    const newAgents = agents.filter(a => !existingDids.has(a.did));
    
    if (newAgents.length === 0) {
        console.log('Database already seeded. No new agents to add.');
        process.exit(0);
    }
    
    const { data, error } = await supabase.from('listings').insert(newAgents).select('name, did');
    
    if (error) {
        console.error('Failed to seed database:', error.message);
        process.exit(1);
    }
    
    console.log(`Successfully added ${data.length} seeded agents:`);
    console.log(data);
    process.exit(0);
}

seed().catch(err => {
    console.error('Seed error:', err);
    process.exit(1);
});
