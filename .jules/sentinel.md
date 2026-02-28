## 2025-05-15 - Timing-Safe Admin Secret Verification in Edge Runtime
**Vulnerability:** Administrative endpoints (/api/setup/*, /api/spots/update) were previously unprotected or relied on obscure filenames (proxy.ts) which are not standard for Next.js middleware, potentially leaving them exposed.
**Learning:** Standard Node.js `crypto.timingSafeEqual` is not available in the Next.js Edge Runtime. Verification must use `crypto.subtle.digest` to hash both the input and the secret before bitwise comparison to prevent side-channel timing attacks without leaking secret length.
**Prevention:** Always use SHA-256 hashing before bitwise comparison for secret verification in Edge Middleware to ensure cross-runtime compatibility and maximum security.
