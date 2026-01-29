## 2026-01-29 - Hardcoded Stripe Test Keys

**Vulnerability:** Hardcoded Stripe test keys (`STRIPE_SECRET_KEY` and `STRIPE_WEBHOOK_SECRET`) were found in the `saved` file and `README.md`.
**Learning:** Secrets, even test keys, should never be committed to the repository. The presence in documentation and a seemingly temporary file highlights the risk of secrets spreading across the codebase.
**Prevention:** Use `.env` files for all secrets and provide a `.env.example` file as a template. Regularly scan the codebase for hardcoded credentials.
