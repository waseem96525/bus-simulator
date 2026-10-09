// Service Worker for Bus Simulator PWA
const CACHE_NAME='bus-simulator-v2';
const urlsToCache=[
  '/',
  '/index.html',
  '/manifest.json',
  // Add other static assets if needed
];

self.addEventListener('install',event=>{
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache=>{
      return cache.addAll(urlsToCache);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate',event=>{
  event.waitUntil(
    caches.keys().then(cacheNames=>{
      return Promise.all(
        cacheNames.map(cacheName=>{
          if(cacheName!==CACHE_NAME){
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch',event=>{
  event.respondWith(
    caches.match(event.request).then(response=>{
      if(response){
        return response;
      }
      return fetch(event.request);
    })
  );
});