## 2026-02-02 - [Leaked Administrative Credentials & Build Stability]

**Vulnerability:** Widespread hardcoded Supabase Service Role keys and Stripe API keys in documentation and deployment scripts. These keys grant full administrative access, bypassing Row Level Security.
**Learning:**

1. Next.js 16.1.6 deprecates `middleware.ts` in favor of `proxy.ts`. Incorrectly naming this file leaves the application without intended security headers and server-side authentication.
2. Build failures in production mode can be caused by Stripe API version mismatches between the local environment (pnpm) and the CI environment (npm/package-lock). Using `@ts-ignore` for the `apiVersion` provides a portable workaround when the environment is heterogeneous.
3. CI/CD pipelines can fail due to missing ESLint plugins (e.g., `eslint-plugin-import`) and incorrect step ordering (e.g., validating codemaps before generating them).
4. Automated analysis scripts (like `advanced-codemaps-analyzer.cjs`) need robust initialization of metrics to avoid runtime errors when CodeMaps have not yet been generated.
   **Prevention:**
5. Always use descriptive placeholders (e.g., `... (your key)`) in documentation.
6. Monitor framework deprecation warnings to ensure security middleware remains active.
7. Keep dependency-specific configurations (like Stripe `apiVersion`) in sync with the environment and library versions, or use type-bypass for version-sensitive metadata.
8. Ensure CI/CD workflows run generation tasks before validation tasks.
9. Initialize metrics collections as arrays in analysis tools to handle empty or uninitialized states gracefully.
