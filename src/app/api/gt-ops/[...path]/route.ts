/**
 * Copyright (c) 2024-2026 Expedia Solutions, LLC. All Rights Reserved.
 */
import { NextRequest, NextResponse } from 'next/server';
import { getApiBase } from '@/lib/api';
import { authHeaders } from '@/lib/auth-server';

async function proxy(req: NextRequest, path: string) {
  const url = `${getApiBase()}/gt-ops${path}${req.nextUrl.search}`;
  const headers: Record<string, string> = {
    ...((await authHeaders()) as Record<string, string>),
  };
  let body: string | undefined;
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    headers['Content-Type'] = 'application/json';
    body = await req.text();
  }
  const res = await fetch(url, { method: req.method, headers, body, cache: 'no-store' });
  const data = await res.json().catch(() => ({}));
  return NextResponse.json(data, { status: res.status });
}

export async function GET(req: NextRequest, ctx: { params: Promise<{ path: string[] }> }) {
  const { path } = await ctx.params;
  return proxy(req, `/${path.join('/')}`);
}

export async function POST(req: NextRequest, ctx: { params: Promise<{ path: string[] }> }) {
  const { path } = await ctx.params;
  return proxy(req, `/${path.join('/')}`);
}

export async function PATCH(req: NextRequest, ctx: { params: Promise<{ path: string[] }> }) {
  const { path } = await ctx.params;
  return proxy(req, `/${path.join('/')}`);
}
