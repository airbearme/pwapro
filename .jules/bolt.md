## 2025-01-24 - Efficient Leaflet Marker Management in React
**Learning:** Leaflet markers in React should be persisted in a `useRef` Map and updated using `setIcon` and `setLatLng` rather than being destroyed and recreated. Redundant CSS animations injected via inline `<style>` tags in marker HTML can cause excessive DOM churn; offloading these to global CSS classes is significantly more efficient.
**Action:** Use a `markersRef` Map for O(1) lookup of existing Leaflet instances and O(N+M) cleanup with Sets. Move animations to `app/globals.css`.
