/**
 * Copyright (c) 2024-2026 Expedia Solutions, LLC. All Rights Reserved.
 * Proprietary and confidential. Unauthorized copying, distribution, or use
 * is strictly prohibited without express written permission.
 */
"use client";

import { Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTheme } from "@/components/theme/theme-provider";

type ThemeToggleProps = {
  className?: string;
  /** Compact switch only — for inside review card header */
  compact?: boolean;
  /** Adapt colors when sitting on a light review card */
  onLightCard?: boolean;
};

export function ThemeToggle({ className, compact = false, onLightCard = false }: ThemeToggleProps) {
  const { theme, toggleTheme, canToggle } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isDark}
      aria-disabled={!canToggle}
      disabled={!canToggle}
      aria-label={
        !canToggle
          ? `Theme set to ${isDark ? "dark" : "light"} mode`
          : isDark
            ? "Switch to light mode"
            : "Switch to dark mode"
      }
      onClick={toggleTheme}
      className={cn(
        "group inline-flex items-center gap-2 rounded-full border transition duration-200",
        onLightCard
          ? "border-border bg-surface-2 text-navy hover:border-gold/40 hover:bg-gold-pale/60"
          : "border-white/20 bg-white/10 text-white hover:border-gold/45 hover:bg-white/15",
        compact ? "p-1.5" : "px-3 py-1.5 text-xs font-semibold uppercase tracking-wider",
        !canToggle && "cursor-default opacity-60 hover:border-white/20 hover:bg-white/10",
        className,
      )}
      data-surface={onLightCard ? "light" : "dark"}
    >
      <span
        className={cn(
          "relative flex h-5 w-9 shrink-0 items-center rounded-full border transition",
          isDark
            ? onLightCard
              ? "border-gold/50 bg-navy"
              : "border-gold/40 bg-[#010509]"
            : onLightCard
              ? "border-border bg-white"
              : "border-white/30 bg-white/20",
        )}
        aria-hidden
      >
        <span
          className={cn(
            "absolute h-3.5 w-3.5 rounded-full bg-gold shadow-sm transition-transform duration-200",
            isDark ? "translate-x-[18px]" : "translate-x-1",
          )}
        />
      </span>
      {!compact ? (
        <>
          {isDark ? (
            <Moon size={14} className="text-gold" />
          ) : (
            <Sun size={14} className={onLightCard ? "text-gold-dark" : "text-gold"} />
          )}
          <span>{isDark ? "Dark mode" : "Light mode"}</span>
        </>
      ) : (
        <span className="sr-only">{isDark ? "Dark mode" : "Light mode"}</span>
      )}
    </button>
  );
}
