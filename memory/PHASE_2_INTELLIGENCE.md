# Phase 2 — Intelligence (Weeks 6–9)

> **Goal:** Become the AI-native review platform. Ship every AI feature Yotpo charges $199+/mo for, but on the $99 Growth plan.

## Pain Solved
Merchants can't reply to all reviews. Buyers can't read 500 reviews. Theme detection is invisible without AI. Trustpilot gates AI auto-reply to Enterprise ($24K+/yr). Yotpo paywalls AI summaries. We undercut both with a flat $99 plan.

## Design Specs

### AI Review Summary (Public-facing)
- Box on store profile labeled "AI Customers Say" with sparkle icon
- Tone: editorial 3-sentence prose (Sentence 1: praise · Sentence 2: themes · Sentence 3: critiques)
- "Generate" button if not yet computed; auto-regenerates weekly
- Multilingual: auto-translates to viewer's locale
- Style: italic quote in `text-pretty`

### AI Smart-Reply (Dashboard)
- Appears next to each review in dashboard table
- "Smart-Reply" button → loading spinner → drops reply into editable textarea
- Tone selector: warm / professional / apologetic
- Edit / Send buttons
- Sent replies appear on store profile as merchant response

### Sentiment Topic Clusters
- Dashboard section with up to 5 top themes
- Per-topic card: topic name (Instrument Serif italic), mention count, sentiment pill (positive/mixed/negative), example quote
- "Re-analyze" button triggers Gemini Flash batch

### AI Q&A Auto-Answer
- On store profile, when buyer asks a question, drafts an answer from past reviews
- Merchant approves with one click → publishes
- Tagged "Compiled from N verified reviews"

### Fraud Explainability
- On Trust Receipt modal, expand fraud signals into 5-signal breakdown
- Tooltip explains each signal in plain English

## Implementation Tasks

### Backend
- `POST /api/ai/store-summary` (Claude Sonnet 4.6) ✅
- `POST /api/ai/smart-reply` (Claude Sonnet 4.6) ✅
- `POST /api/ai/sentiment-topics` (Gemini Flash) ✅
- `POST /api/ai/qa-autoanswer` → returns answer + citations from review IDs
- `POST /api/ai/fraud-explain` → breakdown of 5 signals
- **Hybrid routing strategy:**
  - Tone-sensitive (replies, summaries) → Claude Sonnet 4.6
  - Batch (sentiment, fraud, classification) → Gemini Flash
  - Cost target: ≤ $3/merchant/month at Growth tier
- Cron: regenerate store summaries weekly (low-traffic hour)
- Cache summaries in `ai_summaries` table with `expires_at`

### Frontend
- `StorePage.jsx` AI Customers Say box ✅
- `DashboardPage.jsx` Reviews tab with Smart-Reply ✅
- `DashboardPage.jsx` Sentiment tab ✅
- Public Q&A widget on store profile
- Add tone selector to Smart-Reply UI

### Streaming UI Enhancement (P1)
- Convert AI responses to server-sent events (SSE)
- Token-by-token reveal in Smart-Reply textarea
- Backend uses `chat.stream_message()` already buffered → expose as SSE

## Data Models
```python
class AISummary(BaseModel):
    store_slug: str
    summary: str
    generated_at: datetime
    expires_at: datetime
    model: str  # "claude-sonnet-4-6"

class SmartReply(BaseModel):
    review_id: str
    suggested_reply: str
    tone: Literal["warm", "professional", "apologetic"]
    sent: bool
    sent_at: Optional[datetime]
```

## Dependencies
- Phase 0 (positioning)
- Phase 1 (Trust Receipts feed into fraud explainability)
- Emergent Universal LLM Key

## Acceptance Criteria
- % merchants using Smart-Reply weekly ≥ 60%
- Avg response time on reviews −70% vs baseline
- AI summary appears on ≥ 80% of public store profiles
- AI cost per Growth merchant ≤ $3/mo
- Conversion: Yotpo Refugee landing page → trial ≥ 8%

## Success Metrics
- 80%+ of merchants adopt AI Smart-Reply within 30 days
- Net Promoter Score on AI features ≥ 60
- Sales talking point lands: "Get Yotpo's $1,200/mo AI features on our $99 plan"

— Phase 2 doc · E1 · Jan 2026
