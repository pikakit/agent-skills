---
name: browser-cache
description: Client-side caching — Service Workers, Cache API, Workbox, offline strategies
---

# Browser & Service Worker Caching

> Client-side caching with Cache API, Service Workers, and offline strategies.

---

## Service Worker Cache Strategies

| Strategy | Description | Best For |
|----------|-------------|----------|
| Cache First | Check cache → fall back to network | Static assets, fonts |
| Network First | Try network → fall back to cache | Dynamic API data |
| Stale While Revalidate | Serve cache → update in background | Frequently updated content |
| Cache Only | Always from cache | Offline-first apps |
| Network Only | Always from network | Real-time data |

---

## Service Worker Implementation

### Registration

```typescript
// main.ts
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js');
  });
}
```

### Cache First (Static Assets)

```typescript
// sw.js
const CACHE_NAME = 'static-v1';
const STATIC_ASSETS = [
  '/',
  '/styles.css',
  '/app.js',
  '/offline.html',
];

// Pre-cache on install
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) =>
      cache.addAll(STATIC_ASSETS)
    )
  );
});

// Cache first strategy
self.addEventListener('fetch', (event) => {
  if (event.request.destination === 'image' ||
      event.request.destination === 'style' ||
      event.request.destination === 'script') {
    event.respondWith(
      caches.match(event.request).then((cached) =>
        cached || fetch(event.request).then((response) => {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) =>
            cache.put(event.request, clone)
          );
          return response;
        })
      )
    );
  }
});
```

### Stale While Revalidate (API)

```typescript
self.addEventListener('fetch', (event) => {
  if (event.request.url.includes('/api/')) {
    event.respondWith(
      caches.open('api-cache').then(async (cache) => {
        const cached = await cache.match(event.request);

        const fetchPromise = fetch(event.request).then((response) => {
          cache.put(event.request, response.clone());
          return response;
        });

        return cached || fetchPromise;
      })
    );
  }
});
```

### Cache Cleanup

```typescript
// Remove old caches on activate
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      )
    )
  );
});
```

---

## Workbox (Recommended Library)

```bash
npm install workbox-webpack-plugin  # or workbox-build
```

```typescript
import { precacheAndRoute } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import {
  CacheFirst,
  NetworkFirst,
  StaleWhileRevalidate,
} from 'workbox-strategies';
import { ExpirationPlugin } from 'workbox-expiration';

// Pre-cache build assets
precacheAndRoute(self.__WB_MANIFEST);

// Images: Cache First (30 days, max 60 entries)
registerRoute(
  ({ request }) => request.destination === 'image',
  new CacheFirst({
    cacheName: 'images',
    plugins: [
      new ExpirationPlugin({ maxEntries: 60, maxAgeSeconds: 30 * 86400 }),
    ],
  })
);

// API: Stale While Revalidate
registerRoute(
  ({ url }) => url.pathname.startsWith('/api/'),
  new StaleWhileRevalidate({
    cacheName: 'api-responses',
    plugins: [
      new ExpirationPlugin({ maxEntries: 100, maxAgeSeconds: 3600 }),
    ],
  })
);

// HTML: Network First
registerRoute(
  ({ request }) => request.mode === 'navigate',
  new NetworkFirst({
    cacheName: 'pages',
    plugins: [
      new ExpirationPlugin({ maxEntries: 20 }),
    ],
  })
);
```

---

## Cache Storage Limits

| Browser | Storage Quota |
|---------|---------------|
| Chrome | 80% of total disk |
| Firefox | 50% of total disk (max 2GB per origin) |
| Safari | 1GB per origin |

---

## Offline Fallback

```typescript
// Serve offline page when network unavailable
self.addEventListener('fetch', (event) => {
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).catch(() =>
        caches.match('/offline.html')
      )
    );
  }
});
```

---

⚡ PikaKit v3.9.92

---

## 🔗 Related

| File | When to Read |
|------|-------------|
| [cdn.md](cdn.md) | CDN layer above browser |
| [application-cache.md](application-cache.md) | TanStack Query / SWR patterns |
| [redis.md](redis.md) | Server-side Redis cache |
| [SKILL.md](../SKILL.md) | Cache layer decision tree |
