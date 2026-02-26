self.addEventListener('install', (e) => {
    console.log('Blokie Corporate Service Worker: Active');
});

self.addEventListener('fetch', (event) => {
    event.respondWith(fetch(event.request));
});
