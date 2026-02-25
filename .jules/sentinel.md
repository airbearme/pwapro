## 2026-05-15 - Middleware and Admin Protection
**Vulnerability:** The middleware was potentially bypassed due to naming conventions and lack of timing-safe verification for administrative secrets. Production secrets were also hardcoded in deployment scripts.
**Learning:** Next.js middleware must follow precise naming and export conventions. When using custom secrets for API protection (like `X-Admin-Secret`), always use timing-safe comparison to prevent side-channel attacks.
**Prevention:** Use environment variable validation (Zod) to ensure security keys are present. Redact all production secrets from the codebase and use a secret manager or CI/CD secrets instead.
