---
name: nodejs-pro
description: >-
  Node.js development principles and decision-making. Framework selection
  (Hono/Fastify/Express/NestJS), async patterns, security, architecture. Triggers on: Node.js,
  Express, backend, server, API.
metadata:
  author: pikakit
  version: "3.9.106"
---

# Node.js Pro â€” Backend Decision Framework

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
| Framework selection (5 options) | API design (â†’ api-architect) |
| Architecture routing | Database/ORM (â†’ data-modeler) |
| Async pattern guidance | TypeScript patterns (â†’ typescript-expert) |
| Error handling strategy | Performance profiling (â†’ perf-optimizer) |

**Expert decision skill:** Produces framework decisions and pattern guidance. Does not write code.

---

## Framework Decision Tree (Deterministic)

```
What are you building?
â”œâ”€â”€ Edge / Serverless â†’ Hono (fastest cold starts)
â”œâ”€â”€ High-performance API â†’ Fastify (2-3x faster than Express)
â”œâ”€â”€ Enterprise / Large team â†’ NestJS (structured, DI)
â”œâ”€â”€ Legacy / Max ecosystem â†’ Express
â””â”€â”€ Full-stack â†’ Next.js API Routes or tRPC
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
| Layered separation | Controllers â†’ Services â†’ Repositories |
| Event loop protection | CPU work â†’ worker threads |
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

| âŒ Don't | âœ… Do |
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

## Rule Categories by Priority

| Priority | Category | Impact | Prefix |
|----------|----------|--------|--------|
| 1 | Architecture | LOW | `architecture-` |
| 2 | Eliminating Waterfalls | LOW | `async-` |
| 3 | Engineering Spec | LOW | `engineering-` |
| 4 | Error | LOW | `error-` |
| 5 | Framework | LOW | `framework-` |
| 6 | Runtime | LOW | `runtime-` |
| 7 | Testing | LOW | `testing-` |
| 8 | Validation | LOW | `validation-` |

## Quick Reference

### 1. Architecture (LOW)

- `architecture-patterns` - Architecture Patterns

### 2. Eliminating Waterfalls (LOW)

- `async-patterns` - Async Patterns

### 3. Engineering Spec (LOW)

- `engineering-spec` - Node.js Pro â€” Engineering Specification

### 4. Error (LOW)

- `error-handling` - Error Handling

### 5. Framework (LOW)

- `framework-selection` - Framework Selection (2025)

### 6. Runtime (LOW)

- `runtime-modules` - Runtime & Module System

### 7. Testing (LOW)

- `testing-strategy` - Testing Strategy

### 8. Validation (LOW)

- `validation-security` - Validation & Security

## How to Use

Read individual rule files for detailed explanations and code examples:

```
rules/architecture-patterns.md
rules/async-patterns.md
```

Each rule file contains:
- Brief explanation of why it matters
- Incorrect code example with explanation
- Correct code example with explanation
- Additional context and references

## Full Compiled Document

For the complete guide with all rules expanded: `AGENTS.md`


## ðŸ“‘ Content Map

| File | Description | When to Read |
|------|-------------|--------------|
| [framework-selection.md](rules/framework-selection.md) | Framework decision criteria | Choosing framework |
| [runtime-modules.md](rules/runtime-modules.md) | Runtime & module system | Module decisions |
| [architecture-patterns.md](rules/architecture-patterns.md) | Architecture patterns | Structuring app |
| [error-handling.md](rules/error-handling.md) | Error handling patterns | Error strategy |
| [async-patterns.md](rules/async-patterns.md) | Async patterns | Async code |
| [validation-security.md](rules/validation-security.md) | Validation & security | Security planning |
| [testing-strategy.md](rules/testing-strategy.md) | Testing patterns | Test planning |
| [engineering-spec.md](rules/engineering-spec.md) | Full engineering spec | Architecture review |

**Selective reading:** Read ONLY the file relevant to current decision.

---

## ðŸ”— Related

| Item | Type | Purpose |
|------|------|---------|
| `api-architect` | Skill | API design |
| `data-modeler` | Skill | Database patterns |
| `typescript-expert` | Skill | TypeScript |

---

âš¡ PikaKit v3.9.106
