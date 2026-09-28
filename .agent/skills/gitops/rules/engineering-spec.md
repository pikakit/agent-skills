---
title: GitOps Reconciliation Decision
kind: decision
impact: critical
tags: [gitops, kubernetes, reconciliation]
applies_to: [kubernetes, argocd, flux]
last_reviewed: "2026-09-28"
sources:
  - title: Kubernetes Declarative Management
    url: https://kubernetes.io/docs/tasks/manage-kubernetes-objects/declarative-config/
---

# GitOps Reconciliation Decision

## Decision

Use a pull-based controller when Kubernetes desired state can be declarative, versioned, automatically reconciled, and continuously observed. Keep environment changes in reviewed Git history, reference secrets from an approved secret system, and promote immutable artifact identities. Choose Argo CD for application-centric visualization and policy or Flux for composable toolkit workflows only after operational requirements are known.

## Use When

- Multiple Kubernetes environments require audited promotion and drift repair.
- Operators can define ownership, repository access, controller tenancy, and recovery.
- Workloads expose reliable health and reconciliation signals.

## Avoid When

- The target is not Kubernetes or cannot be represented declaratively.
- Secrets would be committed in plaintext.
- Controller privileges, blast radius, health checks, or recovery are undefined.

## Trade-offs

- Automatic reconciliation reduces drift but can quickly amplify a bad desired state.
- Pruning removes orphaned resources but can cause deletion when ownership is ambiguous.
- Monorepos simplify atomic change but broaden access and controller watch scope.
- Per-environment repositories isolate permissions but increase promotion coordination.

## Verification

Validate manifests and policies before merge, preview the diff, verify artifact signatures where configured, and test controller outage, repository outage, health failure, drift, rollback commit, and disaster recovery. Alert on reconciliation errors, stale desired state, unexpected drift, pruning, and privileged changes.
