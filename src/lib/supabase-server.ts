import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

// Server-side Supabase auth client bound to the request cookies (anon key).
// Server-only — reads next/headers. Reads the Vendor session in Server
// Components and route handlers.
export async function createServerSupabase() {
  const cookieStore = await cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          // In a Server Component cookies are read-only; the middleware is what
          // refreshes the session, so swallow the write here.
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            /* read-only context */
          }
        },
      },
    }
  );
}
