# AGENTS.md — EarnedStar

B2B SaaS verified review platform at **earnedstar.com** — for any e-commerce merchant.

## Stack

- **Next.js 16** · React 19 · TypeScript · Tailwind CSS 4
- **Backend:** `earnedstar-back` Nest API (`/api/earnedstar/*`) — repo `github.com/moshbenav-commits/earnedstar-back`
- **Billing:** Authorize.net ARB (NOT Stripe)
- **Data:** Supabase Postgres only — dedicated project `ppnbpblnuxbihhxgozxi` (no Mongo)
- **Deploy:** Vercel → `earnedstar.com` · repo `github.com/moshbenav-commits/earnedstar-front`

## Specs

- [`../docs/prompts/AI_EARNEDSTAR_SPEC.md`](../docs/prompts/AI_EARNEDSTAR_SPEC.md) — ES-AC-01–20 (v2)
- [`../docs/prompts/earnedstar/DESIGN.md`](../docs/prompts/earnedstar/DESIGN.md) — navy `#0F2044` + gold `#F59E0B`, light mode default
- [`../docs/prompts/earnedstar/MASTER_AI_PROMPT.md`](../docs/prompts/earnedstar/MASTER_AI_PROMPT.md)
- [`../docs/branding/earnedstar-logo-spec.md`](../docs/branding/earnedstar-logo-spec.md) — **logo & badge single source of truth** (origami SVG assets, lockups, Figma file)
- [`../docs/prompts/earnedstar/CURSOR_BUILD_PROMPTS.md`](../docs/prompts/earnedstar/CURSOR_BUILD_PROMPTS.md) — per-page Cursor task prompts

## Shared design system (Phase 3)

Dev-only `/design-lab` routes preview EarnedStar tokens, stars, brand lockups, and `@expedia/design-system` primitives. See [`../docs/design-system/monorepo-extraction.md`](../docs/design-system/monorepo-extraction.md).

| Route | Purpose |
|-------|---------|
| `/design-lab` | Overview |
| `/design-lab/tokens` | Navy/gold CSS variables |
| `/design-lab/stars` | Progressive + compact star ratings |
| `/design-lab/brand` | Logo lockups |
| `/design-lab/shared` | EP `DsButton` primitives |

## Deploy

`vercel.json` sets `git.deploymentEnabled: false` (same billing guard pattern as `expedia-parts-front`).

```bash
cd earnedstar
vercel link          # link to Vercel project on same account
vercel --prod --yes  # first production deploy
```

Production domain: `https://earnedstar.com` — DNS on GoDaddy (see below).

**Live now:** https://earnedstar.vercel.app

| Vercel project | `expedia-solutions/earnedstar` |
| Project ID | `prj_QgVjY1LDuLbTxfq7h3HjyglwXuH7` |
| GitHub | `moshbenav-commits/earnedstar-front` |
| Env (production) | `NEXT_PUBLIC_API_URL=https://earnedstar-back.vercel.app/api`, `NEXT_PUBLIC_SITE_URL` |

### GoDaddy DNS (you — ~2 min)

In GoDaddy → **earnedstar.com** → DNS → add/update:

| Type | Name | Value | TTL |
|------|------|-------|-----|
| **A** | `@` | `76.76.21.21` | 600 (or default) |
| **A** | `www` | `76.76.21.21` | 600 |

Remove conflicting **parking** or old **A/CNAME** records for `@` and `www` first.

Optional (Vercel-managed DNS): change nameservers to `ns1.vercel-dns.com` + `ns2.vercel-dns.com` instead of A records.

Propagation: usually 5–30 minutes. Vercel emails when verified.

```bash
cd earnedstar
vercel link          # already linked locally
vercel deploy --prod --yes
```

## API wiring

BFF pattern like `expedia-parts-front`:
- `NEXT_PUBLIC_API_URL=https://earnedstar-back.vercel.app/api`
- Session cookies via `src/app/api/**` — never raw JWT in browser

## Design (v2)

- **Light mode default** — warm white `#FAFAF9`
- **Fonts:** Plus Jakarta Sans + Instrument Serif (italic heroes)
- **Logo:** See [`docs/branding/earnedstar-logo-spec.md`](../docs/branding/earnedstar-logo-spec.md) — origami mark via `EarnedStarMark` / `EarnedStarLogo` in `components/brand/`; do not introduce new star icons or color schemes
- **Stars:** Progressive 1★ red → 5★ gold (`progressive-star-rating.tsx`)
- Gold only on stars, "Star" wordmark, badges; green only on verified chips

## Routes

| Route | Purpose |
|-------|---------|
| `/` | Marketing landing |
| `/dashboard` | Merchant dashboard |
| `/submit/[token]` | 5-step review submission flow |
| `/store/[slug]` | Public review profile (filters + sidebar) |

## Backend (`earnedstar-back`)

Standalone Nest API — merchants, reviews, invitations, widgets, billing stub. See `../earnedstar-back/AGENTS.md`.

| Vercel project | `expedia-solutions/earnedstar-back` |
| Project ID | `prj_L8rtLqEJ9qiIOYgsvmaFPjvzCaAR` |
| Production API | `https://earnedstar-back.vercel.app/api` |
