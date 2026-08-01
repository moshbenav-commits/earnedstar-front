-- EarnedStar phase 20 — outgoing webhooks, integration API keys, delivery log

CREATE TABLE IF NOT EXISTS es_webhook_endpoints (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  secret TEXT NOT NULL,
  events TEXT[] NOT NULL DEFAULT '{}',
  description TEXT DEFAULT '',
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS es_webhook_endpoints_business_idx
  ON es_webhook_endpoints (business_id);

CREATE TABLE IF NOT EXISTS es_webhook_deliveries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  endpoint_id UUID REFERENCES es_webhook_endpoints(id) ON DELETE SET NULL,
  event_id UUID NOT NULL,
  event_type TEXT NOT NULL,
  payload JSONB NOT NULL DEFAULT '{}',
  status_code INT,
  ok BOOLEAN DEFAULT false,
  response_body TEXT,
  error TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS es_webhook_deliveries_business_idx
  ON es_webhook_deliveries (business_id, created_at DESC);

CREATE TABLE IF NOT EXISTS es_integration_api_keys (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  label TEXT NOT NULL DEFAULT 'Integration',
  key_prefix TEXT NOT NULL,
  key_hash TEXT NOT NULL UNIQUE,
  scopes TEXT[] DEFAULT ARRAY['read']::TEXT[],
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  last_used_at TIMESTAMPTZ,
  revoked_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS es_integration_api_keys_business_idx
  ON es_integration_api_keys (business_id, created_at DESC);

-- RLS lockdown (see 014_enable_rls_lockdown.sql): every new public table must
-- enable RLS in its own migration. Without this, all three tables below are
-- readable/writable through PostgREST with the anon key that ships in the
-- browser bundle — including es_webhook_endpoints.secret (webhook signing
-- secrets) and es_integration_api_keys.key_hash / key_prefix.
-- No policies are added: deny-by-default for anon/authenticated is the intent.
-- The NestJS backend is unaffected — it uses SUPABASE_SERVICE_ROLE_KEY (BYPASSRLS).
alter table public.es_webhook_endpoints enable row level security;
alter table public.es_webhook_deliveries enable row level security;
alter table public.es_integration_api_keys enable row level security;
