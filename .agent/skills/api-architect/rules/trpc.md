---
title: "tRPC Principles"
kind: decision
impact: standard
tags: [api, trpc, typescript]
applies_to: [api-architect]
last_reviewed: "2026-09-28"
sources:
  - title: PikaKit production skill rubric
    internal_ref: ../../../standards/PRODUCTION_RUBRIC.md
---

# tRPC Principles

> End-to-end type safety for TypeScript monorepos — zero code generation.

---

## When to Use

```
✅ Perfect fit:
├── TypeScript on both ends
├── Monorepo structure
├── Internal tools / dashboards
├── Rapid development
└── Type safety is critical

❌ Poor fit:
├── Non-TypeScript clients
├── Public API (need OpenAPI docs)
├── Need REST conventions (caching)
└── Multiple language backends
```

## Router Definition

```typescript
// server/trpc.ts — Base setup
import { initTRPC, TRPCError } from '@trpc/server';
import { z } from 'zod';

const t = initTRPC.context<Context>().create();

export const router = t.router;
export const publicProcedure = t.procedure;
export const protectedProcedure = t.procedure.use(isAuthed);
```

```typescript
// server/routers/user.ts — Router with Zod validation
export const userRouter = router({
  getById: publicProcedure
    .input(z.string().uuid())
    .query(async ({ input, ctx }) => {
      const user = await ctx.db.user.findUnique({ where: { id: input } });
      if (!user) throw new TRPCError({ code: 'NOT_FOUND' });
      return user;
    }),

  create: protectedProcedure
    .input(z.object({
      name: z.string().min(1).max(100),
      email: z.string().email(),
      role: z.enum(['user', 'admin']).default('user'),
    }))
    .mutation(async ({ input, ctx }) => {
      return ctx.db.user.create({ data: input });
    }),

  list: publicProcedure
    .input(z.object({
      page: z.number().int().min(1).default(1),
      limit: z.number().int().min(1).max(100).default(20),
    }))
    .query(async ({ input, ctx }) => {
      const { page, limit } = input;
      const [data, total] = await Promise.all([
        ctx.db.user.findMany({ skip: (page - 1) * limit, take: limit }),
        ctx.db.user.count(),
      ]);
      return { data, total, totalPages: Math.ceil(total / limit) };
    }),
});
```

## Client Usage (React Query)

```typescript
// Client — fully typed, zero codegen
import { trpc } from '~/utils/trpc';

function UserProfile({ id }: { id: string }) {
  const { data: user } = trpc.user.getById.useQuery(id);
  const createUser = trpc.user.create.useMutation();

  // Autocomplete works across the full stack
  return <div>{user?.name}</div>;
}
```

## Integration Patterns

| Setup | Framework | Notes |
|-------|-----------|-------|
| Next.js + tRPC | `@trpc/next` | App Router + RSC support |
| Remix + tRPC | Custom adapter | Less common |
| Monorepo | Shared `@repo/trpc` package | Most scalable |
| Standalone | Express adapter | `@trpc/server/adapters/express` |

## Anti-Patterns

| ❌ Don't | ✅ Do |
|---------|-------|
| Use tRPC for public APIs | Use REST + OpenAPI for public |
| Skip Zod validation | Always validate with `.input(z.object(...))` |
| Put all routes in one file | Split into domain routers (`userRouter`, `postRouter`) |
| Catch errors silently | Throw `TRPCError` with proper codes |

---

## 🔗 Related

| File | When to Read |
|------|-------------|
| [api-style.md](api-style.md) | REST vs GraphQL vs tRPC decision |
| [auth.md](auth.md) | Auth middleware patterns |
| [SKILL.md](../SKILL.md) | Full decision framework |

## Decision

Use tRPC only when client and server share TypeScript contracts, release coordination, and a compatible trust boundary. Keep domain logic and authorization independent from router types.

## Use When

Use it for internal or tightly coordinated TypeScript applications where end-to-end inference materially improves delivery and runtime validation remains explicit.

## Avoid When

Avoid it for public multi-language APIs, independently versioned consumers, or contracts that require standards-based external tooling.

## Trade-offs

Inference reduces duplicated types but increases framework and release coupling. Runtime validation and compatibility planning remain necessary.

## Verification

Test runtime input validation, authorization, error mapping, serialization, cancellation, compatibility, and behavior from a built client using the published contract.
