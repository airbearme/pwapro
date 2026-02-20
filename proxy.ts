import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"
import { SECURITY_HEADERS } from "./lib/security-headers"

/**
 * Production-grade middleware for:
 * - Supabase session refresh (automatic token refresh)
 * - Protected route authentication
 * - Secure cookie handling
 */
export async function proxy(request: NextRequest) {
  // Protect administrative and setup endpoints
  // This check is independent of Supabase and should run first
  const isAdminRoute =
    request.nextUrl.pathname.startsWith("/api/setup/") ||
    request.nextUrl.pathname.startsWith("/api/spots/update") ||
    request.nextUrl.pathname.startsWith("/api/spots/manual-update") ||
    request.nextUrl.pathname.startsWith("/api/spots/bypass-update") ||
    request.nextUrl.pathname.startsWith("/api/airbear/update-location") ||
    request.nextUrl.pathname.startsWith("/api/install/")

  if (isAdminRoute) {
    const adminSecret = process.env.ADMIN_SECRET
    const providedSecret = request.headers.get("X-Admin-Secret")

    if (!adminSecret || providedSecret !== adminSecret) {
      return new NextResponse(JSON.stringify({ error: "Unauthorized: Admin secret required" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      })
    }
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error("Missing Supabase environment variables in middleware")
    return NextResponse.next()
  }

  let supabaseResponse = NextResponse.next({
    request,
  })

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
    request.nextUrl.pathname.startsWith("/api/rides/") ||
    request.nextUrl.pathname.startsWith("/api/airbear/location") ||
    (request.nextUrl.pathname.startsWith("/map") && request.nextUrl.searchParams.has("auth"))

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