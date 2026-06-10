/* ════════════════════════════════════════════════════════
   漫打卡 Manda — Service Worker 最終版（版本無關設計）
   ⚠️ 本檔案自 v1.46 起毋須再隨版本更新，永久不用動。
   部署新版本時只需更新 index.html，並把其中的
   navigator.serviceWorker.register('./sw.js?v=新版號') 版號改掉即可。
   策略：
   - HTML／導覽請求 → 先給快取秒開、背景抓新版（stale-while-revalidate）
     使用者最多落後一次開啟，永遠自我修復，不會卡死在舊版。
   - 靜態資源（圖示／字型）→ 快取優先，背景補新。
   - GA4／Formspree／Firestore → 不攔截不快取。
   版權所有 © 2026 謙謙爸 (Jerry). All Rights Reserved. */

var CACHE = 'manda-swr-v1';
var ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './icons/icon-192.png',
  './icons/icon-512.png'
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

/* 啟動：清除所有舊命名快取 */
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

/* 攔截請求 */
self.addEventListener('fetch', function(e){
  if(e.request.method !== 'GET') return;
  var url = e.request.url;

  /* 分析與外部 API：不攔截 */
  if(url.includes('google-analytics') ||
     url.includes('googletagmanager') ||
     url.includes('formspree') ||
     url.includes('firestore')){
    return;
  }

  /* HTML／導覽請求：先給快取秒開，背景更新（stale-while-revalidate） */
  if(e.request.mode === 'navigate' || url.indexOf('index.html') > -1){
    e.respondWith(
      caches.open(CACHE).then(function(c){
        return c.match('./index.html').then(function(cached){
          var net = fetch('./index.html').then(function(res){
            if(res && res.status === 200){
              c.put('./index.html', res.clone());
            }
            return res;
          }).catch(function(){ return cached; });
          return cached || net;
        });
      })
    );
    return;
  }

  /* 其他資源：快取優先，背景補新 */
  e.respondWith(
    caches.open(CACHE).then(function(c){
      return c.match(e.request).then(function(cached){
        var net = fetch(e.request).then(function(res){
          if(res && res.status === 200 &&
             (url.indexOf(self.location.origin) === 0 || url.indexOf('fonts.g') > -1)){
            c.put(e.request, res.clone());
          }
          return res;
        }).catch(function(){ return cached; });
        return cached || net;
      });
    })
  );
});
