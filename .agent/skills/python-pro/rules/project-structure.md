---
name: project-structure
description: Python project structure — directory layouts for small/medium/large apps, FastAPI vs Django, pyproject.toml
title: "Project Structure"
impact: MEDIUM
impactDescription: "Moderate improvement to quality or maintainability"
tags: project, structure
---

# Project Structure

> Structure by size. Feature-based for large apps. Layer-based for small.

---

## By Project Size

### Small (Script / Tool)

```
myapp/
├── main.py
├── utils.py
├── pyproject.toml
└── README.md
```

### Medium (API / Service)

```
myapp/
├── app/
│   ├── __init__.py
│   ├── main.py              # App entry + lifespan
│   ├── config.py             # Pydantic Settings
│   ├── dependencies.py       # Shared DI (db session, auth)
│   ├── models/               # SQLAlchemy / DB models
│   │   ├── __init__.py
│   │   └── user.py
│   ├── schemas/              # Pydantic request/response
│   │   ├── __init__.py
│   │   └── user.py
│   ├── routes/               # API routes
│   │   ├── __init__.py
│   │   └── users.py
│   └── services/             # Business logic
│       ├── __init__.py
│       └── user_service.py
├── tests/
│   ├── conftest.py           # Shared fixtures
│   ├── test_users.py
│   └── test_services.py
├── alembic/                  # DB migrations
├── pyproject.toml
├── .env.example
└── README.md
```

### Large (Monolith / Multiple Domains)

```
src/
└── myapp/
    ├── core/                 # Shared kernel
    │   ├── config.py
    │   ├── database.py
    │   ├── security.py
    │   └── exceptions.py
    ├── users/                # Feature module
    │   ├── models.py
    │   ├── schemas.py
    │   ├── routes.py
    │   ├── service.py
    │   └── repository.py
    ├── products/             # Feature module
    │   └── ...
    └── main.py
tests/
├── users/
├── products/
└── conftest.py
pyproject.toml
```

---

## FastAPI Entry Point

```python
# app/main.py
from contextlib import asynccontextmanager
from fastapi import FastAPI
from app.config import settings
from app.routes import users, products

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    await database.connect()
    yield
    # Shutdown
    await database.disconnect()

app = FastAPI(
    title=settings.app_name,
    version="1.0.0",
    lifespan=lifespan,
)

app.include_router(users.router, prefix="/api/v1/users", tags=["users"])
app.include_router(products.router, prefix="/api/v1/products", tags=["products"])
```

---

## Django Structure

```
myproject/
├── manage.py
├── myproject/
│   ├── __init__.py
│   ├── settings/
│   │   ├── __init__.py
│   │   ├── base.py           # Shared settings
│   │   ├── dev.py            # Development
│   │   └── prod.py           # Production
│   ├── urls.py
│   └── wsgi.py / asgi.py
├── users/                    # Django app
│   ├── models.py
│   ├── views.py / viewsets.py
│   ├── serializers.py
│   ├── urls.py
│   ├── admin.py
│   ├── tests.py
│   └── migrations/
├── products/                 # Django app
│   └── ...
└── requirements/
    ├── base.txt
    ├── dev.txt
    └── prod.txt
```

---

## Background Tasks Selection

| Solution | Best For | Async | Persistence |
|----------|----------|:-----:|:-----------:|
| **BackgroundTasks** (FastAPI) | Quick, in-process | ✅ | ❌ |
| **Celery** | Distributed workflows | ❌ | ✅ |
| **ARQ** | Async + Redis | ✅ | ✅ |
| **Dramatiq** | Actor-based | ❌ | ✅ |
| **RQ** | Simple Redis queue | ❌ | ✅ |

---

## Anti-Patterns

| ❌ Don't | ✅ Do |
|---------|-------|
| Flat file dump (all in root) | Organize by feature/layer |
| Business logic in routes | Routes → services → repos |
| `settings.py` with hardcoded values | Pydantic Settings + `.env` |
| Skip `__init__.py` | Always include (explicit packages) |

---

## 🔗 Related

| File | When to Read |
|------|-------------|
| [framework-selection.md](framework-selection.md) | Which framework |
| [fastapi-patterns.md](fastapi-patterns.md) | FastAPI specifics |
| [django-patterns.md](django-patterns.md) | Django specifics |
