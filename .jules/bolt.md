## 2026-02-19 - [Map Marker Optimization]
**Learning:** Updating Leaflet marker icons via `setIcon` is expensive as it forces DOM re-renders. Minimizing these calls via "dirty checking" of visual states significantly improves performance during real-time updates.
**Action:** Always track the visual state of markers (e.g., via a `__visualState` property) and only call `setIcon` when that state actually changes. Update popup content independently using `setPopupContent`, which is cheaper.
