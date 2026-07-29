-- EarnedStar loyalty/referral tracking layer (Bible Phase 4h — competitor-parity
-- bundle: Yotpo, Judge.me, Okendo, Loox, Stamped all bundle native loyalty/referral
-- rewards; EarnedStar had none). v1 scope: points-for-review, points-for-referral,
-- and referral-link attribution tracking. No redemption/spending mechanism yet
-- (v2) and no reward issuance in a merchant's own storefront (no discount-code
-- generation) — accrual + a merchant-facing ledger/leaderboard only, per Phase
-- 4h's "first slice, not the full loyalty-program feature set" scope note.
-- Gated to Growth+ plans (see plan-limits.ts `referrals` flag).
--
-- Customer identity anchor: reuses review_requests.token / reviews.customer_email
-- — the same anchor the existing invitation and review-submission flows use —
-- so a customer proves they're a real customer of the business without
-- EarnedStar needing its own customer-auth system. See
-- EarnedstarReferralsService.getOrCreateCodeByToken and
-- EarnedstarLoyaltyService.awardPointsForReview in earnedstar-back.
--
-- NOT YET APPLIED — run via `npm run db:migrate:one` /
-- `scripts/apply-pending-migrations.mjs` per docs/EARNEDSTAR_BIBLE.md
-- Section 9 governance (migrations only via the versioned script, never
-- hand-edited against the live Supabase project).
--
-- Canonical location for this file (per `apply-pending-migrations.mjs`,
-- MIGRATIONS_DIR = ../../earnedstar/supabase/migrations relative to
-- earnedstar-back/scripts) is the sibling `earnedstar` checkout's
-- supabase/migrations/ directory, alongside 001-015. A copy is kept here so it
-- ships with this PR's diff (mirrors 015_woocommerce_integration.sql).
--
-- NOTE ON NUMBERING: multiple concurrent branches independently claimed 016
-- (this file, review_cadence_cooldown, ftc_compliance_audit_log). These are
-- additive, non-overlapping CREATE TABLE / ALTER TABLE ... ADD COLUMN
-- statements with no cross-file dependency, so renumbering at merge time is
-- safe — see 016_review_cadence_cooldown.sql for the same note.

-- === Referral attribution (link generation, click/signup/conversion tracking) ===

CREATE TABLE IF NOT EXISTS referral_codes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  customer_email TEXT NOT NULL,
  customer_name TEXT,
  code TEXT NOT NULL UNIQUE,
  click_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (business_id, customer_email)
);

CREATE TABLE IF NOT EXISTS referral_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  referral_code_id UUID NOT NULL REFERENCES referral_codes(id) ON DELETE CASCADE,
  referrer_email TEXT NOT NULL,
  referred_email TEXT NOT NULL,
  order_id TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'converted', 'rewarded')),
  signed_up_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  converted_at TIMESTAMPTZ,
  rewarded_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  -- First-touch attribution: one active referral record per (business, referred
  -- customer). A friend who was referred twice keeps their first referrer.
  UNIQUE (business_id, referred_email)
);

CREATE INDEX IF NOT EXISTS idx_referral_codes_business ON referral_codes(business_id);
CREATE INDEX IF NOT EXISTS idx_referral_events_business_status ON referral_events(business_id, status);
CREATE INDEX IF NOT EXISTS idx_referral_events_code ON referral_events(referral_code_id);

-- === Points ledger (accrual only — no redemption/spending in v1) ===

CREATE TABLE IF NOT EXISTS loyalty_points_ledger (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  customer_email TEXT NOT NULL,
  customer_name TEXT,
  points INTEGER NOT NULL CHECK (points > 0),
  reason TEXT NOT NULL CHECK (reason IN ('review', 'referral')),
  -- reviews.id for a 'review' entry, referral_events.id for a 'referral' entry.
  -- Not a FK on purpose: the two source tables have different lifecycles/ON
  -- DELETE behavior and a ledger entry should survive either being pruned.
  reference_id UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  -- One accrual per (business, reference_id, reason): a review or referral
  -- conversion can only ever award points once, even if the awarding call is
  -- retried (e.g. a webhook redelivery).
  UNIQUE (business_id, reason, reference_id)
);

CREATE INDEX IF NOT EXISTS idx_loyalty_points_ledger_business_customer
  ON loyalty_points_ledger(business_id, customer_email);
CREATE INDEX IF NOT EXISTS idx_loyalty_points_ledger_business_created
  ON loyalty_points_ledger(business_id, created_at DESC);

-- === Merchant config: points-per-review / points-per-referral amounts ===

ALTER TABLE businesses
  ADD COLUMN IF NOT EXISTS points_per_review INTEGER NOT NULL DEFAULT 10
    CHECK (points_per_review BETWEEN 0 AND 100000);
ALTER TABLE businesses
  ADD COLUMN IF NOT EXISTS points_per_referral INTEGER NOT NULL DEFAULT 50
    CHECK (points_per_referral BETWEEN 0 AND 100000);

COMMENT ON COLUMN businesses.points_per_review IS
  'EarnedStar Bible Phase 4h: loyalty points awarded to a customer when their review is published (0 = disabled). Default 10.';
COMMENT ON COLUMN businesses.points_per_referral IS
  'EarnedStar Bible Phase 4h: loyalty points awarded to the referrer when a referred customer''s order converts (0 = disabled). Default 50.';

-- Supabase security advisor lockdown (see 014_enable_rls_lockdown.sql): every new
-- public-schema table must enable RLS. No policies added — deny-by-default for
-- anon/authenticated via PostgREST; the NestJS backend uses
-- SUPABASE_SERVICE_ROLE_KEY (BYPASSRLS) so backend access is unaffected.
ALTER TABLE referral_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE referral_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE loyalty_points_ledger ENABLE ROW LEVEL SECURITY;
