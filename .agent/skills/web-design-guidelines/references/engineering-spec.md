# Web Design Guidelines — Engineering Specification

> Production-grade specification for UI accessibility and UX compliance review at FAANG scale.

---

## 1. Overview

Web Design Guidelines provides structured UI review across 4 categories: Accessibility/WCAG (5 checks: alt text, labels, contrast 4.5:1 minimum, focus indicators, ARIA roles), Semantic HTML (4 element replacements), UX Patterns (4 requirements: loading state, empty state, error state, touch targets 44×44px minimum), and Visual Design (4 standards: typography 16px+ body, consistent spacing, color contrast, responsive mobile-first). The skill operates as an **Expert (decision tree)** — it produces audit findings in `file:line - issue` format. It does not modify code, apply fixes, or run automated scans.

**Contract Version:** 2.0.0
**Backward Compatibility:** breaking (first hardened version)
**Breaking Changes:** None — new spec for first hardening

---

## 2. Problem Statement

Web UI quality at scale faces four quantified problems:

| Problem | Measurement | Impact |
|---------|-------------|--------|
| Missing accessibility | 70% of web apps fail WCAG 2.1 AA | Legal liability, user exclusion |
| Non-semantic HTML | 50% of interactive elements use div+onClick | Screen readers fail |
| Missing UX states | 45% of pages lack loading/empty/error states | Poor user experience |
| Inadequate contrast | 35% of text fails 4.5:1 contrast ratio | Unreadable for vision-impaired |

Web Design Guidelines eliminates these with structured 4-category audit: WCAG compliance (5 checks), semantic HTML routing (4 element replacements), UX state coverage (4 required states), and visual design standards (4 quantified targets).

---

## 3. Design Goals

| ID | Goal | Measurable Constraint |
|----|------|-----------------------|
| G1 | Accessibility audit | 5 WCAG checks with quantified thresholds |
| G2 | Semantic HTML | 4 element replacement rules |
| G3 | UX pattern coverage | 4 required states (loading, empty, error, touch) |
| G4 | Visual design | 4 standards with numeric thresholds |
| G5 | Output format | `file:line - issue` (machine-parseable) |
| G6 | Quick audit | 3 grep-based CLI commands |

---

## 4. Non-Goals

| ID | Excluded | Rationale |
|----|----------|-----------|
| NG1 | Design system tokens | Owned by `design-system` skill |
| NG2 | Visual design creation | Owned by `frontend-design` skill |
| NG3 | Code quality review | Owned by `code-review` skill |
| NG4 | Automated WCAG scanning | Runtime tooling (axe, Lighthouse) |
| NG5 | CSS implementation | Styling concern |
| NG6 | Performance auditing | Owned by `perf-optimizer` skill |

---

## 5. System Boundaries

| Boundary | Owned | Not Owned |
|----------|-------|-----------|
| WCAG compliance checks | 5 specific checks with thresholds | Full WCAG 2.1 conformance |
| Semantic HTML | 4 element replacement rules | HTML specification |
| UX state coverage | 4 required states | State management implementation |
| Visual design standards | 4 quantified standards | Design token creation |
| Audit output | file:line - issue format | Auto-fix capabilities |

**Side-effect boundary:** Web Design Guidelines produces audit findings. It does not modify files, run automated scanners, or apply fixes.

---

## 6. Integration Model

### 6.1 Agent Contract

#### Input Schema

```
Request_Type: string          # "accessibility" | "semantic" | "ux-patterns" |
                              # "visual" | "full-audit" | "quick-audit"
Context: {
  file_paths: Array<string> | null  # Specific files to audit
  component_type: string | null     # "form" | "navigation" | "page" | "interactive"
  framework: string | null          # "react" | "vue" | "svelte" | null
}
contract_version: string      # "2.0.0"
```

#### Output Schema

```
Status: "success" | "error"
Data: {
  findings: Array<{
    file: string              # File path
    line: number              # Line number
    category: string          # "accessibility" | "semantic" | "ux-patterns" | "visual"
    severity: string          # "critical" | "major" | "minor"
    issue: string             # Description
    fix: string               # Recommended fix
    wcag_criterion: string | null  # e.g., "1.1.1" for alt text
  }>
  summary: {
    total: number
    critical: number
    major: number
    minor: number
    categories_audited: Array<string>
  }
  metadata: {
    contract_version: string
    backward_compatibility: string
  }
}
Error: ErrorSchema | null
```

#### Error Schema

```
Code: string                  # From Error Taxonomy (Section 11)
Message: string
Request_Type: string
Recoverable: boolean
```

#### Deterministic Guarantees

- Accessibility checks are fixed: 5 checks (alt text, labels, contrast 4.5:1, focus, ARIA).
- Semantic HTML routing is fixed: `<div onClick>` → `<button>`; `<div class="nav">` → `<nav>`; `<div class="header">` → `<header>`; `<span>` for headings → `<h1>`-`<h6>`.
- UX pattern checks are fixed: loading state, empty state, error state, touch targets (44×44px minimum).
- Visual design checks are fixed: body text ≥ 16px, consistent spacing, contrast ≥ 4.5:1, responsive (mobile-first).
- Same code = same findings.

#### What Agents May Assume

- Audit covers 4 categories (accessibility, semantic HTML, UX patterns, visual design).
- Findings follow `file:line - issue` format.
- Severity levels are: critical, major, minor.
- WCAG 2.1 AA is the compliance target.

#### What Agents Must NOT Assume

- Audit covers all WCAG criteria (only 5 key checks).
- Automated scanners are invoked (manual review guidance).
- All findings are auto-fixable.
- Audit replaces full accessibility testing.

#### Side-Effect Boundaries

| Operation | Side Effects |
|-----------|-------------|
| Accessibility audit | None; findings output |
| Semantic HTML audit | None; findings output |
| UX patterns audit | None; findings output |
| Visual design audit | None; findings output |
| Quick audit | None; grep commands output |

### 6.2 Workflow Contract

#### Invocation Pattern

```
1. Identify files or components to audit
2. Choose audit scope (full-audit or specific category)
3. Invoke with file paths and component type
4. Review findings by severity (critical → major → minor)
5. Apply fixes (caller's responsibility)
```

#### Execution Guarantees

- Each invocation produces a complete audit for the requested scope.
- All checks are independent (categories can be audited separately).

#### Failure Propagation Model

| Failure Severity | Propagation | Workflow Action |
|-----------------|-------------|-----------------|
| No files provided | Return error | Specify file paths |
| Invalid request type | Return error | Use supported type |
| Unsupported file type | Return error | Use .tsx, .jsx, .vue, .svelte, .html |

#### Retry Boundaries

- Zero internal retries. Deterministic output.

#### Isolation Model

- Each invocation is stateless and independent.

#### Idempotency Expectations

| Operation | Idempotent | Notes |
|-----------|-----------|-------|
| Accessibility audit | Yes | Same code = same findings |
| Semantic HTML audit | Yes | Same code = same findings |
| UX patterns audit | Yes | Same code = same findings |
| Visual design audit | Yes | Same code = same findings |

---

## 7. Execution Model

### 2-Phase Lifecycle

| Phase | Action | Output |
|-------|--------|--------|
| **Classify** | Parse file paths, component type, audit scope | Classification |
| **Audit** | Apply checks from selected categories | Findings list |

All phases synchronous. No async pipeline.

---

## 8. Deterministic Design Principles

| Principle | Enforcement |
|-----------|-------------|
| Accessibility — alt text | Every `<img>` requires `alt` attribute (WCAG 1.1.1) |
| Accessibility — labels | Every `<input>` requires associated `<label>` or `aria-label` (WCAG 1.3.1) |
| Accessibility — contrast | Text contrast ratio ≥ 4.5:1 for normal text, ≥ 3:1 for large text (WCAG 1.4.3) |
| Accessibility — focus | Visible focus indicators on all interactive elements (WCAG 2.4.7) |
| Accessibility — ARIA | Proper `role`, `aria-*` attributes on custom components (WCAG 4.1.2) |
| Semantic — buttons | `<div onClick>` → `<button>` |
| Semantic — navigation | `<div class="nav">` → `<nav>` |
| Semantic — header | `<div class="header">` → `<header>` |
| Semantic — headings | `<span>` for headings → `<h1>`-`<h6>` |
| UX — loading | Loading state required for async operations |
| UX — empty | Empty state required for data-dependent views |
| UX — error | Error state with clear message required |
| UX — touch | Touch targets ≥ 44×44px (WCAG 2.5.5) |
| Visual — typography | Body text ≥ 16px |
| Visual — spacing | Consistent spacing rhythm |
| Visual — contrast | Color contrast ≥ 4.5:1 |
| Visual — responsive | Mobile-first breakpoints |

---

## 9. State & Idempotency Model

Stateless. Fully idempotent. No persistent state.

---

## 10. Failure Handling Strategy

| Failure Class | Behavior | Caller Recovery |
|---------------|----------|-----------------|
| No files provided | Return `ERR_NO_FILES` | Specify file paths |
| Invalid request type | Return `ERR_INVALID_REQUEST_TYPE` | Use supported type |
| Unsupported file type | Return `ERR_UNSUPPORTED_FILE` | Use .tsx, .jsx, .vue, .svelte, .html |

**Invariant:** Every failure returns a structured error. No partial audit results.

---

## 11. Error Taxonomy

| Code | Category | Recoverable | Description |
|------|----------|-------------|-------------|
| `ERR_INVALID_REQUEST_TYPE` | Validation | No | Request type not supported |
| `ERR_NO_FILES` | Validation | Yes | No file paths provided |
| `ERR_UNSUPPORTED_FILE` | Validation | Yes | File type not .tsx/.jsx/.vue/.svelte/.html |

---

## 12. Timeout & Retry Policy

| Parameter | Default | Maximum | Rationale |
|-----------|---------|---------|-----------|
| Decision generation | N/A | N/A | Synchronous; < 50ms |
| Internal retries | Zero | Zero | Deterministic output |

---

## 13. Observability & Logging Schema

### Log Entry Format

```json
{
  "trace_id": "uuid",
  "skill_name": "web-design-guidelines",
  "contract_version": "2.0.0",
  "execution_id": "uuid",
  "timestamp": "ISO-8601",
  "request_type": "string",
  "files_audited": "number",
  "findings_total": "number",
  "findings_critical": "number",
  "categories_audited": "Array<string>",
  "status": "success|error",
  "error_code": "string|null",
  "duration_ms": "number"
}
```

### Required Log Points

| Event | Log Level | Fields |
|-------|-----------|--------|
| Audit started | INFO | files_audited, request_type |
| Findings generated | INFO | findings_total, findings_critical |
| Category audited | INFO | category, findings_count |
| Audit failed | ERROR | error_code, message |

### Metrics

| Metric | Type | Unit |
|--------|------|------|
| `webdesign.audit.duration` | Histogram | ms |
| `webdesign.findings.total` | Counter | per audit |
| `webdesign.findings.by_severity` | Counter | per severity |
| `webdesign.category.distribution` | Counter | per category |

---

## 14. Security & Trust Model

### Data Handling

- Web Design Guidelines processes file paths and component code only.
- No credentials, no PII, no user data.
- No network calls, no file modifications, no automated scanning.

---

## 15. Scalability Model

| Dimension | Constraint | Mitigation |
|-----------|-----------|------------|
| Throughput | CPU-bound decision tree | < 50ms; scales linearly |
| Concurrency | Stateless invocations | Unlimited parallel |
| Memory per invocation | < 1 MB | No accumulation |
| Network | Zero network calls | No external dependency |

---

## 16. Concurrency Model

Fully parallel. No shared state. No coordination required.

---

## 17. Resource Lifecycle Management

All resources scoped to invocation. No persistent handles.

---

## 18. Performance Constraints

| Operation | P50 Target | P99 Target | Hard Limit |
|-----------|-----------|-----------|------------|
| Single category audit | < 5 ms | < 15 ms | 30 ms |
| Full audit (4 categories) | < 15 ms | < 40 ms | 50 ms |
| Output size | ≤ 5,000 chars | ≤ 15,000 chars | 20,000 chars |

---

## 19. Operational Risks

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| WCAG version update (2.2 → 3.0) | Low | Outdated criteria | Track WCAG roadmap |
| Framework-specific patterns | Medium | Missed issues | Document per-framework checks |
| Partial audit mistaken for full | Medium | False compliance | Label scope in output |
| Contrast ratio tool discrepancies | Low | Conflicting findings | Use WCAG-standard algorithms |

---

## 20. Compliance with skill-design-guide.md

| Requirement | Status | Evidence |
|-------------|--------|----------|
| YAML frontmatter complete | ✅ | name, description, metadata with category, version, triggers, coordinates_with, success_metrics |
| SKILL.md < 200 lines | ✅ | Entry point under 200 lines |
| Prerequisites documented | ✅ | No external dependencies |
| When to Use section | ✅ | Situation-based routing table |
| Core content matches skill type | ✅ | Expert type: audit checks, findings output, grep commands |
| Troubleshooting section | ✅ | Anti-patterns table |
| Related section | ✅ | Cross-links to design-system, frontend-design, code-review |
| Content Map for multi-file | ✅ | Link to engineering-spec.md |
| Contract versioning | ✅ | contract_version, backward_compatibility, breaking_changes |
| Compliance matrix structured | ✅ | This table with ✅/❌ + evidence |

---

## 21. Production Readiness Checklist

| Category | Check | Status |
|----------|-------|--------|
| **Functionality** | Accessibility/WCAG (5 checks with thresholds) | ✅ |
| **Functionality** | Semantic HTML (4 element replacements) | ✅ |
| **Functionality** | UX Patterns (4 required states) | ✅ |
| **Functionality** | Visual Design (4 quantified standards) | ✅ |
| **Functionality** | Output format (file:line - issue) | ✅ |
| **Functionality** | Quick audit (3 grep commands) | ✅ |
| **Contracts** | Input/output/error schemas in pseudo-schema format | ✅ |
| **Contracts** | Contract versioning with semver | ✅ |
| **Failure** | Error taxonomy with 3 categorized codes | ✅ |
| **Failure** | Zero internal retries | ✅ |
| **Determinism** | Fixed checks, fixed thresholds, fixed element routing | ✅ |
| **Security** | No file modifications, no network, no scanners | ✅ |
| **Observability** | Structured log schema with 5 mandatory fields | ✅ |
| **Observability** | 4 metrics defined | ✅ |
| **Performance** | P50/P99 targets for all operations | ✅ |
| **Compliance** | All skill-design-guide.md sections mapped with evidence | ✅ |

---

⚡ PikaKit v3.9.70
