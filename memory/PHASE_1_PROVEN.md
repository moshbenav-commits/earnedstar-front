# Phase 1 — Proven (Weeks 2–5)

> **Goal:** Make "verified" publicly undeniable. Ship Trust Receipts, Moderation Ledger, 24h Dispute SLA, AI-Review Detector. No competitor has any of these.

## Why This Phase Exists
Fake reviews and arbitrary moderation are the #1 trust-killers in the category. Phase 1 turns transparency into a moat. Once a public dispute-SLA counter is ticking, every competitor looks shady by comparison.

## Design Specs

### Trust Receipt Modal
- Opens on click of "Verify ↗" link on every review card
- Header: leather star + "TRUST RECEIPT" smallcaps + author name in Instrument Serif italic
- Receipt rows (emerald check icon · status):
  - Order verified → hash `8f4a...e9b1`
  - Identity tier → Bronze / Silver / Gold
  - AI fraud score → 12/100 (lower is safer)
  - Verified Human → AI-review probability 1.2%
  - Submitted → 9 days post-delivery
  - Moderation status → approved (merchant decided)
- Fraud signals pill row: `device_clean` · `ip_geolocation_match` · `typing_cadence_human` · `no_incentive_offered`
- Footer note: *"This is what 'earned' looks like. How trust works ↗"*

### Moderation Ledger Page (`/store/:slug/moderation`)
- Editorial header: "Every decision, *in the open*."
- Entries:
  - Action pill (removed / restored / flagged) with color-coded ring
  - Decided-by badge (AI · merchant · earnedstar)
  - Pull-quote excerpt in Instrument Serif italic
  - Reason paragraph
  - Appeal status if applicable
- Footer: "The 24-hour Dispute SLA" card with running average

### Verified Human Badge (Anti-AI)
- Standalone leather star + shield + "VERIFIED HUMAN" plaque (existing Meshy render)
- Tooltip on hover: "Passed 5 AI-review detection checks"
- Display on review card when `verified_human === true`

### Buyer Identity Tiers
- Bronze: order hash only
- Silver: + email confirmed
- Gold: + LinkedIn or government ID
- Visual: small pill next to author name with shield icon

## Implementation Tasks

### Backend
- `GET /api/reviews/:id/trust-receipt` — return TrustReceipt struct ✅
- `GET /api/stores/:slug/moderation` — list moderation events ✅
- `POST /api/reviews/:id/dispute` — merchant flags suspected fake → enters dispute queue
- `GET /api/dispute-sla` — running average resolution time (publicly served)
- **AI-Review Detector** (Phase 1 critical):
  - `POST /api/ai/detect-ai-review` → returns `{ai_probability, perplexity, burstiness, signals[]}`
  - Uses Gemini Flash for cost-efficiency
- **Identity verification flow:**
  - `POST /api/identity/verify-email` → confirmation email
  - `POST /api/identity/verify-linkedin` → OAuth integration
- Scheduled job: recalculate dispute SLA every 5 minutes

### Frontend
- `StorePage.jsx` Trust Receipt modal ✅
- `ModerationLedger.jsx` page ✅
- `/how-trust-works` explainer with the math
- Dashboard: dispute queue table with flag→escalate buttons
- Dashboard: identity-tier-requirement setting

### Data Models
```python
class TrustReceipt(BaseModel):
    review_id: str
    order_hash: str
    fraud_score: int  # 0–100
    fraud_signals: List[str]
    identity_tier: Literal["bronze", "silver", "gold"]
    verified_human: bool
    ai_review_probability: float  # 0.0–1.0
    timestamp: datetime
    moderation_status: Literal["approved", "pending", "removed"]
    days_after_delivery: int

class ModerationEntry(BaseModel):
    id: str
    store_slug: str
    review_excerpt: str
    action: Literal["removed", "restored", "flagged"]
    reason: str
    decided_by: Literal["AI", "merchant", "earnedstar"]
    appeal_status: Literal["none", "in_review", "resolved", "rejected"]
    timestamp: datetime
```

## Dependencies
- Phase 0 (homepage references the dispute-SLA counter)
- Emergent LLM key (Gemini Flash for AI-review detection)

## Acceptance Criteria
- "Verify ↗" modal opens / 1,000 review views ≥ 30
- Public dispute SLA ≤ 24h sustained for 30 consecutive days
- Merchant NPS on trust ≥ 70
- AI-Review Detector correctly flags ≥ 90% of GPT-4-class reviews on benchmark set
- 0 reviews ransomed (definitional — portability promise)

## Success Metrics
- 1+ PR placement on the Verified Human badge (e.g., Modern Retail, TechCrunch)
- Conversion: "Verify" modal viewers → trial signups ≥ 4%
- Public dispute SLA counter sustained ≤ 22h average

— Phase 1 doc · E1 · Jan 2026
