
## 2026-02-09 - [Accessible Tooltips for Icon-Only Buttons]
**Learning:** Icon-only interactive elements, such as theme toggles, are UX anti-patterns for users relying on screen readers or those who find icons ambiguous. Providing both an `aria-label` and a visual `Tooltip` ensures the component is accessible and its function is clear on hover.
**Action:** Always wrap icon-only buttons in a `Tooltip` and provide a descriptive `aria-label` that reflects the button's action or state.
