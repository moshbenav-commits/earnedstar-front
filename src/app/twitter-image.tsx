/**
 * Copyright (c) 2024-2026 Expedia Solutions, LLC. All Rights Reserved.
 * Proprietary and confidential. Unauthorized copying, distribution, or use
 * is strictly prohibited without express written permission.
 */
import { ImageResponse } from "next/og";
import { BrandShareImage } from "@/lib/brand-og-image";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "EarnedStar — verified reviews platform";

export default function TwitterImage() {
  return new ImageResponse(<BrandShareImage variant="og" />, {
    ...size,
  });
}
