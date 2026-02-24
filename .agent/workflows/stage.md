---
description: Development sandbox control. Multi-service orchestration, Docker Compose, port management, hot-reload, and health monitoring.
---

# /stage - Development Sandbox

$ARGUMENTS

---

## Purpose

Manage local development environments with multi-service orchestration. Start, stop, and monitor preview servers, databases, and background services. Docker Compose integration, port conflict resolution, and service dependency management.

---

## 🤖 Meta-Agents Integration

| Phase | Agent | Action |
|-------|-------|--------|
| **Pre-Start** | `recovery` | Save current server state |
| **Port Conflict** | `assessor` | Evaluate best resolution |
| **Multi-Service** | `orchestrator` | Coordinate parallel startup |
| **On Failure** | `recovery` | Restore previous state |
| **Post-Run** | `learner` | Log configs for reuse |

---

## Sub-commands

```
/stage                  - Show status of all services
/stage start            - Start all services (smart detection)
/stage start frontend   - Start specific service
/stage stop             - Stop all services
/stage stop backend     - Stop specific service
/stage restart          - Restart all / specific service
/stage check            - Health check all services
/stage logs             - Tail logs (all or specific)
/stage logs api --filter error  - Filter logs
/stage ports            - Show port allocation map
/stage docker           - Start Docker Compose stack
/stage docker down      - Stop Docker services
/stage docker --profile infra   - Start only infrastructure
```

---

## Phase 1: Environment Detection

**Auto-detect project type:**

| Detected File | Service | Default Port | Start Command |
|--------------|---------|-------------|---------------|
| `next.config.*` | Next.js | 3000 | `npm run dev` |
| `vite.config.*` | Vite | 5173 | `npm run dev` |
| `nuxt.config.*` | Nuxt | 3000 | `npm run dev` |
| `package.json` (scripts.dev) | Node.js | 3001 | `npm run dev` |
| `manage.py` | Django | 8000 | `python manage.py runserver` |
| `main.py` / `app.py` | FastAPI/Flask | 8000 | `uvicorn app:app --reload` |
| `docker-compose.yml` | Docker Stack | varies | `docker compose up` |
| `prisma/schema.prisma` | Database | 5432 | `npx prisma studio` |

**Monorepo detection:**
```
apps/web/    → Frontend (port 3000)
apps/api/    → Backend (port 3001)
packages/db/ → Database service
```

---

## Phase 2: Service Orchestration

**Startup order (respecting dependencies):**

```
1. Infrastructure  → Database, Redis, Queue
2. Backend         → API server, Workers
3. Frontend        → Next.js / Vite dev server
4. Tools           → Prisma Studio, Storybook
```

**Health gates:**

| Service | Wait For | Health Check |
|---------|----------|-------------|
| Database | — | TCP port open |
| Redis | — | `PING → PONG` |
| API Server | Database, Redis | `GET /health → 200` |
| Frontend | API Server | `GET / → 200` |

---

## Phase 3: Port Management

| Service | Default | Fallback Range |
|---------|---------|---------------|
| Frontend | 3000 | 3000-3009 |
| Backend API | 3001 | 3010-3019 |
| PostgreSQL | 5432 | — |
| Redis | 6379 | — |
| Prisma Studio | 5555 | 5555-5559 |
| Storybook | 6006 | 6006-6009 |

**Conflict resolution:**
```
Port 3000 in use?
├── OUR process? → Reuse (already running)
├── Another dev server? → Offer kill or next port
└── System service? → Use fallback (3001)
```

---

## Phase 4: Docker Compose

**Hybrid mode (recommended):**
- **Docker:** Database + Redis + Mailhog (stable infra)
- **Local:** Frontend + Backend (fast HMR, better debugging)

```bash
/stage docker --profile infra   # Start infra only
/stage start                     # Start local dev servers
```

**Service mapping:**

| Service | Image | Port |
|---------|-------|------|
| `db` | postgres:16 | 5432 |
| `redis` | redis:7-alpine | 6379 |
| `mailhog` | mailhog/mailhog | 8025 |

**Commands:** `/stage docker` · `/stage docker down` · `/stage docker --build`

---

## Phase 5: Hot-Reload & Debugging

| Framework | HMR Method | Speed |
|-----------|-----------|-------|
| Next.js | Fast Refresh | <1s |
| Vite | Native HMR | <500ms |
| Node.js | `--watch` (18+) | Auto restart |
| Python | `--reload` (uvicorn) | Auto restart |

**Debug mode:**
```bash
/stage start --debug
# Node.js: --inspect (Chrome DevTools)
# Python: debugpy (VS Code attach)
# Frontend: Source maps enabled
# API: Verbose request logging
```

**Log aggregation:**
```
/stage logs
[3000] [frontend]  ✓ Ready in 1.2s
[3001] [api]       ✓ Server on :3001
[5432] [postgres]  ✓ Database ready
[6379] [redis]     ✓ Redis ready
```

---

## Phase 6: Health Monitoring

```
/stage check

┌─────────────┬──────┬────────┬──────────┐
│ Service     │ Port │ Health │ Uptime   │
├─────────────┼──────┼────────┼──────────┤
│ Frontend    │ 3000 │ ✅ OK  │ 2h 15m   │
│ API Server  │ 3001 │ ✅ OK  │ 2h 15m   │
│ PostgreSQL  │ 5432 │ ✅ OK  │ 2h 16m   │
│ Redis       │ 6379 │ ✅ OK  │ 2h 16m   │
│ Storybook   │ 6006 │ ⏸ OFF │ —        │
└─────────────┴──────┴────────┴──────────┘
```

**Auto-restart on crash:** 3 retry attempts with error logging.

---

## Workflow Steps

### Start Server

@auto @safe
// turbo

```bash
node .agent/scripts-js/auto_preview.js start
```

### Stop All

@auto @safe
// turbo

```bash
node .agent/scripts-js/auto_preview.js stop
docker compose down 2>/dev/null
```

### Check Status

@auto @safe
// turbo

```bash
node .agent/scripts-js/auto_preview.js status
```

---

## Output Format

```markdown
## 🎭 Stage Status

### Services
| Service   | Port | Health | Mode   |
|-----------|------|--------|--------|
| Frontend  | 3000 | ✅ OK  | Local  |
| API       | 3001 | ✅ OK  | Local  |
| PostgreSQL| 5432 | ✅ OK  | Docker |
| Redis     | 6379 | ✅ OK  | Docker |

### Next Steps
- [ ] Test: http://localhost:3000
- [ ] Run `/validate` for tests
- [ ] Deploy with `/launch`
```

---

## Examples

```
/stage                           # Show all status
/stage start                     # Start all services
/stage start --debug             # With debugging
/stage stop                      # Stop everything
/stage restart backend           # Restart one service
/stage check                     # Health check
/stage logs api --filter error   # Filter logs
/stage ports                     # Port map
/stage docker --profile infra    # Docker infra only
```

---

## 🔗 Workflow Chain

**Skills (3):** `server-ops` · `shell-script` · `cicd-pipeline`

| After /stage | Run | Purpose |
|-------------|-----|---------|
| Services running | `/validate` | Test against live services |
| Service crashing | `/diagnose` | Debug failures |
| All tests pass | `/launch` | Deploy to production |

---

**Version:** 2.0.0 · **Chain:** dev-environment · **Updated:** v3.9.62
