import { ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

interface VerifiedBadgeProps {
  size?: "sm" | "md";
  showLabel?: boolean;
  className?: string;
}

export function VerifiedBadge({ size = "md", showLabel = true, className }: VerifiedBadgeProps) {
  const iconSize = size === "sm" ? 12 : 14;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border border-green/20 bg-green-pale font-bold uppercase tracking-wider text-green-dark",
        size === "sm" ? "px-2 py-0.5 text-[10px]" : "px-2.5 py-0.5 text-[11px]",
        className,
      )}
    >
      <ShieldCheck size={iconSize} aria-hidden />
      {showLabel && <span>Verified Purchase</span>}
    </span>
  );
}
