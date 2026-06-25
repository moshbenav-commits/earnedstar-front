# Phase 5 — Discovery Layer (Weeks 21–32)

> **Goal:** Become a destination, not just a widget. Ship `earnedstar.com/shop` — the only verified-only commerce marketplace.

## The Long Arc
After 18 months you control buyer attention → which means you control merchant willingness to pay → SaaS revenue evolves into marketplace economics. This is the Trustpilot/G2 endgame, built on truthful foundations from day one.

## Design Specs

### `/shop` Marketplace
- Hero: "Find verified-only merchants. By category. By rating. By Trust Score."
- Category grid (12+ verticals): Auto Parts, Beauty, Apparel, Home Goods, Health Supplements, Specialty Coffee, Outdoor Apparel, Pet, Baby, Kitchen, Fitness, Hobbies
- Featured Leaders rail (rotating quarterly winners)
- "How EarnedStar ranks merchants" explainer link

### Category Pages (`/shop/:category`)
- Sortable by Trust Score (default), rating, review count
- Per-merchant card: leather star + name + rating + review count + Trust Score badge + "Recent Leaders Award" if applicable
- Filter chips: vertical-specific (e.g., for auto parts: by make, by part category)
- SEO-rich content blocks (best-of lists, buyer guides)

### Merchant Profile (`/store/:slug`) — expand from Phase 1
- Already implemented ✅
- Add: "Other shoppers also viewed" rail
- Add: "Compare similar merchants" tool

### Buyer Accounts
- Sign up to save merchants, follow categories, receive Leaders Award alerts
- Public reviewer profile (with consent)
- "Trusted reviewer" badge for users with 25+ verified reviews

### Vertical Schemas (extend Reman's YMM example)
- **Beauty:** shade/skin type
- **Apparel:** size/fit
- **Home Goods:** room/style
- **Health Supplements:** condition/age/dose

### Enterprise Layer
- Multi-tenant organizations (parent + child merchants)
- SAML SSO
- Audit logs
- SOC 2 Type 1 certification
- EU DSA / AI Act compliance dashboards

## Implementation Tasks

### Backend
- `GET /api/shop/categories` — list 12+ verticals with counts
- `GET /api/shop/:category` — paginated merchant list
- `GET /api/shop/leaders` — quarterly featured merchants
- `POST /api/buyer/follow/:merchant` — follow action
- `POST /api/buyer/profile` — buyer account CRUD
- Vertical schema service (pluggable per category)
- SSO (SAML 2.0) library (e.g., `python3-saml`)
- Audit logging middleware → write to `audit_logs` table
- SOC 2 documentation toolkit (Drata or Vanta integration)

### Frontend
- `/shop` marketplace homepage
- `/shop/:category` category page (SSR for SEO)
- `/buyer/dashboard` for buyer accounts
- `/store/:slug/compare` comparison tool
- Vertical filter components per schema

## Data Models
```python
class BuyerAccount(BaseModel):
    id: str
    email: str
    name: Optional[str]
    followed_merchants: List[str]
    followed_categories: List[str]
    is_trusted_reviewer: bool
    review_count: int
    public_profile: bool

class CategoryListing(BaseModel):
    category: str
    name: str
    merchant_count: int
    leaders_quarter: Optional[str]
    schema_fields: List[Dict]  # vertical-specific

class AuditLog(BaseModel):
    id: str
    actor_type: Literal["user", "merchant", "system", "agent"]
    actor_id: str
    action: str
    target_type: str
    target_id: str
    metadata: Dict
    timestamp: datetime
```

## Dependencies
- All previous phases (Phase 5 is the integrator)
- Auth system (Phase 3 prerequisite)
- Vercel/CDN for SEO category pages

## Acceptance Criteria
- 1M+ monthly `/shop` visits within 12 months
- ≥ 10% of merchants report new-customer traffic from EarnedStar discovery
- Buyer Intent product = $1M+ ARR first year
- SOC 2 Type 1 certified → unlock enterprise deals $25K+ ACV
- 20%+ of new merchants come via marketplace SEO

## Success Metrics
- 50K+ buyer accounts in first 6 months
- 250+ "Trusted Reviewer" badge holders
- 5+ enterprise contracts $50K+ ACV signed via SOC 2 + DSA compliance positioning
- 250+ category pages indexed in Google with top-5 SERP positions for "best [category] verified reviews"

— Phase 5 doc · E1 · Jan 2026
