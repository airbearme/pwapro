## 2025-05-15 - Middleware Inactivity and Unprotected Admin Endpoints

**Vulnerability:** The application's middleware was named `proxy.ts` instead of `middleware.ts`, causing Next.js to ignore it. This left `/dashboard`, `/driver`, and authenticated `/map` routes unprotected. Additionally, administrative setup endpoints (`/api/setup/*`, `/api/spots/update`, `/api/airbear/update-location`) lacked any authentication or secret-based protection.
**Learning:** Next.js middleware is convention-based and MUST be named `middleware.ts` (or `.js`) in the root or `src/` directory to be automatically executed. Incorrect naming silently disables critical security controls like session refreshing and route protection.
**Prevention:** Always use the standard `middleware.ts` filename. Implement automated security tests that verify protected routes return 401/302 when unauthenticated and that security headers are present in responses.
