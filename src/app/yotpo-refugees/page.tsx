/**
 * Copyright (c) 2024-2026 Expedia Solutions, LLC. All Rights Reserved.
 */
import type { Metadata } from "next";
import Link from "next/link";
import { AlertTriangle, ArrowRight, Check, Coins, Combine, Mail, Wallet } from "lucide-react";
import { MarketingNav } from "@/components/marketing/marketing-nav";
import { MarketingFooter } from "@/components/marketing/marketing-footer";

export const metadata: Metadata = {
  title: "Yotpo Refugees — Migrate to EarnedStar",
  description:
    "Yotpo turned off native Email and SMS. EarnedStar replaces reviews, email, SMS, and loyalty on one $99/month plan — 3 months free for migrations.",
};

const COMPARE_ROWS = [
  ["Reviews", "$199/mo", "Included"],
  ["Email", "$150/mo (Klaviyo)", "Included"],
  ["SMS", "$300/mo (Attentive)", "Included"],
  ["Loyalty", "$49/mo (Smile)", "Included"],
  ["Vendors to manage", "4", "1"],
  ["Annual lock-in?", "Yes", "No"],
] as const;

const STEPS = [
  { icon: Combine, title: "Export from Yotpo", body: "Paste your Yotpo export CSV into the importer. We auto-map fields including review-trigger flows.", n: "01" },
  { icon: Mail, title: "Reconnect your store", body: "OAuth into Shopify, Woo, or BigCommerce. EarnedStar reuses order webhooks for verified-purchase flows.", n: "02" },
  { icon: Coins, title: "Flip the switch", body: "Pause Klaviyo + Attentive + Yotpo. EarnedMail, EarnedSend, and EarnedLoyalty are already running. First 3 months free.", n: "03" },
] as const;

export default function YotpoRefugeesPage() {
  return (
    <div className="min-h-screen bg-cream text-ink antialiased">
      <MarketingNav />
      <main>
        <section className="relative overflow-hidden bg-ink pb-32 pt-24 text-white" data-surface="dark">
          <div className="grain-overlay absolute inset-0 opacity-50" aria-hidden />
          <div className="relative mx-auto grid max-w-7xl grid-cols-1 gap-12 px-6 sm:px-8 lg:grid-cols-12 lg:px-12">
            <div className="lg:col-span-7">
              <span className="smallcaps text-[10px] text-gold-light">For Yotpo refugees</span>
              <h1 className="font-heading mt-4 text-5xl leading-[1.02] tracking-tight text-balance sm:text-6xl lg:text-7xl">
                Your Email and SMS just got <em className="text-gold-light">deleted</em>.
                <br />
                Move them home in one click.
              </h1>
              <p className="mt-8 max-w-2xl text-lg leading-relaxed text-white/75">
                Yotpo turned off native Email and SMS on December 31, 2025. EarnedStar runs
                reviews, email, SMS, and loyalty on one $99/month plan — and ports your data in one click.
              </p>
              <div className="mt-10 flex flex-wrap gap-4">
                <Link href="/signup" className="inline-flex items-center gap-2 rounded-full px-6 py-3 font-bold text-ink shadow-xl gold-foil">
                  Migrate in 1 click <ArrowRight size={16} />
                </Link>
                <Link href="/audit" className="inline-flex items-center gap-2 rounded-full border border-white/20 px-6 py-3 font-semibold text-white hover:bg-white/10">
                  Run a free audit first
                </Link>
              </div>
              <div className="mt-12 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 backdrop-blur-sm">
                <AlertTriangle size={14} className="text-gold-light" />
                <span className="text-xs text-white/80">First 3 months free for Yotpo migrations · No setup fees</span>
              </div>
            </div>
            <div className="lg:col-span-5">
              <div className="rounded-2xl bg-white p-7 text-ink shadow-2xl">
                <div className="smallcaps text-[10px] text-gold-dark">Side-by-side</div>
                <h3 className="font-heading mt-2 text-3xl">Then → Now</h3>
                <table className="mt-5 w-full text-sm">
                  <thead>
                    <tr className="text-xs uppercase tracking-[0.18em] text-ink/45">
                      <th className="py-2 text-left font-bold">Tool</th>
                      <th className="py-2 text-right font-bold">Yotpo era</th>
                      <th className="py-2 text-right font-bold">EarnedStar</th>
                    </tr>
                  </thead>
                  <tbody>
                    {COMPARE_ROWS.map(([label, before, after]) => (
                      <tr key={label} className="border-t border-ink/8">
                        <td className="py-2.5 text-ink/70">{label}</td>
                        <td className="py-2.5 text-right text-ink/45">{before}</td>
                        <td className="py-2.5 text-right font-bold">{after}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="-mx-7 -mb-7 mt-6 rounded-b-2xl bg-ink p-6 text-white">
                  <div className="flex items-baseline justify-between">
                    <div>
                      <div className="smallcaps text-[10px] text-gold-light">You save</div>
                      <div className="font-heading mt-1 text-5xl">
                        $7,188
                        <span className="ml-1 text-base font-normal text-white/60">/yr</span>
                      </div>
                    </div>
                    <Wallet className="text-gold-light" size={42} strokeWidth={1.3} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-24">
          <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
            <span className="smallcaps text-[10px] text-gold-dark">How migration works</span>
            <h2 className="font-heading mt-3 text-4xl tracking-tight sm:text-5xl">
              Three steps. <em className="text-gold-dark">No engineer required.</em>
            </h2>
            <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
              {STEPS.map(({ icon: Icon, title, body, n }) => (
                <div key={title} className="rounded-2xl border border-ink/10 bg-white p-7 transition-shadow hover:shadow-md">
                  <div className="flex items-center justify-between">
                    <Icon className="text-gold-dark" size={26} strokeWidth={1.6} />
                    <span className="text-xs font-bold tracking-[0.24em] text-ink/40">STEP · {n}</span>
                  </div>
                  <h3 className="font-heading mt-4 text-3xl italic">{title}</h3>
                  <p className="mt-3 leading-relaxed text-ink/65">{body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="border-y border-ink/10 bg-white py-20">
          <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-6 sm:px-8 md:grid-cols-4 lg:px-12">
            {["3 months free", "No setup fees", "Field-by-field mapping", "Your data stays portable"].map((item) => (
              <div key={item} className="flex items-center gap-3">
                <Check className="text-gold-dark" size={20} />
                <span className="font-bold">{item}</span>
              </div>
            ))}
          </div>
        </section>
      </main>
      <MarketingFooter />
    </div>
  );
}
