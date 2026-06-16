import { AlertTriangle, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface FraudBadgeProps {
  score: number;
  className?: string;
}

export function FraudBadge({ score, className }: FraudBadgeProps) {
  if (score <= 30) return null;

  if (score <= 60) {
    return (
      <span
        className={cn(
          "inline-flex items-center gap-1 rounded-full border border-warning/25 bg-warning-bg px-2 py-0.5 text-xs text-warning",
          className,
        )}
      >
        <AlertTriangle size={14} aria-hidden />
        Under Review
      </span>
    );
  }

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border border-danger/25 bg-danger-bg px-2 py-0.5 text-xs text-danger",
        className,
      )}
    >
      <XCircle size={14} aria-hidden />
      Flagged
    </span>
  );
}
