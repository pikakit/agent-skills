---
title: "Versioning Strategies"
kind: decision
impact: high
tags: [api, versioning, compatibility]
applies_to: [api-architect]
last_reviewed: "2026-09-28"
sources:
  - title: The Sunset HTTP Header Field
    url: https://datatracker.ietf.org/doc/html/rfc8594
---

# Versioning Strategies

> Plan for API evolution from day one.

---

## Strategy Selection

| Strategy | Implementation | Best For | Trade-offs |
|----------|---------------|----------|------------|
| **URI** | `/v1/users` | Public APIs | Clear, easy caching; URL pollution |
| **Header** | `Accept-Version: 1` | Internal APIs | Clean URLs; harder discovery |
| **Query** | `?version=1` | Quick prototypes | Easy to add; messy, cache-unfriendly |
| **None** | Evolve carefully | GraphQL, tRPC | Simplest; risky for REST public APIs |

## Decision Guide

```
Is it a public REST API?
├── Yes → URI versioning (/v1/users)
│         Most discoverable, best tooling support
│
├── Internal REST only? → Header versioning
│         Cleaner URLs, version-aware clients
│
├── GraphQL? → No versioning (evolve schema)
│         Add fields, deprecate old ones
│
└── tRPC? → No versioning (types enforce compat)
          Breaking changes caught at compile time
```

## URI Versioning Example

```typescript
// Express — version in path
import { Router } from 'express';

const v1 = Router();
v1.get('/users', getUsersV1);
v1.get('/users/:id', getUserByIdV1);

const v2 = Router();
v2.get('/users', getUsersV2);        // Changed response format
v2.get('/users/:id', getUserByIdV2);

app.use('/api/v1', v1);
app.use('/api/v2', v2);
```

## Deprecation & Sunset

```typescript
// Deprecation headers (RFC 8594)
app.use('/api/v1', (req, res, next) => {
  res.set('Deprecation', 'true');
  res.set('Sunset', 'Sat, 01 Jun 2026 00:00:00 GMT');
  res.set('Link', '</api/v2>; rel="successor-version"');
  next();
});
```

**Sunset Policy:**
1. Announce deprecation with `Deprecation: true` header
2. Set `Sunset` date (minimum 6 months for public APIs)
3. Include `Link` header pointing to successor
4. Monitor usage — notify active consumers
5. Remove after sunset date

## Anti-Patterns

| ❌ Don't | ✅ Do |
|---------|-------|
| Version after breaking changes | Define strategy before first endpoint |
| Remove old version without notice | Sunset with 6+ months warning |
| Mix versioning strategies | Pick one approach |
| Version internal tRPC APIs | Let TypeScript catch breaking changes |

---

## 🔗 Related

| File | When to Read |
|------|-------------|
| [rest.md](rest.md) | REST endpoint design |
| [documentation.md](documentation.md) | Documenting versions |
| [api-style.md](api-style.md) | API style decision |

## Decision

Prefer additive compatible evolution. Introduce an explicit version boundary only when semantics cannot remain compatible, and pair deprecation with measurable consumer migration.

## Use When

Version a public contract for breaking schema, behavior, authentication, or lifecycle changes that cannot be negotiated safely.

## Avoid When

Avoid version bumps for additive fields, implementation refactors, or changes that can be represented through capability negotiation.

## Trade-offs

URI versions are visible and cache-friendly but duplicate routes. Header negotiation keeps identifiers stable but is less discoverable. Every concurrent version increases testing and operational cost.

## Verification

Run consumer contract tests across supported versions, publish deprecation and sunset metadata, monitor usage, and exercise rollback before removing compatibility code.
