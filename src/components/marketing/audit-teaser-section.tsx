/**
 * Copyright (c) 2024-2026 Expedia Solutions, LLC. All Rights Reserved.
 */
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Search } from "lucide-react";
import { MESHY } from "@/lib/marketing-editorial-data";

export function AuditTeaserSection() {
  return (
    <section className="relative overflow-hidden bg-cream py-24 paper-grain md:py-32">
      <div className="relative mx-auto grid max-w-[1100px] grid-cols-1 items-center gap-12 px-6 sm:px-10 md:grid-cols-12 lg:px-14">
        <div className="md:col-span-7">
          <span className="smallcaps text-[10px] text-gold-dark">A free public tool</span>
          <h3 className="font-heading mt-4 text-[clamp(2.2rem,4vw,3.6rem)] leading-[1.05] tracking-tight text-balance">
            Paste any Trustpilot or Yotpo profile.
            <br />
            <em className="text-gold-dark underline-hand">We&apos;ll estimate how many reviews are fake.</em>
          </h3>
          <p className="mt-6 max-w-lg text-pretty leading-[1.65] text-ink/65">
            The Review Audit runs an AI forensic scan and returns a shareable PDF report —
            language clusters, timing anomalies, reviewer history patterns.
            We do this free because we have nothing to hide.
          </p>
          <Link
            href="/audit"
            className="group mt-8 inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3.5 font-semibold text-white transition-colors hover:bg-ink-soft"
          >
            <Search size={16} /> Run a Review Audit
            <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
        <div className="relative flex justify-center md:col-span-5">
          <div className="absolute -inset-8 bg-gradient-to-tr from-gold-dark/20 via-gold/15 to-transparent blur-2xl" aria-hidden />
          <div className="animate-editorial-float relative">
            <Image
              src={MESHY.awardBadge}
              alt="EarnedStar award medallion"
              width={260}
              height={260}
              className="max-w-full drop-shadow-[0_20px_40px_rgba(180,83,9,0.35)]"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
