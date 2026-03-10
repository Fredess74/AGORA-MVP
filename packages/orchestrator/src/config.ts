/* ═══════════════════════════════════════════════════════════
   Agora Orchestrator — Configuration
   ═══════════════════════════════════════════════════════════ */

import dotenv from 'dotenv';
dotenv.config();

export const config = {
    port: parseInt(process.env.PORT || '3001', 10),
    geminiApiKey: process.env.GEMINI_API_KEY || '',
    githubToken: process.env.GITHUB_TOKEN || '',
    pageSpeedApiKey: process.env.PAGESPEED_API_KEY || '',
    supabaseUrl: process.env.SUPABASE_URL || 'https://fnwrqgmaqempmcvcozqa.supabase.co',
    supabaseServiceKey: process.env.SUPABASE_SERVICE_KEY || '',
    supabaseAnonKey: process.env.SUPABASE_ANON_KEY || '',
};

export function validateConfig(): boolean {
    const errors: string[] = [];
    if (!config.geminiApiKey) errors.push('GEMINI_API_KEY is required');
    if (!config.githubToken) errors.push('GITHUB_TOKEN is required');
    if (errors.length > 0) {
        console.error('Configuration errors:');
        errors.forEach(e => console.error(`  ❌ ${e}`));
        return false;
    }
    console.log('  ✅ Configuration validated');
    return true;
}
