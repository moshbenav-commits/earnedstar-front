import Image from "next/image";
import { LEATHER_MOTTO_SRC, LEATHER_WORDMARK_SRC } from "@/lib/badge-photo-assets";
import { cn } from "@/lib/utils";

type Props = {
  type?: "wordmark" | "motto";
  className?: string;
  width?: number;
  priority?: boolean;
};

/** Photoreal leather-stitched EarnedStar wordmark or motto (PNG). */
export function EarnedStarLeatherText({
  type = "wordmark",
  className,
  width = 320,
  priority = false,
}: Props) {
  const src = type === "motto" ? LEATHER_MOTTO_SRC : LEATHER_WORDMARK_SRC;
  const aspect = type === "motto" ? 2.4 : 3.2;
  const height = Math.round(width / aspect);

  return (
    <Image
      src={src}
      alt={type === "motto" ? "No order, no star. Every review is real." : "EarnedStar"}
      width={width}
      height={height}
      className={cn("h-auto w-full max-w-full object-contain", className)}
      style={{ maxWidth: width }}
      priority={priority}
    />
  );
}
