## 2026-02-20 - Map Rendering Optimization

**Learning:** High-frequency Leaflet updates in React can cause O(N\*M) bottlenecks and excessive DOM churn if markers are recreated or updated without dirty checking. Dynamic map initialization also suffers from race conditions in React Strict Mode.
**Action:** Use Map-based pre-calculations (O(N+M)) for occupancy counts. Implement "dirty checking" on marker instances (e.g., `__visualState`) to skip redundant `setIcon` calls. Use an `isMounted` guard and double-checks for asynchronous map initialization to prevent duplicate map instances and "Map container is already initialized" errors.
