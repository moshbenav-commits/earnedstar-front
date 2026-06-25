# EarnedStar 2.0 — Concept Refinement & Phased Roadmap

> *From "another review app" → to "the trust infrastructure for e-commerce."*

---

## Part 1 — The Concept (Refined)

### 1.1 What category are we actually in?

Today EarnedStar reads as a **review collection tool** (same shelf as Trustpilot/Yotpo/Judge.me). That's a crowded, commoditized shelf.

**The reframe:** EarnedStar is **Trust Infrastructure** — not a review widget. A review is just one *receipt* of trust. We sell **provable, portable, auditable trust** to e-commerce.

> The shift: from "we collect reviews" → "we issue verifiable trust receipts that travel with the buyer."

This is the same move Stripe made (payments → financial infrastructure), Plaid (bank login → data infrastructure), Twilio (SMS → comms infrastructure). The category gets bigger and the moat gets deeper.

### 1.2 One-line concept

> **"The verifiable trust layer for e-commerce. Every review is order-locked, AI-audited, publicly provable, and yours forever."**

### 1.3 Three concept pillars

```
        ┌──────────────────────────────────────────────┐
        │              EARNED STAR 2.0                  │
        │                                               │
        │   ① PROVEN          ② PORTABLE       ③ POWERFUL  
        │   Every star tied   Reviews you      AI + intent
        │   to a real order   own forever      that prints $$$ 
        │   + public audit    no lock-in       for merchants
        └──────────────────────────────────────────────┘
```

**① PROVEN** — Order-verified, AI-fraud-scored, public Trust Receipt on every review. Anyone can audit the chain.
**② PORTABLE** — Reviews are *your data*. Export, embed, take them anywhere. No annual lock-ins. No held-hostage SEO.
**③ POWERFUL** — Built-in AI (summaries, smart replies, sentiment), Shopper Intent leads, Conversion Attribution, NPS, Loyalty — at flat prices that grow with you, not against you.

### 1.4 Who it's for (sharper ICP)

| Layer | Who | Pain we kill |
|---|---|---|
| **Hero ICP** | DTC + niche e-comm doing $200K–$10M/yr (Shopify/Woo/BigCommerce) sick of Trustpilot/Yotpo bills & fake-review damage | Annual contracts, per-domain pricing, fraud, vendor lock-in |
| **Growth ICP** | Agencies running reviews for 5–50 DTC clients | No white-label option at sane price |
| **Expansion ICP** | Multi-brand retailers, marketplaces, manufacturers | Multi-domain, intent data, syndication |
| **Land grab** | Auto-parts vertical (your YMM head start) → expand to home goods, apparel, beauty | Generic platforms ignore vertical-specific attributes |

### 1.5 The 4 promises that go on the homepage

1. **Verified.** Every review tied to a real order. Period.
2. **Auditable.** Every star ships with a public Trust Receipt — buyers can verify the verification.
3. **Portable.** Your reviews are yours forever. One-click export. No lock-in.
4. **Fair.** Flat pricing. Multi-domain included. No "pay to hide negative reviews" — ever.

Public counter on homepage:
> `2,847 verified · 318 fraud attempts blocked · 22h avg dispute SLA · 0 reviews ransomed`

### 1.6 The moats (why this wins long-term)

| Moat | Why it compounds |
|---|---|
| **Verification graph** (order ↔ review ↔ buyer identity hash) | Becomes the canonical "trust ledger" of e-commerce |
| **Portability promise** | Trust = retention paradox: removing lock-in *creates* loyalty |
| **Origami brand mark** | Visual recognition (like the Apple Pencil mark or the Plaid logo) |
| **Verticalized data** (YMM today, more verticals later) | Generic platforms can't catch up on schema |
| **Shopper Intent dataset** | Once you have it, it compounds — and it's sellable |
| **Public proof culture** | Live counters, public ledger = press magnet + SEO moat |

### 1.7 The big bet (long arc)

In 3 years, EarnedStar becomes **the discovery layer for verified-only commerce**: `earnedstar.com/shop` — a buyer-facing marketplace where every listed merchant has provable verification. Trustpilot's flywheel, but only honest. This is when the company stops selling SaaS and starts selling **attention to the merchants on the platform** (the Bazaarvoice/G2 endgame, but built on truthful foundations).

---

## Part 2 — The Phases (Roadmap)

Six phases. Each one ships something users notice. Each one widens the moat.

### 🚦 Phase 0 — Position & Promise *(Week 0–1)*
**Goal:** Rewrite the story before adding code.

- Lock new tagline + 4 promises
- Update homepage hero, add "Trust Receipts" live counter
- Add comparison table (vs Trustpilot, Yotpo, Judge.me, Loox)
- Publish positioning doc + brand voice guide
- Set up `/manifesto` page (the public commitment to the 4 promises)

**Output:** A site that *sounds* like a category leader before it acts like one.
**Success metric:** Hero CTA click-rate +25%; bounce rate −15%.

---

### 🛡 Phase 1 — Proven *(Weeks 2–5)*
**Goal:** Make "verified" visible, public, and undeniable.

| Ship | Detail |
|---|---|
| **Public Trust Receipt** | Every review card gets a `Verify ↗` link → modal showing order hash, verification timestamp, fraud score, AI checks passed |
| **Moderation Ledger** | `/store/[slug]/moderation` — public log: review ID, action (removed/restored), reason, who decided, appeal status |
| **24h Dispute SLA** | Dashboard tool for merchants to flag suspected fakes; public counter on homepage shows running avg SLA |
| **Trust Score Math page** | `/how-trust-works` — explains exactly how a review is scored (transparency = trust) |
| **Verified-buyer ID badge tiers** | Bronze (order hash) → Silver (+ email confirmed) → Gold (+ identity verified via LinkedIn or gov-ID for big-ticket goods) |

**Output:** Buyers and merchants both can say "I can prove this is real."
**Success metric:** "Verify" modal opens / 1000 review views; merchant NPS on trust ≥ 70.

---

### 🤖 Phase 2 — Intelligence *(Weeks 6–9)*
**Goal:** Become the AI-native review platform.

| Ship | Detail |
|---|---|
| **AI Review Summary** | Per product + per store: "Most buyers praise…", "Some mention…", multilingual, live-updating |
| **AI Smart-Reply** | Dashboard suggests a personalized reply for every review; merchant edits & sends in 1 click |
| **Sentiment Topic Clusters** | Auto-tags reviews into themes (shipping, quality, fit, support); dashboard shows trend lines + alerts on negative spike |
| **AI Q&A Auto-Answer** | When a buyer asks a question, system answers from past reviews + flags for merchant approval |
| **Fraud explainability** | Already have fraud_score (0–100); now show *which signals* fired (behavioral, NLP, device, timing) |

**Output:** Yotpo Premium features at every plan tier.
**Success metric:** % merchants using AI Smart-Reply weekly ≥ 60%; avg response time on reviews −70%.

---

### 🧰 Phase 3 — Marketing Stack Parity *(Weeks 10–13)*
**Goal:** Plug every reason a merchant says "but Yotpo has…".

| Ship | Detail |
|---|---|
| **NPS Surveys** | Campaign type alongside review invitations; reporting dashboard |
| **Shoppable UGC Galleries** | 7th widget type — photo/video carousel that links to products |
| **Loyalty Lite** | Discount-code rewards for verified reviewers and referrers |
| **Multi-domain on one plan** | Settings UI to add up to N domains per plan tier |
| **Structured Pros/Cons** | New review form fields, displayed on store profile |
| **Use-case filtering** | "Gifts under $50", "First-time buyer", "Daily driver" — buyer journey |
| **WhatsApp + Apple Business Messages** | New invitation channels |

**Output:** No competitive checkbox left empty.
**Success metric:** Win rate vs Yotpo in head-to-head sales calls ≥ 50%.

---

### 📈 Phase 4 — Growth Products *(Weeks 14–18)*
**Goal:** Monetize beyond reviews — create new revenue lines.

| Ship | Detail |
|---|---|
| **Shopper Intent Signals** | Track who views your store profile → sell leads to merchants (the G2 buyer-intent play for e-commerce) |
| **Conversion Attribution** | Pixel + dashboard: "$184K revenue attributed to review-views this quarter" |
| **Competitive Benchmarks** | Anonymized category data: "Your 4.6 vs auto-parts category avg 4.2" |
| **EarnedStar Leaders Awards** | Quarterly badges by category — press kit + embeddable badge + email blast to merchant's audience (flywheel: merchants share for free → SEO + signups) |
| **Free "Review Audit" tool** | Public scanner — paste any Trustpilot/Yotpo URL → AI estimates fake-review %, returns shareable report → lead magnet |
| **"#TrustpilotRefugees" migration** | One-click importer + 3 months free promo |

**Output:** Top-of-funnel acquisition + new revenue streams.
**Success metric:** 30% of new MRR from non-subscription products by end of phase.

---

### 🏛 Phase 5 — Discovery Layer *(Weeks 19–28)*
**Goal:** Become a destination, not just a widget.

| Ship | Detail |
|---|---|
| **earnedstar.com/shop** | Public marketplace of verified merchants by category, sortable by Trust Score, with Leaders awards surfaced |
| **Buyer accounts** | Shoppers can save merchants, follow categories, get alerts on new Leaders |
| **Category pages** | SEO-rich `/shop/auto-parts`, `/shop/beauty`, etc. — pull traffic from "best [category] stores" searches |
| **API marketplace** | Public API for plug-ins, agency tools, e-commerce platforms; revenue share for partners |
| **Vertical schemas** | YMM (you have), Beauty (shade/skin-type), Apparel (size/fit), Home goods (room/style) |
| **Enterprise + SOC 2** | Multi-tenant org structure, audit logs, SAML SSO; SOC 2 Type 1 certification |

**Output:** EarnedStar becomes the place buyers go *first* — not just a widget on someone else's site.
**Success metric:** 10% of merchant new-customer traffic originates from EarnedStar discovery.

---

## Part 3 — Phase Dependencies & Gantt

```
Week:         1   2   3   4   5   6   7   8   9   10  11  12  13  14 ... 28
Phase 0    ▓▓▓
Phase 1        ▓▓▓▓▓▓▓▓▓▓▓▓▓▓
Phase 2                    ▓▓▓▓▓▓▓▓▓▓▓▓▓▓
Phase 3                                ▓▓▓▓▓▓▓▓▓▓▓▓▓▓
Phase 4                                            ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓
Phase 5                                                        ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓
```

---

## Part 4 — What to decide now

Before we touch code, lock these:

1. **Concept buy-in.** Do the 3 pillars (Proven / Portable / Powerful) and "Trust Infrastructure" reframe resonate? Want to adjust any pillar?
2. **Tagline lock.** "Reviews that earned their place — and prove it." vs. alternatives below — pick one or propose your own.
3. **Phase 0 first?** Should we start with the positioning rewrite (homepage, manifesto, comparison table) before any feature build? My recommendation: **yes** — story before scaffolding.
4. **Vertical strategy.** Auto-parts head start → next vertical to expand? (Beauty / Apparel / Home / Health-supps?)
5. **Discovery layer ambition.** Is the `/shop` marketplace endgame (Phase 5) something you actually want? If yes, every earlier phase should be designed to feed it.

### Tagline alternatives to consider

- **"Reviews that earned their place — and prove it."** *(crisp, on-brand)*
- **"The verifiable trust layer for e-commerce."** *(category-creating)*
- **"Only buyers. Only proof. Only yours."** *(rhythmic, brand-led)*
- **"Stars, earned and audited."** *(short, memorable)*
- **"Every star, a receipt."** *(metaphor-led, ownable)*

---

*Document created by E1 · Jan 2026 · `/app/memory/EARNEDSTAR_CONCEPT_AND_PHASES.md`*
