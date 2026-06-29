/**
 * Copyright (c) 2024-2026 Expedia Solutions, LLC. All Rights Reserved.
 */
import type { Metadata } from "next";
import { MarketingNav } from "@/components/marketing/marketing-nav";
import { MarketingFooter } from "@/components/marketing/marketing-footer";
import { PricingPageHero } from "@/components/marketing/pricing-page-hero";
import { PricingSection } from "@/components/marketing/pricing-section";
import { FaqSection } from "@/components/marketing/faq-section";

export const metadata: Metadata = {
  title: "Pricing — EarnedStar Review Platform",
  description:
    "Flat pricing for verified reviews, native email and SMS, and Google Seller Ratings. 14-day free trial — no annual lock-in.",
};

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-cream text-ink antialiased">
      <MarketingNav />
      <main>
        <PricingPageHero />
        <PricingSection showHeader={false} />
        <FaqSection />
      </main>
      <MarketingFooter />
    </div>
  );
}
