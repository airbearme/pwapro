## 2026-02-12 - [Unprotected Administrative Endpoints]

**Vulnerability:** Several administrative API endpoints (`/api/setup/*`, `/api/spots/update`, etc.) were completely unprotected, allowing anyone to perform destructive operations like deleting all spots from the database.
**Learning:** Legacy or setup-related endpoints are often overlooked during security hardening, creating "fail-open" vulnerabilities where sensitive logic is exposed without authentication.
**Prevention:** Implement a centralized `X-Admin-Secret` header check in the application middleware (`proxy.ts`) to provide a "fail-secure" baseline for all administrative paths.
