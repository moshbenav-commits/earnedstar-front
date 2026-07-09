-- EarnedStar — Stripe subscription billing columns (parallel path to Authorize.net ARB)
-- See docs/fleet/PAYMENTS_ACTIVATION.md § EarnedStar Stripe path (added 2026-07-09)
ALTER TABLE businesses
  ADD COLUMN IF NOT EXISTS stripe_customer_id TEXT,
  ADD COLUMN IF NOT EXISTS stripe_subscription_id TEXT;
