---
description: Project health dashboard. Agent status, file stats, and real-time progress tracking.
---

# /pulse - Project Health Dashboard

$ARGUMENTS

---

## Purpose

Display real-time project status including agent progress, file statistics, and preview health. **Single command for complete project visibility.**

---

## ðŸ¤– Meta-Agents Integration

| Phase | Agent | Action |
| ----- | ----- | ------ |
| **Status Collection** | `orchestrator` | Aggregate status from all running agents |
| **Health Analysis** | `assessor` | Evaluate project health risks |
| **Trend Learning** | `learner` | Track observability over time for trend analysis |

---

## What It Shows

| Section          | Information                                   |
| ---------------- | --------------------------------------------- |
| **Project Info** | Name, path, tech stack, features              |
| **Agent Board**  | Running agents, completed tasks, pending work |
| **File Stats**   | Created/modified file counts                  |
| **Preview**      | Server URL, health status                     |

---

## Technical

### Get Status

// turbo

```bash
node .agent/scripts-js/session_manager.js status
# OR: npm run session:status
```

### Check Preview

// turbo

```bash
node .agent/scripts-js/auto_preview.js status
# OR: npm run preview:status
```

---

## ðŸ“Š observability DASHBOARD (FAANG+)

### Collect observability

// turbo

```bash
node .agent/scripts-js/observability-collector.js collect
```

### Show Current observability

// turbo

```bash
node .agent/scripts-js/observability-collector.js show
```

### Show 7-Day Trends

// turbo

```bash
node .agent/scripts-js/observability-collector.js trends
```

### Dashboard Output

```
â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
â”‚  ðŸ“Š Project observability Dashboard           â”‚
â”œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¤
â”‚  Build Time:    2.3s (â†“ 15%)           â”‚
â”‚  Bundle Size:   245KB (stable)          â”‚
â”‚  Source Files:  142                     â”‚
â”‚  Test Coverage: 87% (â†‘ 3%)             â”‚
â”‚  Lighthouse:    92/100                  â”‚
â”‚  Security:      0 vulnerabilities       â”‚
â”œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¤
â”‚  7-Day Trend: â–â–‚â–ƒâ–„â–…â–†â–‡â–ˆ                  â”‚
â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
```

### KPI Thresholds

| Metric        | Good    | Warning   | Critical |
| ------------- | ------- | --------- | -------- |
| Build Time    | < 5s    | 5-15s     | > 15s    |
| Bundle Size   | < 250KB | 250-500KB | > 500KB  |
| Test Coverage | > 80%   | 60-80%    | < 60%    |
| Lighthouse    | > 90    | 70-90     | < 70     |

## Example Output

```markdown
=== Project Status ===

ðŸ“ Project: my-ecommerce
ðŸ“‚ Path: C:/projects/my-ecommerce
ðŸ·ï¸ Type: nextjs-ecommerce
ðŸ“Š Status: active

ðŸ”§ Tech Stack:
Framework: next.js
Database: postgresql
Auth: clerk
Payment: stripe

âœ… Features (5):
â€¢ product-listing
â€¢ cart
â€¢ checkout
â€¢ user-auth
â€¢ order-history

â³ Pending (2):
â€¢ admin-panel
â€¢ email-notifications

ðŸ“„ Files: 73 created, 12 modified

=== Agent Status ===

| Agent               | Task   | Status      |
| ------------------- | ------ | ----------- |
| database-architect  | Schema | âœ… Complete |
| backend-specialist  | API    | âœ… Complete |
| frontend-specialist | UI     | ðŸ”„ 60%      |
| test-engineer       | Tests  | â³ Waiting  |

=== Preview ===

ðŸŒ URL: http://localhost:3000
ðŸ’š Health: OK
```

---

## Examples

```
/pulse
```

---

## ðŸ”— Workflow Chain

```mermaid
graph LR
    A["/pulse"] --> B["ðŸ“Š Status"]
    style A fill:#22c55e
```

| After /pulse    | Run         | Purpose   |
| --------------- | ----------- | --------- |
| See issues      | `/diagnose` | Debug     |
| Ready to test   | `/validate` | Run tests |
| Ready to deploy | `/launch`   | Deploy    |

**Handoff:**

```markdown
Status: 5 features complete, preview running at localhost:3000
```

