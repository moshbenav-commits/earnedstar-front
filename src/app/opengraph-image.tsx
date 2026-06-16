import { ImageResponse } from "next/og";
import { BrandShareImage } from "@/lib/brand-og-image";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "EarnedStar — verified reviews platform";

export default function OpenGraphImage() {
  return new ImageResponse(<BrandShareImage variant="og" />, {
    ...size,
  });
}
