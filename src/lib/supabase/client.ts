import { createBrowserClient } from '@supabase/ssr';
import { getSupabaseEnv } from './env';

let client: ReturnType<typeof createBrowserClient> | null = null;

export function createSupabaseBrowserClient() {
  const { url, anonKey, configured } = getSupabaseEnv();
  if (!configured) return null;
  if (!client) {
    client = createBrowserClient(url, anonKey);
  }
  return client;
}
