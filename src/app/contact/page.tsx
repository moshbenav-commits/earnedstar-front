/**
 * Copyright (c) 2024-2026 Expedia Solutions, LLC. All Rights Reserved.
 */
import type { Metadata } from "next";
import { MarketingNav } from "@/components/marketing/marketing-nav";
import { MarketingFooter } from "@/components/marketing/marketing-footer";
import { ContactForm } from "@/components/marketing/contact-form";

export const metadata: Metadata = {
  title: "Contact — EarnedStar",
  description:
    "Ask EarnedStar about verified reviews, pricing, or a store migration. We reply from support@earnedstar.com.",
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-cream text-ink antialiased">
      <MarketingNav />
      <main>
        <section className="relative overflow-hidden bg-ink pb-24 pt-32 text-white" data-surface="dark">
          <div className="grain-overlay absolute inset-0 opacity-50" aria-hidden />
          <div className="relative mx-auto max-w-3xl px-6 text-center sm:px-10 lg:px-14">
            <span className="smallcaps text-[10px] text-gold-light">Talk to us</span>
            <h1 className="font-heading mt-4 text-5xl leading-[1.02] tracking-tight text-balance sm:text-6xl">
              Get in <span className="text-gold-light underline-hand italic">touch</span>
            </h1>
            <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-white/72">
              Questions about verified reviews, pricing, or moving off Yotpo? Write us — a person
              reads every message and replies from support@earnedstar.com.
            </p>
          </div>
        </section>

        <section className="relative -mt-16 pb-24">
          <div className="mx-auto max-w-xl px-6 sm:px-10">
            <ContactForm />
          </div>
        </section>
      </main>
      <MarketingFooter />
    </div>
  );
}
