/**
 * Copyright (c) 2024-2026 Expedia Solutions, LLC. All Rights Reserved.
 */
import { getApiBase } from '@/lib/api';
import { authHeaders } from '@/lib/auth-server';

export async function gtOpsFetch(path: string, init?: RequestInit) {
  const res = await fetch(`${getApiBase()}/gt-ops${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(await authHeaders()),
      ...init?.headers,
    },
    cache: 'no-store',
  });
  const data = await res.json().catch(() => ({}));
  return { ok: res.ok, status: res.status, data };
}
