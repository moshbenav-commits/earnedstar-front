# AGENTS.md — EarnedStar (monorepo)

B2B SaaS verified review platform at **earnedstar.com**.

## Monorepo layout (PraxiumLaw-style)

| Path | Deploy | URL |
|------|--------|-----|
| **Repo root** (`earnedstar/`) | Vercel project `earnedstar` | `https://earnedstar.com` |
| **`backend/`** | Vercel project `earnedstar-back` (link `.vercel/project.json` in `backend/`) | `https://earnedstar-back.vercel.app/api` |

When connecting GitHub to `earnedstar-back`, set Vercel **Root Directory** to `backend`.

GitHub: `github.com/moshbenav-commits/earnedstar-front` (front + API in one repo).

```bash
# Both processes
./scripts/dev.sh

# Front only :3000
npm run dev

# API only :8081
cd backend && npm run start:dev
```

## Stack

- **Next.js 16** · React 19 · TypeScript · Tailwind CSS 4
- **NestJS 11** API in `backend/` — `/api/earnedstar/*`
- **Billing:** Authorize.net ARB
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

# API (earnedstar-back.vercel.app)
cd backend && bash scripts/deploy-vercel.sh
```

`vercel.json` sets `git.deploymentEnabled: false` — use scripts above.

| Env (production front) | `NEXT_PUBLIC_API_URL=https://earnedstar-back.vercel.app/api` |

## API wiring

- BFF: `src/app/api/**` — session cookies, no raw JWT in browser
