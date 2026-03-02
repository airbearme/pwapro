## 2026-03-02 - [Middleware Security Hardening]
**Vulnerability:** Middleware was misnamed as 'proxy.ts', rendering it inactive in Next.js. Administrative endpoints (/api/setup/*, /api/airbear/update-location) were completely unprotected.
**Learning:** Next.js requires the middleware file to be named 'middleware.ts' in the root. Simply having a file named 'proxy.ts' does nothing unless explicitly invoked, which is not the standard Next.js middleware pattern.
**Prevention:** Always use standard 'middleware.ts' and ensure all sensitive API routes are covered by either session authentication or secret-based authorization.
