## 2025-05-15 - [Stripe Webhook Verification Regression]
**Vulnerability:** Placeholder Stripe webhook verification logic using `sig.includes(h)` was vulnerable to timing attacks and lacked replay protection.
**Learning:** Security utilities provided in materialization scripts like `6.sh` can easily regress to insecure placeholders if not carefully maintained and synchronized with the actual library files.
**Prevention:** Always ensure security-critical logic is mirrored in build/materialization scripts and include robust validation (timing-safe comparison, timestamp windows) as the default, not an afterthought.
