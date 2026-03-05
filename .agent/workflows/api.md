---
description: Build production-grade REST/GraphQL/tRPC APIs with OpenAPI docs, Prisma ORM, and comprehensive testing.
chain: api-development
---

# /api - API Development Pipeline

$ARGUMENTS

---

## Purpose

Build well-architected APIs from specification to implementation — covering design, database schema, route handlers, authentication, testing, and OpenAPI documentation. **Combines `backend-specialist` for implementation with `test-engineer` for validation, using `api-architect` for design decisions and `data-modeler` for schema design.** Differs from `/build` by focusing exclusively on API/backend without frontend.

---

## 🤖 Meta-Agents Integration

| Phase | Agent | Action |
| ----- | ----- | ------ |
| **Pre-Build** | `assessor` | Evaluate API complexity and risk level |
| **Pre-Build** | `recovery` | Save existing API state for rollback |
| **Post-Build** | `learner` | Learn API patterns for reuse |

```
Flow:
assessor.evaluate(api_scope) → risk level
       ↓
recovery.save(existing_api) → backup
       ↓
design → implement → test → secure
       ↓
learner.log(patterns)
```

---

## 🔴 MANDATORY: API Development Protocol

### Phase 1: Requirements & API Design

| Field | Value |
|-------|-------|
| **INPUT** | $ARGUMENTS (user request — API description, tech stack, requirements) |
| **OUTPUT** | API design spec: endpoints/schema, data models, auth strategy |
| **AGENTS** | `backend-specialist` |
| **SKILLS** | `api-architect` |

1. Clarify requirements if vague:

```
ASK if not specified:
□ API type (REST / GraphQL / tRPC)
□ Framework (Express / Fastify / NestJS / Hono)
□ Database (PostgreSQL / MySQL / MongoDB / SQLite)
□ ORM (Prisma / Drizzle / TypeORM)
□ Auth strategy (JWT / Session / OAuth2 / API Key)
□ Testing approach (unit + integration + E2E)
```

2. Design endpoints/schema using `api-architect` decision framework:

| Scenario | Recommendation |
|----------|----------------|
| Standard CRUD API | **REST** with Express/Fastify + Prisma |
| Complex data relationships, flexible queries | **GraphQL** with Apollo/Yoga |
| Full-stack TypeScript monorepo | **tRPC** with Next.js |
| High-performance, low-overhead | **Hono** or **Fastify** |

3. Define request/response formats, error contracts, status codes
4. Plan pagination, filtering, and sorting strategies

### Phase 2: Database Schema Design

| Field | Value |
|-------|-------|
| **INPUT** | API design spec from Phase 1 |
| **OUTPUT** | Database schema: `prisma/schema.prisma` or equivalent, migration files |
| **AGENTS** | `backend-specialist` |
| **SKILLS** | `data-modeler` |

1. Design data models with relationships (1:1, 1:N, M:N)
2. Define indexes for query optimization
3. Plan migration strategy (incremental, reversible)
4. Generate Prisma schema or equivalent ORM config

// turbo
```bash
npx prisma generate
```

### Phase 3: API Implementation

| Field | Value |
|-------|-------|
| **INPUT** | API design spec + database schema from Phases 1-2 |
| **OUTPUT** | Route handlers in `src/routes/`, service layer in `src/services/`, middleware in `src/middleware/` |
| **AGENTS** | `backend-specialist` |
| **SKILLS** | `nodejs-pro`, `api-architect`, `auth-patterns` |

1. Scaffold project structure:

```
src/
├── routes/          # Route handlers (thin — delegate to services)
├── controllers/     # Request parsing, response formatting
├── services/        # Business logic (pure, testable)
├── middleware/       # Auth, validation, rate limiting, error handling
├── validators/      # Input validation schemas (Zod)
└── types/           # TypeScript types and interfaces
prisma/
└── schema.prisma    # Database schema
```

2. Implement route handlers with input validation (Zod)
3. Create service layer with business logic (pure functions)
4. Add authentication middleware (JWT/OAuth2 per spec)
5. Implement error handling with consistent error response format
6. Add rate limiting middleware
7. Implement pagination, filtering, sorting

// turbo
```bash
npx tsc --noEmit
```

### Phase 4: Testing

| Field | Value |
|-------|-------|
| **INPUT** | Implemented API from Phase 3 |
| **OUTPUT** | Test suite: `src/__tests__/` with unit + integration tests passing |
| **AGENTS** | `test-engineer` |
| **SKILLS** | `test-architect` |

1. **Unit tests** — Service layer, validators, utilities (AAA pattern)
2. **Integration tests** — API endpoints with Supertest (actual HTTP calls)
3. **Auth tests** — Protected routes, token validation, role-based access
4. **Error path tests** — Invalid input, not found, unauthorized, rate limiting

// turbo
```bash
npm test -- --coverage
```

Coverage targets:

| Code Area | Target |
|-----------|--------|
| Business logic (services) | ≥ 80% |
| Auth/security middleware | 100% |
| Route handlers | ≥ 70% |
| Validators | ≥ 90% |

### Phase 5: Security & Documentation

| Field | Value |
|-------|-------|
| **INPUT** | Tested API from Phase 4 |
| **OUTPUT** | Security validation report + OpenAPI spec + README |
| **AGENTS** | `backend-specialist` |
| **SKILLS** | `security-scanner`, `api-architect` |

1. **Security validation** (OWASP Top 10):
   - SQL injection protection (parameterized queries via ORM)
   - XSS prevention (output encoding)
   - CSRF protection (where applicable)
   - Rate limiting configured
   - Input validation on all endpoints
   - Authentication on protected routes
   - Secrets not hardcoded

2. **OpenAPI/Swagger documentation**:
   - Generate OpenAPI 3.0 spec from routes
   - Include request/response examples
   - Document error responses with status codes
   - Add authentication requirements

3. **README generation**:
   - Quick start (get running < 5 min)
   - Environment variables
   - API endpoint reference
   - Testing instructions

// turbo
```bash
npm run lint && npx tsc --noEmit
```

---

## 🎨 Supported Patterns

### REST APIs

- Express.js, Fastify, Hono, NestJS
- OpenAPI/Swagger auto-generation
- Versioning: URL path (`/v1/`), header, query param

### GraphQL

- Apollo Server, GraphQL Yoga
- Schema-first or code-first approach
- DataLoader for N+1 query prevention

### tRPC

- Type-safe end-to-end APIs
- Next.js App Router integration
- Full inference without code generation

### Real-time

- WebSocket (Socket.io, ws)
- Server-Sent Events (SSE)
- Polling with ETag caching

---

## ⛔ MANDATORY: Problem Verification Before Completion

> **CRITICAL:** This check MUST be performed before any `notify_user` or task completion.

### Check @[current_problems]

```
1. Read @[current_problems] from IDE
2. If errors/warnings > 0:
   a. Auto-fix: imports, types, lint errors
   b. Re-check @[current_problems]
   c. If still > 0 → STOP → Notify user
3. If count = 0 → Proceed to completion
```

### Auto-Fixable

| Type | Fix |
|------|-----|
| Missing import | Add import statement |
| Unused variable | Remove or prefix `_` |
| Type mismatch | Fix type annotation |
| Lint errors | Run eslint --fix |

> **Rule:** Never mark complete with errors in `@[current_problems]`.

---

## Output Format

```markdown
## 🎯 API Development Complete

### API Summary

| Aspect | Value |
|--------|-------|
| Type | REST / GraphQL / tRPC |
| Framework | Express / Fastify / Hono |
| Database | PostgreSQL + Prisma |
| Auth | JWT / OAuth2 |

### Deliverables

| Item | Status | Path |
|------|--------|------|
| Routes | ✅ [X] endpoints | `src/routes/` |
| Services | ✅ [X] services | `src/services/` |
| Tests | ✅ [X] passing | `src/__tests__/` |
| Schema | ✅ [X] models | `prisma/schema.prisma` |
| OpenAPI | ✅ Generated | `docs/openapi.yaml` |
| Security | ✅ OWASP validated | — |

### Test Coverage

| Area | Coverage |
|------|----------|
| Business Logic | XX% |
| Auth/Security | XX% |
| Overall | XX% |

### Next Steps

- [ ] Review generated code and adjust business logic
- [ ] Run integration tests: `npm test`
- [ ] Configure environment variables for staging
- [ ] Deploy to staging: `/launch`
```

---

## Examples

```
/api user management REST API with Express and Prisma
/api GraphQL API for e-commerce with Apollo Server and PostgreSQL
/api payments microservice with Stripe integration and JWT auth
/api blog API with RESTful design, PostgreSQL, Prisma, JWT auth, rate limiting
/api real-time chat API with WebSocket and Redis pub/sub
```

---

## Key Principles

- **Design first** — plan endpoints, schemas, and auth before writing code
- **Type safety throughout** — TypeScript on every layer, Zod for runtime validation
- **Test at boundaries** — integration tests for endpoints, unit tests for logic
- **Security by default** — auth, validation, rate limiting from the start, not bolted on
- **Thin controllers, fat services** — route handlers parse/respond, services contain logic

---

## 🔗 Workflow Chain

**Skills Loaded (5):**

- `api-architect` - REST/GraphQL/tRPC design patterns and endpoint design
- `data-modeler` - Database schema design, Prisma ORM, migration strategy
- `nodejs-pro` - Node.js best practices, async patterns, framework selection
- `test-architect` - API testing strategies (unit, integration, coverage)
- `security-scanner` - OWASP Top 10 validation, security audit

```mermaid
graph LR
    A["/plan"] --> B["/api"]
    B --> C["/validate"]
    C --> D["/launch"]
    style B fill:#10b981
```

| After /api | Run | Purpose |
|------------|-----|---------|
| Need tests or CI | `/validate` | Run full test suite with coverage |
| Ready to deploy | `/launch` | Deploy API to production |
| Need frontend too | `/build` | Full-stack app with API + frontend |
| Security audit needed | `/inspect` | Deep security review (OWASP) |

**Handoff to /validate:**

```markdown
✅ API built with [X] endpoints, [Y] tests passing, OpenAPI docs generated.
Run `/validate` to execute full test suite with coverage report.
```
