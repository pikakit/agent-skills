# Python Pro Full Agent Rules

> Deterministic compilation of 8 source rules for python-pro v4.0.0. Do not edit directly.

## Rule Index

- [Python Async and Cancellation Patterns](#rule-async-patterns) (high, reference, source: `rules/async-patterns.md`)
- [Django Service Patterns](#rule-django-patterns) (high, reference, source: `rules/django-patterns.md`)
- [Python Service Architecture Decision](#rule-engineering-spec) (high, decision, source: `rules/engineering-spec.md`)
- [FastAPI Service Patterns](#rule-fastapi-patterns) (high, reference, source: `rules/fastapi-patterns.md`)
- [Python Framework Selection](#rule-framework-selection) (high, reference, source: `rules/framework-selection.md`)
- [Python Project Structure](#rule-project-structure) (standard, reference, source: `rules/project-structure.md`)
- [Python Testing Patterns](#rule-testing-patterns) (high, reference, source: `rules/testing-patterns.md`)
- [Python Type Contracts and Validation](#rule-type-hints) (high, reference, source: `rules/type-hints.md`)

<a id="rule-async-patterns"></a>

## Python Async and Cancellation Patterns

**Impact:** high
**Kind:** reference
**Source:** `rules/async-patterns.md`

# Python Async Patterns

> I/O-bound → async. CPU-bound → sync + multiprocessing. Never mix carelessly.

## Scope

Apply to structured concurrency, task ownership, cancellation, deadlines, blocking calls, and CPU-bound work in Python.

## Guidance

---

## When to Use

| Workload | Decision | Example |
|----------|----------|---------|
| I/O-bound | `async def` | DB queries, HTTP calls, file I/O |
| CPU-bound | `def` + multiprocessing | ML inference, image processing |
| Mixed | Async + `run_in_executor` | Web scraping + parsing |

---

## Core Patterns

### Basic Async Function

```python
import asyncio
import httpx

async def fetch_user(user_id: int) -> dict:
    async with httpx.AsyncClient() as client:
        response = await client.get(f"https://api.example.com/users/{user_id}")
        response.raise_for_status()
        return response.json()
```

### Concurrent Execution (asyncio.gather)

```python
async def fetch_all_users(user_ids: list[int]) -> list[dict]:
    """Fetch multiple users concurrently — much faster than sequential."""
    async with httpx.AsyncClient() as client:
        tasks = [
            client.get(f"https://api.example.com/users/{uid}")
            for uid in user_ids
        ]
        responses = await asyncio.gather(*tasks, return_exceptions=True)

    results = []
    for resp in responses:
        if isinstance(resp, Exception):
            continue  # Skip failed requests
        results.append(resp.json())
    return results
```

### TaskGroup (Python 3.11+, preferred)

```python
async def fetch_all_users_v2(user_ids: list[int]) -> list[dict]:
    """TaskGroup: structured concurrency with automatic cancellation on failure."""
    results: list[dict] = []

    async with asyncio.TaskGroup() as tg:
        async def fetch_one(uid: int):
            async with httpx.AsyncClient() as client:
                resp = await client.get(f"https://api.example.com/users/{uid}")
                results.append(resp.json())

        for uid in user_ids:
            tg.create_task(fetch_one(uid))

    return results
```

### CPU-Bound Offload (run_in_executor)

```python
import asyncio
from concurrent.futures import ProcessPoolExecutor

# CPU-heavy work runs in separate process
def compute_hash(data: bytes) -> str:
    import hashlib
    return hashlib.sha256(data).hexdigest()

async def process_file(file_path: str) -> str:
    """Offload CPU work to avoid blocking the event loop."""
    loop = asyncio.get_event_loop()
    data = await asyncio.to_thread(open(file_path, 'rb').read)

    with ProcessPoolExecutor() as pool:
        result = await loop.run_in_executor(pool, compute_hash, data)
    return result
```

---

## Async Library Selection

| Need | Sync Library | Async Library |
|------|-------------|---------------|
| HTTP client | requests | **httpx** |
| PostgreSQL | psycopg2 | **asyncpg** / psycopg3 async |
| MySQL | mysql-connector | **aiomysql** |
| Redis | redis-py (sync) | **redis-py** (async mode) / aioredis |
| File I/O | open() | **aiofiles** |
| ORM | SQLAlchemy sync | **SQLAlchemy 2.0** async / **Tortoise** |
| MongoDB | pymongo | **motor** |
| WebSockets | — | **websockets** |

---

## FastAPI: async def vs def

```python
from fastapi import FastAPI

app = FastAPI()

# ✅ Use async def — for I/O-bound with async drivers
@app.get("/users/{user_id}")
async def get_user(user_id: int):
    user = await db.fetch_one("SELECT * FROM users WHERE id = $1", user_id)
    return user

# ✅ Use def — for sync operations (FastAPI runs in threadpool automatically)
@app.get("/report")
def generate_report():
    # This blocks, but FastAPI handles it in a thread
    return create_pdf_report()

# ❌ Don't — use sync DB driver in async def (blocks event loop!)
@app.get("/bad")
async def bad_example():
    user = db.execute("SELECT ...")  # BLOCKS the entire event loop!
    return user
```

---

## Anti-Patterns

| ❌ Don't | ✅ Do |
|---------|-------|
| Use `requests` in async code | Use `httpx` (async) |
| `await` CPU-bound functions | Use `run_in_executor` |
| Sync DB driver in `async def` | Use async driver or `def` |
| `time.sleep()` in async | `await asyncio.sleep()` |
| Create event loop inside async | Use `asyncio.get_event_loop()` |

---

## Verification

Test cancellation propagation, timeout, TaskGroup failure, blocking-call isolation, and executor shutdown. Enable asyncio debug diagnostics in non-production tests and measure event-loop responsiveness under representative concurrency.

## Related

| File | When to Read |
|------|-------------|
| [fastapi-patterns.md](fastapi-patterns.md) | FastAPI async specifics |
| [framework-selection.md](framework-selection.md) | Framework decision |
| [testing-patterns.md](testing-patterns.md) | Testing async code |

---

⚡ PikaKit v3.9.224

<a id="rule-django-patterns"></a>

## Django Service Patterns

**Impact:** high
**Kind:** reference
**Source:** `rules/django-patterns.md`

# Django Patterns

> Fat models, thin views. Use managers for queries. DRF for APIs.

## Scope

Apply to Django models, querysets, views, transactions, async boundaries, migrations, security, and operational lifecycle.

## Guidance

---

## Model Design

```python
from django.db import models
from django.utils import timezone

class UserManager(models.Manager):
    """Custom manager — encapsulate common queries."""
    def active(self):
        return self.filter(is_active=True)

    def recently_joined(self, days: int = 7):
        cutoff = timezone.now() - timezone.timedelta(days=days)
        return self.filter(created_at__gte=cutoff, is_active=True)

class User(models.Model):
    email = models.EmailField(unique=True)
    name = models.CharField(max_length=100)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    objects = UserManager()

    class Meta:
        ordering = ["-created_at"]
        indexes = [models.Index(fields=["email"])]

    def __str__(self) -> str:
        return self.name

    @property
    def display_name(self) -> str:
        """Business logic belongs in model, not views."""
        return self.name or self.email.split("@")[0]
```

---

## DRF Serializers

```python
from rest_framework import serializers

class UserSerializer(serializers.ModelSerializer):
    display_name = serializers.CharField(read_only=True)

    class Meta:
        model = User
        fields = ["id", "email", "name", "display_name", "created_at"]
        read_only_fields = ["id", "created_at"]

class UserCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["email", "name", "password"]
        extra_kwargs = {"password": {"write_only": True}}

    def create(self, validated_data):
        return User.objects.create_user(**validated_data)
```

---

## Views / ViewSets

```python
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.active()
    serializer_class = UserSerializer

    def get_serializer_class(self):
        if self.action == "create":
            return UserCreateSerializer
        return UserSerializer

    @action(detail=False, methods=["get"])
    def recent(self, request):
        """Custom action: GET /users/recent/"""
        users = User.objects.recently_joined()
        serializer = self.get_serializer(users, many=True)
        return Response(serializer.data)
```

---

## Django Async Views (5.0+)

```python
# Async function-based view
from django.http import JsonResponse
import httpx

async def external_api_view(request):
    """Use async for I/O-bound views."""
    async with httpx.AsyncClient() as client:
        response = await client.get("https://api.example.com/data")
    return JsonResponse(response.json())

# ASGI deployment required:
# uvicorn myproject.asgi:application --workers 4
```

---

## Query Optimization

```python
# ❌ N+1 Problem
users = User.objects.all()
for user in users:
    print(user.profile.bio)      # Each access = 1 query!
    print(user.posts.count())    # Each access = 1 query!

# ✅ Fix: select_related (ForeignKey / OneToOne)
users = User.objects.select_related("profile").all()

# ✅ Fix: prefetch_related (ManyToMany / Reverse FK)
users = User.objects.prefetch_related("posts").all()

# ✅ Select specific fields
users = User.objects.only("id", "email", "name").all()

# ✅ Annotate counts without extra queries
from django.db.models import Count
users = User.objects.annotate(post_count=Count("posts")).all()
```

---

## Signals (Use Sparingly)

```python
from django.db.models.signals import post_save
from django.dispatch import receiver

@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    """Auto-create profile when user is created."""
    if created:
        Profile.objects.create(user=instance)

# Register in apps.py:
# class UsersConfig(AppConfig):
#     def ready(self):
#         import users.signals
```

---

## Anti-Patterns

| ❌ Don't | ✅ Do |
|---------|-------|
| Business logic in views | Fat models, thin views |
| Raw SQL everywhere | Use ORM + managers |
| Forget `select_related` | Profile queries, fix N+1 |
| Overuse signals | Prefer explicit service calls |
| `settings.py` monolith | Split: base/dev/prod |
| Skip migrations | Always `makemigrations` + `migrate` |

---

## Verification

Run system checks, migration checks, query-count tests, authorization tests, and supported deployment checks. Test transaction rollback, asynchronous boundaries, startup, shutdown, and recovery using the target Django version.

## Related

| File | When to Read |
|------|-------------|
| [framework-selection.md](framework-selection.md) | Why Django |
| [project-structure.md](project-structure.md) | Django directory layout |
| [testing-patterns.md](testing-patterns.md) | Testing Django |
| [async-patterns.md](async-patterns.md) | Async in Django |

---

⚡ PikaKit v3.9.224

<a id="rule-engineering-spec"></a>

## Python Service Architecture Decision

**Impact:** high
**Kind:** decision
**Source:** `rules/engineering-spec.md`

# Python Service Architecture Decision

## Decision

Choose Django for an integrated data-backed product, FastAPI for a typed ASGI API, and a smaller library or standard-library entry point for bounded utilities. Separate transport, domain, persistence, and integrations. Type public contracts, validate external data, isolate blocking work, and make startup/shutdown explicit.

## Use When

- Starting or restructuring a Python web service, worker, or operational tool.
- Selecting a framework, async model, package layout, or validation boundary.
- Hardening typing, dependency management, tests, and lifecycle behavior.

## Avoid When

- A simple script does not need a web framework.
- CPU-bound parallelism is expected to scale through asyncio alone.
- The existing platform mandates a supported framework and migration cost outweighs benefit.

## Trade-offs

- Django supplies cohesive conventions but is heavier for narrow APIs.
- FastAPI aligns with typed API contracts but does not choose persistence or job architecture.
- Async improves I/O concurrency but fails when blocking libraries run on the event loop.
- Strict typing improves boundary clarity but requires maintained annotations and checker discipline.

## Verification

Run the configured formatter, linter, type checker, unit tests, integration tests, dependency audit, and migration checks. Test invalid input, cancellation, downstream timeout, startup failure, signal shutdown, and rollback. Measure latency, memory, worker saturation, and error rate using representative workload; redact credentials and personal data from diagnostics.

<a id="rule-fastapi-patterns"></a>

## FastAPI Service Patterns

**Impact:** high
**Kind:** reference
**Source:** `rules/fastapi-patterns.md`

# FastAPI Patterns

> Dependency injection for testability. Pydantic at boundaries. Async by default.

## Scope

Apply to FastAPI request validation, dependencies, lifespan, error mapping, async boundaries, security, and tests.

## Guidance

---

## Dependency Injection

```python
from fastapi import Depends, FastAPI, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

app = FastAPI()

# Database session dependency
async def get_db() -> AsyncGenerator[AsyncSession, None]:
    async with async_session_maker() as session:
        try:
            yield session
        finally:
            await session.close()

# Current user dependency (reusable)
async def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: AsyncSession = Depends(get_db),
) -> User:
    user = await user_service.get_by_token(db, token)
    if not user:
        raise HTTPException(status_code=401, detail="Invalid token")
    return user

# Use in route — clean, testable
@app.get("/users/me")
async def get_me(user: User = Depends(get_current_user)) -> UserResponse:
    return UserResponse.model_validate(user)
```

---

## Router Organization

```python
# app/routes/users.py
from fastapi import APIRouter, Depends
from app.dependencies import get_db, get_current_user
from app.services.user_service import UserService
from app.schemas.user import UserCreate, UserResponse

router = APIRouter()

@router.post("/", status_code=201)
async def create_user(
    data: UserCreate,
    db: AsyncSession = Depends(get_db),
) -> UserResponse:
    service = UserService(db)
    user = await service.create(data)
    return UserResponse.model_validate(user)

@router.get("/{user_id}")
async def get_user(
    user_id: int,
    db: AsyncSession = Depends(get_db),
) -> UserResponse:
    service = UserService(db)
    user = await service.get_or_404(user_id)
    return UserResponse.model_validate(user)
```

---

## Error Handling

```python
from fastapi import Request
from fastapi.responses import JSONResponse

# Custom domain exception
class AppError(Exception):
    def __init__(self, message: str, code: str, status_code: int = 400):
        self.message = message
        self.code = code
        self.status_code = status_code

class NotFoundError(AppError):
    def __init__(self, resource: str, id: int):
        super().__init__(f"{resource} {id} not found", "NOT_FOUND", 404)

# Register handler
@app.exception_handler(AppError)
async def app_error_handler(request: Request, exc: AppError) -> JSONResponse:
    return JSONResponse(
        status_code=exc.status_code,
        content={"error": exc.code, "message": exc.message},
    )

# Usage in service layer
class UserService:
    async def get_or_404(self, user_id: int) -> User:
        user = await self.repo.get(user_id)
        if not user:
            raise NotFoundError("User", user_id)
        return user
```

---

## Middleware

```python
import time
from fastapi import Request

@app.middleware("http")
async def add_timing_header(request: Request, call_next):
    start = time.perf_counter()
    response = await call_next(request)
    elapsed = time.perf_counter() - start
    response.headers["X-Process-Time"] = f"{elapsed:.3f}s"
    return response
```

---

## Lifespan (Startup/Shutdown)

```python
from contextlib import asynccontextmanager
from fastapi import FastAPI

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: initialize resources
    app.state.db = await create_db_pool()
    app.state.redis = await create_redis_pool()
    yield
    # Shutdown: cleanup
    await app.state.db.close()
    await app.state.redis.close()

app = FastAPI(lifespan=lifespan)
```

---

## Anti-Patterns

| ❌ Don't | ✅ Do |
|---------|-------|
| Business logic in routes | Delegate to service layer |
| Catch all exceptions silently | Use domain exceptions + handlers |
| `@app.on_event("startup")` | Use `lifespan` context manager |
| Skip Depends for DB sessions | Always use DI for testability |
| Return raw dict | Return Pydantic model |

---

## Verification

Test request and response validation, dependency cleanup, authorization, error mapping, blocking-call isolation, lifespan failure, cancellation, and OpenAPI output. Exercise the application through ASGI rather than calling route functions only.

## Related

| File | When to Read |
|------|-------------|
| [type-hints.md](type-hints.md) | Pydantic models |
| [async-patterns.md](async-patterns.md) | Async decisions |
| [project-structure.md](project-structure.md) | Directory layout |
| [testing-patterns.md](testing-patterns.md) | Testing FastAPI |

---

⚡ PikaKit v3.9.224

<a id="rule-framework-selection"></a>

## Python Framework Selection

**Impact:** high
**Kind:** reference
**Source:** `rules/framework-selection.md`

# Framework Selection

> Pick the right tool. Don't default to one framework for everything.

## Scope

Apply to selecting a maintained Python framework from product, protocol, lifecycle, data, deployment, and team constraints. Verify framework capabilities in official documentation.

## Guidance

---

## Decision Tree

```
What are you building?
│
├── API-first / Microservices   → FastAPI
├── Full-stack web / CMS        → Django
├── Simple / Script / Learning  → Flask
├── AI/ML API serving           → FastAPI
└── Background workers          → Celery + any framework
```

**If user has explicit preference → respect it.** Ask when unclear.

---

## Comparison

| Factor | FastAPI | Django | Flask |
|--------|---------|--------|-------|
| **Best for** | APIs, microservices, ML | Full-stack, CMS, admin | Simple, learning, prototyping |
| **Performance** | ⭐⭐⭐ (Starlette/uvicorn) | ⭐⭐ (improved in 5.x) | ⭐⭐ (Werkzeug) |
| **Async** | Native | Django 5.0+ (partial) | Via extensions (Quart) |
| **Admin** | Manual | Built-in (excellent) | Flask-Admin |
| **ORM** | SQLAlchemy / Tortoise | Django ORM (built-in) | SQLAlchemy |
| **Validation** | Pydantic (built-in) | Django Forms / DRF | Manual / Marshmallow |
| **Auth** | Manual / FastAPI-Users | Built-in | Flask-Login |
| **Learning curve** | Low | Medium | Low |
| **Type safety** | Excellent (Pydantic) | Good (mypy support) | Manual |
| **OpenAPI docs** | Auto-generated | DRF (drf-spectacular) | Flask-RESTX |

---

## Minimal App Examples

### FastAPI

```python
from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()

class Item(BaseModel):
    name: str
    price: float
    in_stock: bool = True

@app.get("/")
async def root():
    return {"message": "Hello World"}

@app.post("/items")
async def create_item(item: Item) -> Item:
    return item

# Run: uvicorn main:app --reload
```

### Django (with DRF)

```python
# views.py
from rest_framework import viewsets
from rest_framework.decorators import api_view
from rest_framework.response import Response

@api_view(["GET"])
def root(request):
    return Response({"message": "Hello World"})

class ItemViewSet(viewsets.ModelViewSet):
    queryset = Item.objects.all()
    serializer_class = ItemSerializer

# Run: python manage.py runserver
```

### Flask

```python
from flask import Flask, jsonify, request

app = Flask(__name__)

@app.get("/")
def root():
    return jsonify(message="Hello World")

@app.post("/items")
def create_item():
    data = request.get_json()
    return jsonify(data), 201

# Run: flask run --debug
```

---

## pyproject.toml (Modern Python)

```toml
[project]
name = "myapp"
version = "0.1.0"
requires-python = ">=3.12"

dependencies = [
    # FastAPI stack
    "fastapi>=0.115",
    "uvicorn[standard]>=0.32",
    "pydantic>=2.0",
    # Or Django stack
    # "django>=5.1",
    # "djangorestframework>=3.15",
]

[project.optional-dependencies]
dev = [
    "pytest>=8.0",
    "pytest-asyncio>=0.24",
    "httpx>=0.27",
    "ruff>=0.8",
    "mypy>=1.13",
]
```

---

## Anti-Patterns

| ❌ Don't | ✅ Do |
|---------|-------|
| Default to Django for simple APIs | Use FastAPI for API-first |
| Use Flask for complex apps | Use Django (batteries included) |
| Pick framework by popularity | Pick by project requirements |
| Skip framework when prototyping | Flask for quick prototypes |

---

## Verification

Implement a thin vertical slice and verify data access, validation, authentication, lifecycle, observability, testing, packaging, and deployment. Record rejected alternatives and migration cost; do not rely on unsourced benchmark rankings.

## Related

| File | When to Read |
|------|-------------|
| [fastapi-patterns.md](fastapi-patterns.md) | Chosen FastAPI |
| [django-patterns.md](django-patterns.md) | Chosen Django |
| [project-structure.md](project-structure.md) | Directory layout |
| [async-patterns.md](async-patterns.md) | Async decision |

---

⚡ PikaKit v3.9.224

<a id="rule-project-structure"></a>

## Python Project Structure

**Impact:** standard
**Kind:** reference
**Source:** `rules/project-structure.md`

# Project Structure

> Structure by size. Feature-based for large apps. Layer-based for small.

## Scope

Apply to package layout, `pyproject.toml`, public boundaries, configuration, tests, and deployment entry points.

## Guidance

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

## Verification

Build and install the package from a clean checkout, import public modules, run each entry point, execute tests outside the source directory, and verify configuration and secret files are excluded from artifacts.

## Related

| File | When to Read |
|------|-------------|
| [framework-selection.md](framework-selection.md) | Which framework |
| [fastapi-patterns.md](fastapi-patterns.md) | FastAPI specifics |
| [django-patterns.md](django-patterns.md) | Django specifics |

---

⚡ PikaKit v3.9.224

<a id="rule-testing-patterns"></a>

## Python Testing Patterns

**Impact:** high
**Kind:** reference
**Source:** `rules/testing-patterns.md`

# Python Testing Patterns

> pytest for everything. Fixtures for setup. Mock at boundaries. Test behavior, not implementation.

## Scope

Apply to unit, integration, contract, async, and end-to-end testing with isolated fixtures and deterministic CI execution.

## Guidance

---

## Testing Strategy

| Type | Purpose | Tools | Speed |
|------|---------|-------|:-----:|
| **Unit** | Business logic / services | pytest | ⚡ Fast |
| **Integration** | API endpoints + DB | pytest + httpx/TestClient | 🔄 Medium |
| **E2E** | Full workflows | pytest + real DB | 🐢 Slow |

---

## FastAPI Testing

```python
import pytest
from httpx import AsyncClient, ASGITransport
from app.main import app
from app.dependencies import get_db

# Override database dependency for tests
async def get_test_db():
    async with test_session_maker() as session:
        yield session

app.dependency_overrides[get_db] = get_test_db

@pytest.mark.asyncio
async def test_create_user():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        response = await client.post("/api/v1/users/", json={
            "email": "test@example.com",
            "name": "Test User",
        })
    assert response.status_code == 201
    data = response.json()
    assert data["email"] == "test@example.com"
    assert "id" in data

@pytest.mark.asyncio
async def test_get_user_not_found():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        response = await client.get("/api/v1/users/99999")
    assert response.status_code == 404
    assert response.json()["error"] == "NOT_FOUND"
```

---

## Django Testing

```python
from django.test import TestCase
from rest_framework.test import APIClient

class UserAPITest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            email="test@test.com", password="testpass123"
        )

    def test_list_users(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.get("/api/users/")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 1)

    def test_create_user_unauthenticated(self):
        response = self.client.post("/api/users/", {"email": "new@test.com"})
        self.assertEqual(response.status_code, 401)
```

---

## Fixtures (conftest.py)

```python
# tests/conftest.py
import pytest
from app.models import User

@pytest.fixture
def sample_user(db) -> User:
    """Create a test user — available to all tests."""
    return User.objects.create(
        email="fixture@test.com",
        name="Fixture User",
    )

@pytest.fixture
def auth_client(sample_user) -> APIClient:
    """Authenticated API client."""
    client = APIClient()
    client.force_authenticate(user=sample_user)
    return client

@pytest.fixture
async def async_client() -> AsyncClient:
    """Async client for FastAPI."""
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        yield client
```

---

## Mocking

```python
from unittest.mock import AsyncMock, patch

@pytest.mark.asyncio
async def test_send_email_on_signup():
    """Mock external services at boundaries."""
    with patch("app.services.email.send_welcome_email", new_callable=AsyncMock) as mock_email:
        transport = ASGITransport(app=app)
        async with AsyncClient(transport=transport, base_url="http://test") as client:
            await client.post("/api/v1/users/", json={
                "email": "new@test.com",
                "name": "New User",
            })

        mock_email.assert_called_once_with("new@test.com", "New User")

@pytest.mark.asyncio
async def test_external_api_failure():
    """Test error handling when external service fails."""
    with patch("app.services.payment.charge", side_effect=Exception("Payment failed")):
        transport = ASGITransport(app=app)
        async with AsyncClient(transport=transport, base_url="http://test") as client:
            response = await client.post("/api/v1/orders/", json={"amount": 100})
        assert response.status_code == 500
```

---

## Test Configuration

```toml
# pyproject.toml
[tool.pytest.ini_options]
asyncio_mode = "auto"
testpaths = ["tests"]
python_files = "test_*.py"
python_functions = "test_*"
addopts = "-v --tb=short --strict-markers"
markers = [
    "slow: marks tests as slow",
    "integration: marks integration tests",
]

[tool.coverage.run]
source = ["app"]
omit = ["tests/*", "*/migrations/*"]

[tool.coverage.report]
fail_under = 80
show_missing = true
```

```bash
# Run tests
pytest                          # All tests
pytest -x                       # Stop on first failure
pytest -k "test_user"           # Filter by name
pytest --cov=app --cov-report=html  # With coverage
pytest -m "not slow"            # Skip slow tests
```

---

## Anti-Patterns

| ❌ Don't | ✅ Do |
|---------|-------|
| Test implementation details | Test behavior (inputs → outputs) |
| Mock everything | Mock only boundaries (DB, APIs, email) |
| Share state between tests | Each test is independent |
| Skip error path tests | Test both success AND failure |
| Use coverage as the only quality signal | Set a justified project threshold and cover critical behavior |
| Use `print()` for debugging | Use `pytest --pdb` or `breakpoint()` |

---

## Verification

Run suites from a clean environment with deterministic seeds, bounded timeouts, isolated data, and explicit async configuration. Fail CI on collection errors, warnings designated by policy, flaky retries, or unavailable required suites.

## Related

| File | When to Read |
|------|-------------|
| [fastapi-patterns.md](fastapi-patterns.md) | FastAPI patterns |
| [django-patterns.md](django-patterns.md) | Django patterns |
| [async-patterns.md](async-patterns.md) | Testing async code |
| [type-hints.md](type-hints.md) | Typed test fixtures |

---

⚡ PikaKit v3.9.224

<a id="rule-type-hints"></a>

## Python Type Contracts and Validation

**Impact:** high
**Kind:** reference
**Source:** `rules/type-hints.md`

# Python Type Hints & Validation

> Type all public APIs. Use Pydantic at boundaries. No `Any` in public signatures.

## Scope

Apply to Python public type contracts, generics, narrowing, external-data validation, and type-checker configuration.

## Guidance

---

## Modern Type Syntax (Python 3.12+)

```python
# ✅ Modern — use built-in generics (no typing import needed)
def get_items() -> list[dict[str, int]]:
    ...

def find_user(user_id: int) -> User | None:  # Union syntax
    ...

def process(data: str | bytes) -> None:
    ...

# ❌ Legacy — avoid in new code
from typing import Optional, Union, List, Dict
def get_items() -> List[Dict[str, int]]:  # Old style
    ...
```

---

## Common Patterns

```python
from typing import TypeVar, Generic, Callable
from collections.abc import Sequence, Mapping

# TypeVar for generics
T = TypeVar("T")

def first(items: Sequence[T]) -> T | None:
    return items[0] if items else None

# Callable types
def apply(fn: Callable[[int], str], value: int) -> str:
    return fn(value)

# Generic class
class Repository(Generic[T]):
    def __init__(self, model: type[T]) -> None:
        self.model = model

    async def get(self, id: int) -> T | None:
        ...

    async def list(self, limit: int = 20) -> list[T]:
        ...
```

---

## Pydantic v2 Models

```python
from pydantic import BaseModel, Field, EmailStr, field_validator
from datetime import datetime

class UserCreate(BaseModel):
    """Input validation at API boundary."""
    name: str = Field(min_length=1, max_length=100)
    email: EmailStr
    age: int = Field(ge=0, le=150)
    role: str = "user"

    @field_validator("name")
    @classmethod
    def name_must_not_be_empty(cls, v: str) -> str:
        if not v.strip():
            raise ValueError("Name cannot be blank")
        return v.strip()

class UserResponse(BaseModel):
    """Output serialization — never expose internal fields."""
    id: int
    name: str
    email: str
    created_at: datetime

    model_config = {"from_attributes": True}  # Enable ORM mode

class UserUpdate(BaseModel):
    """Partial update — all fields optional."""
    name: str | None = None
    email: EmailStr | None = None
    age: int | None = Field(default=None, ge=0, le=150)
```

### Pydantic Settings (Configuration)

```python
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    """Load from environment variables automatically."""
    database_url: str
    redis_url: str = "redis://localhost:6379"
    secret_key: str
    debug: bool = False
    allowed_origins: list[str] = ["http://localhost:3000"]

    model_config = {"env_file": ".env", "env_file_encoding": "utf-8"}

settings = Settings()  # Auto-reads from .env + environment
```

---

## When to Type

| Scope | Rule |
|-------|------|
| Function parameters | Always |
| Return types | Always |
| Class attributes | Always |
| Local variables | Let inference work (skip) |
| Tests | Optional (usually skip) |
| Scripts | Minimal |

---

## Anti-Patterns

| ❌ Don't | ✅ Do |
|---------|-------|
| `Any` in public APIs | Use specific types or `TypeVar` |
| `typing.Optional[X]` | `X \| None` (Python 3.10+) |
| `typing.List`, `typing.Dict` | `list`, `dict` (Python 3.9+) |
| Skip return type hints | Always annotate return types |
| Validate manually | Use Pydantic at boundaries |
| Hardcode config values | Use Pydantic Settings |

---

## Verification

Run the configured type checker in strict mode and execute boundary-validation tests for malformed, missing, extra, and coerced values. Verify runtime validation is not assumed from annotations alone.

## Related

| File | When to Read |
|------|-------------|
| [fastapi-patterns.md](fastapi-patterns.md) | Pydantic with FastAPI |
| [testing-patterns.md](testing-patterns.md) | Testing typed code |
| [project-structure.md](project-structure.md) | Where to put models |

---

⚡ PikaKit v3.9.224
