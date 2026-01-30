import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { SECURITY_HEADERS } from "./lib/security-headers";

/**
 * Production-grade middleware (named 'proxy' in this environment) for:
 * - Supabase session refresh (automatic token refresh)
 * - Protected route authentication
 * - Secure cookie handling
 * - Security headers enforcement
 */
export async function proxy(request: NextRequest) {
  // Use both standard and PWA4 environment variables
  const supabaseUrl =
    process.env.NEXT_PUBLIC_SUPABASE_URL ||
    process.env.NEXT_PUBLIC_SUPABASE_PWA4_URL;
  const supabaseAnonKey =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_PWA4_ANON_KEY;

  let response = NextResponse.next({
    request,
  });

  /**
   * Helper to apply security headers to any response
   */
  const applySecurityHeaders = (res: NextResponse) => {
    for (const [key, value] of Object.entries(SECURITY_HEADERS)) {
      res.headers.set(key, value);
    }
    return res;
  };

  // Ensure security headers are applied even if Supabase is not configured
  if (!supabaseUrl || !supabaseAnonKey) {
    return applySecurityHeaders(response);
  }

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(
        cookiesToSet: Array<{
          name: string;
          value: string;
          options?: Record<string, unknown>;
        }>,
      ) {
        cookiesToSet.forEach(({ name, value }) => {
          request.cookies.set(name, value);
        });
        response = NextResponse.next({
          request,
        });
        cookiesToSet.forEach(({ name, value, options }) => {
          if (options) {
            response.cookies.set(
              name,
              value,
              options as Parameters<typeof response.cookies.set>[2],
            );
          } else {
            response.cookies.set(name, value);
          }
        });
      },
    },
  });

  // Refresh session if needed (automatic token refresh)
  await supabase.auth.getUser();

  // Protect authenticated routes
  const isProtectedRoute =
    request.nextUrl.pathname.startsWith("/dashboard") ||
    request.nextUrl.pathname.startsWith("/driver") ||
    (request.nextUrl.pathname.startsWith("/map") &&
      request.nextUrl.searchParams.has("auth"));

  if (isProtectedRoute) {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      const url = request.nextUrl.clone();
      url.pathname = "/auth/login";
      url.searchParams.set("redirect", request.nextUrl.pathname);
      return applySecurityHeaders(NextResponse.redirect(url));
    }
  }

  // Add security headers to the final response
  return applySecurityHeaders(response);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
