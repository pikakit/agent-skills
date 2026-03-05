# App Scaffold — Engineering Specification

> Production-grade specification for application scaffolding and multi-agent orchestration at FAANG scale.

---

## 1. Overview

App Scaffold is the primary application building orchestrator in PikaKit. It transforms natural language project descriptions into scaffolded, runnable applications by: detecting project type, selecting tech stack, choosing a template, coordinating domain-specific agents, and validating the output builds.

Unlike knowledge-only skills, App Scaffold has side effects: it creates directories, writes files, runs package managers, and invokes sub-agents. This makes its failure model, idempotency guarantees, and resource lifecycle management distinct from pure-function skills.

---

## 2. Problem Statement

Application scaffolding at scale faces four quantified problems:

| Problem | Measurement | Impact |
|---------|-------------|--------|
| Wrong tech stack selection | 30–40% of projects start with mismatched stack for requirements | Rework within first 2 weeks |
| Inconsistent project structure | No standard directory layout across team projects | Onboarding friction, inconsistent tooling |
| Manual coordination overhead | 5+ specialists needed (frontend, backend, DB, DevOps) per new project | 2–5 day setup time for greenfield projects |
| Scaffold-to-running gap | Scaffolded projects require 10+ manual steps before `npm run dev` works | Developer frustration, abandoned scaffolds |

App Scaffold eliminates these by automating detection → selection → scaffolding → coordination → validation in a single pipeline.

---

## 3. Design Goals

| ID | Goal | Measurable Constraint |
|----|------|-----------------------|
| G1 | Zero-config project start | Scaffolded project runs with `npm run dev` (or equivalent) without manual steps |
| G2 | Context-aware tech stack | Stack selection based on ≤ 6 input criteria (type, scale, team, consumers, platform, constraints) |
| G3 | Template-driven scaffolding | 13 templates covering web, mobile, desktop, CLI, monorepo |
| G4 | Agent coordination | Orchestrate ≤ 5 domain agents in defined execution order |
| G5 | Build validation | Scaffold pipeline does not report success unless the project compiles |

---

## 4. Non-Goals

| ID | Excluded | Rationale |
|----|----------|-----------|
| NG1 | Feature implementation beyond scaffold | Scaffold creates structure; feature code is agent responsibility |
| NG2 | Deployment to production | Owned by `cicd-pipeline` and `server-ops` skills |
| NG3 | Database provisioning | Schema design owned by `data-modeler`; provisioning by `server-ops` |
| NG4 | UI design decisions | Owned by `design-system` and `frontend-design` skills |
| NG5 | Custom template creation | Templates are pre-authored; runtime template generation is out of scope |
| NG6 | Existing project analysis | This skill scaffolds new projects; feature additions use `feature-building.md` |

---

## 5. System Boundaries

| Boundary | Owned | Not Owned |
|----------|-------|-----------|
| Project type detection | Keyword matching from natural language | NLP/ML intent classification |
| Tech stack selection | Decision tree from context inputs | Framework version management |
| Template application | Directory creation, file writing from template | Template authoring |
| Agent coordination | Execution order, context passing, result collection | Agent internal logic |
| Build validation | Run build command, check exit code | Runtime testing (→ test-architect) |
| File system operations | Create directories, write files in project path | Delete files, modify files outside project path |

**Side-effect boundary:** App Scaffold creates files and directories within the specified project path. It runs package install commands (`npm install`, `pip install`, etc.) and build commands. It does NOT modify files outside the project directory, access networks beyond package registries, or delete existing files.

---

## 6. Integration Model

### 6.1 Agent Contract

#### Input Schema

```
Description: string          # Natural language project description
Project_Path: string         # Absolute path for project root (must not exist or be empty)
Context: {
  type: string | null        # "web" | "mobile" | "desktop" | "cli" | "api" | "monorepo" | null (auto-detect)
  platform: string | null    # "nextjs" | "nuxt" | "expo" | "flutter" | "electron" | null (auto-detect)
  scale: string | null       # "prototype" | "startup" | "growth" | "enterprise"
  team: string | null        # "solo" | "small" | "large"
  consumers: Array<string> | null  # ["web", "mobile", "api-clients"]
  constraints: Array<string> | null  # ["no-prisma", "must-use-firebase", "typescript-only"]
}
Template_Override: string | null  # Force specific template; null = auto-select
contract_version: string    # "2.0.0"
```

#### Output Schema

```
Status: "success" | "error"
Data: {
  project_path: string        # Absolute path to created project
  template_used: string       # Template identifier
  tech_stack: {
    framework: string
    language: string
    database: string | null
    auth: string | null
    styling: string | null
  }
  files_created: number       # Total files written
  directories_created: number # Total directories created
  agents_coordinated: Array<{agent: string, status: string, files: number}>
  build_status: "pass" | "fail" | "skipped"
  run_command: string         # Command to start dev server
  metadata: {
    version: string
    duration_ms: number
    detection_method: string  # "auto" | "explicit" | "template-override"
    contract_version: string    # "2.0.0"
    backward_compatibility: string  # "breaking"
  }
}
Error: ErrorSchema | null
```

**Contract Version:** 2.0.0
**Backward Compatibility:** breaking (first hardened version)
**Breaking Changes:** None — new spec for first hardening

#### Error Schema

```
Code: string          # From Error Taxonomy (Section 11)
Message: string       # Human-readable, single line
Phase: string         # detect | select | scaffold | coordinate | validate
Recoverable: boolean
Rollback_Applied: boolean  # Whether created files were cleaned up
```

#### Deterministic Guarantees

- Same `Description` + `Context` + `Template_Override` = same template selection and file structure.
- Template file contents are static; no randomization in scaffolded output.
- Agent coordination order is fixed per template (defined in `agent-coordination.md`).
- Build validation runs the same command per template; pass/fail is determined by exit code 0/non-zero.

#### What Agents May Assume

- `project_path` directory exists and contains a valid scaffold after "success" status.
- `run_command` will start the dev server if executed in `project_path`.
- `tech_stack` accurately reflects the installed dependencies.
- Sub-agents received correct context and their outputs are integrated into the scaffold.

#### What Agents Must NOT Assume

- The scaffold includes feature implementation beyond boilerplate (login pages, CRUD endpoints exist as stubs).
- Dependencies are up-to-date (versions are pinned at template authoring time).
- The project will deploy without additional configuration (deployment is out of scope).
- `build_status: "pass"` means the application is functionally correct (it means it compiles).

#### Side-Effect Boundaries

| Operation | Side Effects |
|-----------|-------------|
| Project detection | None; string matching |
| Stack selection | None; decision tree traversal |
| Template scaffolding | **Creates directories and files** in `project_path` |
| Package installation | **Runs `npm install` / `pip install`**; downloads packages from registries |
| Agent coordination | **Agents may write additional files** within `project_path` |
| Build validation | **Runs build command**; reads filesystem, produces build artifacts |
| Rollback (on failure) | **Deletes `project_path`** if scaffold fails mid-pipeline |

### 6.2 Workflow Contract

#### Invocation Pattern

```
1. Parse description → detect project type (or use explicit type)
2. Select tech stack → resolve template
3. Apply template → create directory structure and files
4. Install dependencies → run package manager
5. Coordinate agents → frontend, backend, DB agents write code
6. Validate build → run build command, check exit code
7. Return result with run_command
```

#### Execution Guarantees

- Pipeline executes phases sequentially (no parallel phases).
- Each phase completes (success or error) before the next begins.
- On failure in any phase: rollback is attempted, then error is returned.
- On success: all files exist, dependencies are installed, build passes.

#### Failure Propagation Model

| Phase | Failure Behavior | Rollback |
|-------|-----------------|----------|
| Detect | Return error immediately | No files created; nothing to roll back |
| Select | Return error immediately | No files created; nothing to roll back |
| Scaffold | Roll back: delete `project_path` | Yes |
| Install | Roll back: delete `project_path` | Yes |
| Coordinate | Roll back: delete `project_path` | Yes |
| Validate | Return error with `build_status: "fail"` | No rollback; files remain for debugging |

**Rollback policy:** If scaffold, install, or coordination fails, the entire `project_path` is deleted to prevent partial states. If validation fails, files are preserved for debugging.

#### Retry Boundaries

- Zero internal retries for detection, selection, scaffolding.
- Package install: 1 automatic retry with cache clear on first failure.
- Build validation: zero retries; fail status is returned for caller to investigate.
- Agent coordination: zero retries; agent failures propagate immediately.

#### Isolation Model

- Each invocation operates on a unique `project_path`. Two invocations cannot share the same path.
- Sub-agents operate within the `project_path` boundary; they cannot write outside it.
- Package installations use project-local `node_modules` / `venv`; no global installs.

#### Idempotency Expectations

| Operation | Idempotent | Notes |
|-----------|-----------|-------|
| Detection | Yes | Same description = same type |
| Selection | Yes | Same context = same template |
| Scaffolding | No | Creates files; second run on same path fails with `ERR_PATH_EXISTS` |
| Install | No | Downloads packages; network-dependent |
| Coordination | No | Agents write files; second run conflicts with existing files |
| Validation | Yes | Build command produces same pass/fail on same files |

---

## 7. Execution Model

### 6-Phase Pipeline

| Phase | Action | Side Effects | Rollback |
|-------|--------|-------------|----------|
| **Detect** | Parse description, match project type keywords | None | N/A |
| **Select** | Traverse decision tree, choose template | None | N/A |
| **Scaffold** | Create directories, write template files | File creation | Delete `project_path` |
| **Install** | Run package manager | Network, disk writes | Delete `project_path` |
| **Coordinate** | Invoke domain agents in order | Agent file writes | Delete `project_path` |
| **Validate** | Run build command, check exit code | Build artifacts | None (preserve for debug) |

**State transitions:** `IDLE → DETECTING → SELECTING → SCAFFOLDING → INSTALLING → COORDINATING → VALIDATING → COMPLETE | FAILED`

---

## 8. Deterministic Design Principles

| Principle | Enforcement |
|-----------|-------------|
| Fixed detection keywords | Project type detection uses static keyword matrix in `project-detection.md` |
| Fixed decision tree | Stack selection follows deterministic tree in `tech-stack.md` |
| Static templates | Template files are pre-authored; no runtime generation |
| Ordered agent pipeline | Agent execution order is fixed per template in `agent-coordination.md` |
| Build validation by exit code | Pass = exit code 0; fail = any non-zero exit code |

---

## 9. State & Idempotency Model

### Pipeline State Machine

```
States: IDLE, DETECTING, SELECTING, SCAFFOLDING, INSTALLING, COORDINATING, VALIDATING, COMPLETE, FAILED
Transitions:
  IDLE         → DETECTING    (on invoke)
  DETECTING    → SELECTING    (type resolved)
  SELECTING    → SCAFFOLDING  (template chosen)
  SCAFFOLDING  → INSTALLING   (files written)
  INSTALLING   → COORDINATING (packages installed)
  COORDINATING → VALIDATING   (agents complete)
  VALIDATING   → COMPLETE     (build passes)
  ANY          → FAILED       (error in any phase)
```

### Idempotency

App Scaffold is NOT idempotent. Invoking it twice with the same `project_path` fails on the second call (`ERR_PATH_EXISTS`). This is by design — creating the same project twice would produce conflicts. Callers must use a unique path per invocation.

---

## 10. Failure Handling Strategy

| Failure Class | Behavior | Rollback |
|---------------|----------|----------|
| Unrecognized project type | Return `ERR_UNKNOWN_TYPE` | None |
| No matching template | Return `ERR_NO_TEMPLATE` | None |
| Path already exists | Return `ERR_PATH_EXISTS` | None |
| File write failure | Return `ERR_WRITE_FAILED`, rollback | Delete `project_path` |
| Package install failure | Return `ERR_INSTALL_FAILED`, 1 retry then rollback | Delete `project_path` |
| Agent failure | Return `ERR_AGENT_FAILED` with agent name, rollback | Delete `project_path` |
| Build failure | Return `ERR_BUILD_FAILED` with exit code | Preserve files |
| Disk space exhaustion | Return `ERR_DISK_FULL` | Attempted partial cleanup |
| Permission denied | Return `ERR_PERMISSION_DENIED` | None |

**Invariant:** Every failure returns a structured error with rollback status. No invocation produces a partial scaffold silently.

---

## 11. Error Taxonomy

| Code | Category | Phase | Recoverable | Description |
|------|----------|-------|-------------|-------------|
| `ERR_UNKNOWN_TYPE` | Detection | Detect | No | Project type could not be determined from description |
| `ERR_NO_TEMPLATE` | Selection | Select | No | No template matches the resolved type + constraints |
| `ERR_PATH_EXISTS` | Validation | Scaffold | No | `project_path` already exists and is non-empty |
| `ERR_WRITE_FAILED` | IO | Scaffold | Yes | File or directory creation failed |
| `ERR_INSTALL_FAILED` | Runtime | Install | Yes | Package manager exited non-zero after retry |
| `ERR_AGENT_FAILED` | Coordination | Coordinate | Yes | Sub-agent returned error |
| `ERR_BUILD_FAILED` | Validation | Validate | Yes | Build command exited non-zero |
| `ERR_DISK_FULL` | Infrastructure | Any | No | Insufficient disk space |
| `ERR_PERMISSION_DENIED` | Infrastructure | Scaffold | No | No write permission to `project_path` parent |
| `ERR_INVALID_PATH` | Validation | Scaffold | No | `project_path` is malformed or outside allowed directories |
| `ERR_CONSTRAINT_CONFLICT` | Validation | Select | Yes | Constraints conflict with detected type |

---

## 12. Timeout & Retry Policy

| Parameter | Default | Max | Unit |
|-----------|---------|-----|------|
| Detection + Selection | N/A (< 100ms) | 1,000 | ms |
| Template scaffolding | 30,000 | 60,000 | ms |
| Package installation | 120,000 | 300,000 | ms |
| Agent coordination (per agent) | 60,000 | 180,000 | ms |
| Build validation | 60,000 | 120,000 | ms |
| Total pipeline | 300,000 | 600,000 | ms |

**Retry policy:**
- Package install: 1 automatic retry with `--force` or cache clear.
- All other phases: zero retries. Failures propagate immediately.

---

## 13. Observability & Logging Schema

### Log Entry Format

```json
{
  "trace_id": "uuid",
  "skill_name": "app-scaffold",
  "contract_version": "2.0.0",
  "execution_id": "uuid",
  "timestamp": "ISO-8601",
  "phase": "detect|select|scaffold|install|coordinate|validate",
  "status": "started|completed|failed|rolled_back",
  "template": "string|null",
  "project_path": "string",
  "duration_ms": "number",
  "error_code": "string|null",
  "files_created": "number",
  "agents_invoked": ["string"],
  "build_exit_code": "number|null"
}
```

### Required Log Points

| Event | Log Level | Fields |
|-------|-----------|--------|
| Pipeline started | INFO | invocation_id, description_hash, project_path |
| Phase completed | INFO | phase, duration_ms, status |
| Phase failed | ERROR | phase, error_code, message |
| Rollback executed | WARN | project_path, phase_at_failure, files_deleted |
| Agent invoked | INFO | agent_name, context_size |
| Agent completed | INFO | agent_name, files_created, duration_ms |
| Build result | INFO | exit_code, build_command, duration_ms |

### Metrics

| Metric | Type | Unit |
|--------|------|------|
| `scaffold.pipeline.duration` | Histogram | ms |
| `scaffold.pipeline.error_rate` | Counter | per error_code |
| `scaffold.template.usage` | Counter | per template |
| `scaffold.type.detected` | Counter | per project_type |
| `scaffold.agent.duration` | Histogram | ms per agent |
| `scaffold.build.pass_rate` | Counter | pass/fail |
| `scaffold.rollback.count` | Counter | per phase |
| `scaffold.files.created` | Histogram | count |

---

## 14. Security & Trust Model

### Path Restriction

- App Scaffold writes files ONLY within `project_path`.
- `project_path` must be a valid absolute path within the user's workspace.
- Path traversal attempts (`../`) in template files are rejected with `ERR_INVALID_PATH`.

### Package Installation

- Packages are installed from configured registries (npm, PyPI).
- No `--unsafe-perm` or `--no-verify` flags are used.
- Lock files (`package-lock.json`, `poetry.lock`) are generated and committed.

### Agent Trust

- Sub-agents operate within `project_path` boundary.
- Agent outputs (file writes) are validated to be within `project_path` before acceptance.
- Agents cannot modify files outside the project directory.

### Template Integrity

- Templates are pre-authored static files; no runtime template injection.
- Template selection is deterministic based on inputs; no user-supplied template paths.

### Credential Handling

- App Scaffold does not store or generate credentials.
- `.env.example` files in templates contain sample values (`YOUR_API_KEY_HERE`), never real secrets.
- Auth configuration references patterns, not actual keys.

---

## 15. Scalability Model

| Dimension | Constraint | Mitigation |
|-----------|-----------|------------|
| Concurrent scaffolds | Bound by disk I/O and agent availability | Unique `project_path` per invocation; no shared state |
| Package install throughput | Network and registry rate limits | Project-local installs; no global contention |
| Agent coordination | Sequential per invocation | Parallelism across separate invocations |
| Template storage | 13 templates (~50 KB total) | Static files; no growth concern |
| Disk usage per scaffold | 50–500 MB (including node_modules) | Caller manages disk allocation |

---

## 16. Concurrency Model

| Scope | Model | Behavior |
|-------|-------|----------|
| Within invocation | Sequential | 6 phases execute in fixed order |
| Agent coordination | Sequential per invocation | Agents execute in defined order per template |
| Across invocations | Parallel | Independent `project_path`; no shared state |
| File system access | Exclusive per `project_path` | Two invocations on same path: second fails with `ERR_PATH_EXISTS` |

**Undefined behavior:** Two invocations targeting the same `project_path` concurrently. Protected by `ERR_PATH_EXISTS` check at scaffold start, but no distributed lock.

---

## 17. Resource Lifecycle Management

| Resource | Created By | Destroyed By | Max Lifetime |
|----------|-----------|-------------|--------------|
| Project directory | Scaffold phase | Rollback (on failure) or caller (manual) | Indefinite |
| Template file copies | Scaffold phase | Part of project directory | Indefinite |
| node_modules / venv | Install phase | Part of project directory | Indefinite |
| Build artifacts | Validate phase | Part of project directory | Indefinite |
| Agent outputs | Coordinate phase | Part of project directory | Indefinite |

**Leak prevention:**
- Failed scaffolds trigger rollback: `project_path` is deleted.
- Validation failures preserve files for debugging; caller responsible for cleanup.
- No temporary files outside `project_path`.

---

## 18. Performance Constraints

| Operation | P50 Target | P99 Target | Hard Limit |
|-----------|-----------|-----------|------------|
| Detection + Selection | < 50 ms | < 200 ms | 1,000 ms |
| Template scaffolding | < 5,000 ms | < 15,000 ms | 60,000 ms |
| Package installation | < 30,000 ms | < 90,000 ms | 300,000 ms |
| Agent coordination (total) | < 30,000 ms | < 120,000 ms | 300,000 ms |
| Build validation | < 15,000 ms | < 45,000 ms | 120,000 ms |
| Total pipeline | < 80,000 ms | < 270,000 ms | 600,000 ms |

---

## 19. Operational Risks

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Template staleness | Medium | Outdated dependencies in scaffold | Version pinning; periodic template updates |
| Package registry unavailable | Low | Install phase fails | `ERR_INSTALL_FAILED` with retry; offline fallback not supported |
| Partial scaffold state | Medium | Broken project directory | Rollback on failure; `ERR_PATH_EXISTS` prevents re-use |
| Agent coordination failure | Medium | Missing project components | `ERR_AGENT_FAILED` with rollback; agents are independent |
| Disk space exhaustion | Low | Write failures mid-scaffold | `ERR_DISK_FULL`; partial cleanup attempted |
| Path collision | Low | Two scaffolds targeting same path | `ERR_PATH_EXISTS` check at pipeline start |

---

## 20. Compliance with skill-design-guide.md

| Requirement | Status | Evidence |
|-------------|--------|----------|
| YAML frontmatter complete | ✅ | name, description, metadata with category, version, triggers, coordinates_with, success_metrics |
| SKILL.md < 200 lines | ✅ | Entry point under 200 lines; details in reference files |
| Prerequisites documented | ✅ | Node.js/Python per template |
| When to Use section | ✅ | Project type decision matrix |
| Quick Reference | ✅ | Template table with 13 entries |
| Core content matches skill type | ✅ | Orchestrator type: pipeline phases, agent coordination |
| Troubleshooting section | ✅ | Error taxonomy table |
| Related section | ✅ | Cross-links to coordinated agents and skills |
| Content Map for multi-file | ✅ | Links to 5 reference files + engineering-spec + templates |
| Contract versioning | ✅ | contract_version, backward_compatibility, breaking_changes |
| Compliance matrix structured | ✅ | This table with ✅/❌ + evidence |

---

## 21. Production Readiness Checklist

| Category | Check | Status |
|----------|-------|--------|
| **Functionality** | 13 templates covering web, mobile, desktop, CLI, monorepo | ✅ |
| **Functionality** | 6-phase pipeline: detect → select → scaffold → install → coordinate → validate | ✅ |
| **Functionality** | Multi-agent coordination with 5 domain agents | ✅ |
| **Contracts** | Input/output/error schemas defined | ✅ |
| **Contracts** | Agent assumptions and non-assumptions documented | ✅ |
| **Contracts** | Workflow invocation pattern with phase ordering | ✅ |
| **Failure** | Error taxonomy with 11 categorized error codes | ✅ |
| **Failure** | Rollback policy: delete project_path on scaffold/install/coordinate failure | ✅ |
| **Failure** | Retry policy: 1 retry for install, zero for all others | ✅ |
| **Determinism** | Static templates, fixed detection keywords, deterministic decision tree | ✅ |
| **Security** | Path restriction to project_path only | ✅ |
| **Security** | No credential storage; .env.example with sample values only | ✅ |
| **Security** | Agent sandbox within project_path | ✅ |
| **Observability** | Structured log schema with 7 log points | ✅ |
| **Observability** | 8 metrics defined with types and units | ✅ |
| **Performance** | P50/P99 targets for all phases | ✅ |
| **Scalability** | Unique project_path per invocation; no shared state | ✅ |
| **Concurrency** | Sequential within invocation, parallel across invocations | ✅ |
| **Resources** | Rollback deletes project_path on failure | ✅ |
| **Idempotency** | NOT idempotent by design; ERR_PATH_EXISTS prevents re-run | ✅ |
| **Compliance** | All skill-design-guide.md sections present | ✅ |

---

⚡ PikaKit v3.9.77
