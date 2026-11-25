/* CPET Lab service worker: same-origin only.
   Bump CACHE (for example cpetlab-v2) every time you deploy changes. */
const CACHE = 'cpetlab-v1';
const ASSETS = [
  './',
  './index.html',
  './mobile.html',
  './core.js',
  './manifest.json',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/icon-maskable-512.png',
  './icons/apple-touch-icon-180.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE).then((c) => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  // Fonts and outbound links go straight to the network; offline, the system fonts take over.
  if (url.origin !== self.location.origin) return;

  // Pages: network first so updates arrive, cached copy when offline.
  if (req.mode === 'navigate') {
    const page = url.pathname.endsWith('mobile.html') ? './mobile.html' : './index.html';
    event.respondWith(
      fetch(req)
        .then((res) => { const copy = res.clone(); caches.open(CACHE).then((c) => c.put(page, copy)); return res; })
        .catch(() => caches.match(page))
    );
    return;
  }

  // Script, manifest, icons: cache first, then network.
  event.respondWith(
    caches.match(req, { ignoreSearch: true }).then((hit) =>
      hit || fetch(req).then((res) => { const copy = res.clone(); caches.open(CACHE).then((c) => c.put(req, copy)); return res; })
    )
  );
});
