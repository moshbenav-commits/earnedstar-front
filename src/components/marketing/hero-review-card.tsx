"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { EarnedStarMark } from "@/components/brand/earnedstar-mark";
import { VerifiedBadge } from "@/components/ui/verified-badge";

const STAR_SIZE = 48;
const STAR_GAP = 10;
const INIT_ROTATIONS = [-18, 14, -12, 20, -8];
const SPRINGS = [
  { damping: 13, stiffness: 162 },
  { damping: 11, stiffness: 178 },
  { damping: 14, stiffness: 156 },
  { damping: 12, stiffness: 170 },
  { damping: 10, stiffness: 185 },
];

function StarGhost({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" aria-hidden>
      <path
        d="M50 6 L61 35 L91 35 L68 54 L77 82 L50 65 L23 82 L32 54 L9 35 L39 35 Z"
        fill="rgba(15,32,68,0.06)"
        stroke="rgba(15,32,68,0.18)"
        strokeWidth={1.5}
        strokeDasharray="4 3"
      />
    </svg>
  );
}

export function HeroReviewCard() {
  const [dropped, setDropped] = useState(0);
  const [exiting, setExiting] = useState(false);
  const [loopKey, setLoopKey] = useState(0);

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];
    for (let i = 0; i < 5; i++) {
      timers.push(setTimeout(() => setDropped(i + 1), i * 650 + 500));
    }
    const exitAt = 4 * 650 + 500 + 2200;
    timers.push(setTimeout(() => setExiting(true), exitAt));
    timers.push(
      setTimeout(() => {
        setExiting(false);
        setDropped(0);
        setLoopKey((k) => k + 1);
      }, exitAt + 480),
    );
    return () => timers.forEach(clearTimeout);
  }, [loopKey]);

  const starAnimate = (i: number) => {
    if (dropped > i && !exiting) return { y: 0, opacity: 1, scale: 1, rotate: 0 };
    if (dropped > i && exiting) return { y: -240, opacity: 0, scale: 0.55, rotate: INIT_ROTATIONS[i] };
    return { y: -420, opacity: 0, scale: 0.8, rotate: INIT_ROTATIONS[i] };
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 24, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.55, delay: 0.3 }}
      className="w-full max-w-md overflow-visible"
    >
      <div className="overflow-hidden rounded-2xl bg-white shadow-[0_4px_12px_rgba(0,0,0,0.12),0_24px_56px_rgba(0,0,6,0.35)]">
        <div className="h-1 bg-gradient-to-r from-navy via-gold to-navy" />

        <div className="p-6 sm:p-7">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <EarnedStarMark size={28} centerStyle="none" render="photo" />
              <span className="text-sm font-bold text-navy">EarnedStar</span>
            </div>
            <VerifiedBadge />
          </div>

          <blockquote className="border-l-[3px] border-gold pl-4 text-[15px] leading-relaxed text-navy">
            &ldquo;Every review tied to a real order. The badge on our store finally means something —
            buyers trust the ratings because they were earned.&rdquo;
          </blockquote>

          <div className="mt-5 flex justify-center">
            <div className="flex" style={{ gap: STAR_GAP }}>
              {[0, 1, 2, 3, 4].map((i) => (
                <div key={i} className="relative" style={{ width: STAR_SIZE, height: STAR_SIZE }}>
                  <motion.div
                    className="absolute inset-0"
                    animate={{ opacity: dropped > i ? 0 : 1 }}
                    transition={{ duration: 0.15 }}
                  >
                    <StarGhost size={STAR_SIZE} />
                  </motion.div>
                  <motion.div
                    key={`star-${loopKey}-${i}`}
                    className="absolute inset-0"
                    initial={{ y: -420, opacity: 0, scale: 0.8, rotate: INIT_ROTATIONS[i] }}
                    animate={starAnimate(i)}
                    transition={
                      dropped > i && !exiting
                        ? { type: "spring", ...SPRINGS[i] }
                        : { duration: 0.4, delay: exiting && dropped > i ? i * 0.05 : 0 }
                    }
                  >
                    <EarnedStarMark size={STAR_SIZE} centerStyle="none" render="photo" />
                  </motion.div>
                </div>
              ))}
            </div>
          </div>

          <motion.div
            animate={{ opacity: dropped === 5 && !exiting ? 1 : 0, y: dropped === 5 && !exiting ? 0 : 8 }}
            className="mt-4 text-center"
          >
            <span className="text-2xl font-extrabold text-navy">5.0</span>
            <span className="ml-2 text-sm font-semibold text-text-muted">out of 5 · Exceptional</span>
          </motion.div>

          <div className="mt-5 flex items-center justify-between border-t border-border pt-4">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-navy-mid to-dark-bg text-sm font-bold text-gold">
                M
              </div>
              <div>
                <p className="text-sm font-bold text-navy">Marcus T.</p>
                <p className="text-xs text-text-faint">Verified purchase · 2 days ago</p>
              </div>
            </div>
            <p className="text-right text-xs text-text-muted">
              2,847 reviews
              <br />
              <span className="font-semibold text-gold">4.9 avg</span>
            </p>
          </div>
        </div>
      </div>

      <div className="mt-4 flex justify-center gap-1.5">
        {[0, 1, 2, 3, 4].map((i) => (
          <motion.span
            key={`dot-${loopKey}-${i}`}
            className="h-1.5 w-1.5 rounded-full"
            animate={{
              background: dropped > i && !exiting ? "rgba(245,158,11,0.9)" : "rgba(255,255,255,0.25)",
              scale: dropped > i && !exiting ? 1.3 : 1,
            }}
          />
        ))}
      </div>
    </motion.div>
  );
}
