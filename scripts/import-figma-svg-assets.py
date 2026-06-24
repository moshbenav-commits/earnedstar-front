#!/usr/bin/env python3
# Copyright (c) 2024-2026 Expedia Solutions, LLC. All Rights Reserved.
# Proprietary and confidential. Unauthorized copying, distribution, or use
# is strictly prohibited without express written permission.
"""Sync SVG fallbacks from Figma page 10 — SVG Refinement.

1. Regenerate canonical SVGs via export-brand-svgs.mjs (matches Figma refined layering).
2. Pull Size QA preview PNGs from Figma (navy) and resize gold/white masters.
"""
from __future__ import annotations

import io
import json
import subprocess
import sys
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
BRAND = ROOT / "public/brand"
MANIFEST = Path(__file__).with_name("figma-svg-manifest.json")

# Figma MCP asset URLs — page 27:2 (synced 2026-06-15)
NAVY_PREVIEWS: dict[str, tuple[str, int]] = {
    "svg-preview/earnedstar-origami-navy-64.png": (
        "https://www.figma.com/api/mcp/asset/ccff9e6c-6ae2-40f2-a2fc-fe2b2762ca4e",
        64,
    ),
    "svg-preview/earnedstar-origami-navy-128.png": (
        "https://www.figma.com/api/mcp/asset/f027c354-21f6-4233-b02d-fb65cd42ceb9",
        128,
    ),
    "svg-preview/earnedstar-origami-navy-256.png": (
        "https://www.figma.com/api/mcp/asset/87647f68-4eab-4ad7-baca-2fd53a7ac4f3",
        256,
    ),
    "svg-preview/earnedstar-origami-navy-512.png": (
        "https://www.figma.com/api/mcp/asset/0948b3e0-f2f1-4810-93c4-f906acd9dbd7",
        512,
    ),
}

MASTER_PREVIEWS: dict[str, tuple[str, str]] = {
    "svg-preview/earnedstar-origami-gold-master.png": (
        "https://www.figma.com/api/mcp/asset/78d8fc1f-a751-488c-9024-155fb7e06db5",
        "gold",
    ),
    "svg-preview/earnedstar-origami-white-master.png": (
        "https://www.figma.com/api/mcp/asset/073cd6fd-df11-4ff1-a4fb-fbac13b3b4d0",
        "white",
    ),
}

PREVIEW_SIZES = [64, 128, 256, 512]


def fetch(url: str) -> bytes:
    return subprocess.run(["curl", "-fsSL", url], check=True, capture_output=True).stdout


def save_png(data: bytes, dest: Path, size: int | None = None) -> None:
    img = Image.open(io.BytesIO(data)).convert("RGBA")
    if size and (img.width != size or img.height != size):
        img = img.resize((size, size), Image.Resampling.LANCZOS)
    dest.parent.mkdir(parents=True, exist_ok=True)
    img.save(dest, "PNG", optimize=True)
    print(f"wrote {dest.relative_to(ROOT)} {img.size}")


def resize_master(master: Path, variant: str) -> None:
    img = Image.open(master).convert("RGBA")
    for size in PREVIEW_SIZES:
        out = BRAND / "svg-preview" / f"earnedstar-origami-{variant}-{size}.png"
        resized = img.resize((size, size), Image.Resampling.LANCZOS)
        resized.save(out, "PNG", optimize=True)
        print(f"wrote {out.relative_to(ROOT)} {resized.size}")


def main() -> int:
    subprocess.run(["node", str(ROOT / "scripts/export-brand-svgs.mjs")], check=True, cwd=ROOT)

    preview_dir = BRAND / "svg-preview"
    preview_dir.mkdir(parents=True, exist_ok=True)

    for rel, (url, size) in NAVY_PREVIEWS.items():
        dest = BRAND / rel
        try:
            save_png(fetch(url), dest, size)
        except subprocess.CalledProcessError:
            print(f"FAIL {rel}", file=sys.stderr)
            return 1

    for rel, (url, _variant) in MASTER_PREVIEWS.items():
        dest = BRAND / rel
        try:
            save_png(fetch(url), dest)
        except subprocess.CalledProcessError:
            print(f"FAIL {rel}", file=sys.stderr)
            return 1

    resize_master(preview_dir / "earnedstar-origami-gold-master.png", "gold")
    resize_master(preview_dir / "earnedstar-origami-white-master.png", "white")

    manifest = json.loads(MANIFEST.read_text())
    manifest["syncedAt"] = "2026-06-15"
    MANIFEST.write_text(json.dumps(manifest, indent=2) + "\n")

    svg_count = len(list((BRAND / "svg").glob("*.svg")))
    png_count = len(list(preview_dir.glob("earnedstar-origami-*-*.png")))
    print(f"synced {svg_count} SVGs + {png_count} preview PNGs from Figma page 10")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
