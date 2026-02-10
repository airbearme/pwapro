## 2026-02-10 - MapView Optimization

**Learning:** React components wrapping third-party imperative libraries (like Leaflet) are extremely sensitive to re-renders and full effect cycles. In-place marker synchronization is critical to avoid DOM churn and maintain high frame rates during real-time updates.
**Action:** Always prefer in-place updates (O(N+M) sync) over 'nuke and pave' (O(N\*M) recreation) for map markers and other imperative UI elements.
