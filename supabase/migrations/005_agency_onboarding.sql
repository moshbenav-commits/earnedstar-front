-- Agency sub-accounts, white-label domains, onboarding state
ALTER TABLE businesses
  ADD COLUMN IF NOT EXISTS parent_business_id UUID REFERENCES businesses(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS white_label_domain TEXT,
  ADD COLUMN IF NOT EXISTS onboarding_completed_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS email_from_name TEXT,
  ADD COLUMN IF NOT EXISTS email_subject_template TEXT,
  ADD COLUMN IF NOT EXISTS invite_delay_days INTEGER DEFAULT 7 CHECK (invite_delay_days IN (3, 5, 7, 14)),
  ADD COLUMN IF NOT EXISTS industry TEXT DEFAULT 'general';

CREATE INDEX IF NOT EXISTS idx_businesses_parent ON businesses(parent_business_id);
CREATE INDEX IF NOT EXISTS idx_businesses_white_label_domain ON businesses(white_label_domain);
