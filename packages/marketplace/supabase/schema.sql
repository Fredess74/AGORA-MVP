-- ═══════════════════════════════════════════════════════════════
-- AGORA MARKETPLACE — Supabase Database Schema
-- Run this in the Supabase SQL Editor
-- ═══════════════════════════════════════════════════════════════

-- ── 1. Profiles (extends Supabase auth.users) ──────────────
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  email TEXT,
  avatar_url TEXT,
  role TEXT NOT NULL DEFAULT 'buyer' CHECK (role IN ('creator', 'buyer', 'admin')),
  bio TEXT,
  website TEXT,
  github_username TEXT,
  stripe_account_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, username, email, avatar_url, github_username)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'user_name', NEW.raw_user_meta_data->>'name', 'user_' || LEFT(NEW.id::text, 8)),
    NEW.email,
    NEW.raw_user_meta_data->>'avatar_url',
    NEW.raw_user_meta_data->>'user_name'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ── 2. Categories ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  icon TEXT NOT NULL DEFAULT '📦',
  description TEXT,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Seed categories
INSERT INTO categories (id, name, icon, sort_order) VALUES
  ('mcp_server', 'MCP Servers', '🔌', 1),
  ('ai_agent', 'AI Agents', '🤖', 2),
  ('automation', 'Automations', '⚡', 3)
ON CONFLICT (id) DO NOTHING;

-- ── 3. Listings (products) ─────────────────────────────────
CREATE TABLE IF NOT EXISTS listings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  did TEXT UNIQUE,
  type TEXT NOT NULL DEFAULT 'mcp_server' CHECK (type IN ('mcp_server', 'ai_agent', 'automation')),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  author_name TEXT NOT NULL,
  author_avatar TEXT,
  github_repo TEXT,
  
  -- Pricing
  pricing_model TEXT NOT NULL DEFAULT 'free' CHECK (pricing_model IN ('free', 'per_call', 'subscription')),
  price_per_call DECIMAL(10, 6),
  subscription_price DECIMAL(10, 2),
  freetier_calls INT DEFAULT 0,
  
  -- Trust
  trust_score DECIMAL(5, 4) DEFAULT 0.0,
  
  -- Metrics
  total_calls BIGINT DEFAULT 0,
  total_users INT DEFAULT 0,
  avg_latency_ms INT DEFAULT 0,
  uptime DECIMAL(5, 2) DEFAULT 0.0,
  
  -- Metadata
  category TEXT REFERENCES categories(id),
  tags TEXT[] DEFAULT '{}',
  rating DECIMAL(3, 2) DEFAULT 0.0,
  review_count INT DEFAULT 0,
  
  -- Status
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('draft', 'active', 'suspended', 'archived')),
  
  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Index for fast lookups
CREATE INDEX IF NOT EXISTS idx_listings_type ON listings(type);
CREATE INDEX IF NOT EXISTS idx_listings_slug ON listings(slug);
CREATE INDEX IF NOT EXISTS idx_listings_category ON listings(category);
CREATE INDEX IF NOT EXISTS idx_listings_creator ON listings(creator_id);
CREATE INDEX IF NOT EXISTS idx_listings_status ON listings(status);

-- ── 4. Reviews ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id UUID REFERENCES listings(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  username TEXT,
  avatar_url TEXT,
  rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_reviews_listing ON reviews(listing_id);

-- Auto-update listing review stats
CREATE OR REPLACE FUNCTION update_listing_review_stats()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE listings
  SET 
    rating = (SELECT COALESCE(AVG(rating), 0) FROM reviews WHERE listing_id = NEW.listing_id),
    review_count = (SELECT COUNT(*) FROM reviews WHERE listing_id = NEW.listing_id),
    updated_at = now()
  WHERE id = NEW.listing_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER on_review_added
  AFTER INSERT ON reviews
  FOR EACH ROW EXECUTE FUNCTION update_listing_review_stats();

-- ── 5. API Keys ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS api_keys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL DEFAULT 'Default Key',
  key_hash TEXT NOT NULL,
  key_prefix TEXT NOT NULL, -- first 8 chars for display
  scopes TEXT[] DEFAULT '{read}',
  last_used_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_api_keys_user ON api_keys(user_id);

-- ── 6. Transactions (for payouts/billing) ──────────────────
CREATE TABLE IF NOT EXISTS transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id UUID REFERENCES listings(id),
  buyer_id UUID REFERENCES profiles(id),
  seller_id UUID REFERENCES profiles(id),
  type TEXT NOT NULL CHECK (type IN ('purchase', 'subscription', 'payout', 'refund')),
  amount_usd DECIMAL(10, 2) NOT NULL,
  commission_usd DECIMAL(10, 2) DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
  stripe_payment_id TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_transactions_buyer ON transactions(buyer_id);
CREATE INDEX IF NOT EXISTS idx_transactions_seller ON transactions(seller_id);
CREATE INDEX IF NOT EXISTS idx_transactions_listing ON transactions(listing_id);

-- ── 7. Usage Logs ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS usage_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id UUID REFERENCES listings(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id),
  action TEXT NOT NULL DEFAULT 'api_call',
  latency_ms INT,
  status_code INT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_usage_listing ON usage_logs(listing_id);
CREATE INDEX IF NOT EXISTS idx_usage_created ON usage_logs(created_at);

-- ── 8. Row Level Security (RLS) ────────────────────────────

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE api_keys ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE usage_logs ENABLE ROW LEVEL SECURITY;

-- Profiles: public read, own write
CREATE POLICY "Profiles are public" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Listings: public read, creators can write own
CREATE POLICY "Listings are public" ON listings FOR SELECT USING (status = 'active');
CREATE POLICY "Creators can insert listings" ON listings FOR INSERT WITH CHECK (auth.uid() = creator_id);
CREATE POLICY "Creators can update own listings" ON listings FOR UPDATE USING (auth.uid() = creator_id);

-- Reviews: public read, authenticated write
CREATE POLICY "Reviews are public" ON reviews FOR SELECT USING (true);
CREATE POLICY "Authenticated users can review" ON reviews FOR INSERT WITH CHECK (auth.uid() = user_id);

-- API Keys: only own
CREATE POLICY "Users see own keys" ON api_keys FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users create own keys" ON api_keys FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users delete own keys" ON api_keys FOR DELETE USING (auth.uid() = user_id);

-- Transactions: only own
CREATE POLICY "Users see own transactions" ON transactions FOR SELECT USING (auth.uid() = buyer_id OR auth.uid() = seller_id);

-- Categories: public read
CREATE POLICY "Categories are public" ON categories FOR SELECT USING (true);

-- Usage logs: only own
CREATE POLICY "Users see own usage" ON usage_logs FOR SELECT USING (auth.uid() = user_id);

-- ═══════════════════════════════════════════════════════════════
-- DONE! Tables: profiles, categories, listings, reviews,
--       api_keys, transactions, usage_logs
-- ═══════════════════════════════════════════════════════════════
