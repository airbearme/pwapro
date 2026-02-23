import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"
import { SECURITY_HEADERS } from "./lib/security-headers"

export async function middleware(req: NextRequest) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_PWA4_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PWA4_ANON_KEY
  if (!url || !key) return NextResponse.next()
  let res = NextResponse.next({ request: req })
  const supabase = createServerClient(url, key, {
    cookies: {
      getAll: () => req.cookies.getAll(),
      setAll: (cs) => {
        cs.forEach(c => req.cookies.set(c.name, c.value))
        res = NextResponse.next({ request: req })
        cs.forEach(c => res.cookies.set(c.name, c.value, c.options as any))
      },
    },
  })
  const { data: { user } } = await supabase.auth.getUser()
  const p = req.nextUrl.pathname
  if (["/api/setup/", "/api/install/", "/api/spots/"].some(s => p.startsWith(s))) {
    if (req.headers.get("X-Admin-Secret") !== process.env.ADMIN_SECRET)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  const isAuth = ["/dashboard", "/driver"].some(s => p.startsWith(s)) || (p.startsWith("/map") && req.nextUrl.searchParams.has("auth"))
  if ((isAuth || p.startsWith("/api/rides/")) && !user) {
    if (p.startsWith("/api/")) return NextResponse.json({ error: "Auth required" }, { status: 401 })
    const l = req.nextUrl.clone()
    l.pathname = "/auth/login"; l.searchParams.set("redirect", p)
    return NextResponse.redirect(l)
  }
  Object.entries(SECURITY_HEADERS).forEach(([k, v]) => res.headers.set(k, v))
  return res
}
export const config = { matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"] }
