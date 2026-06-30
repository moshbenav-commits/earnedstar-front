/**
 * Copyright (c) 2024-2026 Expedia Solutions, LLC. All Rights Reserved.
 */
import { NextResponse } from "next/server";
import { getApiBase } from "@/lib/api";
import { authHeaders } from "@/lib/auth-server";

type RouteContext = { params: Promise<{ id: string }> };

export async function DELETE(_req: Request, context: RouteContext) {
  const { id } = await context.params;
  const res = await fetch(`${getApiBase()}/earnedstar/integrations/api-keys/${id}`, {
    method: "DELETE",
    headers: { ...(await authHeaders()) },
  });
  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}
