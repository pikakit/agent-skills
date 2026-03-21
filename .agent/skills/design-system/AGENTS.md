# design-system — Full Reference Guide

> **Compiled from SKILL.md + references/ for AI agent consumption.**

---

# Design System â€” UI Design Decisions

> Every pixel has purpose. Restraint is luxury. User psychology drives decisions.

---

## Prerequisites

**Required:** None â€” Design System is a knowledge-based skill with no external dependencies.

---

## When to Use

| Situation | Action |
|-----------|--------|
| Color selection | Invoke color-palette; read `rules/color-system.md` |
| Typography | Invoke typography-system; read `rules/typography-system.md` |
| Visual effects | Invoke visual-effect; read `rules/visual-effects.md` |
| Animation/motion | Invoke animation-select; read `rules/animation-guide.md` |
| UX validation | Invoke ux-audit; read `rules/ux-psychology.md` |
| Design decisions | Read `rules/decision-trees.md` |
| Architecture review | Read `references/engineering-spec.md` |

---

## System Boundaries

| Owned by This Skill | NOT Owned |
|---------------------|-----------|
| Color theory (3 harmony types + semantic palette) | CSS/Tailwind generation (â†’ tailwind-kit) |
| Typography system (max 2 families, modular scale) | AI style recommendations (â†’ studio) |
| Visual effects selection criteria | Component implementation |
| Animation principles (3 functional categories) | WCAG accessibility (â†’ web-design-guidelines) |
| UX psychology audit (Hick's, Fitts's, Gestalt) | Image/asset generation (â†’ ai-artist) |
| 3 design anti-pattern bans | Frontend code architecture (â†’ frontend-design) |

**Pure decision skill:** Produces design specifications. Zero side effects (except UX audit script reads files).

---

## âš ï¸ Anti-Pattern Bans (Enforced on ALL Outputs)

| # | Ban | Reason |
|---|-----|--------|
| 1 | **Purple Ban** | Do not use generic purple themes (AI-generated clichÃ©) |
| 2 | **Bento Ban** | Do not default to Bento grids without explicit justification |
| 3 | **Dark Mode Default** | Do not assume dark mode unless `dark_mode_requested = true` |

---

## Color System (Quick Reference)

| Project + Mood | Harmony |
|---------------|---------|
| Professional / Corporate | Complementary |
| Creative / Playful | Triadic |
| Minimal / Luxury | Analogous |

Every palette includes: primary, secondary, accent, 5 neutrals, 4 semantic (success/warning/error/info).

---

## Typography Rules

| Rule | Constraint |
|------|-----------|
| Max font families | 2 (heading + body) |
| Scale | Modular ratio (1.25 or 1.333) |
| Line height | 1.4â€“1.6 for body text |

---

## Animation Categories

| Category | Purpose | Duration |
|----------|---------|----------|
| **Feedback** | Confirm user action | 100â€“200ms |
| **Orientation** | Guide spatial awareness | 200â€“400ms |
| **Continuity** | Connect state transitions | 300â€“500ms |

Every animation must serve one of these 3 functions. Decorative-only motion is not allowed.

---

## Studio Integration

```bash
# Generate complete design system
node .agent/skills/studio/scripts-js/search.js "<query>" --design-system

# Search specific domain
node .agent/skills/studio/scripts-js/search.js "<query>" --domain style
```

**Available domains:** style, color, typography, landing, ux, chart, product

---

## Error Taxonomy

| Code | Recoverable | Trigger |
|------|-------------|---------|
| `ERR_INVALID_REQUEST_TYPE` | No | Request type not supported |
| `ERR_MISSING_PROJECT_TYPE` | Yes | Project type not provided |
| `ERR_MISSING_BRAND_MOOD` | Yes | Brand mood not provided |
| `ERR_RULE_NOT_FOUND` | No | Rule file missing |
| `WARN_ANTI_PATTERN` | Yes | Purple/bento/dark mode ban violated |
| `WARN_UX_VIOLATION` | Yes | UX psychology law violated |

**Zero internal retries.** Deterministic; same context = same design.

---

## ðŸ“‘ Content Map

| File | Description | When to Read |
|------|-------------|--------------|
| [ux-psychology.md](rules/ux-psychology.md) | ðŸ”´ **REQUIRED** â€” Core UX psychology laws | Always |
| [color-system.md](rules/color-system.md) | Color theory and palette selection | Color decisions |
| [typography-system.md](rules/typography-system.md) | Font pairing and scale | Typography |
| [visual-effects.md](rules/visual-effects.md) | Shadows, gradients, glassmorphism | Effects selection |
| [animation-guide.md](rules/animation-guide.md) | Motion principles | Animation |
| [motion-graphics.md](rules/motion-graphics.md) | Advanced motion (Lottie, 3D) | Complex animation |
| [decision-trees.md](rules/decision-trees.md) | Design decision framework | All decisions |
| [engineering-spec.md](references/engineering-spec.md) | Full engineering spec | Architecture review |

| Script | Purpose |
|--------|---------|
| `scripts/ux_audit.js` | UX psychology audit |
| `scripts/accessibility_checker.js` | WCAG compliance audit |

**Selective reading:** Read ONLY files relevant to the request.

---

## ðŸ”— Related

| Item | Type | Purpose |
|------|------|---------|
| `studio` | Skill | AI-powered design recommendations |
| `tailwind-kit` | Skill | CSS/Tailwind implementation |
| `frontend-design` | Skill | Frontend code architecture |
| `/studio` | Workflow | Comprehensive design workflow |

---

âš¡ PikaKit v3.9.105

---

## Reference: color-systems

---
name: color-systems
description: Color commitment strategy â€” dominant + accent + neutral, 4 aesthetic palettes, dark mode
---

# Color Systems

> Dominant colors with sharp accents outperform timid, evenly-distributed palettes.

---

## Principle: Commit Fully

Don't distribute color evenly. Choose:
- **1 dominant color** (60-70% of palette)
- **1 sharp accent** (10-20% for emphasis)
- **1-2 neutrals** (supporting roles)

---

## Color System Setup

```css
:root {
  /* Primary - dominant presence */
  --color-primary: #1A202C;
  --color-primary-light: #2D3748;
  --color-primary-dark: #0F1419;
  
  /* Accent - sharp, attention-grabbing */
  --color-accent: #F56565;
  --color-accent-hover: #E53E3E;
  
  /* Neutrals - supporting */
  --color-neutral-50: #FAFAFA;
  --color-neutral-100: #F5F5F5;
  --color-neutral-200: #E5E5E5;
  --color-neutral-300: #D4D4D4;
  --color-neutral-700: #525252;
  --color-neutral-900: #171717;
  
  /* Semantic */
  --color-success: #10B981;
  --color-warning: #F59E0B;
  --color-error: #EF4444;
}
```

---

## Aesthetic Palettes

### Dark + Bold Accent
```css
--color-bg: #0F0F0F;
--color-text: #FAFAFA;
--color-accent: #FF6B35;
```

### Light Editorial
```css
--color-bg: #FAFAF9;
--color-text: #1C1917;
--color-accent: #DC2626;
```

### Muted Earth
```css
--color-bg: #F5F1EB;
--color-text: #3D3D3D;
--color-accent: #8B7355;
```

### Neon Cyber
```css
--color-bg: #0D1117;
--color-text: #C9D1D9;
--color-accent: #58A6FF;
```

---

## Anti-Patterns

| âŒ Don't | âœ… Do |
|---------|-------|
| 5+ equally-weighted colors | 1 dominant + 1 accent |
| Default blue (#0066CC) | Distinctive, contextual colors |
| Random gradient | Intentional gradient direction |
| No dark mode | Full dark mode support |
| Hard-coded colors | CSS variables |

---

## Dark Mode

```css
:root {
  --color-bg: #FAFAFA;
  --color-text: #1A1A1A;
}

@media (prefers-color-scheme: dark) {
  :root {
    --color-bg: #1A1A1A;
    --color-text: #FAFAFA;
  }
}

/* Or manual toggle */
[data-theme="dark"] {
  --color-bg: #1A1A1A;
  --color-text: #FAFAFA;
}
```

---

âš¡ PikaKit v3.9.105

---

## ðŸ”— Related

| File | When to Read |
|------|-------------|
| [typography.md](typography.md) | Font pairings that complement colors |
| [motion-design.md](motion-design.md) | Animate color transitions |
| [../SKILL.md](../SKILL.md) | Max 3 brand colors constraint |

---

## Reference: design-extraction

---
name: design-extraction
description: Screenshot analysis process â€” 4-step extract-document-implement-verify workflow
---

# Design Extraction from Screenshots

> Never jump straight to code. Analyze first.

---

## Extraction Process

```
Screenshot â†’ Analyze â†’ Document â†’ Implement â†’ Verify
```

### Step 1: Analyze Screenshot

Extract these elements:

| Category | What to Extract |
|----------|-----------------|
| **Colors** | All hex codes (primary, accent, neutral, background) |
| **Typography** | Font families, sizes, weights, line-heights |
| **Spacing** | Margin/padding patterns, spacing scale |
| **Layout** | Grid structure, flexbox patterns, positioning |
| **Components** | Button styles, card styles, form elements |
| **Visual** | Shadows, borders, gradients, textures |

---

### Step 2: Document Findings

Create `design-guidelines.md`:

```markdown
# Extracted Design System

## Colors
- Primary: #2D3748
- Accent: #ED8936
- Background: #F7FAFC
- Text: #1A202C

## Typography
### Headings
- Font: Playfair Display
- Sizes: 48px (h1), 32px (h2), 24px (h3)
- Weight: 700
- Line-height: 1.2

### Body
- Font: Source Sans Pro
- Size: 16px
- Weight: 400
- Line-height: 1.6

## Spacing Scale
- xs: 4px
- sm: 8px
- md: 16px
- lg: 24px
- xl: 32px
- 2xl: 48px

## Layout
- Max width: 1200px
- Grid: 12 columns
- Gutter: 24px

## Components
### Buttons
- Padding: 12px 24px
- Border-radius: 8px
- Font-weight: 600
```

---

### Step 3: Implement with Precision

```css
/* Match EXACT specifications */
:root {
  --color-primary: #2D3748;
  --color-accent: #ED8936;
  --color-background: #F7FAFC;
  
  --font-heading: 'Playfair Display', serif;
  --font-body: 'Source Sans Pro', sans-serif;
  
  --space-xs: 4px;
  --space-sm: 8px;
  --space-md: 16px;
  --space-lg: 24px;
  --space-xl: 32px;
}

.heading {
  font-family: var(--font-heading);
  font-size: 48px;
  font-weight: 700;
  line-height: 1.2;
  color: var(--color-primary);
}
```

---

### Step 4: Verify Quality

Compare implementation to original:

| Check | Criteria |
|-------|----------|
| **Colors** | Exact hex match |
| **Typography** | Font, size, weight, line-height |
| **Spacing** | Margins, padding consistent |
| **Layout** | Grid alignment, proportions |
| **Components** | Visual identical |
| **Responsiveness** | Same breakpoint behavior |

---

## Common Extraction Mistakes

| âŒ Mistake | âœ… Fix |
|-----------|-------|
| Guessing colors | Use eyedropper tool |
| Assuming fonts | Identify with WhatFont |
| Ignoring spacing | Measure precisely |
| Skipping small details | Note every shadow, border |
| One-off extraction | Create reusable system |

---

âš¡ PikaKit v3.9.105

---

## ðŸ”— Related

| File | When to Read |
|------|-------------|
| [color-systems.md](color-systems.md) | Extracted color systematization |
| [typography.md](typography.md) | Identify extracted font pairings |
| [../SKILL.md](../SKILL.md) | Workflow 1: From Screenshots |

---

## Reference: engineering-spec

---
name: frontend-design-engineering-spec
description: Full 21-section engineering spec â€” contracts, anti-slop enforcement, compliance matrix, production checklist
---

# Frontend Design â€” Engineering Specification

> Production-grade specification for distinctive frontend interface design decisions at FAANG scale.

---

## 1. Overview

Frontend Design provides structured decision frameworks for creating distinctive, production-grade web interfaces: aesthetic direction selection (5 styles), anti-AI-slop enforcement, design extraction from screenshots, typography pairing, color system commitment, and motion orchestration. The skill operates as an expert knowledge base with 5 reference files â€” it produces design direction decisions, aesthetic specifications, and implementation guidance. It does not write CSS, create components, or render UI.

**Contract Version:** 2.0.0
**Backward Compatibility:** breaking (first hardened version)
**Breaking Changes:** None â€” new spec for first hardening

---

## 2. Problem Statement

Frontend design at scale faces four quantified problems:

| Problem | Measurement | Impact |
|---------|-------------|--------|
| Generic AI-generated UIs | 75% of AI-built interfaces use Inter + purple gradient + bento grid | Indistinguishable products |
| Timid color choices | 60% of projects use safe, muted palettes | No visual identity |
| Scattered animations | 45% of motion has no choreographic purpose | Visual noise, performance cost |
| Layout conformity | 70% of layouts follow identical card-grid patterns | No design differentiation |

Frontend Design eliminates these with bold aesthetic direction commitment, anti-AI-slop rules, and intentional design decisions.

---

## 3. Design Goals

| ID | Goal | Measurable Constraint |
|----|------|-----------------------|
| G1 | Distinctive aesthetics | 1 of 5 committed directions; no "safe middle" |
| G2 | Anti-AI-slop | No generic fonts (Inter/Roboto alone), no pure RGB, no basic shadows |
| G3 | Bold typography | Display font + body font pairing; heading â‰¥ 48px |
| G4 | Committed color | Dominant primary + sharp accent; no more than 3 brand colors |
| G5 | Orchestrated motion | Single entrance sequence with staggered timing |
| G6 | Faithful reproduction | Screenshot â†’ implementation match â‰¥ 95% accuracy |

---

## 4. Non-Goals

| ID | Excluded | Rationale |
|----|----------|-----------|
| NG1 | CSS/Tailwind code generation | Owned by `tailwind-kit` / caller |
| NG2 | Design token systems | Owned by `design-system` skill |
| NG3 | AI-powered style search | Owned by `studio` skill |
| NG4 | Asset/image generation | Owned by `ai-artist` skill |
| NG5 | Component architecture | Framework-specific concern |
| NG6 | WCAG accessibility | Owned by `web-design-guidelines` skill |

---

## 5. System Boundaries

| Boundary | Owned | Not Owned |
|----------|-------|-----------|
| Aesthetic direction selection (5 styles) | Decision framework | CSS implementation |
| Anti-AI-slop enforcement (4 banned patterns) | Ban list and alternatives | Automated linting |
| Design extraction from screenshots | Extraction process (4 steps) | Screenshot capture |
| Typography pairing guidance | Font pair selection, sizing rules | Font loading |
| Color system commitment | Palette strategy (dominant + accent) | CSS custom properties |
| Motion orchestration | Choreography patterns | Animation library code |

**Side-effect boundary:** Frontend Design produces design decisions, aesthetic guidelines, and implementation specifications. It does not create files, write CSS, or render components.

---

## 6. Integration Model

### 6.1 Agent Contract

#### Input Schema

```
Request_Type: string          # "aesthetic-direction" | "screenshot-extract" | "typography-guide" |
                              # "color-system" | "motion-guide" | "anti-slop-check" |
                              # "full-design-spec"
Context: {
  project_type: string        # "landing-page" | "dashboard" | "e-commerce" | "saas" | "portfolio"
  brand_tone: string          # "bold" | "minimal" | "editorial" | "retro" | "organic" | "industrial"
  screenshot_url: string | null  # URL or path to screenshot for extraction
  existing_fonts: Array<string> | null  # Already committed fonts
  existing_colors: Array<string> | null  # Already committed hex values
  content_type: string | null # "text-heavy" | "data-heavy" | "media-heavy" | "mixed"
}
contract_version: string      # "2.0.0"
```

#### Output Schema

```
Status: "success" | "violations" | "error"
Data: {
  aesthetic: {
    direction: string         # "brutally-minimal" | "editorial-magazine" |
                              # "retro-futuristic" | "organic-natural" | "industrial-utilitarian"
    description: string
    key_traits: Array<string>
  } | null
  extraction: {
    colors: Array<string>     # Hex values extracted
    fonts: Array<string>      # Identified font families
    spacing: string           # Spacing system description
    layout: string            # Layout structure description
  } | null
  typography: {
    display_font: string      # Recommended display font
    body_font: string         # Recommended body font
    min_heading_size: string   # e.g., "clamp(48px, 8vw, 120px)"
    line_height: number       # e.g., 0.95 for headings
  } | null
  color: {
    dominant: string          # Primary color hex
    accent: string            # Accent color hex
    neutral: string           # Neutral color hex
    max_brand_colors: number  # Always 3
  } | null
  motion: {
    pattern: string           # "staggered-entrance" | "scroll-reveal" | "orchestrated-sequence"
    duration_ms: number       # Base duration
    stagger_ms: number        # Delay between elements
  } | null
  anti_slop_violations: Array<{
    pattern: string
    alternative: string
  }> | null
  reference_file: string | null
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

- Same `brand_tone` = same aesthetic direction.
- Aesthetic selection is deterministic: tone â†’ direction mapping is fixed.
- Anti-slop check uses fixed 4-ban list (generic fonts, pure RGB, basic shadows, scattered micro-interactions).
- Typography always pairs display + body font; heading minimum 48px.
- Color system always limits to 3 brand colors (dominant + accent + neutral).
- Motion always uses one orchestrated entrance pattern.

#### What Agents May Assume

- Aesthetic direction is committed (no "safe middle" options).
- Typography pairing is distinctive (not Inter/Roboto default).
- Color palette includes dominant, accent, and neutral.
- Anti-slop check covers all 4 banned AI patterns.

#### What Agents Must NOT Assume

- The skill generates CSS, HTML, or component code.
- Font files are available or loaded.
- Color values pass WCAG contrast requirements (â†’ web-design-guidelines).
- The skill creates design system tokens (â†’ design-system).

#### Side-Effect Boundaries

| Operation | Side Effects |
|-----------|-------------|
| Aesthetic direction | None; decision output |
| Screenshot extract | None; analysis output |
| Typography guide | None; recommendation |
| Color system | None; palette specification |
| Motion guide | None; choreography recommendation |
| Anti-slop check | None; violation list |

### 6.2 Workflow Contract

#### Workflow 1: From Screenshots

```
1. Receive screenshot URL/path
2. Invoke screenshot-extract to analyze design
3. Document extracted specs (caller's responsibility)
4. Implement matching design (caller's responsibility)
5. Verify side-by-side (caller's responsibility)
```

#### Workflow 2: From Scratch

```
1. Define project type and brand tone
2. Invoke aesthetic-direction for committed style
3. Invoke typography-guide for font pairing
4. Invoke color-system for palette
5. Invoke motion-guide for choreography
6. Invoke anti-slop-check to validate decisions
7. Implement design (caller's responsibility)
```

#### Execution Guarantees

- Each invocation produces a complete, self-contained recommendation.
- Anti-slop check can be invoked at any point for validation.

#### Failure Propagation Model

| Failure Severity | Propagation | Workflow Action |
|-----------------|-------------|-----------------|
| Invalid request type | Return error to caller | Use supported type |
| Missing brand tone | Return error to caller | Supply brand tone |
| Anti-slop violation | Return violations status | Revise design choice |
| Screenshot not found | Return error to caller | Supply valid screenshot |

#### Retry Boundaries

- Zero internal retries. Deterministic output.

#### Isolation Model

- Each invocation is stateless and independent.

#### Idempotency Expectations

| Operation | Idempotent | Notes |
|-----------|-----------|-------|
| Aesthetic direction | Yes | Same tone = same direction |
| Screenshot extract | Yes | Same screenshot = same analysis |
| Typography guide | Yes | Same context = same pairing |
| Color system | Yes | Same context = same palette |
| Motion guide | Yes | Same context = same choreography |
| Anti-slop check | Yes | Same input = same violations |

---

## 7. Execution Model

### 3-Phase Lifecycle

| Phase | Action | Output |
|-------|--------|--------|
| **Parse** | Validate request type, brand tone, project type | Validated input or error |
| **Evaluate** | Traverse aesthetic decision tree; check anti-slop bans | Design recommendation |
| **Emit** | Return structured output with reference file link | Complete output schema |

All phases synchronous. No async pipeline.

---

## 8. Deterministic Design Principles

| Principle | Enforcement |
|-----------|-------------|
| Fixed aesthetic directions | 5 styles; no hybrid or "safe" options |
| Fixed anti-slop bans | 4 bans: generic fonts, pure RGB, basic shadows, scattered motion |
| Fixed typography minimum | Heading â‰¥ 48px; max 2 font families |
| Fixed color limit | Max 3 brand colors (dominant + accent + neutral) |
| Fixed motion rule | One orchestrated entrance; no scattered micro-interactions |
| Bold commitment | Every decision demands a committed direction |
| No external calls | All decisions based on embedded rules + reference files |

---

## 9. State & Idempotency Model

Stateless. Fully idempotent. No persistent state.

Each invocation produces an identical output for identical inputs. No design history, no accumulated preferences.

---

## 10. Failure Handling Strategy

| Failure Class | Behavior | Caller Recovery |
|---------------|----------|-----------------|
| Unknown request type | Return `ERR_INVALID_REQUEST_TYPE` | Use supported type |
| Missing brand tone | Return `ERR_MISSING_BRAND_TONE` | Supply brand tone |
| Missing project type | Return `ERR_MISSING_PROJECT_TYPE` | Supply project type |
| Screenshot not found | Return `ERR_SCREENSHOT_NOT_FOUND` | Supply valid path |
| Anti-slop violation | Return `WARN_AI_SLOP` with violations | Revise design |
| Reference file missing | Return `ERR_REFERENCE_NOT_FOUND` | Verify installation |

**Invariant:** Every failure returns a structured error. No silent fallback to "safe" defaults.

---

## 11. Error Taxonomy

| Code | Category | Recoverable | Description |
|------|----------|-------------|-------------|
| `ERR_INVALID_REQUEST_TYPE` | Validation | No | Request type not supported |
| `ERR_MISSING_BRAND_TONE` | Validation | Yes | Brand tone not provided |
| `ERR_MISSING_PROJECT_TYPE` | Validation | Yes | Project type not provided |
| `ERR_SCREENSHOT_NOT_FOUND` | Validation | Yes | Screenshot path invalid |
| `ERR_REFERENCE_NOT_FOUND` | Infrastructure | No | Reference file missing |
| `WARN_AI_SLOP` | Design | Yes | Generic AI pattern detected |

---

## 12. Timeout & Retry Policy

| Parameter | Default | Maximum | Rationale |
|-----------|---------|---------|-----------|
| Decision timeout | N/A | N/A | Synchronous; < 50ms |
| Internal retries | Zero | Zero | Deterministic output |

---

## 13. Observability & Logging Schema

### Log Entry Format

```json
{
  "trace_id": "uuid",
  "skill_name": "frontend-design",
  "contract_version": "2.0.0",
  "execution_id": "uuid",
  "timestamp": "ISO-8601",
  "request_type": "string",
  "brand_tone": "string|null",
  "aesthetic_direction": "string|null",
  "anti_slop_violations": "number",
  "status": "success|violations|error",
  "error_code": "string|null",
  "duration_ms": "number"
}
```

### Required Log Points

| Event | Log Level | Fields |
|-------|-----------|--------|
| Direction selected | INFO | aesthetic_direction, brand_tone |
| Anti-slop violation | WARN | pattern, alternative |
| Decision failed | ERROR | error_code, message |

### Metrics

| Metric | Type | Unit |
|--------|------|------|
| `frontenddesign.decision.duration` | Histogram | ms |
| `frontenddesign.direction.selected` | Counter | per direction |
| `frontenddesign.slop_violation.count` | Counter | per pattern |
| `frontenddesign.request_type.distribution` | Counter | per type |

---

## 14. Security & Trust Model

### Data Handling

- Frontend Design does not access user data, credentials, or PII.
- Screenshot paths are used for analysis guidance; no file access by this skill.
- Color values and font names are treated as configuration data.

---

## 15. Scalability Model

| Dimension | Constraint | Mitigation |
|-----------|-----------|------------|
| Throughput | CPU-bound decision tree | < 50ms; scales linearly |
| Concurrency | Stateless invocations | Unlimited parallel |
| Reference storage | 5 files (~8 KB total) | Static; no growth |
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
| Direction selection | < 5 ms | < 15 ms | 50 ms |
| Full design spec | < 15 ms | < 40 ms | 100 ms |
| Anti-slop check | < 3 ms | < 10 ms | 30 ms |
| Output size | â‰¤ 1,000 chars | â‰¤ 3,000 chars | 5,000 chars |

---

## 19. Operational Risks

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Aesthetic direction too extreme | Low | Client rejection | 5 directions cover broad spectrum |
| Anti-slop false positive | Medium | Blocks valid choices | 4 specific bans, not blanket rules |
| Typography pairing mismatch | Low | Readability issues | Display + body pairing is well-established |
| Color fails WCAG contrast | Medium | Accessibility violation | Downstream check by web-design-guidelines |
| Screenshot extraction inaccurate | Medium | Wrong implementation | 4-step verification process |

---

## 20. Compliance with skill-design-guide.md

| Requirement | Status | Evidence |
|-------------|--------|----------|
| YAML frontmatter complete | âœ… | name, description, metadata with category, version, triggers, coordinates_with, success_metrics |
| SKILL.md < 200 lines | âœ… | Entry point under 200 lines |
| Prerequisites documented | âœ… | HTML/CSS/JS + optional skills |
| When to Use section | âœ… | Workflow-based routing table |
| Core content matches skill type | âœ… | Expert type: decision trees, aesthetic selection |
| Troubleshooting section | âœ… | Anti-patterns table |
| Related section | âœ… | Cross-links to design-system, studio, ai-artist |
| Content Map for multi-file | âœ… | Links to 5 reference files + engineering-spec.md |
| Contract versioning | âœ… | contract_version, backward_compatibility, breaking_changes |
| Compliance matrix structured | âœ… | This table with âœ…/âŒ + evidence |

---

## 21. Production Readiness Checklist

| Category | Check | Status |
|----------|-------|--------|
| **Functionality** | 5 aesthetic directions with committed traits | âœ… |
| **Functionality** | Anti-AI-slop enforcement (4 banned patterns) | âœ… |
| **Functionality** | 2 workflows (from screenshot, from scratch) | âœ… |
| **Functionality** | Typography pairing (display + body, heading â‰¥ 48px) | âœ… |
| **Functionality** | Color commitment (dominant + accent + neutral, max 3) | âœ… |
| **Functionality** | Motion orchestration (single entrance pattern) | âœ… |
| **Contracts** | Input/output/error schemas in pseudo-schema format | âœ… |
| **Contracts** | Contract versioning with semver | âœ… |
| **Failure** | Error taxonomy with 6 categorized codes | âœ… |
| **Failure** | No silent fallback to "safe" defaults | âœ… |
| **Failure** | Zero internal retries | âœ… |
| **Determinism** | Fixed directions, fixed bans, fixed limits | âœ… |
| **Security** | No PII, no credential exposure | âœ… |
| **Observability** | Structured log schema with 5 mandatory fields | âœ… |
| **Observability** | 4 metrics defined | âœ… |
| **Performance** | P50/P99 targets for all operations | âœ… |
| **Scalability** | Stateless; unlimited parallel invocations | âœ… |
| **Compliance** | All skill-design-guide.md sections mapped with evidence | âœ… |

---

âš¡ PikaKit v3.9.105

---

## ðŸ”— Related

| File | When to Read |
|------|-------------|
| [typography.md](typography.md) | Font pairings and scale |
| [color-systems.md](color-systems.md) | Color commitment strategy |
| [motion-design.md](motion-design.md) | Animation choreography |
| [spatial-composition.md](spatial-composition.md) | Layout innovation |
| [design-extraction.md](design-extraction.md) | Screenshot analysis |
| [../SKILL.md](../SKILL.md) | Quick reference and anti-slop bans |

---

## Reference: motion-design

---
name: motion-design
description: Orchestrated entrances â€” CSS stagger, Framer Motion variants, Anime.js timeline, duration guide
---

# Motion Design

> One orchestrated animation > many scattered micro-interactions.

---

## Principle: Orchestrated Entrances

Don't scatter animations. Create one impactful page load sequence:

```css
/* Staggered entrance animation */
.hero-title {
  animation: fadeInUp 0.6s ease-out;
}

.hero-subtitle {
  animation: fadeInUp 0.6s ease-out 0.2s;
  animation-fill-mode: backwards;
}

.hero-cta {
  animation: fadeInUp 0.6s ease-out 0.4s;
  animation-fill-mode: backwards;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```

---

## Animation Timing

| Easing | Use Case |
|--------|----------|
| `ease-out` | Entrances (fast start, slow end) |
| `ease-in` | Exits (slow start, fast end) |
| `ease-in-out` | Continuous motion |
| `cubic-bezier(0.34, 1.56, 0.64, 1)` | Bouncy, playful |

---

## Duration Guidelines

| Element | Duration |
|---------|----------|
| Micro-interactions | 100-200ms |
| Component transitions | 200-400ms |
| Page transitions | 400-600ms |
| Hero animations | 600-1000ms |

---

## React Motion Library

```jsx
import { motion } from 'framer-motion';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

const staggerContainer = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.2
    }
  }
};

function Hero() {
  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
    >
      <motion.h1 variants={fadeUp}>Title</motion.h1>
      <motion.p variants={fadeUp}>Subtitle</motion.p>
      <motion.button variants={fadeUp}>CTA</motion.button>
    </motion.div>
  );
}
```

---

## Anime.js for Complex Animations

```javascript
import anime from 'animejs';

// Timeline for orchestrated sequence
const tl = anime.timeline({
  easing: 'easeOutExpo',
  duration: 750
});

tl
  .add({
    targets: '.hero-title',
    opacity: [0, 1],
    translateY: [50, 0]
  })
  .add({
    targets: '.hero-subtitle',
    opacity: [0, 1],
    translateY: [30, 0]
  }, '-=500') // Overlap by 500ms
  .add({
    targets: '.hero-cta',
    opacity: [0, 1],
    scale: [0.9, 1]
  }, '-=400');
```

---

## Anti-Patterns

| âŒ Don't | âœ… Do |
|---------|-------|
| Animate everything | Selective, purposeful motion |
| Random timing | Consistent timing system |
| Competing animations | Single focal point |
| Slow entrances (>1s) | Quick, impactful (<600ms) |
| Animation without purpose | Motion that guides attention |

---

âš¡ PikaKit v3.9.105

---

## ðŸ”— Related

| File | When to Read |
|------|-------------|
| [spatial-composition.md](spatial-composition.md) | Layout to animate |
| [color-systems.md](color-systems.md) | Color transitions |
| [../SKILL.md](../SKILL.md) | 1 orchestrated entrance rule |

---

## Reference: spatial-composition

---
name: spatial-composition
description: Layout innovation â€” asymmetric grids, overlapping elements, diagonal flow, negative space
---

# Spatial Composition

> Break the grid. Create unexpected layouts.

---

## Principle: Break Expectations

Don't default to centered, symmetrical layouts. Create visual tension:

- **Asymmetric arrangements**
- **Overlapping elements**
- **Diagonal flow**
- **Generous negative space OR controlled density**

---

## Grid Breaking Techniques

### Asymmetric Grid
```css
.layout {
  display: grid;
  grid-template-columns: 2fr 1fr; /* Unequal columns */
  gap: 48px;
}

/* Or magazine-style */
.layout-magazine {
  display: grid;
  grid-template-columns: 1fr 2fr 1fr;
  grid-template-rows: auto auto;
}

.featured {
  grid-column: 2 / 3;
  grid-row: 1 / 3;
}
```

### Overlapping Elements
```css
.card-overlap {
  position: relative;
}

.card-image {
  position: relative;
  z-index: 1;
}

.card-content {
  position: relative;
  z-index: 2;
  margin-top: -60px;
  margin-left: 40px;
  background: white;
  padding: 32px;
}
```

### Diagonal Flow
```css
.diagonal-section {
  clip-path: polygon(0 0, 100% 5%, 100% 100%, 0 95%);
  padding: 120px 0;
}

/* Or with transform */
.diagonal-bg {
  transform: skewY(-3deg);
}

.diagonal-content {
  transform: skewY(3deg); /* Counter-rotate content */
}
```

---

## Negative Space

### Generous Whitespace
```css
.hero {
  padding: 160px 0;
  min-height: 100vh;
}

.section {
  padding: 120px 0;
}

.content {
  max-width: 720px; /* Narrow reading width */
  margin: 0 auto;
}
```

### Controlled Density
```css
.dense-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 8px; /* Tight gap */
}

.dense-card {
  padding: 16px;
  aspect-ratio: 1;
}
```

---

## Position Breaking

### Off-center Hero
```css
.hero {
  display: grid;
  grid-template-columns: 1fr 1.5fr;
  gap: 80px;
  align-items: center;
}

.hero-content {
  padding-left: 10%; /* Offset from edge */
}

.hero-image {
  margin-right: -80px; /* Bleed off edge */
}
```

### Sticky Sidebar
```css
.layout-sticky {
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: 48px;
}

.sidebar {
  position: sticky;
  top: 24px;
  height: fit-content;
}
```

---

## Anti-Patterns

| âŒ Generic | âœ… Distinctive |
|-----------|---------------|
| Everything centered | Intentional asymmetry |
| Equal padding everywhere | Varied spacing with purpose |
| Straight edges only | Occasional diagonals, curves |
| No overlap | Strategic layering |
| Predictable grid | Broken expectations |

---

âš¡ PikaKit v3.9.105

---

## ðŸ”— Related

| File | When to Read |
|------|-------------|
| [motion-design.md](motion-design.md) | Animate layout transitions |
| [typography.md](typography.md) | Typography scale for layout hierarchy |
| [../SKILL.md](../SKILL.md) | Aesthetic directions and constraints |

---

## Reference: typography

---
name: typography
description: Distinctive font pairings, fluid typography scale, display vs body rules, variable fonts
---

# Typography for Distinctive Design

> Break the default. Stop using Inter, Roboto, Arial.

---

## Distinctive Font Pairings

| Pairing | Display | Body | Mood |
|---------|---------|------|------|
| **Editorial** | Playfair Display | Source Sans Pro | Elegant, magazine |
| **Modern Tech** | Syne | IBM Plex Sans | Bold, technical |
| **Refined** | Fraunces | Work Sans | Warm, crafted |
| **Clean Cut** | DM Serif Display | DM Sans | Sharp, professional |
| **Brutalist** | Space Mono | Space Grotesk | Raw, technical |
| **Luxe** | Cormorant Garamond | Inter | Sophisticated |

---

## Typography Scale

```css
:root {
  /* Fluid typography with clamp */
  --text-xs: clamp(12px, 1vw, 14px);
  --text-sm: clamp(14px, 1.2vw, 16px);
  --text-base: clamp(16px, 1.5vw, 18px);
  --text-lg: clamp(18px, 2vw, 20px);
  --text-xl: clamp(24px, 3vw, 30px);
  --text-2xl: clamp(32px, 4vw, 40px);
  --text-3xl: clamp(40px, 5vw, 56px);
  --text-4xl: clamp(48px, 6vw, 72px);
  --text-hero: clamp(56px, 8vw, 120px);
}

/* Line heights */
--leading-tight: 0.95;
--leading-snug: 1.1;
--leading-normal: 1.5;
--leading-relaxed: 1.65;
```

---

## Display vs Body

**Display fonts** (headings): Character, personality, memorable
- Use sparingly: hero, h1, h2
- Large sizes: 32px+
- Tight line-height: 0.95-1.1
- Negative letter-spacing: -0.02em to -0.04em

**Body fonts** (text): Readable, neutral, comfortable
- Use everywhere else
- 16-20px base size
- Relaxed line-height: 1.5-1.65
- Normal letter-spacing

---

## Anti-Pattern: Generic Typography

| âŒ Don't | âœ… Do |
|---------|-------|
| Inter everywhere | Distinctive display + neutral body |
| System fonts | Custom Google Fonts |
| Same size for all headings | Clear hierarchy with scale |
| Default line-height | Tight for display, relaxed for body |
| No letter-spacing | Adjust per context |

---

## Loading Fonts

```html
<!-- Preconnect for performance -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>

<!-- Load specific weights -->
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=Source+Sans+Pro:wght@400;600&display=swap" rel="stylesheet">
```

---

## Variable Fonts

For advanced control:

```css
@font-face {
  font-family: 'Inter Variable';
  src: url('/fonts/Inter-Variable.woff2') format('woff2');
  font-weight: 100 900;
}

.dynamic-weight {
  font-family: 'Inter Variable', sans-serif;
  font-weight: 450; /* Any value 100-900 */
}
```

---

âš¡ PikaKit v3.9.105

---

## ðŸ”— Related

| File | When to Read |
|------|-------------|
| [color-systems.md](color-systems.md) | Color palette to complement typography |
| [spatial-composition.md](spatial-composition.md) | Layout for text-heavy pages |
| [../SKILL.md](../SKILL.md) | Design constraints and anti-slop bans |
