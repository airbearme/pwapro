## 2025-05-14 - Standardizing Tooltips and Accessibility Primitives
**Learning:** Manual CSS tooltips often lack keyboard accessibility (ESC to close, focus management) and screen reader support. Migrating to Radix UI's Tooltip primitive ensures a consistent, accessible experience across the app.
**Action:** Always prefer Radix UI primitives over custom CSS solutions for interactive overlays. Ensure global providers (TooltipProvider) are present in the root layout to support these components.
