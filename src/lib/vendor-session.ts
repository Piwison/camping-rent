import { redirect } from "next/navigation";
import { createServerSupabase } from "./supabase-server";
import { parseVendorAllowlist, isVendorEmail } from "./auth-roles";

// The Vendor session seam (ADR-0006). Hides Supabase Auth behind two calls the
// admin routes use: read the current Vendor, or require one. Since Phase 3.2
// added Customer accounts, the Vendor is no longer "any authenticated user" —
// it's whoever's email is on the VENDOR_EMAILS allowlist (ADR-0010).

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
  if (!user) return null;

  const allowlist = parseVendorAllowlist(process.env.VENDOR_EMAILS);
  if (allowlist.length === 0) {
    console.warn(
      "[auth] VENDOR_EMAILS is unset — every signed-in user is treated as the Vendor. Set it before opening Customer sign-ups."
    );
  }
  if (!isVendorEmail(user.email ?? "", allowlist)) return null;

  return { id: user.id, email: user.email ?? "" };
}

// Use at the top of a protected admin Server Component / layout. Redirects to
// the login page when there is no Vendor session.
export async function requireVendor(): Promise<Vendor> {
  const vendor = await getVendor();
  if (!vendor) redirect("/admin/login");
  return vendor;
}
