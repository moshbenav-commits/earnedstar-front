-- EarnedStar Bible Phase 4i — B2B/wholesale review collection (second wave of
-- Phase 4i, alongside subscription-cadence which shipped separately in
-- migration 019). The AI-drafted review-reply follow-on adjacent finding
-- needs no schema change (it reuses the existing reviews.business_response
-- column and the AI-SEO drafting pipeline) so this migration is scoped to
-- B2B/wholesale support only.
--
-- Every reviewed competitor's review-request trigger assumes a single
-- consumer completing a single DTC checkout. B2B/wholesale accounts break
-- that in three ways this migration supports:
--   1. Merchant opt-in + PO-cycle default delay (businesses columns) — a
--      merchant that never enables this keeps 100% unchanged DTC behavior.
--   2. Purchasing-contact routing needs no new column: sendInvitation()
--      already resolves the actual send-to contact before insert, so
--      review_requests.customer_email/customer_name already store the
--      resolved purchasing contact for a B2B order, same as any other.
--   3. Per-PO (not per-order-line) request dedup reuses the existing
--      product_key column from migration 019 as the cadence key — for a B2B
--      order, the PO number is fed in as that key instead of a product
--      name, so ReviewCadenceService's existing dedup logic (unchanged)
--      collapses multiple lines under one PO into a single request.
-- account_type/po_number below are additive, queryable/auditable columns
-- for merchant-facing reporting; they are not required by the dedup logic
-- itself (which runs on product_key), but let a merchant filter/report on
-- "which of my sent invitations were B2B" and "what PO was this for".
--
-- See src/earnedstar/b2b-review-collection.service.ts (earnedstar-back) for
-- the pure (DB-free) resolution logic this schema supports.
--
-- DO NOT APPLY to any live database as part of this change — write-only.

ALTER TABLE businesses
  ADD COLUMN IF NOT EXISTS b2b_mode_enabled BOOLEAN NOT NULL DEFAULT false;

ALTER TABLE businesses
  ADD COLUMN IF NOT EXISTS b2b_default_delay_days INTEGER NOT NULL DEFAULT 30
    CHECK (b2b_default_delay_days BETWEEN 0 AND 120);

ALTER TABLE review_requests
  ADD COLUMN IF NOT EXISTS account_type TEXT NOT NULL DEFAULT 'consumer'
    CHECK (account_type IN ('consumer', 'b2b'));

ALTER TABLE review_requests
  ADD COLUMN IF NOT EXISTS po_number TEXT;

COMMENT ON COLUMN businesses.b2b_mode_enabled IS
  'EarnedStar Bible Phase 4i: merchant opt-in for B2B/wholesale review-collection behavior (purchasing-contact routing, PO-cycle delay, per-PO cadence dedup). Off by default — DTC behavior is unaffected until a merchant opts in.';
COMMENT ON COLUMN businesses.b2b_default_delay_days IS
  'EarnedStar Bible Phase 4i: days to wait after fulfillment before requesting a review on a B2B/wholesale order (Net-30 PO cycle norm). Default 30. Only used when b2b_mode_enabled = true and the order does not specify an explicit delay.';
COMMENT ON COLUMN review_requests.account_type IS
  'EarnedStar Bible Phase 4i: whether this invitation was sent under DTC (consumer) or B2B/wholesale handling. Set from the order/invitation DTO account_type field; only actually changes behavior when the merchant also has b2b_mode_enabled = true.';
COMMENT ON COLUMN review_requests.po_number IS
  'EarnedStar Bible Phase 4i: purchase order number for a B2B/wholesale invitation, when known. Used as the per-PO cadence dedup key (fed into the existing product_key-based ReviewCadenceService lookup from migration 019) so multiple order lines under one PO collapse into a single review request.';

CREATE INDEX IF NOT EXISTS idx_review_requests_account_type
  ON review_requests (business_id, account_type);
