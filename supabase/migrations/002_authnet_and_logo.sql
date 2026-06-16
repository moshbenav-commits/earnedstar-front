-- EarnedStar v2 — Authorize.net billing columns + founding merchant logo
ALTER TABLE businesses
  ADD COLUMN IF NOT EXISTS authnet_customer_profile_id TEXT,
  ADD COLUMN IF NOT EXISTS authnet_subscription_id TEXT;

UPDATE businesses
SET logo_url = 'https://www.expediaparts.com/Logo_Menu.png'
WHERE slug = 'expediaparts' AND (logo_url IS NULL OR logo_url = '');
