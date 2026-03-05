---
name: feature-building
description: Systematic process for adding features to existing projects. Scope analysis, dependency impact, error recovery, rollback.
---

# Feature Building

> Systematic process for analyzing, implementing, and validating new features in existing projects.

---

## Feature Analysis Protocol

Before implementing, analyze **all dimensions**:

```
Request: "add payment system"

1. SCOPE ANALYSIS
├── Database: orders, payments tables
├── Backend: /api/checkout, /api/webhooks/stripe
├── Frontend: CheckoutForm, PaymentSuccess, OrderHistory
├── Config: Stripe API keys, webhook secret
└── Tests: checkout flow, webhook handler, error cases

2. DEPENDENCY IMPACT
├── Direct: stripe package, @stripe/react-stripe-js
├── Existing: requires user auth (→ verify auth exists)
├── Schema: new tables reference users table (FK)
└── Breaking: none (additive feature)

3. RISK ASSESSMENT
├── Security: PCI compliance, webhook signature verification
├── Data: payment records are PII — encryption required
├── Failure modes: payment timeout, duplicate charges, webhook retry
└── Rollback: feature flag recommended for gradual rollout
```

---

## Implementation Phases

| Phase | Action | Gate Condition |
|-------|--------|----------------|
| 1. Analyze | Map affected files, dependencies, risks | Impact report reviewed |
| 2. Plan | Create change plan with file-level detail | User approves plan |
| 3. Prepare | Install deps, create migrations, env vars | Zero errors |
| 4. Implement | Apply changes in dependency order | Each file compiles |
| 5. Integrate | Wire components together, test connections | Build passes |
| 6. Validate | Run tests, manual verification | All tests green |
| 7. Preview | Show working feature to user | User confirms |

**Dependency order:** Schema → Backend → Frontend → Tests → Config

---

## Error Handling & Auto-Recovery

| Error Type | Detection | Auto-Fix Strategy | Escalation |
|------------|-----------|-------------------|------------|
| TypeScript Error | `tsc --noEmit` | Fix type, add missing import | Show error to user |
| Missing Dependency | Import resolution failure | `npm install <pkg>` | Check version compatibility |
| Port Conflict | EADDRINUSE | Kill process or suggest alt port | User decides |
| Database Error | Migration failure | Check schema, validate connection | Rollback migration |
| Build Failure | Non-zero exit code | Analyze error log, fix top error | Show full log |
| Test Failure | Test runner output | Fix assertion, update snapshot | Review test logic |

---

## Rollback Protocol

```
ROLLBACK TRIGGER: Build fails after 2 auto-fix attempts

AUTOMATIC:
1. git stash (save work)
2. Restore last known-good state
3. Report what was reverted
4. Propose safer approach

MANUAL (user-initiated):
1. git checkout -- <modified files>
2. Revert migrations: npx prisma migrate reset
3. Remove added dependencies: npm uninstall <pkg>
4. Clean generated files
```

---

## Testing Strategy

| Layer | What to Test | Tool |
|-------|-------------|------|
| Unit | Business logic, validators, transformers | Vitest |
| Integration | API routes + database, auth middleware | Vitest + Supertest |
| E2E | Full user flow (click → result) | Playwright |
| Snapshot | UI component rendering | Vitest |

**Minimum coverage for new features:**
- All API endpoints: happy path + error path
- All form submissions: valid + invalid input
- All state transitions: initial → loading → success/error

---

## Dependency Impact Matrix

Before modifying ANY file, check:

| Question | If YES |
|----------|--------|
| Does this file export types used elsewhere? | Update all consumers |
| Does this change a database schema? | Create migration, update seed |
| Does this modify an API response? | Update frontend consumers + tests |
| Does this add env variables? | Update `.env.example` + docs |
| Does this change auth/permissions? | Security review required |

---

> **Rule:** Never implement a feature without analyzing its blast radius first.

---

## 🔗 Related

| File | When to Read |
|------|-------------|
| [project-detection.md](project-detection.md) | Detect existing project type |
| [agent-coordination.md](agent-coordination.md) | Multi-agent pipeline |
| [SKILL.md](SKILL.md) | Full pipeline overview |
