## 2025-03-05 - Map Performance & CI Hardening

**Learning:** Leaflet marker re-creation is expensive. Dirty checking with \_\_dataHash and Map refs prevents DOM churn. Next.js static builds in CI fail on Zod schemas without defaults if secrets are missing.
**Action:** Use O(1) marker updates. Add safe defaults to Zod schemas. Guard custom scripts against empty data/missing directories.
