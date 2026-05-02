/* 彈性習慣 Service Worker v1.0 */
const CACHE = 'flexi-habit-v1';
const ASSETS = [
  './index.html',
  './manifest.json',
  './icons/icon-192.png',
  './icons/icon-512.png'
];

/* ── 安裝：預快取所有靜態資源 ── */
self.addEventListener('install', function(e) {
  e.waitUntil(
    caches.open(CACHE).then(function(cache) {
      return cache.addAll(ASSETS);
    })
  );
  self.skipWaiting();
});

/* ── 啟動：清除舊版快取 ── */
self.addEventListener('activate', function(e) {
  e.waitUntil(
    caches.keys().then(function(keys) {
      return Promise.all(
        keys.filter(function(k) { return k !== CACHE; })
            .map(function(k) { return caches.delete(k); })
      );
    })
  );
  self.clients.claim();
});

/* ── 攔截請求：Cache First，網路失敗也能離線使用 ── */
self.addEventListener('fetch', function(e) {
  /* 只處理同源請求，跳過 chrome-extension / data: 等 */
  if (!e.request.url.startsWith(self.location.origin)) return;

  e.respondWith(
    caches.match(e.request).then(function(cached) {
      if (cached) return cached;

      /* 快取中沒有 → 去網路抓，同時存入快取 */
      return fetch(e.request).then(function(response) {
        if (!response || response.status !== 200 || response.type !== 'basic') {
          return response;
        }
        var clone = response.clone();
        caches.open(CACHE).then(function(cache) {
          cache.put(e.request, clone);
        });
        return response;
      }).catch(function() {
        /* 網路失敗時回傳 index.html（讓 App 在離線狀態仍可顯示） */
        return caches.match('./index.html');
      });
    })
  );
});
