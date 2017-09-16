var cacheStorageKey = 'minimal-pwa-1'
var cacheList = [
    '/',
    'index.html',
    'main.css',
    'logo.png'
]
self.addEventListener('install', function(e) {
    e.waitUntil(
        caches.open(cacheStorageKey).then(function(cache) {
            return cache.addAll(cacheList)
        }).then(function() {
            return self.skipWaiting()
        })
    )
})

self.addEventListener('fetch', function(e) {
    e.respondWith(
        caches.match(e.request).then(function(response) {
            if (response != null) {
                return response
            }
            return fetch(e.request.url)
        })
    )
})

self.addEventListener('active', function(e) {
    e.waitUtil(
        Promise.all(
            caches.keys().then(cacheNames => {
                return cacheNames.map(name => {
                    if (name !== cacheStorageKey) {
                        return caches.delete(name)
                    }
                })
            })
        ).then(() => {
            return self.clients.claim()
        })
    )
})