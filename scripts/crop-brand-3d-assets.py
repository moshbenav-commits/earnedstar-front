#!/usr/bin/env python3
"""Extract photorealistic 3D logo PNGs from earnedstar-origami-logo-system.png."""
from __future__ import annotations

import shutil
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
SRC = ROOT / "public/brand/earnedstar-origami-logo-system.png"
OUT = ROOT / "public/brand/png"

CROPS: dict[str, tuple[int, int, int, int]] = {
    "mark-3d-navy-gold.png": (48, 140, 230, 330),
    "mark-3d-primary-star.png": (48, 62, 168, 178),
    "logo-3d-horizontal-primary.png": (28, 48, 545, 178),
    "mark-3d-navy-gold-variant.png": (548, 558, 688, 662),
    "mark-3d-all-gold.png": (668, 558, 808, 662),
    "mark-3d-all-white.png": (788, 558, 928, 662),
}


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    img = Image.open(SRC).convert("RGBA")
    for name, box in CROPS.items():
        cropped = img.crop(box)
        cropped.save(OUT / name, "PNG")
        print(f"wrote {name} {cropped.size}")
    shutil.copy(SRC, OUT / "brand-system-reference.png")
    print(f"done → {OUT}")


if __name__ == "__main__":
    main()
