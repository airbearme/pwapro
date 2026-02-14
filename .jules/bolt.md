# Bolt's Performance Journal

## 2025-05-15 - [CI-Build Dependency for Performance Tools]
**Learning:** Performance analysis tools like `codemaps:generate` in this repository trigger a full `next build`. This means mandatory environment variables defined in `lib/env.ts` must be present and satisfy Zod validation even in CI environments that don't need real credentials.
**Action:** Always provide placeholder environment variables (with valid formats like `eyJ...` for JWTs) in CI workflows that run build-dependent analysis tools.

## 2025-05-15 - [Efficient Map Synchronization]
**Learning:** React-Leaflet integration often suffers from "stale closure" or "re-initialization storm" when props change. Using a `Map` of markers in a `ref` allows for in-place updates (O(N+M)) instead of full removal/re-addition, significantly reducing layout thrashing on high-frequency updates.
**Action:** Use `markersRef.current.get(id)` to update existing markers instead of clearing the whole layer on every prop change.
