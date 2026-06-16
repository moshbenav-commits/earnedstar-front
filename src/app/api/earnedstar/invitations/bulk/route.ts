import { NextRequest, NextResponse } from 'next/server';
import { getApiBase } from '@/lib/api';
import { authHeaders } from '@/lib/auth-server';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const slug = req.nextUrl.searchParams.get('slug') ?? 'meridian-gear';
  const res = await fetch(`${getApiBase()}/earnedstar/invitations/bulk?slug=${slug}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(await authHeaders()),
    },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}
