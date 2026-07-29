/**
 * Copyright (c) 2024-2026 Expedia Solutions, LLC. All Rights Reserved.
 * Proprietary and confidential. Unauthorized copying, distribution, or use
 * is strictly prohibited without express written permission.
 */
import { NextRequest, NextResponse } from "next/server";
import { getApiBase } from "@/lib/api";
import { authHeaders } from "@/lib/auth-server";

interface RouteProps {
  params: Promise<{ id: string }>;
}

/** Bible Phase 4i — AI-drafted review-reply suggestion (draft only, never posts). */
export async function POST(_req: NextRequest, { params }: RouteProps) {
  const { id } = await params;
  const res = await fetch(`${getApiBase()}/earnedstar/reviews/${id}/suggest-reply`, {
    method: "POST",
    headers: { ...(await authHeaders()) },
  });
  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}
