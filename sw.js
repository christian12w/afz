// Minimal Service Worker for AFZ Advocacy
// Provides basic lifecycle handling and supports SKIP_WAITING messages

const SW_VERSION = 'afz-sw-v1';

self.addEventListener('install', (event) => {
    // Activate new SW immediately
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    // Take control of uncontrolled clients as soon as possible
    event.waitUntil(self.clients.claim());
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

