# Code Constitution — Engineering Specification

> Production-grade specification for PikaKit governance and constitutional enforcement at FAANG scale.

---

## 1. Overview

Code Constitution defines the supreme governance framework for the PikaKit agent system. It enforces non-negotiable laws for correctness, trust, and durability across all agents, skills, and workflows. This is a **meta-governance skill** — it governs how other skills operate, not how code is written.

The skill has supreme authority: it overrides all other skills, framework defaults, agent preferences, and developer convenience. Output that violates this skill is invalid regardless of functional correctness.

**Contract Version:** 2.0.0
**Backward Compatibility:** breaking (first hardened version; previous version was 3.0.0 but lacked formal contracts)
**Breaking Changes:** None — new spec for first governance hardening. Metadata version retained at 3.0.0 for continuity.

---

## 2. Problem Statement

Agent governance at scale faces four quantified problems:

| Problem | Measurement | Impact |
|---------|-------------|--------|
| Uncontrolled agent autonomy | Agents auto-merging, auto-deleting without consent | Data loss, unauthorized changes |
| Governance drift across skills | 30%+ of skills lack enforcement model | Inconsistent safety guarantees |
| Constitutional ambiguity | Governance rules stated as suggestions, not laws | Non-compliance treated as acceptable |
| No violation audit trail | Violations not logged or tracked | Repeat violations go undetected |

Code Constitution eliminates these by establishing binding laws with explicit enforcement behavior, zero-trust agent operating mode, and structured violation handling.

---

## 3. Design Goals

| ID | Goal | Measurable Constraint |
|----|------|-----------------------|
| G1 | Supreme authority | Overrides all other skills; no exceptions |
| G2 | Zero-trust agent mode | Agents operate in PROPOSAL_ONLY mode; no autonomous approval |
| G3 | Deterministic enforcement | Same violation = same enforcement action, every time |
| G4 | Audit-ready violation handling | Every violation logged with doctrine reference and systemic risk |
| G5 | Change control | Constitution changes require approved Change Proposal only |

---

## 4. Non-Goals

| ID | Excluded | Rationale |
|----|----------|-----------|
| NG1 | Code style enforcement | Owned by `code-craft` skill |
| NG2 | Security vulnerability scanning | Owned by `security-scanner` skill |
| NG3 | Code review workflow | Owned by `code-review` skill |
| NG4 | Testing standards | Owned by `test-architect` skill |
| NG5 | Deployment governance | Owned by `cicd-pipeline` skill |
| NG6 | Skill file validation | Owned by `skill-generator` / `skill-design-guide.md` |

---

## 5. System Boundaries

| Boundary | Owned | Not Owned |
|----------|-------|-----------|
| Agent operating mode (STRICT/PROPOSAL_ONLY/ZERO_TRUST) | Mode definition + enforcement | Agent implementation |
| Doctrine library | 16 domain-specific rules in `rules/` | Rule execution in other skills |
| Enforcement behavior | Stop → Cite → Explain → Refuse | Automated remediation |
| Change control policy | Change Proposal process | Proposal tooling |
| Violation logging | Log schema definition | Log storage/aggregation |
| Authority hierarchy | Supreme override definition | Skill priority in GEMINI.md |

**Side-effect boundary:** Code Constitution produces governance decisions (approve/refuse) and violation reports. It does not modify files, execute code, or invoke other skills.

---

## 6. Integration Model

### 6.1 Agent Contract

#### Input Schema

```
Request_Type: string          # "validate" | "check-doctrine" | "enforcement-report" |
                              # "authority-query" | "change-proposal-review"
Context: {
  action: string              # What the agent proposes to do
  scope: string               # "architecture" | "data" | "security" | "breaking-change" |
                              # "agent-behavior" | "governance"
  affected_files: Array<string> | null  # Files being modified
  change_type: string         # "additive" | "modification" | "deletion" | "refactor"
  risk_level: string          # "low" | "medium" | "high" | "critical"
  agent_id: string            # Requesting agent identifier
  justification: string | null # Why this action is needed
}
contract_version: string      # "2.0.0"
```

#### Output Schema

```
Status: "approved" | "refused" | "escalated" | "error"
Data: {
  decision: string            # "approve" | "refuse" | "escalate-to-user"
  doctrines_checked: Array<string>  # List of doctrine files consulted
  violations: Array<{
    doctrine: string          # Violated doctrine file
    rule: string              # Specific rule within doctrine
    severity: string          # "warning" | "blocking" | "critical"
    risk_explanation: string  # Systemic risk of violation
  }> | null
  conditions: Array<string> | null  # Conditions for approval (if approved)
  enforcement_action: string | null # "stop" | "restrict" | "audit"
  metadata: {
    contract_version: string
    backward_compatibility: string
    authority_level: string   # "supreme"
    agent_operating_mode: string  # "STRICT"
  }
}
Error: ErrorSchema | null
```

#### Error Schema

```
Code: string                  # From Error Taxonomy (Section 11)
Message: string               # Human-readable, single line
Request_Type: string
Recoverable: boolean
```

#### Deterministic Guarantees

- Same `Request_Type` + `Context` = identical decision output.
- Violation detection is deterministic: same action against same doctrine = same violation list.
- Authority level is always "supreme"; never downgraded.
- Agent operating mode is always "STRICT"; never relaxed.
- No randomization, no probabilistic assessment.

#### What Agents May Assume

- A "refused" decision is binding; the action must not proceed.
- "approved" with conditions means ALL conditions must be met before proceeding.
- Doctrine files in `rules/` are the single source of truth for governance rules.
- Supreme authority means no other skill can override this decision.

#### What Agents Must NOT Assume

- An "approved" decision for one context applies to a different context.
- The skill accounts for business urgency or deadlines (governance is atemporal).
- A lack of violation means the action is safe (only checked doctrines are evaluated).
- The skill performs automated remediation (it only decides; caller acts).

#### Side-Effect Boundaries

| Operation | Side Effects |
|-----------|-------------|
| Validate action | None; pure decision |
| Check doctrine | None; read-only rule evaluation |
| Enforcement report | None; report generation |
| Authority query | None; returns authority model |
| Change proposal review | None; reviews proposal text |

### 6.2 Workflow Contract

#### Invocation Pattern

```
1. Agent proposes action with context (scope, files, change type, risk level)
2. Code Constitution validates against applicable doctrines in rules/
3. Decision returned: approve (with conditions) | refuse (with violations) | escalate
4. If refused: Agent stops, cites violation, does NOT proceed
5. If escalated: Agent requests user approval
6. If approved with conditions: Agent verifies all conditions before proceeding
```

#### Execution Guarantees

- Every invocation produces a complete, self-contained decision.
- Violation list includes all matching doctrines, not just the first.
- "Refuse" is final within the invocation; no override without user intervention.

#### Failure Propagation Model

| Failure Severity | Propagation | Workflow Action |
|-----------------|-------------|-----------------|
| Invalid request type | Return error to caller | Use supported request type |
| Missing context field | Return error to caller | Supply missing context |
| Doctrine file missing | Return error; refuse by default | Verify skill installation |
| Ambiguous scope | Escalate to user | User resolves ambiguity |

**Fail-closed invariant:** Any failure defaults to "refuse." Ambiguity defaults to escalation.

#### Retry Boundaries

- Zero internal retries. Deterministic output.
- Callers may retry with modified context after resolving violations.

#### Isolation Model

- Each invocation is stateless and independent.
- Doctrine files in `rules/` are read-only.

#### Idempotency Expectations

| Operation | Idempotent | Notes |
|-----------|-----------|-------|
| Validate action | Yes | Same context = same decision |
| Check doctrine | Yes | Read-only rule evaluation |
| Enforcement report | Yes | Deterministic report |
| Authority query | Yes | Fixed authority model |
| Change proposal review | Yes | Same proposal = same review |

---

## 7. Execution Model

### 4-Phase Lifecycle

| Phase | Action | Output |
|-------|--------|--------|
| **Classify** | Validate request type, extract scope, identify risk level | Validated input or error |
| **Evaluate** | Load applicable doctrines from `rules/`, check each against context | Violation list (may be empty) |
| **Decide** | Apply decision logic: 0 violations → approve, ≥1 blocking → refuse | Decision + conditions/violations |
| **Emit** | Return structured output with enforcement action | Complete output schema |

All phases synchronous. Fail-closed: any phase failure defaults to "refuse."

---

## 8. Deterministic Design Principles

| Principle | Enforcement |
|-----------|-------------|
| Fixed authority hierarchy | Constitution > all skills > all agents |
| Fixed agent operating mode | STRICT / PROPOSAL_ONLY / ZERO_TRUST |
| Fail-closed default | Ambiguity → refuse or escalate; never approve by default |
| Doctrine evaluation order | Alphabetical by doctrine file name |
| No external calls | Decisions use only local doctrine files |
| No ambient state | Each invocation operates solely on explicit inputs |
| No learning overrides | Constitution rules are immutable; no pattern-based exceptions |

---

## 9. State & Idempotency Model

Stateless. Fully idempotent. No persistent state.

Each invocation produces an identical output for identical inputs. The constitution is immutable between explicit Change Proposals.

---

## 10. Failure Handling Strategy

| Failure Class | Behavior | Default |
|---------------|----------|---------|
| Unknown request type | Return `ERR_INVALID_REQUEST_TYPE` | Refuse |
| Missing context field | Return `ERR_MISSING_CONTEXT` | Refuse |
| Missing doctrine file | Return `ERR_DOCTRINE_NOT_FOUND` | Refuse |
| Ambiguous scope | Return `ERR_AMBIGUOUS_SCOPE` | Escalate |
| Agent trust violation | Return `ERR_TRUST_VIOLATION` | Refuse + restrict |
| Change proposal invalid | Return `ERR_INVALID_PROPOSAL` | Refuse |
| Internal evaluation error | Return `ERR_EVALUATION_FAILED` | Refuse |

**Fail-closed invariant:** Every unhandled failure results in "refuse." No silent approvals.

---

## 11. Error Taxonomy

| Code | Category | Recoverable | Default Action |
|------|----------|-------------|----------------|
| `ERR_INVALID_REQUEST_TYPE` | Validation | No | Refuse |
| `ERR_MISSING_CONTEXT` | Validation | Yes | Refuse |
| `ERR_DOCTRINE_NOT_FOUND` | Infrastructure | No | Refuse |
| `ERR_AMBIGUOUS_SCOPE` | Validation | Yes | Escalate |
| `ERR_TRUST_VIOLATION` | Security | No | Refuse + restrict |
| `ERR_INVALID_PROPOSAL` | Validation | Yes | Refuse |
| `ERR_EVALUATION_FAILED` | Internal | No | Refuse |

---

## 12. Timeout & Retry Policy

| Parameter | Default | Maximum | Rationale |
|-----------|---------|---------|-----------|
| Doctrine evaluation timeout | N/A | N/A | Synchronous rule check; < 100ms |
| Internal retries | Zero | Zero | Deterministic; fail-closed |
| Doctrine file read timeout | 1,000 ms | 1,000 ms | Local filesystem; 16 files |

---

## 13. Observability & Logging Schema

### Log Entry Format

```json
{
  "trace_id": "uuid",
  "skill_name": "code-constitution",
  "contract_version": "2.0.0",
  "execution_id": "uuid",
  "timestamp": "ISO-8601",
  "request_type": "string",
  "scope": "string",
  "decision": "approved|refused|escalated",
  "violations_count": "number",
  "doctrines_checked": ["string"],
  "enforcement_action": "string|null",
  "agent_id": "string",
  "risk_level": "string",
  "duration_ms": "number"
}
```

### Required Log Points

| Event | Log Level | Fields |
|-------|-----------|--------|
| Action approved | INFO | All fields |
| Action refused | WARN | All fields + violations list |
| Trust violation detected | ERROR | All fields + agent_id + violation details |
| Doctrine evaluation completed | DEBUG | doctrines_checked, duration_ms |
| Ambiguous scope escalated | WARN | scope, escalation reason |

### Metrics

| Metric | Type | Unit |
|--------|------|------|
| `constitution.decision.duration` | Histogram | ms |
| `constitution.decision.distribution` | Counter | per decision (approve/refuse/escalate) |
| `constitution.violation.count` | Counter | per doctrine |
| `constitution.violation.severity` | Counter | per severity (warning/blocking/critical) |
| `constitution.scope.distribution` | Counter | per scope |

---

## 14. Security & Trust Model

### Agent Trust Level

- All agents operate at **ZERO_TRUST** by default.
- No agent may self-approve, self-merge, or bypass enforcement.
- Trust level cannot be elevated without explicit user consent.

### Doctrine Integrity

- Doctrine files in `rules/` are read-only during evaluation.
- Doctrine modification requires a Change Proposal (stored in `proposals/`).
- No runtime injection, template expansion, or dynamic rule generation.

### Authority Hierarchy

```
Code Constitution (SUPREME)
  └── GEMINI.md (P0)
        └── Agent .md files (P1)
              └── Skill .md files (P2)
```

No skill, agent, or workflow may override a constitutional decision.

### Fail-Closed Security

- Every ambiguous input defaults to "refuse" or "escalate."
- No implicit approval. Absence of violation is not approval without explicit check.

---

## 15. Scalability Model

| Dimension | Constraint | Mitigation |
|-----------|-----------|------------|
| Throughput | CPU-bound rule evaluation | < 100ms for 16 doctrine files |
| Concurrency | Stateless invocations | Unlimited parallel |
| Doctrine storage | 16 files in `rules/` (~20 KB total) | Static; growth controlled by proposals |
| Memory per invocation | < 2 MB | No accumulation |
| Network | Zero network calls | No external dependency |

---

## 16. Concurrency Model

Fully parallel. No shared state. No coordination required.

Each invocation reads doctrine files independently. Concurrent evaluations are safe because doctrines are immutable between Change Proposals.

---

## 17. Resource Lifecycle Management

All resources scoped to invocation. No persistent handles.

| Resource | Created By | Destroyed By | Max Lifetime |
|----------|-----------|-------------|--------------|
| Decision output | Emit phase | Caller | Invocation scope |
| Doctrine file handles | Evaluate phase | Auto-close | < 50 ms |
| Violation report | Decide phase | Caller | Invocation scope |

---

## 18. Performance Constraints

| Operation | P50 Target | P99 Target | Hard Limit |
|-----------|-----------|-----------|------------|
| Single doctrine check | < 5 ms | < 10 ms | 50 ms |
| Full validation (16 doctrines) | < 30 ms | < 80 ms | 500 ms |
| Decision generation | < 5 ms | < 10 ms | 50 ms |
| Output size | ≤ 1,000 chars | ≤ 3,000 chars | 5,000 chars |

---

## 19. Operational Risks

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Overly restrictive enforcement | Medium | Blocks legitimate agent actions | Escalation path to user for ambiguous cases |
| Doctrine staleness | Low | Rules don't reflect current architecture | Change Proposal process for updates |
| Constitution bypass via new skill | Medium | New skill ignores constitutional rules | Authority hierarchy enforced in GEMINI.md |
| False negative (missed violation) | Low | Unapproved action proceeds | Doctrine coverage reviewed periodically |
| Agent spoofing scope/risk level | Medium | Agent underreports risk to get approval | Zero-trust: agent declarations are inputs, not truth |

---

## 20. Compliance with skill-design-guide.md

| Requirement | Status | Evidence |
|-------------|--------|----------|
| YAML frontmatter complete | ✅ | name, description, metadata with category, version, triggers, coordinates_with, success_metrics |
| SKILL.md < 200 lines | ✅ | Entry point under 200 lines |
| Prerequisites documented | ✅ | No external dependencies |
| When to Use section | ✅ | Scope-based activation table |
| Core content matches skill type | ✅ | Meta-governance type: authority model, enforcement, doctrines |
| Troubleshooting section | ✅ | Anti-patterns table (violation behaviors) |
| Related section | ✅ | Cross-links to code-review, security-scanner, code-craft |
| Content Map for multi-file | ✅ | Links to rules/, metadata/, resources/, scripts/, examples/ |
| Contract versioning | ✅ | contract_version, backward_compatibility, breaking_changes in Integration Model |
| Compliance matrix structured | ✅ | This table with ✅/❌ + evidence |

---

## 21. Production Readiness Checklist

| Category | Check | Status |
|----------|-------|--------|
| **Governance** | Supreme authority model defined | ✅ |
| **Governance** | Zero-trust agent operating mode | ✅ |
| **Governance** | Fail-closed enforcement default | ✅ |
| **Governance** | Change Proposal process for doctrine updates | ✅ |
| **Contracts** | Input/output/error schemas in pseudo-schema format | ✅ |
| **Contracts** | Contract versioning with semver | ✅ |
| **Contracts** | Agent assumptions and non-assumptions documented | ✅ |
| **Failure** | Error taxonomy with 7 categorized error codes | ✅ |
| **Failure** | Fail-closed invariant: all failures default to refuse | ✅ |
| **Failure** | Zero internal retries | ✅ |
| **Determinism** | Fixed doctrine evaluation order (alphabetical) | ✅ |
| **Determinism** | Fixed authority hierarchy (Constitution > GEMINI.md > Agent > Skill) | ✅ |
| **Security** | Zero-trust agent mode; no self-approval | ✅ |
| **Security** | Doctrine files are read-only during evaluation | ✅ |
| **Observability** | Structured log schema with 5 mandatory fields + 5 log points | ✅ |
| **Observability** | 5 metrics defined | ✅ |
| **Performance** | P50/P99 targets for all operations | ✅ |
| **Scalability** | Stateless; unlimited parallel invocations | ✅ |
| **Compliance** | All skill-design-guide.md sections mapped with evidence | ✅ |

---

⚡ PikaKit v3.9.69
