---
name: nodejs-pro
description: >-
  Node.js development principles and decision-making. Framework selection (Hono/Fastify/Express/NestJS),
  async patterns, security, architecture.
  Triggers on: Node.js, Express, backend, server, API.
  Coordinates with: api-architect, data-modeler.
metadata:
  category: "framework"
  success_metrics: "server runs, no memory leaks"
  coordinates_with: "api-architect, data-modeler"
---

# Node.js Best Practices

> Principles and decision-making for Node.js development in 2025.
> **Learn to THINK, not memorize code patterns.**

## ⚠️ How to Use This Skill

This skill teaches **decision-making principles**, not fixed code to copy.

- ASK user for preferences when unclear
- Choose framework/pattern based on CONTEXT
- Don't default to same solution every time

## Quick References

| Topic                   | Reference                                                         |
| ----------------------- | ----------------------------------------------------------------- |
| Framework Selection     | [framework-selection.md](./references/framework-selection.md)     |
| Runtime & Module System | [runtime-modules.md](./references/runtime-modules.md)             |
| Architecture Patterns   | [architecture-patterns.md](./references/architecture-patterns.md) |
| Error Handling          | [error-handling.md](./references/error-handling.md)               |
| Async Patterns          | [async-patterns.md](./references/async-patterns.md)               |
| Validation & Security   | [validation-security.md](./references/validation-security.md)     |
| Testing Strategy        | [testing-strategy.md](./references/testing-strategy.md)           |

## Framework Decision Tree

```
What are you building?
├── Edge/Serverless → Hono (fastest cold starts)
├── High Performance API → Fastify (2-3x faster than Express)
├── Enterprise/Team → NestJS (structured, DI)
├── Legacy/Maximum ecosystem → Express
└── Full-stack → Next.js API Routes or tRPC
```

## Framework Comparison

| Factor         | Hono             | Fastify     | Express  |
| -------------- | ---------------- | ----------- | -------- |
| **Best for**   | Edge, serverless | Performance | Legacy   |
| **Cold start** | Fastest          | Fast        | Moderate |
| **TypeScript** | Native           | Excellent   | Good     |

## Decision Checklist

Before implementing:

- [ ] Asked user about stack preference?
- [ ] Chosen framework for THIS context?
- [ ] Considered deployment target?
- [ ] Planned error handling strategy?
- [ ] Identified validation points?
- [ ] Considered security requirements?

## Anti-Patterns

### ❌ DON'T:

- Use Express for new edge projects
- Use sync methods in production
- Put business logic in controllers
- Skip input validation
- Block event loop with CPU work

### ✅ DO:

- Choose framework based on context
- Use layered architecture for growing projects
- Validate all inputs
- Use environment variables for secrets

> **Remember**: Node.js best practices are about decision-making, not memorizing patterns.
