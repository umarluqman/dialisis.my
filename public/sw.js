self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open("dialisis-my-v1").then((cache) => {
      return cache.addAll([
        "/",
        "/offline.html",
        "/favicon.ico",
        "/favicon.svg",
        "/favicon-96x96.png",
        "/apple-touch-icon.png",
        "/web-app-manifest-192x192.png",
        "/web-app-manifest-512x512.png",
      ]);
    })
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return (
        response ||
        fetch(event.request).catch(() => {
          return caches.match("/offline.html");
        })
      );
    })
  );
});
