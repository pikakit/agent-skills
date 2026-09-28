# Gitops Full Agent Rules

> Deterministic compilation of 3 source rules for gitops v4.0.0. Do not edit directly.

## Rule Index

- [Argo CD Setup and Access Control](#rule-argocd-setup) (critical, reference, source: `rules/argocd-setup.md`)
- [GitOps Reconciliation Decision](#rule-engineering-spec) (critical, decision, source: `rules/engineering-spec.md`)
- [GitOps Reconciliation Policies](#rule-sync-policies) (critical, reference, source: `rules/sync-policies.md`)

<a id="rule-argocd-setup"></a>

## Argo CD Setup and Access Control

**Impact:** critical
**Kind:** reference
**Source:** `rules/argocd-setup.md`

# ArgoCD Setup and Configuration

> Installation, access, SSO, and RBAC configuration for ArgoCD.

## Scope

Apply to Argo CD installation, repository and cluster credentials, SSO, RBAC, projects, and controller blast radius.

## Guidance

---

## Installation Methods

### 1. Standard Installation
```bash
kubectl create namespace argocd
kubectl apply -n argocd -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml
```

### 2. High Availability Installation
```bash
kubectl apply -n argocd -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/ha/install.yaml
```

### 3. Helm Installation
```bash
helm repo add argo https://argoproj.github.io/argo-helm
helm install argocd argo/argo-cd -n argocd --create-namespace
```

## Initial Configuration

### Access ArgoCD UI
```bash
# Port forward
kubectl port-forward svc/argocd-server -n argocd 8080:443

# Get initial admin password
argocd admin initial-password -n argocd
```

### Configure Ingress
```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: argocd-server-ingress
  namespace: argocd
  annotations:
    cert-manager.io/cluster-issuer: letsencrypt-prod
    nginx.ingress.kubernetes.io/ssl-passthrough: "true"
    nginx.ingress.kubernetes.io/backend-protocol: "HTTPS"
spec:
  ingressClassName: nginx
  rules:
  - host: argocd.example.com
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: argocd-server
            port:
              number: 443
  tls:
  - hosts:
    - argocd.example.com
    secretName: argocd-secret
```

## CLI Configuration

### Login
```bash
argocd login argocd.example.com --username admin
```

### Add Repository
```bash
argocd repo add https://github.com/org/repo --username user --password token
```

### Create Application
```bash
argocd app create my-app \
  --repo https://github.com/org/repo \
  --path apps/my-app \
  --dest-server https://kubernetes.default.svc \
  --dest-namespace production
```

## SSO Configuration

### GitHub OAuth
```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: argocd-cm
  namespace: argocd
data:
  url: https://argocd.example.com
  dex.config: |
    connectors:
      - type: github
        id: github
        name: GitHub
        config:
          clientID: $GITHUB_CLIENT_ID
          clientSecret: $GITHUB_CLIENT_SECRET
          orgs:
          - name: my-org
```

## RBAC Configuration
```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: argocd-rbac-cm
  namespace: argocd
data:
  policy.default: role:readonly
  policy.csv: |
    p, role:developers, applications, *, */dev, allow
    p, role:operators, applications, *, */*, allow
    g, my-org:devs, role:developers
    g, my-org:ops, role:operators
```

## Best Practices

1. Enable SSO for production
2. Implement RBAC policies
3. Use separate projects for teams
4. Enable audit logging
5. Configure notifications
6. Use ApplicationSets for multi-cluster
7. Implement resource hooks
8. Configure health checks
9. Use sync windows for maintenance
10. Monitor with Prometheus metrics

## Verification

Verify least-privilege RBAC, project and cluster boundaries, SSO group mapping, credential rotation, TLS trust, repository access, audit logs, health, controller outage, and disaster recovery. Remove bootstrap credentials after use.

---

? PikaKit v3.9.224

<a id="rule-engineering-spec"></a>

## GitOps Reconciliation Decision

**Impact:** critical
**Kind:** decision
**Source:** `rules/engineering-spec.md`

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

<a id="rule-sync-policies"></a>

## GitOps Reconciliation Policies

**Impact:** critical
**Kind:** reference
**Source:** `rules/sync-policies.md`

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
