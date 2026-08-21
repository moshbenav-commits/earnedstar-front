/**
 * Copyright (c) 2024-2026 Expedia Solutions, LLC. All Rights Reserved.
 */
import type { Metadata } from "next";
import { MarketingNav } from "@/components/marketing/marketing-nav";
import { MarketingFooter } from "@/components/marketing/marketing-footer";
import { FeaturesSection } from "@/components/marketing/features-section";
import { HowItWorksSection } from "@/components/marketing/how-it-works-section";

export const metadata: Metadata = {
  title: "Features — EarnedStar Review Platform",
  description:
    "Order-verified reviews, native email and SMS, fraud audit, Google Seller Ratings, and flat pricing — built for merchants who outgrew Yotpo.",
};

export default function FeaturesPage() {
  return (
    <div className="min-h-screen bg-cream text-ink antialiased">
      <MarketingNav />
      <main>
        <section className="border-b border-ink/10 bg-cream px-6 py-16 sm:px-10 lg:px-14">
          <div className="mx-auto max-w-[1400px]">
            <p className="smallcaps text-gold-dark">Product</p>
            <h1 className="font-heading mt-3 max-w-3xl text-[clamp(2.25rem,5vw,3.75rem)] leading-tight tracking-tight text-navy">
              Everything you need to collect, prove, and publish{" "}
              <span className="text-gold italic underline-hand">verified</span> reviews.
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-ink/70">
              Fraud-resistant review collection, native outreach, and compliance tooling — without
              per-order fees or annual lock-in.
            </p>
          </div>
        </section>
        <FeaturesSection />
        <HowItWorksSection />
      </main>
      <MarketingFooter />
    </div>
  );
}
