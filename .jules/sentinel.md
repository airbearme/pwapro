## 2026-02-02 - [Leaked Administrative Credentials & Middleware Activation]
**Vulnerability:** Widespread hardcoded Supabase Service Role keys and Stripe API keys in documentation and deployment scripts. Additionally, the security middleware was improperly named (`proxy.ts`), preventing Next.js from executing it and leaving the application without Content-Security-Policy (CSP) and server-side auth checks.
**Learning:** In standard Next.js, middleware must be named `middleware.ts` (or `.js`) and export a function named `middleware`. Standard-compliant naming is critical for security features to be active. Hardcoded secrets often proliferate in documentation aimed at "quick start" guides if not carefully audited.
**Prevention:**
1. Always use descriptive placeholders (e.g., `... (your key)`) in documentation.
2. Ensure middleware follows framework-specific naming conventions.
3. Apply security headers at the very beginning of the middleware function to ensure they are present even if early returns occur due to missing configuration or errors.
