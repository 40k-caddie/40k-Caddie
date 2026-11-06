/* 40k Caddie offline support. Built by tools: the version below changes with every release. */
const VERSION = '__VERSION__';
const CACHE = 'caddie-' + VERSION;
const SHELL = __SHELL__;

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(SHELL)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((k) => k.startsWith('caddie-') && k !== CACHE && k !== 'caddie-extra').map((k) => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', (e) => {
  const req = e.request; if (req.method !== 'GET') return;
  const url = new URL(req.url);
  // account storage and sign-in always go to the network
  if (/supabase\.co$/.test(url.hostname)) return;
  const same = url.origin === self.location.origin;
  // the page itself and the weekly rules result: newest when online, saved copy when not
  if (req.mode === 'navigate' || (same && /rules-status\.json$/.test(url.pathname))) {
    e.respondWith(fetch(req).then((r) => { const c = r.clone(); caches.open(CACHE).then((x) => x.put(same && req.mode === 'navigate' ? './' : req, c)); return r; })
      .catch(() => caches.match(req.mode === 'navigate' ? './' : req, { ignoreSearch: true })));
    return;
  }
  // everything else (app files, armies, images, fonts, map pictures): saved copy first, fetched and kept when new
  e.respondWith(caches.match(req).then((hit) => hit || fetch(req).then((r) => {
    if (r && (r.ok || r.type === 'opaque')) { const c = r.clone(); caches.open(same ? CACHE : 'caddie-extra').then((x) => x.put(req, c)); }
    return r;
  })));
});
