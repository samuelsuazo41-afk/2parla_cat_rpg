const CACHE_NAME = 'rpg_parla_cat_v2-v83';
const urlsToCache = [
  './',
  './index.html',
  './main.js',
  './styles.css',
  './manifest.json',
  './data/items.json',
  './data/capitols.json',
  './data/capitol_01_bcn_born.json',
  './data/capitol_02_girona.json',
  './data/capitol_03_fires_valencia.json',
  './data/ruta_rave_port_olympic.json',
  './data/ruta_girona_muralla_viva.json',
  './data/ruta_valencia_ciutat_vella.json',
  './data/biblioteca_emojis.json',
  './data/botiga_emojis.json',
  './data/categories_emoji.json',
  './data/minijoc_frases.json',
  './camisa_cenguera.png',
  './ram_roses_girona.png',
  './fuet_fires.png',
  './icon-192.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
      .catch(err => console.log('Cache failed:', err))
  );
  self.skipWaiting();
});

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
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        return response || fetch(event.request);
      })
  );
});
const CACHE_NAME = 'rpg_parla_cat_v2-v84';
const urlsToCache = [
  './',
  './index.html',
  './main.js',
  './styles.css',
  './manifest.json',
  
  // Data del juego
  './data/items.json',
  './data/capitols.json',
  './data/capitol_01_bcn_born.json',
  './data/capitol_02_girona.json',
  './data/capitol_03_fires_valencia.json',
  './data/ruta_rave_port_olympic.json',
  './data/ruta_girona_muralla_viva.json',
  './data/ruta_valencia_ciutat_vella.json',
  './data/biblioteca_emojis.json',
  './data/botiga_emojis.json',
  './data/categories_emoji.json',
  './data/minijoc_frases.json',
  
  // NUEVO: Leyendas
  './data/llegendes_barcelona.json',
  './data/llegendes_girona.json',
  './data/llegendes_valencia.json',
  
  // Assets
  './camisa_cenguera.png',
  './ram_roses_girona.png',
  './fuet_fires.png',
  './icon-192.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
      .catch(err => console.log('Cache failed:', err))
  );
  self.skipWaiting();
});

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
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        return response || fetch(event.request);
      })
  );
});