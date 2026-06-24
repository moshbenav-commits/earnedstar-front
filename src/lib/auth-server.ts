/**
 * Copyright (c) 2024-2026 Expedia Solutions, LLC. All Rights Reserved.
 * Proprietary and confidential. Unauthorized copying, distribution, or use
 * is strictly prohibited without express written permission.
 */
import { cookies } from 'next/headers';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { getApiBase } from '@/lib/api';

export type AuthSession = {
  userId: string;
  email: string;
  accessToken: string;
  plan?: string;
};

export async function getAuthSession(): Promise<AuthSession | null> {
  if (process.env.EARNEDSTAR_AUTH_DEV_BYPASS === '1') {
    return {
      userId: 'dev-owner',
      email: 'dev@earnedstar.local',
      accessToken: 'dev-bypass',
      plan: 'growth',
    };
  }

  const supabase = await createSupabaseServerClient();
  if (!supabase) return null;

  const { data } = await supabase.auth.getSession();
  const session = data.session;
  if (!session?.user?.id || !session.access_token) return null;

  return {
    userId: session.user.id,
    email: session.user.email ?? '',
    accessToken: session.access_token,
  };
}

export async function authHeaders(): Promise<HeadersInit> {
  const session = await getAuthSession();
  if (!session) return {};

  const headers: Record<string, string> = {
    Authorization: `Bearer ${session.accessToken}`,
  };

  try {
    const res = await fetch(`${getApiBase()}/earnedstar/auth/me`, {
      headers: { Authorization: `Bearer ${session.accessToken}` },
      cache: 'no-store',
    });
    if (res.ok) {
      const me = (await res.json()) as { plan?: string };
      if (me.plan) headers['X-Business-Plan'] = me.plan;
    }
  } catch {
    // optional plan header
  }

  return headers;
}

export async function provisionMerchantAfterSignup(params: {
  ownerId: string;
  email: string;
  businessName: string;
  plan?: string;
}) {
  await fetch(`${getApiBase()}/earnedstar/auth/provision`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      owner_id: params.ownerId,
      email: params.email,
      business_name: params.businessName,
      plan: params.plan ?? 'starter',
    }),
  });
}

export async function clearLegacyAuthCookies() {
  const store = await cookies();
  store.delete('es-access-token');
  store.delete('es-refresh-token');
}
