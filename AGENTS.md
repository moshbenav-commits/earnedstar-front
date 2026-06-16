# AGENTS.md — EarnedStar

B2B SaaS verified review platform at **earnedstar.com** — for any e-commerce merchant. Parent: ExpediaParts. Founding tenant: `expediaparts`.

## Stack

- **Next.js 16** · React 19 · TypeScript · Tailwind CSS 4
- **Backend:** `expedia-parts-back-gamma.vercel.app/api` — new `/earnedstar/*` Nest modules (shared API)
- **Billing:** Authorize.net ARB (NOT Stripe) — reuse `AuthorizeNetService`
- **Data:** Supabase Postgres (`earnedstar_*` / `merchants` tables)
- **Deploy:** Vercel → `earnedstar.com` · repo `github.com/moshbenav-commits/earnedstar`

## Specs

- [`../docs/prompts/AI_EARNEDSTAR_SPEC.md`](../docs/prompts/AI_EARNEDSTAR_SPEC.md) — ES-AC-01–20 (v2)
- [`../docs/prompts/earnedstar/DESIGN.md`](../docs/prompts/earnedstar/DESIGN.md) — navy `#0F2044` + gold `#F59E0B`, light mode default
- [`../docs/prompts/earnedstar/MASTER_AI_PROMPT.md`](../docs/prompts/earnedstar/MASTER_AI_PROMPT.md)
- [`../docs/prompts/earnedstar/LOGO_DESIGN_BRIEF.md`](../docs/prompts/earnedstar/LOGO_DESIGN_BRIEF.md)
- [`../docs/prompts/earnedstar/PROGRESSIVE_STAR_RATING.html`](../docs/prompts/earnedstar/PROGRESSIVE_STAR_RATING.html)

## Deploy

`vercel.json` sets `git.deploymentEnabled: false` (same billing guard pattern as `expedia-parts-front`).

```bash
cd earnedstar
vercel link          # link to Vercel project on same account
vercel --prod --yes  # first production deploy
```

Production domain: `https://earnedstar.com` (add in Vercel → Domains after first deploy).


## API wiring

BFF pattern like `expedia-parts-front`:
- `NEXT_PUBLIC_API_URL=https://expedia-parts-back-gamma.vercel.app/api`
- Session cookies via `src/app/api/**` — never raw JWT in browser

## Design (v2)

- **Light mode default** — warm white `#FAFAF9`
- **Fonts:** Plus Jakarta Sans + Instrument Serif (italic heroes)
- **Logo:** Official SVG in `components/brand/earnedstar-logo.tsx` — do not modify
- **Stars:** Progressive 1★ red → 5★ gold (`progressive-star-rating.tsx`)
- Gold only on stars, "Star" wordmark, badges; green only on verified chips

## Routes

| Route | Purpose |
|-------|---------|
| `/` | Marketing landing |
| `/dashboard` | Merchant dashboard |
| `/store/[slug]` | Public review profile |
| `/submit/[token]` | Review submission |

## Next backend work (expedia-parts-back)

Add `src/earnedstar/` module: merchants, reviews, invitations, widgets, billing (Authorize.net ARB).
