#!/usr/bin/env bash
# Deploy EarnedStar Nest API from monorepo backend/ folder.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

echo "Pre-deploy build (Nest)..."
npm run build

echo "Deploying earnedstar-back from backend/ ..."
if [ ! -f .vercel/project.json ]; then
  echo "ERROR: Link backend to Vercel project earnedstar-back first:"
  echo "  cp ../earnedstar-back/.vercel/project.json .vercel/project.json"
  echo "  or: vercel link --project earnedstar-back"
  exit 1
fi
vercel deploy --prod --yes --force

echo ""
echo "Production API:"
echo "  https://earnedstar-back.vercel.app/api"
echo "  https://earnedstar-back.vercel.app/api/health"
