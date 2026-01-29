---
description: REST/GraphQL/tRPC API builder with OpenAPI docs, Prisma ORM, and comprehensive testing
---

# API Development Workflow

Build production-ready APIs with comprehensive design, implementation, and testing.

## 🎯 Purpose

This workflow uses the **api-development** chain to create well-architected APIs with:

- RESTful or GraphQL design
- Database schema design
- API testing automation
- Security validation
- Best practices enforcement

## 🤖 Meta-Agents Integration

| Phase | Agent | Action |
| ----- | ----- | ------ |
| **Pre-Build** | `assessor` | Evaluate API complexity and risk |
| **Pre-Build** | `recovery` | Save existing API state |
| **Conflict** | `critic` | Resolve REST vs GraphQL decisions |
| **Post-Build** | `learner` | Learn API patterns for reuse |

```
Flow:
assessor.evaluate(api_scope) → risk level
       ↓
recovery.save(existing_api) → backup
       ↓
build → test → learner.log(patterns)
```

---

## 🔗 Chain: api-development

**Skills Loaded (5):**

- `api-architect` - REST/GraphQL/tRPC design patterns
- `data-modeler` - Database schema and optimization
- `nodejs-pro` - Node.js best practices and async patterns
- `test-architect` - API testing strategies (unit, integration, E2E)
- `security-scanner` - API security validation (OWASP)

## 📖 Usage

```bash
/api <description>
```

### Examples

```bash
# REST API
/api user management REST API with Express and Prisma

# GraphQL API
/api GraphQL API for e-commerce with Apollo Server

# Microservice
/api payments microservice with Stripe integration

# Full specification
/api blog API
Requirements:
- RESTful design
- PostgreSQL with Prisma
- JWT authentication
- Rate limiting
- Comprehensive tests
```

## 🔄 Workflow Steps

This workflow automatically:

1. **API Design**
   - Define endpoints/schema
   - Choose RESTful or GraphQL
   - Design request/response formats

2. **Database Schema**
   - Design data model
   - Define relationships
   - Plan migrations

3. **Implementation**
   - Implement routes/resolvers
   - Add validation
   - Error handling

4. **Testing**
   - Unit tests for logic
   - Integration tests for endpoints
   - E2E tests for flows

5. **Security**
   - Authentication/authorization
   - Input validation
   - Rate limiting
   - OWASP checks

6. **Documentation**
   - API documentation
   - OpenAPI/GraphQL schema
   - Usage examples

## 🎨 Supported Patterns

### REST APIs

- Express.js, Fastify, NestJS
- OpenAPI/Swagger
- Versioning strategies

### GraphQL

- Apollo Server, GraphQL Yoga
- Schema-first or code-first
- Resolvers, dataloaders

### tRPC

- Type-safe APIs
- End-to-end typing
- Next.js integration

### Real-time

- WebSockets
- Server-Sent Events
- Polling strategies

## ✅ Best Practices Applied

✓ **Design First** - Plan before implementation
✓ **Type Safety** - TypeScript throughout
✓ **Validation** - Input/output validation
✓ **Error Handling** - Consistent error responses
✓ **Testing** - Comprehensive test coverage
✓ **Security** - OWASP Top 10 compliance
✓ **Documentation** - Auto-generated docs
✓ **Performance** - Caching, pagination

## 🔍 Related Workflows

- `/build` - Full-stack app with API + frontend
- `/inspect` - Security audit for existing API
- `/validate` - Run API tests
- `/launch` - Deploy API to production

## 💡 Tips

**When to use `/api`:**

- API-only projects
- Microservices
- Backend services
- Mobile app backends

**When to use `/build` instead:**

- Full-stack applications
- API + frontend together
- Monolithic apps

## 📚 Example Output

```bash
You: "/api user management REST API with Express and Prisma"

Agent: Loading api-development chain
       ↓
Skills: api-architect, data-modeler, nodejs-pro, test-architect, security-scanner
       ↓

Creates:
✓ src/
  ├── routes/
  │   ├── auth.routes.ts
  │   ├── users.routes.ts
  │   └── index.ts
  ├── controllers/
  │   ├── auth.controller.ts
  │   └── users.controller.ts
  ├── services/
  │   └── user.service.ts
  ├── middleware/
  │   ├── auth.middleware.ts
  │   └── validation.middleware.ts
  └── tests/
      ├── auth.test.ts
      └── users.test.ts
✓ prisma/
  └── schema.prisma
✓ API documentation (OpenAPI)
✓ Postman collection
✓ README with setup instructions
```

---

**Version:** 1.0.0  
**Chain:** api-development  
**Added:** v3.3.0
