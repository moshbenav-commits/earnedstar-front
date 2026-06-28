-- Go Tianguis ops — schema alignment for prod (post 010)
-- Run after 010_gt_ops_p0.sql on Supabase project ppnbpblnuxbihhxgozxi

-- Installed apps: align with gt-ops.service getStore + demo seed
ALTER TABLE gt_installed_apps ADD COLUMN IF NOT EXISTS name TEXT;
ALTER TABLE gt_installed_apps ADD COLUMN IF NOT EXISTS category TEXT;
ALTER TABLE gt_installed_apps ADD COLUMN IF NOT EXISTS overlap_risk TEXT DEFAULT 'low'
  CHECK (overlap_risk IN ('low','medium','high'));

UPDATE gt_installed_apps SET name = COALESCE(name, app_name) WHERE name IS NULL;
UPDATE gt_installed_apps SET category = COALESCE(category, 'other') WHERE category IS NULL;

-- Playbooks (P1 — optional DB mirror; code SSOT remains gt-ops-playbooks.ts)
CREATE TABLE IF NOT EXISTS gt_remediation_playbooks (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  issue_type TEXT,
  category TEXT NOT NULL,
  summary TEXT,
  steps JSONB NOT NULL DEFAULT '[]',
  enabled BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Task list filters
CREATE INDEX IF NOT EXISTS idx_gt_action_tasks_review ON gt_action_tasks(business_id, status)
  WHERE status = 'in_review';

CREATE INDEX IF NOT EXISTS idx_gt_seo_page_audits_business_status ON gt_seo_page_audits(business_id, status);

-- Demo catalog seed helper: prevent duplicate homepage rows
CREATE UNIQUE INDEX IF NOT EXISTS idx_gt_store_pages_homepage
  ON gt_store_pages(store_id, page_type)
  WHERE page_type = 'homepage';
