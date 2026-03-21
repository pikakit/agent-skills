---
name: architecture-patterns
description: Layered architecture — Controller/Service/Repository with code examples, DI, project structure, and anti-patterns
---

# Architecture Patterns

> Layered separation is not bureaucracy — it's testability, swappability, and clarity.

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

## 🔗 Related

| File | When to Read |
|------|-------------|
| [framework-selection.md](framework-selection.md) | Choose framework first |
| [error-handling.md](error-handling.md) | Error classes for service layer |
| [testing-strategy.md](testing-strategy.md) | Testing each layer independently |
| [validation-security.md](validation-security.md) | Middleware validation patterns |
