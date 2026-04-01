const CACHE_NAME = "dozis-v2";

// Install: activate immediately
self.addEventListener("install", () => {
  self.skipWaiting();
});

// Activate: claim clients, clean old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((names) =>
      Promise.all(
        names
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      )
    ).then(() => self.clients.claim())
  );
});

// Fetch handler with per-request-type strategies
self.addEventListener("fetch", (event) => {
  const { request } = event;

  // Skip non-GET requests
  if (request.method !== "GET") return;

  // Never cache API requests
  if (request.url.includes("/api/")) return;

  // Static assets: cache-first
  if (
    request.destination === "script" ||
    request.destination === "style" ||
    request.destination === "font" ||
    request.destination === "image"
  ) {
    event.respondWith(cacheFirst(request));
    return;
  }

  // Navigation (HTML pages): network-first with 8s timeout (allows for cold starts)
  if (request.mode === "navigate") {
    event.respondWith(networkFirstWithTimeout(request, 8000));
    return;
  }

  // Everything else: network-first with cache fallback
  event.respondWith(networkFirstWithTimeout(request, 5000));
});

// Cache-first: serve from cache, fall back to network and cache
async function cacheFirst(request) {
  const cached = await caches.match(request);
  if (cached) return cached;

  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    return new Response("", { status: 503 });
  }
}

// Network-first with timeout: try network, fall back to cache
async function networkFirstWithTimeout(request, timeoutMs) {
  try {
    const response = await Promise.race([
      fetch(request),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error("timeout")), timeoutMs)
      ),
    ]);
    if (response.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    const cached = await caches.match(request);
    if (cached) return cached;
    return new Response("Offline", { status: 503, headers: { "Content-Type": "text/plain" } });
  }
}
