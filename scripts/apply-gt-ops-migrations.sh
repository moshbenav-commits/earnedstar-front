#!/usr/bin/env bash
# Apply Go Tianguis gt-ops Supabase migrations (010 + 011) to EarnedStar Postgres.
# Requires DATABASE_URL (Supabase pooler or direct) — never commit credentials.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
MIGRATIONS=(
  "$ROOT/supabase/migrations/010_gt_ops_p0.sql"
  "$ROOT/supabase/migrations/011_gt_ops_align.sql"
)

if [[ -z "${DATABASE_URL:-}" ]]; then
  echo "ERROR: DATABASE_URL is not set."
  echo "  export DATABASE_URL='postgresql://postgres.[ref]:[pass]@aws-0-us-west-1.pooler.supabase.com:6543/postgres'"
  echo "  Or run migrations in Supabase Dashboard → SQL Editor (paste each file)."
  exit 1
fi

for f in "${MIGRATIONS[@]}"; do
  echo "Applying $(basename "$f")..."
  psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -f "$f"
done

echo "Done — gt-ops tables ready on $(echo "$DATABASE_URL" | sed -E 's/:([^:@/]+)@/:***@/')"
