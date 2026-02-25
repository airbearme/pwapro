## 2026-02-25 - Leaflet Marker Optimization
**Learning:** Calling Leaflet's `setIcon` on every real-time update is extremely expensive as it triggers DOM re-renders. Separating "icon visual state" from "popup data state" allows skipping `setIcon` when only metadata (like battery percentage) changes, while still keeping the UI reactive.
**Action:** Always implement multi-tier dirty checking for map markers: one for the icon/visual representation and one for the popup/metadata content.
