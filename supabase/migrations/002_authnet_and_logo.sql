-- EarnedStar v2 — Authorize.net billing columns
ALTER TABLE businesses
  ADD COLUMN IF NOT EXISTS authnet_customer_profile_id TEXT,
  ADD COLUMN IF NOT EXISTS authnet_subscription_id TEXT;
