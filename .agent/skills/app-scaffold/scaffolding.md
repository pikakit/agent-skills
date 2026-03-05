---
name: scaffolding
description: Universal directory structure principles, reference architectures, path aliases, file placement guide.
---

# Project Scaffolding

> Universal structure principles + reference architectures for all templates.

---

## Universal Principles (All Templates)

| Principle | Rule | Rationale |
|-----------|------|-----------|
| **Feature isolation** | Group by feature, not by file type | Reduces cross-feature coupling |
| **Server/Client separation** | Explicit boundaries between server and client code | Prevents secret leaks, reduces bundle |
| **Thin routes** | Routes = routing only, logic lives in features | Keeps routes scannable, logic testable |
| **Shared code** | Only truly reusable code in `shared/` | Prevents premature abstraction |
| **Convention over config** | Follow framework conventions, customize only when needed | Reduces onboarding friction |
| **Environment safety** | `.env.example` always present, `.env` always gitignored | Prevents credential leaks |

---

## Reference: Next.js Full-Stack (Primary Template)

```
project-name/
├── src/
│   ├── app/                        # Routes (thin layer)
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── globals.css
│   │   ├── (auth)/                 # Route group
│   │   │   ├── login/page.tsx
│   │   │   └── register/page.tsx
│   │   ├── (dashboard)/
│   │   │   ├── layout.tsx
│   │   │   └── page.tsx
│   │   └── api/
│   │       └── [resource]/route.ts
│   │
│   ├── features/                   # Feature modules
│   │   ├── auth/
│   │   │   ├── components/
│   │   │   ├── hooks/
│   │   │   ├── actions.ts          # Server Actions
│   │   │   ├── queries.ts          # Data fetching
│   │   │   └── types.ts
│   │   └── [feature-name]/
│   │       └── ...
│   │
│   ├── shared/                     # Reusable utilities
│   │   ├── components/ui/
│   │   ├── lib/
│   │   └── hooks/
│   │
│   └── server/                     # Server-only
│       ├── db/
│       ├── auth/
│       └── services/
│
├── prisma/
│   ├── schema.prisma
│   ├── migrations/
│   └── seed.ts
│
├── public/
├── .env.example
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── README.md
```

---

## Template Structure Patterns

Each template follows a common pattern adapted to its framework:

| Template | Feature Dir | Server Dir | Config Files |
|----------|------------|-----------|-------------|
| **Next.js** | `src/features/` | `src/server/` | `next.config.ts`, `tailwind.config.ts` |
| **Nuxt** | `composables/`, `components/` | `server/api/` | `nuxt.config.ts` |
| **Express API** | `src/modules/` | `src/` (all server) | `tsconfig.json` |
| **FastAPI** | `app/routers/` | `app/` (all server) | `pyproject.toml` |
| **React Native** | `src/features/` | N/A (API separate) | `app.json`, `eas.json` |
| **Flutter** | `lib/features/` | N/A (API separate) | `pubspec.yaml` |
| **Electron** | `src/renderer/features/` | `src/main/` | `electron-builder.yml` |
| **Chrome Ext** | `src/popup/`, `src/content/` | `src/background/` | `manifest.json` |
| **CLI** | `src/commands/` | N/A | `package.json` (bin) |
| **Monorepo** | `apps/*/src/features/` | `packages/*/` | `turbo.json` |

---

## Core Files (Every Project)

| File | Purpose | Required? |
|------|---------|---------:|
| `package.json` / `pubspec.yaml` / `pyproject.toml` | Dependencies + scripts | ✅ |
| `tsconfig.json` / equivalent | Language config | ✅ |
| `.env.example` | Environment template (no secrets) | ✅ |
| `.gitignore` | Git ignore rules | ✅ |
| `README.md` | Project documentation | ✅ |
| `Dockerfile` | Container config | Optional |
| `.github/workflows/ci.yml` | CI pipeline | Optional |

---

## Path Aliases

```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"],
      "@/features/*": ["./src/features/*"],
      "@/shared/*": ["./src/shared/*"],
      "@/server/*": ["./src/server/*"]
    }
  }
}
```

---

## File Placement Guide

| Need | Location | Example |
|------|----------|---------|
| New page/route | `app/(group)/page.tsx` | Dashboard page |
| Feature component | `features/[name]/components/` | `ProductCard.tsx` |
| Server action | `features/[name]/actions.ts` | `createOrder` |
| Data fetching | `features/[name]/queries.ts` | `getProducts` |
| Reusable UI | `shared/components/ui/` | `Button`, `Modal` |
| Database query | `server/db/` | Prisma client wrapper |
| External API | `server/services/` | Stripe, email |
| Global hook | `shared/hooks/` | `useDebounce` |
| Type definitions | `features/[name]/types.ts` | Feature-scoped types |

---

> **Rule:** When unsure where a file goes, ask: "Is this feature-specific or truly shared?" Feature-specific → `features/`. Shared → `shared/`.

---

## 🔗 Related

| File | When to Read |
|------|-------------|
| [tech-stack.md](tech-stack.md) | Stack selection before scaffolding |
| [agent-coordination.md](agent-coordination.md) | Agent execution order |
| [SKILL.md](SKILL.md) | Full pipeline overview |
