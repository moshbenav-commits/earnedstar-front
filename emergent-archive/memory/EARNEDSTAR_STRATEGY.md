# EarnedStar — Strategic Research & Roadmap to Category Leader

> **Mission:** Become the #1 e-commerce review platform by closing every pain point that has accumulated across Trustpilot, Yotpo, Stamped, Judge.me, Reviews.io, Loox, Bazaarvoice & PowerReviews.

---

## 1. What EarnedStar Already Has (Audit of `earnedstar-front`)

**Stack:** Next.js 16 · React 19 · TypeScript · Tailwind 4 · Supabase Postgres · Nest API backend · Authorize.net ARB billing · Vercel deploy.

### ✅ Shipped (working)
| Area | Built |
|---|---|
| Marketing | Landing, hero, features, how-it-works, pricing, FAQ, social proof, announcement strip |
| Auth | Supabase auth (login, signup, dev bypass) |
| Onboarding | Multi-step wizard |
| Dashboard | Overview, Reviews, Invitations, Widgets, Q&A, Analytics, Syndication, Integrations, Team, Settings, Agency |
| Reviews | Submit flow (5-step), moderation, business response, photos/video, fraud score (0–100 w/ reasons), 6 attribute ratings (overall, fitment, quality, shipping, description, install), YMM (auto-parts vertical) |
| Invitations | Email, SMS, bulk import, lookup, resend, scheduled, reminders, token-based |
| Widgets | 6 types (badge, carousel, list, testimonial, grid, floating) + builder, embeddable JS |
| Q&A | Public Q&A per merchant + AI answer suggestion endpoint |
| SEO | JSON-LD, sitemap-merchants, meta suggestions, AI summary regen, SEO health |
| Public profile | `/store/[slug]` with filters & sidebar |
| Agency | White-label, 25 sub-accounts, agency clients API |
| Integrations | Shopify connect + webhook (order-fulfilled), API key, team RBAC |
| Billing | Authorize.net ARB, public-config endpoint, subscribe form, plan-usage banner |
| Analytics | KPI row, rating distribution, charts, exports |
| Branding | Origami EarnedStar mark/badge, progressive 1★ red → 5★ gold rating |

### ⚠️ Partially built / shallow
- Fraud scoring (score exists but no public audit trail)
- AI features (only "suggest meta" / "suggest QA answer" — no review summarization at scale, no smart-reply)
- Syndication (panel exists, real distribution unclear)
- Email status (panel exists)
- Sentiment (not surfaced)

### ❌ Not built (the gap)
*(see Section 4 for full list)*

---

## 2. Competitive Landscape — 2026 Snapshot

| Platform | Entry | Top Strength | Killer Weakness |
|---|---|---|---|
| **Trustpilot** | $300/yr+ | Brand trust, syndication network | Fake reviews, annual-only contracts, per-domain pricing, slow dispute SLA, arbitrary moderation, ~3.4/5 G2 score |
| **Yotpo** | $79–$1,198+ | All-in-one (Reviews+SMS+Loyalty+Email) | Volume-based pricing surprises, locked widgets, complex setup |
| **Stamped.io** | $29–$399 | Balanced features, NPS, sentiment | No native SMS, narrower marketing stack |
| **Judge.me** | Free/$15 | Free unlimited, fast, Google rich snippets | No SMS/loyalty, shallow analytics, dropped WooCommerce |
| **Loox** | $9.99–$299 | Beautiful photo/video UGC galleries | Shopify-only, weak Q&A & moderation |
| **Reviews.io** | $45+ | Multi-platform, 3rd-party verified | Less polished UGC, no native SMS/loyalty |
| **Bazaarvoice** | Enterprise | Retail syndication network | Enterprise-only price, slow, dated UX |
| **PowerReviews** | Enterprise | Syndication, sampling programs | Same as Bazaarvoice |
| **Okendo** | $19–$499 | Shopify-native, attribute ratings | Shopify-only |

---

## 3. The Top Pain Points Buyers & Merchants Hate Today

### 🔴 Tier-1 (Trust killers)
1. **Fake/incentivized reviews** — every platform has them; few solve it at the root
2. **"Pay to protect" perception** — paid merchants feel insulated from negative reviews
3. **Arbitrary moderation** — legitimate negative reviews vanish with no explanation
4. **Slow fake-review dispute SLA** — days/weeks while damage spreads
5. **Reviews die when you cancel** — vendor lock-in via non-portable data

### 🟠 Tier-2 (Pricing pain)
6. **Annual-only contracts** (Trustpilot) with auto-renewal traps
7. **Per-domain pricing** that explodes for multi-brand/multi-region merchants
8. **Volume-based pricing** (Yotpo) — costs jump as you grow
9. **Gated essential features** (free plan can't even send invitations)

### 🟡 Tier-3 (Capability gaps)
10. **No native SMS** on most platforms
11. **Weak Q&A** — almost universally
12. **Short, low-depth reviews** (Capterra/Judge.me)
13. **No NPS surveys** (Yotpo, Reviews.io, Loox)
14. **No shopper intent data** for e-commerce (only G2 does it for B2B)
15. **No conversion attribution** at lower tiers
16. **No public Trust Score breakdown** — buyers can't verify the verification
17. **Outdated pricing/spec data** on product profiles
18. **No AI smart reply** for merchants to respond at scale
19. **No structured pros/cons** like B2B sites have
20. **No use-case filtering** ("best for gifts under $50", etc.)

---

## 4. Gap-Closing Feature Roadmap — How EarnedStar Wins

### 🎯 Your existing moat (keep amplifying)
- **Verified-by-Purchase-only** ✓ (kills #1, #2 pain in one shot)
- **AI fraud scoring with reasons** ✓ (needs to be made public-facing)
- **Flat transparent pricing** ✓
- **White-label agency tier at $499** ✓ (Trustpilot doesn't have anything like it)
- **Origami badge design** ✓ (visual moat — nobody else has a unique mark)

### 🚀 NEW features to add (prioritized)

#### Phase 1 — Trust & Differentiation (weeks 1–4) **[BIGGEST IMPACT]**
| # | Feature | Why it wins | Effort |
|---|---|---|---|
| 1 | **Public Trust Score Breakdown** — every review shows order-hash, verification path, fraud score | Buyers can verify the verification (nobody else does this) | M |
| 2 | **Transparent Moderation Ledger** — public audit log: "review removed, reason: …, by: merchant/AI/EarnedStar, appealable" | Kills the "arbitrary moderation" complaint dead | M |
| 3 | **Portable Reviews Promise** — 1-click export (JSON-LD + CSV + public URL that survives cancellation) | Removes vendor lock-in fear (huge sales objection killer) | S |
| 4 | **24-hour Fake-Review Dispute SLA** with public counter on homepage | Trustpilot takes weeks; you take 24h | S |
| 5 | **AI Review Summary** ("Customers love…", "Some say…") per product/store, multilingual | Yotpo charges for this; you give it free | M |
| 6 | **AI Smart-Reply Suggestions** for merchants in dashboard | Saves hours; matches Yotpo Premium | S |
| 7 | **Sentiment Dashboard** — topic clusters, trend lines, alerts on negative spike | Stamped charges for this; you match it | M |

#### Phase 2 — Marketing Stack (weeks 5–8)
| # | Feature | Why it wins | Effort |
|---|---|---|---|
| 8 | **NPS Surveys** built-in | Yotpo & Reviews.io lack it; Stamped charges | S |
| 9 | **Shoppable UGC Galleries** (photo/video carousels) | Match Loox visual polish on every plan | M |
| 10 | **Referral / Loyalty Lite** (gift discount for referrers) | Match Yotpo's bundled play | M |
| 11 | **Multi-domain on one plan** (vs Trustpilot per-domain) | Direct PR/marketing wedge | S |
| 12 | **AI Q&A auto-answer** from past reviews ("19 reviews mention…") | Nobody does this well | M |
| 13 | **Structured Pros/Cons** capture (G2-style) on review form | Deeper, more useful reviews | S |
| 14 | **Use-case filtering** on public profile ("gifts", "daily driver", "first-time buyer") | Buyer journey win | M |

#### Phase 3 — Data Products (weeks 9–14)
| # | Feature | Why it wins | Effort |
|---|---|---|---|
| 15 | **Shopper Intent Signals** — track which products buyers research on your store profile, sell leads to merchants | G2's $$$ buyer-intent for e-commerce — nobody does this | L |
| 16 | **Conversion Attribution** (review-view → purchase) free on Growth+ | Yotpo "Reviews Atlas" but free | M |
| 17 | **Competitive Benchmarks** — anonymized category averages (your 4.6 vs category 4.2) | TrustRadius-style insight | M |
| 18 | **EarnedStar Leaders Awards** — quarterly badges (Spring '26 Leader in Auto Parts) | G2's killer flywheel; works for e-comm too | M |

#### Phase 4 — Channels & Reach (weeks 15–20)
| # | Feature | Why it wins | Effort |
|---|---|---|---|
| 19 | **Native syndication** to Google Shopping, Bing Merchant, Meta, TikTok Shop | Bazaarvoice/Trustpilot-class distribution | L |
| 20 | **WhatsApp + Apple Business Messages** invitations | Modern channels nobody has | M |
| 21 | **In-store QR review kits** (printable, branded) for omnichannel retailers | Untapped offline channel | S |
| 22 | **Email reputation analytics** (deliverability dashboard, DKIM check) | Replaces SendGrid for invitations | M |
| 23 | **Buy-side discovery: earnedstar.com/shop** — a public marketplace of top-rated verified merchants by category (drives reverse traffic to your merchants — Trustpilot's main flywheel) | Long-term moat — own the buyer's discovery layer | XL |

### 🛡️ Defensive features
- **Open API + Webhooks** (everything programmable)
- **GDPR/CCPA data portability dashboard** (one-click export & deletion)
- **SOC 2 path** for enterprise sales
- **Public uptime status page**

---

## 5. Positioning & Messaging Upgrade

### Current tagline
> "Only verified buyers earn your stars."

### Recommended evolution
> **"Reviews that earned their place — and prove it."**
> *The only e-commerce review platform where every star is order-verified, AI-fraud-scored, and publicly auditable. Forever portable. Flat-priced. Multi-domain. No annual lock-ins.*

### Three new homepage proof bars to add
1. **"Trust Receipts"** — show a live counter: `2,847 reviews verified · 318 fraud attempts blocked this month · 24h average dispute resolution`
2. **"Compare us"** table — EarnedStar vs Trustpilot vs Yotpo vs Judge.me (price, verification, portability, AI, SMS, multi-domain)
3. **"The Promise"** — 4 commitments: Verified · Auditable · Portable · Flat-priced

### Wedge marketing campaigns
- **"#TrustpilotRefugees"** — free migration tool + 3 months free for switchers
- **"The Review Audit"** — free tool that scans any Trustpilot/Yotpo profile and shows estimated % fake reviews
- **"Reviews you own"** — animated explainer on portability vs lock-in

---

## 6. Recommended Build Order (next 90 days)

### Sprint 1 (week 1–2) — Trust Differentiation
- Public Trust Score breakdown UI on every review card
- Moderation Ledger page (`/store/[slug]/moderation`)
- Portable Reviews export endpoint + dashboard button
- Homepage updates (3 new proof bars + comparison table)

### Sprint 2 (week 3–4) — AI Layer
- AI Review Summary endpoint + display on store profile
- AI Smart-Reply in dashboard `Reviews` table
- Sentiment topic clustering + dashboard charts

### Sprint 3 (week 5–6) — Marketing Stack
- NPS survey module (campaign type + reporting)
- Shoppable UGC Gallery widget (7th widget type)
- Multi-domain settings UI

### Sprint 4 (week 7–8) — Conversion & Growth
- Conversion attribution tracker (pixel + dashboard)
- "#TrustpilotRefugees" migration importer
- Compare tool (`/compare/trustpilot-alternative`, `/compare/yotpo-alternative` SEO pages)

### Sprint 5 (week 9–12) — Data Products
- Shopper Intent signals beta
- Competitive Benchmarks
- EarnedStar Leaders Awards Q2 program

### Sprint 6 (week 13–20) — Discovery Layer
- Public marketplace at `/shop` with category grid + Leaders
- WhatsApp / Apple Business Messages channels
- SOC 2 prep

---

## 7. Pricing Strategy Tweaks

Current pricing is already great. Small tweaks to reinforce positioning:

| Tier | Today | Recommended addition |
|---|---|---|
| Starter $29 | 200 invites | + "AI summary on public profile" — unique vs Trustpilot Free |
| Growth $99 | 2,000 + SMS | + "Multi-domain (up to 3)" — direct Trustpilot wedge |
| Pro $249 | 15,000 | + "Shopper Intent leads (50/mo)" — exclusive data product |
| Agency $499 | Unlimited | + "Quarterly Leaders Awards co-marketing" |

Add to ALL tiers: **"Portable Reviews — yours forever"** badge.

---

## 8. Metrics to Beat

| KPI | Trustpilot | Yotpo | EarnedStar target |
|---|---|---|---|
| Avg dispute SLA | 7–14 days | n/a | **<24h published** |
| G2 satisfaction | 3.4/5 | 4.4/5 | **4.7/5** |
| Setup time | 2–3 hrs | 4+ hrs | **<22 min** (your current claim) |
| % fake reviews in published set | ~5–10% (Grizzly est.) | unknown | **<0.5%** with public dashboard |
| Time to Google stars | 7–14 days | 7 days | **72 hours** (current claim) |

---

## 9. Killer Differentiators in One Sentence Each

1. **Only buyers who ordered can review.** (you have this)
2. **Every star ships with a trust receipt.** (new — public audit)
3. **Your reviews — portable forever.** (new — kills lock-in)
4. **24-hour dispute SLA. Public counter.** (new — Trustpilot wedge)
5. **AI summary on every plan, no upsell.** (new — Yotpo wedge)
6. **Multi-domain on one flat plan.** (new — Trustpilot wedge)
7. **Real shopper intent. Real leads.** (new — exclusive data product)

---

## 10. Recommended Next Step

**Pick the path:**

- **A.** Build Sprint 1 (Trust Differentiation) directly in your existing repo — biggest immediate moat
- **B.** Build a "EarnedStar 2.0" preview demo here showing Sprints 1–3 in a clickable prototype for fundraising/sales
- **C.** Start with the homepage upgrade only (compare table, 3 proof bars, new tagline) — fastest visible win
- **D.** Build the **"Review Audit"** free marketing tool — strongest viral acquisition wedge

— Document created by E1 · Jan 2026
