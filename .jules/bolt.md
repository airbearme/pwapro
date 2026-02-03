## 2025-01-24 - Map Marker Synchronization and CSS Animation Optimization
**Learning:** Recreating Leaflet markers on every state update is a major performance bottleneck for real-time maps. Leaflet is optimized for updating existing markers' positions and icons. Additionally, injecting large inline `<style>` tags for every marker adds significant DOM weight and parsing overhead.
**Action:** Use a `ref` Map to synchronize markers with data. Update existing markers instead of clearing and recreating them. Move animations to global CSS to reduce per-marker HTML weight.
