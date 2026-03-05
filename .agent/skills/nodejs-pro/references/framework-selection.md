---
name: framework-selection
description: Node.js framework decision criteria — Hono, Fastify, Express, NestJS with code examples, middleware, and migration paths
---

# Framework Selection (2025)

> Choose framework by deployment target and team context. **Never default to Express for new projects.**

---

## Decision Tree

```
What are you building?
│
├── Edge / Serverless (Cloudflare Workers, Vercel Edge, Deno Deploy)
│   └── Hono
│       ├── Zero dependencies, ~14KB
│       ├── Fastest cold starts (~1ms)
│       ├── Web Standards API (Request/Response)
│       └── Runs on: CF Workers, Deno, Bun, Node.js, Lambda@Edge
│
├── High-Performance API (containers, VMs)
│   └── Fastify
│       ├── 2-3x faster than Express
│       ├── JSON Schema validation built-in
│       ├── Plugin-based architecture
│       └── Best for: REST APIs, microservices
│
├── Enterprise / Large Team
│   └── NestJS
│       ├── Structured (modules, controllers, services)
│       ├── Dependency Injection built-in
│       ├── Decorators + TypeScript native
│       └── Best for: large teams, enterprise apps
│
├── Legacy / Maximum Ecosystem
│   └── Express
│       ├── Largest middleware ecosystem
│       ├── Most tutorials and examples
│       └── Best for: maintaining existing apps
│
└── Full-Stack with Frontend
    └── Next.js API Routes or tRPC
```

---

## Comparison Matrix

| Factor | Hono | Fastify | Express | NestJS |
|--------|------|---------|---------|--------|
| **Best for** | Edge, serverless | Performance | Legacy | Enterprise |
| **Cold start** | ~1ms | ~50ms | ~100ms | ~200ms |
| **Throughput** | ~150k req/s | ~78k req/s | ~15k req/s | ~12k req/s |
| **TypeScript** | Native | Excellent | Good (DefinitelyTyped) | Native |
| **Bundle size** | ~14KB | ~2MB | ~1.5MB | ~15MB |
| **Learning curve** | Low | Medium | Low | High |
| **Ecosystem** | Growing fast | Good | Largest | Good |
| **DI built-in** | No | No | No | Yes |

---

## Hello World — Each Framework

### Hono

```typescript
import { Hono } from 'hono'

const app = new Hono()

app.get('/api/users/:id', async (c) => {
  const id = c.req.param('id')
  const user = await getUser(id)
  if (!user) return c.json({ error: 'Not found' }, 404)
  return c.json(user)
})

export default app // Works on CF Workers, Deno, Bun, Node.js
```

### Fastify

```typescript
import Fastify from 'fastify'

const app = Fastify({ logger: true })

app.get('/api/users/:id', {
  schema: {
    params: { type: 'object', properties: { id: { type: 'string' } } },
    response: { 200: { type: 'object', properties: { name: { type: 'string' } } } }
  }
}, async (request, reply) => {
  const user = await getUser(request.params.id)
  if (!user) return reply.code(404).send({ error: 'Not found' })
  return user // Auto-serialized via schema
})

await app.listen({ port: 3000 })
```

### Express

```typescript
import express from 'express'

const app = express()
app.use(express.json())

app.get('/api/users/:id', async (req, res, next) => {
  try {
    const user = await getUser(req.params.id)
    if (!user) return res.status(404).json({ error: 'Not found' })
    res.json(user)
  } catch (err) {
    next(err) // Must manually forward errors
  }
})

app.listen(3000)
```

### NestJS

```typescript
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const user = await this.usersService.findOne(id)
    if (!user) throw new NotFoundException()
    return user
  }
}
```

---

## Middleware Comparison

| Feature | Hono | Fastify | Express | NestJS |
|---------|------|---------|---------|--------|
| **Auth** | `hono/jwt` | `@fastify/jwt` | `passport` | `@nestjs/passport` |
| **CORS** | `hono/cors` | `@fastify/cors` | `cors` | Built-in `enableCors()` |
| **Rate limit** | `hono/rate-limiter` | `@fastify/rate-limit` | `express-rate-limit` | `@nestjs/throttler` |
| **Validation** | Zod middleware | JSON Schema (built-in) | Zod/express-validator | class-validator (built-in) |
| **Logging** | Built-in | Pino (built-in) | `morgan` | Built-in logger |
| **Helmet** | `hono/secure-headers` | `@fastify/helmet` | `helmet` | `helmet` via Express adapter |

---

## Migration Paths

### Express → Fastify

```
1. Replace app creation: express() → Fastify()
2. Replace middleware: app.use() → app.register()
3. Replace (req, res) → (request, reply)
4. Replace res.json() → reply.send() (or just return)
5. Add JSON schema for validation (optional but recommended)
6. Remove try/catch in routes (Fastify handles async errors)
```

### Express → Hono

```
1. Replace app creation: express() → new Hono()
2. Replace (req, res) → (c) context object
3. Replace req.params.id → c.req.param('id')
4. Replace res.json() → c.json()
5. Remove body-parser middleware (Hono parses automatically)
6. Test on target runtime (CF Workers, Bun, etc.)
```

---

## Selection Questions (Ask Before Choosing)

1. **Deployment target?** Edge → Hono. Container → Fastify. VM → any.
2. **Cold start critical?** Yes → Hono or Fastify. No → any.
3. **Team experience?** NestJS team → NestJS. Express team → consider migration to Fastify.
4. **Project size?** Small → Hono. Medium → Fastify. Large → NestJS.
5. **Existing codebase?** Express → keep or migrate gradually.

---

## Anti-Patterns

| ❌ Don't | ✅ Do |
|---------|-------|
| Default to Express for new projects | Choose by deployment target |
| Use Express without error wrapper | Use Fastify (auto async) or express-async-errors |
| Install 20 middleware packages | Choose framework with built-ins (Fastify, Hono) |
| Choose NestJS for small API | Use Hono or Fastify for simplicity |
| Ignore cold start for serverless | Benchmark cold start before choosing |

---

## 🔗 Related

| File | When to Read |
|------|-------------|
| [architecture-patterns.md](architecture-patterns.md) | After framework chosen — structure the app |
| [error-handling.md](error-handling.md) | Framework-specific error patterns |
| [validation-security.md](validation-security.md) | Input validation per framework |
| [runtime-modules.md](runtime-modules.md) | ESM/CJS module decisions |
