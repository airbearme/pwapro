## 2025-05-15 - [Map Marker Optimization]
**Learning:** Recreating Leaflet markers on every state update is a major performance bottleneck in React applications. Leaflet's DOM manipulations are expensive.
**Action:** Use "dirty checking" with hashes on marker instances to update them in-place (O(N+M)) instead of removing and recreating them. Pre-calculate counts/relationships (O(A)) to avoid O(S*A) nested loops in the render/effect path.
