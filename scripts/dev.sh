#!/usr/bin/env bash
# EarnedStar monorepo — Next.js front + Nest API (PraxiumLaw-style split folders).
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

echo "EarnedStar dev — front :3000 · API :8081/api"
echo "  Front:  http://localhost:3000"
echo "  API:    http://localhost:8081/api/health"
echo ""

trap 'kill 0' EXIT INT TERM

(cd "$ROOT" && npm run dev) &
(cd "$ROOT/backend" && npm run start:dev) &

wait
