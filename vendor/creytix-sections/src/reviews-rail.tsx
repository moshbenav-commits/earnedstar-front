/**
 * ReviewsRail — creytix-sections/reviews-rail@1.0.1
 *
 * Consolidates the fleet's three separate reviews forks named in
 * docs/creytix/contracts/CONTRACT_REVIEWS_RAIL_CONSOLIDATION.md — "reviews"
 * is the single most common homepage-floor failure (14/21 sites), and each
 * of the three sites that did build something forked its own instead of
 * sharing one:
 *   - sd-surplus-front/src/components/earnedstar-reviews-rail.tsx — async
 *     server component fetching EarnedStar REST directly; contributed the
 *     honest-empty-state ethic ("pulls real EarnedStar reviews, never
 *     fabricated placeholders"), the verified-buyer pill, and the aggregate
 *     merchant-rating header.
 *   - truestar-front/src/components/reviews-rail.tsx — sync component over
 *     TrueStar's own first-party fixture data; contributed the scroll-snap
 *     rail shape, `aria-roledescription="carousel"`, and the per-item
 *     "{business.name} · {business.city}" business link.
 *   - auction-front/src/components/reviews/reviews-header-chip.tsx — a link
 *     stub only (not a rail), House of Bid's weak stand-in "reviews" pass.
 *
 * What changed in the extraction: this component is presentational and
 * data-agnostic — it takes `items` as a prop and never fetches. All
 * fetching/mapping (EarnedStar rows via
 * packages/creytix-earnedstar-client's `toReviewItems`, or a site's own
 * first-party data, as TrueStar and the AlignHeart member-story surface do)
 * happens in the consuming site, one layer up. Every user-visible string is
 * overridable via `labels` / `ratingLabel` — the fleet has Spanish surfaces
 * (Villas Campestre, Sancochi) and a dating product whose proof rail is
 * member success stories, so a hardcoded "Verified customer" would ship wrong
 * on adoption. sd-surplus's inline merchant
 * header became the optional `summary` prop; TrueStar's inline business link
 * became `contextLabel` + `href`. Tailwind utility classes and hardcoded
 * hex/rgba surface colors were replaced with `--ctx-*` design tokens.
 */
export type ReviewItem = {
  id: string;
  rating: number;
  title?: string | null;
  body?: string | null;
  authorName?: string | null;
  verified?: boolean;
  createdAt?: string | null;
  href?: string | null;
  contextLabel?: string | null;
};

export type ReviewsRailProps = {
  items: ReviewItem[];
  heading?: string;
  eyebrow?: string;
  intro?: string;
  /** Aggregate summary, when the source has one (EarnedStar merchant rollup). */
  summary?: { averageRating: number; reviewCount: number } | null;
  /** "See all" link. */
  viewAllHref?: string | null;
  viewAllLabel?: string;
  /** What to render when items is empty. Defaults to rendering NOTHING. */
  emptyState?: import("react").ReactNode;
  className?: string;
  /**
   * Localized aria-label for a star rating, e.g. `(r) => `${r.toFixed(1)} de 5``
   * for a Spanish-language site (Villas/Sancochi). Defaults to English
   * "X out of 5".
   */
  ratingLabel?: (rating: number) => string;
  /**
   * Every other user-visible string, so a Spanish surface (Villas, Sancochi)
   * or a non-storefront one (AlignHeart ships member success stories, not
   * vendor reviews) can render without English leaking through. Anything
   * omitted falls back to the English default.
   */
  labels?: {
    /** Accessible name for the section and the rail. Default "Reviews". */
    sectionLabel?: string;
    /** Pill on a verified item. Default "Verified". */
    verified?: string;
    /** Shown when an item has no author name. Default "Verified customer". */
    anonymousAuthor?: string;
    /** Renders the summary count, e.g. `(n) => n === 1 ? "reseña" : "reseñas"`. */
    reviewCount?: (count: number) => string;
  };
};

/**
 * Stars must show the FRACTION, not a rounded guess. Rounding 4.6 up to five
 * filled stars visually overstates the rating on every adopting site — the
 * aria-label would say 4.6 while the picture says 5. TrueStar's original
 * star-rating.tsx clipped a partial fill for exactly this reason; the first
 * extraction lost it. Two layers: an empty track, and a filled overlay clipped
 * to rating/5 of the width.
 */
function Stars({ rating, label }: { rating: number; label: string }) {
  const clamped = Math.max(0, Math.min(5, Number.isFinite(rating) ? rating : 0));
  const pct = (clamped / 5) * 100;
  return (
    <span
      role="img"
      aria-label={label}
      style={{
        position: "relative",
        display: "inline-block",
        letterSpacing: "0.05em",
        lineHeight: 1,
        whiteSpace: "nowrap",
        color: "var(--ctx-color-muted-text)",
      }}
    >
      <span aria-hidden="true">☆☆☆☆☆</span>
      <span
        aria-hidden="true"
        style={{
          position: "absolute",
          insetInlineStart: 0,
          top: 0,
          width: `${pct}%`,
          overflow: "hidden",
          whiteSpace: "nowrap",
          color: "var(--ctx-color-brand-accent)",
        }}
      >
        ★★★★★
      </span>
    </span>
  );
}

function defaultRatingLabel(rating: number): string {
  return `${rating.toFixed(1)} out of 5`;
}

function formatReviewDate(iso?: string | null): string | null {
  if (!iso) return null;
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return null;
  try {
    return new Intl.DateTimeFormat(undefined, { year: "numeric", month: "short", day: "numeric" }).format(date);
  } catch {
    return date.toISOString().slice(0, 10);
  }
}

export function ReviewsRail({
  items,
  heading,
  eyebrow,
  intro,
  summary,
  viewAllHref,
  viewAllLabel = "View all",
  emptyState,
  className,
  ratingLabel,
  labels,
}: ReviewsRailProps) {
  if (items.length === 0) {
    return emptyState ? <>{emptyState}</> : null;
  }

  const label = ratingLabel || defaultRatingLabel;
  const sectionLabel = labels?.sectionLabel ?? "Reviews";
  const verifiedLabel = labels?.verified ?? "Verified";
  const anonymousAuthor = labels?.anonymousAuthor ?? "Verified customer";
  const countLabel =
    labels?.reviewCount ?? ((count: number) => `${count} ${count === 1 ? "review" : "reviews"}`);

  return (
    <section
      className={className}
      data-ctx-section="reviews-rail"
      aria-label={heading || sectionLabel}
      style={{
        padding: "var(--ctx-space-10, 2.5rem) var(--ctx-space-5, 1.25rem)",
        fontFamily: "var(--ctx-font-body)",
        color: "var(--ctx-color-primary-text)",
        background: "var(--ctx-color-background)",
      }}
    >
      <div
        style={{
          margin: "0 auto",
          maxWidth: "1152px",
          display: "flex",
          flexWrap: "wrap",
          alignItems: "flex-end",
          justifyContent: "space-between",
          gap: "var(--ctx-space-4, 1rem)",
        }}
      >
        <div>
          {eyebrow ? (
            <p
              style={{
                margin: 0,
                fontSize: "12px",
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "0.16em",
                color: "var(--ctx-color-brand-accent)",
              }}
            >
              {eyebrow}
            </p>
          ) : null}
          {heading ? (
            <h2
              style={{
                margin: "var(--ctx-space-2, 0.5rem) 0 0",
                fontFamily: "var(--ctx-font-display)",
                fontSize: "30px",
                color: "var(--ctx-color-primary-text)",
              }}
            >
              {heading}
            </h2>
          ) : null}
          {intro ? (
            <p style={{ margin: "var(--ctx-space-2, 0.5rem) 0 0", color: "var(--ctx-color-muted-text)" }}>{intro}</p>
          ) : null}
        </div>
        {summary ? (
          <div style={{ display: "flex", alignItems: "baseline", gap: "var(--ctx-space-3, 0.75rem)" }}>
            <span style={{ fontFamily: "var(--ctx-font-display)", fontSize: "30px", fontWeight: 600 }}>
              {summary.averageRating.toFixed(1)}
            </span>
            <Stars rating={summary.averageRating} label={label(summary.averageRating)} />
            <span style={{ fontSize: "14px", color: "var(--ctx-color-muted-text)" }}>
              {countLabel(summary.reviewCount)}
            </span>
          </div>
        ) : null}
      </div>

      <ul
        aria-roledescription="carousel"
        aria-label={heading || sectionLabel}
        tabIndex={0}
        style={{
          margin: "var(--ctx-space-8, 2rem) auto 0",
          maxWidth: "1152px",
          display: "flex",
          gap: "var(--ctx-space-5, 1.25rem)",
          overflowX: "auto",
          overflowY: "hidden",
          scrollSnapType: "x mandatory",
          padding: "0 0 var(--ctx-space-2, 0.5rem)",
          listStyle: "none",
        }}
      >
        {items.map((item) => {
          const date = formatReviewDate(item.createdAt);
          const card = (
            <article
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "var(--ctx-space-3, 0.75rem)",
                width: "100%",
                height: "100%",
                borderRadius: "16px",
                border: "1px solid var(--ctx-color-border)",
                background: "var(--ctx-color-surface)",
                padding: "var(--ctx-space-5, 1.25rem)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: "var(--ctx-space-2, 0.5rem)",
                }}
              >
                <Stars rating={item.rating} label={label(item.rating)} />
                {item.verified ? (
                  <span
                    style={{
                      borderRadius: "999px",
                      border: "1px solid var(--ctx-color-border)",
                      padding: "2px 8px",
                      fontSize: "10px",
                      fontWeight: 600,
                      textTransform: "uppercase",
                      letterSpacing: "0.1em",
                      color: "var(--ctx-color-brand-accent)",
                    }}
                  >
                    {verifiedLabel}
                  </span>
                ) : null}
              </div>
              {item.title ? (
                <p style={{ margin: 0, fontWeight: 600, color: "var(--ctx-color-primary-text)" }}>{item.title}</p>
              ) : null}
              {item.body ? (
                <p style={{ margin: 0, fontSize: "14px", lineHeight: 1.5, color: "var(--ctx-color-muted-text)" }}>
                  {item.body}
                </p>
              ) : null}
              <div style={{ marginTop: "auto", display: "flex", flexDirection: "column", gap: "2px" }}>
                {item.contextLabel ? (
                  <span style={{ fontSize: "12px", fontWeight: 600, color: "var(--ctx-color-brand-accent)" }}>
                    {item.contextLabel}
                  </span>
                ) : null}
                <span style={{ fontSize: "12px", color: "var(--ctx-color-muted-text)" }}>
                  {item.authorName || anonymousAuthor}
                  {date ? ` · ${date}` : ""}
                </span>
              </div>
            </article>
          );

          return (
            <li
              key={item.id}
              style={{
                display: "flex",
                minWidth: "300px",
                maxWidth: "340px",
                flexShrink: 0,
                scrollSnapAlign: "start",
              }}
            >
              {item.href ? (
                <a href={item.href} style={{ textDecoration: "none", color: "inherit", display: "flex", width: "100%" }}>
                  {card}
                </a>
              ) : (
                card
              )}
            </li>
          );
        })}
      </ul>

      {viewAllHref ? (
        <p style={{ margin: "var(--ctx-space-6, 1.5rem) auto 0", maxWidth: "1152px" }}>
          <a
            href={viewAllHref}
            style={{ fontWeight: 600, color: "var(--ctx-color-brand-accent)", textDecoration: "underline", textUnderlineOffset: "4px" }}
          >
            {viewAllLabel}
          </a>
        </p>
      ) : null}
    </section>
  );
}
