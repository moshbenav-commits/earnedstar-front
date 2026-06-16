"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

const stats = [
  { value: 47200, suffix: "+", label: "Reviews Verified" },
  { value: 99.2, suffix: "%", label: "Verified Purchase Rate", decimals: 1 },
  { value: 2.8, suffix: "×", label: "Avg Conversion Lift", decimals: 1 },
  { value: 30, prefix: "<", suffix: " min", label: "Setup to First Review" },
];

function CountUp({
  target,
  prefix = "",
  suffix = "",
  decimals = 0,
}: {
  target: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const duration = 1500;
    const start = performance.now();
    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      setCount(target * progress);
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [inView, target]);

  const formatted =
    decimals > 0 ? count.toFixed(decimals) : Math.floor(count).toLocaleString();

  return (
    <span ref={ref} className="text-3xl font-bold text-gold sm:text-4xl">
      {prefix}
      {formatted}
      {suffix}
    </span>
  );
}

export function StatsSection() {
  return (
    <section className="section-navy py-20" data-surface="dark">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-8 px-4 lg:grid-cols-4">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="text-center"
          >
            <CountUp
              target={stat.value}
              prefix={stat.prefix}
              suffix={stat.suffix}
              decimals={stat.decimals}
            />
            <p className="mt-2 text-xs font-medium uppercase tracking-widest text-white/55">
              {stat.label}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
