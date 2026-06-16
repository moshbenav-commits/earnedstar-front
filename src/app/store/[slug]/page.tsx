import type { Metadata } from "next";
import { mockBusiness, mockReviews } from "@/lib/mock-data";
import { StarRating } from "@/components/ui/star-rating";
import { VerifiedBadge } from "@/components/ui/verified-badge";
import { ReviewCard } from "@/components/ui/review-card";
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
  const business = slug === "expediaparts" ? mockBusiness : { ...mockBusiness, slug, name: slug };

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
      <div className="min-h-screen bg-bg">
        <header className="border-b border-border bg-surface py-12 text-center">
          <div className="mx-auto max-w-3xl px-4">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full border border-border bg-navy-pale text-2xl font-bold text-navy">
              {business.name.charAt(0)}
            </div>
            <h1 className="text-3xl font-extrabold text-navy sm:text-4xl">{business.name}</h1>
            <div className="mt-4 flex items-center justify-center gap-3">
              <StarRating rating={business.avg_rating} size="lg" />
              <span className="text-2xl font-extrabold text-gold">{business.avg_rating}</span>
              <span className="text-text-faint">({business.review_count.toLocaleString()} verified reviews)</span>
            </div>
            <div className="mt-4 flex justify-center">
              <VerifiedBadge />
            </div>
          </div>
        </header>
        <main className="mx-auto max-w-3xl space-y-4 px-4 py-8">
          {mockReviews.map((review, i) => (
            <ReviewCard key={review.id} review={review} showResponse animationDelay={i * 0.05} />
          ))}
        </main>
        <footer className="border-t border-border py-8 text-center text-xs text-text-faint">
          <EarnedStarLogo size={20} className="mx-auto justify-center" />
          <p className="mt-2">A product by ExpediaParts</p>
        </footer>
      </div>
    </>
  );
}
