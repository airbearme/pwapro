## 2025-05-15 - Naive Stripe Webhook Verification
**Vulnerability:** Naive Stripe webhook verification was susceptible to replay attacks, timing attacks, and did not follow official specs (missing timestamp in signed payload).
**Learning:** Security stubs in generation scripts (like `6.sh`) can inadvertently downgrade security if they are not maintained alongside the actual library code. Always ensure consistency between source-generators and production logic.
**Prevention:** Use established security libraries or strictly follow official security specifications. Implement replay protection with a small time window and use `crypto.timingSafeEqual` (ensuring buffer lengths are matched) for all sensitive comparisons.
