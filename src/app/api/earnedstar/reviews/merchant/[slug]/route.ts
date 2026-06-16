import { NextResponse } from 'next/server';
import { getApiBase } from '@/lib/api';

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const res = await fetch(`${getApiBase()}/earnedstar/reviews/${slug}`, { cache: 'no-store' });
  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}
