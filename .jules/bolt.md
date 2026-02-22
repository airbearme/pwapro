## 2026-02-22 - MapView Marker Reconciliation & Hardened CI

**Learning:** Recreating all markers on every update in Leaflet is O(N) and causes UI stutter. Marker reconciliation with dirty checking allows O(1) updates per change. Also, CI pipelines using `npm run verify` can fail if jobs aren't properly sequenced (e.g., validate before generate) or if they try to check the whole repo instead of changed files in a PR.

**Action:** Implement marker reconciliation with visual state tracking on marker instances. Use `React.memo` and `useCallback` to stabilize the component. Fix CI workflow order and implement incremental checks for PRs to prevent unrelated legacy issues from blocking progress.
