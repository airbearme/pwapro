## 2026-01-10 - Exposed Administrative Endpoints in Middleware
**Vulnerability:** Administrative and setup API endpoints (/api/setup/*, /api/spots/update, etc.) were completely unprotected, allowing unauthorized destructive operations like deleting database records.
**Learning:** Middleware (proxy.ts) was configured to protect user-facing dashboard routes but missed internal/administrative API routes that perform critical system updates.
**Prevention:** Always implement a "fail-secure" gatekeeper in the edge middleware for any route matching administrative patterns (e.g., /api/admin/*, /api/setup/*) and require a strong secret (ADMIN_SECRET) via headers.
