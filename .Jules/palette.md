## 2026-02-14 - Foundation Restoration & Accessibility

**Learning:** Core brand components (Mascot, Toaster) were missing from the layout, and icon-only interactive elements lacked context for screen readers. In a dark-mode first application, system theme detection can sometimes break the intended brand aesthetic if not locked.

**Action:** Restored mandatory components to `app/layout.tsx` to satisfy `CORE_UI_FOUNDATION.md`. Added `aria-label` to mascot links and `aria-hidden` to decorative wheels. Standardized loading states to use the centralized `Spinner` component for consistent user feedback.
