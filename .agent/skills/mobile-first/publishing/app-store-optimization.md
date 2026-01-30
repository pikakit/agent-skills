---
name: app-store-optimization
description: ASO strategies for iOS App Store and Google Play Store visibility and conversion
---

# App Store Optimization (ASO)

> **Philosophy:** ASO is SEO for apps. Discoverability drives downloads.

## Core ASO Elements

| Element | iOS App Store | Google Play |
|---------|---------------|-------------|
| **Title** | 30 chars | 30 chars |
| **Subtitle** | 30 chars | N/A |
| **Short Description** | N/A | 80 chars |
| **Keywords** | 100 chars (hidden) | Indexed from all text |
| **Description** | 4000 chars | 4000 chars |
| **Screenshots** | Up to 10 | Up to 8 |
| **Video** | 15-30 sec preview | Up to 30 sec |

## Keyword Strategy

### iOS Keyword Field (100 chars)

```
task,manager,todo,productivity,checklist,reminder,planner,organize,gtd
```

**Rules:**
- Comma-separated, no spaces
- No duplicates (including title words)
- Singular forms (plurals indexed automatically)
- No competitor names (rejected)

### Google Play (Text-Based)

Keywords indexed from:
1. Title (highest weight)
2. Short description
3. Full description
4. Developer name

**Best Practice:** Repeat important keywords 3-5 times naturally in description.

## Screenshots That Convert

### Formula: Benefit + Visual

```
❌ "Home Screen"
✅ "Track habits effortlessly"

❌ "Settings Page"  
✅ "Customize your experience"
```

### Screenshot Order

| Position | Purpose |
|----------|---------|
| 1-2 | Hook (best features) |
| 3-4 | Social proof / differentiators |
| 5+ | Additional features |

### Dimensions

| Device | iOS | Android |
|--------|-----|---------|
| Phone | 1290 x 2796 (6.7") | 1080 x 1920 min |
| Tablet | 2048 x 2732 | 1200 x 1920 |

## Conversion Rate Optimization

### Icon Best Practices

| Do | Don't |
|----|-------|
| Simple, bold design | Complex details |
| Stand out on white/dark | Blend with background |
| No text | Tiny unreadable text |
| Test with A/B | Assume first design works |

### A/B Testing (Google Play Experiments)

Test these in order:
1. Icon (highest impact)
2. Screenshots
3. Short description
4. Feature graphic

## Ratings & Reviews

### Prompting Strategy

```
WHEN to ask for rating:
✅ After successful task completion
✅ After 3+ sessions
✅ After "happy moment" (achievement, level up)

WHEN NOT to ask:
❌ During onboarding
❌ After error/crash
❌ Too frequently (Apple rejects)
```

### iOS SKStoreReviewController

```swift
// Limit: 3 prompts per 365 days
import StoreKit

if successfulCheckouts >= 3 {
    SKStoreReviewController.requestReview()
}
```

### Responding to Reviews

| Rating | Response Strategy |
|--------|-------------------|
| 1-2 ⭐ | Apologize, offer support, request update |
| 3 ⭐ | Thank, ask what would make it 5-star |
| 4-5 ⭐ | Thank, mention new features coming |

## Localization Impact

| Region | Potential Increase |
|--------|-------------------|
| Top 10 languages | +40-80% downloads |
| Localized screenshots | +25% conversion |
| Localized keywords | +15% visibility |

**Priority Languages:**
1. English (US + UK)
2. Spanish
3. Portuguese (Brazil)
4. German
5. French
6. Japanese
7. Korean
8. Chinese (Simplified)

## Metrics to Track

| Metric | Target | Tool |
|--------|--------|------|
| Impression to Page View | > 8% | Store Console |
| Page View to Install | > 25% | Store Console |
| Keyword Rankings | Top 10 | App Annie / Sensor Tower |
| Organic vs Paid | > 60% organic | Store Console |

## Common Mistakes

| Mistake | Impact | Fix |
|---------|--------|-----|
| Generic title | Low search ranking | Include category + keyword |
| No keywords in first 3 lines | Poor indexing | Front-load important terms |
| Outdated screenshots | Trust loss | Update with each major release |
| Ignoring bad reviews | Rating drops | Respond within 24 hours |
