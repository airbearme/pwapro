## 2024-05-22 - [Credential Sanitization & Admin Protection]
**Vulnerability:** Hardcoded SFTP password 'Danknugs420420' was present in 20+ deployment scripts and documentation files. Additionally, multiple destructive setup API endpoints were unauthenticated.
**Learning:** Deployment scripts often contain "temporary" credentials that persist indefinitely. Centralizing API protection in middleware is more reliable than per-route checks for administrative tools.
**Prevention:** Use environment variables for all credentials. Implement a middleware-level secret check for all administrative/setup routes to ensure defense-in-depth.
