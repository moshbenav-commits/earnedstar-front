/**
 * Copyright (c) 2024-2026 Expedia Solutions, LLC. All Rights Reserved.
 */
import { MarketingNav } from "@/components/marketing/marketing-nav";
import { HeroSection } from "@/components/marketing/hero-section";
import { TrustCounterStrip } from "@/components/marketing/trust-counter-strip";
import { FoundersQuoteSection } from "@/components/marketing/founders-quote-section";
import { ManifestoPromisesSection } from "@/components/marketing/manifesto-promises-section";
import { BrandGallerySection } from "@/components/marketing/brand-gallery-section";
import { LiveReviewSection } from "@/components/marketing/live-review-section";
import { FeaturesSection } from "@/components/marketing/features-section";
import { HowItWorksSection } from "@/components/marketing/how-it-works-section";
import { ComparisonTableSection } from "@/components/marketing/comparison-table-section";
import { YotpoExodusSection } from "@/components/marketing/yotpo-exodus-section";
import { TestimonialsSection } from "@/components/marketing/testimonials-section";
import { PricingSection } from "@/components/marketing/pricing-section";
import { AuditTeaserSection } from "@/components/marketing/audit-teaser-section";
import { FaqSection } from "@/components/marketing/faq-section";
import { ClosingImprintSection } from "@/components/marketing/closing-imprint-section";
import { MarketingFooter } from "@/components/marketing/marketing-footer";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-cream text-ink antialiased">
      <MarketingNav />
      <main>
        <HeroSection />
        <TrustCounterStrip />
        <FoundersQuoteSection />
        <ManifestoPromisesSection />
        <BrandGallerySection />
        <LiveReviewSection />
        <FeaturesSection />
        <HowItWorksSection />
        <ComparisonTableSection />
        <YotpoExodusSection />
        <TestimonialsSection />
        <PricingSection />
        <AuditTeaserSection />
        <FaqSection />
        <ClosingImprintSection />
      </main>
      <MarketingFooter />
    </div>
  );
}
