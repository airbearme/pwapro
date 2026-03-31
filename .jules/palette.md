## 2024-07-16 - Accessible Tooltips for Non-Interactive Elements

**Learning:** Simply adding a tooltip to a non-interactive element like a `<div>` is insufficient, as it's inaccessible to keyboard-only users. The trigger element itself must be made focusable to be compliant and provide a good user experience.

**Action:** For all future tooltips on non-button elements, I must:
1.  Add `tabIndex="0"` to make the element focusable.
2.  Add an appropriate `role` (e.g., `role="img"`) and a descriptive `aria-label`.
3.  Ensure `focus-visible` styles are applied to provide clear visual feedback for keyboard navigators.