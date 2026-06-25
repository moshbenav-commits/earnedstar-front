# Phase 3 — Integrated Stack (Weeks 10–15) ⭐ BIGGEST WEDGE

> **Goal:** Ship EarnedMail + EarnedSend + EarnedLoyalty. Win the Yotpo Exodus by being the only platform with native reviews + email + SMS + loyalty.

## Pain Solved
- Yotpo killed Email/SMS Dec 31, 2025 — thousands of merchants migrating
- Current alternatives fragment the stack (Klaviyo $150 + Attentive $300 + Yotpo $99 + Smile $49 = $598/mo)
- We replace all 4 tools at $99/mo

## Design Specs

### EarnedMail (Dashboard section)
- Header: "EarnedMail · Replaces Klaviyo"
- 3 KPI plates: Sends/mo, Open rate, Click rate
- **Review-Triggered Flows table**: name · channel · sent · open % · replies · status
- **Campaigns table**: drag-drop builder access · sent · open · click · attributed $
- Flow templates seeded:
  - Post-purchase invite (7d after delivery)
  - Win-back · 90 days no order
  - Low-rating recovery (auto-trigger when ≤ 3★)
  - NPS Promoter referral
- Drag-drop email builder (Grapesjs or BeeFree integration)
- AI subject-line writer + send-time optimizer

### EarnedSend (SMS)
- Header: "EarnedSend · Replaces Attentive"
- KPIs: SMS sent, delivery rate, click rate, avg reply time
- Recent SMS list with delivery status
- Channels: SMS (Twilio) · WhatsApp Business · Apple Business Messages

### EarnedLoyalty
- KPIs: members, repeat rate, points issued, AOV lift
- Reward rules table (review = 100 pts, photo = +50 pts, referral = $25, anniversary = $15)
- Customer-facing rewards page widget

### Audience Segments
- 6 default segments visible: 5★ promoters, at-risk, photo-reviewers, YMM-specific, first-time, predicted-churn
- "Target this segment" → composes new EarnedMail/Send campaign

### Migration Importer (#YotpoRefugees)
- One-page wizard: upload Yotpo export → field mapping → flow recreation → flip-the-switch
- Branded "3 months free" promo
- Live progress bar showing imported subscribers, segments, flows

## Implementation Tasks

### Backend
- **Email infrastructure:**
  - Integrate Resend or SendGrid for SMTP
  - Domain verification (SPF/DKIM/DMARC checks endpoint)
  - Templates table + drag-drop JSON storage
- **SMS infrastructure:**
  - Twilio integration (SMS) — phone provisioning per merchant
  - WhatsApp Business API (Twilio also)
  - Apple Business Messages registration flow
- **Flow engine:**
  - Trigger types: order_fulfilled, review_submitted, review_rating, time_elapsed, NPS_score
  - Condition tree (if/then/else)
  - Step types: send_email, send_sms, wait, branch, tag, segment_add
  - Background worker (Celery or APScheduler) to process flow steps
- **Loyalty:**
  - Points ledger per customer (`loyalty_points` table)
  - Reward rules table
  - Discount code generation (one-time codes per redemption)
- **Predictive CLV:**
  - Use review sentiment as churn signal
  - Compute monthly per customer
- **Migration importer:**
  - Yotpo CSV format parser
  - Klaviyo / Mailchimp / Privy adapters

### Frontend
- EarnedMail dashboard section ✅ (UI shell shipped)
- EarnedSend dashboard section ✅
- EarnedLoyalty dashboard section ✅
- Real campaign builder (drag-drop) — open source: GrapesJS or Unlayer
- Importer wizard (multi-step form)
- Migration progress monitor

## Data Models
```python
class EmailCampaign(BaseModel):
    id: str
    merchant_id: str
    name: str
    channel: Literal["email", "sms", "whatsapp", "apple_business"]
    template_json: Dict
    subject: Optional[str]
    sent_count: int
    opened_count: int
    clicked_count: int
    attributed_revenue: float
    status: Literal["draft", "scheduled", "sending", "sent", "paused"]

class Flow(BaseModel):
    id: str
    merchant_id: str
    name: str
    trigger: Dict  # e.g., {"type": "order_fulfilled", "days_after": 7}
    steps: List[Dict]
    active: bool

class LoyaltyMember(BaseModel):
    customer_email: str
    merchant_id: str
    points_balance: int
    lifetime_points: int
    last_activity: datetime
    predicted_churn_score: float  # 0–1
    predicted_clv: float
```

## Dependencies
- Phase 1 (verified review data drives behavioral segments)
- Phase 2 (AI subject-line writer requires Phase 2 AI integration)
- Resend or SendGrid account + verified sending domain
- Twilio account + phone number per merchant
- Auth (Phase 3 prerequisite — needs merchant accounts)

## Acceptance Criteria
- 1,000+ Yotpo migrations imported in first 90 days
- Avg merchant replaces ≥ 2 tools when switching
- Email deliverability ≥ 98% on warmed domain
- Email-driven revenue attribution ≥ 15% of merchant GMV
- ARPA lift: $99 → $150 via Loyalty add-on adoption

## Success Metrics
- Win rate vs Yotpo head-to-head ≥ 50%
- Public Yotpo refugees counter ticks past 1,000 by week 12
- Replace-3-tools-with-1 message lands in 40%+ of sales calls

— Phase 3 doc · E1 · Jan 2026
