---
title: Building a REST API
description: Build production-ready REST APIs with PikaKit - from design to deployment
section: guides
category: workflows
order: 8
---

# Building a REST API

Learn how to build production-ready REST APIs with **PikaKit** - from API design through implementation, testing, documentation, and deployment.

## Overview

- **Goal**: Build a complete REST API with CRUD operations, auth, and docs.
- **Time**: 30-60 minutes (vs 6-12 hours manually).
- **Agents Used**: `project-planner`, `backend-specialist`, `test-engineer`, `code-review`.
- **Workflows**: `/plan`, `/build`, `/cook`, `/validate`, `/chronicle`.

## Prerequisites

- Clear API requirements.
- Database choice (PostgreSQL, MySQL, MongoDB, etc.).
- Node.js 18+ or Python 3.9+ installed.

## API Development Phases

| Phase | Activities | Time | Commands |
|-------|-----------|------|----------|
| Design | Plan endpoints, data models | 5-10 min | `/plan` |
| Setup | Initialize project, database | 5-10 min | `/build` |
| Implementation | Build endpoints, logic | 15-25 min | `/cook` |
| Testing | Unit, integration, E2E tests | 5-10 min | `/validate` |
| Documentation | API docs, examples | 5 min | `/chronicle` |
| Deployment | Production setup | 10-15 min | `/launch` |

## Step-by-Step Workflow

### Step 1: Design API Structure

Plan your API endpoints and data models:

```bash
/plan "design REST API for task management with users, tasks, and projects"
```

**Generated plan includes**:
- **Data Models**: User, Project, Task (relations defined).
- **Endpoints**: Auth, User CRUD, Project CRUD, Task CRUD.
- **Stack**: Node.js + Express + Prisma + PostgreSQL.
- **Security**: JWT, Rate Limiting, Input Validation.

### Step 2: Bootstrap the API

Create the initial project structure using the Application Factory (`/build`):

```bash
/build "create REST API for task management with Node.js, Express, PostgreSQL, and JWT auth"
```

**What happens**:
1.  **Scaffolding**: Creates project structure, routes, controllers, services.
2.  **Database**: Sets up Prisma schema and migrations.
3.  **Auth**: Implements JWT middleware and password hashing.
4.  **Tests**: Sets up initial testing framework.

### Step 3: Configure Environment

Set up your `.env` file with database credentials and JWT secrets.

### Step 4: Implement Custom Endpoints

Add specialized endpoints using Tactical Workflow (`/cook`):

```bash
/cook "add task filtering by status, priority, and due date"
```

**Implementation**:
- Adds filtering logic to services.
- Updates validation middleware.
- Adds specific unit tests for filtering.

### Step 5: Add Search Functionality

```bash
/cook "implement full-text search for tasks and projects"
```

### Step 6: Testing

Run comprehensive test suite via `/validate`:

```bash
/validate
```

**Checks**:
- Unit Tests (Services, Utils).
- Integration Tests (API Endpoints).
- Security Checks (Auth flows).

### Step 7: Documentation

Generate comprehensive API documentation (Swagger/OpenAPI):

```bash
/chronicle api
```

**Result**:
- `docs/openapi.yaml` generated.
- `README.md` updated with API usage examples.
- Swagger UI setup.

### Step 8: Deploy

Deploy to production using `/launch` (or specific deploy skill):

```bash
/launch
```

## Complete Example: Blog API

**Scenario**: Build a blogging platform API.

1.  **Design**: `/plan "design blog API with posts, comments, and tags"`
2.  **Build**: `/build "scaffold blog API with NestJS and TypeORM"`
3.  **Features**:
    *   `/cook "add comment system with nested replies"`
    *   `/cook "implement like/unlike functionality"`
4.  **Verify**: `/validate`
5.  **Docs**: `/chronicle`

## Best Practices

1.  **RESTful Design**: Use standard HTTP methods (GET, POST, PUT, DELETE) and status codes (200, 201, 400, 401, 404).
2.  **Validation**: Always validate input using middleware (Zod, Joi).
3.  **Error Handling**: Use centralized error handling to ensure consistent responses.
4.  **Security**: Never commit `.env` files. Use `/inspect` to check for secrets.

## Next Steps

- **[Adding a Feature](./feature-development.md)**: Iterate on your API.
- **[Debugging](./debugging-workflow.md)**: Troubleshoot issues.
- **[Refactoring](./refactoring-code.md)**: Improve code quality.

---

**Key Takeaway**: PikaKit turns hours of API boilerplate work into minutes of strategic design and rapid implementation.
