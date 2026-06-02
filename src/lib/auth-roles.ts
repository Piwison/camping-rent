// Pure role logic, shared by the Vendor and Customer session helpers. The
// Vendor is whoever's email is on the VENDOR_EMAILS allowlist; every other
// authenticated user is a Customer. Kept free of Supabase/next so it's
// unit-testable and edge-safe.

export function parseVendorAllowlist(csv: string | undefined): string[] {
  return (csv ?? "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
}

// Is this email a Vendor? When the allowlist is empty we fall back to "any
// authenticated user" for back-compat with the pre-accounts setup — callers
// should warn in that case (see getVendor).
export function isVendorEmail(email: string, allowlist: string[]): boolean {
  if (allowlist.length === 0) return true;
  return allowlist.includes(email.trim().toLowerCase());
}
