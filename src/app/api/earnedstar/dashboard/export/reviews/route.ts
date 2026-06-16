import { NextRequest, NextResponse } from "next/server";
import { getApiBase } from "@/lib/api";
import { authHeaders } from "@/lib/auth-server";

export async function GET(req: NextRequest) {
  const slug = req.nextUrl.searchParams.get("slug") ?? undefined;
  const qs = slug ? `?slug=${encodeURIComponent(slug)}` : "";
  const res = await fetch(`${getApiBase()}/earnedstar/dashboard/export/reviews.csv${qs}`, {
    headers: { ...(await authHeaders()) },
    cache: "no-store",
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({ message: "Export failed" }));
    return NextResponse.json(data, { status: res.status });
  }
  const csv = await res.text();
  const disposition = res.headers.get("content-disposition") ?? 'attachment; filename="reviews.csv"';
  return new NextResponse(csv, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": disposition,
    },
  });
}
