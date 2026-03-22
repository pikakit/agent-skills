---
name: cicd-pipeline
description: >-
  Production deployment principles and decision-making. Safe deployment workflows, rollback
  strategies. 5-phase lifecycle: Prepare â†’ Backup â†’ Deploy â†’ Verify â†’ Confirm. Triggers
  on: deploy, deployment, CI/CD, pipeline, rollback, release.
metadata:
  author: pikakit
  version: "3.9.106"
---

# CI/CD Pipeline

> Safe production deployment. 5-phase lifecycle. Rollback â‰¤ 5 minutes. Zero downtime.

---

## Prerequisites

**Required:** None â€” CI/CD Pipeline is a knowledge-based skill with no external dependencies.

**Optional:**
- `security-scanner` skill (pre-deploy security scan)
- `git-workflow` skill (release branching)
- `gitops` skill (GitOps deployment patterns)

---

## When to Use

| Situation | Approach |
|-----------|----------|
| Deploying new feature | Follow 5-phase deployment lifecycle |
| Production incident | Rollback first, fix later |
| Choosing deployment platform | Check platform selection table |
| Scheduled release | Use pre-deploy checklist |
| High-risk change | Use blue-green or canary strategy |
| Architecture review | Read `rules/engineering-spec.md` |

**Selective Reading Rule:** Read ONLY the reference file matching the current request.

---

## System Boundaries

| Owned by This Skill | NOT Owned |
|---------------------|-----------|
| Deployment strategy selection (rolling/blue-green/canary) | CI/CD tool configuration (â†’ implementation) |
| Platform selection per project type | Docker/K8s YAML generation (â†’ server-ops) |
| Rollback procedures per platform | Security scanning execution (â†’ security-scanner) |
| Pre-deploy validation checklist | Git workflow management (â†’ git-workflow) |
| Post-deploy monitoring plan | Infrastructure provisioning (â†’ server-ops) |

**Pure decision skill:** Produces deployment plans and runbooks. Zero side effects.

---

## 5-Phase Deployment Lifecycle

| Phase | Actions | Duration |
|-------|---------|----------|
| **1. Prepare** | Tests pass, build succeeds, env vars verified, security scan | 5â€“15 min |
| **2. Backup** | Save current state, tag current release | 1â€“5 min |
| **3. Deploy** | Execute deployment with active monitoring | 2â€“10 min |
| **4. Verify** | Health checks, log inspection, key user flows | 5â€“15 min |
| **5. Confirm** | All criteria met â†’ confirm; any failure â†’ rollback | 1 min |

**Pipeline is sequential.** Each phase completes before the next begins.

---

## Zero-Downtime Strategies

| Strategy | Risk Level | Use When |
|----------|-----------|----------|
| **Rolling** | Low | Standard feature release, stateless services |
| **Blue-Green** | High | Breaking changes, database migrations, compliance |
| **Canary** | Mediumâ€“High | Need real traffic validation before full rollout |

---

## Platform Selection

| Project Type | Platform | Rollback Method |
|-------------|----------|-----------------|
| Static / JAMstack | Vercel, Netlify, Cloudflare | Redeploy previous commit |
| Web app | Railway, Render, Fly.io | Dashboard rollback |
| VPS | PM2, Docker | Restore backup / previous image tag |
| Microservices | Kubernetes | `kubectl rollout undo` |

**Rollback target:** â‰¤ 5 minutes for all platforms.

---

## Error Taxonomy

| Code | Recoverable | Trigger |
|------|-------------|---------|
| `ERR_INVALID_REQUEST_TYPE` | No | Request type not one of the 7 supported types |
| `ERR_MISSING_CONTEXT` | Yes | Required context field is null or empty |
| `ERR_CONSTRAINT_CONFLICT` | Yes | Contradictory constraints |
| `ERR_INVALID_PROJECT_TYPE` | No | Project type not recognized |
| `ERR_INVALID_RISK_LEVEL` | No | Risk level not one of: low, medium, high, critical |
| `ERR_UNSUPPORTED_PLATFORM` | Yes | Platform not in supported list |
| `ERR_REFERENCE_NOT_FOUND` | No | Reference file missing |
| `ERR_MIGRATION_CONFLICT` | Yes | Database migration bundled with feature deploy |

**Zero internal retries.** Deterministic output; same context = same plan.

---

## Pre-Deploy Checklist

- [ ] All tests passing (unit + integration + E2E)
- [ ] Code reviewed and approved
- [ ] Production build succeeds with zero errors
- [ ] Environment variables verified (staging â†’ production diff)
- [ ] Rollback plan documented and tested
- [ ] Team notified of deployment window

---

## Anti-Patterns

| âŒ Don't | âœ… Do |
|---------|-------|
| Deploy on Friday | Deploy early in week (Monâ€“Wed) |
| Skip staging validation | Always test in staging first |
| Walk away after deploy | Monitor actively for â‰¥ 15 minutes |
| Bundle multiple changes | One logical change per deployment |
| Rollback without plan | Document rollback before deploying |
| Deploy security patches slowly | Hotfix path: test â†’ deploy â†’ verify in < 1 hour |

---

## ðŸ“‘ Content Map

| File | Description | When to Read |
|------|-------------|--------------|
| [deployment-platforms.md](rules/deployment-platforms.md) | Platform-specific deployment patterns | Choosing platform |
| [emergency-procedures.md](rules/emergency-procedures.md) | Incident response runbooks | Production incidents |
| [engineering-spec.md](rules/engineering-spec.md) | Full engineering spec: contracts, security, scalability | Architecture review |
| [scripts/](scripts/) | Deployment helper scripts | Script execution |

---

## ðŸ”— Related

| Item | Type | Purpose |
|------|------|---------|
| `/launch` | Workflow | Full deployment workflow |
| `security-scanner` | Skill | Pre-deploy security scan |
| `git-workflow` | Skill | Release branching and tagging |
| `gitops` | Skill | GitOps deployment patterns |
| `feature-flags` | Skill | Gradual rollout via flags |
| `server-ops` | Skill | Infrastructure management |

---

âš¡ PikaKit v3.9.106
