---
title: "API Style Selection"
kind: decision
impact: high
tags: [api, architecture, protocol]
applies_to: [api-architect]
last_reviewed: "2026-09-28"
sources:
  - title: OpenAPI Specification
    url: https://spec.openapis.org/oas/latest.html
---

# API Style Selection

> Choose API style for THIS project's context — don't default to REST.

---

## Decision Tree

```
Who are the API consumers?
│
├── Public API / Multiple platforms
│   └── REST + OpenAPI (widest compatibility)
│
├── Complex data needs / Multiple frontends
│   └── GraphQL (flexible queries)
│
├── TypeScript frontend + backend (monorepo)
│   └── tRPC (end-to-end type safety)
│
├── Real-time / Event-driven
│   └── WebSocket + AsyncAPI
│
└── Internal microservices
    └── gRPC (performance) or REST (simplicity)
```

## Comparison

| Factor | REST | GraphQL | tRPC |
|--------|------|---------|------|
| **Best for** | Public APIs | Complex apps | TS monorepos |
| **Learning curve** | Low | Medium | Low (if TS) |
| **Over/under fetching** | Common | Solved | Solved |
| **Type safety** | Manual (OpenAPI) | Schema-based | Automatic |
| **Caching** | HTTP native | Complex | Client-based |
| **File uploads** | Native | Complex | Needs adapter |
| **Versioning** | URI/Header | Schema evolution | Type inference |
| **Tooling maturity** | Excellent | Good | Growing |

## Code Comparison — Same Endpoint

### REST

```typescript
// GET /api/users/123
app.get('/api/users/:id', async (req, res) => {
  const user = await db.user.findUnique({ where: { id: req.params.id } });
  res.json({ data: user });
});
```

### GraphQL

```typescript
// query { user(id: "123") { name email } }
const resolvers = {
  Query: {
    user: (_: unknown, { id }: { id: string }) =>
      db.user.findUnique({ where: { id } }),
  },
};
```

### tRPC

```typescript
// client.user.getById.query("123")
export const userRouter = router({
  getById: publicProcedure
    .input(z.string())
    .query(({ input }) => db.user.findUnique({ where: { id: input } })),
});
```

## Anti-Patterns

| ❌ Don't | ✅ Do |
|---------|-------|
| Default to REST for every project | Evaluate consumers + context first |
| Mix API styles without justification | Pick one, document reasoning |
| Choose GraphQL for simple CRUD | Use REST or tRPC for simple cases |
| Use tRPC for public APIs | Use REST + OpenAPI for public APIs |

## Selection Questions

1. Who are the API consumers? (web, mobile, third-party, internal)
2. Is the frontend TypeScript?
3. How complex are the data relationships?
4. Is HTTP caching critical?
5. Public or internal API?

---

## 🔗 Related

| File | When to Read |
|------|-------------|
| [rest.md](rest.md) | REST endpoint design |
| [graphql.md](graphql.md) | GraphQL schema design |
| [trpc.md](trpc.md) | tRPC for TS monorepos |
| [SKILL.md](../SKILL.md) | Full decision framework |

## Decision

Select an API style from consumer diversity, contract needs, query shape, ownership, and compatibility constraints. Keep public interoperability separate from internal implementation convenience.

## Use When

Use REST with an OpenAPI contract for broadly interoperable HTTP APIs. Consider GraphQL for consumer-selected graph projections with mature query controls. Consider tRPC only inside a tightly coupled TypeScript trust and release boundary.

## Avoid When

Avoid defaulting to one style, exposing database shape directly, or mixing styles without explicit ownership and gateway policy.

## Trade-offs

REST favors HTTP interoperability, GraphQL favors query flexibility with added operational controls, and tRPC favors compile-time coupling within TypeScript systems.

## Verification

Prototype the highest-risk consumer flow and verify contract generation, authorization, caching, observability, compatibility, and failure behavior.
