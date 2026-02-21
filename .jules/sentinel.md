## 2026-02-21 - [Unauthorized Administrative API Access]
**Vulnerability:** Several administrative and setup API endpoints (`/api/setup/*`, `/api/install/*`, `/api/spots/update`) were public and allowed destructive database operations without authentication.
**Learning:** Legacy setup scripts or one-off administrative endpoints are often left public after development, creating significant security risks if not properly protected by middleware.
**Prevention:** All administrative or destructive API endpoints must be protected by middleware that enforces an `X-Admin-Secret` check or session-based authorization. Always check for administrative route protection BEFORE other logic in middleware to avoid fail-open scenarios.
