/* ═══════════════════════════════════════════════════════════
   Supabase Client — Agora Marketplace
   ═══════════════════════════════════════════════════════════ */

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://fnwrqgmaqempmcvcozqa.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZud3JxZ21hcWVtcG1jdmNvenFhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE1NDczMTcsImV4cCI6MjA4NzEyMzMxN30.B-0CYbHYASGqsuld1yBt-qrcwQznJHX4BkM81psxb-0';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export { SUPABASE_URL, SUPABASE_ANON_KEY };
