---
name: python-pro
description: >-
  Python development principles and decision-making. Framework selection (FastAPI/Django/Flask),
  async patterns, type hints, project structure.
  Triggers on: Python, pip, FastAPI, Django, Flask.
  Coordinates with: test-architect, api-architect.
metadata:
  version: "2.0.0"
  category: "framework"
  triggers: "Python, pip, FastAPI, Django, Flask, async"
  success_metrics: "framework selected, type hints complete, tests pass"
  coordinates_with: "test-architect, api-architect"
---

# Python Pro â€” Framework Selection & Architecture

> Decision-making principles. Not patterns to copy. Ask, classify, decide.

---

## When to Use

| Situation | Approach |
|-----------|----------|
| Choosing Python framework | Use decision tree |
| API-first / microservices | Consider FastAPI |
| Full-stack web / CMS | Consider Django |
| Async vs sync decision | Check I/O vs CPU classification |

---

## System Boundaries

| Owned by This Skill | NOT Owned |
|---------------------|-----------|
| Framework selection (5 branches) | API design (â†’ api-architect) |
| Async/sync classification | Testing strategy (â†’ test-architect) |
| Type hint rules | Database schema (â†’ data-modeler) |
| Architecture layering | Code implementation |

**Expert decision skill:** Produces recommendations. Does not write code.

---

## Framework Decision Tree (Deterministic)

```
What are you building?
â”‚
â”œâ”€â”€ API-first / Microservices  â†’ FastAPI
â”œâ”€â”€ Full-stack web / CMS       â†’ Django
â”œâ”€â”€ Simple / Script / Learning â†’ Flask
â”œâ”€â”€ AI/ML API serving          â†’ FastAPI
â””â”€â”€ Background workers         â†’ Celery + any
```

**If user has explicit preference â†’ respect it.** Ask when unclear.

---

## Async vs Sync (Deterministic)

| Workload | Decision | Rationale |
|----------|----------|-----------|
| I/O-bound (HTTP, DB, file) | `async` | Waiting for external |
| CPU-bound (compute) | `sync` + multiprocessing | Number crunching |
| Mixed | Async with sync offload | `run_in_executor` |

**Constraints:** Never use sync libraries in async code. Never force async for CPU work.

---

## Architecture Layering (Fixed)

```
Routes (HTTP handlers)
  â””â†’ Services (business logic)
      â””â†’ Repositories (data access)
```

**Rule:** No business logic in routes/views. Routes delegate to services.

---

## Type Hints & Validation (Mandatory)

| Rule | Scope |
|------|-------|
| Type hints on all public APIs | Functions, methods, return types |
| Pydantic for validation | All input/output boundaries |
| No `Any` in public signatures | Use specific types or generics |

---

## Decision Checklist

- [ ] Asked user about framework preference?
- [ ] Chosen framework for THIS context?
- [ ] Decided async vs sync?
- [ ] Planned type hint strategy?
- [ ] Defined project structure?
- [ ] Considered background tasks (Celery)?

---

## Error Taxonomy

| Code | Recoverable | Trigger |
|------|-------------|---------|
| `ERR_INVALID_REQUEST_TYPE` | No | Request type not supported |
| `ERR_UNKNOWN_PROJECT_TYPE` | Yes | Project type not one of 5 |
| `ERR_UNKNOWN_FRAMEWORK` | Yes | Framework not fastapi/django/flask |

**Zero internal retries.** Same context = same recommendation.

---

## Anti-Patterns

| âŒ Don't | âœ… Do |
|---------|-------|
| Default to Django for simple APIs | Choose framework per context |
| Use sync libraries in async code | Use async-compatible libraries |
| Skip type hints on public APIs | Annotate all public functions |
| Put business logic in routes/views | Separate: routes â†’ services â†’ repos |
| Always pick the same framework | Ask user, evaluate context |

---

## ðŸ“‘ Content Map

| File | Description | When to Read |
|------|-------------|--------------|
| [framework-selection.md](rules/framework-selection.md) | Framework comparison | Choosing framework |
| [async-patterns.md](rules/async-patterns.md) | Async/sync patterns | Concurrency decisions |
| [type-hints.md](rules/type-hints.md) | Type annotation rules | Type strategy |
| [project-structure.md](rules/project-structure.md) | Directory layouts | New project |
| [fastapi-patterns.md](rules/fastapi-patterns.md) | FastAPI specifics | FastAPI project |
| [django-patterns.md](rules/django-patterns.md) | Django specifics | Django project |
| [testing-patterns.md](rules/testing-patterns.md) | Python testing | Writing tests |
| [engineering-spec.md](rules/engineering-spec.md) | Full spec | Architecture review |

**Selective reading:** Load ONLY the reference file matching your current decision.

---

## ðŸ”— Related

| Item | Type | Purpose |
|------|------|---------|
| `api-architect` | Skill | API design |
| `test-architect` | Skill | Testing |
| `data-modeler` | Skill | Database |

---

âš¡ PikaKit v3.9.105
