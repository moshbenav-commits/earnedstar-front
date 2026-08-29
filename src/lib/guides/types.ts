/**
 * Copyright (c) 2024-2026 Expedia Solutions, LLC. All Rights Reserved.
 * Proprietary and confidential. Unauthorized copying, distribution, or use
 * is strictly prohibited without express written permission.
 */
/**
 * Guide shape — mirrors the frontmatter contract in
 * expedia-solutions/brand/content-library/GUIDE_NEUTRAL_MASTER_SPEC.md.
 * Sibling of `src/lib/blog/types.ts`'s BlogArticle for the `kind: guide`
 * content shape (steps[] instead of faq[]/internal_links[]).
 */

export type GuideStatus = 'draft' | 'approved' | 'published' | 'retired';

export type GuideStep = {
  instruction: string;
  detail: string | null;
};

export type Guide = {
  /** Matches a GUIDE_NEED_CATALOG id — provenance back to the derived need. */
  needId: string;
  brand: string;
  /** Used as the URL slug (`/help/[slug]`) — same value as needId today. */
  slug: string;
  title: string;
  description: string;
  /** The real route on this site the guided task happens on. */
  route: string;
  kind: 'guide';
  status: GuideStatus;
  reviewRequired: boolean;
  steps: GuideStep[];
  /** Phase 2 — a Creytix-browser clip slug, null until one is recorded. */
  videoSlug: string | null;
  /** Markdown body with the frontmatter block stripped. */
  body: string;
  /**
   * True when this guide was read from the content-library rather than the
   * site's own content/guides/ — dev-only preview of an unapproved draft.
   * Never true in a production build.
   */
  isDraftPreview: boolean;
};
