#!/usr/bin/env bash
# Deploy EarnedStar Nest API from monorepo backend/ folder.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

echo "Pre-deploy build (Nest)..."
npm run build

echo "Deploying earnedstar-back from backend/ ..."
vercel deploy --prod --yes --force

echo ""
echo "Production API:"
echo "  https://earnedstar-back.vercel.app/api"
echo "  https://earnedstar-back.vercel.app/api/health"
