// Service worker temporarily disabled to fix caching issues
// Will be re-enabled after deployment fixes

self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  // Clear all caches to fix 404 errors
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          return caches.delete(cacheName);
        }),
      );
    }),
  );
});

// Remove all event listeners to prevent workbox errors
self.addEventListener("fetch", () => {
  // Let all requests go through without caching
  return;
});
