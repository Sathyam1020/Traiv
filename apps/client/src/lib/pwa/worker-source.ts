// Development deliberately has no fetch handler. Installing this replacement also
// replaces fetch-intercepting workers from older builds without disabling push.
const developmentWorker = `
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", event => {
  event.waitUntil((async () => {
    await Promise.all((await caches.keys()).filter(key => key.startsWith("traiv-offline-")).map(key => caches.delete(key)));
    await self.clients.claim();
    const windows = await self.clients.matchAll({ type: "window", includeUncontrolled: true });
    await Promise.all(windows.map(client => client.navigate(client.url)));
  })());
});
`;

const productionWorker = `
/* No API or health-data caching. Only an offline navigation fallback and push delivery.
   No unconditional skipWaiting here: a new version installs and waits — it never takes
   over a page that's mid-workout with unsynced writes on its own. The page decides when
   it's safe and asks for it explicitly via postMessage({ type: "SKIP_WAITING" }); see
   sw-update.ts. */
self.addEventListener("install", event => { event.waitUntil(caches.open("traiv-offline-v2").then(cache => cache.add("/offline.html"))); });
self.addEventListener("activate", event => { event.waitUntil(self.clients.claim()); });
self.addEventListener("fetch", event => { if (event.request.mode === "navigate") event.respondWith(fetch(event.request).catch(() => caches.match("/offline.html"))); });
self.addEventListener("message", event => { if (event.data && event.data.type === "SKIP_WAITING") self.skipWaiting(); });

`;

const pushWorker = `
self.addEventListener("push", event => { let data = {}; try { data = event.data?.json() ?? {}; } catch {} const url = typeof data.url === "string" && data.url.startsWith("/") && !data.url.startsWith("//") ? data.url : "/you"; event.waitUntil(self.registration.showNotification(data.title || "Traiv", { body:data.body || "You have an update.",icon:"/icon-192.png",badge:"/icon-192.png",data:{url} })); });
self.addEventListener("notificationclick", event => { event.notification.close(); event.waitUntil(self.clients.openWindow(event.notification.data?.url || "/you")); });
`;

export function workerSource(development: boolean): string {
  return (development ? developmentWorker : productionWorker) + pushWorker;
}
