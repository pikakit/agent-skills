---
name: vercel-deploy
description: >-
  Deploy applications and websites to Vercel. Use this skill when the user requests
  deployment actions such as "Deploy my app", "Deploy this to production",
  "Create a preview deployment", "Deploy and give me the link", or "Push this live".
  No authentication required - returns preview URL and claimable deployment link.
  Triggers on: deploy, vercel, production, preview, push live.
  Coordinates with: cicd-pipeline, nextjs-pro.
metadata:
  version: "2.0.0"
  category: "core"
  triggers: "deploy, vercel, production, preview, push live"
  success_metrics: "deployment URL returned, site live"
  coordinates_with: "cicd-pipeline, nextjs-pro"
---

# Vercel Deploy â€” Zero-Auth Deployment

> Package â†’ Detect Framework â†’ Upload â†’ Preview URL + Claim URL

---

## Prerequisites

| Requirement | Type |
|-------------|------|
| Bash shell (Linux/macOS/WSL) | Required |
| `tar` command | Required |
| `curl` command | Required |
| Vercel account | Optional (for claiming) |

---

## When to Use

| Situation | Approach |
|-----------|----------|
| Deploy app | `bash scripts/deploy.sh [path]` |
| Preview deployment | Deploy â†’ get preview URL |
| Production deploy | Deploy â†’ claim via claim URL |
| Quick demo | Instant deploy, no auth |

---

## System Boundaries

| Owned by This Skill | NOT Owned |
|---------------------|-----------|
| Tarball packaging (excl. node_modules/.git) | CI/CD pipeline (â†’ cicd-pipeline) |
| Framework auto-detection (40+ frameworks) | Release workflow (â†’ /launch) |
| Upload to Vercel API | Custom domains / env vars |
| Preview URL + Claim URL output | Deployment claiming |

**Automation skill:** Creates tarball, makes network requests. Has side effects.

---

## 4-Stage Pipeline

```
INIT â†’ PACKAGING [path provided]
PACKAGING â†’ DETECTING [tarball created]
DETECTING â†’ UPLOADING [framework identified]
UPLOADING â†’ DEPLOYED [upload successful]     // terminal
UPLOADING â†’ FAILED [upload error]            // terminal
PACKAGING â†’ FAILED [no project files]        // terminal
```

---

## Usage

```bash
bash scripts/deploy.sh [path]
```

| Argument | Description |
|----------|-------------|
| `path` | Directory or `.tgz` file (default: current directory) |

### Output (JSON to stdout)

```json
{
  "previewUrl": "https://skill-deploy-abc123.vercel.app",
  "claimUrl": "https://vercel.com/claim-deployment?code=...",
  "deploymentId": "dpl_...",
  "projectId": "prj_..."
}
```

---

## Framework Detection

Auto-detects from `package.json`:
- **React:** Next.js, Gatsby, CRA, Remix, React Router
- **Vue:** Nuxt, Vitepress, Vuepress, Gridsome
- **Svelte:** SvelteKit, Svelte, Sapper
- **Other:** Astro, Solid, Angular, Ember, Preact, Docusaurus
- **Backend:** Express, Hono, Fastify, NestJS, Elysia, h3
- **Build:** Vite, Parcel
- **Static HTML:** No package.json â†’ framework: null

---

## Error Taxonomy

| Code | Recoverable | Trigger |
|------|-------------|---------|
| `ERR_MISSING_PREREQ` | No | bash, tar, or curl not available |
| `ERR_NO_PROJECT` | Yes | No project files in path |
| `ERR_NETWORK_BLOCKED` | Yes | Egress to *.vercel.com blocked |
| `ERR_UPLOAD_TIMEOUT` | Yes | Upload exceeded 300s |
| `ERR_UPLOAD_FAILED` | Yes | HTTP error during upload |
| `ERR_INVALID_TARBALL` | Yes | Provided .tgz is invalid |

**Upload retry:** 1 retry on timeout. All other errors: zero retries.

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| Network egress error | Allowlist `*.vercel.com` in network settings |
| Large project timeout | Exclude node_modules (automatic); increase timeout |
| Static HTML not at root | Single non-index.html auto-renamed to index.html |
| Claude.ai egress blocked | Settings â†’ Capabilities â†’ Add *.vercel.com |

---

## ðŸ“‘ Content Map

| File | Description | When to Read |
|------|-------------|--------------|
| [scripts/deploy.sh](scripts/deploy.sh) | Deploy script | Running deploys |
| [engineering-spec.md](rules/engineering-spec.md) | Full spec | Architecture review |

---

## ðŸ”— Related

| Item | Type | Purpose |
|------|------|---------|
| `cicd-pipeline` | Skill | Deployment pipelines |
| `/launch` | Workflow | Release workflow |
| `nextjs-pro` | Skill | Next.js apps |

---

âš¡ PikaKit v3.9.105
