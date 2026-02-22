## 2026-02-21 - MapView Marker Reconciliation

**Learning:** Initializing Leaflet markers by clearing all and re-adding is O(N) and causes significant UI lag and flickering during real-time updates. Using a `Map` to track markers and performing "dirty checking" on marker data allows for O(1) updates per entity change.

**Action:** Implement marker reconciliation with dirty checking in high-frequency map components. Track visual state on marker instances to avoid redundant `setIcon` calls. Use `React.memo` and `useCallback` to prevent unnecessary re-renders of the map container itself.
