---
"title": "Mobile Color System: Color Anti-Patterns through Related"
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

# Mobile Color System: Color Anti-Patterns through Related

## Scope

Apply only to the declared platforms and repository-confirmed versions.

## Guidance

> OLED optimization, dark mode, battery-aware colors, and outdoor visibility.
> **Color on mobile isn't just aesthetics—it's battery life and usability.**

---

## 8. Color Anti-Patterns

### ❌ Common Mistakes

| Mistake | Problem | Fix |
|---------|---------|-----|
| **Light gray on white** | Invisible outdoors | Min 4.5:1 contrast |
| **Pure white in dark mode** | Eye strain | Use #E0E0E0-#F0F0F0 |
| **Same saturation dark mode** | Garish, glowing | Desaturate colors |
| **Red/green only indicator** | Colorblind users can't see | Add icons |
| **Semantic colors for brand** | Confusing meaning | Use neutral for brand |
| **Ignoring system dark mode** | Jarring experience | Support both modes |

### ❌ AI Color Mistakes

```
AI tends to:
├── Use same colors for light/dark
├── Ignore OLED battery implications
├── Skip contrast calculations
├── Default to purple/violet (BANNED)
├── Use low contrast "aesthetic" grays
├── Not test in outdoor conditions
└── Forget colorblind users

RULE: Design for the worst case.
Test in bright sunlight, with colorblindness simulation.
```

---

> OLED optimization, dark mode, battery-aware colors, and outdoor visibility.
> **Color on mobile isn't just aesthetics—it's battery life and usability.**

---

## 9. Color System Checklist

### Before Choosing Colors

- [ ] Light and dark mode variants defined?
- [ ] Contrast ratios checked (4.5:1+)?
- [ ] OLED battery considered (dark mode)?
- [ ] Semantic colors follow conventions?
- [ ] Colorblind-safe (not color-only indicators)?

### Before Release

- [ ] Tested in bright sunlight?
- [ ] Tested dark mode on OLED device?
- [ ] System dark mode respected?
- [ ] Dynamic color supported (Android)?
- [ ] Error/success/warning consistent?
- [ ] All text meets contrast requirements?

---

> OLED optimization, dark mode, battery-aware colors, and outdoor visibility.
> **Color on mobile isn't just aesthetics—it's battery life and usability.**

---

## 10. Quick Reference

### Dark Mode Backgrounds

```
True black (OLED max savings): #000000
Near black (Material):         #121212
Surface 1:                     #1E1E1E
Surface 2:                     #2C2C2C
Surface 3:                     #3C3C3C
```

### Text on Dark

```
Primary:   #E0E0E0 to #ECECEC
Secondary: #A0A0A0 to #B0B0B0
Disabled:  #606060 to #707070
```

### Contrast Ratios

```
Small text:  4.5:1 (minimum)
Large text:  3:1 (minimum)
UI elements: 3:1 (minimum)
Ideal:       7:1 (AAA)
```

---

> **Remember:** Color on mobile must work in the worst conditions—bright sun, tired eyes, colorblindness, low battery. Pretty colors that fail these tests are useless colors.

---

> OLED optimization, dark mode, battery-aware colors, and outdoor visibility.
> **Color on mobile isn't just aesthetics—it's battery life and usability.**

---

## 🔗 Related

| File | When to Read |
|------|-------------|
| [platform-ios.md](platform-ios-1-human-interface-guidelines-philosophy.md) | iOS semantic colors, dark mode |
| [platform-android.md](platform-android-1-material-design-3-philosophy.md) | Material You dynamic color |
| [mobile-typography.md](mobile-typography-1-mobile-typography-fundamentals.md) | Text contrast requirements |
| [touch-psychology.md](touch-psychology-1-fitts-law-for-touch.md) | Visual feedback patterns |

---

## Verification

Cross-check version-sensitive details with the cited official source and verify behavior in the target environment.
