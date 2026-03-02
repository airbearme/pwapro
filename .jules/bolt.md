## 2025-05-14 - Map Marker DOM Thrashing
**Learning:** In Leaflet-based React components, calling `layerGroup.clearLayers()` and re-adding markers on every prop update causes O(N) DOM thrashing and excessive CSS parsing if using `divIcon` with inline styles.
**Action:** Use a `Map` to track marker instances and update them in-place using `setLatLng` and `setIcon`. Implement "dirty checking" on marker instances to skip expensive Leaflet calls if the data haven't changed.

## 2025-05-14 - Leaflet Race Condition in React
**Learning:** Asynchronous map initialization in `useEffect` can lead to "Map container is already initialized" errors if the component re-renders or mounts/unmounts rapidly (e.g., during Strict Mode or HMR).
**Action:** Use an `isInitializingRef` boolean guard in addition to `mapInstanceRef` to prevent concurrent initialization attempts.
