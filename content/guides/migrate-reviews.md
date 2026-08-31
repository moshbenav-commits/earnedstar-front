---
need_id: migrate-reviews
brand: earnedstar
title: Migrate your reviews to EarnedStar
description: Bring your existing reviews over from Google, Trustpilot, Yotpo, Loox, Judge.me, Stamped.io, or a plain CSV — free on every plan, and always moderated by you before they go live.
route: /dashboard/integrations
kind: guide
status: approved
review_required: false
steps:
  - instruction: Open the Integrations page in your dashboard and find "Migrate reviews from another platform."
    detail: Free on every plan — imports aren't gated by your subscription tier.
  - instruction: "For Google: connect your Business Profile and pull your own verified listing's reviews directly."
    detail: This uses Google's own Business Profile API on your own account — EarnedStar never scrapes Google, and only ever pulls reviews for a listing you've verified as yours.
  - instruction: "For everything else: export a CSV from that platform (Trustpilot, Yotpo, Loox, Judge.me, Stamped.io) — or a Google Takeout Reviews.json export — pick the matching source, and upload it."
    detail: No matching source? Choose the generic CSV option — it reads common column names like name, rating, and review text.
  - instruction: Review the import summary — imported, already-imported (skipped), and any rows that failed to map, with a reason for each.
    detail: Up to 1,000 rows per upload.
  - instruction: Moderate and publish the imported reviews from your Reviews dashboard, same as any other review.
    detail: Imported reviews always land as pending, never published automatically — you decide what goes live, and every one clearly shows where it came from (for example "via Google") once it's live. They can never carry EarnedStar's own "Verified Purchase" badge, since EarnedStar didn't observe that purchase itself.
video_slug: null
---

# Migrate your reviews to EarnedStar

Moving from another review platform? You can bring your existing reviews into
EarnedStar for free, on every plan.

1. Open the **Integrations** page in your dashboard and find **"Migrate
   reviews from another platform."**
2. **For Google:** connect your Business Profile and pull your own verified
   listing's reviews directly. This uses Google's own Business Profile API
   on your own account — EarnedStar never scrapes Google, and only ever
   pulls reviews for a listing you've verified as yours.
3. **For everything else:** export a CSV from that platform (Trustpilot,
   Yotpo, Loox, Judge.me, Stamped.io) — or a Google Takeout `Reviews.json`
   export — pick the matching source, and upload it. No matching source?
   Choose the generic CSV option, which reads common column names like
   name, rating, and review text.
4. Review the **import summary** — imported, already-imported (skipped), and
   any rows that failed to map, with a reason for each. Up to 1,000 rows per
   upload.
5. **Moderate and publish** the imported reviews from your Reviews
   dashboard, same as any other review.

## What stays true about an imported review

- **It always lands pending, never published automatically.** You decide
  what goes live.
- **Its origin is always visible** — once published, it shows where it came
  from (for example "via Google") right on the review.
- **It can never carry EarnedStar's own "Verified Purchase" badge.**
  EarnedStar didn't observe that purchase itself, so that badge is reserved
  for reviews collected through EarnedStar's own invitation flow.

We don't build a Yelp import — Yelp's terms of service prohibit exporting
reviews off their platform, so there's no lane for it here.
