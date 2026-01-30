# Sentinel Journal 🛡️

## 2026-01-30 - Middleware Reliability and Security Headers

**Vulnerability:** The middleware (`proxy.ts`) was only applying security headers if Supabase environment variables were present. In local development or CI environments where these variables might be missing, the application was left without security headers.
**Learning:** Security headers should be applied universally to all responses, including redirects and error states, regardless of the status of other middleware logic like authentication. Consistency is key for defense-in-depth.
**Prevention:** Refactor middleware to ensure a "secure-by-default" path that applies headers before any conditional logic that might exit early.
