/* ═══════════════════════════════════════════════════════════
   Supabase Client — Agora Marketplace
   ═══════════════════════════════════════════════════════════ */

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://fnwrqgmaqempmcvcozqa.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_BtBZ62BMM3i2QP1rVj_H7w_5fRZKDSC';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export { SUPABASE_URL, SUPABASE_ANON_KEY };
