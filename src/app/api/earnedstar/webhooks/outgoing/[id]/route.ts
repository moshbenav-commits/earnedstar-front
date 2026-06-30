/**
 * Copyright (c) 2024-2026 Expedia Solutions, LLC. All Rights Reserved.
 */
import { NextRequest, NextResponse } from "next/server";
import { getApiBase } from "@/lib/api";
import { authHeaders } from "@/lib/auth-server";

type RouteContext = { params: Promise<{ id: string }> };

export async function PATCH(req: NextRequest, context: RouteContext) {
  const { id } = await context.params;
  const body = await req.json();
  const res = await fetch(`${getApiBase()}/earnedstar/webhooks/outgoing/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      ...(await authHeaders()),
    },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}

export async function DELETE(_req: NextRequest, context: RouteContext) {
  const { id } = await context.params;
  const res = await fetch(`${getApiBase()}/earnedstar/webhooks/outgoing/${id}`, {
    method: "DELETE",
    headers: { ...(await authHeaders()) },
  });
  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}
