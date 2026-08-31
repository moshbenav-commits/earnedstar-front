/**
 * Copyright (c) 2024-2026 Expedia Solutions, LLC. All Rights Reserved.
 * Proprietary and confidential. Unauthorized copying, distribution, or use
 * is strictly prohibited without express written permission.
 */
import Link from "next/link";
import type { Metadata } from "next";

import { MarketingNav } from "@/components/marketing/marketing-nav";
import { MarketingFooter } from "@/components/marketing/marketing-footer";
import { RelatedArticles } from "@/components/marketing/related-articles";
import { getAllArticles } from "@/lib/blog/loader";

export const metadata: Metadata = {
  title: "Blog — EarnedStar",
  description:
    "Notes on collecting honest reviews, building buyer trust, and keeping a review program verified.",
};

export default function BlogIndexPage() {
  const articles = getAllArticles();
  const previewing = articles.some((article) => article.isDraftPreview);

  return (
    <div className="min-h-screen bg-cream text-ink antialiased" data-scroll-theme="light">
      <MarketingNav />
      <main className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
        <h1 className="text-4xl font-bold text-navy">Blog</h1>
        <p className="mt-3 max-w-2xl text-text-muted">
          Notes on collecting honest reviews, building buyer trust, and keeping a review program
          verified.
        </p>

        {previewing ? (
          <p className="mt-8 rounded-lg border border-gold/40 bg-gold-pale px-4 py-3 text-sm text-gold-dark">
            <strong>Draft preview (development only).</strong> These are unapproved drafts read
            straight from the content library. Nothing here is published.
          </p>
        ) : null}

        {articles.length === 0 ? (
          <p className="mt-10 text-sm text-text-muted">No published articles yet.</p>
        ) : (
          <ul className="mt-10 grid gap-6 sm:grid-cols-2">
            {articles.map((article) => (
              <li key={article.slug} className="card-surface p-6">
                <div className="mb-3 flex flex-wrap items-center gap-3 text-xs font-semibold uppercase tracking-wide text-text-muted">
                  <span>{article.category}</span>
                  <span aria-hidden>·</span>
                  <span>{article.readMinutes} min read</span>
                  {article.isDraftPreview ? (
                    <span className="rounded bg-gold-pale px-2 py-0.5 text-gold-dark">Draft</span>
                  ) : null}
                </div>

                <h2 className="text-xl font-semibold text-navy">
                  <Link href={`/blog/${article.slug}`} className="hover:underline">
                    {article.title}
                  </Link>
                </h2>

                <p className="mt-2 text-sm leading-relaxed text-text-muted">{article.description}</p>
              </li>
            ))}
          </ul>
        )}

        <RelatedArticles articles={articles.slice(0, 4)} title="Featured articles" />
      </main>
      <MarketingFooter />
    </div>
  );
}
