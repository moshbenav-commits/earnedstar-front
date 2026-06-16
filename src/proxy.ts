import { NextResponse, type NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { getSupabaseEnv } from '@/lib/supabase/env';

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'https://earnedstar-back.vercel.app/api';

export async function proxy(request: NextRequest) {
  const { url, anonKey, configured } = getSupabaseEnv();
  const devBypass = process.env.EARNEDSTAR_AUTH_DEV_BYPASS === '1';
  let response = NextResponse.next({ request });

  if (!configured) {
    if (request.nextUrl.pathname.startsWith('/dashboard') && !devBypass) {
      const login = new URL('/login', request.url);
      login.searchParams.set('next', request.nextUrl.pathname);
      return NextResponse.redirect(login);
    }
    return response;
  }

  const supabase = createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) => {
          response.cookies.set(name, value, options);
        });
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (request.nextUrl.pathname.startsWith('/dashboard') && !user && !devBypass) {
    const login = new URL('/login', request.url);
    login.searchParams.set('next', request.nextUrl.pathname);
    return NextResponse.redirect(login);
  }

  if (request.nextUrl.pathname.startsWith('/setup') && !user && !devBypass) {
    const login = new URL('/login', request.url);
    login.searchParams.set('next', '/setup');
    return NextResponse.redirect(login);
  }

  if (user && request.nextUrl.pathname === '/signup') {
    return NextResponse.redirect(new URL('/setup', request.url));
  }

  if (user && session?.access_token && request.nextUrl.pathname.startsWith('/setup')) {
    try {
      const statusRes = await fetch(`${API_BASE}/earnedstar/onboarding/status`, {
        headers: { Authorization: `Bearer ${session.access_token}` },
        cache: 'no-store',
      });
      if (statusRes.ok) {
        const status = (await statusRes.json()) as { completed?: boolean };
        if (status.completed) {
          return NextResponse.redirect(new URL('/dashboard', request.url));
        }
      }
    } catch {
      // allow setup to load if status check fails
    }
  }

  if (user && session?.access_token && request.nextUrl.pathname.startsWith('/dashboard')) {
    try {
      const meRes = await fetch(`${API_BASE}/earnedstar/auth/me`, {
        headers: { Authorization: `Bearer ${session.access_token}` },
        cache: 'no-store',
      });
      if (meRes.ok) {
        const me = (await meRes.json()) as { plan?: string };
        if (me.plan) response.headers.set('X-Business-Plan', me.plan);
      }
    } catch {
      // non-blocking
    }
  }

  return response;
}

export const config = {
  matcher: ['/dashboard/:path*', '/login', '/signup', '/setup'],
};
