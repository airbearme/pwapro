## 2024-05-24 - [Accessible Tooltips for Icon-Only Actions]
**Learning:** Icon-only buttons (like theme toggles or dismiss buttons) are often missing both visual labels (tooltips) and accessible labels (aria-labels). Enabling sitewide `TooltipProvider` in the root layout allows for a consistent and accessible way to provide these missing pieces of information.
**Action:** Always wrap the root layout in `TooltipProvider` and ensure icon-only buttons are paired with both `aria-label` and `Tooltip`.
