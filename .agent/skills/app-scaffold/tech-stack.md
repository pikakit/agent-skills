---
name: tech-stack
description: Context-driven technology selection for 2026. Decision trees, tradeoff matrices, version pinning.
---

# Tech Stack Selection (2026)

> Context-driven technology selection. No defaults — evaluate tradeoffs for THIS project.

---

## Decision Tree

```
What type of project?
│
├── Web App (Full-stack)
│   ├── TypeScript monorepo? → Next.js + tRPC + Prisma
│   ├── Vue preferred? → Nuxt 3 + Pinia
│   ├── Performance-critical? → Next.js + Drizzle + Edge Runtime
│   └── Default → Next.js + Prisma + Auth.js
│
├── API-Only
│   ├── TypeScript? → Hono (Edge) or Fastify (Node)
│   ├── Python? → FastAPI + SQLAlchemy
│   └── High throughput? → Go / Rust (out of scope)
│
├── Mobile
│   ├── Cross-platform + shared codebase? → Flutter + Riverpod
│   ├── React ecosystem? → Expo + Zustand
│   └── Native performance required? → Swift/Kotlin (out of scope)
│
├── Desktop
│   └── Electron + React + Vite
│
└── CLI
    └── Node.js + Commander + Chalk
```

---

## Default Stack (Web App - 2026)

```yaml
Frontend:
  framework: Next.js 15 (App Router)
  language: TypeScript 5.7+
  styling: Tailwind CSS v4
  state: React 19 Server Components + Actions
  bundler: Turbopack

Backend:
  runtime: Node.js 22 LTS
  framework: Next.js API Routes / Hono (Edge)
  validation: Zod / TypeBox

Database:
  primary: PostgreSQL
  orm: Prisma (default) / Drizzle (performance)
  hosting: Supabase / Neon

Auth:
  provider: Auth.js v5 / Clerk

Monorepo:
  tool: Turborepo 2.0
  package manager: pnpm
```

---

## Tradeoff Matrix

| Factor | Prisma | Drizzle | SQLAlchemy |
|--------|--------|---------|------------|
| DX (developer experience) | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ |
| Performance | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| Type safety | Schema-generated | SQL-like DSL | Manual |
| Migration | Built-in | Kit | Alembic |
| Best for | Rapid development | Edge/serverless | Python projects |

| Factor | Auth.js | Clerk | Supabase Auth |
|--------|---------|-------|---------------|
| Cost | Free | Freemium | Free tier |
| Customization | Full | Limited | Medium |
| Setup complexity | Medium | Low | Low |
| Social providers | Many | Many | Many |
| Self-hosted | Yes | No | Yes |

---

## Version Pinning Strategy

| Dependency Type | Pin Strategy | Example |
|----------------|-------------|---------|
| Framework | Minor range | `"next": "^15.0.0"` |
| Runtime | LTS only | Node.js 22 LTS |
| CSS framework | Major lock | `"tailwindcss": "^4.0.0"` |
| ORM | Minor range | `"prisma": "^6.0.0"` |
| Dev tools | Latest | `"vitest": "latest"` |

**Rule:** Lock major versions for production deps. Use ranges for dev tools.

---

## Alternative Options

| Need | Default | Alternative | When |
|------|---------|-------------|------|
| Real-time | — | Supabase Realtime, Socket.io | Chat, live updates |
| File storage | — | Cloudinary, S3, Uploadthing | Media uploads |
| Payment | Stripe | LemonSqueezy, Polar | SaaS billing |
| Email | — | Resend, SendGrid | Transactional email |
| Search | — | Algolia, Typesense, Meilisearch | Full-text search |
| Cache | — | Redis, Upstash | Session, rate limiting |
| Queue | — | BullMQ, Inngest | Background jobs |
| Analytics | — | PostHog, Plausible | Privacy-friendly |

---

> **Rule:** Choose technology based on project constraints, not personal preference.

---

## 🔗 Related

| File | When to Read |
|------|-------------|
| [project-detection.md](project-detection.md) | Detect project type first |
| [scaffolding.md](scaffolding.md) | Directory structure after stack selection |
| [SKILL.md](SKILL.md) | Full pipeline overview |
