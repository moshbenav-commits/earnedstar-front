-- Go Tianguis ops platform — P0 foundation (Shared Admin OS + Scanner + Tasks + SEO Ops)
-- Tenant scope: businesses.id (EarnedStar merchant org)

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ---------------------------------------------------------------------------
-- Connected stores (Shopify)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS gt_connected_stores (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  shop TEXT NOT NULL,
  display_name TEXT,
  status TEXT NOT NULL DEFAULT 'connected'
    CHECK (status IN ('draft_connection','connected','ready_to_scan','disconnected')),
  shopify_access_token_ref TEXT,
  last_sync_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (business_id, shop)
);

CREATE INDEX IF NOT EXISTS idx_gt_connected_stores_business ON gt_connected_stores(business_id);

CREATE TABLE IF NOT EXISTS gt_store_sync_states (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  store_id UUID NOT NULL REFERENCES gt_connected_stores(id) ON DELETE CASCADE,
  sync_type TEXT NOT NULL DEFAULT 'full'
    CHECK (sync_type IN ('full','products','pages','apps')),
  status TEXT NOT NULL DEFAULT 'queued'
    CHECK (status IN ('queued','running','succeeded','failed')),
  error_message TEXT,
  started_at TIMESTAMPTZ,
  finished_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS gt_store_products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  store_id UUID NOT NULL REFERENCES gt_connected_stores(id) ON DELETE CASCADE,
  shopify_product_id TEXT NOT NULL,
  title TEXT,
  description_html TEXT,
  handle TEXT,
  vendor TEXT,
  product_type TEXT,
  tags TEXT[] DEFAULT ARRAY[]::TEXT[],
  image_count INTEGER DEFAULT 0,
  images_missing_alt INTEGER DEFAULT 0,
  seo_title TEXT,
  seo_description TEXT,
  field_completeness_score INTEGER DEFAULT 0,
  raw JSONB DEFAULT '{}',
  synced_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (store_id, shopify_product_id)
);

CREATE TABLE IF NOT EXISTS gt_store_pages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  store_id UUID NOT NULL REFERENCES gt_connected_stores(id) ON DELETE CASCADE,
  page_type TEXT NOT NULL CHECK (page_type IN ('homepage','collection','product','blog','page','other')),
  shopify_resource_id TEXT,
  handle TEXT,
  title TEXT,
  seo_title TEXT,
  seo_description TEXT,
  body_html TEXT,
  synced_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS gt_installed_apps (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  store_id UUID NOT NULL REFERENCES gt_connected_stores(id) ON DELETE CASCADE,
  app_name TEXT NOT NULL,
  name TEXT,
  app_slug TEXT,
  category TEXT,
  overlap_risk TEXT DEFAULT 'low'
    CHECK (overlap_risk IS NULL OR overlap_risk IN ('low','medium','high')),
  detected_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ---------------------------------------------------------------------------
-- Jobs shell
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS gt_jobs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  job_type TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'queued'
    CHECK (status IN ('queued','active','retrying','failed','completed','dead_letter')),
  correlation_id TEXT,
  payload JSONB DEFAULT '{}',
  result JSONB,
  error_message TEXT,
  attempts INTEGER NOT NULL DEFAULT 0,
  max_attempts INTEGER NOT NULL DEFAULT 3,
  scheduled_for TIMESTAMPTZ,
  started_at TIMESTAMPTZ,
  finished_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_gt_jobs_business_status ON gt_jobs(business_id, status, created_at DESC);

CREATE TABLE IF NOT EXISTS gt_job_attempts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  job_id UUID NOT NULL REFERENCES gt_jobs(id) ON DELETE CASCADE,
  attempt_number INTEGER NOT NULL,
  status TEXT NOT NULL,
  error_message TEXT,
  duration_ms INTEGER,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ---------------------------------------------------------------------------
-- Audit logs (shared ops)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS gt_audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  business_id UUID REFERENCES businesses(id) ON DELETE SET NULL,
  actor_user_id UUID,
  actor_email TEXT,
  action TEXT NOT NULL,
  resource_type TEXT,
  resource_id TEXT,
  before_state JSONB,
  after_state JSONB,
  correlation_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_gt_audit_logs_business ON gt_audit_logs(business_id, created_at DESC);

-- ---------------------------------------------------------------------------
-- Scanner
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS gt_finding_rules (
  id TEXT PRIMARY KEY,
  category TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  default_severity TEXT NOT NULL DEFAULT 'medium'
    CHECK (default_severity IN ('info','low','medium','high','critical')),
  enabled BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS gt_audit_runs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  store_id UUID NOT NULL REFERENCES gt_connected_stores(id) ON DELETE CASCADE,
  business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'queued'
    CHECK (status IN ('queued','running','succeeded','failed','canceled')),
  correlation_id TEXT,
  started_at TIMESTAMPTZ,
  finished_at TIMESTAMPTZ,
  error_message TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_gt_audit_runs_store ON gt_audit_runs(store_id, created_at DESC);

CREATE TABLE IF NOT EXISTS gt_audit_scores (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  audit_run_id UUID NOT NULL REFERENCES gt_audit_runs(id) ON DELETE CASCADE,
  category TEXT NOT NULL,
  score INTEGER NOT NULL CHECK (score BETWEEN 0 AND 100),
  weight NUMERIC(4,2) NOT NULL DEFAULT 1.0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS gt_audit_findings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  audit_run_id UUID NOT NULL REFERENCES gt_audit_runs(id) ON DELETE CASCADE,
  store_id UUID NOT NULL REFERENCES gt_connected_stores(id) ON DELETE CASCADE,
  rule_id TEXT REFERENCES gt_finding_rules(id),
  category TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  severity TEXT NOT NULL DEFAULT 'medium'
    CHECK (severity IN ('info','low','medium','high','critical')),
  status TEXT NOT NULL DEFAULT 'open'
    CHECK (status IN ('open','accepted','ignored','converted_to_task','resolved')),
  resource_type TEXT,
  resource_id TEXT,
  recommendation TEXT,
  evidence JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_gt_audit_findings_run ON gt_audit_findings(audit_run_id);
CREATE INDEX IF NOT EXISTS idx_gt_audit_findings_store_status ON gt_audit_findings(store_id, status);

-- ---------------------------------------------------------------------------
-- Action console
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS gt_action_tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  store_id UUID REFERENCES gt_connected_stores(id) ON DELETE SET NULL,
  finding_id UUID REFERENCES gt_audit_findings(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'backlog'
    CHECK (status IN ('backlog','in_progress','blocked','in_review','completed','archived')),
  priority TEXT NOT NULL DEFAULT 'medium'
    CHECK (priority IN ('low','medium','high','urgent')),
  owner_user_id UUID,
  owner_email TEXT,
  due_at TIMESTAMPTZ,
  created_by UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_gt_action_tasks_business_status ON gt_action_tasks(business_id, status);

CREATE TABLE IF NOT EXISTS gt_task_comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  task_id UUID NOT NULL REFERENCES gt_action_tasks(id) ON DELETE CASCADE,
  author_user_id UUID,
  author_email TEXT,
  body TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS gt_task_status_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  task_id UUID NOT NULL REFERENCES gt_action_tasks(id) ON DELETE CASCADE,
  from_status TEXT,
  to_status TEXT NOT NULL,
  changed_by UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ---------------------------------------------------------------------------
-- SEO Ops (store-level)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS gt_seo_page_audits (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  store_id UUID NOT NULL REFERENCES gt_connected_stores(id) ON DELETE CASCADE,
  business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  page_type TEXT NOT NULL,
  resource_id TEXT,
  handle TEXT,
  title TEXT,
  issue_type TEXT NOT NULL,
  severity TEXT NOT NULL DEFAULT 'medium'
    CHECK (severity IN ('info','low','medium','high','critical')),
  status TEXT NOT NULL DEFAULT 'open'
    CHECK (status IN ('open','accepted','fixed','recheck_pending','verified')),
  current_value TEXT,
  recommendation TEXT,
  audit_run_id UUID REFERENCES gt_audit_runs(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_gt_seo_page_audits_store ON gt_seo_page_audits(store_id, status);

CREATE TABLE IF NOT EXISTS gt_seo_indexing_records (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  store_id UUID NOT NULL REFERENCES gt_connected_stores(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  index_status TEXT NOT NULL DEFAULT 'unknown'
    CHECK (index_status IN ('unknown','request_needed','requested','indexed','excluded','error')),
  last_checked_at TIMESTAMPTZ,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ---------------------------------------------------------------------------
-- Module settings
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS gt_module_settings (
  business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  module_key TEXT NOT NULL,
  settings JSONB NOT NULL DEFAULT '{}',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (business_id, module_key)
);

-- ---------------------------------------------------------------------------
-- Seed finding rules v1
-- ---------------------------------------------------------------------------
INSERT INTO gt_finding_rules (id, category, title, description, default_severity) VALUES
  ('missing-product-description', 'content_quality', 'Missing product description', 'Product has no description or body copy.', 'high'),
  ('thin-product-title', 'product_data', 'Thin product title', 'Product title is too short to be descriptive.', 'medium'),
  ('missing-alt-text', 'store_hygiene', 'Missing image alt text', 'One or more product images lack alt text.', 'medium'),
  ('missing-meta-description', 'seo_metadata', 'Missing meta description', 'Page or product is missing a meta description.', 'high'),
  ('weak-field-completeness', 'product_data', 'Incomplete product fields', 'Product is missing vendor, type, or tags.', 'medium'),
  ('missing-collection-description', 'collection_quality', 'Missing collection description', 'Collection has no descriptive copy.', 'medium'),
  ('homepage-seo-gap', 'seo_metadata', 'Homepage SEO gap', 'Homepage title or description needs improvement.', 'high'),
  ('store-not-synced', 'store_hygiene', 'Store catalog not synced', 'Connect Shopify and run a sync before deep audits.', 'info'),
  ('app-sprawl-hint', 'app_overlap', 'Multiple apps detected', 'Review installed apps for overlap and cost.', 'low')
ON CONFLICT (id) DO NOTHING;

-- RLS: business-scoped (service role used by Nest; policies for future direct Supabase access)
ALTER TABLE gt_connected_stores ENABLE ROW LEVEL SECURITY;
ALTER TABLE gt_audit_runs ENABLE ROW LEVEL SECURITY;
ALTER TABLE gt_audit_findings ENABLE ROW LEVEL SECURITY;
ALTER TABLE gt_action_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE gt_seo_page_audits ENABLE ROW LEVEL SECURITY;
ALTER TABLE gt_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE gt_audit_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY gt_connected_stores_owner ON gt_connected_stores FOR ALL
  USING (business_id IN (SELECT id FROM businesses WHERE owner_id = auth.uid()));

CREATE POLICY gt_audit_runs_owner ON gt_audit_runs FOR ALL
  USING (business_id IN (SELECT id FROM businesses WHERE owner_id = auth.uid()));

CREATE POLICY gt_audit_findings_owner ON gt_audit_findings FOR ALL
  USING (store_id IN (
    SELECT cs.id FROM gt_connected_stores cs
    JOIN businesses b ON b.id = cs.business_id WHERE b.owner_id = auth.uid()
  ));

CREATE POLICY gt_action_tasks_owner ON gt_action_tasks FOR ALL
  USING (business_id IN (SELECT id FROM businesses WHERE owner_id = auth.uid()));

CREATE POLICY gt_seo_page_audits_owner ON gt_seo_page_audits FOR ALL
  USING (business_id IN (SELECT id FROM businesses WHERE owner_id = auth.uid()));

CREATE POLICY gt_jobs_owner ON gt_jobs FOR ALL
  USING (business_id IN (SELECT id FROM businesses WHERE owner_id = auth.uid()));

CREATE POLICY gt_audit_logs_owner ON gt_audit_logs FOR ALL
  USING (business_id IN (SELECT id FROM businesses WHERE owner_id = auth.uid()));
