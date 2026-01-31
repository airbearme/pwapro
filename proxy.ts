import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { SECURITY_HEADERS } from "./lib/security-headers";

export async function proxy(request: NextRequest) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  let res = NextResponse.next({ request });
  const apply = (r: NextResponse) =>
    Object.entries(SECURITY_HEADERS).forEach(([k, v]) => r.headers.set(k, v));

  apply(res);
  if (!url || !key) return res;

  const supabase = createServerClient(url, key, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll: (cs) => {
        cs.forEach(({ name, value }) => request.cookies.set(name, value));
        res = NextResponse.next({ request });
        apply(res);
        cs.forEach(({ name, value, options }) =>
          res.cookies.set(name, value, options),
        );
      },
    },
  });

  await supabase.auth.getUser();
  const path = request.nextUrl.pathname;
  const isProtected =
    path.startsWith("/dashboard") ||
    path.startsWith("/driver") ||
    (path.startsWith("/map") && request.nextUrl.searchParams.has("auth"));

  if (isProtected) {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      const loginUrl = request.nextUrl.clone();
      loginUrl.pathname = "/auth/login";
      const redir = NextResponse.redirect(loginUrl);
      apply(redir);
      return redir;
    }
  }

  return res;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
