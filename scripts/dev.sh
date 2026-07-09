#!/usr/bin/env bash
# EarnedStar dev — Next.js front here + Nest API from the sibling standalone repo
# (earnedstar-back). The API is no longer bundled under ./backend; see AGENTS.md.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

API_DIR="${EARNEDSTAR_BACK_DIR:-$ROOT/../earnedstar-back}"

echo "EarnedStar dev — front :3000 · API :8081/api"
echo "  Front:  http://localhost:3000"
echo "  API:    http://localhost:8081/api/health  (from $API_DIR)"
echo ""

trap 'kill 0' EXIT INT TERM

(cd "$ROOT" && npm run dev) &

if [ -d "$API_DIR" ]; then
  (cd "$API_DIR" && npm run start:dev) &
else
  echo "WARN: backend repo not found at $API_DIR — starting front only." >&2
  echo "      Clone earnedstar-back beside earnedstar-front, or set EARNEDSTAR_BACK_DIR." >&2
fi

wait
