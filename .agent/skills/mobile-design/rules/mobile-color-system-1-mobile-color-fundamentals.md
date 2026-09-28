---
"title": "Mobile Color System: Mobile Color Fundamentals through 3. Dark Mode Design"
"kind": "reference"
"impact": "high"
"tags":
  - "mobile"
  - "color"
  - "system"
"applies_to":
  - "android"
  - "ios"
"last_reviewed": "2026-09-28"
"sources":
  - "title": "Official documentation"
    "url": "https://www.w3.org/WAI/standards-guidelines/wcag/"
---

# Mobile Color System: Mobile Color Fundamentals through 3. Dark Mode Design

## Scope

Apply only to the declared platforms and repository-confirmed versions.

## Guidance

> OLED optimization, dark mode, battery-aware colors, and outdoor visibility.
> **Color on mobile isn't just aesthetics—it's battery life and usability.**

---

## 1. Mobile Color Fundamentals

### Why Mobile Color is Different

```
DESKTOP:                           MOBILE:
├── LCD screens (backlit)          ├── OLED common (self-emissive)
├── Controlled lighting            ├── Outdoor, bright sun
├── Stable power                   ├── Battery matters
├── Personal preference            ├── System-wide dark mode
└── Static viewing                 └── Variable angles, motion
```

### Mobile Color Priorities

| Priority | Why |
|----------|-----|
| **1. Readability** | Outdoor, variable lighting |
| **2. Battery efficiency** | OLED = dark mode saves power |
| **3. System integration** | Dark/light mode support |
| **4. Semantics** | Error, success, warning colors |
| **5. Brand** | After functional requirements |

---

> OLED optimization, dark mode, battery-aware colors, and outdoor visibility.
> **Color on mobile isn't just aesthetics—it's battery life and usability.**

---

## 2. OLED Considerations

### How OLED Differs

```
LCD (Liquid Crystal Display):
├── Backlight always on
├── Black = backlight through dark filter
├── Energy use = constant
└── Dark mode = no battery savings

OLED (Organic LED):
├── Each pixel emits own light
├── Black = pixel OFF (zero power)
├── Energy use = brighter pixels use more
└── Dark mode = significant battery savings
```

### Battery Savings with OLED

```
Color energy consumption (relative):

#000000 (True Black)  ████░░░░░░  0%
#1A1A1A (Near Black)  █████░░░░░  ~15%
#333333 (Dark Gray)   ██████░░░░  ~30%
#666666 (Medium Gray) ███████░░░  ~50%
#FFFFFF (White)       ██████████  100%

Saturated colors also use significant power:
├── Blue pixels: Most efficient
├── Green pixels: Medium
├── Red pixels: Least efficient
└── Desaturated colors save more
```

### True Black vs Near Black

```
#000000 (True Black):
├── Maximum battery savings
├── Can cause "black smear" on scroll
├── Sharp contrast (may be harsh)
└── Used by Apple in pure dark mode

#121212 or #1A1A1A (Near Black):
├── Still good battery savings
├── Smoother scrolling (no smear)
├── Slightly softer on eyes
└── Material Design recommendation

RECOMMENDATION: #000000 for backgrounds, #0D0D0D-#1A1A1A for surfaces
```

---

> OLED optimization, dark mode, battery-aware colors, and outdoor visibility.
> **Color on mobile isn't just aesthetics—it's battery life and usability.**

---

## 3. Dark Mode Design

### Dark Mode Benefits

```
Users enable dark mode for:
├── Battery savings (OLED)
├── Reduced eye strain (low light)
├── Personal preference
├── AMOLED aesthetic
└── Accessibility (light sensitivity)
```

### Dark Mode Color Strategy

```
LIGHT MODE                      DARK MODE
──────────                      ─────────
Background: #FFFFFF      →      #000000 or #121212
Surface:    #F5F5F5      →      #1E1E1E
Surface 2:  #EEEEEE      →      #2C2C2C

Primary:    #1976D2      →      #90CAF9 (lighter)
Text:       #212121      →      #E0E0E0 (not pure white)
Secondary:  #757575      →      #9E9E9E

Elevation in dark mode:
├── Higher = slightly lighter surface
├── 0dp →  0% overlay
├── 4dp →  9% overlay
├── 8dp →  12% overlay
└── Creates depth without shadows
```

### Text Colors in Dark Mode

| Role | Light Mode | Dark Mode |
|------|------------|-----------|
| Primary | #000000 (Black) | #E8E8E8 (Not pure white) |
| Secondary | #666666 | #B0B0B0 |
| Disabled | #9E9E9E | #6E6E6E |
| Links | #1976D2 | #8AB4F8 |

### Color Inversion Rules

```
DON'T just invert colors:
├── Saturated colors become eye-burning
├── Semantic colors lose meaning
├── Brand colors may break
└── Contrast ratios change unpredictably

DO create intentional dark palette:
├── Desaturate primary colors
├── Use lighter tints for emphasis
├── Maintain semantic color meanings
├── Check contrast ratios independently
```

---

## Verification

Cross-check version-sensitive details with the cited official source and verify behavior in the target environment.
