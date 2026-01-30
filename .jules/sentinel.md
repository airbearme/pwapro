# Sentinel Journal 🛡️

## 2026-01-30 - Missing Middleware and Security Headers
**Vulnerability:** The application had a `proxy.ts` file that contained middleware logic (route protection and security headers) but was not named `middleware.ts`. In this environment, `middleware.ts` is the preferred convention for Next.js middleware.
**Learning:** In Next.js, middleware must be named `middleware.ts` (or `.js`) and located in the root or `src/` directory to be automatically picked up by the framework. Dead code in files like `proxy.ts` can lead to a false sense of security.
**Prevention:** Always verify that middleware is active by checking for expected headers or redirect behavior in a test environment.
