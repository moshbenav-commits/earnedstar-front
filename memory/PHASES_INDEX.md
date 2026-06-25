# EarnedStar 2.0 — Phase Guides Master Index

> Comprehensive design + implementation plan covering Phase 0 → Phase 5.
> Each phase document contains: goal, design specs, implementation tasks, API endpoints, data models, dependencies, acceptance criteria, success metrics.

## The Six Phases

| # | Phase | Weeks | Goal | Status |
|---|---|---|---|---|
| 0 | **Position & Promise** | 0–1 | Rewrite the story before adding code | ✅ Prototyped |
| 1 | **Proven** | 2–5 | Make "verified" publicly undeniable | 🟡 Partial (Trust Receipt + Moderation Ledger shipped) |
| 2 | **Intelligence** | 6–9 | AI-native review platform | 🟡 Partial (AI Summary + Smart-Reply + Sentiment live) |
| 3 | **Integrated Stack** | 10–15 | Reviews + Email + SMS + Loyalty (Yotpo Exodus) | 🟡 Partial (UI shells live, real flows pending) |
| 4 | **Growth Engines** | 16–20 | New revenue lines + viral acquisition | ⏳ Planned (Review Audit shipped) |
| 5 | **Discovery Layer** | 21–32 | `earnedstar.com/shop` marketplace | ⏳ Future |

## Documents
- `PHASE_0_POSITION.md` — Manifesto, homepage, comparison table, "Yotpo Refugees" landing
- `PHASE_1_PROVEN.md` — Trust Receipts, Moderation Ledger, 24h SLA, Verified Human (Phase 1 — anti-AI)
- `PHASE_2_INTELLIGENCE.md` — AI Smart-Reply, Summary, Sentiment, Q&A auto-answer, fraud explainability
- `PHASE_3_INTEGRATED_STACK.md` — EarnedMail, EarnedSend, EarnedLoyalty (the Yotpo Exodus play)
- `PHASE_4_GROWTH.md` — Conversion attribution, Buyer Intent, Leaders Awards, Review Audit viral
- `PHASE_5_DISCOVERY.md` — `/shop` marketplace, buyer accounts, SOC 2, vertical schemas

## Cross-Phase Themes
- **Authentication** — Required by Phase 3 onwards. Recommend Emergent Google Auth + JWT email/password
- **Multi-tenant data model** — Foundation for Agency + Discovery (Phases 4 + 5)
- **EU DSA / AI Act compliance** — Begin documenting from Phase 1; required by Phase 5 enterprise sales
- **SOC 2** — Begin documentation Phase 3; certification target Phase 5

— Document index created by E1 · Jan 2026
