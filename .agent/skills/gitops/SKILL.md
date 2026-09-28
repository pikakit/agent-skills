---
name: gitops
description: This skill should be used when the user asks to "set up GitOps", "configure Argo CD", "configure Flux", "design Kubernetes promotion", or "control reconciliation drift". Do not use it for non-Kubernetes CI or simple hosted deployment.
metadata:
  id: gitops
  schema_version: "2.0.0"
  type: knowledge
  category: delivery
  risk_tier: critical
  version: "4.0.0"
  author: pikakit
  triggers: ["set up GitOps", "configure Argo CD", "configure Flux", "design Kubernetes promotion", "control reconciliation drift"]
  negative_triggers: ["design non-Kubernetes CI", "deploy a static site", "make a Git commit"]
  coordinates_with: [cicd-pipeline, server-ops]
  capabilities: [reconciliation-design, environment-promotion, drift-control, gitops-security]
  platforms: [kubernetes, argocd, flux]
  last_reviewed: "2026-09-28"
  review_interval_days: 90
---

# GitOps Delivery

Operate Kubernetes through declarative, versioned, continuously reconciled desired state.

## Workflow

1. Define repository ownership, environment boundaries, approvers, and cluster trust.
2. Separate application source, built artifacts, and environment configuration.
3. Keep credentials out of Git; reference an approved secret-management system.
4. Pin immutable artifact identities and validate manifests before promotion.
5. Configure reconciliation, pruning, health, sync windows, and drift alerts by environment.
6. Promote through reviewed commits; avoid out-of-band cluster mutation.
7. Test rollback as a desired-state change and verify both controller and workload health.

## Routing

- Read [argocd-setup.md](rules/argocd-setup.md) for Argo CD bootstrap and access controls.
- Read [sync-policies.md](rules/sync-policies.md) for reconciliation and promotion policy.
- Read [engineering-spec.md](rules/engineering-spec.md) for tool choice and production gates.

## Safety Gate

Block automatic pruning or broad cluster permissions until scope, preview, recovery, and monitoring are verified. Treat an unavailable controller, repository, signature check, or health signal as an incomplete deployment.
