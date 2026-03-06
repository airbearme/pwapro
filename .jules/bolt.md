## 2025-05-14 - Optimizing Leaflet Marker Updates

**Learning:** Leaflet marker updates in React are often implemented by clearing and recreating the entire layer set on every state change. For real-time applications (e.g., vehicle tracking), this causes $O(N)$ DOM churn and visual flicker. Using a `useRef` Map to persist marker instances and applying in-place updates (`setLatLng`, `setIcon`) with "dirty checking" (`__iconState`, `__dataHash`) reduces this to $O(1)$ updates for moving objects and $O(0)$ for stationary ones. Additionally, moving CSS animations from inline styles on every marker to a single shared `<style>` block managed by the component reduces DOM bloat and style recalculation overhead.

**Action:** Always check if collection-based components (maps, lists, charts) are performing full teardowns on updates. Implement stable references for markers/items and use "dirty checking" to minimize Leaflet/DOM operations to only what is strictly necessary.
