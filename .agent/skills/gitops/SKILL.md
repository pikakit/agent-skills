---
name: gitops-workflow
description: >-
  Implement GitOps workflows with ArgoCD and Flux for automated, declarative
  Kubernetes deployments with continuous reconciliation.
  Triggers on: GitOps, ArgoCD, Flux, Kubernetes, declarative deployment.
  Coordinates with: cicd-pipeline, server-ops.
metadata:
  category: "core"
  version: "2.0.0"
  triggers: "GitOps, ArgoCD, Flux, Kubernetes"
  coordinates_with: "cicd-pipeline, server-ops"
  success_metrics: "deployment automated, reconciliation active"
---

# GitOps Workflow

> **Purpose:** Declarative, Git-based continuous delivery for Kubernetes

---

## When to Use

| Situation | Approach |
|-----------|----------|
| K8s deployment | Choose ArgoCD or Flux |
| CD setup | Configure reconciliation |
| Secret management | Use sealed secrets |
| Multi-env | Setup promotion workflow |

---

## Quick Reference

| Tool | Install Command |
|------|-----------------|
| ArgoCD | `kubectl apply -n argocd -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml` |
| Flux | `flux bootstrap github --owner=ORG --repository=REPO` |

---

## OpenGitOps Principles

| Principle | Description |
|-----------|-------------|
| **Declarative** | Entire system described declaratively |
| **Versioned** | Desired state stored in Git |
| **Pulled Automatically** | Agents pull desired state |
| **Continuously Reconciled** | Agents reconcile actual vs desired |

---

## Repository Structure

```
gitops-repo/
├── apps/
│   ├── production/
│   └── staging/
├── infrastructure/
│   ├── ingress-nginx/
│   └── cert-manager/
└── argocd/
    └── applications/
```

---

## ArgoCD vs Flux

| Feature | ArgoCD | Flux |
|---------|--------|------|
| UI | ✅ Rich | ❌ CLI only |
| Multi-cluster | ✅ Native | ⚠️ Needs setup |
| Helm | ✅ Native | ✅ Native |
| Learning curve | Medium | Lower |

---

## Sync Policies

| Policy | Use When |
|--------|----------|
| **Manual** | Production, need approval |
| **Auto** | Dev/staging environments |
| **Prune** | Remove resources not in Git |
| **Self-Heal** | Revert manual cluster changes |

---

## Safety Rules

| Rule | Why |
|------|-----|
| No auto-sync to production | Requires approval |
| Keep secrets out of Git | Use sealed/external secrets |
| Always have rollback | Test rollback procedures |

---

## References

- [references/argocd-setup.md](references/argocd-setup.md)
- [references/flux-setup.md](references/flux-setup.md)
- [references/secret-management.md](references/secret-management.md)

---

> **Key:** Git is the single source of truth for cluster state.

---

## 🔗 Related

| Item | Type | Purpose |
|------|------|---------|
| `cicd-pipeline` | Skill | CI/CD |
| `server-ops` | Skill | Server management |
| `/launch` | Workflow | Deployment |

---

⚡ PikaKit v3.9.68
