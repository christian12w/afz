// Minimal Service Worker for AFZ Advocacy
// Provides basic lifecycle handling and supports SKIP_WAITING messages

const SW_VERSION = 'afz-sw-v2';

self.addEventListener('install', (event) => {
    // Activate new SW immediately
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    // Take control of uncontrolled clients as soon as possible
    event.waitUntil((async () => {
        await self.clients.claim();
        // Notify all clients to reload so they fetch latest assets (CSS/JS)
        const clients = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
        for (const client of clients) {
            client.postMessage({ type: 'FORCE_RELOAD', message: `SW ${SW_VERSION} activated` });
        }
    })());
});

// Support messages from the page
self.addEventListener('message', (event) => {
    const data = event.data || {};
    if (data && data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
});

// Pass-through fetch handler (no caching by default)
self.addEventListener('fetch', (event) => {
    event.respondWith(fetch(event.request).catch(() => fetch(event.request)));
});

