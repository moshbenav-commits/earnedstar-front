#!/usr/bin/env bash
# Block Vercel production deploy until billing guard passes or explicit approval is set.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

echo "Running Vercel billing guard..."
set +e
node scripts/vercel-billing-guard.mjs --pre-deploy
GUARD_EXIT=$?
set -e

if [ "$GUARD_EXIT" -eq 0 ]; then
  echo "Billing guard: OK — no critical billable blockers."
  exit 0
fi

if [ "$GUARD_EXIT" -eq 1 ]; then
  echo "Billing guard: warnings only — deploy allowed."
  exit 0
fi

# Exit 2 — critical findings
if [ "${VERCEL_DEPLOY_APPROVED:-}" = "1" ]; then
  echo ""
  echo "VERCEL_DEPLOY_APPROVED=1 — proceeding after explicit approval."
  exit 0
fi

echo ""
echo "Deploy blocked: critical Vercel billing findings above."
echo ""
echo "Options:"
echo "  1. Fix findings (recommended) — e.g. remove Speed Insights"
echo "  2. GitHub: Actions → Vercel production deploy → Run workflow (requires reviewer)"
echo "  3. Local override: VERCEL_DEPLOY_APPROVED=1 npm run deploy:prod"
echo ""
exit 1
