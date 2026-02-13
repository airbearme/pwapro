# Bolt's Journal - Critical Learnings

## 2025-05-15 - Stable Callbacks in Leaflet Marker Synchronization
**Learning:** In `MapView`, syncing markers in-place is much faster than `clearLayers()` + `addLayer()`, but it introduces a stale closure risk for event listeners (e.g., `click`). Re-attaching listeners on every render defeats the performance gain of in-place updates.
**Action:** Use the "Ref Pattern" for Leaflet events: attach the listener once during marker creation, and have that listener access the latest props/state via a `useRef`. This keeps the Leaflet lifecycle independent of React's render cycle while ensuring callbacks always use fresh data.
