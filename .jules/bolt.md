## 2024-07-22 - Initial Performance Exploration

**Learning:** Component memoization is a primary optimization strategy in this codebase. `AirbearWheel` is already memoized, indicating this is an accepted pattern. However, other animation-heavy components like `FloatingMascot` lack this optimization, leading to unnecessary re-renders.

**Action:** Prioritize wrapping animation-heavy, purely presentational components with `React.memo` to prevent re-renders when their props do not change. This is a low-risk, high-impact optimization for UI performance.
