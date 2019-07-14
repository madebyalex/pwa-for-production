var version = '1';
var cacheName = 'pwa-prod-' + version;
var appShellFilesToCache = [
    './',
    './index.html',
    './main.js',
    './polyfills.js',
    './styles.css',
    './runtime.js',
    './favicon.ico',
    './assets/icons/icon-512x512.png'
];

self.addEventListener('install', (event) => { 
    // console.log('[Service Worker]: Installed');

    event.waitUntil(
        caches.open(cacheName).then((cache) => {
            console.log('[Service Worker]: Caching App Shell');
            return cache.addAll(appShellFilesToCache);
        })
    );
});

self.addEventListener('activate', (event) => { 
    // console.log('[Service Worker]: Active');

    event.waitUntil(
        caches.keys().then((keyList) => {
            return Promise.all(keyList.map((key) => {

                if (key !== cacheName) {
                    console.log('[Service Worker]: Removing old cache', key);
                    return caches.delete(key);
                }
            }))
        })
    );
});

self.addEventListener('fetch', (event) => { 

    event.respondWith(
        caches.match(event.request).then((response) => {
            if (response) {
                console.log('[Service Worker]: returning ' + event.request.url + ' from cache');
                return response;
            
            } else {
                console.log('[Service Worker]: returning ' + event.request.url + ' from net');
                return fetch(event.request);
            }
    }));
});