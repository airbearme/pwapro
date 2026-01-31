## 2026-01-31 - [CI Build and Middleware Fixes]

**Vulnerability:** Security headers were partially missing and route protection was unreliable.
**Learning:** Next.js 16.1.6 (in this environment) uses `proxy.ts` instead of `middleware.ts`. Zod validation at module level in `lib/supabase/server.ts` caused build failures in CI because environment variables are not present during build time.
**Prevention:** Move environment variable validation into the functions that use them to avoid module-level execution during build. Standardize security header application in the middleware/proxy.
