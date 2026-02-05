import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"
import { SECURITY_HEADERS } from "./lib/security-headers"

/**
 * Helper to apply security headers to a response.
 * Follows defense-in-depth by ensuring headers are present even on redirects.
 */
function applySecurityHeaders(response: NextResponse, request: NextRequest) {
  for (const [key, value] of Object.entries(SECURITY_HEADERS)) {
    // To prevent local development issues, Strict-Transport-Security (HSTS)
    // is only applied if the request is over HTTPS.
    if (key === "Strict-Transport-Security" && request.nextUrl.protocol !== "https:") {
      continue;
    }
    response.headers.set(key, value)
  }
  return response
}

/**
 * Production-grade proxy (middleware) for:
 * - Supabase session refresh (automatic token refresh)
 * - Protected route authentication
 * - Secure cookie handling
 * - Security header enforcement (CSP, HSTS, etc.)
 *
 * Note: In Next.js 16+, 'proxy.ts' is the standard convention over 'middleware.ts'.
 */
export async function proxy(request: NextRequest) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error("Missing Supabase environment variables in proxy")
    return applySecurityHeaders(NextResponse.next(), request)
  }

  let response = NextResponse.next({
    request,
  })

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll()
      },
      setAll(cookiesToSet: Array<{ name: string; value: string; options?: any }>) {
        cookiesToSet.forEach(({ name, value }) => {
          request.cookies.set(name, value)
        })
        // When setting cookies, we must create a new response to ensure they are sent
        response = NextResponse.next({
          request,
        })
        cookiesToSet.forEach(({ name, value, options }) => {
          response.cookies.set(name, value, options)
        })
      },
    },
  })

  // Refresh session if needed and get user in a single call for efficiency.
  // This satisfies both session maintenance and route protection needs.
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Protect authenticated routes
  const isProtectedRoute =
    request.nextUrl.pathname.startsWith("/dashboard") ||
    request.nextUrl.pathname.startsWith("/driver") ||
    (request.nextUrl.pathname.startsWith("/map") && request.nextUrl.searchParams.has("auth"))

  if (isProtectedRoute && !user) {
    const url = request.nextUrl.clone()
    url.pathname = "/auth/login"
    url.searchParams.set("redirect", request.nextUrl.pathname)
    const redirectResponse = NextResponse.redirect(url)
    return applySecurityHeaders(redirectResponse, request)
  }

  return applySecurityHeaders(response, request)
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
}
