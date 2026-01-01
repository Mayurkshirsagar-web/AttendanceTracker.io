const CACHE_NAME = 'attendance-tracker-v1';

// All the assets from your folders shown in the screenshots
const assets = [
  './index.html',
  './attendance-chart.html',
  './manifest.json',
  
  // Data Folders
  './data/time-table.js',
  './data-at/subject.js',
  
  // Favicons
  './favicon_io/android-chrome-192x192.png',
  './favicon_io/android-chrome-512x512.png',
  './favicon_io/apple-touch-icon.png',
  './favicon_io/favicon-32x32.png',
  './favicon_io/favicon-16x16.png',
  
  // Scripts
  './script/time-table-at.js',
  './script/time-table.js',
  
  // Styles (main-styles)
  './styles/main-styles/footer.css',
  './styles/main-styles/header.css',
  './styles/main-styles/main.css',
  './styles/main-styles/sidebar.css',
  
  // Styles (main-styles-at)
  './styles/main-styles-at/main.css',
  './styles/general.css',
  
  // Images
  './Images/arrow-top.png',
  './Images/close.png',
  './Images/github-icon.webp',
  './Images/logo.png',
  './Images/mail.png',
  './Images/menu.png',
  './Images/profile-photo.png',
  './Images/right-arrow.png'
];

// Install Service Worker and cache all assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Caching all app folders and assets');
      return cache.addAll(assets);
    })
  );
});

// Activate and clean up old caches
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

// Fetch assets from cache when offline
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cacheRes) => {
      return cacheRes || fetch(event.request);
    })
  );
});