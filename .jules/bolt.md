## 2025-10-25 - Optimized Map Marker Animations
**Learning:** Repetitive inline `<style>` tags with `@keyframes` in dynamic HTML (like Leaflet `divIcon`) cause excessive DOM weight and style parsing overhead. Moving these to global CSS and using animation names or classes is a simple but effective optimization.
**Action:** Always check for embedded styles in components that render many items (lists, maps) and move them to global CSS or specialized style sheets.
