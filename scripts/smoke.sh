#!/usr/bin/env bash
set -euo pipefail

FRONT="${SMOKE_FRONT_URL:-https://earnedstar.vercel.app}"
DOMAIN="${SMOKE_CUSTOM_DOMAIN:-https://earnedstar.com}"
API="${SMOKE_API_URL:-https://earnedstar-back.vercel.app/api}"

check() {
  local url="$1"
  local code
  code="$(curl -sS -o /dev/null -w "%{http_code}" --max-time 30 "$url" || echo "000")"
  echo "$url -> HTTP $code"
  case "$code" in
    200|301|302|307|308) return 0 ;;
    *) return 1 ;;
  esac
}

fail=0
check "$FRONT" || fail=1
check "$DOMAIN" || fail=1
check "$API/health" || fail=1

if [ "$fail" -ne 0 ]; then
  echo "Smoke failed"
  exit 1
fi

echo "Smoke passed"
