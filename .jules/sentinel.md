## 2025-02-27 - Hardcoded Secrets and Insecure Webhook Verification

**Vulnerability:** Found hardcoded production Supabase and Stripe secrets in `add-vercel-env-vars.sh`. Also, `verifyStripe` utility used insecure substring matching and was vulnerable to timing attacks.

**Learning:** Setup and deployment scripts are common places where secrets "leak" during rapid development. Webhook verification logic often misses the requirement for timing-safe comparison (`crypto.timingSafeEqual`) and exact payload construction (timestamp + body).

**Prevention:** Always use environment variables or secret managers for deployment scripts. Standardize webhook verification using established libraries or strictly following the provider's security documentation (e.g., Stripe's `t=` and `v1=` format).
