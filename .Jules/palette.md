## 2025-05-15 - Sitewide Tooltips and Accessibility
**Learning:** Adding a sitewide TooltipProvider allows for consistent micro-interactions. Pair icon-only buttons with ARIA labels and tooltips to ensure they are accessible to both screen readers and visual users.
**Action:** Always wrap the root layout in TooltipProvider when using Radix-based tooltips to avoid repeated provider boilerplate and ensure accessibility sitewide.
