---
title: "GraphQL Principles"
kind: decision
impact: high
tags: [api, graphql, security]
applies_to: [api-architect]
last_reviewed: "2026-09-28"
sources:
  - title: OWASP GraphQL Cheat Sheet
    url: https://cheatsheetseries.owasp.org/cheatsheets/GraphQL_Cheat_Sheet.html
---

# GraphQL Principles

> Flexible queries for complex, interconnected data.

---

## When to Use

```
✅ Good fit:
├── Complex, interconnected data
├── Multiple frontend platforms
├── Clients need flexible queries
├── Evolving data requirements
└── Reducing over-fetching matters

❌ Poor fit:
├── Simple CRUD operations
├── File upload heavy
├── HTTP caching important
└── Team unfamiliar with GraphQL
```

## Schema Design

```graphql
# Think in graphs, not endpoints
type User {
  id: ID!
  name: String!
  email: String!
  posts(first: Int = 10, after: String): PostConnection!
  createdAt: DateTime!
}

type Post {
  id: ID!
  title: String!
  content: String!
  author: User!
}

# Relay-style pagination (recommended)
type PostConnection {
  edges: [PostEdge!]!
  pageInfo: PageInfo!
  totalCount: Int!
}

type PostEdge {
  node: Post!
  cursor: String!
}

type PageInfo {
  hasNextPage: Boolean!
  hasPreviousPage: Boolean!
  startCursor: String
  endCursor: String
}
```

## Resolver Pattern

```typescript
const resolvers = {
  Query: {
    user: (_: unknown, { id }: { id: string }, ctx: Context) =>
      ctx.dataSources.users.getById(id),

    users: (_: unknown, args: PaginationArgs, ctx: Context) =>
      ctx.dataSources.users.getConnection(args),
  },

  // Field resolver — handles N+1 via DataLoader
  User: {
    posts: (parent: User, args: PaginationArgs, ctx: Context) =>
      ctx.dataSources.posts.getByAuthor(parent.id, args),
  },
};
```

## N+1 Prevention — DataLoader

```typescript
import DataLoader from 'dataloader';

// Batch function: receives array of IDs, returns array of results
const userLoader = new DataLoader<string, User>(async (ids) => {
  const users = await db.user.findMany({ where: { id: { in: [...ids] } } });
  const map = new Map(users.map(u => [u.id, u]));
  return ids.map(id => map.get(id)!);
});

// In resolver — automatically batched
const resolvers = {
  Post: {
    author: (post: Post) => userLoader.load(post.authorId),
  },
};
```

## Security

| Threat | Mitigation |
|--------|-----------|
| Query depth attack | Set max depth (e.g., 7) |
| Query complexity | Calculate cost per field, set max |
| Batching abuse | Limit batch size |
| Introspection leak | Disable in production |
| Field-level auth | Check permissions per resolver |

```typescript
// Query depth + complexity limits
const server = new ApolloServer({
  validationRules: [
    depthLimit(7),
    costAnalysis({ maximumCost: 1000 }),
  ],
  introspection: process.env.NODE_ENV !== 'production',
});
```

## Anti-Patterns

| ❌ Don't | ✅ Do |
|---------|-------|
| Expose database schema directly | Design schema for clients |
| One mega-query resolver | Keep resolvers small + composable |
| Skip DataLoader | Always use DataLoader for relations |
| Allow unlimited query depth | Set max depth (7) + cost limits |

---

## 🔗 Related

| File | When to Read |
|------|-------------|
| [api-style.md](api-style.md) | REST vs GraphQL vs tRPC decision |
| [security-testing.md](security-testing.md) | GraphQL security testing |
| [SKILL.md](../SKILL.md) | Full decision framework |

## Decision

Adopt GraphQL when consumers need controlled graph-shaped projections and the team can operate schema evolution, field-level authorization, batching, cost controls, and observability.

## Use When

Use it for multiple consumers with materially different but related data needs and a governed schema owned independently from persistence.

## Avoid When

Avoid it for simple resource APIs, uncontrolled public query execution, bulk file transfer, or teams without resolver and query-cost operations.

## Trade-offs

Client flexibility can reduce endpoint proliferation, but shifts complexity to schema governance, cache strategy, resolver performance, authorization, and abuse prevention.

## Verification

Test field and object authorization, depth/complexity limits, batching, pagination, nullability, schema compatibility, introspection policy, and sensitive error redaction.
