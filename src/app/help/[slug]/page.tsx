/**
 * Copyright (c) 2024-2026 Expedia Solutions, LLC. All Rights Reserved.
 * Proprietary and confidential. Unauthorized copying, distribution, or use
 * is strictly prohibited without express written permission.
 */
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { MarketingNav } from "@/components/marketing/marketing-nav";
import { MarketingFooter } from "@/components/marketing/marketing-footer";
import { getAllGuides, getGuideBySlug } from "@/lib/guides/loader";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return getAllGuides().map((guide) => ({ slug: guide.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const guide = getGuideBySlug(slug);
  if (!guide) return { title: "Not found — EarnedStar" };

  const canonical = `https://earnedstar.com/help/${guide.slug}`;
  return {
    title: `${guide.title} — EarnedStar`,
    description: guide.description,
    alternates: { canonical },
    openGraph: {
      type: "article",
      title: guide.title,
      description: guide.description,
      url: canonical,
      siteName: "EarnedStar",
    },
  };
}

export default async function HelpGuidePage({ params }: PageProps) {
  const { slug } = await params;
  const guide = getGuideBySlug(slug);
  if (!guide) notFound();

  return (
    <div className="min-h-screen bg-cream text-ink antialiased">
      <MarketingNav />
      <article className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        {guide.isDraftPreview ? (
          <p className="mb-8 rounded-lg border border-gold/40 bg-gold-pale px-4 py-3 text-sm text-gold-dark">
            <strong>Draft preview (development only).</strong> Unapproved draft read from the
            content library. Not published.
          </p>
        ) : null}

        <div className="mb-3 flex items-center gap-3 text-xs font-semibold uppercase tracking-wide text-text-muted">
          <span>Help guide</span>
          <span aria-hidden>·</span>
          <span>{guide.steps.length} steps</span>
        </div>

        <h1 className="text-3xl font-bold text-navy sm:text-4xl">{guide.title}</h1>
        <p className="mt-4 text-lg leading-relaxed text-text-muted">{guide.description}</p>

        <ol className="mt-8 space-y-5">
          {guide.steps.map((step, index) => (
            <li key={index} className="card-surface flex gap-4 p-5">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-navy text-sm font-semibold text-white">
                {index + 1}
              </span>
              <div>
                <p className="text-base font-medium text-ink">{step.instruction}</p>
                {step.detail ? (
                  <p className="mt-1 text-sm leading-relaxed text-text-muted">{step.detail}</p>
                ) : null}
              </div>
            </li>
          ))}
        </ol>

        <p className="mt-12">
          <Link href="/help" className="text-sm text-text-muted hover:text-navy hover:underline">
            ← All help guides
          </Link>
        </p>
      </article>
      <MarketingFooter />
    </div>
  );
}
