## 2026-03-01 - Optimizing Leaflet Marker Rendering in React

**Learning:** Re-creating Leaflet marker instances on every real-time update causes massive DOM thrashing and CPU spikes. The `setIcon` call is also surprisingly expensive if the icon HTML hasn't changed. Consolidating CSS animations into a single `<style>` block prevents redundant style tags from being injected into the DOM for every marker.

**Action:** Always use a `markersRef` Map to reuse marker instances and implement "dirty checking" on icons and popups. Use a single managed `<style>` block for shared animations instead of embedding them in `divIcon` HTML.
