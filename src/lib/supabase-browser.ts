import { createBrowserClient } from "@supabase/ssr";

// Browser-side Supabase client for Vendor auth (anon key). Used by the login
// page to sign in and by the topbar to sign out.
export function createBrowserSupabase() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
