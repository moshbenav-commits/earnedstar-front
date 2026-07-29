/**
 * Copyright (c) 2024-2026 Expedia Solutions, LLC. All Rights Reserved.
 * Proprietary and confidential. Unauthorized copying, distribution, or use
 * is strictly prohibited without express written permission.
 */
import { NextRequest, NextResponse } from "next/server";
import { getApiBase } from "@/lib/api";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const max = req.nextUrl.searchParams.get("max") ?? "12";
  // Bible Phase 4h — entry-tier auto-translation; e.g. ?lang=es. Not plan-gated.
  const lang = req.nextUrl.searchParams.get("lang");
  const query = new URLSearchParams({ max });
  if (lang) query.set("lang", lang);
  const res = await fetch(`${getApiBase()}/earnedstar/widget/${slug}?${query.toString()}`, {
    next: { revalidate: 120 },
  });
  const data = await res.json();
  return NextResponse.json(data, {
    status: res.status,
    headers: { "Cache-Control": "public, s-maxage=120, stale-while-revalidate=300" },
  });
}
