#!/usr/bin/env bash
# Deploy EarnedStar front to Vercel production (same gate pattern as expedia-parts-front).
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

bash scripts/vercel-deploy-gate.sh

if [ "${SKIP_PRE_DEPLOY_BUILD:-}" = "1" ]; then
  echo "SKIP_PRE_DEPLOY_BUILD=1 — skipping local production build gate"
else
  echo "Pre-deploy build gate (same command Vercel runs)..."
  npm run build
fi

echo "Building and deploying earnedstar to Vercel production..."
vercel deploy --prod --yes --force

echo ""
echo "Production aliases:"
echo "  https://earnedstar.vercel.app"
echo "  https://earnedstar.com"

if [ "${SKIP_POST_DEPLOY_SMOKE:-}" = "1" ]; then
  echo ""
  echo "SKIP_POST_DEPLOY_SMOKE=1 — skipping post-deploy smoke"
  exit 0
fi

echo ""
echo "Post-deploy smoke (Vercel alias + earnedstar.com)..."
npm run smoke:prod
