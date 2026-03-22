---
description: Zero-downtime production release pipeline — pre-flight security gates, automated build verification, health-check monitoring, and instant rollback on failure.
chain: deploy-production
skills: [cicd-pipeline, server-ops, security-scanner, code-review]
agents: [orchestrator, assessor, recovery]
---

# /launch - Zero-Downtime Release

$ARGUMENTS

---

## Purpose

Production deployment with automated pre-flight checks, security scanning, build verification, health monitoring, and auto-rollback capability. **Differs from `/stage` (local development sandbox) and `/monitor` (production observability) by executing the full deployment pipeline with zero-downtime guarantees.** Uses `devops-engineer` with `cicd-pipeline` for deployment orchestration, `security-auditor` with `security-scanner` for pre-deploy validation, and `recovery` for rollback safety.

---

## Sub-Commands

| Command | Action |
|---------|--------|
| `/launch` | Interactive deployment wizard |
| `/launch check` | Run pre-flight checks only |
| `/launch preview` | Deploy to staging/preview |
| `/launch ship` | Deploy to production |
| `/launch rollback` | Rollback to previous version |
| `/launch rollback --to v2.0.3` | Rollback to specific version |
| `/launch rollback --list` | List available rollback points |

---

## 🤖 Meta-Agents Integration

| Phase | Agent | Action |
| ----- | ----- | ------ |
| **Pre-Deploy** | `assessor` | Evaluate deployment risk level |
| **Pre-Deploy** | `recovery` | Save state checkpoint before deploy |
| **Deploy** | `orchestrator` | Coordinate deploy + health check |
| **On Failure** | `recovery` | Auto-rollback to saved state |
| **Post-Deploy** | `learner` | Extract lessons from deploy outcome |

```
Flow:
assessor.evaluate(risk) → recovery.save(checkpoint)
       ↓
pre-flight gates → build → deploy
       ↓
health check → pass? → learner.log(success)
       ↓ fail
recovery.restore(checkpoint) → learner.log(failure)
```

---

## 🔴 MANDATORY: Deployment Protocol

### Phase 0: Pre-flight & Auto-Learned Context

> **Rule 0.5-K:** Auto-learned pattern check.

1. Read `.agent/skills/auto-learned/patterns/` for past failures before proceeding.
2. Trigger `recovery` agent to run Checkpoint (`git commit -m "chore(checkpoint): pre-launch"`).

### Phase 1: Pre-Flight Gates

| Field | Value |
|-------|-------|
| **INPUT** | $ARGUMENTS (sub-command + optional flags) |
| **OUTPUT** | Pre-flight result: all gates pass/fail with details |
| **AGENTS** | `security-auditor` |
| **SKILLS** | `security-scanner`, `code-review` |

**Gate 1: Code Quality**

// turbo
```bash
npx tsc --noEmit && npm run lint && npm test
```

| Check | Required |
|-------|----------|
| TypeScript compiles | ✅ |
| Linting passes | ✅ |
| All tests pass | ✅ |
| Build succeeds | ✅ |

**Gate 2: Security**

| Check | Required |
|-------|----------|
| No hardcoded secrets | ✅ |
| Dependencies audited | ✅ |
| HTTPS configured | ✅ |
| Environment variables set | ✅ |

**Gate 3: Performance**

| Check | Threshold |
|-------|-----------|
| Lighthouse Score | > 80 |
| Bundle Size | < 500KB |
| First Contentful Paint | < 2s |

> If ANY gate fails → STOP → report blockers → do not deploy.

### Phase 2: Build & Checkpoint

| Field | Value |
|-------|-------|
| **INPUT** | All gates passed from Phase 1 |
| **OUTPUT** | Production build + git checkpoint tag |
| **AGENTS** | `devops-engineer` |
| **SKILLS** | `cicd-pipeline` |

1. `recovery` saves current state (git tag + commit hash)
2. Build production bundle

// turbo
```bash
npm run build
```

3. Auto-detect platform:

| Platform | Command | Auto-Detected By |
|----------|---------|-----------------|
| Vercel | `vercel --prod` | Next.js, Vite |
| Railway | `railway up` | Dockerfile |
| Fly.io | `fly deploy` | fly.toml |
| Netlify | `netlify deploy --prod` | Static sites |
| AWS | `sam deploy` | SAM template |

### Phase 3: Deploy & Health Check

| Field | Value |
|-------|-------|
| **INPUT** | Production build + platform config from Phase 2 |
| **OUTPUT** | Deployed application with health check result |
| **AGENTS** | `devops-engineer` |
| **SKILLS** | `cicd-pipeline`, `server-ops` |

1. Execute platform-specific deploy command
2. Run health check (60s timeout):

| Check | Endpoint | Expected |
|-------|----------|----------|
| API Status | `GET /api/health` | 200 OK |
| Database | `GET /api/health/db` | 200 OK |
| Response Time | — | < 2000ms |

3. If health check fails → Phase 4 (Auto-Rollback)
4. If health check passes → `learner` logs deploy success

### Phase 4: Auto-Rollback (on failure only)

| Field | Value |
|-------|-------|
| **INPUT** | Failed health check from Phase 3 |
| **OUTPUT** | Reverted to previous version, rollback report |
| **AGENTS** | `devops-engineer` |
| **SKILLS** | `cicd-pipeline` |

1. `recovery` restores checkpoint
2. Re-deploy previous version
3. Verify rollback health
4. `learner` logs failure pattern

```mermaid
graph TD
    A["/launch"] --> B{"Pre-flight gates"}
    B -->|Fail| C["Fix issues"]
    C --> B
    B -->|Pass| D["Build + checkpoint"]
    D --> E["Deploy"]
    E --> F{"Health check"}
    F -->|Pass| G["✅ Live"]
    F -->|Fail| H["Auto-rollback"]
    H --> I["Alert team"]
```

---

## ⛔ MANDATORY: Problem Verification Before Completion

> **CRITICAL:** This check MUST be performed before any `notify_user` or task completion.

### Check @[current_problems]

```
1. Read @[current_problems] from IDE
2. If errors/warnings > 0:
   a. Auto-fix: imports, types, lint errors
   b. Re-check @[current_problems]
   c. If still > 0 → STOP → Do NOT deploy
3. If count = 0 → Proceed to deployment
```

### Auto-Fixable

| Type | Fix |
|------|-----|
| Missing import | Add import statement |
| Unused variable | Remove or prefix `_` |
| Type mismatch | Fix type annotation |
| Lint errors | Run eslint --fix |

> **Rule:** Never deploy with errors in `@[current_problems]`.

---

## Output Format

### Successful Launch

```markdown
## 🚀 Launch Complete

### Summary

| Metric | Value |
|--------|-------|
| Version | v2.1.0 |
| Environment | Production |
| Duration | 47 seconds |
| Platform | Vercel |

### Pre-Flight Results

| Gate | Status |
|------|--------|
| TypeScript | ✅ 0 errors |
| Tests | ✅ 42/42 passed |
| Security | ✅ No vulnerabilities |
| Build | ✅ Success (234KB) |

### Health Check

| Check | Status |
|-------|--------|
| API | ✅ 200 OK |
| Database | ✅ Connected |
| Response | ✅ < 2000ms |

### URLs

🌐 **Production:** https://app.example.com

### Next Steps

- [ ] Monitor for 24h with `/monitor`
- [ ] Run `/chronicle` to update documentation
- [ ] Rollback available: `/launch rollback`
```

### Failed Launch

```markdown
## ❌ Launch Aborted

### Pre-Flight Failed

| Check | Result |
|-------|--------|
| TypeScript | ❌ 3 errors |
| Tests | ✅ Pass |
| Security | ⚠️ 1 warning |

### Blockers

1. TypeScript error in `src/api/user.ts:42`

### Next Steps

- [ ] Fix blockers with `/fix`
- [ ] Re-run `/launch` after fixes
```

---

## Examples

```
/launch
/launch check
/launch preview
/launch ship
/launch rollback
/launch rollback --to v2.0.3
```

---

## Key Principles

- **Never skip security** — always scan for vulnerabilities before deploy
- **Rollback-first** — checkpoint before deploy, auto-revert on failure
- **Health check** — verify after deploy with 60s timeout
- **Zero-downtime** — no user-facing interruption during deployment
- **Document changes** — update changelog and notify team automatically

---

## 🔗 Workflow Chain

**Skills Loaded (4):**

- `cicd-pipeline` - Deployment orchestration and rollback strategies
- `server-ops` - Server management and health monitoring
- `security-scanner` - Pre-deploy vulnerability scanning
- `code-review` - Code quality validation

```mermaid
graph LR
    A["/validate"] --> B["/launch"]
    B --> C["/monitor"]
    style B fill:#10b981
```

| After /launch | Run | Purpose |
|--------------|-----|---------|
| Deploy success | `/chronicle` | Generate updated documentation |
| Deploy success | `/monitor` | Monitor production health |
| Deploy fail | `/diagnose` | Debug deployment issue |
| Need revert | `/launch rollback` | Rollback to previous version |

**Handoff to /monitor:**

```markdown
🚀 Deployed v[version] to production! URL: [url].
Health check: ✅. Run `/monitor` to track or `/chronicle` for docs.
```
