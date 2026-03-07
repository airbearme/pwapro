# Bolt's Performance Journal

## 2025-05-15 - Initial Journal Creation
**Learning:** Starting the performance optimization mission.
**Action:** Created journal to track critical performance learnings.

## 2026-03-07 - Leaflet Marker Optimization
**Learning:** Leaflet's `setIcon` is a very expensive DOM operation that re-renders the entire marker template. During high-frequency real-time updates (like vehicle tracking), calling `setIcon` on every location update causes significant main-thread jank.
**Action:** Implement "dirty checking" for icons. Store the visual state (e.g., `is_available`) on the marker instance and only call `setIcon` when that specific state changes. Use `setLatLng` for high-frequency position updates as it is much cheaper.
