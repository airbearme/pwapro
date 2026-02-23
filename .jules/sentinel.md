## 2025-02-23 - Hardcoded Secrets and Inactive Middleware
**Vulnerability:** Found hardcoded Supabase Service Role keys and Stripe secrets in documentation and deployment scripts. Also identified that the authentication middleware was misnamed as `proxy.ts`, causing Next.js to ignore it and leaving routes unprotected.
**Learning:** Standard framework files like `middleware.ts` are essential for security enforcement in Next.js; renaming them can silently disable authentication. Legacy scripts often contain "one-off" secrets that are forgotten.
**Prevention:** Use `middleware.ts` for centralized authentication enforcement. Use Zod schemas in `lib/env.ts` to validate required environment variables and prevent hardcoding.
