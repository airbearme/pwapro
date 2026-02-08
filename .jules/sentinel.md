## 2025-01-30 - Hardcoded Supabase Service Role Keys and Insecure Webhook Verification
**Vulnerability:** Multiple Supabase Service Role keys and Stripe secrets were hardcoded in deployment scripts, diagnostic scripts, and documentation. Additionally, Stripe webhook verification was vulnerable to timing and replay attacks.
**Learning:** Legacy diagnostic scripts and "materialize stubs" scripts (like `6.sh`) are common places where secrets or insecure logic can hide and be re-introduced.
**Prevention:** Use environment variables for all secrets, even in diagnostic scripts. Ensure security utilities (like webhook verification) use constant-time comparison and timestamp validation from the start. Mirror security fixes in any code-generation or materialization scripts.
