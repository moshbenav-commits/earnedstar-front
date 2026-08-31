-- EarnedStar BigCommerce integration — self-built direct webhook (Bible Phase 4c,
-- approved 2026-07-28). No OAuth, no App Marketplace listing: each merchant
-- creates their own scoped API account directly in their BigCommerce control
-- panel (Settings -> API Accounts -> Create API Account) and pastes the
-- store hash + access token into EarnedStar's dashboard. EarnedStar's own
-- backend then registers the store/order/statusUpdated webhook subscription
-- via BigCommerce's REST Webhooks API (POST /v3/hooks) using that token.
--
-- Security model: BigCommerce's classic Webhooks API does not cryptographically
-- sign callback payloads (verified against BigCommerce's own current docs,
-- see docs/EARNEDSTAR_BIGCOMMERCE_INTEGRATION.md). `webhook_secret` is a value
-- we generate and register as a custom callback header BigCommerce echoes back
-- verbatim on every delivery — combined with an unguessable webhook URL path
-- segment (`webhook_token`) and a payload store_hash cross-check.
--
-- NOT YET APPLIED — run via `npm run db:migrate:one` /
-- `scripts/apply-pending-migrations.mjs` per docs/EARNEDSTAR_BIBLE.md
-- Section 9 governance (migrations only via the versioned script, never
-- hand-edited against the live Supabase project).
--
-- Canonical location for this file (per `apply-pending-migrations.mjs`,
-- MIGRATIONS_DIR = ../../earnedstar/supabase/migrations relative to
-- earnedstar-back/scripts) is the sibling `earnedstar` (earnedstar-front)
-- checkout's supabase/migrations/ directory, alongside 001-015. A copy is
-- kept there uncommitted for now; this copy lives inside earnedstar-back so
-- it ships with this PR's diff (mirrors 015_woocommerce_integration.sql).

CREATE TABLE IF NOT EXISTS bigcommerce_connections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID NOT NULL UNIQUE REFERENCES businesses(id) ON DELETE CASCADE,
  store_hash TEXT NOT NULL UNIQUE,
  access_token TEXT NOT NULL,
  webhook_token TEXT NOT NULL UNIQUE,
  webhook_secret TEXT NOT NULL,
  hook_id BIGINT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'connected', 'disconnected', 'error')),
  last_error TEXT,
  connected_at TIMESTAMPTZ,
  disconnected_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_bigcommerce_connections_webhook_token
  ON bigcommerce_connections (webhook_token)
  WHERE status = 'connected';

CREATE TABLE IF NOT EXISTS bigcommerce_webhook_events (
  id TEXT PRIMARY KEY, -- synthesized "{store_hash}:{order_id}:{status_id}" — BigCommerce sends no event id
  store_hash TEXT NOT NULL,
  order_id BIGINT NOT NULL,
  status_id INT,
  received_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  processed_at TIMESTAMPTZ,
  payload JSONB
);

CREATE INDEX IF NOT EXISTS idx_bigcommerce_webhook_events_store
  ON bigcommerce_webhook_events (store_hash, received_at DESC);

-- Supabase security advisor lockdown (see 014_enable_rls_lockdown.sql): every new
-- public-schema table must enable RLS. No policies added — deny-by-default for
-- anon/authenticated via PostgREST; the NestJS backend uses
-- SUPABASE_SERVICE_ROLE_KEY (BYPASSRLS) so backend access is unaffected.
-- bigcommerce_connections.access_token is a live merchant API credential — this
-- table was committed with zero RLS (2026-08-31 sweep finding), caught before
-- this migration was ever applied.
ALTER TABLE bigcommerce_connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE bigcommerce_webhook_events ENABLE ROW LEVEL SECURITY;
