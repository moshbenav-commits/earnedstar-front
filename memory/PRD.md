# EarnedStar 2.0 — Strategic Prototype & Phase Plan

## Original Problem Statement
> "i built earnedstar.com but iwant to make it a complete review solution simimlar to g2 or aother sites can yuou do some research and see waht i have built and se how we can make it the top leader in reviews becuase we will add all teh solutions that are missign and close teh gap to the biggest pain poimnts can you do that reseratch first"

User refined: **stay e-commerce focused** (Trustpilot/Yotpo/Stamped/Loox/Judge.me as benchmarks), become category leader by closing every pain point in the market.

## User Personas
1. **Merchant (Reman Transmissions-style):** $200K–$10M/yr DTC + niche e-commerce, exhausted by Trustpilot bills and Yotpo's Email/SMS shutdown.
2. **Shopper:** Wants to trust reviews; clicks "Verify" on each review to see the Trust Receipt.
3. **Agency:** Manages 5–50 DTC clients, needs white-label.

## Strategy Decisions (locked)
- **Brand:** Keep EarnedStar primary. Defensive `truestar.com` bought.
- **Sub-brands:** EarnedMail, EarnedSend, EarnedLoyalty (drop "Star" suffix).
- **First phase to build:** Phase 3 — Integrated Email/SMS Stack (Yotpo Exodus play).
- **AI hybrid:** Claude Sonnet 4.6 (tone) + Gemini 3 Flash (batch).
- **Pricing:** Full 8-tier restructure (Free → Enterprise). Overage allowed.
- **Logo evolution:** Animated Lottie + Verified Human sub-badge + Monoline tattoo variant (deferred to next iteration).

## What's Been Implemented (Jan 2026)

### Strategy Deliverables (in `/app/memory/`)
- `EARNEDSTAR_STRATEGY.md` — initial competitive research & gap analysis
- `EARNEDSTAR_CONCEPT_AND_PHASES.md` — concept reframe (Trust Infrastructure), 6 phases
- `EARNEDSTAR_DEEP_PHASES.md` — deep dive: pain points, what competitors charge per feature, pricing intel, edge features per phase

### Working Prototype (deployed at preview)
Stack: React 19 + FastAPI + MongoDB + Tailwind 3 + framer-motion + recharts + lucide-react + emergentintegrations (Claude Sonnet 4.6 + Gemini 3 Flash via Emergent Universal Key)

**Pages live:**
- `/` — Marketing Homepage: hero, live Trust Receipts counter (4 metrics, ticking), 4-promise manifesto, EarnedStar vs Trustpilot/Yotpo/Judge.me comparison table, Yotpo Exodus CTA with savings calculator ($7,188/yr), free Review Audit teaser
- `/pricing` — 7-tier pricing (Free → Agency $499) + monthly/annual toggle + full feature matrix
- `/audit` — Free public Review Audit tool (paste any URL → Gemini Flash returns fake-review % + patterns + recommendation)
- `/yotpo-refugees` — Yotpo migration landing with side-by-side savings + 3-step migration explanation
- `/store/reman-transmissions` — Public store profile: store header with awards, AI Review Summary (Claude on-demand), 8 verified reviews with YMM filter, Pros/Cons, "Verify" button → Trust Receipt modal with order hash, identity tier, fraud score, signals, AI-review probability
- `/store/reman-transmissions/moderation` — Public Moderation Ledger (every removed/restored/flagged review with reason and decision-maker)
- `/dashboard` — Merchant Dashboard for Reman Transmissions (Growth $99 demo): 8 KPIs, verified review volume chart, rating distribution, Conversion Attribution ($94K), Reviews tab with AI Smart-Reply per review (Claude), Sentiment topic clusters (Gemini), EarnedMail (campaigns + flows tables), EarnedSend (SMS), EarnedLoyalty (rules + KPIs), Audience segments, Widgets gallery, Settings

**Backend endpoints:**
- `GET /api/trust-counter` — live ticker counter
- `GET /api/stores` · `GET /api/stores/:slug` · `GET /api/stores/:slug/reviews` · `GET /api/stores/:slug/moderation`
- `GET /api/reviews/:id/trust-receipt`
- `POST /api/ai/store-summary` (Claude Sonnet 4.6)
- `POST /api/ai/smart-reply` (Claude Sonnet 4.6)
- `POST /api/ai/review-audit` (Gemini 3 Flash)
- `POST /api/ai/sentiment-topics` (Gemini 3 Flash)

**Seed data:**
- 3 stores: Reman Transmissions, North Folk Coffee, Everwild Outdoors
- 8 realistic reviews on Reman Transmissions with YMM, Pros/Cons, identity tiers (Bronze/Silver/Gold), fraud scores
- 4 moderation ledger entries (removed, restored, flagged)

## Brand Identity (preserved from user's existing repo)
- **Logo:** Origami pentagonal star with concentric SVG gradients, gold ring medallion (✓ or ES VERIFIED) — implemented as React component
- **Colors:** Navy `#0F2044`, Gold `#F59E0B` (gradient `#FDE68A` → `#B45309`), Cream `#FAFAF9`
- **Fonts:** Plus Jakarta Sans (body) + Instrument Serif italic (display)
- **Voice:** "Every star earned, not bought." Confident, contrarian, manifesto-like.

## Prioritized Backlog

### P0 (next session candidates)
- Wire AI streaming (currently buffered) into Smart-Reply for live token-by-token effect
- Build animated Lottie origami unfold for hero (logo evolution item a)
- Build "Verified Human" sub-badge component (logo evolution item b)
- Build monoline "tattoo" logo variant for footers/emails (logo evolution item c)
- Add interactive widget code-embed previews (Widgets section)

### P1
- Public `/manifesto` page (currently the homepage embeds the manifesto block; could split)
- `/how-trust-works` math-of-fraud-scoring explainer page
- Authentication (merchant + reviewer; user previously deferred — JWT or Emergent Google)
- "Verified Human" mini-modal that opens when buyers hover the badge
- Email campaign drag-drop builder (mock today; real builder = Phase 3 second sprint)

### P2 (Phase 4 viral)
- "Yotpo Bill Calculator" — input current bill → save shareable receipt
- EarnedStar Leaders Awards quarterly badges + press kit
- Public earnedstar.com/leaders SEO page

### P3 (Phase 5 long arc)
- `earnedstar.com/shop` discovery marketplace
- Buyer accounts, follow merchants, alerts
- Vertical schemas (beauty, apparel, home, supplements)
- SOC 2 prep, SAML SSO

## Deployment Notes
- Existing repo `moshbenav-commits/earnedstar-front` is Next.js 16 + Supabase + Vercel. This prototype is built in React + FastAPI for fast Emergent prototyping. **Code is intentionally pure React + Tailwind so it ports cleanly into Next.js pages and components.**
- The Origami star logo (`EarnedStarMark.jsx`) is portable to Next.js — direct copy works.
- AI endpoints use `emergentintegrations` + Emergent Universal Key — when porting, swap to Anthropic/Google direct SDKs or keep Emergent integration depending on preference.

## Next Recommended Action
Pick one:
1. **Polish + deploy more pages** (manifesto, how-trust-works, animated logo)
2. **Build real email campaign drag-drop builder** in dashboard
3. **Port this prototype to the Next.js repo** (would need GitHub write access)
4. **Add authentication** so multiple demo merchants can sign up
