/* Complete release snapshots: never replace the engine underneath a running battle. */
'use strict';
importScripts('./offline-files.js');
const PREFIX='babar-offline:'+self.registration.scope+':';
const CACHE=PREFIX+self.OFFLINE_RELEASE;
self.addEventListener('install',event=>{
  event.waitUntil((async()=>{
    const cache=await caches.open(CACHE);
    // addAll is atomic: a failed download never leaves a usable partial release.
    await cache.addAll(self.OFFLINE_FILES.map(file=>new Request(new URL(file,self.registration.scope),{cache:'reload'})));
  })());
  // No skipWaiting: an update waits until all old game windows have closed.
});
self.addEventListener('activate',event=>{
  event.waitUntil((async()=>{
    for(const key of await caches.keys())if(key.startsWith(PREFIX)&&key!==CACHE)await caches.delete(key);
  })());
  // No clients.claim: an already-loaded network page keeps its original resources.
});
self.addEventListener('fetch',event=>{
  const request=event.request,url=new URL(request.url),scope=new URL(self.registration.scope);
  if(request.method!=='GET'||url.origin!==scope.origin||!url.pathname.startsWith(scope.pathname))return;
  event.respondWith((async()=>{
    const cache=await caches.open(CACHE);
    // Old query-string asset revisions belong to this tab's complete release.
    if(url.pathname===scope.pathname)url.pathname+='index.html';
    const cached=await cache.match(url.href,{ignoreSearch:true});
    if(cached)return cached;
    return fetch(request);
  })());
});
