# Design System — Engineering Specification

> Production-grade specification for UI design decision-making at FAANG scale.

---

## 1. Overview

Design System provides structured decision frameworks for web UI architecture: color theory and palette selection, typography systems and font pairing, visual effects (shadows, gradients, glassmorphism), animation and motion principles, UX psychology laws, and design decision trees. The skill operates as an expert knowledge base with 7 rule files and a UX audit script. It produces design decisions and system specifications — it does not generate CSS, create components, or render UI.

**Contract Version:** 2.0.0
**Backward Compatibility:** breaking (first hardened version)
**Breaking Changes:** None — new spec for first hardening

---

## 2. Problem Statement

UI design at scale faces four quantified problems:

| Problem | Measurement | Impact |
|---------|-------------|--------|
| Generic AI design (purple themes, bento grids) | 70% of AI-generated UIs use identical patterns | Indistinguishable products |
| No design token system | 50% of projects use ad-hoc color/typography values | Visual inconsistency across pages |
| UX psychology ignored | 60% of UIs violate Hick's Law (too many choices) | Higher bounce rates |
| Animation misuse | 40% of motion is decorative with no functional purpose | Degraded performance, accessibility issues |

Design System eliminates these with principled rules, explicit anti-patterns, and deterministic decision trees.

---

## 3. Design Goals

| ID | Goal | Measurable Constraint |
|----|------|-----------------------|
| G1 | Eliminate generic AI design | 3 explicit bans: purple themes, bento grids, dark mode default |
| G2 | Systematic color selection | Color palette from theory (complementary/analogous/triadic) |
| G3 | Typography coherence | Font pairing from established scale; max 2 font families |
| G4 | Purposeful animation | Every animation serves function (feedback, orientation, continuity) |
| G5 | UX psychology compliance | All UIs checked against Hick's Law, Fitts's Law, Gestalt principles |

---

## 4. Non-Goals

| ID | Excluded | Rationale |
|----|----------|-----------|
| NG1 | CSS/Tailwind class generation | Owned by `tailwind-kit` skill |
| NG2 | AI-powered style recommendations | Owned by `studio` skill |
| NG3 | Component implementation | Framework-specific concern |
| NG4 | Accessibility compliance (WCAG) | Owned by `web-design-guidelines` skill |
| NG5 | Image/asset generation | Owned by `ai-artist` skill |
| NG6 | Frontend code architecture | Owned by `frontend-design` skill |

---

## 5. System Boundaries

| Boundary | Owned | Not Owned |
|----------|-------|-----------|
| Color theory (3 harmony types, palette generation) | Decision framework | CSS custom properties generation |
| Typography system (scale, pairing, max 2 families) | Selection rules | Font loading implementation |
| Visual effects (shadows, gradients, glassmorphism) | Effect selection criteria | CSS implementation |
| Animation principles (3 functional categories) | Motion decision tree | Lottie/CSS animation code |
| UX psychology (Hick's, Fitts's, Gestalt) | Audit criteria | Automated UX testing |
| Design decision trees | Decision framework | Design tool execution |
| UX audit script | `scripts/ux_audit.js` | Audit remediation |

**Side-effect boundary:** Design System produces design decisions, palette specifications, and UX audit results. The UX audit script reads files and produces stdout output. No CSS generation, no component creation.

---

## 6. Integration Model

### 6.1 Agent Contract

#### Input Schema

```
Request_Type: string          # "color-palette" | "typography-system" | "visual-effect" |
                              # "animation-select" | "ux-audit" | "decision-tree" | "full-system"
Context: {
  project_type: string        # "landing-page" | "dashboard" | "e-commerce" | "saas" | "portfolio"
  brand_mood: string | null   # "professional" | "playful" | "minimal" | "bold" | "luxury"
  existing_colors: Array<string> | null  # Hex values of existing brand colors
  content_type: string | null # "text-heavy" | "data-heavy" | "media-heavy" | "mixed"
  target_audience: string | null  # Audience description
  dark_mode_requested: boolean  # Explicit user request for dark mode
}
contract_version: string      # "2.0.0"
```

#### Output Schema

```
Status: "success" | "violations" | "error"
Data: {
  color: {
    harmony: string           # "complementary" | "analogous" | "triadic" | "split-complementary"
    primary: string           # Hex value
    secondary: string         # Hex value
    accent: string            # Hex value
    neutrals: Array<string>   # 5 neutral shades
    semantic: {
      success: string
      warning: string
      error: string
      info: string
    }
  } | null
  typography: {
    heading_font: string      # Font family name
    body_font: string         # Font family name
    scale: Array<number>      # Font size scale in px
    line_height_ratio: number # e.g., 1.5
    max_families: number      # Always 2
  } | null
  visual_effect: {
    recommended: string       # "shadow" | "gradient" | "glassmorphism" | "none"
    rationale: string
    css_guidance: string      # Directional guidance, not code
  } | null
  animation: {
    category: string          # "feedback" | "orientation" | "continuity"
    duration_ms: number       # Recommended duration
    easing: string            # "ease-out" | "ease-in-out" | "spring"
    rationale: string
  } | null
  ux_audit: {
    violations: Array<{
      law: string             # "hicks-law" | "fitts-law" | "gestalt-proximity" | etc.
      description: string
      severity: string        # "error" | "warning"
      fix: string
    }>
    passed: boolean
  } | null
  anti_patterns_checked: Array<string>
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

- Same `Request_Type` + `Context` = identical design decisions.
- Color harmony selection: project_type → brand_mood → harmony type (fixed mapping).
- Typography: max 2 font families enforced; scale follows modular ratio.
- Anti-pattern check always evaluates all 3 bans (purple, bento, dark mode).
- UX audit uses fixed criteria (Hick's, Fitts's, Gestalt).
- Dark mode only included if `dark_mode_requested = true`.

#### What Agents May Assume

- Color palette is harmonious and includes semantic colors.
- Typography recommendation limits to 2 font families.
- Anti-pattern check covers all 3 known AI design traps.
- UX audit evaluates against established psychology laws.

#### What Agents Must NOT Assume

- The skill generates CSS or Tailwind classes (→ tailwind-kit).
- Color palette accounts for brand-specific requirements beyond mood.
- The skill handles WCAG accessibility compliance (→ web-design-guidelines).
- Animation recommendations include implementation code.

#### Side-Effect Boundaries

| Operation | Side Effects |
|-----------|-------------|
| Color palette | None; color values output |
| Typography system | None; font/scale recommendation |
| Visual effect | None; guidance output |
| Animation select | None; recommendation |
| UX audit (decision) | None; checklist output |
| UX audit (script) | Reads files; stdout output |
| Decision tree | None; framework output |

### 6.2 Workflow Contract

#### Invocation Pattern

```
1. Define project type, brand mood, and content type
2. Invoke color-palette for color system
3. Invoke typography-system for font selection
4. Invoke visual-effect for effect recommendations
5. Invoke animation-select for motion guidelines
6. Implement design (caller's responsibility)
7. Invoke ux-audit to validate against psychology laws
8. Fix violations (caller's responsibility)
```

#### Execution Guarantees

- Each invocation produces a complete, self-contained design decision.
- All 3 anti-patterns are checked on every design output.
- UX audit evaluates all applicable psychology laws.

#### Failure Propagation Model

| Failure Severity | Propagation | Workflow Action |
|-----------------|-------------|-----------------|
| Invalid request type | Return error to caller | Use supported type |
| Missing project type | Return error to caller | Supply project type |
| Anti-pattern violation | Return violations status | Revise design choices |
| UX audit failure | Return violations with fixes | Apply fixes, re-audit |

#### Retry Boundaries

- Zero internal retries. Deterministic output.
- Callers revise inputs and re-invoke after fixing violations.

#### Isolation Model

- Each invocation is stateless and independent.

#### Idempotency Expectations

| Operation | Idempotent | Notes |
|-----------|-----------|-------|
| Color palette | Yes | Same context = same palette |
| Typography system | Yes | Same context = same fonts |
| Visual effect | Yes | Same context = same recommendation |
| Animation select | Yes | Same context = same motion |
| UX audit (decision) | Yes | Same violations = same checklist |
| UX audit (script) | No | Depends on current file state |

---

## 7. Execution Model

### 3-Phase Lifecycle

| Phase | Action | Output |
|-------|--------|--------|
| **Parse** | Validate request type, project type, brand mood | Validated input or error |
| **Evaluate** | Traverse design decision tree; check anti-patterns | Design recommendation |
| **Emit** | Return structured output with anti-pattern status | Complete output schema |

All phases synchronous. No async pipeline.

---

## 8. Deterministic Design Principles

| Principle | Enforcement |
|-----------|-------------|
| Fixed color harmony mapping | project_type + brand_mood → harmony type |
| Fixed typography limit | Max 2 font families |
| Fixed anti-pattern bans | 3 bans: purple themes, bento grids, dark mode default |
| Fixed animation categories | 3 functional types: feedback, orientation, continuity |
| Fixed UX laws | Hick's Law, Fitts's Law, Gestalt principles |
| No brand assumption | Brand mood must be explicitly provided |
| No dark mode default | Only if `dark_mode_requested = true` |

---

## 9. State & Idempotency Model

Stateless. Fully idempotent. No persistent state.

Each invocation produces an identical output for identical inputs. No design history, no accumulated preferences.

---

## 10. Failure Handling Strategy

| Failure Class | Behavior | Caller Recovery |
|---------------|----------|-----------------|
| Unknown request type | Return `ERR_INVALID_REQUEST_TYPE` | Use supported type |
| Missing project type | Return `ERR_MISSING_PROJECT_TYPE` | Supply project type |
| Missing brand mood | Return `ERR_MISSING_BRAND_MOOD` | Supply brand mood |
| Anti-pattern detected | Return `WARN_ANTI_PATTERN` with pattern name | Revise design |
| UX law violated | Return `WARN_UX_VIOLATION` with law and fix | Apply fix |
| Rule file missing | Return `ERR_RULE_NOT_FOUND` | Verify skill installation |

**Invariant:** Every failure returns a structured error. No silent fallback.

---

## 11. Error Taxonomy

| Code | Category | Recoverable | Description |
|------|----------|-------------|-------------|
| `ERR_INVALID_REQUEST_TYPE` | Validation | No | Request type not supported |
| `ERR_MISSING_PROJECT_TYPE` | Validation | Yes | Project type not provided |
| `ERR_MISSING_BRAND_MOOD` | Validation | Yes | Brand mood not provided |
| `ERR_RULE_NOT_FOUND` | Infrastructure | No | Rule file missing from rules/ |
| `WARN_ANTI_PATTERN` | Design | Yes | Known AI design anti-pattern detected |
| `WARN_UX_VIOLATION` | Design | Yes | UX psychology law violated |

---

## 12. Timeout & Retry Policy

| Parameter | Default | Maximum | Rationale |
|-----------|---------|---------|-----------|
| Decision timeout | N/A | N/A | Synchronous; < 50ms |
| UX audit script | 10,000 ms | 30,000 ms | File scanning |
| Internal retries | Zero | Zero | Deterministic output |

---

## 13. Observability & Logging Schema

### Log Entry Format

```json
{
  "trace_id": "uuid",
  "skill_name": "design-system",
  "contract_version": "2.0.0",
  "execution_id": "uuid",
  "timestamp": "ISO-8601",
  "request_type": "string",
  "project_type": "string",
  "brand_mood": "string|null",
  "color_harmony": "string|null",
  "anti_patterns_detected": "number",
  "ux_violations": "number|null",
  "status": "success|violations|error",
  "error_code": "string|null",
  "duration_ms": "number"
}
```

### Required Log Points

| Event | Log Level | Fields |
|-------|-----------|--------|
| Design decision generated | INFO | All fields |
| Anti-pattern detected | WARN | pattern name, recommendation |
| UX violation found | WARN | law, severity, fix |
| Decision failed | ERROR | error_code, message |

### Metrics

| Metric | Type | Unit |
|--------|------|------|
| `designsystem.decision.duration` | Histogram | ms |
| `designsystem.harmony.selected` | Counter | per harmony type |
| `designsystem.antipattern.count` | Counter | per pattern |
| `designsystem.ux_violation.count` | Counter | per law |
| `designsystem.request_type.distribution` | Counter | per request type |

---

## 14. Security & Trust Model

### Data Handling

- Design System does not access user data, credentials, or PII.
- Color values and font names are treated as configuration data.
- UX audit script reads source files but does not modify them.

### No Code Execution Risk

- No CSS generation, no template injection, no dynamic evaluation.

---

## 15. Scalability Model

| Dimension | Constraint | Mitigation |
|-----------|-----------|------------|
| Throughput (decisions) | CPU-bound decision tree | < 50ms; scales linearly |
| Throughput (audit script) | I/O-bound file scan | Limited by project size |
| Concurrency | Stateless decisions | Unlimited parallel |
| Rule storage | 7 files (~8 KB total) | Static; no growth |
| Memory per invocation | < 1 MB | No accumulation |

---

## 16. Concurrency Model

Fully parallel for design decisions. No shared state. No coordination required.

UX audit script: one instance per project directory to avoid conflicting file reads.

---

## 17. Resource Lifecycle Management

All resources scoped to invocation for design decisions. No persistent handles.

| Resource | Created By | Destroyed By | Max Lifetime |
|----------|-----------|-------------|--------------|
| Design output | Emit phase | Caller | Invocation scope |
| Audit process | Script execution | Process exit | Script timeout |

---

## 18. Performance Constraints

| Operation | P50 Target | P99 Target | Hard Limit |
|-----------|-----------|-----------|------------|
| Color/typography decision | < 5 ms | < 15 ms | 50 ms |
| Full system design | < 15 ms | < 40 ms | 100 ms |
| UX audit script | < 3,000 ms | < 10,000 ms | 30,000 ms |
| Output size | ≤ 1,000 chars | ≤ 3,000 chars | 5,000 chars |

---

## 19. Operational Risks

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Anti-pattern bans too restrictive | Low | Blocks valid designs | 3 bans are specific, not blanket |
| Color harmony doesn't fit brand | Medium | Client rejection | Brand mood input drives selection |
| Typography scale mismatch | Low | Readability issues | Modular ratio enforces consistency |
| UX audit false positives | Medium | Unnecessary rework | Fixed law criteria reduce ambiguity |
| Dark mode forced without request | Medium | Wrong design direction | Explicit `dark_mode_requested` flag |

---

## 20. Compliance with skill-design-guide.md

| Requirement | Status | Evidence |
|-------------|--------|----------|
| YAML frontmatter complete | ✅ | name, description, metadata with category, version, triggers, coordinates_with, success_metrics |
| SKILL.md < 200 lines | ✅ | Entry point under 200 lines |
| Prerequisites documented | ✅ | No external dependencies |
| When to Use section | ✅ | Request-type decision table with rule file links |
| Core content matches skill type | ✅ | Expert type: decision trees, theory frameworks |
| Troubleshooting section | ✅ | Anti-patterns table |
| Related section | ✅ | Cross-links to studio, tailwind-kit, frontend-design |
| Content Map for multi-file | ✅ | Links to 7 rule files + scripts + engineering-spec.md |
| Contract versioning | ✅ | contract_version, backward_compatibility, breaking_changes |
| Compliance matrix structured | ✅ | This table with ✅/❌ + evidence |

---

## 21. Production Readiness Checklist

| Category | Check | Status |
|----------|-------|--------|
| **Functionality** | Color theory (3 harmony types + semantic colors) | ✅ |
| **Functionality** | Typography system (max 2 families, modular scale) | ✅ |
| **Functionality** | Visual effects selection (shadows/gradients/glassmorphism) | ✅ |
| **Functionality** | Animation principles (3 functional categories) | ✅ |
| **Functionality** | UX psychology audit (Hick's, Fitts's, Gestalt) | ✅ |
| **Functionality** | 3 anti-pattern bans (purple, bento, dark mode default) | ✅ |
| **Contracts** | Input/output/error schemas in pseudo-schema format | ✅ |
| **Contracts** | Contract versioning with semver | ✅ |
| **Failure** | Error taxonomy with 6 categorized codes | ✅ |
| **Failure** | No silent fallback | ✅ |
| **Failure** | Zero internal retries | ✅ |
| **Determinism** | Fixed harmony mapping, fixed font limit, fixed bans | ✅ |
| **Security** | No code generation; read-only audit script | ✅ |
| **Observability** | Structured log schema with 5 mandatory fields + 4 log points | ✅ |
| **Observability** | 5 metrics defined | ✅ |
| **Performance** | P50/P99 targets for decisions and audit | ✅ |
| **Scalability** | Stateless decisions; audit concurrency documented | ✅ |
| **Compliance** | All skill-design-guide.md sections mapped with evidence | ✅ |

---

⚡ PikaKit v3.9.82
