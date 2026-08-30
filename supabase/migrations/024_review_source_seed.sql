-- 024_review_source_seed.sql
--
-- Add 'seed' to reviews.source so demo/pre-launch review content is
-- distinguishable from real customer reviews.
--
-- Why: every review row currently in the database (14 of 14, House of Bid and
-- ExpediaParts) was written by scripts/seed-<site>-reviews.mjs with invented
-- customer names and order ids, stored as source = 'organic',
-- verified_purchase = true, status = 'published' and a randomised fraud_score.
-- Nothing marked them as demo content, so there was no way to find them later
-- and no way for any consumer to tell them apart from a real review.
--
-- Pre-launch demo content is fine. Demo content that asserts it arrived
-- organically from a verified purchaser is not — and at launch, with real
-- reviews landing in the same table, unmarked seed rows become unfindable.
--
-- Ricardo approved marking them, 2026-08-29.
--
-- 'seed' is a distinct value rather than a boolean flag so it composes with
-- the existing vocabulary: 'organic' (collected from a real customer),
-- 'imported' (migrated from another review platform), 'seed' (demo content
-- we authored). Consumers that must never show fabricated content filter on
-- source <> 'seed'; that filtering is deliberately NOT added here, because
-- changing what the public API returns is a separate, reviewable change.

ALTER TABLE reviews DROP CONSTRAINT IF EXISTS reviews_source_check;

ALTER TABLE reviews
  ADD CONSTRAINT reviews_source_check
  CHECK (source = ANY (ARRAY['organic'::text, 'imported'::text, 'seed'::text]));

COMMENT ON COLUMN reviews.source IS
  'How this review entered the system: organic (real customer), imported (migrated from another platform), seed (demo/pre-launch content we authored — never present it as a real review).';
