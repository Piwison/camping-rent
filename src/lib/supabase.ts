import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// Server-side Supabase client (ADR-0006). Uses the service-role key, so this
// module must only ever be imported from server code — never a Client
// Component. Reads connection details from env and fails loudly if they're
// missing, so a misconfigured deploy surfaces immediately rather than silently
// returning no data.
export function getSupabase(): SupabaseClient {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error(
      "Supabase is not configured — set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY."
    );
  }
  return createClient(url, key, { auth: { persistSession: false } });
}

// True when the Supabase connection is configured. Lets callers degrade
// gracefully (e.g. fall back to the seed Catalog) instead of throwing.
export function isSupabaseConfigured(): boolean {
  return Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);
}
