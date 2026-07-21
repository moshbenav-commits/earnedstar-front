/**
 * Blog article shape — mirrors the neutral-master frontmatter contract in
 * expedia-solutions/brand/content-library/ARTICLE_NEUTRAL_MASTER_SPEC.md, and
 * matches creytix-front's `src/lib/blog/types.ts` so the two loaders can
 * converge later without a rewrite.
 */

export type BlogStatus = 'draft' | 'approved' | 'published' | 'retired';

export type BlogFaq = {
  q: string;
  a: string;
};

export type BlogInternalLink = {
  anchor: string;
  target: string;
};

export type BlogArticle = {
  /** Provenance: the Antenna atom this article expands. */
  atomId: string;
  brand: string;
  vertical: string;
  persona: string | null;
  trendTag: string | null;
  slug: string;
  title: string;
  description: string;
  category: string;
  readMinutes: number;
  kind: 'blog' | 'article';
  primaryKeyword: string | null;
  sourceLinks: string[];
  faq: BlogFaq[];
  internalLinks: BlogInternalLink[];
  status: BlogStatus;
  reviewRequired: boolean;
  /** Markdown body with the frontmatter block stripped. */
  body: string;
  /**
   * True when this article was read from the content-library rather than the
   * site's own content/blog/ — dev-only preview of unapproved work. Never true
   * in a production build.
   */
  isDraftPreview: boolean;
};
