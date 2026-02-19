## 2026-01-09 - Enforcing Dark Mode Identity
**Learning:** Forcing `enableSystem={false}` in `ThemeProvider` is necessary when the brand identity (like AirBear) is strictly dark-mode. This prevents theme flickering and ensures CSS animations (like pulse-glow) always have the intended background contrast.
**Action:** Always check `CORE_UI_FOUNDATION.md` for theme constraints before modifying `app/layout.tsx`.

## 2026-01-09 - Unified Loading Feedback
**Learning:** Reusing a centralized `Spinner` component instead of manual SVG implementations in critical flows (like checkout) ensures consistent visual feedback and simplifies accessibility management (e.g., centralized ARIA roles).
**Action:** Audit interactive buttons for manual spinner implementations and replace them with the shared `Spinner` component.
