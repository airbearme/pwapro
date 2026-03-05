## 2025-05-15 - [Exposed Production Secrets]
**Vulnerability:** Multiple production secrets (Supabase Service Role, Anon keys, Stripe secrets) were hardcoded in scripts and documentation.
**Learning:** Hardcoding secrets in scripts used for testing or deployment setup is a common but high-risk practice that can lead to credential leakage if the repository is shared or compromised.
**Prevention:** Always use environment variables for secrets and provide template files or placeholders in documentation and scripts. Use Zod schemas to validate required environment variables at runtime.
