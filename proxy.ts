import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"
import { SECURITY_HEADERS } from "./lib/security-headers"

/**
 * Timing-safe string comparison
 */
function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return result === 0;
}

/**
 * Production-grade middleware for:
 * - Supabase session refresh (automatic token refresh)
 * - Protected route authentication
 * - Secure cookie handling
 * - Administrative route protection via X-Admin-Secret
 * - Security headers enforcement
 */
export async function proxy(request: NextRequest) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_PWA4_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PWA4_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error("Missing Supabase environment variables in middleware")
    return NextResponse.next()
  }

  let supabaseResponse = NextResponse.next({
    request,
  })

  // Administrative route protection
  const isAdminRoute =
    request.nextUrl.pathname.startsWith("/api/setup") ||
    request.nextUrl.pathname.startsWith("/api/spots/update") ||
    request.nextUrl.pathname.startsWith("/api/spots/manual-update") ||
    request.nextUrl.pathname.startsWith("/api/spots/bypass-update") ||
    request.nextUrl.pathname.startsWith("/api/airbear/update-location") ||
    request.nextUrl.pathname.startsWith("/api/install")

  if (isAdminRoute) {
    const adminSecret = process.env.ADMIN_SECRET
    const authHeader = request.headers.get("X-Admin-Secret")

    if (!adminSecret || !authHeader || !timingSafeEqual(adminSecret, authHeader)) {
      return new NextResponse(
        JSON.stringify({ error: "Unauthorized: Invalid or missing Admin Secret" }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      )
    }
  }

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll()
      },
      setAll(cookiesToSet: Array<{ name: string; value: string; options?: Record<string, unknown> }>) {
        cookiesToSet.forEach(({ name, value }) => {
          request.cookies.set(name, value)
        })
        supabaseResponse = NextResponse.next({
          request,
        })
        cookiesToSet.forEach(({ name, value, options }) => {
          if (options) {
            supabaseResponse.cookies.set(name, value, options as Parameters<typeof supabaseResponse.cookies.set>[2])
          } else {
            supabaseResponse.cookies.set(name, value)
          }
        })
      },
    },
  })

  // Refresh session if needed (automatic token refresh)
  await supabase.auth.getUser()

  // Protect authenticated routes
  const isProtectedRoute =
    request.nextUrl.pathname.startsWith("/dashboard") ||
    request.nextUrl.pathname.startsWith("/driver") ||
    request.nextUrl.pathname.startsWith("/map") && request.nextUrl.searchParams.has("auth")

  if (isProtectedRoute) {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      const url = request.nextUrl.clone()
      url.pathname = "/auth/login"
      url.searchParams.set("redirect", request.nextUrl.pathname)
      return NextResponse.redirect(url)
    }
  }

  // Add security headers
  for (const [key, value] of Object.entries(SECURITY_HEADERS)) {
    supabaseResponse.headers.set(key, value)
  }
  return supabaseResponse
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
}
