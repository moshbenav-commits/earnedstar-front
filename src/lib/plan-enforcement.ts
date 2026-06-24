/**
 * Copyright (c) 2024-2026 Expedia Solutions, LLC. All Rights Reserved.
 * Proprietary and confidential. Unauthorized copying, distribution, or use
 * is strictly prohibited without express written permission.
 */
import { PLAN_LIMITS, type PlanId } from "@/lib/plans";

export function normalizePlan(plan: string | undefined): PlanId {
  const id = (plan ?? "starter").toLowerCase() as PlanId;
  return id in PLAN_LIMITS ? id : "starter";
}

export function limitsFor(plan: string | undefined) {
  return PLAN_LIMITS[normalizePlan(plan)];
}

export function isUnlimited(limit: number) {
  return limit < 0;
}

export function isAtCap(used: number, limit: number) {
  return !isUnlimited(limit) && used >= limit;
}

export function canAccessAnalytics(plan: string | undefined) {
  return limitsFor(plan).analytics;
}

export function canAccessQa(plan: string | undefined) {
  return limitsFor(plan).qa_module;
}

export function canAccessSyndication(plan: string | undefined) {
  return limitsFor(plan).syndication;
}

export function canSendSmsInvitations(plan: string | undefined) {
  return limitsFor(plan).sms;
}

export function formatPlanLimit(limit: number) {
  return isUnlimited(limit) ? "Unlimited" : limit.toLocaleString();
}
