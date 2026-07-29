-- EarnedStar Bible Phase 4i (subscription/recurring-purchase-aware review cadence).
-- Goal: stop asking the same customer to review the same product on every
-- recurring/repeat shipment. A merchant-configurable cooldown window gates
-- new review-request invitations per (business, customer, product) tuple.
--
-- NOTE ON NUMBERING: at authoring time a concurrent agent had an *uncommitted*
-- 015_woocommerce_integration.sql sitting in the working tree (Bible Phase
-- 4c). This migration is numbered 016 to follow it. If 015 lands under a
-- different number, or a second 016 lands from another concurrent branch,
-- renumber at merge time — these are independent, additive ALTER TABLE
-- statements with no cross-file dependency, so reordering is safe.
--
-- Design notes:
--   * No new lookup table is needed — `review_requests` already records one
--     row per invitation attempt (business_id, customer_email, created_at).
--     We add `product_key`, a normalized product identifier, so that table
--     itself becomes the "last invitation sent for this product" lookup:
--     the gating query is `ORDER BY created_at DESC LIMIT 1` scoped to
--     (business_id, customer_email, product_key).
--   * `product_key` is nullable. When a merchant's order data doesn't carry
--     a product name/SKU (many storefronts don't), the gate falls back to
--     customer+merchant-level cadence (product_key IS NULL rows only match
--     other product_key IS NULL rows for the same customer) per Bible 4i
--     scope note: "(or customer+merchant, if product-level tracking isn't
--     available)".
--   * The cooldown length is merchant-configurable via
--     businesses.review_request_cooldown_days (default 90, matches the
--     Bible's example default). 0 disables cadence gating entirely for a
--     merchant that wants the old "ask every time" behavior.
--
-- DO NOT APPLY to any live database as part of this change — write-only,
-- per the Bible Phase 4i task instructions.

ALTER TABLE businesses
  ADD COLUMN IF NOT EXISTS review_request_cooldown_days INTEGER NOT NULL DEFAULT 90
    CHECK (review_request_cooldown_days BETWEEN 0 AND 730);

ALTER TABLE review_requests
  ADD COLUMN IF NOT EXISTS product_key TEXT;

COMMENT ON COLUMN businesses.review_request_cooldown_days IS
  'EarnedStar Bible Phase 4i: days to wait before re-asking the same customer for a review of the same product (0 = no cadence gate). Default 90.';
COMMENT ON COLUMN review_requests.product_key IS
  'Normalized (trimmed, lowercased) product name/SKU used for per-product review-request cadence gating. NULL = product-level tracking unavailable for this order; cadence falls back to customer+merchant level.';

CREATE INDEX IF NOT EXISTS idx_review_requests_cadence
  ON review_requests (business_id, customer_email, product_key, created_at DESC);
