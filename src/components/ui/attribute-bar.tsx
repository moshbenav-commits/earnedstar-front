/**
 * Copyright (c) 2024-2026 Expedia Solutions, LLC. All Rights Reserved.
 * Proprietary and confidential. Unauthorized copying, distribution, or use
 * is strictly prohibited without express written permission.
 */
"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface AttributeBarProps {
  label: string;
  icon?: LucideIcon;
  score: number;
  className?: string;
}

export function AttributeBar({ label, icon: Icon, score, className }: AttributeBarProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const pct = Math.min(100, (score / 5) * 100);

  return (
    <div ref={ref} className={cn("flex items-center gap-3", className)}>
      {Icon && <Icon size={16} className="shrink-0 text-text-secondary" aria-hidden />}
      <span className="w-36 shrink-0 text-xs font-medium uppercase tracking-wider text-text-secondary">
        {label}
      </span>
      <div className="h-2 flex-1 overflow-hidden rounded-full bg-bg-elevated">
        <motion.div
          className="h-full rounded-full bg-accent"
          initial={{ width: 0 }}
          animate={inView ? { width: `${pct}%` } : { width: 0 }}
          transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
        />
      </div>
      <span className="w-6 text-right text-sm text-text-primary">{score.toFixed(1)}</span>
    </div>
  );
}
