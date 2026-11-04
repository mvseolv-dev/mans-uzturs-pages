const CACHE = 'mans-uzturs-v21';
const FILES = ['./','./index.html','./styles.css','./fitness.css','./active-v2.css','./active-v2.js','./planner.css','./planner.js','./fitness.js','./app.js','./data.js','./manifest.webmanifest','./icon.svg','./icon-192.png','./icon-512.png','./assets/exercises/reverse-start.webp','./assets/exercises/reverse-peak.webp','./assets/exercises/push-start.webp','./assets/exercises/push-peak.webp','./assets/exercises/rdl-start.webp','./assets/exercises/rdl-peak.webp','./assets/exercises/bulgarian-start.webp','./assets/exercises/bulgarian-peak.webp','./assets/exercises/sideplank-main.webp','./assets/exercises/lateral-start.webp','./assets/exercises/lateral-peak.webp','./assets/exercises/calf-start.webp','./assets/exercises/calf-peak.webp','./assets/exercises/planktap-main.webp','./assets/exercises/deadbug-start.webp','./assets/exercises/deadbug-peak.webp','./assets/exercises/ankle-main.webp','./assets/exercises/hips-main.webp'];
self.addEventListener('install', event => event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(FILES)).then(() => self.skipWaiting())));
self.addEventListener('activate', event => event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(key => key !== CACHE).map(key => caches.delete(key)))).then(() => self.clients.claim())));
self.addEventListener('fetch', event => {
 if(event.request.method !== 'GET' || new URL(event.request.url).origin !== self.location.origin) return;
 event.respondWith(fetch(event.request).then(response => {
  if(response.ok){const copy=response.clone();event.waitUntil(caches.open(CACHE).then(cache => cache.put(event.request,copy)));}
  return response;
 }).catch(() => caches.match(event.request)));
});
