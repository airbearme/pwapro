## 2026-01-09 - [Optimizing Map Markers in Leaflet/React]
**Learning:** Leaflet markers with complex `divIcon` HTML and inline `<style>` tags can cause significant DOM bloat and performance degradation, especially when synchronized with real-time data that causes frequent re-renders. Synchronizing markers by updating existing instances instead of destroying/recreating them, combined with global CSS animations, significantly improves performance.
**Action:** Always prefer synchronizing Leaflet markers via a ref Map and using global CSS classes for animations.
