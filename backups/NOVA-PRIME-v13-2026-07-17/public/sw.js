// Self-unregistering service worker
// This removes any old service worker and does NOT register a new one
self.addEventListener('install', function(event) {
  self.skipWaiting()
})

self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(names) {
      return Promise.all(names.map(function(name) { return caches.delete(name) }))
    }).then(function() {
      return self.clients.matchAll()
    }).then(function(clients) {
      clients.forEach(function(client) { client.navigate(client.url) })
      return self.registration.unregister()
    })
  )
})

self.addEventListener('fetch', function(event) {
  event.respondWith(fetch(event.request))
})
