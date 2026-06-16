import { NextRequest, NextResponse } from 'next/server';
import { getApiBase } from '@/lib/api';
import { authHeaders } from '@/lib/auth-server';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const slug = req.nextUrl.searchParams.get('slug') ?? 'meridian-gear';
  const res = await fetch(`${getApiBase()}/earnedstar/invitations/${id}/resend?slug=${slug}`, {
    method: 'POST',
    headers: await authHeaders(),
  });
  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}
