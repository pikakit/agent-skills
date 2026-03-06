---
name: cdn
description: CDN and edge caching — Cache-Control headers, cache busting, Vary, purge/invalidation
---

# CDN & Edge Caching

> Global content delivery and edge caching strategies.

---

## CDN Selection

| Provider | Best For | Edge Functions |
|----------|----------|----------------|
| Cloudflare | Global, free tier, Workers | ✅ Workers |
| Vercel Edge | Next.js, serverless | ✅ Edge Functions |
| AWS CloudFront | AWS ecosystem | ✅ Lambda@Edge |
| Fastly | Real-time invalidation | ✅ Compute@Edge |

---

## Cache-Control Headers

### Header Syntax

```
Cache-Control: public, max-age=31536000, immutable
```

### Strategy by Content Type

| Content | Header | TTL | Notes |
|---------|--------|-----|-------|
| Hashed assets (JS, CSS) | `public, max-age=31536000, immutable` | 1 year | Filename changes = new URL |
| Images/fonts | `public, max-age=2592000` | 30 days | Use cache busting |
| HTML pages | `public, max-age=0, s-maxage=60, stale-while-revalidate=300` | 0/60s | Fresh HTML, cached at CDN |
| API (public) | `public, s-maxage=60, stale-while-revalidate=120` | 60s | CDN caching only |
| API (private) | `private, no-store` | 0 | User-specific data |
| API (mixed) | `private, max-age=60` | 60s | Browser cache only |

### Directive Reference

| Directive | Meaning |
|-----------|---------|
| `public` | Any cache can store |
| `private` | Only browser can store |
| `no-store` | Never cache |
| `no-cache` | Cache but always revalidate |
| `max-age=N` | Browser cache TTL (seconds) |
| `s-maxage=N` | CDN/proxy cache TTL |
| `stale-while-revalidate=N` | Serve stale while fetching fresh |
| `immutable` | Never revalidate (content won't change) |

---

## Implementation

### Next.js App Router

```typescript
// app/api/products/route.ts
export async function GET() {
  const products = await db.product.findMany();

  return Response.json(products, {
    headers: {
      'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
      'CDN-Cache-Control': 'max-age=60',  // Cloudflare-specific
      'Vercel-CDN-Cache-Control': 'max-age=60',  // Vercel-specific
    },
  });
}
```

### Express

```typescript
// Static assets with hash
app.use('/assets', express.static('dist/assets', {
  maxAge: '1y',
  immutable: true,
}));

// API with CDN caching
app.get('/api/products', (req, res) => {
  res.set('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=300');
  res.json(products);
});
```

---

## Cache Busting Strategies

| Strategy | How | Example |
|----------|-----|---------|
| Content hash | Build tool adds hash | `app.a1b2c3.js` |
| Version query | Append version | `style.css?v=2.1.0` |
| Deploy ID | Unique per deploy | `app.css?deploy=abc123` |

> **Best practice:** Use content hashing (Vite, webpack, Next.js do this by default).

---

## Edge Caching with Vary

```typescript
// Different cache per authorization state
res.set('Vary', 'Authorization, Accept-Language');
res.set('Cache-Control', 'public, s-maxage=300');
```

| Vary Header | Use When |
|-------------|----------|
| `Authorization` | Different content per auth state |
| `Accept-Language` | i18n content |
| `Accept-Encoding` | Different compression (auto by CDN) |
| `Accept` | Content negotiation (JSON vs HTML) |

---

## Purge / Invalidation

| Provider | Method |
|----------|--------|
| Cloudflare | API: `POST /zones/:id/purge_cache`, Dashboard, or tags |
| Vercel | Automatic on redeploy, or `revalidateTag()` |
| CloudFront | `CreateInvalidation` API |

```typescript
// Vercel: On-demand revalidation
import { revalidateTag } from 'next/cache';

export async function POST(req: Request) {
  revalidateTag('products');
  return Response.json({ revalidated: true });
}
```

---

⚡ PikaKit v3.9.94

---

## 🔗 Related

| File | When to Read |
|------|-------------|
| [redis.md](redis.md) | Application cache behind CDN |
| [browser-cache.md](browser-cache.md) | Browser cache below CDN |
| [application-cache.md](application-cache.md) | In-memory app caching |
| [SKILL.md](../SKILL.md) | Cache layer decision tree |
