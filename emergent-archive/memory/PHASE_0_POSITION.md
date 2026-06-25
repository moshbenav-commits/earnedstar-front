# Phase 0 — Position & Promise (Weeks 0–1)

> **Goal:** Rewrite the story before adding code. Lock the positioning, tagline, and 4 promises across the site. Visibly commit to truth before competitors notice we're doing it.

## Why This Phase Exists
Buyers and merchants are exhausted by Trustpilot bills and Yotpo's Email/SMS shutdown. The market has no "manifesto brand" in reviews — we claim that ground for free, in a week.

## Design Specs

### Hero
- **Tagline:** *"Reviews that earned their place — and prove it."*
- **Sub-headline:** "The only e-commerce review platform where every star is order-verified, AI-fraud-audited, and publicly provable."
- **Layout:** Editorial masthead bar (Vol. 01 · Edition I · live date) + display headline clamp(3rem, 7vw, 6.5rem) Instrument Serif italic with hand-drawn gold underline on *earned* and *prove*
- **Right column:** 3D leather lucky star with orbiting dotted gold ring, float animation
- **Live Trust Counter strip below:** verified reviews · fraud blocked · 22h dispute SLA · 0 reviews ransomed (ticking animation, refresh every 9s)
- **As-seen-in marquee:** scrolling press logos in Instrument Serif

### Manifesto Block (4 Promises)
- Roman numerals (I, II, III, IV)
- Vellum cards with paper-grain noise
- Hairline gold rule under each title
- Sticky sidebar label "THE MANIFESTO · Chapter 01"

### Comparison Table
- "Look at the *whole* table. Not the brochure." headline
- Vellum card with gilded edge, gold-foil checkmarks
- EarnedStar column highlighted with gold-light wash
- 10 rows: features × 4 competitors (Trustpilot, Yotpo, Judge.me)

### Closing Imprint
- Centered manifesto pull-quote
- Gold hairline rules flanking "VOLUME I · EDITION 2026"

## Implementation Tasks

### Backend
- `GET /api/trust-counter` — returns running counts (verified reviews + fraud blocked + SLA + ransomed)
- Seed initial counters; tick them forward 1/minute via a cron or scheduled task
- Add `manifesto_signups` table to capture homepage "Yotpo Refugees" leads

### Frontend
- `HomePage.jsx` — implemented ✅
- `MarketingNav.jsx` — masthead bar with date + edition ✅
- `MarketingFooter.jsx` — editorial colophon ✅
- `/manifesto` standalone page (split from homepage for SEO)
- `/how-trust-works` math-of-fraud-scoring explainer

### Content
- Write copy for `/manifesto` page (4 promises × 250 words each)
- Compose pull-quotes for each promise
- Draft press kit one-pager

## Data Models
```python
class TrustCounter(BaseModel):
    verified_reviews: int
    fraud_blocked_this_month: int
    avg_dispute_sla_hours: int
    reviews_ransomed: int  # always 0 by design
    updated_at: datetime
```

## Dependencies
- None — Phase 0 is content + design only

## Acceptance Criteria
- Homepage CTA click-rate ≥ baseline + 25%
- Bounce rate < 40% on `/manifesto` and `/`
- Live trust counter updates every 9 seconds without flicker
- 100+ "Yotpo refugee" leads captured in week 1

## Success Metrics
- Hero CTA click-rate **+25%**
- "Compare" section depth-scroll **≥ 60%**
- 1+ unsolicited press mention within 2 weeks

— Phase 0 doc · E1 · Jan 2026
