# AGENTS.md — earnedstar-back

Standalone NestJS API for **EarnedStar** (`earnedstar.com`).

**Repo:** `github.com/moshbenav-commits/earnedstar-back`
**Front:** `github.com/moshbenav-commits/earnedstar-front`

## Stack

- NestJS 11 · **Supabase Postgres only** (`DATABASE_URL`) · Vercel serverless
- **No MongoDB** — relational review data stays in Postgres (cheaper + simpler than a second Atlas cluster)

## Routes (`/api/earnedstar/*`)

| Path | Purpose |
|------|---------|
| `GET /earnedstar/merchants/:slug` | Merchant profile |
| `GET /earnedstar/reviews/:slug` | Published reviews |
| `POST /earnedstar/reviews/submit` | Submit review (invitation token) |
| `POST /earnedstar/invitations/send` | Send invitation |
| `GET /earnedstar/widgets` | Widget list |
| `GET /earnedstar/dashboard/overview` | Dashboard stats |
| `GET /earnedstar/billing/status` | Authorize.net ARB status + public config |
| `POST /earnedstar/billing/subscribe` | ARB subscription (merchant session) |
| `POST /earnedstar/webhooks/order-fulfilled` | Order-fulfilled → invitation (optional partner webhook) |
| `POST /earnedstar/auth/provision` | Link Supabase user → business row |
| `GET /earnedstar/auth/me` | Merchant profile for session |

Without `DATABASE_URL`, responses use **mock data** (dev-friendly).

**Supabase project:** `ppnbpblnuxbihhxgozxi` — see `../docs/EARNEDSTAR_DATABASES.md` (Postgres only; no Mongo).

## Commands

```bash
npm run start:dev    # localhost:8081/api
npm run build
```

## Deploy

`vercel.json` sets `git.deploymentEnabled: false`. Manual `vercel deploy --prod`.

| Vercel project | `expedia-solutions/earnedstar-back` |
| Project ID | `prj_L8rtLqEJ9qiIOYgsvmaFPjvzCaAR` |
| Production | `https://earnedstar-back.vercel.app/api` |

## Related

- Front BFF: `earnedstar-front/src/app/api/earnedstar/**`
- Spec: `../docs/prompts/AI_EARNEDSTAR_SPEC.md`
- Migration: `../earnedstar/supabase/migrations/001_initial.sql`

**Note:** `expedia-parts-back` still hosts a copy of `/earnedstar/*` for shared gamma during transition. Prefer **earnedstar-back** for EarnedStar-only deploys.
