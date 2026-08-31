-- EarnedStar WooCommerce integration — self-built direct webhook (Bible Phase 4c).
-- No OAuth, no app-marketplace listing: each merchant self-hosting WooCommerce
-- pastes a store URL + a secret they generate themselves into their own
-- WooCommerce admin (Settings → Advanced → Webhooks) and into EarnedStar's
-- dashboard. This table stores that per-merchant secret so inbound webhooks
-- can be HMAC-verified per merchant (mirrors collective_shop_shops' shape,
-- see 009_collective_shop.sql, but keyed by our own business_id since there
-- is no external shop-domain identity to key on).
--
-- NOT YET APPLIED — run via `npm run db:migrate:one` /
-- `scripts/apply-pending-migrations.mjs` per docs/EARNEDSTAR_BIBLE.md
-- Section 9 governance (migrations only via the versioned script, never
-- hand-edited against the live Supabase project).
--
-- Canonical location for this file (per `apply-pending-migrations.mjs`,
-- MIGRATIONS_DIR = ../../earnedstar/supabase/migrations relative to
-- earnedstar-back/scripts) is the sibling `earnedstar` (earnedstar-front)
-- checkout's supabase/migrations/ directory, alongside 001-014. A copy is
-- kept there uncommitted for now; this copy lives inside earnedstar-back so
-- it ships with this PR's diff.

CREATE TABLE IF NOT EXISTS woocommerce_stores (
  business_id UUID PRIMARY KEY REFERENCES businesses(id) ON DELETE CASCADE,
  store_url TEXT NOT NULL,
  webhook_secret TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'connected', 'disconnected')),
  connected_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS woocommerce_webhook_events (
  id TEXT PRIMARY KEY, -- X-WC-Webhook-Delivery-ID header, or a synthesized fallback key
  merchant_slug TEXT NOT NULL,
  topic TEXT NOT NULL,
  received_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  processed_at TIMESTAMPTZ,
  payload JSONB
);

CREATE INDEX IF NOT EXISTS idx_woocommerce_webhook_events_merchant
  ON woocommerce_webhook_events (merchant_slug, received_at DESC);

-- Supabase security advisor lockdown (see 014_enable_rls_lockdown.sql): every new
-- public-schema table must enable RLS. No policies added — deny-by-default for
-- anon/authenticated via PostgREST; the NestJS backend uses
-- SUPABASE_SERVICE_ROLE_KEY (BYPASSRLS) so backend access is unaffected.
-- woocommerce_stores.webhook_secret is a live per-merchant secret — this table
-- was committed with zero RLS (2026-08-31 sweep finding), caught before this
-- migration was ever applied.
ALTER TABLE woocommerce_stores ENABLE ROW LEVEL SECURITY;
ALTER TABLE woocommerce_webhook_events ENABLE ROW LEVEL SECURITY;
