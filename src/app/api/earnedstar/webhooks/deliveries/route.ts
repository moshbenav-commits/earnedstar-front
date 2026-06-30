/**
 * Copyright (c) 2024-2026 Expedia Solutions, LLC. All Rights Reserved.
 */
import { NextRequest, NextResponse } from "next/server";
import { getApiBase } from "@/lib/api";
import { authHeaders } from "@/lib/auth-server";

export async function GET(req: NextRequest) {
  const limit = req.nextUrl.searchParams.get("limit") ?? "50";
  const res = await fetch(`${getApiBase()}/earnedstar/webhooks/deliveries?limit=${limit}`, {
    headers: { ...(await authHeaders()) },
    cache: "no-store",
  });
  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}
