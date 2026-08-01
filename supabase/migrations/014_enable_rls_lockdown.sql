-- 014_enable_rls_lockdown.sql
-- Supabase security advisor (2026-07-21): 14 public-schema tables had RLS disabled,
-- readable/writable through PostgREST with the anon key (which ships in the browser
-- bundle). Backend access is unaffected: NestJS uses SUPABASE_SERVICE_ROLE_KEY
-- (BYPASSRLS) and migrations run as the table owner.
-- No policies are added — deny-by-default for anon/authenticated is the intent.
-- Applied to production ppnbpblnuxbihhxgozxi on 2026-07-21 via Management API.
-- Every new table in public must enable RLS in its own migration.

alter table public.collective_shop_shops enable row level security;
alter table public.collective_shop_webhook_events enable row level security;
alter table public.gt_audit_scores enable row level security;
alter table public.gt_finding_rules enable row level security;
alter table public.gt_installed_apps enable row level security;
alter table public.gt_job_attempts enable row level security;
alter table public.gt_module_settings enable row level security;
alter table public.gt_remediation_playbooks enable row level security;
alter table public.gt_seo_indexing_records enable row level security;
alter table public.gt_store_pages enable row level security;
alter table public.gt_store_products enable row level security;
alter table public.gt_store_sync_states enable row level security;
alter table public.gt_task_comments enable row level security;
alter table public.gt_task_status_history enable row level security;
