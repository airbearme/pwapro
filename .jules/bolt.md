## 2026-02-14 - Map Component Optimization & Synchronization

**Learning:** Clearning and re-creating Leaflet markers on every data update is expensive and causes DOM churn. Additionally, Leaflet initialization is prone to race conditions in React (Strict Mode/HMR), leading to "Map container is already initialized" errors.
**Action:** Use in-place marker synchronization (update existing markers via Ref Map) and $O(N+M)$ pre-calculation for location-based data. Always include idempotent guards (checking `mapInstance.current`) after asynchronous operations in `initMap`.
