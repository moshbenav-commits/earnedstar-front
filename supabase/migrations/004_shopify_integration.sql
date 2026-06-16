-- Shopify integration columns
ALTER TABLE businesses
  ADD COLUMN IF NOT EXISTS shopify_shop TEXT,
  ADD COLUMN IF NOT EXISTS shopify_status TEXT CHECK (shopify_status IN ('pending','connected','disconnected'));
