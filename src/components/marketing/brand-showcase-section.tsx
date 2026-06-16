"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { EarnedStarLogo } from "@/components/brand/earnedstar-logo";
import { EarnedStarMark } from "@/components/brand/earnedstar-mark";
import { EarnedStarPhotoBadgeVariants } from "@/components/brand/earnedstar-photo-badge";
import {
  DEMO_MERCHANT_LOGO_URL,
  MARKETING_BRAND_SHEET_SRC,
  MARKETING_HERO_STAR_SRC,
} from "@/lib/brand-assets";

function GridLabel({ n, title, dark }: { n: number; title: string; dark?: boolean }) {
  return (
    <p
      className={`mb-4 text-[10px] font-semibold uppercase tracking-[0.15em] ${
        dark ? "text-white/35" : "text-text-faint"
      }`}
    >
      {n}. {title}
    </p>
  );
}

export function BrandShowcaseSection() {
  return (
    <section id="brand" className="section-warm py-24">
      <div className="mx-auto max-w-7xl px-4">
        <p className="text-center text-xs font-semibold uppercase tracking-widest text-navy-light">
          Logo system
        </p>
        <h2 className="mt-3 text-center text-3xl font-bold text-navy sm:text-4xl">
          The photoreal EarnedStar badge
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-center text-text-muted">
          From the{" "}
          <a
            href="https://www.figma.com/community/file/1648706191180392378"
            className="text-navy-light hover:text-gold"
            target="_blank"
            rel="noopener noreferrer"
          >
            Figma logo system
          </a>
          — navy leather, gold piping, and your logo in the center medallion.
        </p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-14 overflow-hidden rounded-3xl border border-border bg-surface shadow-lg"
        >
          <div className="grid md:grid-cols-2">
            <div className="flex min-h-[220px] flex-col border-b border-border bg-surface p-8 md:border-b-0 md:border-r">
              <GridLabel n={1} title="Primary lockup" />
              <div className="flex flex-1 flex-wrap items-center gap-4">
                <EarnedStarMark size={88} centerStyle="logo" logoUrl={DEMO_MERCHANT_LOGO_URL} render="photo" />
                <EarnedStarLogo size={48} showWordmark shell="none" />
              </div>
            </div>

            <div className="flex min-h-[220px] flex-col items-center bg-surface-2 p-8">
              <GridLabel n={2} title="Icon detail" />
              <div className="relative flex flex-1 items-center justify-center">
                <Image
                  src={MARKETING_HERO_STAR_SRC}
                  alt="EarnedStar photoreal 3D star"
                  width={280}
                  height={280}
                  className="h-auto max-h-[200px] w-auto object-contain drop-shadow-[0_20px_40px_rgba(15,32,68,0.2)]"
                  priority
                />
              </div>
            </div>

            <div
              className="flex min-h-[200px] flex-col border-t border-border bg-dark-bg p-8 md:border-r"
              data-surface="dark"
            >
              <GridLabel n={3} title="Dark version" dark />
              <div className="flex flex-1 flex-wrap items-center gap-4">
                <EarnedStarLogo variant="light" size={44} centerStyle="none" shell="dark" />
              </div>
            </div>

            <div className="flex min-h-[200px] flex-col border-t border-border bg-surface p-8">
              <GridLabel n={4} title="Badge variants" />
              <EarnedStarPhotoBadgeVariants size={64} logoUrl={DEMO_MERCHANT_LOGO_URL} className="flex-1" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-8 overflow-hidden rounded-2xl border border-border shadow-md"
        >
          <Image
            src={MARKETING_BRAND_SHEET_SRC}
            alt="EarnedStar brand system sheet — primary, dark, and color variants"
            width={1440}
            height={900}
            className="h-auto w-full"
          />
        </motion.div>
      </div>
    </section>
  );
}
