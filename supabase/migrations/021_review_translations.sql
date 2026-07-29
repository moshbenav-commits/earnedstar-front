-- EarnedStar entry-tier auto-translation cache — Bible Phase 4h (competitor-parity
-- bundle: Yotpo, Judge.me, Okendo, Loox, Stamped all offer review/widget
-- translation; EarnedStar had none). Unlike the other 4h sub-features
-- (native loyalty/referral = Growth+, Q&A widget = Pro+), the Bible calls this
-- one out explicitly as "entry-tier (not paid-tier-gated)": every plan,
-- including Starter, gets translated review text. See
-- src/earnedstar/earnedstar-translation.service.ts, which deliberately takes
-- no `plan` argument and imports no PlanLimitsService.
--
-- v1 scope: caches AI-translated review bodies (content_type = 'review') so a
-- given review is never re-translated into the same target language twice.
-- The content_type/content_id shape is generic on purpose so Q&A answers
-- (content_type = 'qa_answer'/'qa_question') can reuse the same cache table
-- without a follow-up migration.
--
-- NOT YET APPLIED — run via `npm run db:migrate:one` /
-- `scripts/apply-pending-migrations.mjs` per docs/EARNEDSTAR_BIBLE.md
-- Section 9 governance (migrations only via the versioned script, never
-- hand-edited against the live Supabase project).
--
-- Canonical location for this file (per `apply-pending-migrations.mjs`,
-- MIGRATIONS_DIR = ../../earnedstar/supabase/migrations relative to
-- earnedstar-back/scripts) is the sibling `earnedstar` checkout's
-- supabase/migrations/ directory (021_review_translations.sql there — the
-- sibling repo's numbering has continued past what's mirrored into this
-- repo's supabase/migrations/, which stopped mirroring at 016). A copy is
-- kept here so it ships with this PR's diff (mirrors 015/016 conventions).

CREATE TABLE IF NOT EXISTS earnedstar_translations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  content_type TEXT NOT NULL CHECK (content_type IN ('review', 'qa_answer', 'qa_question')),
  -- reviews.id (content_type='review') or qa_items.id (content_type='qa_answer'/'qa_question').
  -- Not a FK on purpose: the source tables have different lifecycles/ON DELETE
  -- behavior and different content_type values point at different tables.
  content_id UUID NOT NULL,
  target_lang TEXT NOT NULL,
  translated_text TEXT NOT NULL,
  -- sha256 of the source text at translation time. A source edit changes this
  -- hash, so a stale cached translation is naturally skipped (cache miss) on
  -- next request instead of silently served — see
  -- EarnedstarTranslationService.getCached.
  source_text_hash TEXT NOT NULL,
  source TEXT NOT NULL DEFAULT 'ai' CHECK (source IN ('ai', 'mock')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  -- One cached translation per (content, language): a repeat request for the
  -- same review+language is a cache hit, never a re-translation.
  UNIQUE (content_type, content_id, target_lang)
);

CREATE INDEX IF NOT EXISTS idx_earnedstar_translations_business
  ON earnedstar_translations(business_id);
CREATE INDEX IF NOT EXISTS idx_earnedstar_translations_content
  ON earnedstar_translations(content_type, content_id);

COMMENT ON TABLE earnedstar_translations IS
  'EarnedStar Bible Phase 4h: entry-tier (not paid-tier-gated) auto-translation cache for review text (and, in future, Q&A answers) — keyed on (content_type, content_id, target_lang) with a source-text hash for staleness detection.';

-- Supabase security advisor lockdown (see 014_enable_rls_lockdown.sql): every new
-- public-schema table must enable RLS. No policies added — deny-by-default for
-- anon/authenticated via PostgREST; the NestJS backend uses
-- SUPABASE_SERVICE_ROLE_KEY (BYPASSRLS) so backend access is unaffected.
ALTER TABLE earnedstar_translations ENABLE ROW LEVEL SECURITY;
