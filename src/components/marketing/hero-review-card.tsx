"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { EarnedStarMark } from "@/components/brand/earnedstar-mark";
import { VerifiedBadge } from "@/components/ui/verified-badge";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { useTheme } from "@/components/theme/theme-provider";
import { cn } from "@/lib/utils";

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

function StarGhost({ size, light }: { size: number; light: boolean }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" aria-hidden>
      <path
        d="M50 6 L61 35 L91 35 L68 54 L77 82 L50 65 L23 82 L32 54 L9 35 L39 35 Z"
        fill={light ? "rgba(15,32,68,0.04)" : "rgba(255,255,255,0.04)"}
        stroke={light ? "rgba(15,32,68,0.22)" : "rgba(255,255,255,0.22)"}
        strokeWidth={1.5}
        strokeDasharray="4 3"
      />
    </svg>
  );
}

const MAX_PLAYS = 2;

export function HeroReviewCard() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [dropped, setDropped] = useState(0);
  const [exiting, setExiting] = useState(false);
  const [loopKey, setLoopKey] = useState(0);

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];
    for (let i = 0; i < 5; i++) {
      timers.push(setTimeout(() => setDropped(i + 1), i * 650 + 500));
    }
    const exitAt = 4 * 650 + 500 + 2200;

    if (loopKey < MAX_PLAYS - 1) {
      timers.push(setTimeout(() => setExiting(true), exitAt));
      timers.push(
        setTimeout(() => {
          setExiting(false);
          setDropped(0);
          setLoopKey((k) => k + 1);
        }, exitAt + 480),
      );
    }

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
      <AnimatePresence mode="wait">
        <motion.div
          key={isDark ? "dark-card" : "light-card"}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.28 }}
          className={cn(
            "gold-seam overflow-hidden rounded-2xl",
            isDark
              ? "card-surface-dark bg-dark-bg/90 shadow-[0_4px_12px_rgba(0,0,0,0.35),0_24px_56px_rgba(0,0,0,0.45)]"
              : "card-surface bg-white shadow-[0_4px_12px_rgba(15,32,68,0.1),0_20px_44px_rgba(15,32,68,0.12)]",
          )}
          data-surface={isDark ? "dark" : "light"}
        >
          <div className="h-1 bg-gradient-to-r from-navy via-gold to-navy" />

          <div className="p-6 sm:p-7">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <EarnedStarMark size={28} centerStyle="none" />
                <span className={cn("text-sm font-bold", isDark ? "text-white" : "text-navy")}>
                  EarnedStar
                </span>
              </div>
              <div className="flex items-center gap-2">
                <ThemeToggle compact onLightCard={!isDark} />
                <VerifiedBadge />
              </div>
            </div>

            <blockquote
              className={cn(
                "border-l-[3px] border-gold pl-4 text-[15px] leading-relaxed",
                isDark ? "text-white/85" : "text-navy",
              )}
            >
              &ldquo;Every review tied to a real order. Shoppers finally trust our ratings because they
              know each one was earned — not posted by anyone with a browser.&rdquo;
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
                      <StarGhost size={STAR_SIZE} light={!isDark} />
                    </motion.div>
                    <motion.div
                      key={`star-${loopKey}-${i}-${isDark ? "d" : "l"}`}
                      className="absolute inset-0"
                      initial={{ y: -420, opacity: 0, scale: 0.8, rotate: INIT_ROTATIONS[i] }}
                      animate={starAnimate(i)}
                      transition={
                        dropped > i && !exiting
                          ? { type: "spring", ...SPRINGS[i] }
                          : { duration: 0.4, delay: exiting && dropped > i ? i * 0.05 : 0 }
                      }
                    >
                      <EarnedStarMark size={STAR_SIZE} centerStyle="none" />
                    </motion.div>
                  </div>
                ))}
              </div>
            </div>

            <motion.div
              animate={{ opacity: dropped === 5 && !exiting ? 1 : 0, y: dropped === 5 && !exiting ? 0 : 8 }}
              className="mt-4 text-center"
            >
              <span className={cn("text-2xl font-extrabold", isDark ? "text-white" : "text-navy")}>
                5.0
              </span>
              <span
                className={cn(
                  "ml-2 text-sm font-semibold",
                  isDark ? "text-white/55" : "text-text-muted",
                )}
              >
                out of 5 · Exceptional
              </span>
            </motion.div>

            <div
              className={cn(
                "mt-5 flex items-center justify-between border-t pt-4",
                isDark ? "border-white/10" : "border-border",
              )}
            >
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-navy-mid to-navy text-sm font-bold text-gold">
                  S
                </div>
                <div>
                  <p className={cn("text-sm font-bold", isDark ? "text-white" : "text-navy")}>
                    Sarah M.
                  </p>
                  <p className={cn("text-xs", isDark ? "text-white/45" : "text-text-faint")}>
                    Verified purchase · December 2024
                  </p>
                </div>
              </div>
              <p className={cn("text-right text-xs", isDark ? "text-white/55" : "text-text-muted")}>
                4,832 reviews
                <br />
                <span className="font-semibold text-gold">4.9 avg</span>
              </p>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="mt-4 flex justify-center gap-1.5">
        {[0, 1, 2, 3, 4].map((i) => (
          <motion.span
            key={`dot-${loopKey}-${i}`}
            className="h-1.5 w-1.5 rounded-full"
            animate={{
              background:
                dropped > i && !exiting
                  ? "rgba(245,158,11,0.9)"
                  : isDark
                    ? "rgba(255,255,255,0.25)"
                    : "rgba(15,32,68,0.2)",
              scale: dropped > i && !exiting ? 1.3 : 1,
            }}
          />
        ))}
      </div>
    </motion.div>
  );
}
