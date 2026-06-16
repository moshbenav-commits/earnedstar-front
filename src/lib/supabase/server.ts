import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { ACCESS_TOKEN_COOKIE, getSupabaseEnv, REFRESH_TOKEN_COOKIE } from './env';

export async function createSupabaseServerClient() {
  const { url, anonKey, configured } = getSupabaseEnv();
  if (!configured) return null;

  const cookieStore = await cookies();

  return createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        } catch {
          // Called from Server Component — middleware handles refresh.
        }
      },
    },
  });
}

export async function getServerAccessToken(): Promise<string | null> {
  const supabase = await createSupabaseServerClient();
  if (supabase) {
    const { data } = await supabase.auth.getSession();
    return data.session?.access_token ?? null;
  }

  const cookieStore = await cookies();
  return cookieStore.get(ACCESS_TOKEN_COOKIE)?.value ?? null;
}
