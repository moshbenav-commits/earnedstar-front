/**
 * Copyright (c) 2024-2026 Expedia Solutions, LLC. All Rights Reserved.
 */
import Link from "next/link";
import { AlertTriangle, ArrowRight, Coins, Mail, MessageSquareText, Sparkles } from "lucide-react";

const STACK_ITEMS = [
  ["Klaviyo · Email · 10K subs", "$150"],
  ["Attentive · SMS · 10K sends", "$300"],
  ["Yotpo Reviews Pro", "$199"],
  ["Smile.io Loyalty", "$49"],
] as const;

const MODULES = [
  { icon: Mail, title: "EarnedMail", body: "Drag-drop campaigns, review-triggered flows, behavioral segments." },
  { icon: MessageSquareText, title: "EarnedSend", body: "Native SMS plus WhatsApp and Apple Business Messages." },
  { icon: Coins, title: "EarnedLoyalty", body: "Points, referrals, VIP rewards — native to your review data." },
  { icon: Sparkles, title: "AI Layer", body: "Smart-reply, summaries, sentiment, fraud — included." },
] as const;

export function YotpoExodusSection() {
  return (
    <section className="relative overflow-hidden bg-ink py-24 text-white md:py-32" data-surface="dark">
      <div className="grain-overlay absolute inset-0 opacity-60" aria-hidden />
      <div
        className="absolute -top-32 right-0 h-[520px] w-[520px] opacity-30"
        style={{ background: "radial-gradient(circle, rgba(245,158,11,0.55) 0%, transparent 60%)" }}
        aria-hidden
      />
      <div className="relative mx-auto grid max-w-[1400px] grid-cols-1 gap-12 px-6 sm:px-10 lg:grid-cols-12 lg:gap-16 lg:px-14">
        <div className="lg:col-span-7">
          <div className="mb-4 flex items-center gap-3">
            <span className="h-px w-8 bg-gold" />
            <span className="smallcaps text-[10px] text-gold-light">The Yotpo Exodus</span>
          </div>
          <h2 className="font-heading text-[clamp(2.5rem,5vw,4.8rem)] leading-[0.98] tracking-tight text-balance">
            Yotpo killed Email & SMS on <em className="text-gold-light underline-hand">Dec 31, 2025</em>.
            <br className="hidden sm:block" /> We built the replacement.
          </h2>
          <p className="mt-8 max-w-2xl text-lg leading-[1.55] text-pretty text-white/72">
            EarnedStar Reviews + EarnedMail + EarnedSend + EarnedLoyalty — one platform, flat price,
            fully integrated. Replace Klaviyo, Attentive, and Yotpo with a single{" "}
            <span className="font-num text-gold-light">$99</span>/month plan.
          </p>
          <div className="mt-12 grid grid-cols-1 gap-px bg-white/8 sm:grid-cols-2">
            {MODULES.map(({ icon: Icon, title, body }) => (
              <div key={title} className="border border-white/10 bg-ink/40 p-6 backdrop-blur-sm">
                <Icon className="text-gold-light" size={20} />
                <div className="font-heading mt-4 text-2xl italic text-white">{title}</div>
                <p className="mt-2 text-sm leading-[1.6] text-white/55">{body}</p>
              </div>
            ))}
          </div>
          <Link
            href="/yotpo-refugees"
            className="group mt-12 inline-flex items-center gap-2.5 rounded-full bg-white px-6 py-3.5 font-bold text-ink transition-shadow hover:shadow-2xl"
          >
            Migrate from Yotpo · 3 months free
            <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>

        <div className="lg:col-span-5">
          <div className="vellum-card gilded-edge relative overflow-hidden rounded-2xl p-8 text-ink shadow-2xl">
            <div className="gold-foil absolute -right-12 -top-12 h-32 w-32 rounded-full opacity-20" aria-hidden />
            <div className="relative flex items-center gap-2">
              <AlertTriangle size={14} className="text-gold-dark" />
              <span className="smallcaps text-[10px] text-gold-dark">Bill calculator</span>
            </div>
            <h3 className="relative mt-3 font-heading text-3xl italic">Your current stack</h3>
            <ul className="relative mt-6 space-y-3 text-sm">
              {STACK_ITEMS.map(([label, price]) => (
                <li key={label} className="flex items-baseline justify-between border-b border-ink/8 pb-3">
                  <span className="text-ink/65">{label}</span>
                  <span className="font-num font-bold tabular-nums">
                    {price}
                    <span className="text-ink/40">/mo</span>
                  </span>
                </li>
              ))}
              <li className="flex items-baseline justify-between pt-2">
                <span className="font-bold">Total</span>
                <span className="font-num text-2xl font-bold tabular-nums">
                  $698
                  <span className="text-sm font-normal text-ink/40">/mo</span>
                </span>
              </li>
            </ul>
            <div className="relative -mx-8 -mb-8 mt-7 rounded-b-2xl bg-ink p-7 text-white ring-light">
              <div className="smallcaps text-[10px] text-gold-light">EarnedStar Growth</div>
              <div className="mt-1 flex items-baseline gap-3">
                <span className="font-heading text-6xl tracking-tight">$99</span>
                <span className="text-sm text-white/55">/mo · all-in</span>
              </div>
              <div className="mt-4 text-sm text-white/65">
                You save <span className="gold-text font-num text-base font-bold">$599/mo</span> ·{" "}
                <span className="font-num text-white/50">$7,188/yr</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
