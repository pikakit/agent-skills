---
name: server-ops
description: >-
  Server management principles and decision-making. Process management, monitoring strategy,
  scaling decisions. Triggers on: server, DevOps, infrastructure, deployment, hosting.
metadata:
  author: pikakit
  version: "3.9.106"
---

# Server Ops â€” Production Server Management

> Boring servers = well-managed servers. Auto-restart. Monitor day one. Rotate logs.

---

## When to Use

| Situation | Approach |
|-----------|----------|
| Deploy Node.js app | Use PM2 |
| Server provisioning | Check platform selection |
| High CPU/memory | Follow scaling decisions |
| Server issues | Use 5-step troubleshooting |

---

## System Boundaries

| Owned by This Skill | NOT Owned |
|---------------------|-----------|
| Process manager selection (4 tools) | CI/CD pipelines (â†’ cicd-pipeline) |
| Monitoring strategy (4 categories) | Observability instrumentation (â†’ observability) |
| Scaling decisions (3 strategies) | Security scanning (â†’ security-scanner) |
| Health check design | Command execution |

**Expert decision skill:** Produces management recommendations. Does not execute commands.

---

## Process Manager Selection (Deterministic)

| Scenario | Tool |
|----------|------|
| Node.js app | PM2 (clustering, reload) |
| Any app (Linux) | systemd (native) |
| Containers | Docker / Podman |
| Orchestration | Kubernetes / Swarm |

**4 Goals:** restart-on-crash, zero-downtime reload, clustering, persist across reboot.

---

## Monitoring Strategy (4 Categories Ã— 3 Levels)

| Category | Key Metrics |
|----------|------------|
| Availability | Uptime, health checks |
| Performance | Response time, throughput |
| Errors | Error rate, types |
| Resources | CPU, memory, disk |

| Alert Level | Response |
|-------------|----------|
| **Critical** | Immediate action |
| **Warning** | Investigate soon |
| **Info** | Review daily |

---

## Log Management (3 Types + 4 Principles)

| Type | Purpose |
|------|---------|
| Application | Debug, audit trail |
| Access | Traffic analysis |
| Error | Issue detection |

**Principles:** Rotate logs, structured JSON, appropriate levels, no sensitive data.

---

## Scaling Decisions (Deterministic)

| Symptom | Solution |
|---------|----------|
| High CPU | Add instances (horizontal) |
| High memory | Increase RAM or fix leak (vertical) |
| Slow response | Profile first, then scale |
| Traffic spikes | Auto-scaling |

| Strategy | When |
|----------|------|
| Vertical | Quick fix, single instance |
| Horizontal | Sustainable, distributed |
| Auto | Variable traffic |

---

## Health Checks (2 Levels)

| Level | Design |
|-------|--------|
| **Simple** | HTTP 200 response |
| **Deep** | Check DB, dependencies, resources |

Route by load balancer needs.

---

## 5-Step Troubleshooting (Fixed Priority)

1. **Process status** â€” Is it running?
2. **Logs** â€” Error messages?
3. **Resources** â€” Disk, memory, CPU?
4. **Network** â€” Ports, DNS?
5. **Dependencies** â€” Database, APIs?

---

## Error Taxonomy

| Code | Recoverable | Trigger |
|------|-------------|---------|
| `ERR_INVALID_REQUEST_TYPE` | No | Request type not supported |
| `ERR_UNKNOWN_RUNTIME` | Yes | Runtime not one of 4 |
| `ERR_UNKNOWN_ENVIRONMENT` | Yes | Environment not one of 4 |
| `ERR_UNKNOWN_SYMPTOM` | Yes | Scaling symptom not recognized |

**Zero internal retries.** Same context = same recommendation.

---

## Anti-Patterns

| âŒ Don't | âœ… Do |
|---------|-------|
| Run as root | Use non-root user |
| Ignore logs | Set up log rotation |
| Skip monitoring | Monitor from day one |
| Manual restarts | Auto-restart configuration |
| No backups | Regular backup schedule |

---

## ðŸ“‘ Content Map

| File | Description | When to Read |
|------|-------------|--------------|
| [engineering-spec.md](rules/engineering-spec.md) | Full spec | Architecture review |

---

## ðŸ”— Related

| Item | Type | Purpose |
|------|------|---------|
| `cicd-pipeline` | Skill | Deployment |
| `observability` | Skill | Monitoring |
| `security-scanner` | Skill | Server security |

---

âš¡ PikaKit v3.9.106
