/**
 * Copyright (c) 2024-2026 Expedia Solutions, LLC. All Rights Reserved.
 * Proprietary and confidential. Unauthorized copying, distribution, or use
 * is strictly prohibited without express written permission.
 */
"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const STAR_PATH =
  "M50 5 L61.8 38.2 L97.6 38.2 L68.1 58.5 L79.4 91.8 L50 71 L20.6 91.8 L31.9 58.5 L2.4 38.2 L38.2 38.2 Z";

const STAR_COLORS: Record<number, string> = {
  0: "#E5E7EB",
  1: "#EF4444",
  2: "#F97316",
  3: "#EAB308",
  4: "#84CC16",
  5: "#F59E0B",
};

const SENTIMENTS: Record<number, { label: string; pill: string }> = {
  0: { label: "Select a star to rate", pill: "" },
  1: { label: "Terrible — we're sorry to hear that", pill: "😞 Terrible" },
  2: { label: "Poor experience", pill: "😕 Poor" },
  3: { label: "Average — room to improve", pill: "😐 Average" },
  4: { label: "Good experience — thank you!", pill: "🙂 Good" },
  5: { label: "Excellent — you made our day!", pill: "🌟 Excellent!" },
};

interface ProgressiveStarRatingProps {
  value?: number;
  onChange?: (rating: number) => void;
  size?: number;
  showLabels?: boolean;
  className?: string;
}

export function ProgressiveStarRating({
  value = 0,
  onChange,
  size = 56,
  showLabels = true,
  className,
}: ProgressiveStarRatingProps) {
  const [hover, setHover] = useState(0);
  const display = hover || value;

  return (
    <div className={cn("text-center", className)}>
      <div className="flex items-center justify-center gap-2" role="radiogroup" aria-label="Star rating">
        {[1, 2, 3, 4, 5].map((star) => {
          const filled = star <= display;
          const color = filled ? STAR_COLORS[display] || STAR_COLORS[5] : STAR_COLORS[0];
          return (
            <motion.button
              key={star}
              type="button"
              role="radio"
              aria-checked={value === star}
              aria-label={`${star} star${star > 1 ? "s" : ""}`}
              className="cursor-pointer rounded focus-visible:outline focus-visible:outline-2 focus-visible:outline-navy"
              style={{ width: size, height: size }}
              onMouseEnter={() => setHover(star)}
              onMouseLeave={() => setHover(0)}
              onClick={() => onChange?.(star)}
              whileTap={{ scale: 0.95 }}
            >
              <svg viewBox="0 0 100 100" className="h-full w-full">
                <path
                  d={STAR_PATH}
                  fill={filled ? color : "#F3F4F6"}
                  stroke={filled ? color : "#D1D5DB"}
                  strokeWidth={filled ? 2 : 3}
                />
              </svg>
            </motion.button>
          );
        })}
      </div>
      {showLabels && (
        <div className="mt-4">
          <p
            className="text-4xl font-extrabold transition-colors"
            style={{ color: display > 0 ? STAR_COLORS[display] : "var(--navy)" }}
          >
            {display > 0 ? `${display}.0` : "—"}
          </p>
          <p className="mt-1 text-sm text-text-muted">{SENTIMENTS[display].label}</p>
          {display > 0 && SENTIMENTS[display].pill && (
            <span className="mt-2 inline-block rounded-full bg-gold-pale px-3 py-1 text-xs font-bold text-gold-dark">
              {SENTIMENTS[display].pill}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
