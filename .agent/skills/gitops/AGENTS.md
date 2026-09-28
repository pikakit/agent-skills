# Gitops Agent Rules

> Generated from 3 source rules for gitops v4.0.0. Do not edit directly.

## Mandatory Rules

| Impact | Kind | Rule | Requirement |
|---|---|---|---|
| critical | reference | [Argo CD Setup and Access Control](references/AGENTS.full.md#rule-argocd-setup) | Installation, access, SSO, and RBAC configuration for ArgoCD. |
| critical | decision | [GitOps Reconciliation Decision](references/AGENTS.full.md#rule-engineering-spec) | Use a pull-based controller when Kubernetes desired state can be declarative, versioned, automatically reconciled, and continuously observed. Keep environment changes in reviewed Git history, referenc |
| critical | reference | [GitOps Reconciliation Policies](references/AGENTS.full.md#rule-sync-policies) | Sync strategies, windows, retry policies, and health checks for ArgoCD and Flux. |

## Use

Apply every relevant rule. Open the linked full rule before implementation, review, or release decisions.
