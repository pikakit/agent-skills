---
name: nodejs-pro
summary: >-
  Node.js development principles and decision-making. Framework selection (Hono/Fastify/Express/NestJS),
  async patterns, security, architecture.
  Triggers on: Node.js, Express, backend, server, API.
  Coordinates with: api-architect, data-modeler.
metadata:
  version: "2.0.0"
  category: "framework"
  triggers: "Node.js, Express, Fastify, Hono, backend, server, API"
  success_metrics: "framework selected, async-first, no sync in production, validated inputs"
  coordinates_with: "api-architect, data-modeler"
---

# Node.js Pro — Backend Decision Framework

> 5 frameworks. Async-first. Validate at boundary. No sync in production.

**Philosophy:** Learn to THINK, not memorize. Choose framework by context.

---

## When to Use

| Situation | Action |
|-----------|--------|
| Choosing Node.js framework | Use framework decision tree |
| Building API | Check framework comparison |
| Edge/serverless deployment | Consider Hono |
| Enterprise w/ large team | Consider NestJS |

---

## System Boundaries

| Owned by This Skill | NOT Owned |
|---------------------|-----------|
| Framework selection (5 options) | API design (→ api-architect) |
| Architecture routing | Database/ORM (→ data-modeler) |
| Async pattern guidance | TypeScript patterns (→ typescript-expert) |
| Error handling strategy | Performance profiling (→ perf-optimizer) |

**Expert decision skill:** Produces framework decisions and pattern guidance. Does not write code.

---

## Framework Decision Tree (Deterministic)

```
What are you building?
├── Edge / Serverless → Hono (fastest cold starts)
├── High-performance API → Fastify (2-3x faster than Express)
├── Enterprise / Large team → NestJS (structured, DI)
├── Legacy / Max ecosystem → Express
└── Full-stack → Next.js API Routes or tRPC
```

---

## Framework Comparison (Fixed)

| Factor | Hono | Fastify | Express | NestJS |
|--------|------|---------|---------|--------|
| **Best for** | Edge, serverless | Performance | Legacy | Enterprise |
| **Cold start** | Fastest | Fast | Moderate | Moderate |
| **TypeScript** | Native | Excellent | Good | Native |
| **Throughput** | Highest | High | Baseline | Moderate |

---

## Core Principles (Fixed)

| Principle | Enforcement |
|-----------|-------------|
| Async-first | No `*Sync()` methods in production |
| Validate at boundary | All inputs validated before business logic |
| Secrets via env vars | Never hardcode credentials |
| Layered separation | Controllers → Services → Repositories |
| Event loop protection | CPU work → worker threads |
| No `eval()` / `Function()` | Never in production |

---

## Error Taxonomy

| Code | Recoverable | Trigger |
|------|-------------|---------|
| `ERR_INVALID_REQUEST_TYPE` | No | Request type not supported |
| `ERR_UNKNOWN_TARGET` | Yes | Deployment target not recognized |
| `ERR_UNKNOWN_FRAMEWORK` | Yes | Framework not one of 5 |

**Zero internal retries.** Deterministic; same context = same recommendation.

---

## Anti-Patterns

| ❌ Don't | ✅ Do |
|---------|-------|
| Default to Express for new projects | Choose framework by deployment target |
| Use sync methods in production | Always use async/await |
| Put business logic in controllers | Use layered architecture |
| Skip input validation | Validate all inputs at boundary |
| Block event loop with CPU work | Use worker threads |
| Hardcode secrets | Use environment variables |

---

## Decision Checklist

- [ ] Asked user about stack preference?
- [ ] Chosen framework for THIS context (not default)?
- [ ] Considered deployment target (edge/container/VM)?
- [ ] Planned error handling strategy?
- [ ] Identified input validation points?
- [ ] Considered security requirements?

---

## 📑 Content Map

| File | Description | When to Read |
|------|-------------|--------------|
| [framework-selection.md](references/framework-selection.md) | Framework decision criteria | Choosing framework |
| [runtime-modules.md](references/runtime-modules.md) | Runtime & module system | Module decisions |
| [architecture-patterns.md](references/architecture-patterns.md) | Architecture patterns | Structuring app |
| [error-handling.md](references/error-handling.md) | Error handling patterns | Error strategy |
| [async-patterns.md](references/async-patterns.md) | Async patterns | Async code |
| [validation-security.md](references/validation-security.md) | Validation & security | Security planning |
| [testing-strategy.md](references/testing-strategy.md) | Testing patterns | Test planning |
| [engineering-spec.md](references/engineering-spec.md) | Full engineering spec | Architecture review |

**Selective reading:** Read ONLY the file relevant to current decision.

---

## 🔗 Related

| Item | Type | Purpose |
|------|------|---------|
| `api-architect` | Skill | API design |
| `data-modeler` | Skill | Database patterns |
| `typescript-expert` | Skill | TypeScript |

---

⚡ PikaKit v3.9.104
