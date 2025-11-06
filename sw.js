const CACHE_NAME = 'camara-pwa-v1';
const urlsToCache = [
  '/pwa-camera/',
  '/pwa-camera/index.html',
  '/pwa-camera/app.js',
  '/pwa-camera/manifest.json'
];



// Instalar Service Worker
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('📦 Archivos cacheados');
      return cache.addAll(urlsToCache);
    })
  );
});

// Activar Service Worker y limpiar cachés viejos
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) {
            console.log('🧹 Eliminando caché viejo:', key);
            return caches.delete(key);
          }
        })
      )
    )
  );
});

// Estrategia Cache First
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});
