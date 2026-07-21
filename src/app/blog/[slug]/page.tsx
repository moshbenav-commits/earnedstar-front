/**
 * Copyright (c) 2024-2026 Expedia Solutions, LLC. All Rights Reserved.
 * Proprietary and confidential. Unauthorized copying, distribution, or use
 * is strictly prohibited without express written permission.
 */
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import type { ReactNode } from "react";

import { MarketingNav } from "@/components/marketing/marketing-nav";
import { MarketingFooter } from "@/components/marketing/marketing-footer";
import { getAllArticles, getArticleBySlug } from "@/lib/blog/loader";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return getAllArticles().map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) return { title: "Not found — EarnedStar" };

  const canonical = `https://earnedstar.com/blog/${article.slug}`;
  return {
    title: `${article.title} — EarnedStar`,
    description: article.description,
    alternates: { canonical },
    openGraph: {
      type: "article",
      title: article.title,
      description: article.description,
      url: canonical,
      siteName: "EarnedStar",
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.description,
    },
  };
}

/**
 * Minimal, dependency-free markdown renderer.
 *
 * This repo has neither `next-mdx-remote` nor `remark` — per the blog-surface
 * build contract, no new dependencies are added for this feature. This block
 * handles the subset of markdown the neutral-master content-library body
 * actually uses (headings, paragraphs, bullet lists, GFM tables, bold/code/
 * link inline spans) and nothing more. Swap it for `next-mdx-remote/rsc` if
 * this repo ever gains that dependency — `article.body` is unchanged either
 * way.
 */
type MarkdownBlock =
  | { kind: "heading"; level: number; text: string }
  | { kind: "paragraph"; text: string }
  | { kind: "list"; items: string[] }
  | { kind: "table"; header: string[]; rows: string[][] };

function parseMarkdownBlocks(markdown: string): MarkdownBlock[] {
  const rawBlocks = markdown
    .split(/\n\s*\n/)
    .map((block) => block.trim())
    .filter(Boolean);

  return rawBlocks.map((raw): MarkdownBlock => {
    const lines = raw.split("\n");

    const headingMatch = lines.length === 1 ? /^(#{1,6})\s+(.*)$/.exec(lines[0]) : null;
    if (headingMatch) {
      return { kind: "heading", level: headingMatch[1].length, text: headingMatch[2].trim() };
    }

    if (lines.every((line) => /^\s*[-*]\s+/.test(line))) {
      return {
        kind: "list",
        items: lines.map((line) => line.replace(/^\s*[-*]\s+/, "").trim()),
      };
    }

    if (lines.length >= 2 && lines[0].trim().startsWith("|") && /^\|?[\s:-]+\|/.test(lines[1])) {
      const splitRow = (row: string) =>
        row
          .trim()
          .replace(/^\|/, "")
          .replace(/\|$/, "")
          .split("|")
          .map((cell) => cell.trim());
      return {
        kind: "table",
        header: splitRow(lines[0]),
        rows: lines.slice(2).map(splitRow),
      };
    }

    return { kind: "paragraph", text: lines.join(" ").trim() };
  });
}

function renderInline(text: string, keyPrefix: string): ReactNode[] {
  const pattern = /(\*\*[^*]+\*\*|`[^`]+`|\[[^\]]+\]\([^)]+\))/g;
  return text
    .split(pattern)
    .filter((part) => part !== "")
    .map((part, index) => {
      const key = `${keyPrefix}-${index}`;

      const bold = /^\*\*([^*]+)\*\*$/.exec(part);
      if (bold) return <strong key={key}>{bold[1]}</strong>;

      const code = /^`([^`]+)`$/.exec(part);
      if (code) return <code key={key}>{code[1]}</code>;

      const link = /^\[([^\]]+)\]\(([^)]+)\)$/.exec(part);
      if (link) {
        return (
          <a key={key} href={link[2]} className="text-navy-light underline hover:text-gold">
            {link[1]}
          </a>
        );
      }

      return <span key={key}>{part}</span>;
    });
}

function MarkdownBody({ markdown }: { markdown: string }) {
  const blocks = parseMarkdownBlocks(markdown);

  return (
    <div className="mt-8 space-y-5 text-base leading-relaxed text-ink">
      {blocks.map((block, index) => {
        const key = `block-${index}`;

        if (block.kind === "heading") {
          const inline = renderInline(block.text, key);
          if (block.level <= 1)
            return (
              <h1 key={key} className="text-2xl font-bold text-navy">
                {inline}
              </h1>
            );
          if (block.level === 2)
            return (
              <h2 key={key} className="pt-2 text-xl font-bold text-navy">
                {inline}
              </h2>
            );
          if (block.level === 3)
            return (
              <h3 key={key} className="text-lg font-semibold text-navy">
                {inline}
              </h3>
            );
          return (
            <h4 key={key} className="text-base font-semibold text-navy">
              {inline}
            </h4>
          );
        }

        if (block.kind === "list") {
          return (
            <ul key={key} className="list-disc space-y-1 pl-6 text-text-muted">
              {block.items.map((item, itemIndex) => (
                <li key={`${key}-${itemIndex}`}>{renderInline(item, `${key}-${itemIndex}`)}</li>
              ))}
            </ul>
          );
        }

        if (block.kind === "table") {
          return (
            <div key={key} className="overflow-x-auto rounded-lg border border-border">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="bg-surface">
                    {block.header.map((cell, cellIndex) => (
                      <th
                        key={`${key}-h-${cellIndex}`}
                        className="border-b border-border px-3 py-2 text-left font-semibold text-navy"
                      >
                        {renderInline(cell, `${key}-h-${cellIndex}`)}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {block.rows.map((row, rowIndex) => (
                    <tr key={`${key}-r-${rowIndex}`} className="border-b border-border last:border-b-0">
                      {row.map((cell, cellIndex) => (
                        <td key={`${key}-r-${rowIndex}-${cellIndex}`} className="px-3 py-2 align-top text-text-muted">
                          {renderInline(cell, `${key}-r-${rowIndex}-${cellIndex}`)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        }

        return (
          <p key={key} className="text-ink">
            {renderInline(block.text, key)}
          </p>
        );
      })}
    </div>
  );
}

export default async function BlogArticlePage({ params }: PageProps) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) notFound();

  /**
   * INV-11: FAQPage JSON-LD is emitted only when the frontmatter FAQ exists,
   * and that block must match the on-page copy word for word. No FAQ in
   * frontmatter → no schema, rather than a guessed one.
   */
  const faqSchema =
    article.faq.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: article.faq.map((item) => ({
            "@type": "Question",
            name: item.q,
            acceptedAnswer: { "@type": "Answer", text: item.a },
          })),
        }
      : null;

  return (
    <div className="min-h-screen bg-cream text-ink antialiased">
      <MarketingNav />
      <article className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        {article.isDraftPreview ? (
          <p className="mb-8 rounded-lg border border-gold/40 bg-gold-pale px-4 py-3 text-sm text-gold-dark">
            <strong>Draft preview (development only).</strong> Unapproved draft read from the
            content library. Not published.
          </p>
        ) : null}

        <div className="mb-3 flex items-center gap-3 text-xs font-semibold uppercase tracking-wide text-text-muted">
          <span>{article.category}</span>
          <span aria-hidden>·</span>
          <span>{article.readMinutes} min read</span>
        </div>

        <h1 className="text-3xl font-bold text-navy sm:text-4xl">{article.title}</h1>
        <p className="mt-4 text-lg leading-relaxed text-text-muted">{article.description}</p>

        <MarkdownBody markdown={article.body} />

        {article.sourceLinks.length > 0 ? (
          <section className="mt-12 border-t border-border pt-6">
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-text-muted">
              Sources
            </h2>
            <ul className="space-y-2 text-sm">
              {article.sourceLinks.map((link) => (
                <li key={link}>
                  <a
                    href={link}
                    rel="noopener noreferrer nofollow"
                    target="_blank"
                    className="break-all text-navy-light hover:underline"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        <p className="mt-12">
          <Link href="/blog" className="text-sm text-text-muted hover:text-navy hover:underline">
            ← All articles
          </Link>
        </p>

        {faqSchema ? (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
          />
        ) : null}
      </article>
      <MarketingFooter />
    </div>
  );
}
