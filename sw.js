/* 40k Caddie offline support. Built by tools: the version below changes with every release. */
const VERSION = '69';
const CACHE = 'caddie-' + VERSION;
const SHELL = ["./", "index.html", "manifest.webmanifest", "vendor/supabase-2.118.0.js", "vendor/qrcode-1.4.4.js", "sb.js?v=69", "lib-v15.js?v=69", "footfall.js?v=69", "data.js?v=69", "foes.js?v=69", "app.js?v=69", "icons/icon-192.png", "icons/icon-512.png", "lib/pmw1pnlv2scy0.webp", "lib/pmw1pnlwg6o3e.webp", "lib/pmw1pnlxaucuy.webp", "lib/pmw1pnlxyvpw4.webp", "lib/pmw1pnlyc6ou3.webp", "lib/pmw1pnlzjmyjv.webp", "lib/pmw1pnm05z7g1.webp", "lib/pmw1pnm12166t.webp", "lib/pmw1pnm1jlet1.webp", "lib/pmw1pnm2ta186.webp", "lib/pmw1pnm3cg6y7.webp", "lib/pmw1pnm4caaiz.webp", "lib/pmw1pnm5oey0p.webp", "lib/pmw1pnm626ka7.webp", "lib/pmw1pnm75wum8.webp", "lib/pmw1pnm7rp5cr.webp", "lib/pmw1pnm886yxr.webp", "lib/pmw1pnm8nufit.webp", "lib/pmw1pnm93u6bb.webp", "lib/pmw1pnm9icdzq.webp", "lib/pmw1pnm9v72yo.webp", "lib/pmw1pnma7z7hm.webp", "lib/pmw1pnmaz964k.webp", "lib/pmw1pnmbop0n8.webp", "lib/pmw1pnmcuoho3.webp", "lib/pmw1pos5jkstg.webp", "lib/pmw1px3m2krt3.webp", "lib/pmw1px3me826u.webp", "lib/pmw1px3n4fq7j.webp", "lib/pmw1px3npoi4b.webp", "lib/pmw1px3o71xc9.webp", "lib/pmw1px3ovdw26.webp", "lib/pmw1px3pie0qi.webp", "lib/pmw1px3qdjz6h.webp", "lib/pmw1q08z91bks.webp", "lib/pmw1qfyx7z742.webp", "lib/pmw1ql7o8svvb.webp", "lib/pmw1ql7pphz8u.webp", "lib/pmw1ql7q3ot4d.webp", "lib/pmw1ql7qze83p.webp", "lib/pmw1ql7rgrm1j.webp", "lib/pmw1ql7s33sxx.webp", "lib/pmw1ql7sz2xnu.webp", "lib/pmw448fvcywmg.webp", "lib/pmw44ylryiehl.webp", "lib/pmw46rzlpfpf0.webp", "lib/pmw46rzmczxcr.webp", "lib/pmw46rznh9rz3.webp", "lib/pmw46rzoo1pwy.webp", "lib/pmw46rzp7wdiv.webp", "lib/pmw46rzr62f1h.webp", "lib/pmw46rzse7xoj.webp", "lib/pmw46rzt7dmqu.webp", "lib/pmw46rzv47jaj.webp", "lib/pmw46rzwpxcex.webp", "lib/pmwael1.webp", "lib/pmwael2.webp", "lib/pmwael3.webp", "lib/pmwael4.webp", "lib/pmwdaglas1.webp", "lib/pmwdaglas2.webp", "lib/pmwdaglas3.webp", "lib/pmwdw1.webp", "lib/pmwdw2.webp", "lib/pmwdw3.webp", "lib/pmwdw4.webp", "lib/pmwdw5.webp", "lib/pmwfoot1.webp", "lib/pmwfoot2.webp", "lib/pmwnec1.webp", "lib/pmwnec2.webp", "lib/pmwnec3.webp", "lib/pmwnec4.webp", "lib/pmwship0aeld.webp", "lib/pmwship0carc.webp", "lib/pmwship0druk.webp", "lib/pmwship0necr.webp", "lib/pmwship0tyra.webp", "lib/pmwtmpl1.webp", "lib/pmwtmpl2.webp", "lib/pmwtmpl3.webp", "lib/pmwtmpl4.webp", "lib/pmwtmpl5.webp", "lib/pmwtmpl6.webp", "lib/pmwtmpl7.webp", "lib/pmwtmpl8.webp", "lib/pmwwolf1.webp", "lib/pmwwolf2.webp", "lib/pmwwolf3.webp", "lib/pmwwolf4.webp"];

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
  if (req.mode === 'navigate' || (same && /(rules-status|footfall\/index|footfall\/meta)\.json$/.test(url.pathname))) {
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
