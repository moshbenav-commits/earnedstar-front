import { ImageResponse } from "next/og";
import { BrandShareImage } from "@/lib/brand-og-image";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(<BrandShareImage variant="apple" />, {
    ...size,
  });
}
