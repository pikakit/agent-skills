---
"title": "Mobile Color System: Outdoor Visibility through 7. Color Accessibility"
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
  - "title": "Material Design 3 Color"
    "url": "https://developer.android.com/design/ui/mobile/guides/styles/color"
  - "title": "Apple HIG Color"
    "url": "https://developer.apple.com/design/human-interface-guidelines/color"
---

# Mobile Color System: Outdoor Visibility through 7. Color Accessibility

## Scope

Apply only to the declared platforms and repository-confirmed versions.

## Guidance

> OLED optimization, dark mode, battery-aware colors, and outdoor visibility.
> **Color on mobile isn't just aesthetics—it's battery life and usability.**

---

## 4. Outdoor Visibility

### The Sunlight Problem

```
Screen visibility outdoors:
├── Bright sun washes out low contrast
├── Glare reduces readability
├── Polarized sunglasses affect
└── Users shield screen with hand

Affected elements:
├── Light gray text on white
├── Subtle color differences
├── Low opacity overlays
└── Pastel colors
```

### High Contrast Strategies

```
For outdoor visibility:

MINIMUM CONTRAST RATIOS:
├── Normal text: 4.5:1 (WCAG AA)
├── Large text: 3:1 (WCAG AA)
├── Recommended: 7:1+ (AAA)

AVOID:
├── #999 on #FFF (fails AA)
├── #BBB on #FFF (fails)
├── Pale colors on light backgrounds
└── Subtle gradients for critical info

DO:
├── Use system semantic colors
├── Test in bright environment
├── Provide high contrast mode
└── Use solid colors for critical UI
```

---

> OLED optimization, dark mode, battery-aware colors, and outdoor visibility.
> **Color on mobile isn't just aesthetics—it's battery life and usability.**

---

## 5. Semantic Colors

### Consistent Meaning

| Semantic | Meaning | iOS Default | Android Default |
|----------|---------|-------------|-----------------|
| Error | Problems, destruction | #FF3B30 | #B3261E |
| Success | Completion, positive | #34C759 | #4CAF50 |
| Warning | Attention, caution | #FF9500 | #FFC107 |
| Info | Information | #007AFF | #2196F3 |

### Semantic Color Rules

```
NEVER use semantic colors for:
├── Branding (confuses meaning)
├── Decoration (reduces impact)
├── Arbitrary styling
└── Status indicators (use icons too)

ALWAYS:
├── Pair with icons (colorblind users)
├── Maintain across light/dark modes
├── Keep consistent throughout app
└── Follow platform conventions
```

### Error State Colors

```
Error states need:
├── Red-ish color (semantic)
├── High contrast against background
├── Icon reinforcement
├── Clear text explanation

iOS:
├── Light: #FF3B30
├── Dark: #FF453A

Android:
├── Light: #B3261E
├── Dark: #F2B8B5 (on error container)
```

---

> OLED optimization, dark mode, battery-aware colors, and outdoor visibility.
> **Color on mobile isn't just aesthetics—it's battery life and usability.**

---

## 6. Dynamic Color (Android)

### Material You

```
Android 12+ Dynamic Color:

User's wallpaper → Color extraction → App theme

Your app automatically gets:
├── Primary (from wallpaper dominant)
├── Secondary (complementary)
├── Tertiary (accent)
├── Surface colors (neutral, derived)
├── On-colors (text on each)
```

### Supporting Dynamic Color

```kotlin
// Jetpack Compose
MaterialTheme(
    colorScheme = dynamicColorScheme()
        ?: staticColorScheme() // Fallback for older Android
)

// React Native
// Limited support - consider react-native-material-you
```

### Fallback Colors

```
When dynamic color unavailable:
├── Android < 12
├── User disabled
├── Non-supporting launchers

Provide static color scheme:
├── Define your brand colors
├── Test in both modes
├── Match dynamic color roles
└── Support light + dark
```

---

> OLED optimization, dark mode, battery-aware colors, and outdoor visibility.
> **Color on mobile isn't just aesthetics—it's battery life and usability.**

---

## 7. Color Accessibility

### Colorblind Considerations

```
~8% of men, ~0.5% of women are colorblind

Types:
├── Protanopia (red weakness)
├── Deuteranopia (green weakness)
├── Tritanopia (blue weakness)
├── Monochromacy (rare, no color)

Design rules:
├── Never rely on color alone
├── Use patterns, icons, text
├── Test with simulation tools
├── Avoid red/green distinctions only
```

### Contrast Testing Tools

```
Use these to verify:
├── Built-in accessibility inspector (Xcode)
├── Accessibility Scanner (Android)
├── Contrast ratio calculators
├── Colorblind simulation
└── Test on actual devices in sunlight
```

### Sufficient Contrast

```
WCAG Guidelines:

AA (Minimum)
├── Normal text: 4.5:1
├── Large text (18pt+): 3:1
├── UI components: 3:1

AAA (Enhanced)
├── Normal text: 7:1
├── Large text: 4.5:1

Mobile recommendation: Meet AA, aim for AAA
```

---

## Verification

Cross-check version-sensitive details with the cited official source and verify behavior in the target environment.
