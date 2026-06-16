import { ImageResponse } from "next/og";
import { BrandShareImage } from "@/lib/brand-og-image";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(<BrandShareImage variant="icon" />, {
    ...size,
  });
}
