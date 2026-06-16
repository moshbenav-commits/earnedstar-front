#!/usr/bin/env python3
"""Import brand PNGs from Figma MCP asset URLs (page 09 — 3D Master Assets)."""
from __future__ import annotations

import io
import subprocess
import sys
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
BRAND = ROOT / "public/brand"

# url, destination relative to public/brand, optional square target px
IMPORTS: list[tuple[str, str, int | None]] = [
    # Primary 3D masters (already placed — idempotent)
    ("https://www.figma.com/api/mcp/asset/c603d166-b023-4ed5-841d-bec8cfde70f9", "png/mark-3d-navy-gold.png", None),
    ("https://www.figma.com/api/mcp/asset/6ceed64f-317c-423c-acc7-030e7b78b9ff", "png/logo-3d-horizontal-primary.png", None),
    ("https://www.figma.com/api/mcp/asset/2c54a9d7-22da-4112-9ce4-94f2cbd2a47b", "earnedstar-origami-logo-system.png", None),
    # Navy photo badges
    ("https://www.figma.com/api/mcp/asset/cca9f36b-f989-49ae-b6a2-965298f800f1", "badge/earnedstar-navy-photo-logo-64.png", 64),
    ("https://www.figma.com/api/mcp/asset/05ee2eb1-44eb-4bf7-b241-1e58a766aa83", "badge/earnedstar-navy-photo-logo-96.png", 96),
    ("https://www.figma.com/api/mcp/asset/aa982f92-cceb-49bd-89ec-835c9547bd66", "badge/earnedstar-navy-photo-logo-128.png", 128),
    ("https://www.figma.com/api/mcp/asset/be5e35c7-8b5b-4972-a305-ea5e0c11b543", "badge/earnedstar-navy-photo-logo-192.png", 192),
    ("https://www.figma.com/api/mcp/asset/87b3c86b-cf28-4b52-ac6f-f922f9ba6cdf", "badge/earnedstar-navy-photo-logo-256.png", 256),
    ("https://www.figma.com/api/mcp/asset/535c21a6-c4c2-41ad-bf09-8fb8bafeec34", "badge/earnedstar-navy-photo-logo-512.png", 512),
    # Gold photo badges
    ("https://www.figma.com/api/mcp/asset/886d278a-ae5b-43c9-8d94-459f34566549", "badge/earnedstar-gold-photo-logo-64.png", 64),
    ("https://www.figma.com/api/mcp/asset/fc297095-9e89-4a2b-85d0-0bc2c059860a", "badge/earnedstar-gold-photo-logo-96.png", 96),
    ("https://www.figma.com/api/mcp/asset/d44f210f-7b6e-4316-af8a-e78d41a04442", "badge/earnedstar-gold-photo-logo-128.png", 128),
    ("https://www.figma.com/api/mcp/asset/57b2a050-44bd-4820-b17e-33019f758c87", "badge/earnedstar-gold-photo-logo-192.png", 192),
    ("https://www.figma.com/api/mcp/asset/850212b1-962b-4a2c-b9a7-594fe835bc63", "badge/earnedstar-gold-photo-logo-256.png", 256),
    ("https://www.figma.com/api/mcp/asset/23bac785-e8d4-444d-8a88-88e50f758de9", "badge/earnedstar-gold-photo-logo-512.png", 512),
    # White photo badges
    ("https://www.figma.com/api/mcp/asset/b49df1a4-98bb-4faf-8d80-c374ab788d4d", "badge/earnedstar-white-photo-logo-64.png", 64),
    ("https://www.figma.com/api/mcp/asset/e8057724-f082-4036-ac7a-b211a14c82eb", "badge/earnedstar-white-photo-logo-96.png", 96),
    ("https://www.figma.com/api/mcp/asset/6e43173f-4b36-405b-9cf8-8639e15103a6", "badge/earnedstar-white-photo-logo-128.png", 128),
    ("https://www.figma.com/api/mcp/asset/d8b18b3e-20a6-4176-8166-5eb6476dfae6", "badge/earnedstar-white-photo-logo-192.png", 192),
    ("https://www.figma.com/api/mcp/asset/7cf49176-7550-4268-ab73-5063c0c68b52", "badge/earnedstar-white-photo-logo-256.png", 256),
    ("https://www.figma.com/api/mcp/asset/f5052f23-4e1a-420a-b546-4e3c691b88e9", "badge/earnedstar-white-photo-logo-512.png", 512),
    # Leather text
    ("https://www.figma.com/api/mcp/asset/54f9f52a-4472-4b23-9a1c-9e1486632d11", "leather/wordmark-navy-gold.png", None),
    ("https://www.figma.com/api/mcp/asset/bee42466-4be8-4ba8-810c-f00cee32aa03", "leather/motto-navy-gold.png", None),
    # Mark-only photo ladder (navy)
    ("https://www.figma.com/api/mcp/asset/a19251a0-dece-4454-a3ef-5ac483a8a244", "photo/earnedstar-photo-logo-16.png", 16),
    ("https://www.figma.com/api/mcp/asset/737b3d80-7630-4f16-8ec2-9247b85eca66", "photo/earnedstar-photo-logo-32.png", 32),
    ("https://www.figma.com/api/mcp/asset/c12692d3-fa08-474e-86fd-cb42dfb95b23", "photo/earnedstar-photo-logo-48.png", 48),
    ("https://www.figma.com/api/mcp/asset/cca9f36b-f989-49ae-b6a2-965298f800f1", "photo/earnedstar-photo-logo-64.png", 64),
    ("https://www.figma.com/api/mcp/asset/05ee2eb1-44eb-4bf7-b241-1e58a766aa83", "photo/earnedstar-photo-logo-96.png", 96),
    ("https://www.figma.com/api/mcp/asset/aa982f92-cceb-49bd-89ec-835c9547bd66", "photo/earnedstar-photo-logo-128.png", 128),
    ("https://www.figma.com/api/mcp/asset/be5e35c7-8b5b-4972-a305-ea5e0c11b543", "photo/earnedstar-photo-logo-192.png", 192),
    ("https://www.figma.com/api/mcp/asset/87b3c86b-cf28-4b52-ac6f-f922f9ba6cdf", "photo/earnedstar-photo-logo-256.png", 256),
    ("https://www.figma.com/api/mcp/asset/9c2968c4-9313-4a48-a9d5-f9228aa41562", "photo/earnedstar-photo-logo-1024.png", 1024),
    ("https://www.figma.com/api/mcp/asset/feb44ce3-decc-499e-b62a-7ab9fc41a5d4", "photo/earnedstar-photo-logo-hero-1600.png", 1024),
    # Color variant marks (from brand sheet crops + Figma masters)
    ("https://www.figma.com/api/mcp/asset/a21ce86a-f4da-4b68-bcc8-457b5908aa0a", "png/mark-3d-all-gold.png", 250),
    ("https://www.figma.com/api/mcp/asset/a6caf587-ac01-4c68-a2cf-e2c589554fd1", "png/mark-3d-all-white.png", 250),
]


def fetch(url: str) -> bytes:
    proc = subprocess.run(
        ["curl", "-fsSL", url],
        check=True,
        capture_output=True,
    )
    return proc.stdout


def save_image(data: bytes, dest: Path, square: int | None) -> None:
    img = Image.open(io.BytesIO(data)).convert("RGBA")
    if square:
        if img.width != square or img.height != square:
            img = img.resize((square, square), Image.Resampling.LANCZOS)
    dest.parent.mkdir(parents=True, exist_ok=True)
    img.save(dest, "PNG", optimize=True)
    print(f"wrote {dest.relative_to(ROOT)} {img.size}")


def webp_for_png(png: Path) -> None:
    img = Image.open(png).convert("RGBA")
    webp = png.with_suffix(".webp")
    img.save(webp, "WEBP", quality=88, method=6)
    print(f"wrote {webp.relative_to(ROOT)}")


def main() -> int:
    for url, rel, square in IMPORTS:
        dest = BRAND / rel
        try:
            save_image(fetch(url), dest, square)
        except subprocess.CalledProcessError as exc:
            print(f"FAIL {rel}: curl exit {exc.returncode}", file=sys.stderr)
            return 1

    ref = BRAND / "png/brand-system-reference.png"
    ref.write_bytes((BRAND / "earnedstar-origami-logo-system.png").read_bytes())
    print(f"copied brand-system-reference.png")

    crop_script = ROOT / "scripts/crop-brand-3d-assets.py"
    subprocess.run([sys.executable, str(crop_script)], check=True)

    for folder in ("badge", "photo"):
        for png in (BRAND / folder).glob("*.png"):
            webp_for_png(png)

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
