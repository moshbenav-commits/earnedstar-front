import { NextResponse } from "next/server";
import { getApiBase } from "@/lib/api";
import { authHeaders } from "@/lib/auth-server";

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const res = await fetch(`${getApiBase()}/earnedstar/widgets/${id}`, {
    method: "DELETE",
    headers: { ...(await authHeaders()) },
  });
  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}
