# Changelog

All notable changes to PikaKit are documented in this file.

Format: [Keep a Changelog](https://keepachangelog.com/en/1.0.0/) · [Semantic Versioning](https://semver.org/spec/v2.0.0.html)

---

## [3.9.167] - 2026-05-04

### 🧠 Knowledge System Overhaul & Enforcement Gates

Comprehensive restructuring of the AI self-learning pipeline to ensure autonomous error capture and strict workflow enforcement.

**Knowledge System:**

- Consolidated directory structure: removed stale `raw/` and `decisions/` references
- Standardized all paths to `raw-signals/` and `adr/` across `knowledge-compiler` SKILL.md
- Re-indexed `_index.md` and `_graph.md` with accurate statistics (3 ADRs, 9 pattern files)
- Created placeholder patterns: `shell-syntax-patterns.md`, `npm-patterns.md`, `git-patterns.md`
- Normalized signal frontmatter (`compiled: true` standard)

**Enforcement Rules (Hard Gates):**

| Gate | File | Purpose |
|------|------|---------|
| Knowledge Gate | `GEMINI.md` | Mandatory post-fix check — AI must record learnable bugs |
| Auto-Learn Triggers | `autopilot.md § 0.5-H` | AI-initiated learning (regression, retry, multi-file, workflow violation) |
| Knowledge Verification | `code-rules.md` | Verify signals recorded before marking task complete |

**Fixes:**

- Fixed `package.json` license: `Proprietary` → `MIT` (both repos)
- Cleaned `.gitignore`: removed 4 stale rules for deleted directories

---

## [3.9.116] - 2026-04-06

### 🔄 Complete TypeScript Migration

Full migration from JavaScript/ESM to strict TypeScript across the entire repository.

**Infrastructure:**

- Initialized `tsconfig.json` with `strict: true`, `Node16` module, `DOM` lib
- Added `typescript`, `tsx`, `@types/node` to devDependencies
- Created `global.d.ts` for ambient declarations (playwright, puppeteer, csv-parse)
- Standardized on `npx tsx` for direct `.ts` execution (no build step)

**Scripts Converted (66 → TypeScript):**

| Category | Count | Details |
|----------|-------|---------|
| Core scripts (`.agent/scripts/`) | 12 | checklist, verify_all, version-sync, auto_preview, etc. |
| Skill scripts (`.agent/skills/*/scripts/`) | 57 | All 26 skills with scripts |
| Total | 69 | 0 remaining `.js` or `.mjs` files |

**New Scripts Created (7):**

| Script | Skill | Purpose |
|--------|-------|---------|
| `editor-server.ts` | doc-templates | Mermaid diagram live editor server |
| `markdown-server.ts` | doc-templates | Markdown preview with typography |
| `kanban-server.ts` | doc-templates | Plans kanban dashboard |
| `state_manager.ts` | lifecycle-orchestrator | Checkpoint save/restore/list |
| `check_boundaries.ts` | code-constitution | System boundary validator |
| `geo_checker.ts` | seo-optimizer | Geo-spatial SEO validation |
| `notification-config.json` | config | Execution reporter configuration |

**Structural Changes:**

- Renamed `scripts-js/` → `scripts/` (root and studio)
- Merged `.agent/scripts-js/` contents into existing `.agent/scripts/`
- Removed 4 orphan skill directories (`mermaid-editor/`, `markdown-novel-viewer/`, `plans-kanban/`, `geo-spatial/`)
- Moved scripts into correct parent skills (`doc-templates`, `seo-optimizer`)

**Documentation Updates:**

- Updated 50+ `.md` files with correct `.ts` references
- Fixed all chrome-devtools and e2e-automation script references (~89 occurrences)
- Updated `package.json` scripts to use `tsx`

**Verification:**

- `tsc --noEmit`: 0 errors
- 0 remaining `.js` files in `.agent/`
- 0 remaining `.mjs` files in `.agent/`
- 0 stale `.js` references in documentation

---

## [3.9.115] - 2026-03-24

### 🌟 FAANG-Grade Standardization & Telemetry

- **System Synchronization**: Updated system version to v3.9.115 across all repositories (51 Skills, 18 Workflows).
- **Workflow Compliance**: Full audit of all 18 workflows to ensure compliance with `WORKFLOW_DESIGN_GUIDE.md`.
- **OpenTelemetry Integration**: Implemented mandatory OTel telemetry wrappers for all shell commands in `// turbo` scripts.
- **Documentation & UI**: Standardized website to reflect latest FAANG standards.
- **Internationalization**: Full Vietnamese translation for all workflow files.
- **Security & Locks**: Standardized `skills-lock.json` configuration for secure agent skill fetching.

---

## [3.9.78] - 2026-03-06

### 🧹 System Cleanup & Integrity

- Removed 10+ obsolete files (~133KB): outdated architecture docs, duplicate policies, aspirational scripts
- Fixed `docs/getting-started.md` — removed references to non-existent workflows
- Rewritten `docs/README.md` as accurate navigation hub
- Cleaned `.agent/workflows/pulse.md` references

---

## [3.9.77] - 2026-03-05

### 🏗️ FAANG-Grade Workflow Upgrades (25/25)

- Deterministic phase templates with INPUT/OUTPUT definitions
- Meta-agent integration (orchestrator, assessor, recovery, critic, learner)
- Problem Verification (`@[current_problems]` check before completion)
- Workflow chains with mermaid diagrams and handoff messages
- `// turbo` annotations for auto-executable commands

---

## [3.9.76] - 2026-03-05

### 🤖 FAANG-Grade Agent Upgrades (26/26)

- 21 domain agents + 5 meta-agents
- Agent identity layer with persona, expertise, and skill assignments
- Deterministic planning protocols and observability

---

## [3.7.1] - 2026-02-01

### 🔧 Structure Optimization

- Renamed `packages/cli` → `packages/agent`
- Removed duplicate CLI (112 files), archive artifacts
- Updated LICENSE branding to PikaKit

---

## [3.7.0] - 2026-02-01

### 🚀 Vercel Deploy Integration

- New skill: `vercel-deploy` — 1-click deployment, 40+ framework auto-detection

---

## [3.6.0] - 2026-01-29

### 📚 Documentation Workflows

- New workflows: `/chronicle`, `/diagram`

---

## [3.5.0] - 2026-01-29

### ⚡ Performance Optimization Workflows

- New workflows: `/optimize`, `/benchmark`

---

## [3.4.0] - 2026-01-29

### 📊 Production Monitoring

- New skill: `observability` (OpenTelemetry SDK)
- New workflows: `/monitor`, `/alert`

---

## [3.3.0] - 2026-01-29

### 🏗️ FAANG Standards Restructure

- Documentation reorganized, Studio integration, Workflow chains v2.0

---

## [3.2.0] - 2026-01-28

### 🚀 Python → JavaScript Migration

- All master scripts migrated to JavaScript, zero Python dependency

---

## [3.1.0] - 2026-01-27

### ✨ Skill Expansion

- 5 new skills, workflow chains, `/flags` workflow

---

## [3.0.0] - 2026-01-26

### 🎉 Initial Public Release

- 50 production-ready skills, 20 agents, 18 workflows

---

[3.9.167]: https://github.com/pikakit/agent-skills/compare/v3.9.116...v3.9.167
[3.9.116]: https://github.com/pikakit/agent-skills/compare/v3.9.115...v3.9.116
[3.9.115]: https://github.com/pikakit/agent-skills/compare/v3.9.78...v3.9.115
[3.9.78]: https://github.com/pikakit/agent-skills/compare/v3.9.77...v3.9.78
[3.9.77]: https://github.com/pikakit/agent-skills/compare/v3.9.76...v3.9.77
[3.9.76]: https://github.com/pikakit/agent-skills/compare/v3.7.1...v3.9.76
[3.7.1]: https://github.com/pikakit/agent-skills/compare/v3.7.0...v3.7.1
[3.7.0]: https://github.com/pikakit/agent-skills/compare/v3.6.0...v3.7.0
[3.6.0]: https://github.com/pikakit/agent-skills/compare/v3.5.0...v3.6.0
[3.5.0]: https://github.com/pikakit/agent-skills/compare/v3.4.0...v3.5.0
[3.4.0]: https://github.com/pikakit/agent-skills/compare/v3.3.0...v3.4.0
[3.3.0]: https://github.com/pikakit/agent-skills/compare/v3.2.0...v3.3.0
[3.2.0]: https://github.com/pikakit/agent-skills/compare/v3.1.0...v3.2.0
[3.1.0]: https://github.com/pikakit/agent-skills/compare/v3.0.0...v3.1.0
[3.0.0]: https://github.com/pikakit/agent-skills/releases/tag/v3.0.0
