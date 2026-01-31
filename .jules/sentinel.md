## 2026-01-31 - [Middleware Configuration Bug]
**Vulnerability:** Security headers and route protection were not being applied because the middleware was named `proxy.ts` instead of the standard `middleware.ts`, making it inactive in Next.js.
**Learning:** Next.js expects `middleware.ts` (or `middleware.js`) in the root or `src/`. Even if Turbopack mentions a mapping, it doesn't guarantee the middleware is executed as a standard Next.js middleware unless it follows the naming convention and exports.
**Prevention:** Always verify that security headers are actually present in the HTTP response using tools like `curl -I` or the browser console, rather than relying on the presence of code files.
