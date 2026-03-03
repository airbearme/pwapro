## 2025-03-24 - Efficient Map Updates
**Learning:** Clearing and re-adding all Leaflet markers on every state update causes O(N) DOM thrashing and noticeable jank during real-time GPS updates. In-place updates using `setLatLng` and `setIcon` combined with "dirty checking" of non-geometric properties (like popup content or icon state) reduces overhead to O(1) for existing markers.
**Action:** Always use a `markersRef` Map to track instances and perform incremental updates in Leaflet/React integrations.
