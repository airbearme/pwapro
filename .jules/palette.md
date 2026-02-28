## 2025-02-28 - [Standardizing Accessible Tooltips]
**Learning:** Manual CSS-based tooltips lack keyboard accessibility and screen reader support. Standardizing on Radix UI's Tooltip primitive ensures accessibility (ESC to close, ARIA attributes) but requires the TooltipProvider to be strategically placed in the root layout to avoid repeated provider boilerplate.
**Action:** Always wrap the app in TooltipProvider in layout.tsx and use the Tooltip, TooltipTrigger, and TooltipContent components for any hover/focus metadata.
