## 2025-05-15 - [Skip to Content Accessibility]
**Learning:** Implementing a "Skip to Content" link at the layout level requires consistent use of a target ID (e.g., `main-content`) across all page-level containers. Transitioning from generic `div` elements to semantic `<main>` tags on key pages further improves the accessibility tree for screen readers.
**Action:** When adding global accessibility features in Next.js, ensure that all primary page layouts are updated to support the feature and use semantic HTML elements (`<main>`) to define the primary content area.
