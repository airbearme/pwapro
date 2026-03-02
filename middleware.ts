import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"
import { SECURITY_HEADERS } from "./lib/security-headers"

/**
 * Timing-safe comparison using SHA-256 hashing.
 * Suitable for Next.js Edge Runtime.
 */
async function timingSafeEqual(a: string, b: string): Promise<boolean> {
  if (!a || !b || a.length !== b.length) {
    // Still perform hashing to maintain timing consistency for same-length strings
    // but we know they are not equal if lengths differ.
  }

  const encoder = new TextEncoder()
  const aData = encoder.encode(a)
  const bData = encoder.encode(b)

  const [aHash, bHash] = await Promise.all([
    crypto.subtle.digest("SHA-256", aData),
    crypto.subtle.digest("SHA-256", bData),
  ])

  const aArray = Array.from(new Uint8Array(aHash))
  const bArray = Array.from(new Uint8Array(bHash))

  if (aArray.length !== bArray.length) return false

  let result = 0
  for (let i = 0; i < aArray.length; i++) {
    result |= aArray[i] ^ bArray[i]
  }
  return result === 0 && a === b
}

/**
 * Production-grade middleware for:
 * - Supabase session refresh (automatic token refresh)
 * - Protected route authentication
 * - Secure cookie handling
 * - Admin route protection via X-Admin-Secret
 */
export async function middleware(request: NextRequest) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_PWA4_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PWA4_ANON_KEY

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

  // Refresh session if needed
  const { data: { user } } = await supabase.auth.getUser()

  // Protect Admin routes
  const isAdminRoute =
    request.nextUrl.pathname.startsWith("/api/setup/") ||
    request.nextUrl.pathname === "/api/airbear/update-location"

  if (isAdminRoute) {
    const adminSecret = process.env.ADMIN_SECRET
    const providedSecret = request.headers.get("X-Admin-Secret")

    if (!adminSecret || !providedSecret || !(await timingSafeEqual(providedSecret, adminSecret))) {
      return NextResponse.json({ error: "Unauthorized administrative access" }, { status: 401 })
    }
  }

  // Protect authenticated routes
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
