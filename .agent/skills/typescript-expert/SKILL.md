---
name: typescript-expert
description: >-
  TypeScript and JavaScript expert with deep knowledge of type-level programming,
  performance tuning, monorepo management, migration strategies, and modern tooling.
  Use PROACTIVELY for any TypeScript/JavaScript issues including complex type gymnastics,
  build performance, debugging, and architectural decisions.
  Triggers on: TypeScript, JavaScript, type error, tsconfig, monorepo.
  Coordinates with: nextjs-pro, react-architect, code-review.
metadata:
  version: "2.0.0"
  category: "framework"
  triggers: "TypeScript, JavaScript, type error, tsconfig, monorepo"
  success_metrics: "tsc passes, no type errors"
  coordinates_with: "nextjs-pro, react-architect, code-review"
---

# TypeScript Expert — Advanced TS Problem-Solving

> Strict mode. ESM-first. Type-level patterns. Deterministic error routing.

---

## When to Use

| Situation | Approach |
|-----------|----------|
| Type errors | Check error routing table |
| Build performance | See performance settings |
| Monorepo setup | Check project references |
| Migration strategy | See references/migration.md |
| Module issues | ESM-first config |

---

## System Boundaries

| Owned by This Skill | NOT Owned |
|---------------------|-----------|
| Type-level patterns (3) | Next.js integration (→ nextjs-pro) |
| Error → fix routing (4 errors) | React patterns (→ react-architect) |
| Performance config (3 settings) | Code review (→ code-review) |
| Strict config + ESM-first | Build tooling (Vite/webpack) |

**Expert decision skill:** Produces TS guidance. Does not execute compilers.

---

## Diagnostics (3 Commands)

| Task | Command |
|------|---------|
| Type check | `npx tsc --noEmit` |
| Performance | `npx tsc --extendedDiagnostics` |
| Trace resolution | `npx tsc --traceResolution` |

---

## Common Errors (4 — Deterministic Routing)

| Error | Fix |
|-------|-----|
| "Cannot be named" | Export type explicitly |
| "Excessive depth" | Limit recursion, use `interface` instead of `type` |
| "Cannot find module" | Check `moduleResolution: "bundler"` |
| Missing types | Add ambient declaration (`.d.ts`) |

---

## Type-Level Patterns (3)

### Branded Types
```typescript
type Brand<K, T> = K & { __brand: T };
type UserId = Brand<string, 'UserId'>;
```

### Deep Readonly
```typescript
type DeepReadonly<T> = T extends object
  ? { readonly [K in keyof T]: DeepReadonly<T[K]> }
  : T;
```

### Satisfies (TS 5.0+)
```typescript
const config = {
  api: "https://api.example.com",
  timeout: 5000
} satisfies Record<string, string | number>;
```

---

## Strict Config (Recommended — Fixed)

```json
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitOverride": true
  }
}
```

## ESM-First Config (Fixed)

```json
{
  "type": "module",
  "moduleResolution": "bundler"
}
```

---

## Performance Settings (3 — Fixed)

| Setting | Effect |
|---------|--------|
| `skipLibCheck: true` | Skip library type checking |
| `incremental: true` | Cache builds |
| Project references | Monorepo parallel builds |

---

## Error Taxonomy

| Code | Recoverable | Trigger |
|------|-------------|---------|
| `ERR_INVALID_REQUEST_TYPE` | No | Request type not supported |
| `ERR_UNKNOWN_ERROR` | Yes | tsc error not in routing table |
| `ERR_UNSUPPORTED_VERSION` | Yes | TS version below 5.0 |
| `ERR_UNKNOWN_PROJECT_TYPE` | Yes | Not app, library, or monorepo |

**Zero internal retries.** Same error = same fix.

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| `any` type spreading | Enable `noImplicitAny` in tsconfig |
| Module resolution fails | Set `moduleResolution: "bundler"` (TS 5+) |
| Slow type checking | Use project references, `skipLibCheck: true` |
| ESM/CJS mismatch | Set `"type": "module"` in package.json |

---

## 📑 Content Map

| File | Description | When to Read |
|------|-------------|--------------|
| [tsconfig-strict.json](references/tsconfig-strict.json) | Strict TS 5.x config template | New project setup |
| [typescript-cheatsheet.md](references/typescript-cheatsheet.md) | Full TS quick reference (13 sections) | Writing TypeScript |
| [utility-types.js](references/utility-types.js) | Runtime utilities (Result, Option, Brand) | JavaScript helpers |
| [type-patterns.md](references/type-patterns.md) | Advanced type patterns | Type gymnastics |
| [performance.md](references/performance.md) | Build performance | Slow builds |
| [monorepo.md](references/monorepo.md) | Monorepo setup | Project references |
| [migration.md](references/migration.md) | Migration strategies | Version upgrades |
| [ts_diagnostic.js](scripts/ts_diagnostic.js) | Project health analysis | Automated diagnostics |
| [engineering-spec.md](references/engineering-spec.md) | Full spec | Architecture review |

---

## 🔗 Related

| Item | Type | Purpose |
|------|------|---------|
| `nextjs-pro` | Skill | Next.js + TS |
| `react-architect` | Skill | React + TS |
| `code-review` | Skill | Code quality |

---

⚡ PikaKit v3.9.83
