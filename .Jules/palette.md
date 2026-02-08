# Palette's Journal

## 2025-05-14 - [Accessibility Foundation]
**Learning:** An infrastructural change, like adding a `TooltipProvider`, is considered an incomplete UX improvement unless it is paired with at least one user-facing implementation to provide tangible value.
**Action:** When adding global providers, always implement at least one concrete example (e.g., a tooltip on a button) to demonstrate and verify the functionality.

## 2025-05-14 - [Consistent Dark Mode Identity]
**Learning:** To maintain the repository's mandatory dark-mode identity and UI foundation, the `ThemeProvider` in `app/layout.tsx` must be configured with `enableSystem={false}`.
**Action:** Ensure `enableSystem={false}` is set when using `next-themes` to prevent accidental light mode flash or persistence if the system preference differs from the brand's dark-mode-first identity.
