/* 漫打卡 Service Worker v1.41 */
var CACHE = 'manda-v1.41';
var ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './icons/icon-192.png',
  './icons/icon-512.png',
  'https://fonts.googleapis.com/css2?family=Noto+Serif+TC:wght@400;500;600;700;900&family=Noto+Sans+TC:wght@300;400;500;700&display=swap'
];

/* 安裝：預快取核心資源 */
self.addEventListener('install', function(e){
  e.waitUntil(
    caches.open(CACHE).then(function(c){
      return c.addAll(ASSETS);
    })
  );
  self.skipWaiting();
});

/* 啟動：清除舊版快取 */
self.addEventListener('activate', function(e){
  e.waitUntil(
    caches.keys().then(function(keys){
      return Promise.all(
        keys.filter(function(k){ return k !== CACHE; })
            .map(function(k){ return caches.delete(k); })
      );
    })
  );
  self.clients.claim();
});

/* 攔截請求：快取優先，失敗時回退網路 */
self.addEventListener('fetch', function(e){
  /* GA4 與外部 API 不快取 */
  if(e.request.url.includes('google-analytics') ||
     e.request.url.includes('googletagmanager') ||
     e.request.url.includes('firestore')){
    return;
  }
  e.respondWith(
    caches.match(e.request).then(function(cached){
      if(cached) return cached;
      return fetch(e.request).then(function(res){
        /* 只快取同源資源與字型 */
        if(res && res.status === 200 &&
           (e.request.url.startsWith(self.location.origin) ||
            e.request.url.includes('fonts.g'))){
          var clone = res.clone();
          caches.open(CACHE).then(function(c){ c.put(e.request, clone); });
        }
        return res;
      }).catch(function(){
        /* 離線時回傳主頁 */
        if(e.request.mode === 'navigate'){
          return caches.match('./index.html');
        }
      });
    })
  );
});
