## 2026-01-09 - Optimized MapView Real-time Updates
**Learning:** Leaflet's `setIcon` is significantly more expensive than `setLatLng` or `setPopupContent` because it frequently triggers DOM re-renders of the marker element. Multi-tier dirty checking (separating visual state from data state) allows skipping `setIcon` while still updating popups.
**Action:** Use a `markersRef` Map for marker recycling and implement dirty checking for `iconState` and `dataHash` in all high-frequency map components.
