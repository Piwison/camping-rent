import { redirect } from "next/navigation";
import { createServerSupabase } from "./supabase-server";

// The Vendor session seam (ADR-0006). Hides Supabase Auth behind two calls the
// admin routes use: read the current Vendor, or require one.

export interface Vendor {
  id: string;
  email: string;
}

export async function getVendor(): Promise<Vendor | null> {
  // No auth configured (e.g. local dev without Supabase) → no Vendor.
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return null;
  }
  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user ? { id: user.id, email: user.email ?? "" } : null;
}

// Use at the top of a protected admin Server Component / layout. Redirects to
// the login page when there is no Vendor session.
export async function requireVendor(): Promise<Vendor> {
  const vendor = await getVendor();
  if (!vendor) redirect("/admin/login");
  return vendor;
}
