import { NextResponse, type NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { getSupabaseEnv } from '@/lib/supabase/env';

export async function middleware(request: NextRequest) {
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

  return response;
}

export const config = {
  matcher: ['/dashboard/:path*', '/login', '/signup', '/setup'],
};
