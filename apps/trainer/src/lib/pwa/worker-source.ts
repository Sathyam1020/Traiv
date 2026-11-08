// Development deliberately has no fetch handler — same reasoning as the client app's own
// worker (apps/client/src/lib/pwa/worker-source.ts): installing this replacement also
// replaces fetch-intercepting workers from older builds.
const developmentWorker = `
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", event => {
  event.waitUntil((async () => {
    await Promise.all((await caches.keys()).filter(key => key.startsWith("traiv-coach-offline-")).map(key => caches.delete(key)));
    await self.clients.claim();
    const windows = await self.clients.matchAll({ type: "window", includeUncontrolled: true });
    await Promise.all(windows.map(client => client.navigate(client.url)));
  })());
});
`;

const productionWorker = `
/* Installability only — no API caching, no push yet. Coaches don't have an offline
   workflow that needs it the way an in-progress workout does, so this stays proportional:
   an offline navigation fallback and nothing else. No unconditional skipWaiting, same
   reasoning as the client app — a new version waits until the app says it's safe. */
self.addEventListener("install", event => { event.waitUntil(caches.open("traiv-coach-offline-v1").then(cache => cache.add("/offline.html"))); });
self.addEventListener("activate", event => { event.waitUntil(self.clients.claim()); });
self.addEventListener("fetch", event => { if (event.request.mode === "navigate") event.respondWith(fetch(event.request).catch(() => caches.match("/offline.html"))); });
self.addEventListener("message", event => { if (event.data && event.data.type === "SKIP_WAITING") self.skipWaiting(); });
`;

export function workerSource(development: boolean): string {
  return development ? developmentWorker : productionWorker;
}
