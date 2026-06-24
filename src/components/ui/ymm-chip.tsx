/**
 * Copyright (c) 2024-2026 Expedia Solutions, LLC. All Rights Reserved.
 * Proprietary and confidential. Unauthorized copying, distribution, or use
 * is strictly prohibited without express written permission.
 */
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface YmmChipProps {
  year?: number;
  make?: string;
  model?: string;
  trim?: string;
  onRemove?: () => void;
  className?: string;
}

export function YmmChip({ year, make, model, trim, onRemove, className }: YmmChipProps) {
  const parts = [year, make, model, trim].filter(Boolean);
  if (parts.length === 0) return null;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border border-accent/20 bg-accent/10 px-2.5 py-0.5 text-xs text-[#93C5FD]",
        className,
      )}
    >
      {parts.join(" · ")}
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          className="ml-0.5 rounded-full p-0.5 hover:bg-accent/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent"
          aria-label="Remove vehicle filter"
        >
          <X size={12} />
        </button>
      )}
    </span>
  );
}
