self.addEventListener('install', () => console.log("Blokie Installed"));
self.addEventListener('fetch', (e) => e.respondWith(fetch(e.request)));
