---
name: project-detection
description: Keyword matrix for project type detection. Confidence scoring, multi-match resolution, ambiguity handling.
---

# Project Type Detection

> Systematic analysis of user requests to determine project type, template, and confidence.

---

## Keyword Matrix

| Keywords | Project Type | Template | Confidence |
|----------|-------------|----------|:----------:|
| blog, post, article, cms | Blog/CMS | astro-static | High |
| e-commerce, product, cart, payment, shop | E-commerce | nextjs-saas | High |
| dashboard, panel, management, admin | Admin Dashboard | nextjs-fullstack | High |
| api, backend, service, rest, graphql | API Service | express-api | High |
| python, fastapi, django, flask | Python API | python-fastapi | High |
| mobile, android, ios, react native, expo | Mobile App (RN) | react-native-app | High |
| flutter, dart, cross-platform mobile | Mobile App (Flutter) | flutter-app | High |
| portfolio, personal, cv, resume | Portfolio | nextjs-static | Medium |
| crm, customer, sales, pipeline | CRM | nextjs-fullstack | Medium |
| saas, subscription, stripe, pricing | SaaS | nextjs-saas | High |
| landing, promotional, marketing | Landing Page | nextjs-static | High |
| docs, documentation, wiki | Documentation | astro-static | High |
| extension, plugin, chrome, browser | Browser Extension | chrome-extension | High |
| desktop, electron, native app | Desktop App | electron-desktop | High |
| cli, command line, terminal, script | CLI Tool | cli-tool | High |
| monorepo, workspace, multi-package | Monorepo | monorepo-turborepo | High |
| vue, nuxt | Vue App | nuxt-app | High |

---

## Detection Process

```
1. TOKENIZE: Split user request into normalized keywords
2. MATCH: Score against keyword matrix (exact > partial > semantic)
3. RANK: Sort matches by confidence score
4. RESOLVE: Handle conflicts (see below)
5. VERIFY: Ask clarifying question if confidence < HIGH
6. SELECT: Return project type + template
```

---

## Confidence Scoring

| Level | Score | Action |
|-------|:-----:|--------|
| **High** | ≥ 3 keyword matches | Auto-select template |
| **Medium** | 2 keyword matches | Suggest template, ask to confirm |
| **Low** | 1 keyword match | Ask clarifying questions |
| **None** | 0 matches | Ask user to describe project type |

---

## Multi-Match Resolution

When multiple project types match:

| Scenario | Resolution | Example |
|----------|-----------|---------|
| Same confidence | Ask user to choose | "e-commerce dashboard" → SaaS or Admin? |
| Different confidence | Pick highest | "blog with payment" → SaaS (payment > blog) |
| Subset relationship | Pick more specific | "mobile dashboard" → React Native (not web dashboard) |
| Complementary | Suggest monorepo | "web + mobile + api" → Turborepo |

**Priority keywords** (override lower-priority matches):
1. `mobile`, `flutter`, `react native` → Always mobile template
2. `cli`, `command line` → Always CLI template
3. `extension`, `chrome` → Always extension template
4. `desktop`, `electron` → Always desktop template

---

## Ambiguity Handling

| Ambiguous Request | Missing Info | Question to Ask |
|-------------------|-------------|-----------------|
| "build me an app" | Everything | "Web, mobile, or desktop? What does it do?" |
| "need a website" | Purpose | "Landing page, blog, or web application?" |
| "create a project" | Type + domain | "What will users do with this?" |
| "e-commerce site" | Scale | "Simple storefront or full SaaS with subscriptions?" |
| "mobile app" | Platform | "Cross-platform (Flutter/RN) or native?" |

---

## Existing Project Detection

When a `project_path` already has files:

| Signal | Detection | Result |
|--------|-----------|--------|
| `package.json` exists | Read `dependencies` | Detect framework (next, nuxt, express) |
| `pubspec.yaml` exists | Check `dependencies` | Flutter project |
| `pyproject.toml` exists | Check `[tool]` | Python project |
| `manifest.json` exists | Check `manifest_version` | Chrome extension |
| `turbo.json` exists | Monorepo root | Turborepo monorepo |

→ Redirect to `feature-building.md` instead of scaffolding.

---

> **Rule:** Never assume project type. If confidence < HIGH, always ask.

---

## 🔗 Related

| File | When to Read |
|------|-------------|
| [tech-stack.md](tech-stack.md) | After type detected, select stack |
| [feature-building.md](feature-building.md) | If existing project detected |
| [SKILL.md](SKILL.md) | Full pipeline overview |
