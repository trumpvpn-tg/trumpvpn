
var CACHE = 'tvpn-v2';
var PRECACHE = ['./', './manifest.json'];

self.addEventListener('install', function(e) {
  e.waitUntil(
    caches.open(CACHE).then(function(c) {
      return c.addAll(PRECACHE);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', function(e) {
  e.waitUntil(
    caches.keys().then(function(keys) {
      return Promise.all(
        keys.filter(function(k) {
          return k.startsWith('tvpn-') && k !== CACHE;
        }).map(function(k) {
          return caches.delete(k);
        })
      );
    }).then(function() {
      return self.clients.claim();
    })
  );
});

self.addEventListener('fetch', function(e) {
  if (e.request.url.includes('/api/')) return;

  e.respondWith(
    fetch(e.request, { cache: 'no-store' }).catch(function() {
      return caches.match(e.request);
    })
  );
});
