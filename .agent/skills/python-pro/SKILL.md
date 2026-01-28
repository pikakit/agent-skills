---
name: python-pro
description: Python development principles and decision-making. Framework selection (FastAPI/Django/Flask), async patterns, type hints, project structure. Use when building Python APIs, backend services, or scripts. Teaches thinking, not copying.
---

# Python Patterns

> Python development principles and decision-making for 2025.
> **Learn to THINK, not memorize patterns.**

## ⚠️ How to Use This Skill

This skill teaches **decision-making principles**, not fixed code to copy.

- ASK user for framework preference when unclear
- Choose async vs sync based on CONTEXT
- Don't default to same framework every time

## Quick References

| Topic | Reference |
|-------|-----------|
| Framework Selection | [framework-selection.md](./references/framework-selection.md) |
| Async Patterns | [async-patterns.md](./references/async-patterns.md) |
| Type Hints | [type-hints.md](./references/type-hints.md) |
| Project Structure | [project-structure.md](./references/project-structure.md) |
| FastAPI Best Practices | [fastapi-patterns.md](./references/fastapi-patterns.md) |
| Django Best Practices | [django-patterns.md](./references/django-patterns.md) |
| Testing Strategy | [testing-patterns.md](./references/testing-patterns.md) |

## Framework Decision Tree

```
What are you building?
│
├── API-first / Microservices → FastAPI
├── Full-stack web / CMS / Admin → Django
├── Simple / Script / Learning → Flask
├── AI/ML API serving → FastAPI
└── Background workers → Celery + any
```

## Async vs Sync Decision

```
I/O-bound → async (waiting for external)
CPU-bound → sync + multiprocessing (computing)

Don't:
├── Mix sync and async carelessly
├── Use sync libraries in async code
└── Force async for CPU work
```

## Decision Checklist

Before implementing:

- [ ] Asked user about framework preference?
- [ ] Chosen framework for THIS context?
- [ ] Decided async vs sync?
- [ ] Planned type hint strategy?
- [ ] Defined project structure?
- [ ] Considered background tasks?

## Anti-Patterns

### ❌ DON'T:
- Default to Django for simple APIs
- Use sync libraries in async code
- Skip type hints for public APIs
- Put business logic in routes/views

### ✅ DO:
- Choose framework based on context
- Ask about async requirements
- Use Pydantic for validation
- Separate concerns (routes → services → repos)

> **Remember**: Python patterns are about decision-making for YOUR specific context.
