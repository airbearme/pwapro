## 2026-02-12 - Hardcoded Secrets & Webhook Hardening
**Vulnerability:** Extensive hardcoded Supabase service role keys, Stripe secret keys, and SFTP passwords found in deployment scripts and documentation.
**Learning:** Deployment convenience scripts often become a resting place for real credentials, especially when transitioning between environments.
**Prevention:** Always use `process.env` in scripts and provide `.env.example` templates. Automated sanitization tools can help catch these before commit.

## 2026-02-12 - Stripe Webhook Timing Attacks
**Vulnerability:** Weak signature verification using `includes()` and lacking replay protection.
**Learning:** Simple signature checks are vulnerable to timing attacks and replay attacks if the timestamp is not validated.
**Prevention:** Use `crypto.timingSafeEqual` and always validate the `t=` timestamp against the current server time with a reasonable window (e.g., 5 minutes).
