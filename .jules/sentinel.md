## 2026-02-04 - [Middleware Naming and Hardcoded Secrets]

**Vulnerability:** Middleware was named `proxy.ts` instead of `middleware.ts`, disabling server-side auth and security headers. Multiple documentation and deployment scripts contained hardcoded Supabase service role keys.
**Learning:** Next.js strictly requires `middleware.ts` (or `middleware.js`) in the root or `src` directory to activate the middleware. Hardcoded secrets often persist in documentation even after being removed from code.
**Prevention:** Use a pre-commit hook or CI check to scan for hardcoded secrets (especially JWTs and Stripe keys). Enforce middleware naming conventions via linting or automated tests.
