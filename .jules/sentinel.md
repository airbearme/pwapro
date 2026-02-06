# Sentinel 🛡️ - Security Journal

## 2026-02-05 - Leaked Supabase Service Role Keys
**Vulnerability:** Sensitive `SUPABASE_SERVICE_ROLE_KEY` and Stripe secrets were found hardcoded in deployment scripts (`add-vercel-env-vars.sh`) and documentation (`PUSH_AND_DEPLOY.md`).
**Learning:** Service role keys bypass all Row Level Security (RLS) policies. If leaked, an attacker has full administrative access to the database. These keys should NEVER be committed to the repository, even in scripts intended for administrative use.
**Prevention:** Use placeholder strings in scripts and documentation. Educate developers to use environment variables or secure secret managers for sensitive keys. Add pre-commit hooks to scan for high-entropy strings or known key patterns (e.g., `eyJ...`).
