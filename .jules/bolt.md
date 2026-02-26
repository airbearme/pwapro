## 2025-05-15 - Leaflet Marker Optimization
**Learning:** Leaflet's `setIcon` is significantly more expensive than updating marker position or popup content because it triggers DOM node replacement. In high-frequency real-time updates (like GPS tracking), calling `setIcon` on every frame causes visible flickering and CPU spikes.
**Action:** Implement "dirty checking" on marker instances by storing the last applied icon state. Only call `setIcon` when the visual state (e.g., availability color) actually changes. Use a separate hash for popup content to decouple UI updates from icon state.
