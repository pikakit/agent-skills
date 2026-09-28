---
"title": "Mobile Typography: Font Loading & Performance through Related"
"kind": "reference"
"impact": "high"
"tags":
  - "mobile"
  - "typography"
"applies_to":
  - "android"
  - "ios"
"last_reviewed": "2026-09-28"
"sources":
  - "title": "Material Design 3 Typography"
    "url": "https://developer.android.com/design/ui/mobile/guides/styles/typography"
  - "title": "Apple HIG Typography"
    "url": "https://developer.apple.com/design/human-interface-guidelines/typography"
---

# Mobile Typography: Font Loading & Performance through Related

## Scope

Apply only to the declared platforms and repository-confirmed versions.

## Guidance

> Type scale, system fonts, Dynamic Type, accessibility, and dark mode typography.
> **Typography failures are the #1 cause of unreadable mobile apps.**

---

## 8. Font Loading & Performance

### Font File Optimization

```
Font file sizes matter on mobile:
├── Full font: 100-300KB per weight
├── Subset (Latin): 15-40KB per weight
├── Variable font: 100-200KB (all weights)

Recommendations:
├── Subset to needed characters
├── Use WOFF2 format
├── Max 2-3 font files
├── Consider variable fonts
├── Cache fonts appropriately
```

### Loading Strategy

```
1. SYSTEM FONT FALLBACK
   Show system font → swap when custom loads
   
2. FONT DISPLAY SWAP
   font-display: swap (CSS)
   
3. PRELOAD CRITICAL FONTS
   Preload fonts needed above the fold
   
4. DON'T BLOCK RENDER
   Don't wait for fonts to show content
```

---

> Type scale, system fonts, Dynamic Type, accessibility, and dark mode typography.
> **Typography failures are the #1 cause of unreadable mobile apps.**

---

## 9. Typography Checklist

### Before Any Text Design

- [ ] Body text ≥ 16px/pt/sp?
- [ ] Line height ≥ 1.4?
- [ ] Line length ≤ 60 chars?
- [ ] Type scale defined (max 5-7 sizes)?
- [ ] Using pt (iOS) or sp (Android)?

### Before Release

- [ ] Dynamic Type tested (iOS)?
- [ ] Font scaling tested at 200% (Android)?
- [ ] Dark mode contrast checked?
- [ ] Sunlight readability tested?
- [ ] All text has proper hierarchy?
- [ ] Custom fonts have fallbacks?
- [ ] Long text scrolls properly?

---

> Type scale, system fonts, Dynamic Type, accessibility, and dark mode typography.
> **Typography failures are the #1 cause of unreadable mobile apps.**

---

## 10. Quick Reference

### Typography Tokens

```
// iOS
.largeTitle  // 34pt, Bold
.title       // 28pt, Bold
.title2      // 22pt, Bold
.title3      // 20pt, Semibold
.headline    // 17pt, Semibold
.body        // 17pt, Regular
.subheadline // 15pt, Regular
.footnote    // 13pt, Regular
.caption     // 12pt, Regular

// Android (Material 3)
displayLarge   // 57sp
headlineLarge  // 32sp
titleLarge     // 22sp
bodyLarge      // 16sp
labelLarge     // 14sp
```

### Minimum Sizes

```
Body:       14-16pt/sp (16 preferred)
Secondary:  12-13pt/sp
Caption:    11-12pt/sp
Nothing:    < 11pt/sp
```

### Line Height

```
Headings:  1.1-1.3
Body:      1.4-1.6
Long text: 1.5-1.75
```

---

> **Remember:** If users can't read your text, your app is broken. Typography isn't decoration—it's the primary interface. Test on real devices, in real conditions, with accessibility settings enabled.

---

> Type scale, system fonts, Dynamic Type, accessibility, and dark mode typography.
> **Typography failures are the #1 cause of unreadable mobile apps.**

---

## 🔗 Related

| File | When to Read |
|------|-------------|
| [mobile-color-system.md](mobile-color-system-1-mobile-color-fundamentals.md) | Text contrast, dark mode colors |
| [platform-ios.md](platform-ios-1-human-interface-guidelines-philosophy.md) | iOS SF Pro type scale |
| [platform-android.md](platform-android-1-material-design-3-philosophy.md) | Material type scale, sp units |
| [touch-psychology.md](touch-psychology-1-fitts-law-for-touch.md) | Readability in mobile context |

---

## Verification

Cross-check version-sensitive details with the cited official source and verify behavior in the target environment.
