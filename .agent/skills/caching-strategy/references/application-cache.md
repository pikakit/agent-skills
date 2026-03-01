# Application-Level Caching

> In-memory caching, memoization, and frontend data cache (TanStack Query, SWR).

---

## Frontend Data Caching

### TanStack Query (Recommended)

```typescript
import { useQuery, QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Client configuration
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,      // 5 min before considered stale
      gcTime: 30 * 60 * 1000,         // 30 min garbage collection
      refetchOnWindowFocus: true,      // Refresh on tab focus
      retry: 3,                        // Retry failed requests
    },
  },
});

// Usage
function useProducts() {
  return useQuery({
    queryKey: ['products'],
    queryFn: () => fetch('/api/products').then(r => r.json()),
    staleTime: 60_000,  // Override: 1 min for this query
  });
}

// Invalidation after mutation
import { useMutation, useQueryClient } from '@tanstack/react-query';

function useCreateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: NewProduct) =>
      fetch('/api/products', { method: 'POST', body: JSON.stringify(data) }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
}
```

### SWR

```typescript
import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then(r => r.json());

function useProducts() {
  const { data, error, isLoading, mutate } = useSWR('/api/products', fetcher, {
    revalidateOnFocus: true,
    dedupingInterval: 60_000,    // Dedupe requests within 1 min
    refreshInterval: 0,          // No auto refresh
  });

  return { products: data, error, isLoading, refresh: mutate };
}
```

### Comparison

| Feature | TanStack Query | SWR |
|---------|---------------|-----|
| Devtools | ✅ Excellent | ✅ Basic |
| Pagination | ✅ Built-in | Manual |
| Infinite scroll | ✅ useInfiniteQuery | ✅ useSWRInfinite |
| Mutations | ✅ useMutation | Manual |
| Optimistic updates | ✅ Built-in | Manual |
| Bundle size | ~39KB | ~12KB |
| Best for | Complex apps | Simple apps |

---

## Server-Side In-Memory Cache

### Node.js LRU Cache

```typescript
import { LRUCache } from 'lru-cache';

const cache = new LRUCache<string, unknown>({
  max: 500,                    // Max 500 entries
  maxSize: 50 * 1024 * 1024,  // 50MB max
  sizeCalculation: (value) =>
    Buffer.byteLength(JSON.stringify(value)),
  ttl: 5 * 60 * 1000,         // 5 min TTL
});

// Usage
function getCached<T>(key: string, fetchFn: () => T): T {
  const cached = cache.get(key);
  if (cached) return cached as T;

  const data = fetchFn();
  cache.set(key, data);
  return data;
}
```

### When to Use In-Memory vs Redis

| Factor | In-Memory (LRU) | Redis |
|--------|-----------------|-------|
| Latency | ~0.01ms | ~0.5ms |
| Shared across processes | ❌ | ✅ |
| Survives restart | ❌ | ✅ (if persisted) |
| Max size | Limited by process memory | Dedicated memory |
| Best for | Single-process, small data | Multi-process, shared state |

---

## Memoization Patterns

### Function Memoization

```typescript
function memoize<T extends (...args: any[]) => any>(fn: T): T {
  const cache = new Map<string, ReturnType<T>>();

  return ((...args: Parameters<T>) => {
    const key = JSON.stringify(args);
    if (cache.has(key)) return cache.get(key);

    const result = fn(...args);
    cache.set(key, result);
    return result;
  }) as T;
}

// Usage
const expensiveCalc = memoize((n: number) => {
  // Heavy computation
  return fibonacci(n);
});
```

### React Memoization

```typescript
// useMemo — cache computed values
const sortedItems = useMemo(
  () => items.sort((a, b) => a.name.localeCompare(b.name)),
  [items]  // Recompute only when items change
);

// React.memo — cache component render
const ExpensiveList = React.memo(({ items }: Props) => (
  <ul>{items.map(item => <li key={item.id}>{item.name}</li>)}</ul>
));
```

---

## Cache Warming

```typescript
// Pre-populate cache on app start
async function warmCache() {
  const popularProducts = await db.product.findMany({
    orderBy: { viewCount: 'desc' },
    take: 100,
  });

  for (const product of popularProducts) {
    await redis.setex(
      `product:${product.id}`,
      3600,
      JSON.stringify(product),
    );
  }

  console.log(`Warmed cache with ${popularProducts.length} products`);
}
```

---

⚡ PikaKit v3.9.69
