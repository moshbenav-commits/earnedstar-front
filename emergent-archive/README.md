# Emergent prototype archive (`conflict_240626_0022`)

This folder preserves the **Emergent CRA + FastAPI prototype** merged from branch `conflict_240626_0022`.

**Production site:** Next.js in repo root (`src/app/`, `src/components/`).

**Do not deploy** `emergent-archive/frontend` or `emergent-archive/backend`. Use this tree for design reference, copy, and API behavior parity only.

| Emergent path | Ported to (Next.js / NestJS) |
|---|---|
| `frontend/src/pages/HomePage.jsx` | `src/app/page.tsx` + `src/components/marketing/*` |
| `GET /api/trust-counter` | `earnedstar-back` → `GET /earnedstar/marketing/trust-counter` |
| `POST /api/ai/review-audit` | `earnedstar-back` → `POST /earnedstar/marketing/review-audit` |
| `frontend/src/pages/YotpoRefugeesPage.jsx` | `src/app/yotpo-refugees/page.tsx` |
| `frontend/src/pages/AuditPage.jsx` | `src/app/audit/page.tsx` |
| `design_guidelines.json` | `src/app/globals.css` editorial tokens |

Merged: 2026-06-25
