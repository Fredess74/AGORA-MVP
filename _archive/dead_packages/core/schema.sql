-- ╔═══════════════════════════════════════════════════════════╗
-- ║  PLANNED SCHEMA — NOT YET DEPLOYED                      ║
-- ║                                                          ║
-- ║  This is the TARGET database schema for production.      ║
-- ║  The current live database uses Supabase default tables: ║
-- ║  listings, transactions, usage_logs                      ║
-- ║                                                          ║
-- ║  Deploy this schema when migrating to self-hosted PG.    ║
-- ╚═══════════════════════════════════════════════════════════╝
-- Agora Trust Protocol Database Schema
-- PostgreSQL + TimescaleDB
-- Version: 1.0
-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "timescaledb";
-- ============================================================================
-- AGENTS TABLE
-- Stores registered agent identities
-- ============================================================================
CREATE TABLE agents (
    -- Primary key is the DID string
    did VARCHAR(128) PRIMARY KEY,
    -- Agent type: 'agent', 'vehicle', 'robot', 'sensor'
    agent_type VARCHAR(16) NOT NULL CHECK (
        agent_type IN ('agent', 'vehicle', 'robot', 'sensor')
    ),
    -- Public key for signature verification (hex-encoded, 64 chars for Ed25519)
    public_key VARCHAR(64) NOT NULL,
    -- Agent metadata (JSON)
    metadata JSONB DEFAULT '{}',
    -- Timestamps
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    -- Soft delete
    deleted_at TIMESTAMPTZ DEFAULT NULL
);
-- Index for type filtering
CREATE INDEX idx_agents_type ON agents(agent_type)
WHERE deleted_at IS NULL;
-- Index for creation time queries
CREATE INDEX idx_agents_created ON agents(created_at DESC)
WHERE deleted_at IS NULL;
-- ============================================================================
-- TRUST_EVENTS TABLE (Hypertable for time-series)
-- Stores individual interaction records
-- ============================================================================
CREATE TABLE trust_events (
    -- UUID primary key
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    -- The reporting agent
    agent_did VARCHAR(128) NOT NULL REFERENCES agents(did),
    -- The counterparty in the interaction
    counterparty_did VARCHAR(128) NOT NULL REFERENCES agents(did),
    -- Timestamp of the interaction
    timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    -- Outcome: 'success', 'failure', 'dispute'
    outcome VARCHAR(16) NOT NULL CHECK (outcome IN ('success', 'failure', 'dispute')),
    -- Response latency in milliseconds
    latency_ms INTEGER NOT NULL CHECK (
        latency_ms >= 0
        AND latency_ms <= 3600000
    ),
    -- Optional transaction amount in USD cents
    amount_cents BIGINT DEFAULT NULL CHECK (
        amount_cents IS NULL
        OR amount_cents >= 0
    ),
    -- Optional metadata
    metadata JSONB DEFAULT NULL,
    -- Signature of the event (hex-encoded)
    signature VARCHAR(128) DEFAULT NULL,
    -- Hash of the event for Merkle tree
    event_hash VARCHAR(64) NOT NULL,
    -- Constraint: agent cannot interact with itself
    CONSTRAINT chk_different_agents CHECK (agent_did != counterparty_did)
);
-- Convert to hypertable for efficient time-series queries
SELECT create_hypertable(
        'trust_events',
        'timestamp',
        chunk_time_interval => INTERVAL '1 day'
    );
-- Indexes for common query patterns
CREATE INDEX idx_events_agent ON trust_events(agent_did, timestamp DESC);
CREATE INDEX idx_events_counterparty ON trust_events(counterparty_did, timestamp DESC);
CREATE INDEX idx_events_outcome ON trust_events(outcome, timestamp DESC);
-- ============================================================================
-- TRUST_SCORES TABLE
-- Caches computed trust scores
-- ============================================================================
CREATE TABLE trust_scores (
    -- Primary key
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    -- Agent this score is for
    agent_did VARCHAR(128) NOT NULL REFERENCES agents(did),
    -- The computed trust score (0.0 to 1.0, stored as integer 0-10000)
    score INTEGER NOT NULL CHECK (
        score >= 0
        AND score <= 10000
    ),
    -- Confidence level: 'low', 'medium', 'high'
    confidence VARCHAR(8) NOT NULL CHECK (confidence IN ('low', 'medium', 'high')),
    -- Component breakdown (JSON)
    components JSONB NOT NULL DEFAULT '{}',
    -- Merkle root of the event history used
    merkle_root VARCHAR(64) NOT NULL,
    -- ZK proof (hex-encoded, can be large)
    proof TEXT DEFAULT NULL,
    -- When this score was computed
    computed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    -- Number of events used in computation
    event_count INTEGER NOT NULL DEFAULT 0,
    -- Whether this is the current/latest score
    is_current BOOLEAN NOT NULL DEFAULT TRUE
);
-- Ensure only one current score per agent
CREATE UNIQUE INDEX idx_scores_current ON trust_scores(agent_did)
WHERE is_current = TRUE;
-- Index for historical score lookups
CREATE INDEX idx_scores_history ON trust_scores(agent_did, computed_at DESC);
-- ============================================================================
-- MERKLE_ROOTS TABLE
-- Stores anchored Merkle roots for verification
-- ============================================================================
CREATE TABLE merkle_roots (
    -- The Merkle root hash
    root_hash VARCHAR(64) PRIMARY KEY,
    -- Agent this root is for
    agent_did VARCHAR(128) NOT NULL REFERENCES agents(did),
    -- Number of leaves in the tree
    leaf_count INTEGER NOT NULL CHECK (leaf_count >= 0),
    -- Timestamp of the last event included
    last_event_time TIMESTAMPTZ NOT NULL,
    -- Optional blockchain anchor transaction
    anchor_chain VARCHAR(32) DEFAULT NULL,
    anchor_tx_hash VARCHAR(66) DEFAULT NULL,
    anchor_block INTEGER DEFAULT NULL,
    -- When this root was created
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
-- Index for agent root lookups
CREATE INDEX idx_roots_agent ON merkle_roots(agent_did, created_at DESC);
-- ============================================================================
-- API_KEYS TABLE
-- Stores API keys for authentication
-- ============================================================================
CREATE TABLE api_keys (
    -- The API key (hashed)
    key_hash VARCHAR(64) PRIMARY KEY,
    -- Key prefix for identification (first 8 chars of original key)
    key_prefix VARCHAR(12) NOT NULL,
    -- Owner (could be an agent DID or external identifier)
    owner_id VARCHAR(128) NOT NULL,
    -- Human-readable name
    name VARCHAR(128) NOT NULL,
    -- Permissions (JSON array of permission strings)
    permissions JSONB NOT NULL DEFAULT '["read"]',
    -- Rate limit tier: 'free', 'growth', 'enterprise'
    rate_limit_tier VARCHAR(16) NOT NULL DEFAULT 'free',
    -- Usage tracking
    request_count BIGINT NOT NULL DEFAULT 0,
    last_used_at TIMESTAMPTZ DEFAULT NULL,
    -- Timestamps
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    expires_at TIMESTAMPTZ DEFAULT NULL,
    revoked_at TIMESTAMPTZ DEFAULT NULL
);
-- Index for owner lookups
CREATE INDEX idx_api_keys_owner ON api_keys(owner_id)
WHERE revoked_at IS NULL;
-- ============================================================================
-- DISPUTES TABLE
-- Tracks disputed interactions
-- ============================================================================
CREATE TABLE disputes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    -- The event being disputed
    event_id UUID NOT NULL REFERENCES trust_events(id),
    -- Who raised the dispute
    raised_by VARCHAR(128) NOT NULL REFERENCES agents(did),
    -- Dispute reason
    reason TEXT NOT NULL,
    -- Evidence (JSON)
    evidence JSONB DEFAULT NULL,
    -- Status: 'open', 'investigating', 'resolved', 'dismissed'
    status VARCHAR(16) NOT NULL DEFAULT 'open' CHECK (
        status IN ('open', 'investigating', 'resolved', 'dismissed')
    ),
    -- Resolution details
    resolution TEXT DEFAULT NULL,
    resolved_at TIMESTAMPTZ DEFAULT NULL,
    -- Timestamps
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
-- Index for status queries
CREATE INDEX idx_disputes_status ON disputes(status, created_at DESC);
CREATE INDEX idx_disputes_event ON disputes(event_id);
-- ============================================================================
-- FUNCTIONS
-- ============================================================================
-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at() RETURNS TRIGGER AS $$ BEGIN NEW.updated_at = NOW();
RETURN NEW;
END;
$$ LANGUAGE plpgsql;
-- Apply trigger to agents table
CREATE TRIGGER trigger_agents_updated_at BEFORE
UPDATE ON agents FOR EACH ROW EXECUTE FUNCTION update_updated_at();
-- Apply trigger to disputes table
CREATE TRIGGER trigger_disputes_updated_at BEFORE
UPDATE ON disputes FOR EACH ROW EXECUTE FUNCTION update_updated_at();
-- Function to invalidate current trust score when new one is inserted
CREATE OR REPLACE FUNCTION invalidate_previous_scores() RETURNS TRIGGER AS $$ BEGIN
UPDATE trust_scores
SET is_current = FALSE
WHERE agent_did = NEW.agent_did
    AND id != NEW.id
    AND is_current = TRUE;
RETURN NEW;
END;
$$ LANGUAGE plpgsql;
CREATE TRIGGER trigger_invalidate_scores
AFTER
INSERT ON trust_scores FOR EACH ROW EXECUTE FUNCTION invalidate_previous_scores();
-- ============================================================================
-- VIEWS
-- ============================================================================
-- View for active agents with their current trust score
CREATE VIEW v_agents_with_trust AS
SELECT a.did,
    a.agent_type,
    a.created_at,
    ts.score::FLOAT / 10000 AS trust_score,
    ts.confidence,
    ts.event_count,
    ts.computed_at AS score_computed_at
FROM agents a
    LEFT JOIN trust_scores ts ON a.did = ts.agent_did
    AND ts.is_current = TRUE
WHERE a.deleted_at IS NULL;
-- View for recent trust events
CREATE VIEW v_recent_events AS
SELECT te.id,
    te.agent_did,
    te.counterparty_did,
    te.timestamp,
    te.outcome,
    te.latency_ms,
    te.amount_cents::FLOAT / 100 AS amount_usd
FROM trust_events te
WHERE te.timestamp > NOW() - INTERVAL '24 hours'
ORDER BY te.timestamp DESC;
-- ============================================================================
-- COMMENTS
-- ============================================================================
COMMENT ON TABLE agents IS 'Registered agent identities in the Agora Trust Protocol';
COMMENT ON TABLE trust_events IS 'Individual interaction records between agents (time-series hypertable)';
COMMENT ON TABLE trust_scores IS 'Cached computed trust scores with component breakdown';
COMMENT ON TABLE merkle_roots IS 'Anchored Merkle roots for trust history verification';
COMMENT ON TABLE api_keys IS 'API keys for client authentication';
COMMENT ON TABLE disputes IS 'Disputed interactions awaiting resolution';