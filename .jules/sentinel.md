## 2025-05-22 - [Middleware Misconfiguration and Auth Rate Limiting]
**Vulnerability:** Critical security middleware was named proxy.ts instead of middleware.ts, causing Next.js to skip it entirely. Authentication endpoints lacked rate limiting.
**Learning:** Next.js middleware MUST be named middleware.ts in the root (or src/) to be active. Verification of active security controls is essential during deployment.
**Prevention:** Always verify that security headers (like X-Frame-Options) are present in responses from the production/development server to confirm middleware is active. Use the standard filename middleware.ts.
