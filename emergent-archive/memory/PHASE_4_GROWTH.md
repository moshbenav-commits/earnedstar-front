# Phase 4 — Growth Engines (Weeks 16–20)

> **Goal:** New revenue lines beyond subscription + viral acquisition wedges. Ship Buyer Intent leads, Conversion Attribution, EarnedStar Leaders Awards, the free Review Audit viral tool.

## Design Specs

### Conversion Attribution Dashboard
- Hero plate showing attributed revenue: "$94,234 attributed this quarter"
- Sub-metrics: ROI vs plan cost · Google CTR lift · conversion rate lift
- Pixel snippet to add to merchant's checkout

### EarnedStar Leaders Awards
- `/leaders` page with quarterly winners by category
- Custom award medallion render per merchant (use Q1 LEADER asset as base)
- Embed code generator (HTML + JSON-LD)
- Press kit auto-generator (PDF + tweet templates)

### Buyer Intent Signals (Pro tier feature)
- Dashboard panel: who's viewing your store profile (anonymized buyer signals)
- Leads delivered as weekly digest
- "Sell as leads to other merchants in your category" opt-in

### Review Audit Viral Tool
- Public `/audit` page ✅
- Paste any Trustpilot/Yotpo URL → AI estimates fake-review % + patterns + recommendation
- Shareable PDF report with EarnedStar branding
- Lead capture: "Email me the full audit"

### Competitive Benchmarks (Pro+)
- Anonymized category averages: "Your 4.6 vs Auto Parts category 4.2"
- Top 10% / 50% bands
- "How to climb the leaderboard" recommendations

### "Yotpo Bill Calculator" viral tool
- Input your Yotpo + Klaviyo + Attentive bills → see EarnedStar savings
- Shareable result page
- Embedded on Yotpo Refugees landing

## Implementation Tasks

### Backend
- `POST /api/attribution/track` — pixel beacon endpoint
- `GET /api/attribution/:merchant` — return attributed-revenue rollup
- `POST /api/ai/review-audit` (Gemini Flash) ✅ — viral tool
- `GET /api/leaders/:quarter/:category` — leaderboard for awards
- `POST /api/awards/:merchant/badge` — generate custom award medallion (Nano Banana inpainting)
- `GET /api/intent/:merchant/leads` — buyer intent signals
- `POST /api/benchmarks/:category` — anonymized category aggregates

### Frontend
- `/audit` ✅
- `/yotpo-refugees` ✅
- `/leaders` — public leaderboard page with category navigation
- Conversion Attribution dashboard ✅
- Buyer Intent dashboard panel
- Yotpo Bill Calculator landing page
- "Customize your badge" flow on `/brand`

## Data Models
```python
class AttributionEvent(BaseModel):
    merchant_id: str
    session_id: str
    type: Literal["review_view", "click", "purchase"]
    review_id: Optional[str]
    revenue: Optional[float]
    timestamp: datetime

class LeaderAward(BaseModel):
    merchant_id: str
    category: str
    quarter: str  # "Q1-2026"
    rank: int
    trust_score: int
    badge_url: str  # generated PNG
    press_kit_url: str

class BuyerIntentSignal(BaseModel):
    merchant_id: str
    anon_user_hash: str
    viewed_at: datetime
    referrer: str
    products_viewed: List[str]
```

## Dependencies
- Phase 1 (Trust Score feeds Leaders rankings)
- Phase 2 (AI Review Audit)
- Phase 3 (attribution requires conversion data from EarnedMail)

## Acceptance Criteria
- "Review Audit" tool runs ≥ 5K/mo within 6 months → ≥ 8% lead capture
- 50+ Leaders badges shared on social per quarter
- 30% of new MRR from non-subscription products (audit leads, intent, awards)
- Yotpo Refugee migration conversion ≥ 12%

## Success Metrics
- 1M+ visits to `/audit` cumulative
- $1M ARR from Buyer Intent product within first year
- 250+ Quarterly Leaders embeds on merchant sites

— Phase 4 doc · E1 · Jan 2026
