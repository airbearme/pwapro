## 2026-02-01 - Auth Bypass via Middleware Naming

**Vulnerability:** Critical authentication bypass where protected routes (/dashboard, /driver) were accessible without login because the middleware was named `proxy.ts` instead of `middleware.ts`, causing Next.js to ignore it.
**Learning:** Next.js requires the middleware file to be named exactly `middleware.ts` (or `.js`) and export a function named `middleware`. Non-standard naming results in the middleware not being executed.
**Prevention:** Always use standard Next.js file naming conventions for core functionality and verify middleware execution by testing protected route access in a development or staging environment.

## 2026-02-01 - Hardcoded Secrets in Deployment Scripts

**Vulnerability:** Critical exposure of Supabase Service Role keys and live Stripe keys in `add-vercel-env-vars.sh` and `PUSH_AND_DEPLOY.md`.
**Learning:** Development scripts and documentation drafts often contain real keys used during initial setup. These can be easily overlooked and committed to the repository.
**Prevention:** Use placeholders in all documentation and scripts committed to the repository. Use environment variables or secret management tools for actual deployment.
