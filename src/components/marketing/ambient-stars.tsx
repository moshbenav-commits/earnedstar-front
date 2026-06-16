"use client";

import { motion } from "framer-motion";
import { EarnedStarLuckyStar, type LuckyStarVariant } from "@/components/brand/earnedstar-lucky-star";

export type AmbientStar = {
  x: string;
  y: string;
  size: number;
  delay: number;
  variant: LuckyStarVariant;
  opacity: number;
};

export const HERO_AMBIENT_STARS: AmbientStar[] = [
  { x: "4%", y: "12%", size: 22, delay: 0, variant: "navy", opacity: 0.12 },
  { x: "12%", y: "28%", size: 16, delay: 1.4, variant: "gold", opacity: 0.1 },
  { x: "8%", y: "52%", size: 28, delay: 2.2, variant: "navy", opacity: 0.14 },
  { x: "88%", y: "8%", size: 24, delay: 0.5, variant: "gold", opacity: 0.12 },
  { x: "78%", y: "38%", size: 32, delay: 2.6, variant: "navy", opacity: 0.15 },
  { x: "94%", y: "58%", size: 20, delay: 1.1, variant: "white", opacity: 0.1 },
  { x: "48%", y: "4%", size: 18, delay: 3.5, variant: "gold", opacity: 0.09 },
  { x: "62%", y: "14%", size: 16, delay: 0.9, variant: "gold", opacity: 0.08 },
  { x: "3%", y: "78%", size: 20, delay: 0.8, variant: "white", opacity: 0.09 },
  { x: "85%", y: "72%", size: 26, delay: 0.3, variant: "gold", opacity: 0.11 },
];

export function AmbientStars({ stars = HERO_AMBIENT_STARS }: { stars?: AmbientStar[] }) {
  return (
    <>
      {stars.map((star, i) => (
        <motion.div
          key={i}
          className="pointer-events-none absolute"
          style={{ left: star.x, top: star.y, opacity: star.opacity }}
          animate={{ y: [0, -14, 8, -10, 0], rotate: [0, 6, -4, 5, 0] }}
          transition={{ duration: 9 + i * 0.35, delay: star.delay, repeat: Infinity, ease: "easeInOut" }}
          aria-hidden
        >
          <EarnedStarLuckyStar size={star.size} variant={star.variant} showBadge={false} />
        </motion.div>
      ))}
    </>
  );
}
