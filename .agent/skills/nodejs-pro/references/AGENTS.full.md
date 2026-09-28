# Nodejs Pro Full Agent Rules

> Deterministic compilation of 8 source rules for nodejs-pro v4.0.0. Do not edit directly.

## Rule Index

- [Node.js Service Boundaries](#rule-architecture-patterns) (high, reference, source: `rules/architecture-patterns.md`)
- [Node.js Async and Cancellation Patterns](#rule-async-patterns) (high, reference, source: `rules/async-patterns.md`)
- [Node.js Service Architecture Decision](#rule-engineering-spec) (high, decision, source: `rules/engineering-spec.md`)
- [Node.js Error Handling](#rule-error-handling) (high, reference, source: `rules/error-handling.md`)
- [Node.js Framework Selection](#rule-framework-selection) (high, reference, source: `rules/framework-selection.md`)
- [Node.js Runtime and Modules](#rule-runtime-modules) (high, reference, source: `rules/runtime-modules.md`)
- [Node.js Testing Strategy](#rule-testing-strategy) (high, reference, source: `rules/testing-strategy.md`)
- [Node.js Validation and Security](#rule-validation-security) (critical, reference, source: `rules/validation-security.md`)

<a id="rule-architecture-patterns"></a>

## Node.js Service Boundaries

**Impact:** high
**Kind:** reference
**Source:** `rules/architecture-patterns.md`

# Architecture Patterns

> Layered separation is not bureaucracy — it's testability, swappability, and clarity.

## Scope

Apply to transport, application, domain, persistence, and integration boundaries in Node.js services.

## Guidance

---

## Layered Architecture

```
Request Flow:
│
├── Route / Controller Layer
│   ├── Handles HTTP specifics (status codes, headers)
│   ├── Input validation at boundary
│   ├── Calls service layer
│   └── NEVER contains business logic
│
├── Service Layer
│   ├── Business logic
│   ├── Framework-agnostic (no req/res)
│   ├── Calls repository layer
│   └── Orchestrates workflows
│
└── Repository Layer
    ├── Data access only
    ├── Database queries (Drizzle, Prisma)
    └── Returns domain objects
```

---

## Code Example — Layered Pattern

### Repository (data access)

```typescript
// repositories/user.repository.ts
import { db } from '../db'
import { users } from '../db/schema'
import { eq } from 'drizzle-orm'

export class UserRepository {
  async findById(id: string) {
    return db.query.users.findFirst({ where: eq(users.id, id) })
  }

  async findByEmail(email: string) {
    return db.query.users.findFirst({ where: eq(users.email, email) })
  }

  async create(data: { email: string; name: string }) {
    const [user] = await db.insert(users).values(data).returning()
    return user
  }
}
```

### Service (business logic)

```typescript
// services/user.service.ts
import { UserRepository } from '../repositories/user.repository'

export class UserService {
  constructor(private repo: UserRepository) {}

  async getUser(id: string) {
    const user = await this.repo.findById(id)
    if (!user) throw new NotFoundError('User not found')
    return user
  }

  async createUser(data: { email: string; name: string }) {
    const existing = await this.repo.findByEmail(data.email)
    if (existing) throw new ConflictError('Email already registered')
    return this.repo.create(data)
  }
}
```

### Controller (HTTP layer)

```typescript
// Fastify example
// controllers/user.controller.ts
import { UserService } from '../services/user.service'

export function userRoutes(app: FastifyInstance, service: UserService) {
  app.get('/users/:id', async (request, reply) => {
    const user = await service.getUser(request.params.id)
    return user
  })

  app.post('/users', async (request, reply) => {
    const user = await service.createUser(request.body)
    return reply.code(201).send(user)
  })
}
```

```typescript
// Hono example
import { Hono } from 'hono'
import { UserService } from '../services/user.service'

export function userRoutes(service: UserService) {
  const app = new Hono()

  app.get('/:id', async (c) => {
    const user = await service.getUser(c.req.param('id'))
    return c.json(user)
  })

  app.post('/', async (c) => {
    const body = await c.req.json()
    const user = await service.createUser(body)
    return c.json(user, 201)
  })

  return app
}
```

---

## Project Structure

```
src/
├── controllers/        # Route handlers (HTTP-specific)
│   ├── user.controller.ts
│   └── product.controller.ts
├── services/           # Business logic (framework-agnostic)
│   ├── user.service.ts
│   └── product.service.ts
├── repositories/       # Data access (DB queries)
│   ├── user.repository.ts
│   └── product.repository.ts
├── middleware/          # Auth, validation, logging
│   ├── auth.ts
│   └── validate.ts
├── db/                 # Database config + schema
│   ├── index.ts        # Connection
│   ├── schema.ts       # Drizzle/Prisma schema
│   └── migrations/
├── errors/             # Custom error classes
│   └── index.ts
├── types/              # Shared TypeScript types
│   └── index.ts
├── utils/              # Pure utility functions
│   └── index.ts
└── app.ts              # App setup + route registration
```

---

## Dependency Injection (Simple)

```typescript
// di.ts — Manual DI (no framework needed)
import { UserRepository } from './repositories/user.repository'
import { UserService } from './services/user.service'

// Create instances once
const userRepo = new UserRepository()
const userService = new UserService(userRepo)

export { userService }
```

```typescript
// app.ts
import { userService } from './di'
import { userRoutes } from './controllers/user.controller'

const app = Fastify()
userRoutes(app, userService)
```

**Why manual DI?** Simple, testable, no magic. For NestJS, use built-in DI. For small projects, this is enough.

---

## When to Simplify

| Project Size | Architecture |
|-------------|-------------|
| Script / CLI | Single file |
| Small API (< 5 routes) | Routes + services (skip repo layer) |
| Medium API (5-20 routes) | Full 3-layer + manual DI |
| Large / Enterprise | NestJS with modules + built-in DI |
| Microservice | 3-layer per service, shared types package |

---

## Anti-Patterns

| ❌ Don't | ✅ Do |
|---------|-------|
| Business logic in controllers | Service layer handles all logic |
| `req`/`res` in service layer | Services are framework-agnostic |
| Direct DB calls in controllers | Repository pattern |
| God service (1000+ lines) | Split by domain (UserService, OrderService) |
| Circular dependencies | Unidirectional: Controller → Service → Repository |
| Over-engineering small APIs | Match architecture to project size |

---

## Verification

Test domain services without HTTP or database objects, integration adapters against their contracts, and request mapping separately. Confirm dependencies flow inward and rollback does not require incompatible interface changes.

## Related

| File | When to Read |
|------|-------------|
| [framework-selection.md](framework-selection.md) | Choose framework first |
| [error-handling.md](error-handling.md) | Error classes for service layer |
| [testing-strategy.md](testing-strategy.md) | Testing each layer independently |
| [validation-security.md](validation-security.md) | Middleware validation patterns |

---

⚡ PikaKit v3.9.224

<a id="rule-async-patterns"></a>

## Node.js Async and Cancellation Patterns

**Impact:** high
**Kind:** reference
**Source:** `rules/async-patterns.md`

# Async Patterns

> Node.js is async-first. **The event loop is everything.** Block it and your entire server stops.

## Scope

Apply to promise composition, cancellation, deadlines, streams, event-loop protection, worker threads, and concurrency limits.

## Guidance

---

## When to Use Each

| Pattern | Use When | Example |
|---------|----------|---------|
| `async/await` | Sequential operations | Fetch user → fetch orders |
| `Promise.all` | Parallel, all must succeed | Fetch user AND orders simultaneously |
| `Promise.allSettled` | Parallel, some can fail | Send notifications to multiple channels |
| `Promise.race` | First response wins | Timeout pattern |
| `Promise.any` | First success wins | Try multiple CDNs |

---

## Code Examples

### Sequential (when order matters)

```typescript
// ✅ Each step depends on the previous
async function processOrder(orderId: string) {
  const order = await getOrder(orderId)
  const payment = await chargePayment(order.total)
  const confirmation = await sendConfirmation(order.email, payment.id)
  return confirmation
}
```

### Parallel (independent operations)

```typescript
// ❌ Waterfall — 3 sequential network calls
async function getDashboard(userId: string) {
  const user = await getUser(userId)        // 200ms
  const orders = await getOrders(userId)    // 300ms
  const stats = await getStats(userId)      // 150ms
  return { user, orders, stats }            // Total: 650ms
}

// ✅ Parallel — all at once
async function getDashboard(userId: string) {
  const [user, orders, stats] = await Promise.all([
    getUser(userId),       // 200ms
    getOrders(userId),     // 300ms  } Total: 300ms (longest)
    getStats(userId),      // 150ms
  ])
  return { user, orders, stats }
}
```

### Partial failure tolerance

```typescript
// ✅ Send to all channels, don't fail if one channel is down
async function notifyAll(userId: string, message: string) {
  const results = await Promise.allSettled([
    sendEmail(userId, message),
    sendPush(userId, message),
    sendSMS(userId, message),
  ])

  const failures = results.filter(r => r.status === 'rejected')
  if (failures.length > 0) {
    logger.warn({ failures }, 'Some notifications failed')
  }
}
```

---

## AbortController (Timeouts + Cancellation)

```typescript
// Timeout a fetch request
async function fetchWithTimeout(url: string, timeoutMs = 5000) {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), timeoutMs)

  try {
    const response = await fetch(url, { signal: controller.signal })
    return await response.json()
  } catch (err) {
    if (err instanceof DOMException && err.name === 'AbortError') {
      throw new Error(`Request to ${url} timed out after ${timeoutMs}ms`)
    }
    throw err
  } finally {
    clearTimeout(timeout)
  }
}

// Cancel on user disconnect (Fastify)
app.get('/long-operation', async (request, reply) => {
  const result = await longOperation({ signal: request.raw.signal })
  return result
  // If client disconnects, signal is aborted → operation cancelled
})
```

---

## Streams (Large Data)

```typescript
// ❌ Load entire file into memory
const data = await fs.readFile('huge-file.csv', 'utf-8')
const lines = data.split('\n') // 2GB in memory!

// ✅ Stream line by line
import { createReadStream } from 'node:fs'
import { createInterface } from 'node:readline'

async function processCSV(filePath: string) {
  const stream = createReadStream(filePath)
  const rl = createInterface({ input: stream })

  for await (const line of rl) {
    await processLine(line) // Constant memory usage
  }
}

// ✅ Stream API response (Fastify)
app.get('/export', async (request, reply) => {
  const cursor = db.query.users.findMany().cursor()
  reply.type('application/json')

  for await (const batch of cursor) {
    reply.raw.write(JSON.stringify(batch))
  }
  reply.raw.end()
})
```

---

## Worker Threads (CPU-Bound Work)

```typescript
// ❌ Blocks event loop — entire server freezes
app.get('/hash', async (request) => {
  const hash = computeExpensiveHash(request.body.data) // 2 seconds blocking
  return { hash }
})

// ✅ Offload to worker thread
import { Worker } from 'node:worker_threads'

function runInWorker<T>(workerPath: string, data: unknown): Promise<T> {
  return new Promise((resolve, reject) => {
    const worker = new Worker(workerPath, { workerData: data })
    worker.on('message', resolve)
    worker.on('error', reject)
  })
}

app.get('/hash', async (request) => {
  const hash = await runInWorker('./workers/hash.ts', request.body.data)
  return { hash } // Event loop stays free
})
```

```typescript
// workers/hash.ts
import { parentPort, workerData } from 'node:worker_threads'

const result = computeExpensiveHash(workerData)
parentPort?.postMessage(result)
```

---

## Event Loop Protection

```
I/O-bound (event loop handles well):
├── Database queries      → async/await
├── HTTP requests         → async/await
├── File system           → fs.promises (never Sync!)
└── Network operations    → async/await

CPU-bound (blocks event loop):
├── Crypto (hashing)      → worker threads
├── Image processing      → worker threads or external service
├── JSON parse (>1MB)     → streaming parser
├── Complex calculations  → worker threads
└── Compression           → zlib.promises or worker
```

### Detect Blocking

```typescript
// Detect event loop lag (monitoring)
import { monitorEventLoopDelay } from 'node:perf_hooks'

const histogram = monitorEventLoopDelay({ resolution: 20 })
histogram.enable()

setInterval(() => {
  const p99 = histogram.percentile(99) / 1e6 // Convert to ms
  if (p99 > 100) {
    logger.warn({ p99Ms: p99 }, 'Event loop lag detected')
  }
  histogram.reset()
}, 5000)
```

---

## Anti-Patterns

| ❌ Don't | ✅ Do |
|---------|-------|
| `fs.readFileSync` in production | `fs.promises.readFile` |
| Sequential awaits for independent data | `Promise.all` |
| No timeout on external calls | `AbortController` with timeout |
| Load large files into memory | Stream processing |
| CPU work on main thread | Worker threads |
| Ignore `unhandledRejection` | Handle or crash process |

---

## Verification

Test cancellation, timeout, partial failure, bounded fan-out, stream backpressure, worker termination, and shutdown. Measure event-loop delay and memory under representative concurrency; reject unbounded queues and detached promises.

## Related

| File | When to Read |
|------|-------------|
| [error-handling.md](error-handling.md) | Async error catching patterns |
| [architecture-patterns.md](architecture-patterns.md) | Where async code lives in layers |
| [testing-strategy.md](testing-strategy.md) | Testing async code |
| [runtime-modules.md](runtime-modules.md) | node: prefix for built-in modules |

---

⚡ PikaKit v3.9.224

<a id="rule-engineering-spec"></a>

## Node.js Service Architecture Decision

**Impact:** high
**Kind:** decision
**Source:** `rules/engineering-spec.md`

# Node.js Service Architecture Decision

## Decision

Use the smallest maintained framework that satisfies transport, plugin, lifecycle, and deployment requirements. Keep domain logic independent of HTTP objects. Validate at boundaries, propagate cancellation, bound concurrency, centralize error translation, and implement graceful shutdown. Use worker threads or an external worker for CPU-bound work.

## Use When

- Building HTTP, event-driven, worker, or serverless Node.js services.
- Choosing ESM/CommonJS, a framework, concurrency strategy, or lifecycle model.
- Correcting event-loop stalls, unhandled rejections, or shutdown loss.

## Avoid When

- Browser rendering is the primary concern.
- The workload is predominantly long-running CPU computation without worker isolation.
- A platform-owned runtime contract requires a different architecture.

## Trade-offs

- Minimal frameworks reduce abstraction but require explicit lifecycle and policy wiring.
- Batteries-included frameworks standardize large teams but add conventions and startup cost.
- In-process concurrency is efficient for I/O but amplifies overload without limits.
- Worker threads isolate CPU work but add serialization, lifecycle, and observability overhead.

## Verification

Measure event-loop delay, latency percentiles, memory, connection limits, and error rates under representative load. Test malformed input, downstream timeout, abort, retry limits, partial response, unhandled rejection, signal-driven shutdown, and forced termination. Confirm diagnostics redact credentials and rollback uses a compatible artifact and schema.

<a id="rule-error-handling"></a>

## Node.js Error Handling

**Impact:** high
**Kind:** reference
**Source:** `rules/error-handling.md`

# Error Handling

> Every error must be caught, classified, and communicated. **No silent failures.**

## Scope

Apply to operational/programmer error classification, transport mapping, structured logging, retry ownership, and process-level failure.

## Guidance

---

## Custom Error Classes

```typescript
// errors/index.ts
export class AppError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public code: string,
    public isOperational = true
  ) {
    super(message)
    this.name = this.constructor.name
    Error.captureStackTrace(this, this.constructor)
  }
}

export class NotFoundError extends AppError {
  constructor(resource = 'Resource') {
    super(`${resource} not found`, 404, 'NOT_FOUND')
  }
}

export class ValidationError extends AppError {
  constructor(message: string, public details?: unknown) {
    super(message, 422, 'VALIDATION_ERROR')
  }
}

export class ConflictError extends AppError {
  constructor(message: string) {
    super(message, 409, 'CONFLICT')
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = 'Unauthorized') {
    super(message, 401, 'UNAUTHORIZED')
  }
}

export class ForbiddenError extends AppError {
  constructor(message = 'Forbidden') {
    super(message, 403, 'FORBIDDEN')
  }
}
```

---

## Framework Error Handlers

### Fastify

```typescript
// Fastify handles async errors automatically — no try/catch needed!
app.setErrorHandler((error, request, reply) => {
  if (error instanceof AppError) {
    reply.code(error.statusCode).send({
      error: error.code,
      message: error.message,
      ...(error.details && { details: error.details })
    })
    return
  }

  // Unexpected error — log full details, send generic response
  request.log.error(error)
  reply.code(500).send({
    error: 'INTERNAL_ERROR',
    message: 'An unexpected error occurred'
  })
})
```

### Hono

```typescript
import { HTTPException } from 'hono/http-exception'

// Global error handler
app.onError((err, c) => {
  if (err instanceof AppError) {
    return c.json({
      error: err.code,
      message: err.message,
    }, err.statusCode as any)
  }

  console.error('Unexpected error:', err)
  return c.json({ error: 'INTERNAL_ERROR', message: 'Unexpected error' }, 500)
})
```

### Express (requires wrapper)

```typescript
// Express does NOT handle async errors — you MUST wrap or use a library

// Option 1: express-async-errors (recommended)
import 'express-async-errors' // Import once at top

// Option 2: Manual wrapper
const asyncHandler = (fn: Function) => (req: Request, res: Response, next: NextFunction) =>
  Promise.resolve(fn(req, res, next)).catch(next)

app.get('/users/:id', asyncHandler(async (req, res) => {
  const user = await getUser(req.params.id) // Errors auto-forwarded
  res.json(user)
}))

// Error middleware (must be last, must have 4 params)
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      error: err.code,
      message: err.message
    })
    return
  }

  console.error('Unexpected error:', err)
  res.status(500).json({ error: 'INTERNAL_ERROR', message: 'Unexpected error' })
})
```

---

## Error Response Format (Fixed)

```typescript
// Client gets:
{
  "error": "NOT_FOUND",           // Machine-readable code
  "message": "User not found",    // Human-readable message
  "details": { ... }              // Optional: validation details
}

// Client NEVER gets:
// - Stack traces
// - Internal file paths
// - Database query details
// - Environment variables
```

---

## Status Code Selection

| Situation | Status | Code | When |
|-----------|:------:|------|------|
| Bad input format | 400 | `BAD_REQUEST` | Malformed JSON, missing fields |
| No auth | 401 | `UNAUTHORIZED` | Missing or invalid token |
| No permission | 403 | `FORBIDDEN` | Valid auth, insufficient role |
| Not found | 404 | `NOT_FOUND` | Resource doesn't exist |
| Conflict | 409 | `CONFLICT` | Duplicate email, version conflict |
| Validation | 422 | `VALIDATION_ERROR` | Schema valid but business rules fail |
| Rate limited | 429 | `RATE_LIMITED` | Too many requests |
| Server error | 500 | `INTERNAL_ERROR` | Our fault — log everything |

---

## Operational vs Programming Errors

```
Operational (expected, handle gracefully):
├── User not found → 404
├── Invalid input → 422
├── Duplicate email → 409
├── Rate limited → 429
└── External API timeout → 503

Programming (bugs, crash + restart):
├── TypeError: Cannot read property of undefined
├── RangeError: Array index out of bounds
├── Unhandled promise rejection
└── → Log, crash, let process manager restart
```

```typescript
// Crash on programming errors — don't try to recover
process.on('uncaughtException', (error) => {
  console.error('UNCAUGHT EXCEPTION:', error)
  process.exit(1) // Let PM2/Docker restart
})

process.on('unhandledRejection', (reason) => {
  console.error('UNHANDLED REJECTION:', reason)
  process.exit(1)
})
```

---

## Structured Logging

```typescript
// Use structured JSON logging (Pino is default in Fastify)
import pino from 'pino'

const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  ...(process.env.NODE_ENV === 'development' && {
    transport: { target: 'pino-pretty' }
  })
})

// Log context, not messages
logger.error({ err, userId, requestId, path: req.url }, 'User fetch failed')
// ✅ Structured, searchable in Datadog/CloudWatch

// NOT: logger.error(`Error fetching user ${userId}: ${err.message}`)
// ❌ String, unsearchable
```

---

## Anti-Patterns

| ❌ Don't | ✅ Do |
|---------|-------|
| `try/catch` in every Express route | Use `express-async-errors` or Fastify |
| Return stack traces to client | Return error code + message only |
| `console.log` for errors | Use structured logger (Pino) |
| Swallow errors (empty catch) | Always log or rethrow |
| Generic `throw new Error('fail')` | Throw specific `AppError` subclass |
| Recover from programming errors | Crash and restart (PM2/Docker) |

---

## Verification

Test each error class through the public boundary, including dependency timeout and programmer failure. Confirm one owner retries, clients receive stable non-sensitive responses, logs preserve causes, and fatal process errors produce nonzero termination after cleanup.

## Related

| File | When to Read |
|------|-------------|
| [architecture-patterns.md](architecture-patterns.md) | Where errors flow through layers |
| [async-patterns.md](async-patterns.md) | Async error handling |
| [validation-security.md](validation-security.md) | Validation errors at boundary |
| [framework-selection.md](framework-selection.md) | Framework-specific error behavior |

---

⚡ PikaKit v3.9.224

<a id="rule-framework-selection"></a>

## Node.js Framework Selection

**Impact:** high
**Kind:** reference
**Source:** `rules/framework-selection.md`

# Framework Selection

> Choose framework by deployment target and team context. **Never default to Express for new projects.**

## Scope

Apply to framework selection from runtime, deployment, protocol, lifecycle, ecosystem, and team constraints. Revalidate framework-specific claims against its official documentation.

## Guidance

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

## Verification

Build a thin vertical slice and verify lifecycle hooks, validation, error mapping, cancellation, observability, testing, deployment size, and supported runtime. Record rejected alternatives and migration cost rather than benchmark claims without local measurement.

## Related

| File | When to Read |
|------|-------------|
| [architecture-patterns.md](architecture-patterns.md) | After framework chosen — structure the app |
| [error-handling.md](error-handling.md) | Framework-specific error patterns |
| [validation-security.md](validation-security.md) | Input validation per framework |
| [runtime-modules.md](runtime-modules.md) | ESM/CJS module decisions |

---

⚡ PikaKit v3.9.224

<a id="rule-runtime-modules"></a>

## Node.js Runtime and Modules

**Impact:** high
**Kind:** reference
**Source:** `rules/runtime-modules.md`

# Runtime & Module System

> Use ESM for new projects. Use `node:` prefixes. Match TypeScript execution to the supported Node release.

## Scope

Apply to supported Node versions, package module type, ESM/CommonJS interop, built-in imports, and native TypeScript constraints.

## Guidance

---

## Runtime Selection

| Runtime | Best For | TypeScript | Package Manager |
|---------|----------|-----------|----------------|
| **Node.js** | General purpose, largest ecosystem | Built-in type stripping where supported, or a project toolchain | npm/pnpm/yarn |
| **Bun** | Performance, scripts, built-in bundler | Native | bun |
| **Deno** | Security-first, built-in TypeScript | Native | deno/npm |

**Default recommendation:** Use an actively supported Node LTS that satisfies the package engine, dependencies, and deployment platform. Keep the CI version matrix aligned with production.

---

## Module System Decision

| Factor | ESM (`import/export`) | CJS (`require/module.exports`) |
|--------|----------------------|-------------------------------|
| **Standard** | Modern (ECMAScript) | Legacy (Node.js original) |
| **Tree-shaking** | ✅ Yes | ❌ No |
| **Top-level await** | ✅ Yes | ❌ No |
| **New projects** | ✅ Use this | ❌ Avoid |
| **Existing codebases** | Migrate gradually | Keep if migration cost high |

### ESM Setup

```json
// package.json
{
  "type": "module"
}
```

```json
// tsconfig.json
{
  "compilerOptions": {
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "target": "ES2022",
    "outDir": "dist",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true
  }
}
```

---

## Native TypeScript

```bash
# Run erasable TypeScript directly on a supporting Node release
node src/app.ts

# With type-checking (slower, for CI)
npx tsx src/app.ts
```

Verify the exact syntax and version constraints in the Node.js TypeScript documentation. Built-in type stripping does not type-check code and does not transform every TypeScript feature.

**When to use native TS:**
- Scripts and CLIs
- Simple APIs
- Development

**When to use a build step:**
- Production (compiled JS is faster to start)
- Complex projects with path aliases
- When you need decorators (NestJS)

---

## `node:` Prefix (Always Use)

```typescript
// ❌ Ambiguous — is this npm package or built-in?
import { readFile } from 'fs/promises'
import { join } from 'path'

// ✅ Clear — this is a Node.js built-in
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { Worker } from 'node:worker_threads'
import { createServer } from 'node:http'
```

**Why?** Prevents name conflicts with npm packages. Makes imports instantly recognizable.

---

## Interop Gotchas

### Importing CJS from ESM

```typescript
// ✅ Default imports usually work
import express from 'express' // CJS library

// ⚠️ Named imports may fail
import { Router } from 'express' // May error in some setups

// ✅ Safe alternative
import express from 'express'
const { Router } = express
```

### `__dirname` / `__filename` in ESM

```typescript
// ❌ Not available in ESM
console.log(__dirname) // ReferenceError

// ✅ ESM equivalent
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Or use import.meta directly (Node.js 21+)
const configPath = new URL('./config.json', import.meta.url)
```

### `require()` in ESM

```typescript
// ❌ Not available in ESM
const pkg = require('./package.json')

// ✅ Use createRequire or import assertion
import { createRequire } from 'node:module'
const require = createRequire(import.meta.url)
const pkg = require('./package.json')

// ✅ Or import with assertion (Node.js 22+)
import pkg from './package.json' with { type: 'json' }
```

---

## Anti-Patterns

| ❌ Don't | ✅ Do |
|---------|-------|
| Start new projects with CJS | Use ESM (`"type": "module"`) |
| Import built-ins without `node:` | Always `import from 'node:fs'` |
| Mix ESM and CJS in same package | Pick one, migrate fully |
| Use `__dirname` in ESM | Use `import.meta.url` |
| Skip tsconfig `"strict": true` | Always enable strict mode |

---

## Verification

Test clean install, typecheck, package exports, direct execution, tests, and built output on every supported Node version. Verify ESM/CommonJS interop from an actual consumer package and keep a rollback-compatible build artifact.

## Related

| File | When to Read |
|------|-------------|
| [framework-selection.md](framework-selection.md) | Framework TypeScript support |
| [async-patterns.md](async-patterns.md) | node: built-in async APIs |
| [testing-strategy.md](testing-strategy.md) | node:test built-in runner |

---

⚡ PikaKit v3.9.224

<a id="rule-testing-strategy"></a>

## Node.js Testing Strategy

**Impact:** high
**Kind:** reference
**Source:** `rules/testing-strategy.md`

# Testing Strategy

> Test the right things: critical paths, edge cases, error handling. **Don't test framework code.**

## Scope

Apply to unit, integration, contract, and end-to-end tests for Node.js services, including test isolation and CI behavior.

## Guidance

---

## Test Tool Selection

| Tool | Best For | Speed | Setup |
|------|---------|-------|-------|
| **Vitest** | Vite/React projects, modern DX | Fastest | Zero-config with Vite |
| **node:test** | Zero-dependency, built-in | Fast | No install needed |
| **Jest** | Legacy projects | Slower | Extra config for ESM |

**Default recommendation:** Vitest for app projects. `node:test` for libraries / zero-dep projects.

---

## What to Test (Priorities)

| Priority | Test | Why |
|----------|------|-----|
| 1 | **Critical paths** | Auth, payments, core business logic |
| 2 | **Edge cases** | Empty inputs, boundaries, nulls |
| 3 | **Error handling** | What happens when things fail? |
| 4 | **Integration points** | API endpoints, database queries |
| ❌ | Framework code | Express/Fastify already tested |
| ❌ | Trivial getters/setters | No logic to test |
| ❌ | Third-party libraries | They have their own tests |

---

## Unit Test Examples

### Vitest

```typescript
// user.service.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { UserService } from './user.service'

describe('UserService', () => {
  let service: UserService
  let mockRepo: { findById: ReturnType<typeof vi.fn>; create: ReturnType<typeof vi.fn> }

  beforeEach(() => {
    mockRepo = {
      findById: vi.fn(),
      create: vi.fn(),
    }
    service = new UserService(mockRepo as any)
  })

  it('returns user when found', async () => {
    const user = { id: '1', name: 'Alice', email: 'alice@test.com' }
    mockRepo.findById.mockResolvedValue(user)

    const result = await service.getUser('1')

    expect(result).toEqual(user)
    expect(mockRepo.findById).toHaveBeenCalledWith('1')
  })

  it('throws NotFoundError when user missing', async () => {
    mockRepo.findById.mockResolvedValue(null)

    await expect(service.getUser('999'))
      .rejects.toThrow('User not found')
  })
})
```

### node:test (Zero Dependencies)

```typescript
// user.service.test.ts
import { describe, it, mock, beforeEach } from 'node:test'
import assert from 'node:assert/strict'
import { UserService } from './user.service.js'

describe('UserService', () => {
  let service: UserService
  let mockRepo: { findById: Function; create: Function }

  beforeEach(() => {
    mockRepo = {
      findById: mock.fn(() => Promise.resolve(null)),
      create: mock.fn(() => Promise.resolve({ id: '1' })),
    }
    service = new UserService(mockRepo as any)
  })

  it('returns user when found', async () => {
    const user = { id: '1', name: 'Alice' }
    mockRepo.findById = mock.fn(() => Promise.resolve(user))
    service = new UserService(mockRepo as any)

    const result = await service.getUser('1')
    assert.deepEqual(result, user)
  })

  it('throws when user not found', async () => {
    await assert.rejects(
      () => service.getUser('999'),
      { message: 'User not found' }
    )
  })
})
```

---

## Integration Test (API Endpoint)

```typescript
// Fastify + Vitest
import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { buildApp } from '../app'

describe('POST /users', () => {
  let app: FastifyInstance

  beforeAll(async () => {
    app = await buildApp({ testing: true })
  })

  afterAll(async () => {
    await app.close()
  })

  it('creates user with valid data', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/users',
      payload: { email: 'test@test.com', name: 'Test User' },
    })

    expect(response.statusCode).toBe(201)
    expect(response.json()).toMatchObject({
      email: 'test@test.com',
      name: 'Test User',
    })
  })

  it('returns 422 for invalid email', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/users',
      payload: { email: 'not-an-email', name: 'Test' },
    })

    expect(response.statusCode).toBe(422)
    expect(response.json().error).toBe('VALIDATION_ERROR')
  })
})
```

---

## Mocking Patterns

```typescript
// Mock external services (Vitest)
vi.mock('./external-api', () => ({
  fetchFromAPI: vi.fn().mockResolvedValue({ data: 'mocked' }),
}))

// Mock environment variables
vi.stubEnv('DATABASE_URL', 'postgres://test:test@localhost/test')

// Mock timers
vi.useFakeTimers()
vi.advanceTimersByTime(5000)
vi.useRealTimers()

// Spy on function calls
const spy = vi.spyOn(logger, 'error')
await performAction()
expect(spy).toHaveBeenCalledWith(expect.objectContaining({ error: true }))
```

---

## Test Structure

```
src/
├── services/
│   ├── user.service.ts
│   └── user.service.test.ts      # Co-located unit tests
├── controllers/
│   ├── user.controller.ts
│   └── user.controller.test.ts
└── __tests__/                     # Integration tests
    ├── api/
    │   └── users.test.ts
    └── setup.ts                   # Test database, fixtures
```

---

## Running Tests

```bash
# Vitest
npx vitest              # Watch mode
npx vitest run           # Single run (CI)
npx vitest run --coverage  # With coverage

# node:test
node --test src/**/*.test.ts       # Run all tests
node --test --watch                # Use only on supported Node releases
node --test --experimental-test-coverage  # Coverage
```

---

## CI Integration

```yaml
# GitHub Actions
- name: Test
  run: npx vitest run --coverage --reporter=junit
  env:
    DATABASE_URL: ${{ secrets.TEST_DATABASE_URL }}

- name: Upload Coverage
  uses: codecov/codecov-action@v4
```

---

## Anti-Patterns

| ❌ Don't | ✅ Do |
|---------|-------|
| Test implementation details | Test behavior and outcomes |
| Mock everything | Mock only external boundaries |
| Test framework internals | Test your business logic |
| Skip error path tests | Test both happy and error paths |
| Use `any` for mock types | Type mocks properly |
| Rely on test order | Each test is independent |

---

## Verification

Run tests from a clean checkout with fixed timeouts and isolated state. Include validation, authorization, concurrency, dependency failure, cancellation, shutdown, and regression cases. Fail CI on test-runner error or missing required suites.

## Related

| File | When to Read |
|------|-------------|
| [architecture-patterns.md](architecture-patterns.md) | Layer testing strategy |
| [error-handling.md](error-handling.md) | Testing error paths |
| [validation-security.md](validation-security.md) | Testing validation schemas |
| [async-patterns.md](async-patterns.md) | Testing async code |

---

⚡ PikaKit v3.9.224

<a id="rule-validation-security"></a>

## Node.js Validation and Security

**Impact:** critical
**Kind:** reference
**Source:** `rules/validation-security.md`

# Validation & Security

> Validate at boundary. Trust nothing. **Every input is hostile until proven otherwise.**

## Scope

Apply to untrusted input, output encoding, CORS, rate limits, headers, secret handling, dependency risk, and least privilege in Node.js services.

## Guidance

---

## Validation Library Selection

| Library | Best For | Bundle | TypeScript |
|---------|----------|--------|-----------|
| **Zod** | TypeScript-first, type inference | 13KB | Native inference |
| **Valibot** | Smallest bundle (tree-shakeable) | 1KB | Native inference |
| **ArkType** | Performance-critical validation | 25KB | Native inference |
| **Yup** | React forms (existing usage) | 40KB | @types needed |

**Default recommendation:** Zod (best DX + ecosystem). Valibot if bundle size critical.

---

## Zod Validation Examples

### Request Schema

```typescript
import { z } from 'zod'

// Define schema
const CreateUserSchema = z.object({
  email: z.string().email(),
  name: z.string().min(2).max(100),
  age: z.number().int().min(13).max(150).optional(),
  role: z.enum(['user', 'admin']).default('user'),
})

// Infer TypeScript type from schema
type CreateUser = z.infer<typeof CreateUserSchema>
// { email: string; name: string; age?: number; role: 'user' | 'admin' }
```

### Fastify Validation Middleware

```typescript
import { ZodSchema, ZodError } from 'zod'

function validate<T>(schema: ZodSchema<T>) {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      request.body = schema.parse(request.body)
    } catch (err) {
      if (err instanceof ZodError) {
        reply.code(422).send({
          error: 'VALIDATION_ERROR',
          details: err.errors.map(e => ({
            path: e.path.join('.'),
            message: e.message,
          }))
        })
      }
    }
  }
}

app.post('/users', { preHandler: validate(CreateUserSchema) }, async (request) => {
  return userService.create(request.body) // Already validated + typed
})
```

### Hono Validation Middleware

```typescript
import { zValidator } from '@hono/zod-validator'

app.post('/users',
  zValidator('json', CreateUserSchema),
  async (c) => {
    const data = c.req.valid('json') // Typed as CreateUser
    return c.json(await userService.create(data), 201)
  }
)
```

### Environment Validation (startup)

```typescript
// env.ts — Validate ALL env vars at startup, fail fast
const EnvSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']),
  PORT: z.coerce.number().default(3000),
  DATABASE_URL: z.string().url(),
  JWT_SECRET: z.string().min(32),
  REDIS_URL: z.string().url().optional(),
})

export const env = EnvSchema.parse(process.env)
// If any env var is missing/invalid → crash immediately at startup
```

---

## Security Middleware Stack

### Fastify

```typescript
import fastifyHelmet from '@fastify/helmet'
import fastifyRateLimit from '@fastify/rate-limit'
import fastifyCors from '@fastify/cors'

// Security headers
await app.register(fastifyHelmet)

// Rate limiting
await app.register(fastifyRateLimit, {
  max: 100,            // 100 requests
  timeWindow: '1 minute',
  keyGenerator: (req) => req.ip,
})

// CORS
await app.register(fastifyCors, {
  origin: env.CORS_ORIGINS?.split(',') || false,
  credentials: true,
})
```

### Hono

```typescript
import { cors } from 'hono/cors'
import { secureHeaders } from 'hono/secure-headers'
import { rateLimiter } from 'hono-rate-limiter'

app.use('*', secureHeaders())
app.use('*', cors({ origin: env.CORS_ORIGINS?.split(',') || [] }))
app.use('*', rateLimiter({ windowMs: 60_000, limit: 100 }))
```

---

## Security Checklist

| Category | Check | Implementation |
|----------|-------|---------------|
| **Input** | All inputs validated | Zod/Valibot at boundary |
| **SQL** | Parameterized queries | Drizzle/Prisma (never string concat) |
| **Auth** | Password hashing | `argon2` (preferred) or `bcrypt` |
| **Auth** | JWT verification | Verify signature + expiry + issuer |
| **Network** | Rate limiting | `@fastify/rate-limit` or equivalent |
| **Headers** | Security headers | Helmet.js or `hono/secure-headers` |
| **Transport** | HTTPS everywhere | TLS termination at load balancer |
| **CORS** | Properly configured | Explicit origins, not `*` in production |
| **Secrets** | Environment variables | Never hardcode, validate at startup |
| **Deps** | Dependency audit | `npm audit` in CI, Renovate/Dependabot |
| **Code** | No `eval()`/`Function()` | Never in production |
| **Logging** | No secrets in logs | Redact tokens, passwords, keys |

---

## Common Vulnerabilities

| Vulnerability | Prevention |
|--------------|-----------|
| **SQL Injection** | Use ORM (Drizzle/Prisma). Never `db.query(\`SELECT * WHERE id = ${id}\`)` |
| **XSS** | React auto-escapes. Never `dangerouslySetInnerHTML` with user input |
| **CSRF** | SameSite cookies + CSRF token for non-API forms |
| **Path Traversal** | Validate file paths: `path.resolve()` + check prefix |
| **Mass Assignment** | Validate with schema, pick only allowed fields |
| **Prototype Pollution** | Use `Object.create(null)` for lookup maps, validate JSON |

---

## Anti-Patterns

| ❌ Don't | ✅ Do |
|---------|-------|
| Validate inside business logic | Validate at route boundary |
| `CORS: origin: '*'` in production | Explicit allowed origins |
| Store JWT secret in code | Environment variable, validate at startup |
| `bcrypt` with low rounds | `argon2` or `bcrypt` with rounds ≥ 12 |
| Trust `Content-Type` header | Parse and validate body explicitly |
| Log full request bodies | Redact sensitive fields |

---

## Verification

Test malformed, oversized, duplicated, encoded, and unauthorized input at every public boundary. Verify CORS and rate-limit behavior, dependency and secret scans, least-privilege runtime configuration, redacted diagnostics, and fail-closed dependency outages.

## Related

| File | When to Read |
|------|-------------|
| [error-handling.md](error-handling.md) | Validation error responses |
| [framework-selection.md](framework-selection.md) | Framework-specific validation |
| [architecture-patterns.md](architecture-patterns.md) | Where validation sits in layers |
| [testing-strategy.md](testing-strategy.md) | Testing validation schemas |

---

⚡ PikaKit v3.9.224
