## 2026-01-09 - Unified Loading Feedback
**Learning:** Reusing a centralized `Spinner` component instead of manual SVG implementations in critical flows (like checkout) ensures consistent visual feedback and simplifies accessibility management (e.g., centralized ARIA roles).
**Action:** Audit interactive buttons for manual spinner implementations and replace them with the shared `Spinner` component.
