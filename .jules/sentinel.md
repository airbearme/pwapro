# Sentinel 🛡️ - Security Journal

## 2026-02-05 - Next.js 16 Middleware Convention
**Vulnerability:** Attempting to use `middleware.ts` when the project has been upgraded to Next.js 16.
**Learning:** In Next.js 16+, the standard file convention for middleware has shifted to `proxy.ts`. Using `middleware.ts` triggers a deprecation warning and might lead to unexpected behavior if both exist or if the framework expectations change further.
**Prevention:** Always check the dev server output for deprecation warnings regarding file conventions when upgrading framework versions.

## 2026-02-05 - Timing-Safe Cryptographic Comparisons
**Vulnerability:** Using `String.prototype.includes()` or `===` for verifying cryptographic signatures (e.g., Stripe webhooks).
**Learning:** Standard string comparison operators are not timing-safe and can be exploited to leak information about the expected hash through timing attacks.
**Prevention:** Always use `crypto.timingSafeEqual()` for comparing hashes, signatures, or any sensitive tokens. Ensure both inputs are converted to Buffers of equal length before comparison.
