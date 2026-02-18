## 2025-05-15 - Hardcoded Secrets in Deployment Scripts
**Vulnerability:** Critical SFTP passwords and Supabase Service Role keys were hardcoded in multiple deployment and test scripts (`scripts/*.js`, `add-vercel-env-vars.sh`) and documentation files.
**Learning:** Development-time convenience often leads to security debt where credentials are hardcoded for "local testing" but then committed to the repository, exposing them to anyone with access to the source code.
**Prevention:** Always use environment variables for credentials from the start, even in internal utility scripts. Use `.env.example` to document required variables without exposing values.
