// Service Worker for Bus Simulator PWA
const CACHE_NAME='bus-simulator-v3';
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
  if(event.request.method!=='GET'||new URL(event.request.url).origin!==self.location.origin)return;
  event.respondWith(
    fetch(event.request,{cache:'no-cache'}).then(response=>{
      if(response.ok){
        const copy=response.clone();
        caches.open(CACHE_NAME).then(cache=>cache.put(event.request,copy));
      }
      return response;
    }).catch(()=>caches.match(event.request).then(response=>response||Response.error()))
  );
});