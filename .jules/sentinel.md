## 2026-02-18 - Unprotected Administrative and Setup Endpoints
**Vulnerability:** Several administrative and setup API endpoints (/api/setup/*, /api/spots/update, etc.) were publicly accessible and allowed destructive database operations without authentication or authorization.
**Learning:** Middleware logic meant to protect these routes was missing or bypassed due to early returns when environment variables were not yet configured.
**Prevention:** Always place security and authorization checks at the beginning of middleware, independent of external service configurations like Supabase, to ensure fail-secure behavior.
