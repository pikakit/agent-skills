---
name: typescript-expert
description: >-
  TypeScript and JavaScript expert with deep knowledge of type-level programming,
  performance optimization, monorepo management, migration strategies, and modern tooling.
  Use PROACTIVELY for any TypeScript/JavaScript issues including complex type gymnastics,
  build performance, debugging, and architectural decisions.
  Triggers on: TypeScript, JavaScript, type error, tsconfig, monorepo.
  Coordinates with: nextjs-pro, react-architect, code-review.
metadata:
  category: "framework"
  version: "2.0.0"
  triggers: "TypeScript, JavaScript, type error, tsconfig, monorepo"
  coordinates_with: "nextjs-pro, react-architect, code-review"
  success_metrics: "tsc passes, no type errors"
---

# TypeScript Expert

> **Purpose:** Advanced TypeScript problem-solving and optimization

---

## When to Use

| Situation | Approach |
|-----------|----------|
| Type errors | Check type patterns |
| Build performance | See performance guide |
| Monorepo setup | Check monorepo patterns |
| Migration strategy | See migration guide |

---

## Quick Reference

| Task | Command |
|------|---------|
| Type check | `npx tsc --noEmit` |
| Performance | `npx tsc --extendedDiagnostics` |
| Trace resolution | `npx tsc --traceResolution` |

---

## Type-Level Patterns

### Branded Types
```typescript
type Brand<K, T> = K & { __brand: T };
type UserId = Brand<string, 'UserId'>;
type OrderId = Brand<string, 'OrderId'>;
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

## Common Errors

| Error | Fix |
|-------|-----|
| "Cannot be named" | Export type explicitly |
| "Excessive depth" | Limit recursion, use interface |
| "Cannot find module" | Check moduleResolution |
| Missing types | Add ambient declaration |

---

## Performance Tips

| Setting | Effect |
|---------|--------|
| `skipLibCheck: true` | Skip library type checking |
| `incremental: true` | Cache builds |
| Project references | Monorepo optimization |

---

## Strict Config (Recommended)

```json
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitOverride": true
  }
}
```

---

## ESM-First

```json
{
  "type": "module",
  "moduleResolution": "bundler"
}
```

---

## References

For detailed patterns and debugging:
- [references/type-patterns.md](references/type-patterns.md)
- [references/performance.md](references/performance.md)
- [references/monorepo.md](references/monorepo.md)
- [references/migration.md](references/migration.md)

---

> **Remember:** Validate changes with `npx tsc --noEmit` before done.

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| Type error with generics | Add explicit type annotations |
| `any` type spreading | Enable `noImplicitAny` in tsconfig |
| Module resolution fails | Check `moduleResolution: "bundler"` in TS 5+ |
| Slow type checking | Use project references, exclude node_modules |
| ESM/CJS mismatch | Set `"type": "module"` in package.json |

---

## 🔗 Related

| Item | Type | Purpose |
|------|------|---------|
| `nextjs-pro` | Skill | Next.js + TS |
| `react-architect` | Skill | React + TS |
| `code-review` | Skill | Code quality |

---

⚡ PikaKit v3.9.68
