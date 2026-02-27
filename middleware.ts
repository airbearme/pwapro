import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"
import { SECURITY_HEADERS } from "./lib/security-headers"

/**
 * Robust timing-safe comparison using SHA-256 hashing.
 * This approach ensures that even the length of the secret is not leaked
 * through timing analysis, as hashing occurs for both strings before bitwise comparison.
 */
async function timingSafeEqual(a: string, b: string): Promise<boolean> {
  const encoder = new TextEncoder()
  const aData = encoder.encode(a)
  const bData = encoder.encode(b)

  // Use SubtleCrypto to hash both strings
  const [aHash, bHash] = await Promise.all([
    crypto.subtle.digest("SHA-256", aData),
    crypto.subtle.digest("SHA-256", bData),
  ])

  const aView = new Uint8Array(aHash)
  const bView = new Uint8Array(bHash)

  // Use bitwise XOR for constant-time comparison of the fixed-length hashes
  let result = 0
  for (let i = 0; i < aView.length; i++) {
    result |= aView[i] ^ bView[i]
  }

  // Also verify original lengths to handle hash collisions
  return result === 0 && a.length === b.length
}

/**
 * Production-grade middleware for:
 * - Supabase session refresh (automatic token refresh)
 * - Protected route authentication
 * - Admin secret verification for setup/update endpoints
 * - Secure cookie handling
 */
export async function middleware(request: NextRequest) {
  const supabaseUrl =
    process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_PWA4_URL
  const supabaseAnonKey =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PWA4_ANON_KEY
  const adminSecret = process.env.ADMIN_SECRET

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
      setAll(
        cookiesToSet: Array<{ name: string; value: string; options?: Record<string, unknown> }>
      ) {
        cookiesToSet.forEach(({ name, value }) => {
          request.cookies.set(name, value)
        })
        supabaseResponse = NextResponse.next({
          request,
        })
        cookiesToSet.forEach(({ name, value, options }) => {
          if (options) {
            supabaseResponse.cookies.set(
              name,
              value,
              options as Parameters<typeof supabaseResponse.cookies.set>[2]
            )
          } else {
            supabaseResponse.cookies.set(name, value)
          }
        })
      },
    },
  })

  // Refresh session if needed and get user once for all checks
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // 1. Protect Administrative and Setup endpoints
  const isAdminRoute =
    request.nextUrl.pathname.startsWith("/api/setup/") ||
    request.nextUrl.pathname.startsWith("/api/spots/update") ||
    request.nextUrl.pathname.startsWith("/api/airbear/update-location")

  if (isAdminRoute) {
    const providedSecret = request.headers.get("X-Admin-Secret")

    // Deny access if admin secret is not configured or doesn't match
    const isSecretValid =
      adminSecret && providedSecret ? await timingSafeEqual(providedSecret, adminSecret) : false

    if (!isSecretValid) {
      return NextResponse.json(
        { error: "Access denied: Invalid or missing admin secret" },
        { status: 403 }
      )
    }
  }

  // 2. Protect authenticated UI routes
  const isProtectedRoute =
    request.nextUrl.pathname.startsWith("/dashboard") ||
    request.nextUrl.pathname.startsWith("/driver") ||
    (request.nextUrl.pathname.startsWith("/map") && request.nextUrl.searchParams.has("auth"))

  if (isProtectedRoute && !user) {
    const url = request.nextUrl.clone()
    url.pathname = "/auth/login"
    url.searchParams.set("redirect", request.nextUrl.pathname)
    return NextResponse.redirect(url)
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
