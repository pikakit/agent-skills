---
name: mobile-first
description: >-
  Mobile development orchestrator for iOS and Android. Routes to framework-specific patterns
  (React Native, Flutter, Native) and publishing strategies (ASO, deep linking, push).
  Triggers on: mobile, responsive, touch, React Native, Flutter, iOS, Android.
  Coordinates with: mobile-developer, design-system, perf-optimizer.
metadata:
  version: "2.0.0"
  category: "mobile-games"
  triggers: "mobile, responsive, touch, React Native, Flutter, iOS, Android"
  success_metrics: "sub-skill routed, must-ask answered, audit passed"
  coordinates_with: "mobile-developer, mobile-design, design-system, perf-optimizer"
---

# Mobile First — Mobile Development Orchestrator

> Routes to framework + publishing sub-skills. 4 must-ask questions. Selective loading.

**Core Principle:** Mobile is NOT a small desktop. Ask platform first.

---

## When to Use

| Situation | Action |
|-----------|--------|
| Building mobile app | Route through decision tree |
| React Native / Flutter / Native | Route to framework sub-skill |
| Publishing to stores | Route to publishing sub-skill |
| Mobile UX audit | Run audit script |

---

## System Boundaries

| Owned by This Skill | NOT Owned |
|---------------------|-----------|
| Sub-skill routing (6 sub-skills) | Implementation (→ mobile-developer) |
| Framework decision tree (5 branches) | Design decisions (→ mobile-design) |
| 4 must-ask questions | Performance profiling (→ perf-optimizer) |
| Runtime audit script | Design system (→ design-system) |

**Orchestrator skill:** Routes to sub-skills. Does not implement.

---

## ⚠️ 4 Must-Ask Questions (Before Routing)

| # | Aspect | Question |
|---|--------|----------|
| 1 | **Platform** | iOS, Android, or both? |
| 2 | **Framework** | React Native, Flutter, or native? |
| 3 | **Navigation** | Tab bar, drawer, or stack-based? |
| 4 | **Offline** | Does this need to work offline? |

---

## Framework Decision Tree (Deterministic)

```
WHAT ARE YOU BUILDING?
├── OTA updates + rapid iteration → React Native + Expo
│   └── Read: frameworks/react-native.md
├── Pixel-perfect custom UI → Flutter
│   └── Read: frameworks/flutter.md
├── Deep iOS features → SwiftUI
│   └── Read: frameworks/native.md
├── Deep Android features → Kotlin + Compose
│   └── Read: frameworks/native.md
└── Existing codebase → Match current framework
```

---

## State Transitions

```
IDLE → ASKING                [context incomplete]
ASKING → ROUTING             [4 questions answered]
ROUTING → ROUTED             [sub-skill determined]  // terminal
IDLE → AUDITING              [audit invoked]
AUDITING → AUDIT_COMPLETE    [script finished]  // terminal
AUDITING → AUDIT_FAILED      [script error]  // terminal
```

---

## Platform Defaults (Fixed)

| Element | iOS | Android |
|---------|-----|---------|
| Font | SF Pro | Roboto |
| Touch target | 44×44pt | 48×48dp |
| Back navigation | Edge swipe | System back |
| Icons | SF Symbols | Material Symbols |

---

## Runtime Audit

```bash
node .agent/skills/mobile-first/scripts/mobile_audit.js <project_path>
```

Read-only. Does not modify project files.

---

## Error Taxonomy

| Code | Recoverable | Trigger |
|------|-------------|---------|
| `NEEDS_INPUT` | Yes | Must-ask questions not answered |
| `ERR_UNKNOWN_FRAMEWORK` | Yes | Framework not in decision tree |
| `ERR_SUBSKILL_NOT_FOUND` | No | Sub-skill file missing |
| `ERR_PROJECT_NOT_FOUND` | Yes | Audit path not found |
| `ERR_AUDIT_FAILED` | Yes | Audit script error |

---

## Anti-Patterns

| ❌ Don't | ✅ Do |
|---------|-------|
| Load all sub-skills at once | Selective: load only routed file |
| Assume platform choice | Ask must-ask questions first |
| Skip publishing planning | Route to ASO/push/deep-link |
| Apply desktop patterns | Mobile-first constraints |

---

## 📑 Content Map

| File | Type | When to Read |
|------|------|--------------| 
| [frameworks/react-native.md](frameworks/react-native.md) | Sub-skill | RN/Expo selected |
| [frameworks/flutter.md](frameworks/flutter.md) | Sub-skill | Flutter selected |
| [frameworks/native.md](frameworks/native.md) | Sub-skill | SwiftUI/Kotlin selected |
| [publishing/app-store-optimization.md](publishing/app-store-optimization.md) | Sub-skill | ASO needed |
| [publishing/deep-linking.md](publishing/deep-linking.md) | Sub-skill | Deep links needed |
| [publishing/push-notifications.md](publishing/push-notifications.md) | Sub-skill | Push needed |
| [references/decision-trees.md](references/decision-trees.md) | Reference | Framework/state/nav selection |
| [references/mobile-design-thinking.md](references/mobile-design-thinking.md) | Reference | Design process |
| [references/touch-psychology.md](references/touch-psychology.md) | Reference | Touch UX |
| [references/mobile-performance.md](references/mobile-performance.md) | Reference | Performance |
| [references/mobile-navigation.md](references/mobile-navigation.md) | Reference | Navigation architecture |
| [references/mobile-backend.md](references/mobile-backend.md) | Reference | Backend for mobile |
| [references/mobile-color-system.md](references/mobile-color-system.md) | Reference | Color/theme decisions |
| [references/mobile-typography.md](references/mobile-typography.md) | Reference | Typography decisions |
| [references/mobile-testing.md](references/mobile-testing.md) | Reference | Testing strategy |
| [references/mobile-debugging.md](references/mobile-debugging.md) | Reference | Debugging mobile issues |
| [references/platform-ios.md](references/platform-ios.md) | Reference | iOS specifics |
| [references/platform-android.md](references/platform-android.md) | Reference | Android specifics |
| [references/anti-patterns.md](references/anti-patterns.md) | Reference | Quick anti-pattern check |
| [references/engineering-spec.md](references/engineering-spec.md) | Spec | Architecture review |
| [scripts/mobile_audit.js](scripts/mobile_audit.js) | Script | UX audit |

**Selective reading:** Load ONLY the file relevant to current routing decision.

---

## 🔗 Related

| Item | Type | Purpose |
|------|------|---------|
| `/mobile` | Workflow | Mobile workflow |
| `mobile-developer` | Skill | Implementation |
| `mobile-design` | Skill | Design patterns |

---

⚡ PikaKit v3.9.80
