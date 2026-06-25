/**
 * Copyright (c) 2024-2026 Expedia Solutions, LLC. All Rights Reserved.
 */
"use client";

import { motion } from "framer-motion";
import { MANIFESTO_PROMISES } from "@/lib/marketing-editorial-data";

export function ManifestoPromisesSection() {
  return (
    <section id="manifesto" className="relative overflow-hidden border-y border-ink/8 bg-vellum py-24 paper-grain md:py-32">
      <div className="relative mx-auto grid max-w-[1400px] grid-cols-1 gap-12 px-6 sm:px-10 lg:grid-cols-12 lg:gap-16 lg:px-14">
        <div className="self-start lg:sticky lg:top-24 lg:col-span-4">
          <div className="smallcaps text-[10px] text-gold-dark">The Manifesto</div>
          <h2 className="font-heading mt-4 text-[clamp(2.5rem,4.5vw,4rem)] leading-[1.02] tracking-tight text-balance">
            Four promises. <em className="text-gold-dark underline-hand">Publicly</em>.
          </h2>
          <p className="mt-6 max-w-md text-base leading-[1.6] text-ink/65">
            No platform in this category has ever committed to truth publicly. We are. Every promise below
            becomes a feature you can audit, share, and hold us to — in the open.
          </p>
          <div className="smallcaps mt-8 flex items-center gap-3 text-[10px] text-ink/40">
            <span className="h-px w-8 bg-ink/20" /> est. January 2026
          </div>
        </div>
        <div className="grid grid-cols-1 gap-px bg-ink/10 sm:grid-cols-2 lg:col-span-8">
          {MANIFESTO_PROMISES.map(({ num, icon: Icon, title, body }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="group bg-cream-light p-10"
            >
              <div className="flex items-start justify-between">
                <span className="font-heading text-[2.2rem] leading-none text-gold-dark/70 italic">{num}.</span>
                <Icon className="text-ink/30 transition-colors group-hover:text-gold-dark" size={22} strokeWidth={1.4} />
              </div>
              <h3 className="font-heading mt-6 text-4xl leading-tight text-ink italic">{title}</h3>
              <div className="mt-4 h-px w-10 bg-gold-dark/40" />
              <p className="mt-4 text-pretty leading-[1.65] text-ink/65">{body}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
