#!/usr/bin/env python3
# Copyright (c) 2024-2026 Expedia Solutions, LLC. All Rights Reserved.
# Proprietary and confidential. Unauthorized copying, distribution, or use
# is strictly prohibited without express written permission.
"""Import brand PNGs from Figma MCP asset URLs (page 09 — 3D Master Assets).

Refresh URLs via Figma MCP download_assets, then update URLS below.
Manifest: scripts/figma-brand-manifest.json (node → path map).
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
APP = ROOT / "src/app"
MANIFEST = Path(__file__).with_name("figma-brand-manifest.json")

# Figma file 2dONXVvDVCRJoWmSrS81MM · page 22:2 — synced 2026-06-15
URLS: dict[str, str] = {
    "png/mark-3d-navy-gold.png": "https://www.figma.com/api/mcp/asset/330b338f-315f-4b6c-9d77-0b74e6b38f57",
    "png/logo-3d-horizontal-primary.png": "https://www.figma.com/api/mcp/asset/00a7ae69-2978-4abd-ac2b-c91bce17739c",
    "earnedstar-origami-logo-system.png": "https://www.figma.com/api/mcp/asset/7651ff1d-5345-4664-9fa0-2735b2d4e4bb",
    "badge/earnedstar-navy-photo-logo-64.png": "https://www.figma.com/api/mcp/asset/b49f094e-e461-42c6-ba64-1df431bb10f4",
    "badge/earnedstar-navy-photo-logo-96.png": "https://www.figma.com/api/mcp/asset/e6933f8b-feb1-4f3b-8346-ba1ea4e46c48",
    "badge/earnedstar-navy-photo-logo-128.png": "https://www.figma.com/api/mcp/asset/8e2d7222-3ad5-44f0-b30f-5719dbee6303",
    "badge/earnedstar-navy-photo-logo-192.png": "https://www.figma.com/api/mcp/asset/a6694015-25d2-4d0d-be3f-0fdf578e8d56",
    "badge/earnedstar-navy-photo-logo-256.png": "https://www.figma.com/api/mcp/asset/49f59700-f180-407d-8bbe-1ee945a917c3",
    "badge/earnedstar-navy-photo-logo-512.png": "https://www.figma.com/api/mcp/asset/73435658-1edb-4b0d-abfb-478a8869ccfa",
    "badge/earnedstar-gold-photo-logo-64.png": "https://www.figma.com/api/mcp/asset/1dd8ed95-685e-43a4-8517-562c6840d54e",
    "badge/earnedstar-gold-photo-logo-96.png": "https://www.figma.com/api/mcp/asset/0a4ff54d-d3e1-4665-ba2b-227808d6ce2b",
    "badge/earnedstar-gold-photo-logo-128.png": "https://www.figma.com/api/mcp/asset/7d6f7291-8438-4159-9c42-0153f1a98b80",
    "badge/earnedstar-gold-photo-logo-192.png": "https://www.figma.com/api/mcp/asset/c7937eab-b3a6-42d9-ac90-1bf88c0a4c45",
    "badge/earnedstar-gold-photo-logo-256.png": "https://www.figma.com/api/mcp/asset/3527b4e4-c9f6-43e7-a462-be6714b5d76f",
    "badge/earnedstar-gold-photo-logo-512.png": "https://www.figma.com/api/mcp/asset/23fd5f09-0c88-492f-8298-e5379ac25edf",
    "badge/earnedstar-white-photo-logo-64.png": "https://www.figma.com/api/mcp/asset/bd28e35b-eeb5-4957-a2d3-17c7a97fe909",
    "badge/earnedstar-white-photo-logo-96.png": "https://www.figma.com/api/mcp/asset/63260451-f1c5-4bfc-a7be-ca8d886faa54",
    "badge/earnedstar-white-photo-logo-128.png": "https://www.figma.com/api/mcp/asset/867a9dee-9345-4ef0-86fb-a99c6ebfa7cd",
    "badge/earnedstar-white-photo-logo-192.png": "https://www.figma.com/api/mcp/asset/cb3d1740-d207-4375-bd89-c7994dada005",
    "badge/earnedstar-white-photo-logo-256.png": "https://www.figma.com/api/mcp/asset/21463ef2-93c2-40ed-8b89-8bd5bc47e38a",
    "badge/earnedstar-white-photo-logo-512.png": "https://www.figma.com/api/mcp/asset/786bf554-cb8b-43e5-8448-89f5c0baa25d",
    "leather/wordmark-navy-gold.png": "https://www.figma.com/api/mcp/asset/5d5e4228-76cd-41d3-9546-0aeade924ad3",
    "leather/motto-navy-gold.png": "https://www.figma.com/api/mcp/asset/8667ac00-74f8-42c2-962e-e819068d7e23",
    "photo/earnedstar-photo-logo-16.png": "https://www.figma.com/api/mcp/asset/4a1e15d5-fa6b-44e4-9490-9580bc37e5c3",
    "photo/earnedstar-photo-logo-32.png": "https://www.figma.com/api/mcp/asset/44ecda0e-a247-47b2-9cd5-52a6a6c66ea9",
    "photo/earnedstar-photo-logo-48.png": "https://www.figma.com/api/mcp/asset/644d1087-804a-4dca-b615-a5450b25dca4",
    "photo/earnedstar-photo-logo-1024.png": "https://www.figma.com/api/mcp/asset/90707bfa-65da-42b9-9ba4-50884293fcc8",
    "photo/earnedstar-photo-logo-hero-1600.png": "https://www.figma.com/api/mcp/asset/26de2d2d-2ed6-4ed2-8e17-15b14728b50d",
    "png/mark-3d-all-gold.png": "https://www.figma.com/api/mcp/asset/fb9814df-2c57-4eab-a0fe-1639bfad1186",
    "png/mark-3d-all-white.png": "https://www.figma.com/api/mcp/asset/6d09ad35-18d0-4289-9dab-4ac1d44c797e",
}

# Photo ladder shares navy badge sources for mid sizes
PHOTO_ALIASES: dict[str, str] = {
    "photo/earnedstar-photo-logo-64.png": "badge/earnedstar-navy-photo-logo-64.png",
    "photo/earnedstar-photo-logo-96.png": "badge/earnedstar-navy-photo-logo-96.png",
    "photo/earnedstar-photo-logo-128.png": "badge/earnedstar-navy-photo-logo-128.png",
    "photo/earnedstar-photo-logo-192.png": "badge/earnedstar-navy-photo-logo-192.png",
    "photo/earnedstar-photo-logo-256.png": "badge/earnedstar-navy-photo-logo-256.png",
    "photo/earnedstar-photo-logo-512.png": "badge/earnedstar-navy-photo-logo-512.png",
}

SQUARE_SIZES: dict[str, int] = {
    rel: int(entry["size"])
    for entry in json.loads(MANIFEST.read_text())["imports"]
    if "size" in entry
    for rel in [entry["dest"]]
}


def fetch(url: str) -> bytes:
    proc = subprocess.run(["curl", "-fsSL", url], check=True, capture_output=True)
    return proc.stdout


def save_image(data: bytes, dest: Path, square: int | None) -> None:
    img = Image.open(io.BytesIO(data)).convert("RGBA")
    if square and (img.width != square or img.height != square):
        img = img.resize((square, square), Image.Resampling.LANCZOS)
    dest.parent.mkdir(parents=True, exist_ok=True)
    img.save(dest, "PNG", optimize=True)
    print(f"wrote {dest.relative_to(ROOT)} {img.size}")


def webp_for_png(png: Path) -> None:
    img = Image.open(png).convert("RGBA")
    webp = png.with_suffix(".webp")
    img.save(webp, "WEBP", quality=88, method=6)


def generate_app_icons(mark_png: Path) -> None:
    mark = Image.open(mark_png).convert("RGBA")
    for name, px in [("icon.png", 32), ("apple-icon.png", 180)]:
        out = APP / name
        resized = mark.resize((px, px), Image.Resampling.LANCZOS)
        resized.save(out, "PNG", optimize=True)
        print(f"wrote {out.relative_to(ROOT)} {resized.size}")
    fav = mark.resize((32, 32), Image.Resampling.LANCZOS)
    fav.save(APP / "favicon.ico", format="ICO", sizes=[(32, 32), (16, 16)])


def main() -> int:
    written: dict[str, Path] = {}

    for rel, url in URLS.items():
        dest = BRAND / rel
        try:
            save_image(fetch(url), dest, SQUARE_SIZES.get(rel))
            written[rel] = dest
        except subprocess.CalledProcessError:
            print(f"FAIL {rel}", file=sys.stderr)
            return 1

    for photo_rel, src_rel in PHOTO_ALIASES.items():
        src = written.get(src_rel) or BRAND / src_rel
        dest = BRAND / photo_rel
        dest.write_bytes(src.read_bytes())
        print(f"aliased {photo_rel} ← {src_rel}")

    ref = BRAND / "png/brand-system-reference.png"
    ref.write_bytes((BRAND / "earnedstar-origami-logo-system.png").read_bytes())

    subprocess.run([sys.executable, str(ROOT / "scripts/crop-brand-3d-assets.py")], check=True)

    for folder in ("badge", "photo"):
        for png in sorted((BRAND / folder).glob("*.png")):
            webp_for_png(png)

    generate_app_icons(BRAND / "png/mark-3d-navy-gold.png")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
