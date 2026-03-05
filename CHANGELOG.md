# Changelog

All notable changes to PikaKit are documented in this file.

Format: [Keep a Changelog](https://keepachangelog.com/en/1.0.0/) · [Semantic Versioning](https://semver.org/spec/v2.0.0.html)

---

## [3.9.78] - 2026-03-06

### 🧹 System Cleanup & Integrity

**Removed 10+ obsolete files (~133KB):**

| File | Reason |
|------|--------|
| `.agent/ARCHITECTURE.md` | Outdated stats (45 skills vs 67 actual), wrong skill names |
| `.agent/CONTINUOUS_EXECUTION_POLICY.md` | Duplicated by GEMINI.md + workflow files |
| `.agent/WORKFLOW_CHAINS.md` | Duplicated by workflow chain sections |
| `.agent/agent-workflow-mapping.json` | Non-existent agent references, no consumer |
| `.agent/lessons.json` | Empty placeholder, no consumer |
| `.agent/skill-lock.json` | Aspirational, no tooling implements it |
| `.agent/metrics/` | Sample test data, no consumer |
| `.agent/scripts-js/workflow-engine.js` | Aspirational, unreferenced |
| `.agent/scripts-js/workflow-validator.js` | Aspirational, unreferenced |
| `.agent/workflows/README.md` | Outdated, redundant |
| `docs/docs-guide.md` | Outdated (v3.2), generic templates |
| `docs/skills-overview.md` | Wrong skill count (45 vs 67) |
| `docs/workflows.md` | Duplicated by getting-started.md |
| `docs/maintaining-legacy-project.md` | Aspirational tutorial |

**Fixed:**

- `docs/getting-started.md` — Removed references to non-existent `/forge` and `/agent` workflows
- `docs/README.md` — Rewritten as accurate navigation hub with correct links and stats
- `.agent/workflows/pulse.md` — Removed references to non-existent `observability-collector.js`

---

## [3.9.77] - 2026-03-05

### 🏗️ FAANG-Grade Workflow Upgrades (25/25)

All 25 workflows upgraded to production-grade specifications:

- **Deterministic phase templates** with INPUT/OUTPUT definitions
- **Meta-agent integration** (orchestrator, assessor, recovery, critic, learner)
- **Problem Verification** (`@[current_problems]` check before completion)
- **Workflow chains** with mermaid diagrams and handoff messages
- **`// turbo` annotations** for auto-executable commands
- **4/4 quality gates** passed per workflow

**Workflows by type:**

| Type | Workflows |
|------|-----------|
| Orchestration | autopilot, build, game, mobile |
| Pipeline | api, launch, validate, inspect, optimize, benchmark, monitor, alert, chronicle, diagram |
| Automation | boost, cook, fix, flags, stage |
| Tactical | plan, think, studio, pulse, diagnose |

---

## [3.9.76] - 2026-03-05

### 🤖 FAANG-Grade Agent Upgrades (26/26)

All 26 agents upgraded to production-grade specifications:

- **21 domain agents** + **5 meta-agents** (orchestrator, assessor, recovery, critic, learner)
- Agent identity layer with persona, expertise, and skill assignments
- Deterministic planning protocols
- Observability and trace propagation
- Performance governance with quantified thresholds

---

## [3.9.x] - 2026-03-01 to 2026-03-04

### 🔧 Skill Audits & Hardening

Systematic audit of skill files for FAANG-grade compliance:

- `SKILL.md` files validated under 200-line limit
- Engineering specs split into `engineering-spec.md`
- Script JSDoc headers and module formats standardized
- Reference data CSVs verified for completeness
- Content Maps in SKILL.md updated to reflect actual file structure

**Skills audited:** studio, mobile-design, code-constitution, and others.

---

## [3.7.1] - 2026-02-01

### 🔧 Structure Optimization

- Renamed `packages/cli` → `packages/agent`
- Removed duplicate CLI (`lib/agent-cli/`, 112 files)
- Removed archive folders and dev artifacts
- Fixed workflow count description (26 → 25)
- Updated LICENSE branding to PikaKit

---

## [3.7.0] - 2026-02-01

### 🚀 Vercel Deploy Integration

**New skill:** `vercel-deploy`

- 1-click deployment without authentication
- 40+ framework auto-detection (Next.js, Vite, Astro, SvelteKit, etc.)
- Claimable deployments with preview URL
- Source: [vercel-labs/agent-skills](https://github.com/vercel-labs/agent-skills)

---

## [3.6.0] - 2026-01-29

### 📚 Documentation Workflows

- New workflows: `/chronicle`, `/diagram`
- Auto-generate README, API docs, architecture diagrams
- Parallel execution for speed

---

## [3.5.0] - 2026-01-29

### ⚡ Performance Optimization Workflows

- New workflows: `/optimize`, `/benchmark`
- k6/Artillery load testing
- Database query optimization, caching strategy

---

## [3.4.0] - 2026-01-29

### 📊 Production Monitoring

- New skill: `observability` (OpenTelemetry SDK)
- New workflows: `/monitor`, `/alert`
- Structured logging, metrics dashboards, distributed tracing
- Slack/PagerDuty alerting with runbook templates

---

## [3.3.0] - 2026-01-29

### 🏗️ FAANG Standards Restructure

- Documentation reorganized to FAANG standards
- Studio integration across design skills
- Workflow chains v2.0 schema (error handling, DAG execution, success criteria)
- PowerShell safety patterns (5 new deny rules)
- Package configuration: Node.js ≥18, lock files committed

---

## [3.2.0] - 2026-01-28

### 🚀 Python → JavaScript Migration

- All master scripts migrated to JavaScript
- Zero Python dependency for core validation
- Vitest 4.x migration with coverage thresholds
- Lock file strategy: package-lock.json committed

---

## [3.1.0] - 2026-01-27

### ✨ Skill Expansion

- 5 new skills added
- Workflow chains introduced
- `/flags` workflow for feature flag management

---

## [3.0.0] - 2026-01-26

### 🎉 Initial Public Release

- 50 production-ready skills
- 20 specialized agents
- 18 workflows

---

[3.9.78]: https://github.com/pikakit/agent-skills/compare/v3.9.77...v3.9.78
[3.9.77]: https://github.com/pikakit/agent-skills/compare/v3.9.76...v3.9.77
[3.9.76]: https://github.com/pikakit/agent-skills/compare/v3.7.1...v3.9.76
[3.9.x]: https://github.com/pikakit/agent-skills/compare/v3.7.1...v3.9.76
[3.7.1]: https://github.com/pikakit/agent-skills/compare/v3.7.0...v3.7.1
[3.7.0]: https://github.com/pikakit/agent-skills/compare/v3.6.0...v3.7.0
[3.6.0]: https://github.com/pikakit/agent-skills/compare/v3.5.0...v3.6.0
[3.5.0]: https://github.com/pikakit/agent-skills/compare/v3.4.0...v3.5.0
[3.4.0]: https://github.com/pikakit/agent-skills/compare/v3.3.0...v3.4.0
[3.3.0]: https://github.com/pikakit/agent-skills/compare/v3.2.0...v3.3.0
[3.2.0]: https://github.com/pikakit/agent-skills/compare/v3.1.0...v3.2.0
[3.1.0]: https://github.com/pikakit/agent-skills/compare/v3.0.0...v3.1.0
[3.0.0]: https://github.com/pikakit/agent-skills/releases/tag/v3.0.0
