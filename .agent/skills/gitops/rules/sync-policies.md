---
title: GitOps Reconciliation Policies
kind: reference
impact: critical
tags: [gitops, reconciliation, drift]
applies_to: [kubernetes, argocd, flux]
last_reviewed: "2026-09-28"
sources:
  - title: Argo CD Automated Sync Policy
    url: https://argo-cd.readthedocs.io/en/stable/user-guide/auto_sync/
  - title: Flux Reconciliation
    url: https://fluxcd.io/flux/components/source/gitrepositories/
---

# GitOps Sync Policies

> Sync strategies, windows, retry policies, and health checks for ArgoCD and Flux.

## Scope

Apply to automated/manual reconciliation, pruning, self-healing, windows, retries, health, drift, promotion, and rollback.

## Guidance

---

## ArgoCD Sync Policies

### Automated Sync
```yaml
syncPolicy:
  automated:
    prune: true       # Delete resources removed from Git
    selfHeal: true    # Reconcile manual changes
    allowEmpty: false # Prevent empty sync
```

### Manual Sync
```yaml
syncPolicy:
  syncOptions:
  - PrunePropagationPolicy=foreground
  - CreateNamespace=true
```

### Sync Windows
```yaml
syncWindows:
- kind: allow
  schedule: "0 8 * * *"
  duration: 1h
  applications:
  - my-app
- kind: deny
  schedule: "0 22 * * *"
  duration: 8h
  applications:
  - '*'
```

### Retry Policy
```yaml
syncPolicy:
  retry:
    limit: 5
    backoff:
      duration: 5s
      factor: 2
      maxDuration: 3m
```

## Flux Sync Policies

### Kustomization Sync
```yaml
apiVersion: kustomize.toolkit.fluxcd.io/v1
kind: Kustomization
metadata:
  name: my-app
spec:
  interval: 5m
  prune: true
  wait: true
  timeout: 5m
  retryInterval: 1m
  force: false
```

### Source Sync Interval
```yaml
apiVersion: source.toolkit.fluxcd.io/v1
kind: GitRepository
metadata:
  name: my-app
spec:
  interval: 1m
  timeout: 60s
```

## Health Assessment

### Custom Health Checks
```yaml
# ArgoCD
apiVersion: v1
kind: ConfigMap
metadata:
  name: argocd-cm
  namespace: argocd
data:
  resource.customizations.health.MyCustomResource: |
    hs = {}
    if obj.status ~= nil then
      if obj.status.conditions ~= nil then
        for i, condition in ipairs(obj.status.conditions) do
          if condition.type == "Ready" and condition.status == "False" then
            hs.status = "Degraded"
            hs.message = condition.message
            return hs
          end
          if condition.type == "Ready" and condition.status == "True" then
            hs.status = "Healthy"
            hs.message = condition.message
            return hs
          end
        end
      end
    end
    hs.status = "Progressing"
    hs.message = "Waiting for status"
    return hs
```

## Sync Options

### Common Sync Options
- `PrunePropagationPolicy=foreground` - Wait for pruned resources to be deleted
- `CreateNamespace=true` - Auto-create namespace
- `Validate=false` - Skip kubectl validation
- `PruneLast=true` - Prune resources after sync
- `RespectIgnoreDifferences=true` - Honor ignore differences
- `ApplyOutOfSyncOnly=true` - Only apply out-of-sync resources

## Best Practices

1. Match automation to environment risk and recovery maturity
2. Require the configured production approval and policy gates
3. Configure sync windows for maintenance
4. Implement health checks for custom resources
5. Use selective sync for large applications
6. Configure appropriate retry policies
7. Monitor sync failures with alerts
8. Use prune with caution in production
9. Test sync policies in staging
10. Document sync behavior for teams

## Verification

Test manifest diff, failed health, drift, retry exhaustion, sync windows, repository outage, controller outage, pruning preview, rollback commit, and alerts. Require explicit ownership before enabling automated pruning in production.

---

? PikaKit v3.9.224
