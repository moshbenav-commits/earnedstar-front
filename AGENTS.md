# AGENTS.md — EarnedStar front

B2B SaaS verified review platform at **earnedstar.com**. This repo is the
**Next.js front only**. The NestJS API lives in the **separate** `earnedstar-back`
repo (sibling directory), not bundled here.

## Two-repo layout

| Repo | Path | Deploy | URL |
|------|------|--------|-----|
| **Front** (this repo) | `earnedstar-front/` | Vercel project `earnedstar` | `https://earnedstar.com` |
| **Back** | `../earnedstar-back/` | Vultr `earnedstar-back-nest` (:8094) | `https://api-vultr.earnedstar.com/api` |

Front ↔ back is HTTP only (BFF → `NEXT_PUBLIC_API_URL`); the front imports no
backend TypeScript. GitHub: `github.com/moshbenav-commits/earnedstar-front`.

> **Convergence (2026-07-09):** a stale bundled copy of the API previously lived
> under `earnedstar-front/backend/` (v0.1.0, not Vercel-linked, missing the
> stripe-billing work). It was deleted — the standalone `earnedstar-back` repo
> (v0.2.0, linked to Vercel `earnedstar-back`) is the sole source of truth for
> the backend. Do not re-add a `backend/` folder here.

```bash
# Both processes (front here + API from ../earnedstar-back)
./scripts/dev.sh          # set EARNEDSTAR_BACK_DIR to override the API path

# Front only :3000
npm run dev

# API only :8081 — run from the backend repo
cd ../earnedstar-back && npm run start:dev
```

## Stack

- **Next.js 16** · React 19 · TypeScript · Tailwind CSS 4
- **NestJS 11** API — separate repo `../earnedstar-back`, serves `/api/earnedstar/*`
- **Billing:** Authorize.net ARB + Stripe subscriptions (in `earnedstar-back`)
- **Data:** Supabase Postgres — project `ppnbpblnuxbihhxgozxi`

## Brand assets (workspace SSOT)

- `../brand/earnedstar/` — manifests, HF exports, workshop
- `public/marketing/` — mirrored stills for homepage editorial gallery
- Nano queue: `npm run brand:site-nano:build -- --site=earnedstar` (workspace root)

## Specs

- [`../docs/prompts/AI_EARNEDSTAR_SPEC.md`](../docs/prompts/AI_EARNEDSTAR_SPEC.md)
- [`../docs/prompts/earnedstar/DESIGN.md`](../docs/prompts/earnedstar/DESIGN.md)
- [`../docs/branding/earnedstar-logo-spec.md`](../docs/branding/earnedstar-logo-spec.md)

## Deploy

```bash
# Front (earnedstar.com)
npm run deploy:prod

# API (api-vultr.earnedstar.com) — deploy from the backend repo
cd ../earnedstar-back && bash scripts/deploy-vercel.sh
```

`vercel.json` sets `git.deploymentEnabled: false` — use scripts above.

| Env (production front) | `NEXT_PUBLIC_API_URL=https://api-vultr.earnedstar.com/api` |

## API wiring

- BFF: `src/app/api/**` — session cookies, no raw JWT in browser
