// Pure path policy for the Customer account area (ADR-0010), shared by the
// middleware (edge) and the server guard. Everything under /account needs a
// Customer session except the login page. No runtime deps so it's edge-safe.
export function isProtectedAccountPath(pathname: string): boolean {
  return pathname.startsWith("/account") && pathname !== "/account/login";
}
