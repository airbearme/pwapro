## 2024-05-15 - Hardened Stripe Webhook Verification

**Vulnerability:** Naive Stripe webhook verification using `includes()` on the signature header, lacking replay protection and timing-safe comparison.
**Learning:** Stripe signatures should be parsed for `t` and `v1`, and the HMAC should be computed on `timestamp.body` to prevent replay attacks. Timing-safe comparison is essential to prevent signature discovery.
**Prevention:** Use a robust verification utility that handles parsing and timing safety. Mirror security logic in initialization scripts (like `6.sh`) to ensure persistence.
