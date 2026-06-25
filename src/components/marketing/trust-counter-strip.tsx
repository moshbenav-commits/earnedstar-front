/**
 * Copyright (c) 2024-2026 Expedia Solutions, LLC. All Rights Reserved.
 */
"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { fetchTrustCounter, type TrustCounterData } from "@/lib/marketing-api";
import { PRESS_LOGOS, TRUST_COUNTERS } from "@/lib/marketing-editorial-data";

const FALLBACK: TrustCounterData = {
  verified_reviews: TRUST_COUNTERS[0].value,
  fraud_blocked_this_month: TRUST_COUNTERS[1].value,
  avg_dispute_sla_hours: TRUST_COUNTERS[2].value,
  reviews_ransomed: TRUST_COUNTERS[3].value,
};

function TickingNumber({
  value,
  prefix = "",
  suffix = "",
}: {
  value: number;
  prefix?: string;
  suffix?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const start = performance.now();
    const duration = 1600;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - (1 - t) ** 4;
      setDisplay(Math.round(value * eased));
      if (t < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [inView, value]);

  return (
    <span ref={ref} className="font-num tabular-nums">
      {prefix}
      {display.toLocaleString()}
      {suffix}
    </span>
  );
}

export function TrustCounterStrip() {
  const [counter, setCounter] = useState<TrustCounterData>(FALLBACK);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const data = await fetchTrustCounter();
        if (mounted) setCounter(data);
      } catch {
        /* keep fallback */
      }
    };
    load();
    const timer = setInterval(load, 9000);
    return () => {
      mounted = false;
      clearInterval(timer);
    };
  }, []);

  const items = [
    { label: TRUST_COUNTERS[0].label, value: counter.verified_reviews, suffix: "", sub: TRUST_COUNTERS[0].sub },
    { label: TRUST_COUNTERS[1].label, value: counter.fraud_blocked_this_month, suffix: "", sub: TRUST_COUNTERS[1].sub },
    { label: TRUST_COUNTERS[2].label, value: counter.avg_dispute_sla_hours, suffix: "h", sub: TRUST_COUNTERS[2].sub },
    { label: TRUST_COUNTERS[3].label, value: counter.reviews_ransomed, suffix: "", sub: TRUST_COUNTERS[3].sub },
  ];

  return (
    <div className="relative border-t border-white/10 bg-ink-deep/40 backdrop-blur-sm" data-surface="dark">
      <div className="mx-auto grid max-w-[1400px] grid-cols-2 gap-8 px-6 py-8 md:grid-cols-4 md:gap-12 sm:px-10 lg:px-14">
        {items.map((item) => (
          <div key={item.label} className="relative">
            <div className="absolute -left-2 top-0 h-full w-px bg-gradient-to-b from-gold/0 via-gold/60 to-gold/0" />
            <div className="pl-2">
              <div className="font-heading text-[clamp(2rem,3.5vw,3rem)] leading-none tracking-tight text-white">
                <TickingNumber value={item.value} suffix={item.suffix} />
              </div>
              <div className="smallcaps mt-2.5 text-[9.5px] text-gold-light">{item.label}</div>
              <div className="mt-1 text-[10px] text-white/35">{item.sub}</div>
            </div>
          </div>
        ))}
      </div>
      <div className="border-t border-white/10">
        <div className="marquee-mask mx-auto flex max-w-[1400px] items-center gap-6 overflow-hidden px-6 py-4 sm:px-10 lg:px-14">
          <span className="smallcaps shrink-0 text-[10px] text-white/45">As seen in</span>
          <div className="animate-editorial-ticker flex items-center gap-10 whitespace-nowrap">
            {[...PRESS_LOGOS, ...PRESS_LOGOS].map((name, i) => (
              <span key={`${name}-${i}`} className="font-heading text-lg italic tracking-tight text-white/45">
                {name}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
