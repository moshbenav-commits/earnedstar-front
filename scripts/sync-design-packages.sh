#!/usr/bin/env bash
# Copy @expedia/design-system + @expedia/design-lab from expedia-parts-front into this repo.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
SRC="${EXPEDIA_PARTS_FRONT:-$ROOT/../expedia-parts-front}/packages"

if [[ ! -d "$SRC/expedia-design-system" ]]; then
  echo "ERROR: missing $SRC/expedia-design-system (set EXPEDIA_PARTS_FRONT if needed)" >&2
  exit 1
fi

mkdir -p "$ROOT/packages"
rsync -a --delete --exclude node_modules --exclude .next \
  "$SRC/expedia-design-system/" "$ROOT/packages/expedia-design-system/"
rsync -a --delete --exclude node_modules --exclude .next \
  "$SRC/expedia-design-lab/" "$ROOT/packages/expedia-design-lab/"

echo "Synced design packages into earnedstar/packages/"
echo "Run: npm install && npm run build"
