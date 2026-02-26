self.addEventListener('install', () => console.log("Service Worker Active"));
self.addEventListener('fetch', (e) => e.respondWith(fetch(e.request)));
