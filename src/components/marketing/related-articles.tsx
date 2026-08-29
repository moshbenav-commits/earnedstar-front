/**
 * Copyright (c) 2024-2026 Expedia Solutions, LLC. All Rights Reserved.
 * Proprietary and confidential. Unauthorized copying, distribution, or use
 * is strictly prohibited without express written permission.
 */
import Link from "next/link";

import type { BlogArticle } from "@/lib/blog/types";

type RelatedArticlesProps = {
  /** Articles to render as cards. The caller decides the slice (e.g. latest N, or same-category). */
  articles: BlogArticle[];
  /** Section heading. Defaults to a generic label so this works as both a "related" and a "featured" rail. */
  title?: string;
};

/**
 * Related-articles rail — a small grid of article cards (title, description,
 * link) for cross-linking within the blog. Mounted on the blog index page so
 * it sits in every route's import graph that reaches `/blog`.
 */
export function RelatedArticles({ articles, title = "More from the blog" }: RelatedArticlesProps) {
  if (articles.length === 0) return null;

  return (
    <section aria-labelledby="related-articles-heading" className="mt-16 border-t border-border pt-12">
      <h2 id="related-articles-heading" className="text-2xl font-bold text-navy">
        {title}
      </h2>
      <ul className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {articles.map((article) => (
          <li key={article.slug} className="card-surface p-5">
            <div className="mb-2 flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-wide text-text-muted">
              <span>{article.category}</span>
              <span aria-hidden>·</span>
              <span>{article.readMinutes} min read</span>
            </div>
            <h3 className="text-base font-semibold leading-snug text-navy">
              <Link href={`/blog/${article.slug}`} className="hover:underline">
                {article.title}
              </Link>
            </h3>
            <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-text-muted">
              {article.description}
            </p>
            <Link
              href={`/blog/${article.slug}`}
              className="mt-3 inline-block text-sm font-semibold text-gold-dark hover:underline"
            >
              Read the article →
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
