import { MarketingNav } from "@/components/marketing/marketing-nav";
import { AnnouncementStrip } from "@/components/marketing/announcement-strip";
import { HeroSection } from "@/components/marketing/hero-section";
import { TrustBar } from "@/components/marketing/trust-bar";
import { SocialProofBanner } from "@/components/marketing/social-proof-banner";
import { FeatureSplitBanner } from "@/components/marketing/feature-split-banner";
import { FeaturesSection } from "@/components/marketing/features-section";
import { HowItWorksSection } from "@/components/marketing/how-it-works-section";
import { OfferBanner } from "@/components/marketing/offer-banner";
import { TestimonialsSection } from "@/components/marketing/testimonials-section";
import { PricingSection } from "@/components/marketing/pricing-section";
import { FaqSection } from "@/components/marketing/faq-section";
import { MarketingFooter } from "@/components/marketing/marketing-footer";
import { ScrollThemeSync } from "@/components/theme/scroll-theme-sync";

export default function HomePage() {
  return (
    <>
      <ScrollThemeSync />
      <MarketingNav />
      <AnnouncementStrip />
      <main>
        <HeroSection />
        <TrustBar />
        <SocialProofBanner />
        <FeatureSplitBanner />
        <FeaturesSection />
        <HowItWorksSection />
        <OfferBanner />
        <TestimonialsSection />
        <PricingSection />
        <FaqSection />
      </main>
      <MarketingFooter />
    </>
  );
}
