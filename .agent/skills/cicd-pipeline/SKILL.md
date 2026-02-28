---
name: cicd-pipeline
description: >-
  Production deployment principles and decision-making. Safe deployment workflows, rollback strategies.
  Triggers on: deploy, deployment, CI/CD, pipeline, rollback, release.
  Coordinates with: git-workflow, security-scanner, feature-flags.
metadata:
  category: "devops"
  version: "2.0.0"
  triggers: "deploy, CI/CD, pipeline, rollback, release"
  coordinates_with: "git-workflow, security-scanner, feature-flags"
  success_metrics: "zero downtime, rollback ready"
---

# CI/CD Pipeline

> **Purpose:** Safe production deployment with rollback capability

---

## Quick Reference

| Task | Action |
|------|--------|
| **Pre-deploy** | Tests ✅ Build ✅ Env ✅ Backup ✅ |
| **Deploy** | Monitor actively during deploy |
| **Post-deploy** | Verify health, logs, key flows |
| **Rollback** | Speed > perfection, fix later |

---

## When to Use

| Situation | Approach |
|-----------|----------|
| Deploying new feature | Follow 5-phase |
| Production issue | Rollback first |
| Platform choice | Check selection guide |
| Scheduled release | Use pre-deploy checklist |

---

## 5-Phase Deployment

```
1. PREPARE → Tests, build, env vars
2. BACKUP  → Save current state
3. DEPLOY  → Execute with monitoring
4. VERIFY  → Health check, logs
5. CONFIRM → All good or rollback
```

---

## Platform Selection

| Type | Platform |
|------|----------|
| Static/JAMstack | Vercel, Netlify, Cloudflare |
| Web app | Railway, Render, Fly.io |
| VPS | PM2, Docker |
| Microservices | Kubernetes |

---

## Pre-Deployment Checklist

- [ ] All tests passing
- [ ] Code reviewed
- [ ] Production build OK
- [ ] Env vars verified
- [ ] Rollback plan ready
- [ ] Team notified

---

## Rollback Strategy

| Platform | Method |
|----------|--------|
| Vercel/Netlify | Redeploy previous commit |
| Railway/Render | Dashboard rollback |
| VPS + PM2 | Restore backup |
| Docker | Previous image tag |
| Kubernetes | `kubectl rollout undo` |

### When to Rollback

| Symptom | Action |
|---------|--------|
| Service down | Rollback immediately |
| Critical errors | Rollback |
| 50% perf degradation | Consider rollback |
| Minor issues | Fix forward if quick |

---

## Zero-Downtime Strategies

| Strategy | Use When |
|----------|----------|
| **Rolling** | Standard release |
| **Blue-Green** | High-risk change |
| **Canary** | Need real traffic validation |

---

## Anti-Patterns

| ❌ Don't | ✅ Do |
|---------|-------|
| Deploy Friday | Deploy early in week |
| Skip staging | Always test first |
| Walk away after deploy | Monitor 15+ min |
| Multiple changes at once | One change at a time |

---

## 🔗 Related

| Item | Type | Purpose |
|------|------|---------|
| `/launch` | Workflow | Deployment workflow |
| `security-scanner` | Skill | Pre-deploy scan |
| `gitops` | Skill | GitOps deployment |

---

## References

- [references/deployment-platforms.md](references/deployment-platforms.md)
- [references/emergency-procedures.md](references/emergency-procedures.md)

---

> **Remember:** Every deployment is a risk. Minimize risk through preparation.

---

⚡ PikaKit v3.9.66
