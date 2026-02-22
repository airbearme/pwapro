## 2025-05-15 - [Map Marker Optimization]
**Learning:** Recreating Leaflet markers on every state update is a major performance bottleneck in React applications. Leaflet's DOM manipulations are expensive.
**Action:** Use "dirty checking" with hashes on marker instances to update them in-place (O(N+M)) instead of removing and recreating them. Pre-calculate counts/relationships (O(A)) to avoid O(S*A) nested loops in the render/effect path.

## 2025-05-15 - [CI Optimization & Script Robustness]
**Learning:** Redundant build steps in CI (e.g., running `npm run build` after `codemaps:generate` which already builds) waste significant time. Also, scripts writing to build artifacts (`.next/codemaps`) must explicitly ensure the directory exists to avoid ENOENT errors in distributed CI environments where directory state may be inconsistent.
**Action:** Consolidate CI steps to avoid redundant builds. Always use `fs.mkdirSync(..., { recursive: true })` before writing reports in CodeMaps scripts.
