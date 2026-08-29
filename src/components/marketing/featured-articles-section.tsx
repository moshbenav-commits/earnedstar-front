/**
 * Copyright (c) 2024-2026 Expedia Solutions, LLC. All Rights Reserved.
 * Proprietary and confidential. Unauthorized copying, distribution, or use
 * is strictly prohibited without express written permission.
 */
import Link from "next/link";

import { getAllArticles } from "@/lib/blog/loader";

const ATOM_DATE_RE = /^(\d{4}-\d{2}-\d{2})/;

function formatArticleDate(atomId: string): string | null {
  const match = ATOM_DATE_RE.exec(atomId);
  if (!match) return null;
  const parsed = new Date(`${match[1]}T00:00:00Z`);
  if (Number.isNaN(parsed.getTime())) return null;
  return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" }).format(
    parsed,
  );
}

/**
 * Homepage content rail — surfaces real, published articles from
 * `content/blog/` (synced from the neutral-master content library, never
 * invented copy) so a visitor can reach the review-trust editorial without
 * finding the nav. Same data source as the blog index (`getAllArticles`) and
 * the same card language as `RelatedArticles`, sized down for a homepage rail.
 */
export function FeaturedArticles() {
  const articles = getAllArticles().slice(0, 3);
  if (articles.length === 0) return null;

  return (
    <section id="from-the-blog" className="section-stone border-y border-border py-24" data-scroll-theme="light">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-navy-light">From the blog</p>
            <h2 className="mt-3 text-3xl font-bold text-navy">Notes on earning buyer trust.</h2>
          </div>
          <Link
            href="/blog"
            className="text-sm font-semibold text-gold-dark hover:underline"
          >
            All articles →
          </Link>
        </div>

        <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {articles.map((article) => {
            const date = formatArticleDate(article.atomId);
            return (
              <li key={article.slug} className="card-surface p-6">
                <div className="mb-3 flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-wide text-text-muted">
                  <span>{article.category}</span>
                  {date ? (
                    <>
                      <span aria-hidden>·</span>
                      <time dateTime={article.atomId.slice(0, 10)}>{date}</time>
                    </>
                  ) : null}
                </div>
                <h3 className="text-lg font-semibold leading-snug text-navy">
                  <Link href={`/blog/${article.slug}`} className="hover:underline">
                    {article.title}
                  </Link>
                </h3>
                <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-text-muted">
                  {article.description}
                </p>
                <Link
                  href={`/blog/${article.slug}`}
                  className="mt-4 inline-block text-sm font-semibold text-gold-dark hover:underline"
                >
                  Read the article →
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
