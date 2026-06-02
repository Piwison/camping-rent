import { redirect } from "next/navigation";
import { createServerSupabase } from "./supabase-server";
import { parseVendorAllowlist, isVendorEmail } from "./auth-roles";

// The Customer session seam (ADR-0010). A Customer is any authenticated user who
// is not the Vendor — the account area (booking history) reads them through
// these two calls, mirroring vendor-session.

export interface Customer {
  id: string;
  email: string;
}

export async function getCustomer(): Promise<Customer | null> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return null;
  }
  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  // The Vendor manages gear in /admin, not a customer account.
  const allowlist = parseVendorAllowlist(process.env.VENDOR_EMAILS);
  if (allowlist.length > 0 && isVendorEmail(user.email ?? "", allowlist)) return null;

  return { id: user.id, email: user.email ?? "" };
}

export async function requireCustomer(): Promise<Customer> {
  const customer = await getCustomer();
  if (!customer) redirect("/account/login");
  return customer;
}
