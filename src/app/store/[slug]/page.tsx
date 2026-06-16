import { StoreProfile } from "@/components/store/store-profile";
import { EarnedStarLogo } from "@/components/brand/earnedstar-logo";
import { fetchStorePageData } from "@/lib/earnedstar-server";
import { mockBusiness, mockReviews } from "@/lib/mock-data";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const { merchant } = await fetchStorePageData(slug);
  const business = merchant ?? { ...mockBusiness, slug, name: slug };
  return {
    title: `${business.name} Reviews — ${business.review_count} Verified Reviews`,
    description: `Read ${business.review_count} verified reviews. Average rating: ${business.avg_rating}/5.`,
    alternates: { canonical: `https://earnedstar.com/store/${slug}` },
  };
}

export default async function PublicReviewProfilePage({ params }: PageProps) {
  const { slug } = await params;
  const { merchant, reviews } = await fetchStorePageData(slug);

  if (!merchant) {
    notFound();
  }

  const business = merchant ?? { ...mockBusiness, slug };
  const list = reviews.length > 0 ? reviews : mockReviews;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: business.name,
    url: business.website_url ?? `https://earnedstar.com/store/${slug}`,
    image: business.logo_url ?? undefined,
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: business.avg_rating,
      reviewCount: business.review_count,
      bestRating: 5,
      worstRating: 1,
    },
    review: list.slice(0, 20).map((r) => ({
      "@type": "Review",
      author: { "@type": "Person", name: r.customer_name },
      datePublished: r.created_at,
      reviewBody: r.review_text,
      reviewRating: {
        "@type": "Rating",
        ratingValue: r.rating_overall,
        bestRating: 5,
        worstRating: 1,
      },
    })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <StoreProfile
        business={{
          ...business,
          response_rate: 68,
          joined_year: 2026,
        }}
        reviews={list}
      />
      <footer className="border-t border-border bg-surface py-8 text-center text-xs text-text-faint">
        <EarnedStarLogo size={20} className="mx-auto justify-center" />
        <p className="mt-2">Powered by EarnedStar</p>
      </footer>
    </>
  );
}
