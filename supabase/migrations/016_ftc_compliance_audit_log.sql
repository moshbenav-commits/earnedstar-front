-- EarnedStar Phase 4g — FTC Consumer Review Rule compliance audit-log layer.
--
-- Scope: LOGGING/FLAGGING ONLY. This table and the code that reads it never
-- assert "FTC compliant" — compliance is a legal determination this tool
-- does not make. It records, per invitation send, the solicitation method,
-- timestamp, whether the send was incentivized, and whether the recipient
-- list was an unsegmented/objective-criteria send (e.g. "everyone whose
-- order was fulfilled N days ago") or a manually curated subset — the
-- structural distinction the FTC's 2024 Consumer Review Rule cares about
-- (see 2019 UrthBox enforcement: free product conditioned on curated,
-- presumed-favorable recipients). `flagged`/`flag_reason` are a diagnostic
-- signal (incentive present AND segment_type = 'manual_selection'), not a
-- compliance verdict.
--
-- Rows are written per invitation send (review_requests row) and share a
-- `batch_id` across a single API call (bulk send / CSV import), so the
-- merchant-facing panel can group by batch_id to show "recent invitation
-- batches" without a separate batches table.

CREATE TABLE IF NOT EXISTS es_invitation_compliance_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  review_request_id UUID REFERENCES review_requests(id) ON DELETE SET NULL,
  batch_id UUID NOT NULL,
  source TEXT NOT NULL CHECK (source IN ('single_send','bulk_send','csv_import','internal_api','order_webhook')),
  channel TEXT NOT NULL DEFAULT 'email' CHECK (channel IN ('email','sms','link')),
  segment_type TEXT NOT NULL DEFAULT 'unsegmented'
    CHECK (segment_type IN ('unsegmented','objective_exclusion','manual_selection')),
  segment_note TEXT,
  incentive_offered BOOLEAN NOT NULL DEFAULT false,
  incentive_description TEXT,
  flagged BOOLEAN NOT NULL DEFAULT false,
  flag_reason TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS es_invitation_compliance_log_business_idx
  ON es_invitation_compliance_log (business_id, created_at DESC);

CREATE INDEX IF NOT EXISTS es_invitation_compliance_log_batch_idx
  ON es_invitation_compliance_log (batch_id);

-- RLS lockdown (see 014_enable_rls_lockdown.sql): every new public table must
-- enable RLS in its own migration, deny-by-default for anon/authenticated.
-- The NestJS backend is unaffected — it uses SUPABASE_SERVICE_ROLE_KEY (BYPASSRLS).
alter table public.es_invitation_compliance_log enable row level security;
