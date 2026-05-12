const CACHE_NAME = 'ez-picnote-v1.0.0';
const urlsToCache = [
  './',
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png'
];

// 安裝時，把所有必備檔案打包放進快取倉庫
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache);
      })
  );
});

// 啟動時，清理掉舊版本的快取倉庫
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// 當網頁發出請求時，如果沒網路，就從快取倉庫拿東西出來給它
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // 如果倉庫有，就直接給倉庫的；如果沒有，再去網路拿
        return response || fetch(event.request);
      })
  );
});