// Pure path policy for the Vendor dashboard, shared by the middleware (edge)
// and the server session guard. Everything under /admin needs a Vendor session
// except the login page itself. No runtime deps so it's edge-safe and testable.
export function isProtectedAdminPath(pathname: string): boolean {
  return pathname.startsWith("/admin") && pathname !== "/admin/login";
}
