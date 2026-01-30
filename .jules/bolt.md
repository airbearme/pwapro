## 2026-01-30 - [Map Marker Animation Optimization]
**Learning:** Redundant `@keyframes` declarations in inline marker styles for Leaflet (using `L.divIcon`) significantly bloat the DOM as they are duplicated for every single data point on the map.
**Action:** Extract repetitive animations into global CSS and use CSS classes for markers instead of injecting `<style>` blocks into the DOM for each marker.
