## 2025-05-15 - Standardizing Radix Tooltips

**Learning:** Standardizing on Radix UI's Tooltip primitive instead of manual CSS hover effects ensures consistent keyboard accessibility (ESC to close) and ARIA support. Manual CSS tooltips often lack proper positioning on mobile and don't support screen readers effectively.
**Action:** Always prefer @/components/ui/tooltip for any icon-only buttons or interactive decorative elements. Ensure TooltipProvider is present in the root layout.
