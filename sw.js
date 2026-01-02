const CACHE_NAME = 'attendance-tracker-v4';

const assets = [
  './',             // Add this to cache the default home path
  './index.html',
  './attendance-chart.html',
  './manifest.json',
  './data/time-table.js',
  './data-at/subject.js',
  './favicon_io/android-chrome-192x192.png',
  './favicon_io/android-chrome-512x512.png',
  './favicon_io/apple-touch-icon.png',
  './favicon_io/favicon-32x32.png',
  './favicon_io/favicon-16x16.png',
  './favicon_io/favicon.ico',
  './script/time-table-at.js',
  './script/time-table.js',
  './styles/main-styles/footer.css',
  './styles/main-styles/header.css',
  './styles/main-styles/main.css',
  './styles/main-styles/sidebar.css',
  './styles/main-styles-at/main.css',
  './styles/general.css',
  './Images/arrow-top.png',
  './Images/close.png',
  './Images/github-icon.webp',
  './Images/logo.png',
  './Images/mail.png',
  './Images/menu.png',
  './Images/profile-photo.png',
  './Images/right-arrow.png',
  './Images/Header-logo-removebg-preview.png',
  './Images/og-preview.png'
];

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      // Use "allSettled" style approach: if one image is missing, 
      // the whole cache won't fail to install.
      return cache.addAll(assets).catch(err => console.error("Cache addAll failed:", err));
    })
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME)
            .map((key) => caches.delete(key))
      );
    })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cacheRes) => {
      return cacheRes || fetch(event.request);
    })
  );
});