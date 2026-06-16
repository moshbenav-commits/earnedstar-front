import type { Metadata } from "next";
import { mockBusiness, mockReviews } from "@/lib/mock-data";
import { StoreProfile } from "@/components/store/store-profile";
import { EarnedStarLogo } from "@/components/brand/earnedstar-logo";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const business = slug === "expediaparts" ? mockBusiness : { ...mockBusiness, slug, name: slug };
  return {
    title: `${business.name} Reviews — ${business.review_count} Verified Reviews`,
    description: `Read ${business.review_count} verified reviews. Average rating: ${business.avg_rating}/5.`,
    alternates: { canonical: `https://earnedstar.com/store/${slug}` },
  };
}

export default async function PublicReviewProfilePage({ params }: PageProps) {
  const { slug } = await params;
  const business =
    slug === "expediaparts"
      ? mockBusiness
      : { ...mockBusiness, slug, name: slug.replace(/-/g, " ") };

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: business.name,
    url: business.website_url,
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: business.avg_rating,
      reviewCount: business.review_count,
      bestRating: 5,
      worstRating: 1,
    },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <StoreProfile business={business} reviews={mockReviews} />
      <footer className="border-t border-border bg-surface py-8 text-center text-xs text-text-faint">
        <EarnedStarLogo size={20} className="mx-auto justify-center" />
        <p className="mt-2">Powered by EarnedStar</p>
      </footer>
    </>
  );
}
