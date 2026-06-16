import { NextRequest, NextResponse } from "next/server";
import { getApiBase } from "@/lib/api";
import { authHeaders } from "@/lib/auth-server";

export async function PATCH(req: NextRequest) {
  const body = await req.json();
  const res = await fetch(`${getApiBase()}/earnedstar/auth/profile`, {
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
