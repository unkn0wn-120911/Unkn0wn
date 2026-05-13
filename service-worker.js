const CACHE = 'ukn0wn-v1';
const ASSETS = [
  '/', '/index.html', '/css/style.css',
  '/js/app.js', '/js/router.js', '/js/main.js', '/js/ui-effects.js',
  '/js/tools/hash-generator.js', '/js/tools/base64-hex.js',
  '/js/tools/headers-checker.js', '/js/tools/jwt-debugger.js',
  '/js/tools/scientific-calculator.js', '/js/tools/cve-lookup.js'
];
self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)));
});
self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(r => r || fetch(e.request).then(res => {
      return caches.open(CACHE).then(c => { c.put(e.request, res.clone()); return res; });
    }).catch(() => caches.match('/index.html')))
  );
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))));
});
