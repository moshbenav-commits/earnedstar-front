"use client";

import React, { useState } from "react";
import { Star } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

type StarSize = "sm" | "md" | "lg";
const sizeMap: Record<StarSize, number> = { sm: 14, md: 18, lg: 28 };

interface StarRatingProps {
  rating: number;
  size?: StarSize;
  interactive?: boolean;
  onChange?: (rating: number) => void;
  className?: string;
}

export function StarRating({ rating, size = "md", interactive = false, onChange, className }: StarRatingProps) {
  const px = sizeMap[size];
  const [hover, setHover] = useState(0);
  const display = interactive ? hover || rating : rating;

  return (
    <div className={cn("flex items-center gap-0.5", className)} role="img" aria-label={`${rating} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((star) => {
        const filled = star <= Math.round(display);
        return (
          <motion.button
            key={star}
            type="button"
            disabled={!interactive}
            className={cn(interactive && "cursor-pointer rounded p-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-navy", !interactive && "cursor-default")}
            onMouseEnter={() => interactive && setHover(star)}
            onMouseLeave={() => interactive && setHover(0)}
            onClick={() => interactive && onChange?.(star)}
            whileTap={interactive ? { scale: 1.15 } : undefined}
          >
            <Star size={px} className={filled ? "fill-gold text-gold" : "fill-star-empty text-star-empty"} />
          </motion.button>
        );
      })}
    </div>
  );
}
