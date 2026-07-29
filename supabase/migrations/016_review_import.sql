-- EarnedStar Phase 3f — free review-import migration from Yotpo/Loox/Judge.me/Stamped
-- (see docs/EARNEDSTAR_BIBLE.md §5 Phase 3f). Adds provenance columns to `reviews`
-- so imported reviews are clearly distinguishable from organically-collected ones,
-- plus a raw product-reference column (imported CSVs reference products by an
-- external id/handle/title that generally won't match our internal `products`
-- table, so we can't safely set `product_id` FK for these rows) and a partial
-- unique index that makes re-running the same CSV import idempotent.
--
-- NOT applied to any live database by this change — write-only per workspace
-- migration governance (EARNEDSTAR_BIBLE.md §9): apply via
-- earnedstar-back/scripts/apply-pending-migrations.mjs or db:migrate:one.

ALTER TABLE reviews
  ADD COLUMN IF NOT EXISTS source TEXT NOT NULL DEFAULT 'organic'
    CHECK (source IN ('organic', 'imported')),
  ADD COLUMN IF NOT EXISTS import_platform TEXT
    CHECK (import_platform IS NULL OR import_platform IN ('yotpo', 'loox', 'judgeme', 'stamped')),
  ADD COLUMN IF NOT EXISTS import_external_id TEXT,
  ADD COLUMN IF NOT EXISTS import_product_ref TEXT,
  ADD COLUMN IF NOT EXISTS imported_at TIMESTAMPTZ;

-- Dedup guard: the same merchant + source platform + external id (native
-- review id, or a composite hash of reviewer/product/date/rating when the
-- source export has no native id — see review-import.adapters.ts
-- buildImportExternalId()) can only be inserted once, even if the merchant
-- re-runs the same CSV import twice.
CREATE UNIQUE INDEX IF NOT EXISTS reviews_import_dedup_idx
  ON reviews (business_id, import_platform, import_external_id)
  WHERE import_platform IS NOT NULL AND import_external_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS reviews_source_idx ON reviews (business_id, source);
