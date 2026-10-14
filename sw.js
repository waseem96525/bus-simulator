// Service Worker for Bus Simulator PWA
const CACHE_NAME='bus-simulator-v4';
const CDN_CACHE='bus-simulator-cdn-v1';
const CDN_HOSTS=['cdnjs.cloudflare.com','cdn.jsdelivr.net','fonts.googleapis.com','fonts.gstatic.com'];
const urlsToCache=[
  '/',
  '/index.html',
  '/tailwind.css',
  '/manifest.json',
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
          if(cacheName!==CACHE_NAME&&cacheName!==CDN_CACHE){
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch',event=>{
  if(event.request.method!=='GET')return;
  const url=new URL(event.request.url);

  // Versioned CDN libraries and fonts: serve from cache first so repeat loads skip the network.
  if(CDN_HOSTS.includes(url.hostname)){
    event.respondWith(
      caches.open(CDN_CACHE).then(cache=>cache.match(event.request).then(cached=>{
        const network=fetch(event.request).then(response=>{
          if(response.ok||response.type==='opaque')cache.put(event.request,response.clone());
          return response;
        });
        return cached||network;
      }))
    );
    return;
  }

  if(url.origin!==self.location.origin)return;
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
