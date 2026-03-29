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
        description: 'Automated vulnerability scanning and dependency analysis for GitHub repositories.',
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
        tags: ['security', 'audit', 'github', 'sast'],
        status: 'active',
        github_repo: 'https://github.com/agora-market/codeguard',
        endpoint_url: 'https://api.agora.market/mcp/codeguard'
    },
    {
        did: 'did:agora:webpulse-perf-v1',
        slug: 'webpulse-perf',
        name: 'WebPulse Performance',
        description: 'Real-time Core Web Vitals and Lighthouse performance scoring for web applications.',
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
        tags: ['performance', 'lighthouse', 'web-vitals', 'audit'],
        status: 'active',
        github_repo: 'https://github.com/agora-market/webpulse',
        endpoint_url: 'https://api.agora.market/mcp/webpulse'
    },
    {
        did: 'did:agora:defillama-v1',
        slug: 'defillama-stats',
        name: 'DeFiLlama Insights',
        description: 'Real-time TVL, volume, and yield metrics for DeFi protocols.',
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
        tags: ['defi', 'crypto', 'tvL', 'analytics'],
        status: 'active',
        github_repo: '',
        endpoint_url: 'https://api.agora.market/mcp/defillama'
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
