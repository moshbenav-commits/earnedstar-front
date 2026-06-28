-- The Collective Shop — Shopify public app (EarnedStar backend)
-- OAuth tokens, webhook idempotency, merchant link

CREATE TABLE IF NOT EXISTS collective_shop_shops (
  shop TEXT PRIMARY KEY,
  access_token TEXT NOT NULL DEFAULT '',
  scope TEXT NOT NULL DEFAULT '',
  earnedstar_merchant_slug TEXT,
  installed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  uninstalled_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_collective_shop_shops_merchant
  ON collective_shop_shops (earnedstar_merchant_slug)
  WHERE uninstalled_at IS NULL;

CREATE TABLE IF NOT EXISTS collective_shop_webhook_events (
  id TEXT PRIMARY KEY,
  shop TEXT NOT NULL,
  topic TEXT NOT NULL,
  received_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  processed_at TIMESTAMPTZ,
  payload JSONB
);

CREATE INDEX IF NOT EXISTS idx_collective_shop_webhook_events_shop
  ON collective_shop_webhook_events (shop, received_at DESC);
