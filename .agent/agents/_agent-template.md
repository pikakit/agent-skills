---
name: _agent-template
description: >-
  Structural contract for PikaKit agent specifications.
  Defines required sections, their format, and validation rules.
  All agents MUST follow this structure. Use as scaffold for new agents.
version: "1.0"
---

# Agent Specification Template

> **Purpose:** Every agent in `.agent/agents/` MUST conform to this structure.
> Use this as a scaffold when creating new agents, and as a validation checklist for existing ones.

---

## Required Frontmatter

```yaml
---
name: kebab-case-name          # MUST match filename (minus .md)
description: >-                # Multi-line description including:
  [Role summary].              #   - What the agent does
  [Ownership].                 #   - What it owns (domain boundaries)
  Triggers on: [keywords].     #   - Trigger keywords (comma-separated)
tools: Read, Grep, Glob, Bash, Edit, Write
model: inherit
skills: skill-1, skill-2      # Comma-separated, kebab-case, MUST exist in .agent/skills/
agent_type: domain | utility | meta   # domain=implementation, utility=support, meta=orchestration
version: "1.0"
owner: pikakit
capability_tier: core | extended
execution_mode: reactive | proactive
priority: high | normal | background
---
```

### Frontmatter Validation Rules

| Rule | Check |
|------|-------|
| `name` matches filename | `backend-specialist` → `backend.md` ✅, `backend-specialist.md` ❌ |
| All skills exist | Each skill in `skills:` has a folder in `.agent/skills/<skill>/` |
| Triggers are unique | No trigger keyword overlaps with another agent |
| `agent_type` is valid | One of: `domain`, `utility`, `meta` |

---

## Required Sections (In Order)

### Layer 1: Identity & Philosophy (UNIQUE per agent)

| # | Section | Purpose | Content Type |
|---|---------|---------|-------------|
| 1 | `# [Agent Title]` | H1 — one-liner role statement | UNIQUE |
| 2 | `## Your Philosophy` | Why this domain matters | UNIQUE |
| 3 | `## Your Mindset` | Decision-making principles (bullet list) | UNIQUE |
| 4 | `## 🛑 CRITICAL: [VERB] BEFORE [VERB] (MANDATORY)` | Pre-flight checklist + "You MUST ask" table + "DO NOT default to" list | UNIQUE |
| 5 | `## Development Decision Process` | Phased workflow (Phase 1→N) | UNIQUE |

### Layer 2: Domain Expertise (UNIQUE per agent)

| # | Section | Purpose | Content Type |
|---|---------|---------|-------------|
| 6 | Domain-specific sections | E.g., "Testing Pyramid", "OWASP Top 10", "API Style Selection" | UNIQUE |
| 7 | `## Decision Frameworks` | Deterministic selection tables | UNIQUE |
| 8 | `## Your Expertise Areas` | Categorized skill areas | UNIQUE |
| 9 | `## Capability Map` | Skills-to-triggers mapping table | UNIQUE |
| 10 | `## What You Do` | ✅/❌ lists per category | UNIQUE |
| 11 | `## Common Anti-Patterns You Avoid` | ❌→✅ pattern corrections | UNIQUE |
| 12 | `## Review Checklist` | Checkbox verification list | UNIQUE |

### Layer 3: Agent Contract (FRAMEWORK — agent-specific values)

All sections below follow a **fixed structure** with **agent-specific content**.

| # | Section | Fixed Structure | Agent-Specific Content |
|---|---------|----------------|----------------------|
| 13 | `## Agent Execution Lifecycle` | 6-phase table: Intake→Resolution→Planning→Execution→Validation→Reporting | Phase descriptions, gate conditions |
| 14 | `## Planning Protocol (MANDATORY)` | Plan Structure table + Planning Rules + Plan Validation | Skill mappings, rule list |
| 15 | `## Trigger Routing Logic` | Priority table (3 rows) + Conflict Resolution table | Trigger keywords, conflict pairs |
| 16 | `## Agent Priority Scheduling` | Priority table (3 rows) + 4 Scheduling Rules | Use case examples, declared priority |
| 17 | `## Agent Contract` | Inputs/Outputs/Schema/Guarantees/Side Effects/Escalation tables | I/O details, schema JSON |
| 18 | `## Coordination Protocol` | 6-step numbered list: Accept→Validate→Load→Execute→Return→Escalate | Step details |
| 19 | `## Agent Dependency Graph` | Table: Agent/Relationship/Purpose | Agent relationships |

### Layer 4: Skill & Workflow Integration (FRAMEWORK — agent-specific values)

| # | Section | Fixed Structure | Agent-Specific Content |
|---|---------|----------------|----------------------|
| 20 | `## Skill Invocation Protocol` | Loading (4 steps) + Invocation Format (JSON) + Coordination Rules + Forbidden list | Skill names, JSON example |
| 21 | `## Deterministic Skill Resolution` | Priority table + 3 Tie Breaking Rules | Priority conditions |
| 22 | `## Skill Usage Specification` | Table: Skill/Purpose/Triggers/Output | Per-skill details |
| 23 | `## Workflow Binding Protocol` | Discovery + Invocation Format (JSON) + Escalation table | Workflow names, conditions |
| 24 | `## Workflow Orchestration Hierarchy` | 3 levels: Single-Agent → Skill Pipeline → Multi-Agent | Code examples |

### Layer 5: Runtime Governance (FRAMEWORK — agent-specific values)

| # | Section | Fixed Structure | Agent-Specific Content |
|---|---------|----------------|----------------------|
| 25 | `## State Management` | 4-row table: Type/Context/Persistence/Memory | State descriptions |
| 26 | `## Context Budget Control` | 4-row budget table + 3 Overflow Rules | Token limits, overflow actions |
| 27 | `## Observability` | Log Schema (JSON) + Metrics table | Event types, metric names |
| 28 | `## Performance & Resource Governance` | Targets table + Limits table + Optimization Rules + Determinism Requirement | Target values, limits |
| 29 | `## Security Boundaries` | Constraints table + Unsafe Operations list | Constraint rules |
| 30 | `## Capability Boundary Enforcement` | Scope Validation + Out-of-Scope + Hard Boundaries | Validation checks, boundaries |
| 31 | `## Global Skill Registry Enforcement` | 3-rule table (shared/validation/category) + violation action | Shared skill names |
| 32 | `## Agent Evolution Protocol` | Allowed Actions table + Forbidden list | Evolution actions |
| 33 | `## Failure Handling` | 4-column table: Type/Detection/Action/Escalation | Failure scenarios |
| 34 | `## Quality Control Loop (MANDATORY)` | Numbered verification steps + "Report complete" gate | Verification items |
| 35 | `## When You Should Be Used` | Bullet list of use cases | Use case descriptions |

---

## Section Templates

### Agent Execution Lifecycle

```markdown
## Agent Execution Lifecycle

| Phase | Action | Gate |
|-------|--------|------|
| 1️⃣ **Request Intake** | Parse request, detect triggers, [agent-specific] | Input matches [agent] triggers |
| 2️⃣ **Capability Resolution** | Map request → [domain] skills | All skills available |
| 3️⃣ **Planning** | [Pre-execution protocol] | [Protocol] complete |
| 4️⃣ **Execution** | [Domain workflow] | Core functionality working |
| 5️⃣ **Validation** | [Quality checks] | All checks pass |
| 6️⃣ **Reporting** | Return structured output | Contract fulfilled |
```

### Agent Priority Scheduling

```markdown
## Agent Priority Scheduling

| Priority | Behavior | Use Case |
|----------|----------|----------|
| `high` | Execute first, preempt lower priority | [Agent-specific high-priority scenario] |
| `normal` | Standard FIFO scheduling | [Agent-specific default scenario] |
| `background` | Execute when no high/normal pending | [Agent-specific low-priority scenario] |

### Scheduling Rules

1. Priority declared in frontmatter: `[priority]`
2. `high` agents always execute before `normal` and `background`
3. Same-priority agents execute in dependency order
4. Background tasks MUST NOT block active development
```

### Context Budget Control

```markdown
## Context Budget Control

| Budget | Limit |
|--------|-------|
| Max prompt tokens | 8000 |
| Max skill output tokens | 2000 per skill |
| Max workflow context | 4000 |
| Max plan size | 1000 |

### Overflow Rules

1. If [primary output] is large → summarize to [key elements]
2. If context pressure > 80% → drop [less critical items], keep [critical items]
3. If unrecoverable → escalate to `[escalation_target]` with truncated context
```

### Quality Control Loop

```markdown
## Quality Control Loop (MANDATORY)

After [agent domain] work:

1. **Verify [primary quality metric]**: [Description]
2. **Check [secondary quality metric]**: [Description]
3. **Review [tertiary quality metric]**: [Description]
4. **Confirm [final check]**: [Description]
5. **Report complete**: Only after all checks pass
```

### Security Boundaries

```markdown
## Security Boundaries

| Constraint | Rule |
|------------|------|
| **File access** | Only within project workspace |
| **Skill invocation** | Only declared skills in frontmatter |
| **Workflow invocation** | Only registered workflows |
| **[Domain-specific]** | [Agent-specific constraint] |

### Unsafe Operations — MUST reject:

❌ [Operation 1 — agent-specific dangerous action]
❌ [Operation 2 — agent-specific dangerous action]
❌ [Operation 3 — agent-specific dangerous action]
```

---

## Validation Checklist

When creating or reviewing an agent spec, verify:

- [ ] Frontmatter: `name` matches filename
- [ ] Frontmatter: all `skills:` exist in `.agent/skills/`
- [ ] Frontmatter: `triggers` don't overlap with other agents
- [ ] Layer 1: All 5 identity sections present
- [ ] Layer 2: At least 4 domain-specific sections present
- [ ] Layer 3: All 7 contract sections present (13-19)
- [ ] Layer 4: All 5 integration sections present (20-24)
- [ ] Layer 5: All 11 governance sections present (25-35)
- [ ] Total sections: minimum 32
- [ ] All trigger keywords listed in Trigger Routing Logic
- [ ] All skills listed in Skill Usage Specification
- [ ] Capability Map covers all declared capabilities
- [ ] Agent Dependency Graph lists all peer/upstream/downstream agents
- [ ] Output Schema includes `trace_id`, `status`, `result`, `artifacts`, `next_action`, `escalation_target`

---

## New Agent Creation Workflow

1. Copy this template
2. Fill in frontmatter (name, description, triggers, skills)
3. Write Layer 1 (identity — what makes this agent unique)
4. Write Layer 2 (domain expertise — decision frameworks, expertise areas)
5. Fill Layer 3-5 frameworks with agent-specific values
6. Run validation checklist
7. Register in routing table (check for trigger conflicts)

---

> ⚡ PikaKit v3.9.94 — Agent Specification Template v1.0
