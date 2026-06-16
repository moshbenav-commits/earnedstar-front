"use client";

import { useEffect, useState } from "react";

type Sparkle = { id: number; left: string; top: string; delay: string; size: number };

export function SparklesBackground({ count = 40 }: { count?: number }) {
  const [sparkles, setSparkles] = useState<Sparkle[]>([]);

  useEffect(() => {
    setSparkles(
      Array.from({ length: count }, (_, i) => ({
        id: i,
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        delay: `${Math.random() * 4}s`,
        size: 2 + Math.random() * 3,
      })),
    );
  }, [count]);

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {sparkles.map((s) => (
        <span
          key={s.id}
          className="sparkle-dot absolute rounded-full bg-gold"
          style={{
            left: s.left,
            top: s.top,
            width: s.size,
            height: s.size,
            animationDelay: s.delay,
          }}
        />
      ))}
    </div>
  );
}
