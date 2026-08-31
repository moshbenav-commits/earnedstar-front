/**
 * Copyright (c) 2024-2026 Expedia Solutions, LLC. All Rights Reserved.
 * Proprietary and confidential. Unauthorized copying, distribution, or use
 * is strictly prohibited without express written permission.
 */
import { StoreProfile } from "@/components/store/store-profile";
import { EarnedStarLogo } from "@/components/brand/earnedstar-logo";
import { DEFAULT_SHARE_IMAGE_URL } from "@/lib/brand-assets";
import { fetchStorePageData } from "@/lib/earnedstar-server";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const { merchant } = await fetchStorePageData(slug);

  if (!merchant) {
    return {
      title: "Store Not Found | EarnedStar",
      description: "This store page could not be found.",
    };
  }

  const business = merchant;
  const total = business.review_count;
  const title =
    business.seo_title?.trim() ||
    `${business.name} Reviews — ${total.toLocaleString()} Verified Customer Reviews | EarnedStar`;
  const description =
    business.seo_description?.trim() ||
    `Read ${total.toLocaleString()} verified reviews of ${business.name}. Average rating: ${business.avg_rating}/5 stars. All reviews verified by purchase with AI fraud detection.`;
  const canonical = `https://earnedstar.com/reviews/${slug}`;
  const ogImage = business.logo_url ?? DEFAULT_SHARE_IMAGE_URL;

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: "EarnedStar",
      type: "website",
      images: [{ url: ogImage, width: 1200, height: 630, alt: `${business.name} reviews` }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}

export default async function PublicReviewProfilePage({ params }: PageProps) {
  const { slug } = await params;
  const { merchant, reviews, qa, profile, translationLanguages } = await fetchStorePageData(slug);

  if (!merchant) {
    notFound();
  }

  const business = merchant;
  const list = reviews;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: business.name,
    url: business.website_url ?? `https://earnedstar.com/reviews/${slug}`,
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

  const faqLd =
    qa.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: qa.map((item) => ({
            "@type": "Question",
            name: item.question,
            acceptedAnswer: { "@type": "Answer", text: item.answer },
          })),
        }
      : null;

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "EarnedStar", item: "https://earnedstar.com" },
      {
        "@type": "ListItem",
        position: 2,
        name: `${business.name} Reviews`,
        item: `https://earnedstar.com/reviews/${slug}`,
      },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      {faqLd ? (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      ) : null}
      <StoreProfile
        business={business}
        reviews={list}
        qaItems={qa}
        profile={profile}
        slug={slug}
        translationLanguages={translationLanguages}
      />
      <footer className="border-t border-border bg-surface py-8 text-center text-xs text-text-faint">
        <EarnedStarLogo size={24} showWordmark={false} centerStyle="none" className="mx-auto justify-center" />
        <p className="mt-2">Powered by EarnedStar</p>
      </footer>
    </>
  );
}
