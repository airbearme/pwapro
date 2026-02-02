## 2026-02-02 - [Leaked Administrative Credentials & Build Stability]
**Vulnerability:** Widespread hardcoded Supabase Service Role keys and Stripe API keys in documentation and deployment scripts. These keys grant full administrative access, bypassing Row Level Security.
**Learning:**
1. Next.js 16.1.6 deprecates `middleware.ts` in favor of `proxy.ts`. Incorrectly naming this file leaves the application without intended security headers and server-side authentication.
2. Build failures in production mode can be caused by Stripe API version mismatches between the library types and the initialized client.
3. CI/CD pipelines can fail due to missing ESLint plugins (e.g., `eslint-plugin-import`) and incorrect step ordering (e.g., validating codemaps before generating them).
**Prevention:**
1. Always use descriptive placeholders (e.g., `... (your key)`) in documentation.
2. Monitor framework deprecation warnings to ensure security middleware remains active.
3. Keep dependency-specific configurations (like Stripe `apiVersion`) in sync with the environment and library versions.
4. Ensure CI/CD workflows run generation tasks before validation tasks.
