---
title: Building a REST API
description: Built production-ready REST APIs with PikaKit - from design to deployment
section: guides
category: workflows
order: 8
---

# Building a REST API

Learn how to build production-ready REST APIs with **PikaKit** - from API design through implementation, testing, documentation, and deployment.

## Overview

- **Goal**: Build a complete REST API with CRUD operations, auth, and docs.
- **Time**: 30-60 minutes (vs 6-12 hours manually).
- **Agents Used**: `project-planner`, `backend-specialist`, `test-engineer`, `code-review`, `docs-manager`.
- **Workflows**: `/plan`, `/build`, `/cook`, `/validate`, `/chronicle`.

## Prerequisites

- Clear API requirements.
- Database choice (PostgreSQL, MySQL, MongoDB, etc.).
- Node.js 18+ or Python 3.9+ installed.
- Postman or similar API testing tool.

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
5.  **Docs**: Configures Swagger/OpenAPI bootstrapping.

### Step 3: Configure Environment

Set up your `.env` file with database credentials and JWT secrets.

### Step 4: Implement Custom Endpoints

Add specialized endpoints using Tactical Workflow (`/cook`):

```bash
/cook "add task filtering by status, priority, and due date"
```

**Implementation Details**:
- **Logic**: Adds query parameter parsing and filter logic in service.
- **Validation**: Updates Joi/Zod schemas for query params.
- **Tests**: Adds unit tests for filtering scenarios.

### Step 5: Add Search Functionality

```bash
/cook "implement full-text search for tasks and projects"
```

**What happens**:
- Adds search indexes to database schema.
- Implements full-text search query logic.
- Creates `GET /api/search` endpoint with relevance scoring.

### Step 6: Add Pagination

```bash
/cook "add pagination to all list endpoints"
```

**Implementation**:
- Query params: `page` (default 1), `limit` (default 20).
- Response format:
  ```json
  {
    "data": [...],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 156,
      "totalPages": 8
    }
  }
  ```

### Step 7: Implement Advanced Features

#### Rate Limiting
```bash
/cook "add rate limiting per user with Redis"
```

#### File Uploads
```bash
/cook "add file attachment support for tasks using S3"
```

#### Real-time Updates
```bash
/cook "add WebSocket support for real-time task updates"
```

### Step 8: Testing

Run comprehensive test suite via `/validate`:

```bash
/validate
```

**Checks**:
- Unit Tests (Services, Validators).
- Integration Tests (API Endpoints, Database).
- E2E Tests (Full User Flow).

### Step 9: Documentation

Generate comprehensive API documentation (Swagger/OpenAPI):

```bash
/chronicle api
```

**Result**:
- `docs/openapi.yaml` generated.
- `README.md` updated with API usage examples.
- Swagger UI accessible at `/api-docs`.

### Step 10: Manual API Testing

Verify endpoints with curl or Postman:

```bash
# Register user
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email": "john@example.com", "password": "SecurePass123!"}'

# Create task
curl -X POST http://localhost:3000/api/tasks \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"title": "Design Mockup", "priority": "high"}'
```

### Step 11: Deploy

Deploy to production using `/launch` (or specific deploy skill):

```bash
# Option 1: Vercel/Railway/Heroku
/launch

# Option 2: Docker
/cook "create production Docker setup with nginx reverse proxy"
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

1.  **RESTful Design**: Use standard HTTP methods and status codes.
2.  **Validation**: Always validate input using middleware (Zod, Joi).
3.  **Error Handling**: Use centralized error handling to ensure consistent responses.
4.  **Security**: Use `/inspect` to check for secrets and vulnerabilities.

## Next Steps

- **[Adding a Feature](./feature-development.md)**: Iterate on your API.
- **[Debugging](./debugging-workflow.md)**: Troubleshoot issues.
- **[Refactoring](./refactoring-code.md)**: Improve code quality.

---

**Key Takeaway**: PikaKit turns hours of API boilerplate work into minutes of strategic design and rapid implementation.
