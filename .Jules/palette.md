## 2026-01-10 - Enabling Sitewide Tooltips
**Learning:** In a Radix-based UI system (like shadcn/ui), enabling tooltips sitewide requires wrapping the application in a `TooltipProvider` at the root layout level. This allows any component to use `Tooltip` without needing its own provider.
**Action:** Always check `app/layout.tsx` for `TooltipProvider` before implementing tooltips. If missing, add it to enable consistent micro-UX enhancements across the app.
