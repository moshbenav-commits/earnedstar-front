-- EarnedStar Q&A widget (Bible Phase 4h — competitor-parity bundle, second half:
-- loyalty/referral shipped in 016_loyalty_referral_program.sql; this is the
-- Q&A widget half). Public ask/list endpoints and the merchant-facing Q&A
-- panel already existed (qa_items table, 001_initial.sql) — this migration
-- adds only what was missing: a durable, serverless-safe counter for
-- IP-based rate limiting on the public "ask a question" endpoint.
--
-- Why a table and not in-memory: earnedstar-back runs as a Vercel serverless
-- function (see vercel.json — @vercel/node, dist/main.js), so a process-local
-- Map() would not reliably enforce a limit across invocations/instances.
-- QaRateLimitService (src/earnedstar/qa-rate-limit.service.ts) uses the same
-- COUNT-then-check shape as PlanLimitsService.assertCanSendInvitation (see
-- plan-limits.service.ts) — COUNT rows in a trailing time window, reject if
-- at/over the cap, else record the attempt. 3 asks / rolling 60 minutes per
-- IP, enforced in front of EarnedstarQaController@askPublic. Falls back to an
-- in-memory sliding window when DATABASE_URL isn't set (mock/dev mode).
--
-- ip_hash, not raw IP: the ask endpoint is unauthenticated and public — we
-- only need to recognize "same client asked N times in the last hour", never
-- the literal address, so we store sha256(ip) instead of the IP itself.
--
-- NOT YET APPLIED — run via `npm run db:migrate:one` /
-- `scripts/apply-pending-migrations.mjs` per docs/EARNEDSTAR_BIBLE.md
-- Section 9 governance (migrations only via the versioned script, never
-- hand-edited against the live Supabase project).
--
-- Canonical location for this file (per `apply-pending-migrations.mjs`,
-- MIGRATIONS_DIR = ../../earnedstar/supabase/migrations relative to
-- earnedstar-back/scripts) is the sibling `earnedstar` checkout's
-- supabase/migrations/ directory, alongside 001-020 (as
-- 021_qa_widget_rate_limit.sql there). A copy is kept here so it ships with
-- this PR's diff (mirrors 015_woocommerce_integration.sql /
-- 016_loyalty_referral_program.sql).

CREATE TABLE IF NOT EXISTS qa_ask_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  -- sha256(client IP) — see comment above. Not a FK: rate limiting is
  -- intentionally global across all businesses so one IP can't dodge the
  -- cap by spraying questions across many merchant profiles.
  ip_hash TEXT NOT NULL,
  business_id UUID REFERENCES businesses(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Sliding-window lookup: "how many attempts from this ip_hash in the last hour".
CREATE INDEX IF NOT EXISTS idx_qa_ask_attempts_ip_created
  ON qa_ask_attempts (ip_hash, created_at DESC);

-- Cheap, periodic cleanup target (attempts older than the rate-limit window
-- are dead weight) — not a cron job in v1, just an index that makes a manual
-- `DELETE ... WHERE created_at < now() - interval '1 day'` fast if ever run.
CREATE INDEX IF NOT EXISTS idx_qa_ask_attempts_created
  ON qa_ask_attempts (created_at);

-- Supabase security advisor lockdown (see 014_enable_rls_lockdown.sql): every
-- new public-schema table must enable RLS. No policies added — deny-by-default
-- for anon/authenticated via PostgREST; the NestJS backend uses
-- SUPABASE_SERVICE_ROLE_KEY (BYPASSRLS) so backend access is unaffected.
ALTER TABLE qa_ask_attempts ENABLE ROW LEVEL SECURITY;
