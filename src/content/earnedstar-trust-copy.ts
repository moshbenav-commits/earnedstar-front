/**
 * EarnedStar trust & verification messaging — single source for dashboard + marketing.
 * Spec: docs/prompts/AI_EARNEDSTAR_SPEC.md § Trust verification copy
 */

export const TRUST_EYEBROW = "Why it's called EarnedStar";

export const TRUST_HEADLINE = "Every star is earned — never manufactured.";

export const TRUST_SUBHEAD =
  "Random visitors can't leave reviews. Only customers tied to real orders get an invitation — and every submission passes multiple checks before it affects your rating.";

export const TRUST_RATING_RULE =
  "You don't get an EarnedStar score or badge from reviews we can't verify. Your public rating builds only from reviews that cleared every gate.";

export const TRUST_MIGRATION =
  "Bringing old reviews? We'll match your existing reviews to orders for a one-time import. After you're live, new reviews flow only through invitations — no manual add-ons, no extra stars outside the system.";

export const TRUST_STEPS = [
  {
    id: "order",
    title: "Order match",
    body: "Each invitation links to one order. No order on file — no way to submit.",
  },
  {
    id: "invite",
    title: "Customer submits",
    body: "After delivery, your buyer rates and writes from their personal link — one review per purchase.",
  },
  {
    id: "fraud",
    title: "AI fraud screen",
    body: "Behavioral signals and text analysis score every submission in seconds.",
  },
  {
    id: "moderate",
    title: "You approve",
    body: "Borderline or flagged reviews land in your queue before they go public.",
  },
  {
    id: "publish",
    title: "Star counts",
    body: "Only passed reviews publish to your profile and power your EarnedStar rating.",
  },
] as const;

export const TRUST_DASHBOARD_CTA = "Got it — show my dashboard";

export const TRUST_ONBOARDING_BLURB =
  "EarnedStar isn't a review box anyone can fill out. You'll invite real customers, verify every submission, and build a rating shoppers can trust.";

/** Marketing hero — aligned with trust story */
export const HERO_EYEBROW = "Verified by purchase · AI fraud-scored";

/** Line before gold italic emphasis in hero H1 */
export const HERO_HEADLINE_BEFORE = "Only buyers who ordered can review.";

/** Gold italic emphasis — payoff for the EarnedStar name */
export const HERO_HEADLINE_EMPHASIS = "Every star is earned.";

export const HERO_SUBCOPY =
  "No open review forms or random visitors. Buyers rate from a purchase invitation; each submission passes order verification, AI fraud screening, and your approval before it counts.";

/** Short tagline for metadata, OG, and auth sidebar */
export const HERO_TAGLINE = "Only verified buyers earn your stars.";

export const HERO_META_DESCRIPTION =
  "EarnedStar collects reviews only from customers who purchased. Every submission is order-verified, fraud-scored, and merchant-approved before it publishes.";

/** How it works — merchant journey */
export const HOW_IT_WORKS_STEPS = [
  {
    number: "01",
    title: "Connect orders",
    body: "Link your store or import past reviews matched to orders — one-time migration, then invitations only.",
  },
  {
    number: "02",
    title: "Invite real buyers",
    body: "Fulfilled orders trigger branded invitations. No open form, no guest reviews, no bought ratings.",
  },
  {
    number: "03",
    title: "Every review earns its star",
    body: "Purchase check → fraud score → your approval → publish. Only then does it count toward your badge.",
  },
] as const;

export const FAQ_TRUST_ENTRIES = [
  {
    q: "Can random people leave reviews on my store?",
    a: "No. Reviews require a purchase-matched invitation. Without a verified order, a submission never reaches your public profile — that's core to the EarnedStar name.",
  },
  {
    q: "Can I import reviews I already have?",
    a: "Yes — once. We match your existing reviews to orders for a one-time import. After go-live, every new review must come through the invitation flow so your rating stays trustworthy.",
  },
  {
    q: "Why can't I add extra reviews manually later?",
    a: "To protect your score. If merchants could add reviews outside the system, shoppers couldn't trust the badge. After migration, the only path in is: order → invitation → verification → publish.",
  },
] as const;
