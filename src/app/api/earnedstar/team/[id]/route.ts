import { NextResponse } from "next/server";
import { getApiBase } from "@/lib/api";
import { authHeaders } from "@/lib/auth-server";

interface RouteProps {
  params: Promise<{ id: string }>;
}

export async function DELETE(_req: Request, { params }: RouteProps) {
  const { id } = await params;
  const res = await fetch(`${getApiBase()}/earnedstar/team/${id}`, {
    method: "DELETE",
    headers: { ...(await authHeaders()) },
  });
  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}
