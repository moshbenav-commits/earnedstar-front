import type { PlanId } from "@/lib/plans";
import { cn } from "@/lib/utils";

const planStyles: Record<PlanId, string> = {
  starter: "bg-bg-elevated text-text-secondary border-border",
  growth: "bg-accent/15 text-accent border-accent/30",
  pro: "bg-purple-500/15 text-purple-300 border-purple-500/30",
  agency: "bg-warning/15 text-warning border-warning/30",
};

interface PlanBadgeProps {
  plan: PlanId;
  className?: string;
}

export function PlanBadge({ plan, className }: PlanBadgeProps) {
  const label = plan === "agency" ? "Agency ✦" : plan.charAt(0).toUpperCase() + plan.slice(1);
  return (
    <span
      className={cn(
        "inline-flex rounded-full border px-2.5 py-0.5 text-xs font-medium capitalize",
        planStyles[plan],
        className,
      )}
    >
      {label}
    </span>
  );
}
