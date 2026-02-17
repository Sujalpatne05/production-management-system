/* Service worker - Disabled in development */

// Immediately unregister on localhost (development environment)
self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    (async () => {
      // Clear all caches on install
      const cacheNames = await caches.keys();
      await Promise.all(cacheNames.map((name) => caches.delete(name)));
      await self.registration.unregister();
    })()
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      // Clear all caches
      const cacheNames = await caches.keys();
      await Promise.all(cacheNames.map((name) => caches.delete(name)));
      
      // Unregister immediately
      await self.registration.unregister();
    })()
  );
});

self.addEventListener('fetch', (event) => {
  // Never cache, always fetch fresh
  event.respondWith(fetch(event.request));
});
