# Go Tianguis Ops — Supabase migrations

Apply **`010_gt_ops_p0.sql`** + **`011_gt_ops_align.sql`** on EarnedStar Supabase project **`ppnbpblnuxbihhxgozxi`**.

## Option A — npm (Supabase Management API)

Requires `SUPABASE_ACCESS_TOKEN` in `earnedstar-back/.env.provision.local` or env.

```bash
npm run earnedstar:gt-ops:migrate
```

## Option B — single file (earnedstar-back)

```bash
cd earnedstar-back
node scripts/apply-migration.mjs 010_gt_ops_p0.sql
node scripts/apply-migration.mjs 011_gt_ops_align.sql
```

## Option C — psql

```bash
cd earnedstar
export DATABASE_URL='postgresql://…'
./scripts/apply-gt-ops-migrations.sh
```

## Option D — Supabase SQL Editor

1. Open [Supabase SQL Editor](https://supabase.com/dashboard/project/ppnbpblnuxbihhxgozxi/sql/new)
2. Paste and run `supabase/migrations/010_gt_ops_p0.sql`
3. Paste and run `supabase/migrations/011_gt_ops_align.sql`

## Verify

```sql
SELECT tablename FROM pg_tables WHERE tablename LIKE 'gt_%' ORDER BY 1;
SELECT COUNT(*) FROM gt_finding_rules;
```

Expect **17** `gt_*` tables and **9** seeded finding rules.

## Backend after migrate

On **earnedstar-back** (Vercel + local):

- `DATABASE_URL` set → Postgres persistence (no in-memory mock)
- `GT_OPS_SHOPIFY_DEFERRED=1` → demo catalog sync until Go Tianguis OAuth
- Run **Load demo** on `/ops/stores` then **Run scan** on `/ops/scanner`

## npm shortcut (workspace root)

```bash
npm run earnedstar:gt-ops:migrate
```

Requires `DATABASE_URL` in the environment.
