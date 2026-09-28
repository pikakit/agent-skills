---
"title": "App Store Optimization: Core ASO Elements through Ratings & Reviews"
"kind": "process"
"impact": "high"
"tags":
  - "app"
  - "store"
  - "optimization"
"applies_to":
  - "android"
  - "ios"
"last_reviewed": "2026-09-28"
"sources":
  - "title": "Google Play Best Practices"
    "url": "https://developer.android.com/distribute/best-practices"
  - "title": "App Store Product Page"
    "url": "https://developer.apple.com/app-store/product-page/"
---

# App Store Optimization: Core ASO Elements through Ratings & Reviews

## Preconditions

Capture the baseline, target environment, acceptance criteria, and rollback point.

## Procedure

> **Philosophy:** ASO is SEO for apps. Discoverability drives downloads.

---

## Core ASO Elements

| Element | iOS App Store | Google Play |
|---------|---------------|-------------|
| **Title** | 30 chars | 30 chars |
| **Subtitle** | 30 chars | N/A |
| **Short Description** | N/A | 80 chars |
| **Promotional Text** | 170 chars (updateable without review) | N/A |
| **Keywords** | 100 chars (hidden) | Indexed from all text |
| **Description** | 4000 chars | 4000 chars |
| **Screenshots** | Up to 10 | Up to 8 |
| **Video** | 15-30 sec preview | Up to 30 sec |

---

> **Philosophy:** ASO is SEO for apps. Discoverability drives downloads.

---

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

Keywords indexed from (highest to lowest weight):
1. Title
2. Short description
3. Full description
4. Developer name

**Best Practice:** Repeat important keywords 3-5 times naturally in description.

---

> **Philosophy:** ASO is SEO for apps. Discoverability drives downloads.

---

## Promotional Text (iOS)

> 170 chars. Can be updated without app review — use for time-sensitive messaging.

| Use Case | Example |
|----------|---------|
| Feature launch | "🆕 Dark mode is here! Try it now" |
| Seasonal | "☀️ Summer sale — 50% off Pro" |
| Social proof | "⭐ #1 in Productivity — thank you!" |
| Re-engagement | "📱 New widgets for iOS 18" |

---

> **Philosophy:** ASO is SEO for apps. Discoverability drives downloads.

---

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

### Screenshot Automation (fastlane)

```bash
# iOS — fastlane snapshot
fastlane snapshot --devices "iPhone 15 Pro Max" --languages "en-US,ja"

# Android — fastlane screengrab
fastlane screengrab --app_package_name "com.example.myapp"
```

Config: `Snapfile` (iOS) / `Screengrabfile` (Android)

---

> **Philosophy:** ASO is SEO for apps. Discoverability drives downloads.

---

## In-App Events (iOS) & LiveOps (Android)

> Store-featured events that boost visibility and re-engagement.

| Platform | Feature | Duration | Use Case |
|----------|---------|----------|----------|
| iOS | In-App Events | 1-30 days | Challenges, new content, live events |
| Android | LiveOps | Custom | Sales, competitions, updates |

**Best practices:**
- Use event card image (1920×1080)
- Time-sensitive events get priority boost
- Link directly to relevant in-app screen

---

> **Philosophy:** ASO is SEO for apps. Discoverability drives downloads.

---

## Custom Product Pages (iOS) / Store Listing Experiments (Android)

| Platform | Feature | Limit |
|----------|---------|-------|
| iOS | Custom Product Pages | 35 pages |
| Android | Store Listing Experiments | A/B testing built-in |

**Use for:** Paid campaigns with audience-specific messaging. Each custom page can have unique screenshots, description, and promotional text.

```
Campaign A (Fitness audience) → Custom Page with health screenshots
Campaign B (Students)         → Custom Page with study features
```

---

> **Philosophy:** ASO is SEO for apps. Discoverability drives downloads.

---

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

---

> **Philosophy:** ASO is SEO for apps. Discoverability drives downloads.

---

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

### iOS (SwiftUI — iOS 16+)

```swift
import StoreKit

// SwiftUI
@Environment(\.requestReview) private var requestReview

Button("Rate Us") {
    requestReview()
}

// UIKit fallback
if let scene = UIApplication.shared.connectedScenes
    .first(where: { $0.activationState == .foregroundActive }) as? UIWindowScene {
    SKStoreReviewController.requestReview(in: scene)
}
```

### Responding to Reviews

| Rating | Response Strategy |
|--------|-------------------|
| 1-2 ⭐ | Apologize, offer support, request update |
| 3 ⭐ | Thank, ask what would make it 5-star |
| 4-5 ⭐ | Thank, mention new features coming |

---

## Rollback

Restore the baseline if required tooling errors or the procedure introduces a regression.

## Exit Gate

Require fresh evidence for the intended behavior and all applicable project checks.
