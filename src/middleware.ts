import { type NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { isProtectedAdminPath } from "@/lib/admin-paths";
import { isProtectedAccountPath } from "@/lib/account-paths";

// Refreshes the Supabase session cookie on each /admin and /account request and
// redirects unauthenticated access to the matching login page. Role separation
// (is this user actually the Vendor?) happens in the server guards; the
// middleware only checks that *someone* is signed in.
export async function middleware(request: NextRequest) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  // Auth not configured — don't lock anyone out of a not-yet-wired dashboard.
  if (!url || !anon) return NextResponse.next();

  let response = NextResponse.next({ request });

  const supabase = createServerClient(url, anon, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options)
        );
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;
  if (!user && isProtectedAdminPath(pathname)) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/admin/login";
    return NextResponse.redirect(loginUrl);
  }
  if (!user && isProtectedAccountPath(pathname)) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/account/login";
    return NextResponse.redirect(loginUrl);
  }

  return response;
}

export const config = {
  matcher: ["/admin/:path*", "/account/:path*"],
};
