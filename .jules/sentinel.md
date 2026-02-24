## 2026-05-15 - Middleware Filename and Admin Protection
**Vulnerability:** Next.js middleware was named `proxy.ts` instead of `middleware.ts`, causing it to never execute. Additionally, sensitive administrative endpoints like `/api/setup/*` had no internal authentication and relied entirely on the (non-executing) middleware.
**Learning:** Next.js requires the middleware file to be named exactly `middleware.ts` (or `.js`) in the root or `src` directory to be recognized. Naming it anything else silently disables global request interception.
**Prevention:** Always verify middleware execution by checking for expected side effects (like security headers) in development. Use `X-Admin-Secret` with timing-safe comparison for high-privilege endpoints that don't use standard session auth.
