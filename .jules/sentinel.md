## 2025-05-14 - [Stripe Hardening & Materialization Persistence]
**Vulnerability:** Weak Stripe webhook verification (`sig.includes(h)`) was vulnerable to timing attacks and lacked replay protection.
**Learning:** Security fixes in this repository can be overwritten by materialization scripts like `6.sh` if they are not mirrored within those scripts.
**Prevention:** Always check for materialization or setup scripts (like `6.sh` or `7.sh`) that might overwrite core logic, and ensure security improvements are updated in both the source files and the materialization logic.
