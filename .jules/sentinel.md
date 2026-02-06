## 2025-05-15 - [CRITICAL] Pervasive Hardcoded Secrets in Deployment Scripts and Docs
**Vulnerability:** Multiple critical secrets (Supabase Service Role keys, IONOS SFTP passwords, Stripe webhook secrets) were hardcoded across 20+ documentation and utility script files.
**Learning:** Legacy deployment scripts and "one-off" diagnostic tools often escape standard security sweeps and accumulate technical debt in the form of hardcoded credentials. Documentation and "instructions" files are also high-risk areas for secret leakage.
**Prevention:**
1. Use environment variables for all credentials, even in diagnostic scripts.
2. Maintain a "Secrets Sanitization" checklist that includes documentation and scripts/ directories.
3. Automatically delete diagnostic scripts that contain secrets once their task is complete.
4. Use truncated placeholders in documentation to guide users without exposing real keys.
