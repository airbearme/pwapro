## 2026-05-22 - [Foundation Restoration & Theme Locking]
**Learning:** In this repository, brand consistency relies on a "Core UI Foundation" (defined in `CORE_UI_FOUNDATION.md`) that may be accidentally omitted from layouts. Additionally, the dark-mode identity is mandatory; using `enableSystem={false}` in `ThemeProvider` is critical to prevent system light-mode settings from breaking the intended aesthetic.
**Action:** Always verify that `FloatingMascot`, `PWAInstallPrompt`, and `Toaster` are present in the root layout, and ensure `ThemeProvider` is locked to dark mode.
