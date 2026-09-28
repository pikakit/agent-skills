# Mobile Developer Full Agent Rules

> Deterministic compilation of 69 source rules for mobile-developer v4.0.0. Do not edit directly.

## Rule Index

- [Mobile Anti-Patterns](#rule-anti-patterns) (standard, reference, source: `rules/anti-patterns.md`)
- [App Store Optimization: Core ASO Elements through Ratings & Reviews](#rule-app-store-optimization-core-aso-elements) (high, process, source: `rules/app-store-optimization-core-aso-elements.md`)
- [App Store Optimization: Localization Impact through Related](#rule-app-store-optimization-localization-impact-2) (high, process, source: `rules/app-store-optimization-localization-impact-2.md`)
- [Decision Trees: Framework Selection](#rule-decision-trees-1-framework-selection) (high, decision, source: `rules/decision-trees-1-framework-selection.md`)
- [Decision Trees: State Management Selection through 3. Navigation Pattern Selection](#rule-decision-trees-2-state-management-selection-2) (high, decision, source: `rules/decision-trees-2-state-management-selection-2.md`)
- [Decision Trees: Storage Strategy Selection through 5. Offline Strategy Selection](#rule-decision-trees-4-storage-strategy-selection-3) (high, decision, source: `rules/decision-trees-4-storage-strategy-selection-3.md`)
- [Decision Trees: Authentication Pattern Selection through 8. Decision Checklist](#rule-decision-trees-6-authentication-pattern-selection-4) (high, decision, source: `rules/decision-trees-6-authentication-pattern-selection-4.md`)
- [Decision Trees: Anti-Pattern Decisions through Related](#rule-decision-trees-9-anti-pattern-decisions-5) (high, decision, source: `rules/decision-trees-9-anti-pattern-decisions-5.md`)
- [Deep Linking: Deep Link Types through Expo Configuration](#rule-deep-linking-deep-link-types) (high, reference, source: `rules/deep-linking-deep-link-types.md`)
- [Deep Linking: Flutter Configuration through Testing Deep Links](#rule-deep-linking-flutter-configuration-2) (high, reference, source: `rules/deep-linking-flutter-configuration-2.md`)
- [Deep Linking: Troubleshooting through Related](#rule-deep-linking-troubleshooting-3) (high, reference, source: `rules/deep-linking-troubleshooting-3.md`)
- [Flutter: CI/CD & Build through Related Sub-Skills](#rule-flutter-ci-cd-build-3) (high, reference, source: `rules/flutter-ci-cd-build-3.md`)
- [Flutter: Performance Optimization through Security](#rule-flutter-performance-optimization-2) (high, reference, source: `rules/flutter-performance-optimization-2.md`)
- [Flutter: Widget Architecture through Navigation (GoRouter)](#rule-flutter-widget-architecture) (high, reference, source: `rules/flutter-widget-architecture.md`)
- [Mobile Backend: Push Notifications](#rule-mobile-backend-1-push-notifications-2) (high, reference, source: `rules/mobile-backend-1-push-notifications-2.md`)
- [Mobile Backend: Offline Sync & Conflict Resolution through 4. App Versioning](#rule-mobile-backend-2-offline-sync-conflict-resolution-3) (high, reference, source: `rules/mobile-backend-2-offline-sync-conflict-resolution-3.md`)
- [Mobile Backend: Authentication for Mobile through 7. Media & Binary Handling](#rule-mobile-backend-5-authentication-for-mobile-4) (high, reference, source: `rules/mobile-backend-5-authentication-for-mobile-4.md`)
- [Mobile Backend: Security for Mobile through Related](#rule-mobile-backend-8-security-for-mobile-5) (high, reference, source: `rules/mobile-backend-8-security-for-mobile-5.md`)
- [Mobile Backend: MOBILE BACKEND MINDSET through AI MOBILE BACKEND ANTI-PATTERNS](#rule-mobile-backend-mobile-backend-mindset) (high, reference, source: `rules/mobile-backend-mobile-backend-mindset.md`)
- [Mobile Color System: Mobile Color Fundamentals through 3. Dark Mode Design](#rule-mobile-color-system-1-mobile-color-fundamentals) (high, reference, source: `rules/mobile-color-system-1-mobile-color-fundamentals.md`)
- [Mobile Color System: Outdoor Visibility through 7. Color Accessibility](#rule-mobile-color-system-4-outdoor-visibility-2) (high, reference, source: `rules/mobile-color-system-4-outdoor-visibility-2.md`)
- [Mobile Color System: Color Anti-Patterns through Related](#rule-mobile-color-system-8-color-anti-patterns-3) (high, reference, source: `rules/mobile-color-system-8-color-anti-patterns-3.md`)
- [Mobile Debugging: Debugging Mindset through Flutter Debugging Tools](#rule-mobile-debugging-debugging-mindset) (high, process, source: `rules/mobile-debugging-debugging-mindset.md`)
- [Mobile Debugging: Native Platform Debugging through Memory Leak Detection](#rule-mobile-debugging-native-platform-debugging-2) (high, process, source: `rules/mobile-debugging-native-platform-debugging-2.md`)
- [Mobile Debugging: Platform-Specific Nightmares through Related](#rule-mobile-debugging-platform-specific-nightmares-3) (high, process, source: `rules/mobile-debugging-platform-specific-nightmares-3.md`)
- [Mobile Design Thinking: ?? ANTI-MEMORIZATION TEST through ?? CONTEXT-BASED DECISION PROTOCOL](#rule-mobile-design-thinking-anti-memorization-test-3) (high, reference, source: `rules/mobile-design-thinking-anti-memorization-test-3.md`)
- [Mobile Design Thinking: ?? COMPONENT DECOMPOSITION (MANDATORY) through ?? PATTERN QUESTIONING MATRIX](#rule-mobile-design-thinking-component-decomposition-mandatory-2) (high, reference, source: `rules/mobile-design-thinking-component-decomposition-mandatory-2.md`)
- [Mobile Design Thinking: ?? DEEP MOBILE THINKING PROTOCOL through ?? AI MOBILE DEFAULTS (FORBIDDEN LIST)](#rule-mobile-design-thinking-deep-mobile-thinking-protocol) (high, reference, source: `rules/mobile-design-thinking-deep-mobile-thinking-protocol.md`)
- [Mobile Design Thinking: ?? INTERACTION BREAKDOWN through ?? MANDATORY: Before Every Mobile Work](#rule-mobile-design-thinking-interaction-breakdown-4) (high, reference, source: `rules/mobile-design-thinking-interaction-breakdown-4.md`)
- [Mobile Navigation: Navigation Selection Decision Tree through 3. Stack Navigation](#rule-mobile-navigation-1-navigation-selection-decision-tree) (high, reference, source: `rules/mobile-navigation-1-navigation-selection-decision-tree.md`)
- [Mobile Navigation: Drawer Navigation through 6. Deep Linking](#rule-mobile-navigation-4-drawer-navigation-2) (high, reference, source: `rules/mobile-navigation-4-drawer-navigation-2.md`)
- [Mobile Navigation: Navigation State Persistence through 10. Navigation Checklist](#rule-mobile-navigation-7-navigation-state-persistence-3) (high, reference, source: `rules/mobile-navigation-7-navigation-state-persistence-3.md`)
- [Mobile Navigation: Related](#rule-mobile-navigation-related-4) (high, reference, source: `rules/mobile-navigation-related-4.md`)
- [Mobile Performance: The Mobile Performance Mindset through 2. React Native Performance - FlashList: The Better Option](#rule-mobile-performance-1-the-mobile-performance-mindset) (high, reference, source: `rules/mobile-performance-1-the-mobile-performance-mindset.md`)
- [Mobile Performance: React Native Performance - Animation Performance through 3. Flutter Performance - ?? The #1 AI Mistake: setState Overuse](#rule-mobile-performance-2-react-native-performance-animation-perfo-2) (high, reference, source: `rules/mobile-performance-2-react-native-performance-animation-perfo-2.md`)
- [Mobile Performance: Flutter Performance - Flutter Performance Checklist through 5. Memory Management](#rule-mobile-performance-3-flutter-performance-flutter-performance-4) (high, reference, source: `rules/mobile-performance-3-flutter-performance-flutter-performance--4.md`)
- [Mobile Performance: Flutter Performance - The const Constructor Revolution through 3. Flutter Performance - Dispose Pattern](#rule-mobile-performance-3-flutter-performance-the-const-constructo-3) (high, reference, source: `rules/mobile-performance-3-flutter-performance-the-const-constructo-3.md`)
- [Mobile Performance: Battery Optimization through 8. Performance Testing](#rule-mobile-performance-6-battery-optimization-5) (high, reference, source: `rules/mobile-performance-6-battery-optimization-5.md`)
- [Mobile Performance: Quick Reference Card](#rule-mobile-performance-9-quick-reference-card-6) (high, reference, source: `rules/mobile-performance-9-quick-reference-card-6.md`)
- [Mobile Testing: What to Test at Each Level through 6. Performance Testing](#rule-mobile-testing-3-what-to-test-at-each-level-2) (high, process, source: `rules/mobile-testing-3-what-to-test-at-each-level-2.md`)
- [Mobile Testing: Accessibility Testing through Related](#rule-mobile-testing-7-accessibility-testing-3) (high, process, source: `rules/mobile-testing-7-accessibility-testing-3.md`)
- [Mobile Testing: MOBILE TESTING MINDSET through 2. Testing Pyramid for Mobile](#rule-mobile-testing-mobile-testing-mindset) (high, process, source: `rules/mobile-testing-mobile-testing-mindset.md`)
- [Mobile Typography: Mobile Typography Fundamentals through 3. Type Scale](#rule-mobile-typography-1-mobile-typography-fundamentals) (high, reference, source: `rules/mobile-typography-1-mobile-typography-fundamentals.md`)
- [Mobile Typography: Dynamic Type / Text Scaling through 7. Typography Anti-Patterns](#rule-mobile-typography-4-dynamic-type-text-scaling-2) (high, reference, source: `rules/mobile-typography-4-dynamic-type-text-scaling-2.md`)
- [Mobile Typography: Font Loading & Performance through Related](#rule-mobile-typography-8-font-loading-performance-3) (high, reference, source: `rules/mobile-typography-8-font-loading-performance-3.md`)
- [Native: Error Handling (Android) through Related Sub-Skills](#rule-native-error-handling-android-3) (high, reference, source: `rules/native-error-handling-android-3.md`)
- [Native: Offline Patterns (iOS) through Testing (Android)](#rule-native-offline-patterns-ios-2) (high, reference, source: `rules/native-offline-patterns-ios-2.md`)
- [Native: When to Go Native through Accessibility (iOS)](#rule-native-when-to-go-native) (high, reference, source: `rules/native-when-to-go-native.md`)
- [Platform Android: Material Design 3 Philosophy through 3. Material Color System](#rule-platform-android-1-material-design-3-philosophy) (high, reference, source: `rules/platform-android-1-material-design-3-philosophy.md`)
- [Platform Android: Android Checklist](#rule-platform-android-10-android-checklist-5) (high, reference, source: `rules/platform-android-10-android-checklist-5.md`)
- [Platform Android: Android Layout & Spacing through 5. Android Navigation Patterns](#rule-platform-android-4-android-layout-spacing-2) (high, reference, source: `rules/platform-android-4-android-layout-spacing-2.md`)
- [Platform Android: Material Components](#rule-platform-android-6-material-components-3) (high, reference, source: `rules/platform-android-6-material-components-3.md`)
- [Platform Android: Android-Specific Patterns through 9. Android Accessibility](#rule-platform-android-7-android-specific-patterns-4) (high, reference, source: `rules/platform-android-7-android-specific-patterns-4.md`)
- [Platform Ios: Human Interface Guidelines Philosophy through 3. iOS Color System](#rule-platform-ios-1-human-interface-guidelines-philosophy) (high, reference, source: `rules/platform-ios-1-human-interface-guidelines-philosophy.md`)
- [Platform Ios: iOS Layout & Spacing through 5. iOS Navigation Patterns](#rule-platform-ios-4-ios-layout-spacing-2) (high, reference, source: `rules/platform-ios-4-ios-layout-spacing-2.md`)
- [Platform Ios: iOS Components through 8. SF Symbols](#rule-platform-ios-6-ios-components-3) (high, reference, source: `rules/platform-ios-6-ios-components-3.md`)
- [Platform Ios: iOS Accessibility through 10. iOS Checklist](#rule-platform-ios-9-ios-accessibility-4) (high, reference, source: `rules/platform-ios-9-ios-accessibility-4.md`)
- [Production verification gates](#rule-production-gates) (high, process, source: `rules/production-gates.md`)
- [Push Notifications: Native Android Setup (Compose) through Android Notification Channels](#rule-push-notifications-native-android-setup-compose-2) (high, reference, source: `rules/push-notifications-native-android-setup-compose-2.md`)
- [Push Notifications: Notification Grouping through Opt-Out Metrics](#rule-push-notifications-notification-grouping-3) (high, reference, source: `rules/push-notifications-notification-grouping-3.md`)
- [Push Notifications: Platform Services through Native iOS Setup (SwiftUI)](#rule-push-notifications-platform-services) (high, reference, source: `rules/push-notifications-platform-services.md`)
- [Push Notifications: Troubleshooting through Related](#rule-push-notifications-troubleshooting-4) (high, reference, source: `rules/push-notifications-troubleshooting-4.md`)
- [React Native: Expo-Specific Patterns through Related Sub-Skills](#rule-react-native-expo-specific-patterns-3) (high, reference, source: `rules/react-native-expo-specific-patterns-3.md`)
- [React Native: Framework Decision through Performance Optimization](#rule-react-native-framework-decision) (high, reference, source: `rules/react-native-framework-decision.md`)
- [React Native: Testing through CI/CD & Build](#rule-react-native-testing-2) (high, reference, source: `rules/react-native-testing-2.md`)
- [Touch Psychology: Fitts' Law for Touch through 2. Thumb Zone Anatomy](#rule-touch-psychology-1-fitts-law-for-touch) (high, reference, source: `rules/touch-psychology-1-fitts-law-for-touch.md`)
- [Touch Psychology: Touch vs Click Psychology through 4. Gesture Psychology](#rule-touch-psychology-3-touch-vs-click-psychology-2) (high, reference, source: `rules/touch-psychology-3-touch-vs-click-psychology-2.md`)
- [Touch Psychology: Haptic Feedback Patterns through 6. Mobile Cognitive Load](#rule-touch-psychology-5-haptic-feedback-patterns-3) (high, reference, source: `rules/touch-psychology-5-haptic-feedback-patterns-3.md`)
- [Touch Psychology: Touch Accessibility through 10. Quick Reference Card](#rule-touch-psychology-7-touch-accessibility-4) (high, reference, source: `rules/touch-psychology-7-touch-accessibility-4.md`)

<a id="rule-anti-patterns"></a>

## Mobile Anti-Patterns

**Impact:** standard
**Kind:** reference
**Source:** `rules/anti-patterns.md`

# Mobile Anti-Patterns

## Scope

This reference applies only to the platforms declared in metadata and the versions confirmed in the target repository.

## Guidance

> 🚫 Common AI default tendencies that MUST be avoided!

## Performance Sins

| ❌ NEVER DO | Why It's Wrong | ✅ ALWAYS DO |
|-------------|----------------|--------------|
| ScrollView for long lists | Renders ALL items, memory explodes | Use `FlatList` / `FlashList` / `ListView.builder` |
| Inline renderItem function | New function every render | `useCallback` + `React.memo` |
| Missing keyExtractor | Index-based keys cause bugs | Unique, stable ID from data |
| Skip getItemLayout | Async layout = janky scroll | Provide when items have fixed height |
| setState() everywhere | Unnecessary widget rebuilds | Targeted state, `const` constructors |
| Native driver: false | Animations blocked by JS thread | `useNativeDriver: true` always |
| console.log in production | Blocks JS thread severely | Remove before release build |
| Skip React.memo/const | Every item re-renders | Memoize list items ALWAYS |

## Touch/UX Sins

| ❌ NEVER DO | Why It's Wrong | ✅ ALWAYS DO |
|-------------|----------------|--------------|
| Touch target < 44px | Impossible to tap accurately | Minimum 44pt (iOS) / 48dp (Android) |
| Spacing < 8px between targets | Accidental taps | Minimum 8-12px gap |
| Gesture-only interactions | Motor impaired users excluded | Always provide button alternative |
| No loading state | User thinks app crashed | ALWAYS show loading feedback |
| No error state | User stuck, no recovery path | Show error with retry option |
| No offline handling | Crash/block when network lost | Graceful degradation, cached data |
| Ignore platform conventions | Users confused | iOS feels iOS, Android feels Android |

## Security Sins

| ❌ NEVER DO | Why It's Wrong | ✅ ALWAYS DO |
|-------------|----------------|--------------|
| Token in AsyncStorage | Easily stolen on rooted device | `SecureStore` / `Keychain` / `EncryptedSharedPreferences` |
| Hardcode API keys | Reverse engineered from APK/IPA | Environment variables, secure storage |
| Skip SSL pinning | MITM attacks possible | Pin certificates in production |
| Log sensitive data | Logs can be extracted | Never log tokens, passwords, PII |

## Architecture Sins

| ❌ NEVER DO | Why It's Wrong | ✅ ALWAYS DO |
|-------------|----------------|--------------|
| Business logic in UI | Untestable, unmaintainable | Service layer separation |
| Global state for everything | Unnecessary re-renders | Local state default, lift when needed |
| Deep linking as afterthought | Notifications, shares broken | Plan deep links from day one |
| Skip dispose/cleanup | Memory leaks | Clean up subscriptions, timers |

---

## 🔗 Related

| File | When to Read |
|------|-------------|
| [mobile-performance.md](mobile-performance-1-the-mobile-performance-mindset.md) | Performance anti-pattern details |
| [mobile-debugging.md](mobile-debugging-debugging-mindset.md) | Debugging workflows |
| [decision-trees.md](decision-trees-1-framework-selection.md) | Correct patterns to use instead |
| [touch-psychology.md](touch-psychology-1-fitts-law-for-touch.md) | Touch UX guidance |

## Verification

Cross-check version-sensitive details with the cited official source and verify the resulting behavior in the target environment.

<a id="rule-app-store-optimization-core-aso-elements"></a>

## App Store Optimization: Core ASO Elements through Ratings & Reviews

**Impact:** high
**Kind:** process
**Source:** `rules/app-store-optimization-core-aso-elements.md`

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

<a id="rule-app-store-optimization-localization-impact-2"></a>

## App Store Optimization: Localization Impact through Related

**Impact:** high
**Kind:** process
**Source:** `rules/app-store-optimization-localization-impact-2.md`

# App Store Optimization: Localization Impact through Related

## Preconditions

Capture the baseline, target environment, acceptance criteria, and rollback point.

## Procedure

> **Philosophy:** ASO is SEO for apps. Discoverability drives downloads.

---

## Localization Impact

| Region | Potential Increase |
|--------|-------------------|
| Top 10 languages | +40-80% downloads |
| Localized screenshots | +25% conversion |
| Localized keywords | +15% visibility |

**Priority Languages:**
English (US+UK), Spanish, Portuguese (Brazil), German, French, Japanese, Korean, Chinese (Simplified)

---

> **Philosophy:** ASO is SEO for apps. Discoverability drives downloads.

---

## Privacy & Compliance

| Requirement | iOS | Android |
|-------------|-----|---------|
| **Privacy labels** | App Privacy section (required) | Data Safety section (required) |
| **ATT prompt** | `ATTrackingManager.requestTrackingAuthorization` | N/A |
| **GDPR** | Consent before analytics/ads | Consent before analytics/ads |
| **COPPA** | If targeting <13, declare in App Store Connect | Declare in Play Console |
| **Review guidelines** | [Apple Review Guidelines](https://developer.apple.com/app-store/review/guidelines/) | [Google Play Policy](https://play.google.com/about/developer-content-policy/) |

### Common Rejection Reasons (iOS)

| Reason | Fix |
|--------|-----|
| 2.1 — App Completeness | No placeholder content, all links working |
| 2.3 — Accurate Metadata | Screenshots match actual app |
| 4.0 — Design | Follow HIG, no web-view-only apps |
| 5.1.1 — Data Collection | Complete privacy labels |
| 5.1.2 — Data Use | Request only necessary permissions |

---

> **Philosophy:** ASO is SEO for apps. Discoverability drives downloads.

---

## Metrics to Track

| Metric | Target | Tool |
|--------|--------|------|
| Impression to Page View | > 8% | Store Console |
| Page View to Install | > 25% | Store Console |
| Keyword Rankings | Top 10 | Sensor Tower / AppTweak |
| Organic vs Paid | > 60% organic | Store Console |
| Day 1 retention | > 25% | Firebase / Adjust |

---

> **Philosophy:** ASO is SEO for apps. Discoverability drives downloads.

---

## Metadata Automation (fastlane deliver)

```bash
# Upload metadata to App Store
fastlane deliver --skip_binary_upload --skip_screenshots

# Upload metadata to Play Store
fastlane supply --skip_upload_apk --skip_upload_aab
```

Directory structure:
```
fastlane/metadata/
├── en-US/
│   ├── title.txt
│   ├── subtitle.txt
│   ├── description.txt
│   ├── keywords.txt
│   ├── promotional_text.txt
│   └── release_notes.txt
├── ja/
│   └── ...
```

---

> **Philosophy:** ASO is SEO for apps. Discoverability drives downloads.

---

## Troubleshooting

| Problem | Cause | Fix |
|---------|-------|-----|
| Keywords not ranking | Low installs for term | Target less competitive keywords |
| Conversion dropped | Screenshots outdated | Update with current UI |
| App rejected | Metadata mismatch | Screenshots must match build |
| Rating dropping | Bug in recent release | Hotfix + respond to reviews |
| Not appearing in search | Title too generic | Add category keyword to title |

---

> **Philosophy:** ASO is SEO for apps. Discoverability drives downloads.

---

## Anti-Patterns

| ❌ Don't | ✅ Do |
|---------|-------|
| Generic title | Include category + keyword |
| No keywords in first 3 lines | Front-load important terms |
| Outdated screenshots | Update with each major release |
| Ignoring bad reviews | Respond within 24 hours |
| Skip Promotional Text | Update for every campaign |
| Ignore privacy labels | Audit quarterly |

---

> **Philosophy:** ASO is SEO for apps. Discoverability drives downloads.

---

## 🔗 Related

| File | When to Read |
|------|-------------|
| [deep-linking.md](deep-linking-deep-link-types.md) | Store listing → app screen routing |
| [push-notifications.md](push-notifications-platform-services.md) | Re-engagement after install |
| [../frameworks/react-native.md](react-native-framework-decision.md) | RN build & EAS Submit |
| [../frameworks/flutter.md](flutter-widget-architecture.md) | Flutter build & Fastlane |
| [../frameworks/native.md](native-when-to-go-native.md) | Native build & Xcode Cloud |

---

## Rollback

Restore the baseline if required tooling errors or the procedure introduces a regression.

## Exit Gate

Require fresh evidence for the intended behavior and all applicable project checks.

<a id="rule-decision-trees-1-framework-selection"></a>

## Decision Trees: Framework Selection

**Impact:** high
**Kind:** decision
**Source:** `rules/decision-trees-1-framework-selection.md`

# Decision Trees: Framework Selection

## Decision

> Framework selection, state management, storage strategy, and context-based decisions.
> **These are THINKING guides, not copy-paste answers.**

---

## 1. Framework Selection

### Master Decision Tree

```
WHAT ARE YOU BUILDING?
        │
        ├── Need OTA updates without app store review?
        │   │
        │   ├── Yes → React Native + Expo
        │   │         ├── Expo Go for development
        │   │         ├── EAS Update for production OTA
        │   │         └── Best for: rapid iteration, web teams
        │   │
        │   └── No → Continue ▼
        │
        ├── Need pixel-perfect custom UI across platforms?
        │   │
        │   ├── Yes → Flutter
        │   │         ├── Custom rendering engine
        │   │         ├── Single UI for iOS + Android
        │   │         └── Best for: branded, visual apps
        │   │
        │   └── No → Continue ▼
        │
        ├── Heavy native features (ARKit, HealthKit, specific sensors)?
        │   │
        │   ├── iOS only → SwiftUI / UIKit
        │   │              └── Maximum native capability
        │   │
        │   ├── Android only → Kotlin + Jetpack Compose
        │   │                  └── Maximum native capability
        │   │
        │   └── Both → Consider native with shared logic
        │              └── Kotlin Multiplatform for shared
        │
        ├── Existing web team + TypeScript codebase?
        │   │
        │   └── Yes → React Native
        │             ├── Familiar paradigm for React devs
        │             ├── Share code with web (limited)
        │             └── Large ecosystem
        │
        └── Enterprise with existing Flutter team?
            │
            └── Yes → Flutter
                      └── Leverage existing expertise
```

### Framework Comparison

| Factor | React Native | Flutter | Native (Swift/Kotlin) |
|--------|-------------|---------|----------------------|
| **OTA Updates** | ✅ Expo | ❌ No | ❌ No |
| **Learning Curve** | Low (React devs) | Medium | Higher |
| **Performance** | Good | Excellent | Best |
| **UI Consistency** | Platform-native | Identical | Platform-native |
| **Bundle Size** | Medium | Larger | Smallest |
| **Native Access** | Via bridges | Via channels | Direct |
| **Hot Reload** | ✅ | ✅ | ✅ (Xcode 15+) |

### When to Choose Native

```
CHOOSE NATIVE WHEN:
├── Maximum performance required (games, 3D)
├── Deep OS integration needed
├── Platform-specific features are core
├── Team has native expertise
├── App store presence is primary
└── Long-term maintenance priority

AVOID NATIVE WHEN:
├── Limited budget/time
├── Need rapid iteration
├── Identical UI on both platforms
├── Team is web-focused
└── Cross-platform is priority
```

---

## Use When

Use when the documented constraints match observed repository and runtime evidence.

## Avoid When

Avoid when a simpler option satisfies the same constraints or evidence is unavailable.

## Trade-offs

Compare correctness, accessibility, operations, performance, migration cost, and reversibility.

## Verification

Test a representative scenario and the most important failure mode.

<a id="rule-decision-trees-2-state-management-selection-2"></a>

## Decision Trees: State Management Selection through 3. Navigation Pattern Selection

**Impact:** high
**Kind:** decision
**Source:** `rules/decision-trees-2-state-management-selection-2.md`

# Decision Trees: State Management Selection through 3. Navigation Pattern Selection

## Decision

> Framework selection, state management, storage strategy, and context-based decisions.
> **These are THINKING guides, not copy-paste answers.**

---

## 2. State Management Selection

### React Native State Decision

```
WHAT'S YOUR STATE COMPLEXITY?
        │
        ├── Simple app, few screens, minimal shared state
        │   │
        │   └── Zustand (or just useState/Context)
        │       ├── Minimal boilerplate
        │       ├── Easy to understand
        │       └── Scales OK to medium
        │
        ├── Primarily server data (API-driven)
        │   │
        │   └── TanStack Query (React Query) + Zustand
        │       ├── Query for server state
        │       ├── Zustand for UI state
        │       └── Excellent caching, refetching
        │
        ├── Complex app with many features
        │   │
        │   └── Redux Toolkit + RTK Query
        │       ├── Predicable, debuggable
        │       ├── RTK Query for API
        │       └── Good for large teams
        │
        └── Atomic, granular state needs
            │
            └── Jotai
                ├── Atom-based (like Recoil)
                ├── Minimizes re-renders
                └── Good for derived state
```

### Flutter State Decision

```
WHAT'S YOUR STATE COMPLEXITY?
        │
        ├── Simple app, learning Flutter
        │   │
        │   └── Provider (or setState)
        │       ├── Official, simple
        │       ├── Built into Flutter
        │       └── Good for small apps
        │
        ├── Modern, type-safe, testable
        │   │
        │   └── Riverpod 2.0
        │       ├── Compile-time safety
        │       ├── Code generation
        │       ├── Excellent for medium-large apps
        │       └── Recommended for new projects
        │
        ├── Enterprise, strict patterns needed
        │   │
        │   └── BLoC
        │       ├── Event → State pattern
        │       ├── Very testable
        │       ├── More boilerplate
        │       └── Good for large teams
        │
        └── Quick prototyping
            │
            └── GetX (⚠️ NOT recommended for production)
                ├── Fast to implement
                ├── Mixes concerns (state + nav + DI)
                ├── Poor testability at scale
                └── Consider Riverpod instead
```

### State Management Anti-Patterns

```
❌ DON'T:
├── Use global state for everything
├── Mix state management approaches
├── Store server state in local state
├── Skip state normalization
├── Overuse Context (re-render heavy)
└── Put navigation state in app state

✅ DO:
├── Server state → Query library
├── UI state → Minimal, local first
├── Lift state only when needed
├── Choose ONE approach per project
└── Keep state close to where it's used
```

---

> Framework selection, state management, storage strategy, and context-based decisions.
> **These are THINKING guides, not copy-paste answers.**

---

## 3. Navigation Pattern Selection

```
HOW MANY TOP-LEVEL DESTINATIONS?
        │
        ├── 2 destinations
        │   └── Consider: Top tabs or simple stack
        │
        ├── 3-5 destinations (equal importance)
        │   └── ✅ Tab Bar / Bottom Navigation
        │       ├── Most common pattern
        │       └── Easy discovery
        │
        ├── 5+ destinations
        │   │
        │   ├── All important → Drawer Navigation
        │   │                   └── Hidden but many options
        │   │
        │   └── Some less important → Tab bar + drawer hybrid
        │
        └── Single linear flow?
            └── Stack Navigation only
                └── Onboarding, checkout, etc.
```

### Navigation by App Type

| App Type | Pattern | Reason |
|----------|---------|--------|
| Social (Instagram) | Tab bar | Frequent switching |
| E-commerce | Tab bar + stack | Categories as tabs |
| Email (Gmail) | Drawer + list-detail | Many folders |
| Settings | Stack only | Deep drill-down |
| Onboarding | Stack wizard | Linear flow |
| Messaging | Tab (chats) + stack | Threads |

---

## Use When

Use when the documented constraints match observed repository and runtime evidence.

## Avoid When

Avoid when a simpler option satisfies the same constraints or evidence is unavailable.

## Trade-offs

Compare correctness, accessibility, operations, performance, migration cost, and reversibility.

## Verification

Test a representative scenario and the most important failure mode.

<a id="rule-decision-trees-4-storage-strategy-selection-3"></a>

## Decision Trees: Storage Strategy Selection through 5. Offline Strategy Selection

**Impact:** high
**Kind:** decision
**Source:** `rules/decision-trees-4-storage-strategy-selection-3.md`

# Decision Trees: Storage Strategy Selection through 5. Offline Strategy Selection

## Decision

> Framework selection, state management, storage strategy, and context-based decisions.
> **These are THINKING guides, not copy-paste answers.**

---

## 4. Storage Strategy Selection

```
WHAT TYPE OF DATA?
        │
        ├── Sensitive (tokens, passwords, keys)
        │   │
        │   └── ✅ Secure Storage
        │       ├── iOS: Keychain
        │       ├── Android: EncryptedSharedPreferences
        │       └── RN: expo-secure-store / react-native-keychain
        │
        ├── User preferences (settings, theme)
        │   │
        │   └── ✅ Key-Value Storage
        │       ├── iOS: UserDefaults
        │       ├── Android: SharedPreferences
        │       └── RN: AsyncStorage / MMKV
        │
        ├── Structured data (entities, relationships)
        │   │
        │   └── ✅ Database
        │       ├── SQLite (expo-sqlite, sqflite)
        │       ├── WatermelonDB (large datasets, RN)
        │       ├── Drift (SQLite wrapper, Flutter)
        │       └── ~~Realm~~ (❌ deprecated for new projects, consider alternatives)
        │
        ├── Large files (images, documents)
        │   │
        │   └── ✅ File System
        │       ├── iOS: Documents / Caches directory
        │       ├── Android: Internal/External storage
        │       └── RN: react-native-fs / expo-file-system
        │
        └── Cached API data
            │
            └── ✅ Query Library Cache
                ├── TanStack Query (RN)
                ├── Riverpod async (Flutter)
                └── Automatic invalidation
```

### Storage Comparison

| Storage | Speed | Security | Capacity | Use Case |
|---------|-------|----------|----------|----------|
| Secure Storage | Medium | 🔒 High | Small | Tokens, secrets |
| Key-Value | Fast | Low | Medium | Settings |
| SQLite | Fast | Low | Large | Structured data |
| File System | Medium | Low | Very Large | Media, documents |
| Query Cache | Fast | Low | Medium | API responses |

---

> Framework selection, state management, storage strategy, and context-based decisions.
> **These are THINKING guides, not copy-paste answers.**

---

## 5. Offline Strategy Selection

```
HOW CRITICAL IS OFFLINE?
        │
        ├── Nice to have (works when possible)
        │   │
        │   └── Cache last data + show stale
        │       ├── Simple implementation
        │       ├── TanStack Query with staleTime
        │       └── Show "last updated" timestamp
        │
        ├── Essential (core functionality offline)
        │   │
        │   └── Offline-first architecture
        │       ├── Local database as source of truth
        │       ├── Sync to server when online
        │       ├── Conflict resolution strategy
        │       └── Queue actions for later sync
        │
        └── Real-time critical (collaboration, chat)
            │
            └── WebSocket + local queue
                ├── Optimistic updates
                ├── Eventual consistency
                └── Complex conflict handling
```

### Offline Implementation Patterns

```
1. CACHE-FIRST (Simple)
   Request → Check cache → If stale, fetch → Update cache

2. STALE-WHILE-REVALIDATE
   Request → Return cached → Fetch update → Update UI

3. OFFLINE-FIRST (Complex)
   Action → Write to local DB → Queue sync → Sync when online

4. SYNC ENGINE
   Use: Firebase, Realm Sync, Supabase realtime
   Handles conflict resolution automatically
```

---

## Use When

Use when the documented constraints match observed repository and runtime evidence.

## Avoid When

Avoid when a simpler option satisfies the same constraints or evidence is unavailable.

## Trade-offs

Compare correctness, accessibility, operations, performance, migration cost, and reversibility.

## Verification

Test a representative scenario and the most important failure mode.

<a id="rule-decision-trees-6-authentication-pattern-selection-4"></a>

## Decision Trees: Authentication Pattern Selection through 8. Decision Checklist

**Impact:** high
**Kind:** decision
**Source:** `rules/decision-trees-6-authentication-pattern-selection-4.md`

# Decision Trees: Authentication Pattern Selection through 8. Decision Checklist

## Decision

> Framework selection, state management, storage strategy, and context-based decisions.
> **These are THINKING guides, not copy-paste answers.**

---

## 6. Authentication Pattern Selection

```
WHAT AUTH TYPE NEEDED?
        │
        ├── Simple email/password
        │   │
        │   └── Token-based (JWT)
        │       ├── Store refresh token securely
        │       ├── Access token in memory
        │       └── Silent refresh flow
        │
        ├── Social login (Google, Apple, etc.)
        │   │
        │   └── OAuth 2.0 + PKCE
        │       ├── Use platform SDKs
        │       ├── Deep link callback
        │       └── Apple Sign-In required for iOS
        │
        ├── Enterprise/SSO
        │   │
        │   └── OIDC / SAML
        │       ├── Web view or system browser
        │       └── Handle redirect properly
        │
        └── Biometric (FaceID, fingerprint)
            │
            └── Local auth + secure token
                ├── Biometrics unlock stored token
                ├── Not a replacement for server auth
                └── Fallback to PIN/password
```

### Auth Token Storage

```
❌ NEVER store tokens in:
├── AsyncStorage (plain text)
├── Redux/state (not persisted correctly)
├── Local storage equivalent
└── Logs or debug output

✅ ALWAYS store tokens in:
├── iOS: Keychain
├── Android: EncryptedSharedPreferences
├── Expo: SecureStore
├── Biometric-protected if available
```

---

> Framework selection, state management, storage strategy, and context-based decisions.
> **These are THINKING guides, not copy-paste answers.**

---

## 7. Project Type Templates

### E-Commerce App

```
RECOMMENDED STACK:
├── Framework: React Native + Expo (OTA for pricing)
├── Navigation: Tab bar (Home, Search, Cart, Account)
├── State: TanStack Query (products) + Zustand (cart)
├── Storage: SecureStore (auth) + SQLite (cart cache)
├── Offline: Cache products, queue cart actions
└── Auth: Email/password + Social + Apple Pay

KEY DECISIONS:
├── Product images: Lazy load, cache aggressively
├── Cart: Sync across devices via API
├── Checkout: Secure, minimal steps
└── Deep links: Product shares, marketing
```

### Social/Content App

```
RECOMMENDED STACK:
├── Framework: React Native or Flutter
├── Navigation: Tab bar (Feed, Search, Create, Notifications, Profile)
├── State: TanStack Query (feed) + Zustand (UI)
├── Storage: SQLite (feed cache, drafts)
├── Offline: Cache feed, queue posts
└── Auth: Social login primary, Apple required

KEY DECISIONS:
├── Feed: Infinite scroll, memoized items
├── Media: Upload queuing, background upload
├── Push: Deep link to content
└── Real-time: WebSocket for notifications
```

### Productivity/SaaS App

```
RECOMMENDED STACK:
├── Framework: Flutter (consistent UI) or RN
├── Navigation: Drawer or Tab bar
├── State: Riverpod/BLoC or Redux Toolkit
├── Storage: SQLite (offline), SecureStore (auth)
├── Offline: Full offline editing, sync
└── Auth: SSO/OIDC for enterprise

KEY DECISIONS:
├── Data sync: Conflict resolution strategy
├── Collaborative: Real-time or eventual?
├── Files: Large file handling
└── Enterprise: MDM, compliance
```

---

> Framework selection, state management, storage strategy, and context-based decisions.
> **These are THINKING guides, not copy-paste answers.**

---

## 8. Decision Checklist

### Before Starting ANY Project

- [ ] Target platforms defined (iOS/Android/both)?
- [ ] Framework selected based on criteria?
- [ ] State management approach chosen?
- [ ] Navigation pattern selected?
- [ ] Storage strategy for each data type?
- [ ] Offline requirements defined?
- [ ] Auth flow designed?
- [ ] Deep linking planned from start?

### Questions to Ask User

```
If project details are vague, ASK:

1. "Will this need OTA updates without app store review?"
   → Affects framework choice (Expo = yes)

2. "Do iOS and Android need identical UI?"
   → Affects framework (Flutter = identical)

3. "What's the offline requirement?"
   → Affects architecture complexity

4. "Is there an existing backend/auth system?"
   → Affects auth and API approach

5. "What devices? Phone only, or tablet?"
   → Affects navigation and layout

6. "Enterprise or consumer?"
   → Affects auth (SSO), security, compliance
```

---

## Use When

Use when the documented constraints match observed repository and runtime evidence.

## Avoid When

Avoid when a simpler option satisfies the same constraints or evidence is unavailable.

## Trade-offs

Compare correctness, accessibility, operations, performance, migration cost, and reversibility.

## Verification

Test a representative scenario and the most important failure mode.

<a id="rule-decision-trees-9-anti-pattern-decisions-5"></a>

## Decision Trees: Anti-Pattern Decisions through Related

**Impact:** high
**Kind:** decision
**Source:** `rules/decision-trees-9-anti-pattern-decisions-5.md`

# Decision Trees: Anti-Pattern Decisions through Related

## Decision

> Framework selection, state management, storage strategy, and context-based decisions.
> **These are THINKING guides, not copy-paste answers.**

---

## 9. Anti-Pattern Decisions

### ❌ Decision Anti-Patterns

| Anti-Pattern | Why It's Bad | Better Approach |
|--------------|--------------|-----------------|
| **Redux for simple app** | Massive overkill | Zustand or context |
| **Native for MVP** | Slow development | Cross-platform MVP |
| **Drawer for 3 sections** | Hidden navigation | Tab bar |
| **AsyncStorage for tokens** | Insecure | SecureStore |
| **No offline consideration** | Broken on subway | Plan from start |
| **Same stack for all projects** | Doesn't fit context | Evaluate per project |

---

> Framework selection, state management, storage strategy, and context-based decisions.
> **These are THINKING guides, not copy-paste answers.**

---

## 10. Quick Reference

### Framework Quick Pick

```
OTA needed?           → React Native + Expo
Identical UI?         → Flutter
Maximum performance?  → Native
Web team?            → React Native
Quick prototype?     → Expo
```

### State Quick Pick

```
Simple app?          → Zustand / Provider
Server-heavy?        → TanStack Query / Riverpod
Enterprise?          → Redux / BLoC
Atomic state?        → Jotai
```

### Storage Quick Pick

```
Secrets?             → SecureStore / Keychain
Settings?            → AsyncStorage / UserDefaults
Structured data?     → SQLite
API cache?           → Query library
```

---

> **Remember:** These trees are guides for THINKING, not rules to follow blindly. Every project has unique constraints. ASK clarifying questions when requirements are vague, and choose based on actual needs, not defaults.

---

> Framework selection, state management, storage strategy, and context-based decisions.
> **These are THINKING guides, not copy-paste answers.**

---

## 🔗 Related

| File | When to Read |
|------|-------------|
| [mobile-navigation.md](mobile-navigation-1-navigation-selection-decision-tree.md) | Deep-dive on navigation patterns |
| [mobile-backend.md](mobile-backend-mobile-backend-mindset.md) | Backend patterns for mobile clients |
| [mobile-performance.md](mobile-performance-1-the-mobile-performance-mindset.md) | Performance optimization |
| [mobile-testing.md](mobile-testing-mobile-testing-mindset.md) | Testing strategy selection |
| [../frameworks/react-native.md](react-native-framework-decision.md) | RN patterns after selection |
| [../frameworks/flutter.md](flutter-widget-architecture.md) | Flutter patterns after selection |
| [../frameworks/native.md](native-when-to-go-native.md) | Native patterns after selection |

---

## Use When

Use when the documented constraints match observed repository and runtime evidence.

## Avoid When

Avoid when a simpler option satisfies the same constraints or evidence is unavailable.

## Trade-offs

Compare correctness, accessibility, operations, performance, migration cost, and reversibility.

## Verification

Test a representative scenario and the most important failure mode.

<a id="rule-deep-linking-deep-link-types"></a>

## Deep Linking: Deep Link Types through Expo Configuration

**Impact:** high
**Kind:** reference
**Source:** `rules/deep-linking-deep-link-types.md`

# Deep Linking: Deep Link Types through Expo Configuration

## Scope

Apply this guidance only to the declared platforms and repository-confirmed versions.

## Guidance

> **Philosophy:** Every screen should be linkable. Users expect seamless web-to-app transitions.

---

## Deep Link Types

| Type | Description | Use Case |
|------|-------------|----------|
| **URI Scheme** | `myapp://path` | App-to-app, legacy |
| **Universal Links** (iOS) | `https://example.com/path` | Web-to-app, secure |
| **App Links** (Android) | `https://example.com/path` | Web-to-app, verified |
| **Deferred Deep Links** | Works even if app not installed | Marketing campaigns |

---

> **Philosophy:** Every screen should be linkable. Users expect seamless web-to-app transitions.

---

## Universal Links (iOS)

### 1. Host AASA File

```json
{
  "applinks": {
    "apps": [],
    "details": [
      {
        "appID": "TEAM_ID.com.example.myapp",
        "paths": [
          "/product/*",
          "/user/*",
          "NOT /admin/*"
        ]
      }
    ]
  }
}
```

**Host at:** `https://example.com/.well-known/apple-app-site-association`

**Critical:**
- Must be HTTPS, no redirects
- Must be valid JSON (no comments allowed)
- Content-Type: `application/json`
- File must be at root or `.well-known` path

### 2. Configure Entitlements

```xml
<!-- MyApp.entitlements -->
<key>com.apple.developer.associated-domains</key>
<array>
  <string>applinks:example.com</string>
  <string>applinks:www.example.com</string>
</array>
```

### 3. Handle in App (SwiftUI)

```swift
@main
struct MyApp: App {
    var body: some Scene {
        WindowGroup {
            ContentView()
                .onOpenURL { url in
                    DeepLinkRouter.handle(url)
                }
        }
    }
}
```

---

> **Philosophy:** Every screen should be linkable. Users expect seamless web-to-app transitions.

---

## App Links (Android)

### 1. Host assetlinks.json

```json
[{
  "relation": ["delegate_permission/common.handle_all_urls"],
  "target": {
    "namespace": "android_app",
    "package_name": "com.example.myapp",
    "sha256_cert_fingerprints": [
      "AA:BB:CC:DD:EE:FF:00:11:22:33:44:55:66:77:88:99:AA:BB:CC:DD:EE:FF:00:11:22:33:44:55:66:77:88:99"
    ]
  }
}]
```

**Host at:** `https://example.com/.well-known/assetlinks.json`

### 2. Configure AndroidManifest

```xml
<activity android:name=".MainActivity">
  <intent-filter android:autoVerify="true">
    <action android:name="android.intent.action.VIEW" />
    <category android:name="android.intent.category.DEFAULT" />
    <category android:name="android.intent.category.BROWSABLE" />
    <data android:scheme="https"
          android:host="example.com"
          android:pathPrefix="/product" />
  </intent-filter>
</activity>
```

### 3. Handle Intent (Compose)

```kotlin
@Composable
fun DeepLinkHandler(navController: NavController) {
    val context = LocalContext.current
    val activity = context as? Activity

    LaunchedEffect(Unit) {
        activity?.intent?.data?.let { uri ->
            when {
                uri.path?.startsWith("/product/") == true -> {
                    val id = uri.lastPathSegment
                    navController.navigate("product/$id")
                }
                uri.path?.startsWith("/user/") == true -> {
                    val id = uri.lastPathSegment
                    navController.navigate("user/$id")
                }
            }
        }
    }
}
```

---

> **Philosophy:** Every screen should be linkable. Users expect seamless web-to-app transitions.

---

## React Native Configuration

### React Navigation Deep Linking

```typescript
const linking = {
  prefixes: ['myapp://', 'https://example.com'],
  config: {
    screens: {
      Home: '',
      Product: 'product/:id',
      User: {
        path: 'user/:userId',
        parse: { userId: (id: string) => id },
      },
    },
  },
};

<NavigationContainer linking={linking}>
  {/* ... */}
</NavigationContainer>
```

### Listening for Links

```typescript
import { Linking } from 'react-native';

useEffect(() => {
  const subscription = Linking.addEventListener('url', ({ url }) => {
    handleDeepLink(url);
  });

  Linking.getInitialURL().then(url => {
    if (url) handleDeepLink(url);
  });

  return () => subscription.remove();
}, []);
```

---

> **Philosophy:** Every screen should be linkable. Users expect seamless web-to-app transitions.

---

## Expo Configuration

### expo-router (Recommended)

```typescript
// app/_layout.tsx — automatic file-based deep linking
export default function RootLayout() {
  return <Stack />;
}

// app/product/[id].tsx — matches /product/:id
export default function ProductScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return <ProductDetail id={id} />;
}
```

### app.json Configuration

```json
{
  "expo": {
    "scheme": "myapp",
    "web": { "bundler": "metro" },
    "plugins": [
      ["expo-router", { "origin": "https://example.com" }]
    ],
    "ios": {
      "associatedDomains": ["applinks:example.com"]
    },
    "android": {
      "intentFilters": [{
        "action": "VIEW",
        "autoVerify": true,
        "data": [{ "scheme": "https", "host": "example.com", "pathPrefix": "/product" }],
        "category": ["BROWSABLE", "DEFAULT"]
      }]
    }
  }
}
```

---

## Verification

Cross-check version-sensitive details with the cited official source and verify the resulting behavior in the target environment.

<a id="rule-deep-linking-flutter-configuration-2"></a>

## Deep Linking: Flutter Configuration through Testing Deep Links

**Impact:** high
**Kind:** reference
**Source:** `rules/deep-linking-flutter-configuration-2.md`

# Deep Linking: Flutter Configuration through Testing Deep Links

## Scope

Apply this guidance only to the declared platforms and repository-confirmed versions.

## Guidance

> **Philosophy:** Every screen should be linkable. Users expect seamless web-to-app transitions.

---

## Flutter Configuration

### GoRouter Deep Linking

```dart
final router = GoRouter(
  routes: [
    GoRoute(
      path: '/',
      builder: (context, state) => const HomeScreen(),
      routes: [
        GoRoute(
          path: 'product/:id',
          builder: (context, state) {
            final id = state.pathParameters['id']!;
            return ProductScreen(productId: id);
          },
        ),
        GoRoute(
          path: 'user/:userId',
          builder: (context, state) {
            final userId = state.pathParameters['userId']!;
            return UserScreen(userId: userId);
          },
        ),
      ],
    ),
  ],
);
```

### AndroidManifest (Flutter)

```xml
<!-- android/app/src/main/AndroidManifest.xml -->
<meta-data android:name="flutter_deeplinking_enabled" android:value="true" />

<intent-filter android:autoVerify="true">
  <action android:name="android.intent.action.VIEW" />
  <category android:name="android.intent.category.DEFAULT" />
  <category android:name="android.intent.category.BROWSABLE" />
  <data android:scheme="https" android:host="example.com" />
</intent-filter>
```

### iOS (Flutter)

Add associated domains in Xcode Runner target → Signing & Capabilities → Associated Domains: `applinks:example.com`

---

> **Philosophy:** Every screen should be linkable. Users expect seamless web-to-app transitions.

---

## Deferred Deep Linking

For users who don't have the app installed:

### Flow

```
1. User clicks link on web
2. Link detected: app not installed
3. Redirect to App Store / Play Store
4. User installs app
5. App opens and receives original deep link data
```

### Solutions

| Service | Features | Status |
|---------|----------|--------|
| **Branch.io** | Full attribution, deferred links | ✅ Active, recommended |
| **Adjust** | Analytics + attribution | ✅ Active |
| **AppsFlyer** | Marketing attribution focus | ✅ Active |
| ~~Firebase Dynamic Links~~ | ~~Free, Google ecosystem~~ | ❌ **Deprecated Aug 2025** |

### Branch.io Example

```typescript
import branch from 'react-native-branch';

// Listen for deep links
branch.subscribe(({ error, params }) => {
  if (error) return console.error(error);
  if (params['+clicked_branch_link']) {
    const productId = params.productId;
    navigation.navigate('Product', { id: productId });
  }
});

// Create deep link
const branchObject = await branch.createBranchUniversalObject('product/123', {
  title: 'Cool Product',
  contentDescription: 'Check out this product',
});

const { url } = await branchObject.generateShortUrl({
  feature: 'sharing',
  channel: 'sms',
});
```

---

> **Philosophy:** Every screen should be linkable. Users expect seamless web-to-app transitions.

---

## QR Code Deep Links

| Library | Platform | Purpose |
|---------|----------|---------|
| `react-native-qrcode-svg` | RN | Generate QR codes |
| `qr_flutter` | Flutter | Generate QR codes |
| Core Image (`CIFilter`) | iOS Native | Generate QR codes |
| `zxing` | Android | Generate/scan QR codes |

```typescript
// React Native QR generation
import QRCode from 'react-native-qrcode-svg';

<QRCode value="https://example.com/product/123" size={200} />
```

---

> **Philosophy:** Every screen should be linkable. Users expect seamless web-to-app transitions.

---

## Link Preview (OG Tags)

Universal Links display previews on social media. Add meta tags to your web pages:

```html
<meta property="og:title" content="Cool Product" />
<meta property="og:description" content="Check out this amazing product" />
<meta property="og:image" content="https://example.com/images/product.jpg" />
<meta property="og:url" content="https://example.com/product/123" />
```

---

> **Philosophy:** Every screen should be linkable. Users expect seamless web-to-app transitions.

---

## Privacy & Compliance

| Concern | Guidance |
|---------|---------|
| **ATT (iOS)** | Deep link attribution may require ATT prompt if tracking across apps |
| **GDPR** | Store referral data only with consent; honor right-to-erasure |
| **Fingerprinting** | Probabilistic matching (IP/UA) is restricted on iOS — avoid |
| **Data minimization** | Pass only necessary params in deep link URLs |

---

> **Philosophy:** Every screen should be linkable. Users expect seamless web-to-app transitions.

---

## Testing Deep Links

### iOS Simulator

```bash
xcrun simctl openurl booted "https://example.com/product/123"
```

### Android Emulator

```bash
adb shell am start -a android.intent.action.VIEW -d "https://example.com/product/123"
```

### Validation Tools

| Platform | Tool |
|----------|------|
| iOS | [Apple AASA Validator](https://search.developer.apple.com/appsearch-validation-tool/) |
| Android | `adb shell pm verify-app-links --re-verify com.example.myapp` |
| Branch | Branch link debugger dashboard |

---

## Verification

Cross-check version-sensitive details with the cited official source and verify the resulting behavior in the target environment.

<a id="rule-deep-linking-troubleshooting-3"></a>

## Deep Linking: Troubleshooting through Related

**Impact:** high
**Kind:** reference
**Source:** `rules/deep-linking-troubleshooting-3.md`

# Deep Linking: Troubleshooting through Related

## Scope

Apply only to the declared platforms and repository-confirmed versions.

## Guidance

> **Philosophy:** Every screen should be linkable. Users expect seamless web-to-app transitions.

---

## Troubleshooting

| Issue | Cause | Fix |
|-------|-------|-----|
| Links open in browser | AASA/assetlinks not found | Check file hosting, HTTPS, no redirects |
| Intermittent failures | System caching | Clear link cache, reinstall app |
| Only works on some links | Path matching wrong | Check path patterns in AASA/manifest |
| Doesn't work after install | Deferred linking not set up | Use Branch.io |
| AASA not found by Apple | Invalid JSON | Validate JSON (no comments), check Content-Type |
| App Links not verified | SHA256 mismatch | Re-generate fingerprint: `keytool -list -v` |

---

> **Philosophy:** Every screen should be linkable. Users expect seamless web-to-app transitions.

---

## Anti-Patterns

| ❌ Don't | ✅ Do |
|---------|-------|
| Use URI schemes for web-to-app | Use Universal Links / App Links |
| Rely on Firebase Dynamic Links | Migrate to Branch.io or custom |
| Put comments in AASA JSON | Valid JSON only |
| Skip deferred deep linking | Handle install-then-open flow |
| Ignore link previews | Add OG meta tags |
| Track without consent | ATT + GDPR compliance |

---

> **Philosophy:** Every screen should be linkable. Users expect seamless web-to-app transitions.

---

## 🔗 Related

| File | When to Read |
|------|-------------|
| [app-store-optimization.md](app-store-optimization-core-aso-elements.md) | Store listing with deep link targets |
| [push-notifications.md](push-notifications-platform-services.md) | Push → deep link to screen |
| [../frameworks/react-native.md](react-native-framework-decision.md) | RN navigation config |
| [../frameworks/flutter.md](flutter-widget-architecture.md) | GoRouter deep linking |
| [../frameworks/native.md](native-when-to-go-native.md) | SwiftUI/Compose navigation |

---

## Verification

Cross-check version-sensitive details with the cited official source and verify behavior in the target environment.

<a id="rule-flutter-ci-cd-build-3"></a>

## Flutter: CI/CD & Build through Related Sub-Skills

**Impact:** high
**Kind:** reference
**Source:** `rules/flutter-ci-cd-build-3.md`

# Flutter: CI/CD & Build through Related Sub-Skills

## Scope

Apply this guidance only to the declared platforms and repository-confirmed versions.

## Guidance

> **Philosophy:** Everything is a widget. Composition over inheritance. Dart-first.

---

## CI/CD & Build

### Fastlane

```bash
# iOS
fastlane ios beta     # TestFlight
fastlane ios release  # App Store

# Android
fastlane android beta     # Internal testing
fastlane android release  # Play Store
```

### Codemagic / GitHub Actions

```yaml
# codemagic.yaml
workflows:
  flutter-release:
    triggering:
      events: [push]
      branch_patterns: [main]
    scripts:
      - name: Build
        script: flutter build appbundle --release
    publishing:
      google_play:
        track: internal
```

---

> **Philosophy:** Everything is a widget. Composition over inheritance. Dart-first.

---

## Platform-Specific Code

```dart
import 'dart:io' show Platform;

Widget build(BuildContext context) {
  if (Platform.isIOS) {
    return CupertinoButton(child: Text('iOS Style'));
  }
  return ElevatedButton(child: Text('Material Style'));
}

// Or use flutter_platform_widgets for automatic switching
```

---

> **Philosophy:** Everything is a widget. Composition over inheritance. Dart-first.

---

## Anti-Patterns

| ❌ Don't | ✅ Do |
|---------|-------|
| Deep widget nesting | Extract to smaller widgets |
| Business logic in widgets | Clean Architecture layers |
| Ignore widget keys | Use keys for list items |
| Blocking main isolate | Use `compute()` for heavy work |
| Use Provider for new projects | Use Riverpod |
| Ignore sealed classes | Use exhaustive pattern matching |
| Skip error handling | Result type + global handlers |
| Hardcode API keys in code | Use `--dart-define` |

---

> **Philosophy:** Everything is a widget. Composition over inheritance. Dart-first.

---

## 🔗 Related Sub-Skills

| File | When to Read |
|------|-------------|
| [publishing/app-store-optimization.md](app-store-optimization-core-aso-elements.md) | Preparing for App Store / Play Store |
| [publishing/deep-linking.md](deep-linking-deep-link-types.md) | Universal links, app links |
| [publishing/push-notifications.md](push-notifications-platform-services.md) | FCM / APNs setup |

---

## Verification

Cross-check version-sensitive details with the cited official source and verify the resulting behavior in the target environment.

<a id="rule-flutter-performance-optimization-2"></a>

## Flutter: Performance Optimization through Security

**Impact:** high
**Kind:** reference
**Source:** `rules/flutter-performance-optimization-2.md`

# Flutter: Performance Optimization through Security

## Scope

Apply this guidance only to the declared platforms and repository-confirmed versions.

## Guidance

> **Philosophy:** Everything is a widget. Composition over inheritance. Dart-first.

---

## Performance Optimization

### const Constructors

```dart
// ✅ Good — const prevents rebuilds
const Padding(
  padding: EdgeInsets.all(16),
  child: Text('Hello'),
)

class MyIcon extends StatelessWidget {
  const MyIcon({super.key}); // const constructor
}
```

### ListView Optimization

```dart
// ✅ Good — lazy loading
ListView.builder(
  itemCount: items.length,
  itemBuilder: (context, index) => ItemTile(item: items[index]),
)

// ❌ Bad — loads all at once
ListView(
  children: items.map((i) => ItemTile(item: i)).toList(),
)
```

### Image Caching

```dart
CachedNetworkImage(
  imageUrl: url,
  placeholder: (context, url) => CircularProgressIndicator(),
  errorWidget: (context, url, error) => Icon(Icons.error),
)
```

---

> **Philosophy:** Everything is a widget. Composition over inheritance. Dart-first.

---

## Testing

### Testing Stack

| Type | Tool | Purpose |
|------|------|---------|
| Unit | `flutter_test` | Business logic, models |
| Widget | `flutter_test` + `mocktail` | UI components |
| Integration | `integration_test` | Full app flows |
| Golden | `golden_toolkit` | UI regression screenshots |

### Widget Test Example

```dart
testWidgets('Counter increments', (tester) async {
  await tester.pumpWidget(const MaterialApp(home: CounterPage()));

  expect(find.text('0'), findsOneWidget);

  await tester.tap(find.byIcon(Icons.add));
  await tester.pump();

  expect(find.text('1'), findsOneWidget);
});
```

### Riverpod Test Example

```dart
test('fetchUsers returns list', () async {
  final container = ProviderContainer(overrides: [
    apiClientProvider.overrideWithValue(MockApiClient()),
  ]);

  final users = await container.read(fetchUsersProvider.future);
  expect(users, isNotEmpty);
  expect(users.first.name, equals('John'));
});
```

---

> **Philosophy:** Everything is a widget. Composition over inheritance. Dart-first.

---

## Error Handling

### Global Error Handler

```dart
void main() {
  FlutterError.onError = (details) {
    FirebaseCrashlytics.instance.recordFlutterFatalError(details);
  };

  PlatformDispatcher.instance.onError = (error, stack) {
    FirebaseCrashlytics.instance.recordError(error, stack, fatal: true);
    return true;
  };

  runApp(const MyApp());
}
```

### Result Type Pattern

```dart
sealed class Result<T> {
  const Result();
}
class Success<T> extends Result<T> {
  final T data;
  const Success(this.data);
}
class Failure<T> extends Result<T> {
  final AppException error;
  const Failure(this.error);
}

// Usage
Future<Result<User>> getUser(String id) async {
  try {
    final user = await api.fetchUser(id);
    return Success(user);
  } on DioException catch (e) {
    return Failure(AppException.fromDio(e));
  }
}
```

---

> **Philosophy:** Everything is a widget. Composition over inheritance. Dart-first.

---

## Accessibility

| Element | Implementation |
|---------|---------------|
| Labels | `Semantics(label: 'Submit order', child: ...)` |
| Exclude | `ExcludeSemantics(child: decorativeIcon)` |
| Merge | `MergeSemantics(child: row)` |
| Custom actions | `SemanticsAction.tap`, `.scrollUp` |
| Focus order | `FocusTraversalOrder` |

### Dynamic Type

```dart
// Respect system text scale
final textScale = MediaQuery.textScaleFactorOf(context);

// Use relative sizes
Text('Hello', style: Theme.of(context).textTheme.bodyLarge)
```

### Testing A11y

```dart
testWidgets('has correct semantics', (tester) async {
  await tester.pumpWidget(const MyApp());
  final semantics = tester.getSemantics(find.byType(SubmitButton));
  expect(semantics.label, 'Submit order');
});
```

---

> **Philosophy:** Everything is a widget. Composition over inheritance. Dart-first.

---

## Offline Patterns

| Strategy | Package | Use Case |
|----------|---------|----------|
| API cache | `dio_cache_interceptor` | HTTP response caching |
| Key-value | `hive` / `shared_preferences` | Settings, tokens |
| Relational | `drift` (SQLite) | Complex queries, offline-first |
| Sync | `brick_offline_first` | Bi-directional sync |

### Connectivity-Aware Pattern

```dart
final connectivityProvider = StreamProvider<bool>((ref) {
  return Connectivity().onConnectivityChanged.map(
    (result) => result != ConnectivityResult.none,
  );
});

// In widget
final isOnline = ref.watch(connectivityProvider).valueOrNull ?? true;
if (!isOnline) showOfflineBanner();
```

---

> **Philosophy:** Everything is a widget. Composition over inheritance. Dart-first.

---

## Security

| Concern | Solution |
|---------|----------|
| Secrets storage | `flutter_secure_storage` (Keychain/Keystore) |
| API keys | `--dart-define=KEY=value` (compile-time) |
| SSL pinning | `dio` + `SecurityContext` |
| Root detection | `flutter_jailbreak_detection` |
| Code obfuscation | `flutter build --obfuscate --split-debug-info=debug/` |
| Secure network | Certificate pinning + TLS 1.3 |

---

## Verification

Cross-check version-sensitive details with the cited official source and verify the resulting behavior in the target environment.

<a id="rule-flutter-widget-architecture"></a>

## Flutter: Widget Architecture through Navigation (GoRouter)

**Impact:** high
**Kind:** reference
**Source:** `rules/flutter-widget-architecture.md`

# Flutter: Widget Architecture through Navigation (GoRouter)

## Scope

Apply this guidance only to the declared platforms and repository-confirmed versions.

## Guidance

> **Philosophy:** Everything is a widget. Composition over inheritance. Dart-first.

---

## Widget Architecture

### Widget Selection Matrix

| Need | Widget Type |
|------|-------------|
| Static content | StatelessWidget |
| Local state | StatefulWidget |
| Inherited data | InheritedWidget / Provider |
| Animations | AnimatedWidget / AnimatedBuilder |

### Composition Pattern

```dart
// ✅ Good — composed small widgets
class UserCard extends StatelessWidget {
  final User user;
  const UserCard({required this.user});

  @override
  Widget build(BuildContext context) {
    return Card(
      child: Column(
        children: [
          UserAvatar(url: user.avatarUrl),
          UserName(name: user.name),
          UserBio(bio: user.bio),
        ],
      ),
    );
  }
}

// ❌ Bad — monolithic widget with everything inline
```

---

> **Philosophy:** Everything is a widget. Composition over inheritance. Dart-first.

---

## State Management

### Riverpod (Recommended)

```dart
// 1. Define provider
@riverpod
Future<List<User>> fetchUsers(FetchUsersRef ref) async {
  final response = await ref.watch(apiClientProvider).get('/users');
  return response.data.map(User.fromJson).toList();
}

// 2. Consume in widget
class UserList extends ConsumerWidget {
  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final users = ref.watch(fetchUsersProvider);
    return users.when(
      data: (data) => ListView.builder(
        itemCount: data.length,
        itemBuilder: (_, i) => UserTile(user: data[i]),
      ),
      loading: () => const CircularProgressIndicator(),
      error: (e, st) => ErrorDisplay(error: e),
    );
  }
}
```

### State Management Selection

| Complexity | Solution | Status |
|------------|----------|--------|
| Simple | setState + InheritedWidget | Built-in |
| Medium | **Riverpod** | ✅ Recommended |
| Complex | **Riverpod + freezed** | ✅ Recommended |
| Legacy | Provider | Maintenance mode |
| Very Large | Bloc | Enterprise alternative |

---

> **Philosophy:** Everything is a widget. Composition over inheritance. Dart-first.

---

## Dart 3 Features

### Sealed Classes (Exhaustive Patterns)

```dart
sealed class AuthState {}
class Authenticated extends AuthState {
  final User user;
  Authenticated(this.user);
}
class Unauthenticated extends AuthState {}
class Loading extends AuthState {}

// Exhaustive switch — compiler enforces all cases
Widget buildAuth(AuthState state) => switch (state) {
  Authenticated(:final user) => HomeScreen(user: user),
  Unauthenticated() => LoginScreen(),
  Loading() => const CircularProgressIndicator(),
};
```

### Records & Destructuring

```dart
// Named record fields
typedef UserResult = ({User user, DateTime fetchedAt});

Future<UserResult> getUser(String id) async {
  final user = await api.fetchUser(id);
  return (user: user, fetchedAt: DateTime.now());
}

// Destructure
final (:user, :fetchedAt) = await getUser('123');
```

### Pattern Matching

```dart
// Guard clauses with patterns
String describe(Object obj) => switch (obj) {
  int n when n < 0 => 'negative',
  int n when n == 0 => 'zero',
  int n => 'positive: $n',
  String s when s.isEmpty => 'empty string',
  String s => 'string: $s',
  _ => 'unknown',
};
```

---

> **Philosophy:** Everything is a widget. Composition over inheritance. Dart-first.

---

## Architecture Patterns (Clean Architecture)

```
lib/
├── features/
│   └── user/
│       ├── presentation/    # Widgets, pages, controllers
│       ├── domain/          # Entities, use cases, repository interfaces
│       ├── data/            # Repository implementations, DTOs, data sources
│       └── providers/       # Riverpod providers for this feature
├── core/
│   ├── network/             # Dio client, interceptors
│   ├── error/               # Failure classes, error handling
│   └── utils/               # Extensions, helpers
└── main.dart
```

| Layer | Rule | Example |
|-------|------|---------|
| Presentation | Depends on Domain only | `UserPage`, `UserController` |
| Domain | No dependencies | `User`, `GetUserUseCase` |
| Data | Implements Domain interfaces | `UserRepositoryImpl`, `UserDto` |

---

> **Philosophy:** Everything is a widget. Composition over inheritance. Dart-first.

---

## Navigation (GoRouter)

```dart
final router = GoRouter(
  routes: [
    GoRoute(
      path: '/',
      builder: (context, state) => HomeScreen(),
      routes: [
        GoRoute(
          path: 'user/:id',
          builder: (context, state) {
            final id = state.pathParameters['id']!;
            return UserScreen(userId: id);
          },
        ),
      ],
    ),
  ],
);

// Deep linking automatic with GoRouter
```

---

## Verification

Cross-check version-sensitive details with the cited official source and verify the resulting behavior in the target environment.

<a id="rule-mobile-backend-1-push-notifications-2"></a>

## Mobile Backend: Push Notifications

**Impact:** high
**Kind:** reference
**Source:** `rules/mobile-backend-1-push-notifications-2.md`

# Mobile Backend: Push Notifications

## Scope

Apply this guidance only to the declared platforms and repository-confirmed versions.

## Guidance

> **This file covers backend/API patterns SPECIFIC to mobile clients.**
> Generic backend patterns are in `nodejs-best-practices` and `api-patterns`.
> **Mobile backend is NOT the same as web backend. Different constraints, different patterns.**

---

## 1. Push Notifications

### Platform Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    YOUR BACKEND                                  │
├─────────────────────────────────────────────────────────────────┤
│                         │                                        │
│              ┌──────────┴──────────┐                            │
│              ▼                     ▼                            │
│    ┌─────────────────┐   ┌─────────────────┐                    │
│    │   FCM (Google)  │   │  APNs (Apple)   │                    │
│    │   Firebase      │   │  Direct or FCM  │                    │
│    └────────┬────────┘   └────────┬────────┘                    │
│             │                     │                              │
│             ▼                     ▼                              │
│    ┌─────────────────┐   ┌─────────────────┐                    │
│    │ Android Device  │   │   iOS Device    │                    │
│    └─────────────────┘   └─────────────────┘                    │
└─────────────────────────────────────────────────────────────────┘
```

### Push Types

| Type | Use Case | User Sees |
|------|----------|-----------|
| **Display** | New message, order update | Notification banner |
| **Silent** | Background sync, content update | Nothing (background) |
| **Data** | Custom handling by app | Depends on app logic |

### Anti-Patterns

| ❌ NEVER | ✅ ALWAYS |
|----------|----------|
| Send sensitive data in push | Push says "New message", app fetches content |
| Overload with pushes | Batch, dedupe, respect quiet hours |
| Same message to all | Segment by user preference, timezone |
| Ignore failed tokens | Clean up invalid tokens regularly |
| Skip APNs for iOS | FCM alone doesn't guarantee iOS delivery |

### Token Management

```
TOKEN LIFECYCLE:
├── App registers → Get token → Send to backend
├── Token can change → App must re-register on start
├── Token expires → Clean from database
├── User uninstalls → Token becomes invalid (detect via error)
└── Multiple devices → Store multiple tokens per user
```

---

## Verification

Cross-check version-sensitive details with the cited official source and verify the resulting behavior in the target environment.

<a id="rule-mobile-backend-2-offline-sync-conflict-resolution-3"></a>

## Mobile Backend: Offline Sync & Conflict Resolution through 4. App Versioning

**Impact:** high
**Kind:** reference
**Source:** `rules/mobile-backend-2-offline-sync-conflict-resolution-3.md`

# Mobile Backend: Offline Sync & Conflict Resolution through 4. App Versioning

## Scope

Apply this guidance only to the declared platforms and repository-confirmed versions.

## Guidance

> **This file covers backend/API patterns SPECIFIC to mobile clients.**
> Generic backend patterns are in `nodejs-best-practices` and `api-patterns`.
> **Mobile backend is NOT the same as web backend. Different constraints, different patterns.**

---

## 2. Offline Sync & Conflict Resolution

### Sync Strategy Selection

```
WHAT TYPE OF DATA?
        │
        ├── Read-only (news, catalog)
        │   └── Simple cache + TTL
        │       └── ETag/Last-Modified for invalidation
        │
        ├── User-owned (notes, todos)
        │   └── Last-write-wins (simple)
        │       └── Or timestamp-based merge
        │
        ├── Collaborative (shared docs)
        │   └── CRDT or OT required
        │       └── Consider Firebase/Supabase
        │
        └── Critical (payments, inventory)
            └── Server is source of truth
                └── Optimistic UI + server confirmation
```

### Conflict Resolution Strategies

| Strategy | How It Works | Best For |
|----------|--------------|----------|
| **Last-write-wins** | Latest timestamp overwrites | Simple data, single user |
| **Server-wins** | Server always authoritative | Critical transactions |
| **Client-wins** | Offline changes prioritized | Offline-heavy apps |
| **Merge** | Combine changes field-by-field | Documents, rich content |
| **CRDT** | Mathematically conflict-free | Real-time collaboration |

### Sync Queue Pattern

```
CLIENT SIDE:
├── User makes change → Write to local DB
├── Add to sync queue → { action, data, timestamp, retries }
├── Network available → Process queue FIFO
├── Success → Remove from queue
├── Failure → Retry with backoff (max 5 retries)
└── Conflict → Apply resolution strategy

SERVER SIDE:
├── Accept change with client timestamp
├── Compare with server version
├── Apply conflict resolution
├── Return merged state
└── Client updates local with server response
```

---

> **This file covers backend/API patterns SPECIFIC to mobile clients.**
> Generic backend patterns are in `nodejs-best-practices` and `api-patterns`.
> **Mobile backend is NOT the same as web backend. Different constraints, different patterns.**

---

## 3. Mobile API Optimization

### Response Size Reduction

| Technique | Savings | Implementation |
|-----------|---------|----------------|
| **Field selection** | 30-70% | `?fields=id,name,thumbnail` |
| **Compression** | 60-80% | gzip/brotli (automatic) |
| **Pagination** | Varies | Cursor-based for mobile |
| **Image variants** | 50-90% | `/image?w=200&q=80` |
| **Delta sync** | 80-95% | Only changed records since timestamp |

### Pagination: Cursor vs Offset

```
OFFSET (Bad for mobile):
├── Page 1: OFFSET 0 LIMIT 20
├── Page 2: OFFSET 20 LIMIT 20
├── Problem: New item added → duplicates!
└── Problem: Large offset = slow query

CURSOR (Good for mobile):
├── First: ?limit=20
├── Next: ?limit=20&after=cursor_abc123
├── Cursor = encoded (id + sort values)
├── No duplicates on data changes
└── Consistent performance
```

### Batch Requests

```
Instead of:
GET /users/1
GET /users/2
GET /users/3
(3 round trips, 3x latency)

Use:
POST /batch
{ requests: [
    { method: "GET", path: "/users/1" },
    { method: "GET", path: "/users/2" },
    { method: "GET", path: "/users/3" }
]}
(1 round trip)
```

---

> **This file covers backend/API patterns SPECIFIC to mobile clients.**
> Generic backend patterns are in `nodejs-best-practices` and `api-patterns`.
> **Mobile backend is NOT the same as web backend. Different constraints, different patterns.**

---

## 4. App Versioning

### Version Check Endpoint

```
GET /api/app-config
Headers:
  X-App-Version: 2.1.0
  X-Platform: ios
  X-Device-ID: abc123

Response:
{
  "minimum_version": "2.0.0",
  "latest_version": "2.3.0",
  "force_update": false,
  "update_url": "https://apps.apple.com/...",
  "feature_flags": {
    "new_player": true,
    "dark_mode": true
  },
  "maintenance": false,
  "maintenance_message": null
}
```

### Version Comparison Logic

```
CLIENT VERSION vs MINIMUM VERSION:
├── client >= minimum → Continue normally
├── client < minimum → Show force update screen
│   └── Block app usage until updated
└── client < latest → Show optional update prompt

FEATURE FLAGS:
├── Enable/disable features without app update
├── A/B testing by version/device
└── Gradual rollout (10% → 50% → 100%)
```

---

## Verification

Cross-check version-sensitive details with the cited official source and verify the resulting behavior in the target environment.

<a id="rule-mobile-backend-5-authentication-for-mobile-4"></a>

## Mobile Backend: Authentication for Mobile through 7. Media & Binary Handling

**Impact:** high
**Kind:** reference
**Source:** `rules/mobile-backend-5-authentication-for-mobile-4.md`

# Mobile Backend: Authentication for Mobile through 7. Media & Binary Handling

## Scope

Apply this guidance only to the declared platforms and repository-confirmed versions.

## Guidance

> **This file covers backend/API patterns SPECIFIC to mobile clients.**
> Generic backend patterns are in `nodejs-best-practices` and `api-patterns`.
> **Mobile backend is NOT the same as web backend. Different constraints, different patterns.**

---

## 5. Authentication for Mobile

### Token Strategy

```
ACCESS TOKEN:
├── Short-lived (15 min - 1 hour)
├── Stored in memory (not persistent)
├── Used for API requests
└── Refresh when expired

REFRESH TOKEN:
├── Long-lived (30-90 days)
├── Stored in SecureStore/Keychain
├── Used only to get new access token
└── Rotate on each use (security)

DEVICE TOKEN:
├── Identifies this device
├── Allows "log out all devices"
├── Stored alongside refresh token
└── Server tracks active devices
```

### Silent Re-authentication

```
REQUEST FLOW:
├── Make request with access token
├── 401 Unauthorized?
│   ├── Have refresh token?
│   │   ├── Yes → Call /auth/refresh
│   │   │   ├── Success → Retry original request
│   │   │   └── Failure → Force logout
│   │   └── No → Force logout
│   └── Token just expired (not invalid)
│       └── Auto-refresh, user doesn't notice
└── Success → Continue
```

---

> **This file covers backend/API patterns SPECIFIC to mobile clients.**
> Generic backend patterns are in `nodejs-best-practices` and `api-patterns`.
> **Mobile backend is NOT the same as web backend. Different constraints, different patterns.**

---

## 6. Error Handling for Mobile

### Mobile-Specific Error Format

```json
{
  "error": {
    "code": "PAYMENT_DECLINED",
    "message": "Your payment was declined",
    "user_message": "Please check your card details or try another payment method",
    "action": {
      "type": "navigate",
      "destination": "payment_methods"
    },
    "retry": {
      "allowed": true,
      "after_seconds": 5
    }
  }
}
```

### Error Categories

| Code Range | Category | Mobile Handling |
|------------|----------|-----------------|
| 400-499 | Client error | Show message, user action needed |
| 401 | Auth expired | Silent refresh or re-login |
| 403 | Forbidden | Show upgrade/permission screen |
| 404 | Not found | Remove from local cache |
| 409 | Conflict | Show sync conflict UI |
| 429 | Rate limit | Retry after header, backoff |
| 500-599 | Server error | Retry with backoff, show "try later" |
| Network | No connection | Use cached data, queue for sync |

---

> **This file covers backend/API patterns SPECIFIC to mobile clients.**
> Generic backend patterns are in `nodejs-best-practices` and `api-patterns`.
> **Mobile backend is NOT the same as web backend. Different constraints, different patterns.**

---

## 7. Media & Binary Handling

### Image Optimization

```
CLIENT REQUEST:
GET /images/{id}?w=400&h=300&q=80&format=webp

SERVER RESPONSE:
├── Resize on-the-fly OR use CDN
├── WebP for Android (smaller)
├── HEIC for iOS 14+ (if supported)
├── JPEG fallback
└── Cache-Control: max-age=31536000
```

### Chunked Upload (Large Files)

```
UPLOAD FLOW:
1. POST /uploads/init
   { filename, size, mime_type }
   → { upload_id, chunk_size }

2. PUT /uploads/{upload_id}/chunks/{n}
   → Upload each chunk (1-5 MB)
   → Can resume if interrupted

3. POST /uploads/{upload_id}/complete
   → Server assembles chunks
   → Return final file URL
```

### Streaming Audio/Video

```
REQUIREMENTS:
├── HLS (HTTP Live Streaming) for iOS
├── DASH or HLS for Android
├── Multiple quality levels (adaptive bitrate)
├── Range request support (seeking)
└── Offline download chunks

ENDPOINTS:
GET /media/{id}/manifest.m3u8  → HLS manifest
GET /media/{id}/segment_{n}.ts → Video segment
GET /media/{id}/download       → Full file for offline
```

---

## Verification

Cross-check version-sensitive details with the cited official source and verify the resulting behavior in the target environment.

<a id="rule-mobile-backend-8-security-for-mobile-5"></a>

## Mobile Backend: Security for Mobile through Related

**Impact:** high
**Kind:** reference
**Source:** `rules/mobile-backend-8-security-for-mobile-5.md`

# Mobile Backend: Security for Mobile through Related

## Scope

Apply this guidance only to the declared platforms and repository-confirmed versions.

## Guidance

> **This file covers backend/API patterns SPECIFIC to mobile clients.**
> Generic backend patterns are in `nodejs-best-practices` and `api-patterns`.
> **Mobile backend is NOT the same as web backend. Different constraints, different patterns.**

---

## 8. Security for Mobile

### Device Attestation

```
VERIFY REAL DEVICE (not emulator/bot):
├── iOS: DeviceCheck API
│   └── Server verifies with Apple
├── Android: Play Integrity API (replaces SafetyNet)
│   └── Server verifies with Google
└── Fail closed: Reject if attestation fails
```

### Request Signing

```
CLIENT:
├── Create signature = HMAC(timestamp + path + body, secret)
├── Send: X-Signature: {signature}
├── Send: X-Timestamp: {timestamp}
└── Send: X-Device-ID: {device_id}

SERVER:
├── Validate timestamp (within 5 minutes)
├── Recreate signature with same inputs
├── Compare signatures
└── Reject if mismatch (tampering detected)
```

### Rate Limiting

```
MOBILE-SPECIFIC LIMITS:
├── Per device (X-Device-ID)
├── Per user (after auth)
├── Per endpoint (stricter for sensitive)
└── Sliding window preferred

HEADERS:
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1609459200
Retry-After: 60 (when 429)
```

---

> **This file covers backend/API patterns SPECIFIC to mobile clients.**
> Generic backend patterns are in `nodejs-best-practices` and `api-patterns`.
> **Mobile backend is NOT the same as web backend. Different constraints, different patterns.**

---

## 9. Monitoring & Analytics

### Required Headers from Mobile

```
Every mobile request should include:
├── X-App-Version: 2.1.0
├── X-Platform: ios | android
├── X-OS-Version: 17.0
├── X-Device-Model: iPhone15,2
├── X-Device-ID: uuid (persistent)
├── X-Request-ID: uuid (per request, for tracing)
├── Accept-Language: tr-TR
└── X-Timezone: Europe/Istanbul
```

### What to Log

```
FOR EACH REQUEST:
├── All headers above
├── Endpoint, method, status
├── Response time
├── Error details (if any)
└── User ID (if authenticated)

ALERTS:
├── Error rate > 5% per version
├── P95 latency > 2 seconds
├── Specific version crash spike
├── Auth failure spike (attack?)
└── Push delivery failure spike
```

---

> **This file covers backend/API patterns SPECIFIC to mobile clients.**
> Generic backend patterns are in `nodejs-best-practices` and `api-patterns`.
> **Mobile backend is NOT the same as web backend. Different constraints, different patterns.**

---

## 📝 MOBILE BACKEND CHECKLIST

### Before API Design
- [ ] Identified mobile-specific requirements?
- [ ] Planned offline behavior?
- [ ] Designed sync strategy?
- [ ] Considered bandwidth constraints?

### For Every Endpoint
- [ ] Response as small as possible?
- [ ] Pagination cursor-based?
- [ ] Proper caching headers?
- [ ] Mobile error format with actions?

### Authentication
- [ ] Token refresh implemented?
- [ ] Silent re-auth flow?
- [ ] Multi-device logout?
- [ ] Secure token storage guidance?

### Push Notifications
- [ ] FCM + APNs configured?
- [ ] Token lifecycle managed?
- [ ] Silent vs display push defined?
- [ ] Sensitive data NOT in push payload?

### Release
- [ ] Version check endpoint ready?
- [ ] Feature flags configured?
- [ ] Force update mechanism?
- [ ] Monitoring headers required?

---

> **Remember:** Mobile backend must be resilient to bad networks, respect battery life, and handle interrupted sessions gracefully. The client cannot be trusted, but it also cannot be hung up—provide offline capabilities and clear error recovery paths.

---

> **This file covers backend/API patterns SPECIFIC to mobile clients.**
> Generic backend patterns are in `nodejs-best-practices` and `api-patterns`.
> **Mobile backend is NOT the same as web backend. Different constraints, different patterns.**

---

## 🔗 Related

| File | When to Read |
|------|-------------|
| [decision-trees.md](decision-trees-1-framework-selection.md) | Auth, storage, offline strategy selection |
| [mobile-performance.md](mobile-performance-1-the-mobile-performance-mindset.md) | Network/image performance |
| [mobile-testing.md](mobile-testing-mobile-testing-mindset.md) | API testing strategies |
| [../publishing/push-notifications.md](push-notifications-platform-services.md) | Push notification patterns |
| [../publishing/deep-linking.md](deep-linking-deep-link-types.md) | Deep link routing |

---

## Verification

Cross-check version-sensitive details with the cited official source and verify the resulting behavior in the target environment.

<a id="rule-mobile-backend-mobile-backend-mindset"></a>

## Mobile Backend: MOBILE BACKEND MINDSET through AI MOBILE BACKEND ANTI-PATTERNS

**Impact:** high
**Kind:** reference
**Source:** `rules/mobile-backend-mobile-backend-mindset.md`

# Mobile Backend: MOBILE BACKEND MINDSET through AI MOBILE BACKEND ANTI-PATTERNS

## Scope

Apply this guidance only to the declared platforms and repository-confirmed versions.

## Guidance

> **This file covers backend/API patterns SPECIFIC to mobile clients.**
> Generic backend patterns are in `nodejs-best-practices` and `api-patterns`.
> **Mobile backend is NOT the same as web backend. Different constraints, different patterns.**

---

## 🧠 MOBILE BACKEND MINDSET

```
Mobile clients are DIFFERENT from web clients:
├── Unreliable network (2G, subway, elevator)
├── Battery constraints (minimize wake-ups)
├── Limited storage (can't cache everything)
├── Interrupted sessions (calls, notifications)
├── Diverse devices (old phones to flagships)
└── Binary updates are slow (App Store review)
```

**Your backend must compensate for ALL of these.**

---

> **This file covers backend/API patterns SPECIFIC to mobile clients.**
> Generic backend patterns are in `nodejs-best-practices` and `api-patterns`.
> **Mobile backend is NOT the same as web backend. Different constraints, different patterns.**

---

## 🚫 AI MOBILE BACKEND ANTI-PATTERNS

### These are common AI mistakes when building mobile backends:

| ❌ AI Default | Why It's Wrong | ✅ Mobile-Correct |
|---------------|----------------|-------------------|
| Same API for web and mobile | Mobile needs compact responses | Separate mobile endpoints OR field selection |
| Full object responses | Wastes bandwidth, battery | Partial responses, pagination |
| No offline consideration | App crashes without network | Offline-first design, sync queues |
| WebSocket for everything | Battery drain | Push notifications + polling fallback |
| No app versioning | Can't force updates, breaking changes | Version headers, minimum version check |
| Generic error messages | Users can't fix issues | Mobile-specific error codes + recovery actions |
| Session-based auth | Mobile apps restart | Token-based with refresh |
| Ignore device info | Can't debug issues | Device ID, app version in headers |

---

## Verification

Cross-check version-sensitive details with the cited official source and verify the resulting behavior in the target environment.

<a id="rule-mobile-color-system-1-mobile-color-fundamentals"></a>

## Mobile Color System: Mobile Color Fundamentals through 3. Dark Mode Design

**Impact:** high
**Kind:** reference
**Source:** `rules/mobile-color-system-1-mobile-color-fundamentals.md`

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

<a id="rule-mobile-color-system-4-outdoor-visibility-2"></a>

## Mobile Color System: Outdoor Visibility through 7. Color Accessibility

**Impact:** high
**Kind:** reference
**Source:** `rules/mobile-color-system-4-outdoor-visibility-2.md`

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

<a id="rule-mobile-color-system-8-color-anti-patterns-3"></a>

## Mobile Color System: Color Anti-Patterns through Related

**Impact:** high
**Kind:** reference
**Source:** `rules/mobile-color-system-8-color-anti-patterns-3.md`

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

<a id="rule-mobile-debugging-debugging-mindset"></a>

## Mobile Debugging: Debugging Mindset through Flutter Debugging Tools

**Impact:** high
**Kind:** process
**Source:** `rules/mobile-debugging-debugging-mindset.md`

# Mobile Debugging: Debugging Mindset through Flutter Debugging Tools

## Preconditions

Capture the baseline, target environment, acceptance criteria, and rollback point.

## Procedure

> **Stop console.log() debugging!**
> Mobile apps have complex native layers. Text logs are not enough.

---

## Debugging Mindset

```
Web Debugging:      Mobile Debugging:
┌──────────────┐    ┌──────────────┐
│  Browser     │    │  JS Bridge   │
│  DevTools    │    │  Native UI   │
│  Network Tab │    │  GPU/Memory  │
└──────────────┘    │  Threads     │
                    └──────────────┘
```

**Key Differences:**
1. **Native Layer** — JS code works, but app crashes? It's likely native (Java/Obj-C/Swift/Kotlin).
2. **Deployment** — You can't just "refresh". State gets lost or stuck.
3. **Network** — SSL Pinning, proxy settings are harder.
4. **Device Logs** — `adb logcat` and Console.app are your truth.

---

> **Stop console.log() debugging!**
> Mobile apps have complex native layers. Text logs are not enough.

---

## Crash Triage: Red Screen vs Crash to Home

### JS Error (Red Screen / LogBox)

```
SYMPTOMS:
├── Red error screen (dev mode)
├── LogBox warning or error
├── "undefined is not an object"
├── "Cannot read property of null"

DIAGNOSIS:
├── Read the stack trace on screen
├── Check component tree
├── Look for missing imports / undefined props
└── Usually clear from the error message
```

### Native Crash (App Closes to Home Screen)

```
SYMPTOMS:
├── App disappears without JS error
├── White flash then home screen
├── Hang → force close

DIAGNOSIS:
├── Android: adb logcat *:E | grep -i 'fatal\|crash'
├── iOS: Xcode → Window → Devices → View Device Logs
├── Check Info.plist / AndroidManifest.xml
└── Check native module compatibility

COMMON CAUSES:
├── Missing permission declaration
├── Native module version mismatch
├── Memory exhaustion (OOM)
├── Incorrect entitlements (iOS)
└── ProGuard/R8 stripping required classes (Android)
```

> **💡 Pro Tip:** If app crashes immediately on launch, inspect native configuration first, then verify the failure with platform logs.

---

> **Stop console.log() debugging!**
> Mobile apps have complex native layers. Text logs are not enough.

---

## React Native Debugging Tools

### Primary Tools

| Tool | Purpose | Status |
|------|---------|--------|
| **React DevTools** | Component tree, props, state inspection | ✅ Active (recommended) |
| **React Native DevTools** | Integrated debugger (RN 0.76+) | ✅ Active |
| **Reactotron** | State/API/Redux/AsyncStorage inspection | ✅ Active |
| **Expo Dev Tools** | Element inspector, network, performance | ✅ Active (Expo projects) |
| ~~Flipper~~ | ~~Layout/Network/DB~~ | ❌ **Deprecated for RN** |

> **Note:** Flipper was deprecated from React Native in late 2024. Use React Native DevTools (built-in) or Reactotron instead.

### React Native DevTools (RN 0.76+)

```
Access: press j in Metro terminal
├── Component Inspector
├── Network Inspector
├── Console
├── Profiler
└── Works in dev mode only
```

### Reactotron Setup

```bash
npm install reactotron-react-native
```

```typescript
// ReactotronConfig.ts
import Reactotron from 'reactotron-react-native';

Reactotron.configure()
  .useReactNative({
    networking: { ignoreUrls: /symbolicate/ },
    storybook: true,
  })
  .connect();
```

Features: API requests, state snapshots, Redux actions, AsyncStorage, custom logs.

---

> **Stop console.log() debugging!**
> Mobile apps have complex native layers. Text logs are not enough.

---

## Flutter Debugging Tools

### Flutter DevTools

```
Access: flutter run → press v (opens DevTools in browser)

Available tabs:
├── Flutter Inspector — Widget tree, layout explorer
├── Performance — Frame rendering, jank detection
├── CPU Profiler — Function-level CPU usage
├── Memory — Allocation tracking, leak detection
├── Network — HTTP requests
├── Logging — Structured logs
└── App Size — Bundle analysis
```

### Flutter-Specific Debugging

```dart
// Layout debugging
debugPaintSizeEnabled = true;       // Show widget boundaries
debugPaintBaselinesEnabled = true;  // Show text baselines
debugPaintPointersEnabled = true;   // Show touch points

// Performance debugging
debugProfileBuildsEnabled = true;   // Log widget builds
debugPrintRebuildDirtyWidgets = true; // Print rebuild reasons

// Always run in profile mode for perf testing:
// flutter run --profile
```

### Widget Inspector

```
Access: press i in terminal (or DevTools)
├── Select widget on device
├── See widget tree hierarchy
├── View properties and constraints
├── Hot-reload after changes
└── Debug layout overflow issues
```

---

## Rollback

Restore the baseline if required tooling errors or the procedure introduces a regression.

## Exit Gate

Require fresh evidence for the intended behavior and all applicable project checks.

<a id="rule-mobile-debugging-native-platform-debugging-2"></a>

## Mobile Debugging: Native Platform Debugging through Memory Leak Detection

**Impact:** high
**Kind:** process
**Source:** `rules/mobile-debugging-native-platform-debugging-2.md`

# Mobile Debugging: Native Platform Debugging through Memory Leak Detection

## Preconditions

Capture the baseline, target environment, acceptance criteria, and rollback point.

## Procedure

> **Stop console.log() debugging!**
> Mobile apps have complex native layers. Text logs are not enough.

---

## Native Platform Debugging

### iOS (Xcode)

| Tool | Purpose | Access |
|------|---------|--------|
| **Console.app** | System logs, crash reports | Applications → Utilities |
| **Xcode Instruments** | Time Profiler, Allocations, Leaks | Product → Profile |
| **View Debugger** | 3D UI hierarchy | Debug → View Debugging |
| **Memory Graph** | Retain cycle detection | Debug → Debug Memory Graph |
| **Network Link Conditioner** | Simulate slow networks | Settings → Developer |

### Android (Android Studio)

| Tool | Purpose | Access |
|------|---------|--------|
| **Logcat** | System logs, crash traces | `adb logcat` or Android Studio |
| **Android Profiler** | CPU, Memory, Network, Energy | View → Tool Windows → Profiler |
| **Layout Inspector** | UI hierarchy debugging | Tools → Layout Inspector |
| **StrictMode** | Detect disk/network on main thread | Enable in Developer Options |
| **GPU Rendering** | Frame rendering profiler | Developer Options → Profile GPU |

### Key Native Commands

```bash
# Android — filter for crashes
adb logcat *:E | grep -i 'fatal\|crash\|exception'

# Android — clear and watch
adb logcat -c && adb logcat *:W

# Android — specific app
adb logcat --pid=$(adb shell pidof -s com.example.myapp)

# iOS — open device logs
open /Applications/Utilities/Console.app

# iOS — view crash logs
xcrun simctl spawn booted log stream --predicate 'process == "MyApp"'
```

---

> **Stop console.log() debugging!**
> Mobile apps have complex native layers. Text logs are not enough.

---

## Network Debugging

### Problem: No Browser DevTools Network Tab

**Solution 1: Built-in tools**
- React Native DevTools (RN 0.76+): Network tab
- Reactotron: Auto-captures all requests
- Flutter DevTools: Network tab

**Solution 2: Proxy (see ALL traffic including native SDKs)**

| Tool | Platform | Free | SSL Support |
|------|----------|:----:|:-----------:|
| **Proxyman** | macOS | ✅ (basic) | ✅ |
| **Charles Proxy** | All | Trial | ✅ |
| **mitmproxy** | All | ✅ | ✅ |

```
Setup:
1. Install proxy tool
2. Install SSL certificate on device/simulator
3. Configure device proxy settings → proxy IP:port
4. See ALL HTTP/HTTPS traffic
```

---

> **Stop console.log() debugging!**
> Mobile apps have complex native layers. Text logs are not enough.

---

## Memory Leak Detection

### Common Leak Sources

| Source | Platform | Detection |
|--------|----------|-----------|
| Uncleared timers | RN/Flutter | Profiler → steady memory growth |
| Event listeners not removed | RN | Profiler + useEffect cleanup |
| Stream subscriptions | Flutter | DevTools Memory tab |
| Large image cache | Both | Memory tab → allocation timeline |
| Async after unmount | RN | LogBox warning + AbortController |
| AnimationController not disposed | Flutter | DevTools Memory + lint |

### Memory Profiling Workflow

```
1. Open profiler (DevTools / Instruments / Android Profiler)
2. Perform suspected leaking action
3. Navigate away from screen
4. Force garbage collection (GC button)
5. Check: does memory return to baseline?
6. If NO → leak detected
7. Take heap snapshot to find retained objects
```

### React Native Memory Check

```typescript
// Check for cleanup
useEffect(() => {
  const subscription = eventEmitter.addListener('event', handler);
  const interval = setInterval(fetchData, 5000);
  const controller = new AbortController();

  return () => {
    subscription.remove();     // ✅ Clean listener
    clearInterval(interval);   // ✅ Clean timer
    controller.abort();        // ✅ Cancel async
  };
}, []);
```

### Flutter Memory Check

```dart
@override
void dispose() {
  _controller.dispose();       // ✅ Animation controller
  _subscription.cancel();      // ✅ Stream subscription
  _textController.dispose();   // ✅ Text controller
  _focusNode.dispose();        // ✅ Focus node
  super.dispose();
}
```

---

## Rollback

Restore the baseline if required tooling errors or the procedure introduces a regression.

## Exit Gate

Require fresh evidence for the intended behavior and all applicable project checks.

<a id="rule-mobile-debugging-platform-specific-nightmares-3"></a>

## Mobile Debugging: Platform-Specific Nightmares through Related

**Impact:** high
**Kind:** process
**Source:** `rules/mobile-debugging-platform-specific-nightmares-3.md`

# Mobile Debugging: Platform-Specific Nightmares through Related

## Preconditions

Capture the baseline, target environment, acceptance criteria, and rollback point.

## Procedure

> **Stop console.log() debugging!**
> Mobile apps have complex native layers. Text logs are not enough.

---

## Platform-Specific Nightmares

### Android

| Problem | Cause | Fix |
|---------|-------|-----|
| Gradle sync fail | Java version mismatch | Check `JAVA_HOME`, use JDK 17 |
| Emulator `localhost` | Different network | Use `10.0.2.2` instead of `127.0.0.1` |
| Cached builds | Stale native artifacts | `./gradlew clean` |
| Duplicate classes | Dependency conflict | Check `./gradlew dependencies` |
| R8/ProGuard | Strips used classes | Add keep rules |

### iOS

| Problem | Cause | Fix |
|---------|-------|-----|
| Pod issues | Cache/version mismatch | `pod deintegrate && pod install` |
| Signing errors | Team ID / bundle ID | Check Signing & Capabilities |
| Build cache | Stale artifacts | Product → Clean Build Folder |
| Simulator crash | Missing entitlements | Check .entitlements file |
| Archive fails | Debug-only code | Check `#if DEBUG` guards |

### React Native Build Cleaning

```bash
# Nuclear clean (when nothing works)
# Android
cd android && ./gradlew clean && cd ..

# iOS
cd ios && pod deintegrate && pod install && cd ..

# Metro cache
npx react-native start --reset-cache

# Watchman
watchman watch-del-all
```

### Flutter Build Cleaning

```bash
flutter clean
flutter pub get
cd ios && pod install && cd ..
```

---

> **Stop console.log() debugging!**
> Mobile apps have complex native layers. Text logs are not enough.

---

## Performance Debugging

### "The UI is Laggy" — Don't Guess, Measure

| Framework | Tool | Access |
|-----------|------|--------|
| React Native | Performance Monitor | Shake menu → Show Perf Monitor |
| React Native | React DevTools Profiler | Press `j` in Metro |
| Flutter | Performance Overlay | `flutter run --profile`, press `P` |
| Flutter | DevTools Performance tab | Press `v` in terminal |
| Android | GPU Rendering bars | Developer Options |
| iOS | Core Animation FPS | Instruments |

### What to Look For

```
JS Thread drops (React Native):
├── Heavy computation in render
├── Large JSON parsing
├── Complex filtering/sorting
└── Fix: move to useMemo, workers

UI Thread drops (Both):
├── Too many views
├── Heavy images
├── Layout thrashing
└── Fix: reduce views, optimize images

Main Thread jank (Flutter):
├── Heavy build() methods
├── Synchronous I/O
├── Large widget trees
└── Fix: const constructors, isolates
```

---

> **Stop console.log() debugging!**
> Mobile apps have complex native layers. Text logs are not enough.

---

## Troubleshooting

| Symptom | First Check | Second Check | Third Check |
|---------|-------------|--------------|-------------|
| Crash on launch | Info.plist / Manifest | Native module versions | Clean build |
| White screen | JS bundle loading | Metro/build errors | Entry point |
| Slow startup | Bundle size | Initialization code | Lazy loading |
| Network fails | SSL/Certificate | Proxy settings | ATS config (iOS) |
| Memory growing | Timer cleanup | Image cache limits | Heap snapshot |
| Laggy scroll | List virtualization | Image sizes | Re-render count |

---

> **Stop console.log() debugging!**
> Mobile apps have complex native layers. Text logs are not enough.

---

## Anti-Patterns

| ❌ Don't | ✅ Do |
|---------|-------|
| `console.log` everything | Use Reactotron / DevTools |
| "It works on simulator" | Test on real device |
| "Reinstall node_modules" | Clean native build first |
| Ignore native logs | Read logcat / Console.app |
| Guess at performance | Measure with profiler |
| Debug in dev mode | Profile in release/profile mode |
| Skip memory profiling | Check for leaks before release |

---

> **Stop console.log() debugging!**
> Mobile apps have complex native layers. Text logs are not enough.

---

## 🔗 Related

| File | When to Read |
|------|-------------|
| [mobile-performance.md](mobile-performance-1-the-mobile-performance-mindset.md) | Performance optimization techniques |
| [mobile-testing.md](mobile-testing-mobile-testing-mindset.md) | Testing strategies including E2E |
| [mobile-backend.md](mobile-backend-mobile-backend-mindset.md) | API/network debugging context |
| [platform-ios.md](platform-ios-1-human-interface-guidelines-philosophy.md) | iOS-specific debugging tools |
| [platform-android.md](platform-android-1-material-design-3-philosophy.md) | Android-specific debugging tools |
| [../frameworks/react-native.md](react-native-framework-decision.md) | RN architecture and error handling |
| [../frameworks/flutter.md](flutter-widget-architecture.md) | Flutter architecture and error handling |

---

## Rollback

Restore the baseline if required tooling errors or the procedure introduces a regression.

## Exit Gate

Require fresh evidence for the intended behavior and all applicable project checks.

<a id="rule-mobile-design-thinking-anti-memorization-test-3"></a>

## Mobile Design Thinking: ?? ANTI-MEMORIZATION TEST through ?? CONTEXT-BASED DECISION PROTOCOL

**Impact:** high
**Kind:** reference
**Source:** `rules/mobile-design-thinking-anti-memorization-test-3.md`

# Mobile Design Thinking: ?? ANTI-MEMORIZATION TEST through ?? CONTEXT-BASED DECISION PROTOCOL

## Scope

Apply this guidance only to the declared platforms and repository-confirmed versions.

## Guidance

> **This file prevents AI from using memorized patterns and forces genuine thinking.**
> Mechanisms to prevent standard AI training defaults in mobile development.
> **The mobile equivalent of frontend's layout decomposition approach.**

---

## ?? ANTI-MEMORIZATION TEST

### Ask Yourself Before Every Solution

```
+-----------------------------------------------------------------+
|                    ANTI-MEMORIZATION CHECKLIST                  |
+-----------------------------------------------------------------|
|                                                                 |
|  ? Did I pick this solution "because I always do it this way"?  |
|    ? If YES: STOP. Consider alternatives.                       |
|                                                                 |
|  ? Is this a pattern I've seen frequently in training data?     |
|    ? If YES: Is it REALLY suitable for THIS project?            |
|                                                                 |
|  ? Did I write this solution automatically without thinking?    |
|    ? If YES: Step back, do decomposition.                       |
|                                                                 |
|  ? Did I consider an alternative approach?                      |
|    ? If NO: Think of at least 2 alternatives, then decide.      |
|                                                                 |
|  ? Did I think platform-specifically?                           |
|    ? If NO: Analyze iOS and Android separately.                 |
|                                                                 |
|  ? Did I consider performance impact of this solution?          |
|    ? If NO: What is the memory, CPU, battery impact?            |
|                                                                 |
|  ? Is this solution suitable for THIS project's CONTEXT?        |
|    ? If NO: Customize based on context.                         |
|                                                                 |
+-----------------------------------------------------------------+
```

---

> **This file prevents AI from using memorized patterns and forces genuine thinking.**
> Mechanisms to prevent standard AI training defaults in mobile development.
> **The mobile equivalent of frontend's layout decomposition approach.**

---

## ?? CONTEXT-BASED DECISION PROTOCOL

### Think Differently Based on Project Type

```
DETERMINE PROJECT TYPE:
        |
        +-- E-Commerce App
        |   +-- Navigation: Tab (Home, Search, Cart, Account)
        |   +-- Lists: Product grids (memoized, image optimized)
        |   +-- Performance: Image caching CRITICAL
        |   +-- Offline: Cart persistence, product cache
        |   +-- Special: Checkout flow, payment security
        |
        +-- Social/Content App
        |   +-- Navigation: Tab (Feed, Search, Create, Notify, Profile)
        |   +-- Lists: Infinite scroll, complex items
        |   +-- Performance: Feed rendering CRITICAL
        |   +-- Offline: Feed cache, draft posts
        |   +-- Special: Real-time updates, media handling
        |
        +-- Productivity/SaaS App
        |   +-- Navigation: Drawer or adaptive (mobile tab, tablet rail)
        |   +-- Lists: Data tables, forms
        |   +-- Performance: Data sync
        |   +-- Offline: Full offline editing
        |   +-- Special: Conflict resolution, background sync
        |
        +-- Utility App
        |   +-- Navigation: Minimal (stack-only possible)
        |   +-- Lists: Probably minimal
        |   +-- Performance: Fast startup
        |   +-- Offline: Core feature offline
        |   +-- Special: Widget, shortcuts
        |
        +-- Media/Streaming App
            +-- Navigation: Tab (Home, Search, Library, Profile)
            +-- Lists: Horizontal carousels, vertical feeds
            +-- Performance: Preloading, buffering
            +-- Offline: Download management
            +-- Special: Background playback, casting
```

---

## Verification

Cross-check version-sensitive details with the cited official source and verify the resulting behavior in the target environment.

<a id="rule-mobile-design-thinking-component-decomposition-mandatory-2"></a>

## Mobile Design Thinking: ?? COMPONENT DECOMPOSITION (MANDATORY) through ?? PATTERN QUESTIONING MATRIX

**Impact:** high
**Kind:** reference
**Source:** `rules/mobile-design-thinking-component-decomposition-mandatory-2.md`

# Mobile Design Thinking: ?? COMPONENT DECOMPOSITION (MANDATORY) through ?? PATTERN QUESTIONING MATRIX

## Scope

Apply this guidance only to the declared platforms and repository-confirmed versions.

## Guidance

> **This file prevents AI from using memorized patterns and forces genuine thinking.**
> Mechanisms to prevent standard AI training defaults in mobile development.
> **The mobile equivalent of frontend's layout decomposition approach.**

---

## ?? COMPONENT DECOMPOSITION (MANDATORY)

### Decomposition Analysis for Every Screen

Before designing any screen, perform this analysis:

```
SCREEN: [Screen Name]
+-- PRIMARY ACTION: [What is the main action?]
|   +-- Is it in thumb zone? [Yes/No ? Why?]
|
+-- TOUCH TARGETS: [All tappable elements]
|   +-- [Element 1]: [Size]pt ? Sufficient?
|   +-- [Element 2]: [Size]pt ? Sufficient?
|   +-- Spacing: [Gap]pt ? Accidental tap risk?
|
+-- SCROLLABLE CONTENT:
|   +-- Is it a list? ? FlatList/FlashList [Why this choice?]
|   +-- Item count: ~[N] ? Performance consideration?
|   +-- Fixed height? ? Is getItemLayout needed?
|
+-- STATE REQUIREMENTS:
|   +-- Is local state sufficient?
|   +-- Do I need to lift state?
|   +-- Is global required? [Why?]
|
+-- PLATFORM DIFFERENCES:
|   +-- iOS: [Anything different needed?]
|   +-- Android: [Anything different needed?]
|
+-- OFFLINE CONSIDERATION:
|   +-- Should this screen work offline?
|   +-- Cache strategy: [Yes/No/Which one?]
|
+-- PERFORMANCE IMPACT:
    +-- Any heavy components?
    +-- Is memoization needed?
    +-- Animation performance?
```

---

> **This file prevents AI from using memorized patterns and forces genuine thinking.**
> Mechanisms to prevent standard AI training defaults in mobile development.
> **The mobile equivalent of frontend's layout decomposition approach.**

---

## ?? PATTERN QUESTIONING MATRIX

Ask these questions for every default pattern:

### Navigation Pattern Questioning

| Assumption | Question | Alternative |
|------------|----------|-------------|
| "I'll use tab bar" | How many destinations? | 3 ? minimal tabs, 6+ ? drawer |
| "5 tabs" | Are all equally important? | "More" tab? Drawer hybrid? |
| "Bottom nav" | iPad/tablet support? | Navigation rail alternative |
| "Stack navigation" | Did I consider deep links? | URL structure = navigation structure |

### State Pattern Questioning

| Assumption | Question | Alternative |
|------------|----------|-------------|
| "I'll use Redux" | How complex is the app? | Simple: Zustand, Server: TanStack |
| "Global state" | Is this state really global? | Local lift, Context selector |
| "Context Provider" | Will re-render be an issue? | Zustand, Jotai (atom-based) |
| "BLoC pattern" | Is the boilerplate worth it? | Riverpod (less code) |

### List Pattern Questioning

| Assumption | Question | Alternative |
|------------|----------|-------------|
| "FlatList" | Is performance critical? | FlashList (faster) |
| "Standard renderItem" | Is it memoized? | useCallback + React.memo |
| "Index key" | Does data order change? | Use item.id |
| "ListView" | Are there separators? | ListView.separated |

### UI Pattern Questioning

| Assumption | Question | Alternative |
|------------|----------|-------------|
| "FAB bottom-right" | User handedness? | Accessibility settings |
| "Pull-to-refresh" | Does this list need refresh? | Only when necessary |
| "Modal bottom sheet" | How much content? | Full screen modal might be better |
| "Swipe actions" | Discoverability? | Visible button alternative |

---

## Verification

Cross-check version-sensitive details with the cited official source and verify the resulting behavior in the target environment.

<a id="rule-mobile-design-thinking-deep-mobile-thinking-protocol"></a>

## Mobile Design Thinking: ?? DEEP MOBILE THINKING PROTOCOL through ?? AI MOBILE DEFAULTS (FORBIDDEN LIST)

**Impact:** high
**Kind:** reference
**Source:** `rules/mobile-design-thinking-deep-mobile-thinking-protocol.md`

# Mobile Design Thinking: ?? DEEP MOBILE THINKING PROTOCOL through ?? AI MOBILE DEFAULTS (FORBIDDEN LIST)

## Scope

Apply this guidance only to the declared platforms and repository-confirmed versions.

## Guidance

> **This file prevents AI from using memorized patterns and forces genuine thinking.**
> Mechanisms to prevent standard AI training defaults in mobile development.
> **The mobile equivalent of frontend's layout decomposition approach.**

---

## ?? DEEP MOBILE THINKING PROTOCOL

### This Process is Mandatory Before Every Mobile Project

```
+-----------------------------------------------------------------+
|                    DEEP MOBILE THINKING                         |
+-----------------------------------------------------------------|
|                                                                 |
|  1️? CONTEXT SCAN                                               |
|     +-- What are my assumptions for this project?               |
|         +-- QUESTION these assumptions                          |
|                                                                 |
|  2️? ANTI-DEFAULT ANALYSIS                                      |
|     +-- Am I applying a memorized pattern?                      |
|         +-- Is this pattern REALLY the best for THIS project?   |
|                                                                 |
|  3️? PLATFORM DECOMPOSITION                                     |
|     +-- Did I think about iOS and Android separately?           |
|         +-- What are the platform-specific patterns?            |
|                                                                 |
|  4️? TOUCH INTERACTION BREAKDOWN                                |
|     +-- Did I analyze each interaction individually?            |
|         +-- Did I apply Fitts' Law, Thumb Zone?                 |
|                                                                 |
|  5️? PERFORMANCE IMPACT ANALYSIS                                |
|     +-- Did I consider performance impact of each component?    |
|         +-- Is the default solution performant?                 |
|                                                                 |
+-----------------------------------------------------------------+
```

---

> **This file prevents AI from using memorized patterns and forces genuine thinking.**
> Mechanisms to prevent standard AI training defaults in mobile development.
> **The mobile equivalent of frontend's layout decomposition approach.**

---

## ?? AI MOBILE DEFAULTS (FORBIDDEN LIST)

### Using These Patterns Automatically is FORBIDDEN!

The following patterns are "defaults" that AIs learned from training data.
Before using any of these, **QUESTION them and CONSIDER ALTERNATIVES!**

```
+-----------------------------------------------------------------+
|                 ?? AI MOBILE SAFE HARBOR                        |
|           (Default Patterns - Never Use Without Questioning)    |
+-----------------------------------------------------------------|
|                                                                 |
|  NAVIGATION DEFAULTS:                                           |
|  +-- Tab bar for every project (Would drawer be better?)        |
|  +-- Fixed 5 tabs (Are 3 enough? For 6+, drawer?)               |
|  +-- "Home" tab on left (What does user behavior say?)          |
|  +-- Hamburger menu (Is it outdated now?)                       |
|                                                                 |
|  STATE MANAGEMENT DEFAULTS:                                     |
|  +-- Redux everywhere (Is Zustand/Jotai sufficient?)            |
|  +-- Global state for everything (Isn't local state enough?)   |
|  +-- Context Provider hell (Is atom-based better?)              |
|  +-- BLoC for every Flutter project (Is Riverpod more modern?)  |
|                                                                 |
|  LIST IMPLEMENTATION DEFAULTS:                                  |
|  +-- FlatList as default (Is FlashList more performant?)        |
|  +-- windowSize=21 (Is it really needed?)                       |
|  +-- removeClippedSubviews (Always?)                            |
|  +-- ListView.builder (Is ListView.separated better?)           |
|                                                                 |
|  UI PATTERN DEFAULTS:                                           |
|  +-- FAB bottom-right (Is bottom-left more accessible?)         |
|  +-- Pull-to-refresh on every list (Is it needed everywhere?)   |
|  +-- Swipe-to-delete from left (Is right better?)               |
|  +-- Bottom sheet for every modal (Is full screen better?)      |
|                                                                 |
+-----------------------------------------------------------------+
```

---

## Verification

Cross-check version-sensitive details with the cited official source and verify the resulting behavior in the target environment.

<a id="rule-mobile-design-thinking-interaction-breakdown-4"></a>

## Mobile Design Thinking: ?? INTERACTION BREAKDOWN through ?? MANDATORY: Before Every Mobile Work

**Impact:** high
**Kind:** reference
**Source:** `rules/mobile-design-thinking-interaction-breakdown-4.md`

# Mobile Design Thinking: ?? INTERACTION BREAKDOWN through ?? MANDATORY: Before Every Mobile Work

## Scope

Apply this guidance only to the declared platforms and repository-confirmed versions.

## Guidance

> **This file prevents AI from using memorized patterns and forces genuine thinking.**
> Mechanisms to prevent standard AI training defaults in mobile development.
> **The mobile equivalent of frontend's layout decomposition approach.**

---

## ?? INTERACTION BREAKDOWN

### Analysis for Every Gesture

Before adding any gesture:

```
GESTURE: [Gesture Type]
+-- DISCOVERABILITY:
|   +-- How will users discover this gesture?
|       +-- Is there a visual hint?
|       +-- Will it be shown in onboarding?
|       +-- Is there a button alternative? (MANDATORY)
|
+-- PLATFORM CONVENTION:
|   +-- What does this gesture mean on iOS?
|   +-- What does this gesture mean on Android?
|   +-- Am I deviating from platform convention?
|
+-- ACCESSIBILITY:
|   +-- Can motor-impaired users perform this gesture?
|   +-- Is there a VoiceOver/TalkBack alternative?
|   +-- Does it work with switch control?
|
+-- CONFLICT CHECK:
|   +-- Does it conflict with system gestures?
|   |   +-- iOS: Edge swipe back
|   |   +-- Android: Back gesture
|   |   +-- Home indicator swipe
|   +-- Is it consistent with other app gestures?
|
+-- FEEDBACK:
    +-- Is haptic feedback defined?
    +-- Is visual feedback sufficient?
    +-- Is audio feedback needed?
```

---

> **This file prevents AI from using memorized patterns and forces genuine thinking.**
> Mechanisms to prevent standard AI training defaults in mobile development.
> **The mobile equivalent of frontend's layout decomposition approach.**

---

## ?? SPIRIT OVER CHECKLIST (Mobile Edition)

### Passing the Checklist is Not Enough!

| ? Self-Deception | ? Honest Assessment |
|-------------------|----------------------|
| "Touch target is 44px" (but on edge, unreachable) | "Can user reach it one-handed?" |
| "I used FlatList" (but didn't memoize) | "Is scroll smooth?" |
| "Platform-specific nav" (but only icons differ) | "Does iOS feel like iOS, Android like Android?" |
| "Offline support exists" (but error message is generic) | "What can user actually do offline?" |
| "Loading state exists" (but just a spinner) | "Does user know how long to wait?" |

> ?? **Passing the checklist is NOT the goal. Creating great mobile UX IS the goal.**

---

> **This file prevents AI from using memorized patterns and forces genuine thinking.**
> Mechanisms to prevent standard AI training defaults in mobile development.
> **The mobile equivalent of frontend's layout decomposition approach.**

---

## ?? MOBILE DESIGN COMMITMENT

### Fill This at the Start of Every Mobile Project

```
?? MOBILE DESIGN COMMITMENT

Project: _______________
Platform: iOS / Android / Both

1. Default pattern I will NOT use in this project:
   +-- _______________

2. Context-specific focus for this project:
   +-- _______________

3. Platform-specific differences I will implement:
   +-- iOS: _______________
   +-- Android: _______________

4. Area I will specifically optimize for performance:
   +-- _______________

5. Unique challenge of this project:
   +-- _______________

?? If I can't fill this commitment ? I don't understand the project well enough.
   ? Go back, understand context better, ask the user.
```

---

> **This file prevents AI from using memorized patterns and forces genuine thinking.**
> Mechanisms to prevent standard AI training defaults in mobile development.
> **The mobile equivalent of frontend's layout decomposition approach.**

---

## ?? MANDATORY: Before Every Mobile Work

```
+-----------------------------------------------------------------+
|                    PRE-WORK VALIDATION                          |
+-----------------------------------------------------------------|
|                                                                 |
|  ? Did I complete Component Decomposition?                      |
|  ? Did I fill the Pattern Questioning Matrix?                   |
|  ? Did I pass the Anti-Memorization Test?                       |
|  ? Did I make context-based decisions?                          |
|  ? Did I analyze Interaction Breakdown?                         |
|  ? Did I fill the Mobile Design Commitment?                     |
|                                                                 |
|  ?? Do not write code without completing these!                 |
|                                                                 |
+-----------------------------------------------------------------+
```

---

> **Remember:** If you chose a solution "because that's how it's always done," you chose WITHOUT THINKING. Every project is unique. Every context is different. Every user behavior is specific. **THINK, then code.**

---

## Verification

Cross-check version-sensitive details with the cited official source and verify the resulting behavior in the target environment.

<a id="rule-mobile-navigation-1-navigation-selection-decision-tree"></a>

## Mobile Navigation: Navigation Selection Decision Tree through 3. Stack Navigation

**Impact:** high
**Kind:** reference
**Source:** `rules/mobile-navigation-1-navigation-selection-decision-tree.md`

# Mobile Navigation: Navigation Selection Decision Tree through 3. Stack Navigation

## Scope

Apply this guidance only to the declared platforms and repository-confirmed versions.

## Guidance

> Navigation patterns, deep linking, back handling, and tab/stack/drawer decisions.
> **Navigation is the skeleton of your app—get it wrong and everything feels broken.**

---

## 1. Navigation Selection Decision Tree

```
WHAT TYPE OF APP?
        │
        ├── 3-5 top-level sections (equal importance)
        │   └── ✅ Tab Bar / Bottom Navigation
        │       Examples: Social, E-commerce, Utility
        │
        ├── Deep hierarchical content (drill down)
        │   └── ✅ Stack Navigation
        │       Examples: Settings, Email folders
        │
        ├── Many destinations (>5 top-level)
        │   └── ✅ Drawer Navigation
        │       Examples: Gmail, complex enterprise
        │
        ├── Single linear flow
        │   └── ✅ Stack only (wizard/onboarding)
        │       Examples: Checkout, Setup flow
        │
        └── Tablet/Foldable
            └── ✅ Navigation Rail + List-Detail
                Examples: Mail, Notes on iPad
```

---

> Navigation patterns, deep linking, back handling, and tab/stack/drawer decisions.
> **Navigation is the skeleton of your app—get it wrong and everything feels broken.**

---

## 2. Tab Bar Navigation

### When to Use

```
✅ USE Tab Bar when:
├── 3-5 top-level destinations
├── Destinations are of equal importance
├── User frequently switches between them
├── Each tab has independent navigation stack
└── App is used in short sessions

❌ AVOID Tab Bar when:
├── More than 5 destinations
├── Destinations have clear hierarchy
├── Tabs would be used very unequally
└── Content flows in a sequence
```

### Tab Bar Best Practices

```
iOS Tab Bar:
├── Height: 49pt (83pt with home indicator)
├── Max items: 5
├── Icons: SF Symbols, 25×25pt
├── Labels: Always show (accessibility)
├── Active indicator: Tint color

Android Bottom Navigation:
├── Height: 80dp
├── Max items: 5 (3-5 ideal)
├── Icons: Material Symbols, 24dp
├── Labels: Always show
├── Active indicator: Pill shape + filled icon
```

### Tab State Preservation

```
RULE: Each tab maintains its own navigation stack.

User journey:
1. Home tab → Drill into item → Add to cart
2. Switch to Profile tab
3. Switch back to Home tab
→ Should return to "Add to cart" screen, NOT home root

Implementation:
├── React Navigation: Each tab has own navigator
├── Flutter: IndexedStack for state preservation
└── Never reset tab stack on switch
```

---

> Navigation patterns, deep linking, back handling, and tab/stack/drawer decisions.
> **Navigation is the skeleton of your app—get it wrong and everything feels broken.**

---

## 3. Stack Navigation

### Core Concepts

```
Stack metaphor: Cards stacked on top of each other

Push: Add screen on top
Pop: Remove top screen (back)
Replace: Swap current screen
Reset: Clear stack, set new root

Visual: New screen slides in from right (LTR)
Back: Screen slides out to right
```

### Stack Navigation Patterns

| Pattern | Use Case | Implementation |
|---------|----------|----------------|
| **Simple Stack** | Linear flow | Push each step |
| **Nested Stack** | Sections with sub-navigation | Stack inside tab |
| **Modal Stack** | Focused tasks | Present modally |
| **Auth Stack** | Login vs Main | Conditional root |

### Back Button Handling

```
iOS:
├── Edge swipe from left (system)
├── Back button in nav bar (optional)
├── Interactive pop gesture
└── Never override swipe back without good reason

Android:
├── System back button/gesture
├── Up button in toolbar (optional, for drill-down)
├── Predictive back animation (Android 14+)
└── Must handle back correctly (Activity/Fragment)

Cross-Platform Rule:
├── Back ALWAYS navigates up the stack
├── Never hijack back for other purposes
├── Confirm before discarding unsaved data
└── Deep links should allow full back traversal
```

---

## Verification

Cross-check version-sensitive details with the cited official source and verify the resulting behavior in the target environment.

<a id="rule-mobile-navigation-4-drawer-navigation-2"></a>

## Mobile Navigation: Drawer Navigation through 6. Deep Linking

**Impact:** high
**Kind:** reference
**Source:** `rules/mobile-navigation-4-drawer-navigation-2.md`

# Mobile Navigation: Drawer Navigation through 6. Deep Linking

## Scope

Apply this guidance only to the declared platforms and repository-confirmed versions.

## Guidance

> Navigation patterns, deep linking, back handling, and tab/stack/drawer decisions.
> **Navigation is the skeleton of your app—get it wrong and everything feels broken.**

---

## 4. Drawer Navigation

### When to Use

```
✅ USE Drawer when:
├── More than 5 top-level destinations
├── Less frequently accessed destinations
├── Complex app with many features
├── Need for branding/user info in nav
└── Tablet/large screen with persistent drawer

❌ AVOID Drawer when:
├── 5 or fewer destinations (use tabs)
├── All destinations equally important
├── Mobile-first simple app
└── Discoverability is critical (drawer is hidden)
```

### Drawer Patterns

```
Modal Drawer:
├── Opens over content (scrim behind)
├── Swipe to open from edge
├── Hamburger icon ( ☰ ) triggers
└── Most common on mobile

Permanent Drawer:
├── Always visible (large screens)
├── Content shifts over
├── Good for productivity apps
└── Tablets, desktops

Navigation Rail (Android):
├── Narrow vertical strip
├── Icons + optional labels
├── For tablets in portrait
└── 80dp width
```

---

> Navigation patterns, deep linking, back handling, and tab/stack/drawer decisions.
> **Navigation is the skeleton of your app—get it wrong and everything feels broken.**

---

## 5. Modal Navigation

### Modal vs Push

```
PUSH (Stack):                    MODAL:
├── Horizontal slide             ├── Vertical slide up (sheet)
├── Part of hierarchy            ├── Separate task
├── Back returns                 ├── Dismiss (X) returns
├── Same navigation context      ├── Own navigation context
└── "Drill in"                   └── "Focus on task"

USE MODAL for:
├── Creating new content
├── Settings/preferences
├── Completing a transaction
├── Self-contained workflows
├── Quick actions
```

### Modal Types

| Type | iOS | Android | Use Case |
|------|-----|---------|----------|
| **Sheet** | `.sheet` | Bottom Sheet | Quick tasks |
| **Full Screen** | `.fullScreenCover` | Full Activity | Complex forms |
| **Alert** | Alert | Dialog | Confirmations |
| **Action Sheet** | Action Sheet | Menu/Bottom Sheet | Choose from options |

### Modal Dismissal

```
Users expect to dismiss modals by:
├── Tapping X / Close button
├── Swiping down (sheet)
├── Tapping scrim (non-critical)
├── System back (Android)
├── Hardware back (old Android)

RULE: Only block dismissal for unsaved data.
```

---

> Navigation patterns, deep linking, back handling, and tab/stack/drawer decisions.
> **Navigation is the skeleton of your app—get it wrong and everything feels broken.**

---

## 6. Deep Linking

### Why Deep Links from Day One

```
Deep links enable:
├── Push notification navigation
├── Sharing content
├── Marketing campaigns
├── Spotlight/Search integration
├── Widget navigation
├── External app integration

Building later is HARD:
├── Requires navigation refactor
├── Screen dependencies unclear
├── Parameter passing complex
└── Always plan deep links at start
```

### URL Structure

```
Scheme://host/path?params

Examples:
├── myapp://product/123
├── https://myapp.com/product/123 (Universal/App Link)
├── myapp://checkout?promo=SAVE20
├── myapp://tab/profile/settings

Hierarchy should match navigation:
├── myapp://home
├── myapp://home/product/123
├── myapp://home/product/123/reviews
└── URL path = navigation path
```

### Deep Link Navigation Rules

```
1. FULL STACK CONSTRUCTION
   Deep link to myapp://product/123 should:
   ├── Put Home at root of stack
   ├── Push Product screen on top
   └── Back button returns to Home

2. AUTHENTICATION AWARENESS
   If deep link requires auth:
   ├── Save intended destination
   ├── Redirect to login
   ├── After login, navigate to destination

3. INVALID LINKS
   If deep link target doesn't exist:
   ├── Navigate to fallback (home)
   ├── Show error message
   └── Never crash or blank screen

4. STATEFUL NAVIGATION
   Deep link during active session:
   ├── Don't blow away current stack
   ├── Push on top OR
   ├── Ask user if should navigate away
```

---

## Verification

Cross-check version-sensitive details with the cited official source and verify the resulting behavior in the target environment.

<a id="rule-mobile-navigation-7-navigation-state-persistence-3"></a>

## Mobile Navigation: Navigation State Persistence through 10. Navigation Checklist

**Impact:** high
**Kind:** reference
**Source:** `rules/mobile-navigation-7-navigation-state-persistence-3.md`

# Mobile Navigation: Navigation State Persistence through 10. Navigation Checklist

## Scope

Apply this guidance only to the declared platforms and repository-confirmed versions.

## Guidance

> Navigation patterns, deep linking, back handling, and tab/stack/drawer decisions.
> **Navigation is the skeleton of your app—get it wrong and everything feels broken.**

---

## 7. Navigation State Persistence

### What to Persist

```
SHOULD persist:
├── Current tab selection
├── Scroll position in lists
├── Form draft data
├── Recent navigation stack
└── User preferences

SHOULD NOT persist:
├── Modal states (dialogs)
├── Temporary UI states
├── Stale data (refresh on return)
├── Authentication state (use secure storage)
```

### Implementation

```javascript
// React Navigation - State Persistence
const [isReady, setIsReady] = useState(false);
const [initialState, setInitialState] = useState();

useEffect(() => {
  const loadState = async () => {
    const savedState = await AsyncStorage.getItem('NAV_STATE');
    if (savedState) setInitialState(JSON.parse(savedState));
    setIsReady(true);
  };
  loadState();
}, []);

const handleStateChange = (state) => {
  AsyncStorage.setItem('NAV_STATE', JSON.stringify(state));
};

<NavigationContainer
  initialState={initialState}
  onStateChange={handleStateChange}
>
```

---

> Navigation patterns, deep linking, back handling, and tab/stack/drawer decisions.
> **Navigation is the skeleton of your app—get it wrong and everything feels broken.**

---

## 8. Transition Animations

### Platform Defaults

```
iOS Transitions:
├── Push: Slide from right
├── Modal: Slide from bottom (sheet) or fade
├── Tab switch: Cross-fade
├── Interactive: Swipe to go back

Android Transitions:
├── Push: Fade + slide from right
├── Modal: Slide from bottom
├── Tab switch: Cross-fade or none
├── Shared element: Hero animations
```

### Custom Transitions

```
When to custom:
├── Brand identity requires it
├── Shared element connections
├── Special reveal effects
└── Keep it subtle, <300ms

When to use default:
├── Most of the time
├── Standard drill-down
├── Platform consistency
└── Performance critical paths
```

### Shared Element Transitions

```
Connect elements between screens:

Screen A: Product card with image
            ↓ (tap)
Screen B: Product detail with same image (expanded)

Image animates from card position to detail position.

Implementation:
├── React Navigation: shared element library
├── Flutter: Hero widget
├── SwiftUI: matchedGeometryEffect
└── Compose: Shared element transitions
```

---

> Navigation patterns, deep linking, back handling, and tab/stack/drawer decisions.
> **Navigation is the skeleton of your app—get it wrong and everything feels broken.**

---

## 9. Navigation Anti-Patterns

### ❌ Navigation Sins

| Anti-Pattern | Problem | Solution |
|--------------|---------|----------|
| **Inconsistent back** | User confused, can't predict | Always pop stack |
| **Hidden navigation** | Features undiscoverable | Visible tabs/drawer trigger |
| **Deep nesting** | User gets lost | Max 3-4 levels, breadcrumbs |
| **Breaking swipe back** | iOS users frustrated | Never override gesture |
| **No deep links** | Can't share, bad notifications | Plan from start |
| **Tab stack reset** | Work lost on switch | Preserve tab states |
| **Modal for primary flow** | Can't back track | Use stack navigation |

### ❌ AI Navigation Mistakes

```
AI tends to:
├── Use modals for everything (wrong)
├── Forget tab state preservation (wrong)
├── Skip deep linking (wrong)
├── Override platform back behavior (wrong)
├── Reset stack on tab switch (wrong)
└── Ignore predictive back (Android 14+)

RULE: Use platform navigation patterns.
Don't reinvent navigation.
```

---

> Navigation patterns, deep linking, back handling, and tab/stack/drawer decisions.
> **Navigation is the skeleton of your app—get it wrong and everything feels broken.**

---

## 10. Navigation Checklist

### Before Navigation Architecture

- [ ] App type determined (tabs/drawer/stack)
- [ ] Number of top-level destinations counted
- [ ] Deep link URL scheme planned
- [ ] Auth flow integrated with navigation
- [ ] Tablet/large screen considered

### Before Every Screen

- [ ] Can user navigate back? (not dead end)
- [ ] Deep link to this screen planned
- [ ] State preserved on navigate away/back
- [ ] Transition appropriate for relationship
- [ ] Auth required? Handled?

### Before Release

- [ ] All deep links tested
- [ ] Back button works everywhere
- [ ] Tab states preserved correctly
- [ ] Edge swipe back works (iOS)
- [ ] Predictive back works (Android 14+)
- [ ] Universal/App links configured
- [ ] Push notification deep links work

---

> **Remember:** Navigation is invisible when done right. Users shouldn't think about HOW to get somewhere—they just get there. If they notice navigation, something is wrong.

---

## Verification

Cross-check version-sensitive details with the cited official source and verify the resulting behavior in the target environment.

<a id="rule-mobile-navigation-related-4"></a>

## Mobile Navigation: Related

**Impact:** high
**Kind:** reference
**Source:** `rules/mobile-navigation-related-4.md`

# Mobile Navigation: Related

## Scope

Apply only to the declared platforms and repository-confirmed versions.

## Guidance

> Navigation patterns, deep linking, back handling, and tab/stack/drawer decisions.
> **Navigation is the skeleton of your app—get it wrong and everything feels broken.**

---

## 🔗 Related

| File | When to Read |
|------|-------------|
| [decision-trees.md](decision-trees-1-framework-selection.md) | Navigation pattern selection |
| [touch-psychology.md](touch-psychology-1-fitts-law-for-touch.md) | Thumb zone, gesture psychology |
| [platform-ios.md](platform-ios-1-human-interface-guidelines-philosophy.md) | iOS navigation conventions |
| [platform-android.md](platform-android-1-material-design-3-philosophy.md) | Android navigation conventions |
| [../publishing/deep-linking.md](deep-linking-deep-link-types.md) | Universal/App Links setup |

---

## Verification

Cross-check version-sensitive details with the cited official source and verify behavior in the target environment.

<a id="rule-mobile-performance-1-the-mobile-performance-mindset"></a>

## Mobile Performance: The Mobile Performance Mindset through 2. React Native Performance - FlashList: The Better Option

**Impact:** high
**Kind:** reference
**Source:** `rules/mobile-performance-1-the-mobile-performance-mindset.md`

# Mobile Performance: The Mobile Performance Mindset through 2. React Native Performance - FlashList: The Better Option

## Scope

Apply this guidance only to the declared platforms and repository-confirmed versions.

## Guidance

> Deep dive into React Native and Flutter performance optimization, 60fps animations, memory management, and battery considerations.
> **This file covers the #1 area where AI-generated code FAILS.**

---

## 1. The Mobile Performance Mindset

### Why Mobile Performance is Different

```
DESKTOP:                          MOBILE:
+-- Unlimited power               +-- Battery matters
+-- Abundant RAM                  +-- RAM is shared, limited
+-- Stable network                +-- Network is unreliable
+-- CPU always available          +-- CPU throttles when hot
+-- User expects fast anyway      +-- User expects INSTANT
```

### Performance Budget Concept

```
Every frame must complete in:
+-- 60fps ? 16.67ms per frame
+-- 120fps (ProMotion) ? 8.33ms per frame

If your code takes longer:
+-- Frame drops ? Janky scroll/animation
+-- User perceives as "slow" or "broken"
+-- They WILL uninstall your app
```

---

> Deep dive into React Native and Flutter performance optimization, 60fps animations, memory management, and battery considerations.
> **This file covers the #1 area where AI-generated code FAILS.**

---

## 2. React Native Performance

### ?? The #1 AI Mistake: ScrollView for Lists

```javascript
// ? NEVER DO THIS - AI's favorite mistake
<ScrollView>
  {items.map(item => (
    <ItemComponent key={item.id} item={item} />
  ))}
</ScrollView>

// Why it's catastrophic:
// +-- Renders ALL items immediately (1000 items = 1000 renders)
// +-- Memory explodes
// +-- Initial render takes seconds
// +-- Scroll becomes janky

// ? ALWAYS USE FlatList
<FlatList
  data={items}
  renderItem={renderItem}
  keyExtractor={item => item.id}
/>
```

> Deep dive into React Native and Flutter performance optimization, 60fps animations, memory management, and battery considerations.
> **This file covers the #1 area where AI-generated code FAILS.**

---

## 2. React Native Performance

### FlatList Optimization Checklist

```javascript
// ? CORRECT: All optimizations applied

// 1. Memoize the item component
const ListItem = React.memo(({ item }: { item: Item }) => {
  return (
    <Pressable style={styles.item}>
      <Text>{item.title}</Text>
    </Pressable>
  );
});

// 2. Memoize renderItem with useCallback
const renderItem = useCallback(
  ({ item }: { item: Item }) => <ListItem item={item} />,
  [] // Empty deps = never recreated
);

// 3. Stable keyExtractor (NEVER use index!)
const keyExtractor = useCallback((item: Item) => item.id, []);

// 4. Provide getItemLayout for fixed-height items
const getItemLayout = useCallback(
  (data: Item[] | null, index: number) => ({
    length: ITEM_HEIGHT, // Fixed height
    offset: ITEM_HEIGHT * index,
    index,
  }),
  []
);

// 5. Apply to FlatList
<FlatList
  data={items}
  renderItem={renderItem}
  keyExtractor={keyExtractor}
  getItemLayout={getItemLayout}
  // Performance props
  removeClippedSubviews={true} // Android: detach off-screen
  maxToRenderPerBatch={10} // Items per batch
  windowSize={5} // Render window (5 = 2 screens each side)
  initialNumToRender={10} // Initial items
  updateCellsBatchingPeriod={50} // Batching delay
/>
```

> Deep dive into React Native and Flutter performance optimization, 60fps animations, memory management, and battery considerations.
> **This file covers the #1 area where AI-generated code FAILS.**

---

## 2. React Native Performance

### Why Each Optimization Matters

| Optimization | What It Prevents | Impact |
|--------------|------------------|--------|
| `React.memo` | Re-render on parent change | ?? Critical |
| `useCallback renderItem` | New function every render | ?? Critical |
| Stable `keyExtractor` | Wrong item recycling | ?? Critical |
| `getItemLayout` | Async layout calculation | ?? High |
| `removeClippedSubviews` | Memory from off-screen | ?? High |
| `maxToRenderPerBatch` | Blocking main thread | ?? Medium |
| `windowSize` | Memory usage | ?? Medium |

> Deep dive into React Native and Flutter performance optimization, 60fps animations, memory management, and battery considerations.
> **This file covers the #1 area where AI-generated code FAILS.**

---

## 2. React Native Performance

### FlashList: The Better Option

```javascript
// Consider FlashList for better performance
import { FlashList } from "@shopify/flash-list";

<FlashList
  data={items}
  renderItem={renderItem}
  estimatedItemSize={ITEM_HEIGHT}
  keyExtractor={keyExtractor}
/>

// Benefits over FlatList:
// +-- Faster recycling
// +-- Better memory management
// +-- Simpler API
// +-- Fewer optimization props needed
```

## Verification

Cross-check version-sensitive details with the cited official source and verify the resulting behavior in the target environment.

<a id="rule-mobile-performance-2-react-native-performance-animation-perfo-2"></a>

## Mobile Performance: React Native Performance - Animation Performance through 3. Flutter Performance - ?? The #1 AI Mistake: setState Overuse

**Impact:** high
**Kind:** reference
**Source:** `rules/mobile-performance-2-react-native-performance-animation-perfo-2.md`

# Mobile Performance: React Native Performance - Animation Performance through 3. Flutter Performance - ?? The #1 AI Mistake: setState Overuse

## Scope

Apply this guidance only to the declared platforms and repository-confirmed versions.

## Guidance

> Deep dive into React Native and Flutter performance optimization, 60fps animations, memory management, and battery considerations.
> **This file covers the #1 area where AI-generated code FAILS.**

---

## 2. React Native Performance

### Animation Performance

```javascript
// ? JS-driven animation (blocks JS thread)
Animated.timing(value, {
  toValue: 1,
  duration: 300,
  useNativeDriver: false, // BAD!
}).start();

// ? Native-driver animation (runs on UI thread)
Animated.timing(value, {
  toValue: 1,
  duration: 300,
  useNativeDriver: true, // GOOD!
}).start();

// Native driver supports ONLY:
// +-- transform (translate, scale, rotate)
// +-- opacity
//
// Does NOT support:
// +-- width, height
// +-- backgroundColor
// +-- borderRadius changes
// +-- margin, padding
```

> Deep dive into React Native and Flutter performance optimization, 60fps animations, memory management, and battery considerations.
> **This file covers the #1 area where AI-generated code FAILS.**

---

## 2. React Native Performance

### Reanimated for Complex Animations

```javascript
// For animations native driver can't handle, use Reanimated 3

import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';

const Component = () => {
  const offset = useSharedValue(0);

  const animatedStyles = useAnimatedStyle(() => ({
    transform: [{ translateX: withSpring(offset.value) }],
  }));

  return <Animated.View style={animatedStyles} />;
};

// Benefits:
// +-- Runs on the UI thread; measure frame pacing on target devices
// +-- Can animate any property
// +-- Gesture-driven animations
// +-- Worklets for complex logic
```

> Deep dive into React Native and Flutter performance optimization, 60fps animations, memory management, and battery considerations.
> **This file covers the #1 area where AI-generated code FAILS.**

---

## 2. React Native Performance

### Memory Leak Prevention

```javascript
// ? Memory leak: uncleared interval
useEffect(() => {
  const interval = setInterval(() => {
    fetchData();
  }, 5000);
  // Missing cleanup!
}, []);

// ? Proper cleanup
useEffect(() => {
  const interval = setInterval(() => {
    fetchData();
  }, 5000);

  return () => clearInterval(interval); // CLEANUP!
}, []);

// Common memory leak sources:
// +-- Timers (setInterval, setTimeout)
// +-- Event listeners
// +-- Subscriptions (WebSocket, PubSub)
// +-- Async operations that update state after unmount
// +-- Image caching without limits
```

> Deep dive into React Native and Flutter performance optimization, 60fps animations, memory management, and battery considerations.
> **This file covers the #1 area where AI-generated code FAILS.**

---

## 2. React Native Performance

### React Native Performance Checklist

```markdown
## Before Every List
- [ ] Using FlatList or FlashList (NOT ScrollView)
- [ ] renderItem is useCallback memoized
- [ ] List items are React.memo wrapped
- [ ] keyExtractor uses stable ID (NOT index)
- [ ] getItemLayout provided (if fixed height)

## Before Every Animation
- [ ] useNativeDriver: true (if possible)
- [ ] Using Reanimated for complex animations
- [ ] Only animating transform/opacity
- [ ] Tested on low-end Android device

## Before Any Release
- [ ] console.log statements removed
- [ ] Cleanup functions in all useEffects
- [ ] No memory leaks (test with profiler)
- [ ] Tested in release build (not dev)
```

---

> Deep dive into React Native and Flutter performance optimization, 60fps animations, memory management, and battery considerations.
> **This file covers the #1 area where AI-generated code FAILS.**

---

## 3. Flutter Performance

### ?? The #1 AI Mistake: setState Overuse

```dart
// ? WRONG: setState rebuilds ENTIRE widget tree
class BadCounter extends StatefulWidget {
  @override
  State<BadCounter> createState() => _BadCounterState();
}

class _BadCounterState extends State<BadCounter> {
  int _counter = 0;

  void _increment() {
    setState(() {
      _counter++; // This rebuilds EVERYTHING below!
    });
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        Text('Counter: $_counter'),
        ExpensiveWidget(), // Rebuilds unnecessarily!
        AnotherExpensiveWidget(), // Rebuilds unnecessarily!
      ],
    );
  }
}
```

## Verification

Cross-check version-sensitive details with the cited official source and verify the resulting behavior in the target environment.

<a id="rule-mobile-performance-3-flutter-performance-flutter-performance-4"></a>

## Mobile Performance: Flutter Performance - Flutter Performance Checklist through 5. Memory Management

**Impact:** high
**Kind:** reference
**Source:** `rules/mobile-performance-3-flutter-performance-flutter-performance--4.md`

# Mobile Performance: Flutter Performance - Flutter Performance Checklist through 5. Memory Management

## Scope

Apply this guidance only to the declared platforms and repository-confirmed versions.

## Guidance

> Deep dive into React Native and Flutter performance optimization, 60fps animations, memory management, and battery considerations.
> **This file covers the #1 area where AI-generated code FAILS.**

---

## 3. Flutter Performance

### Flutter Performance Checklist

```markdown
## Before Every Widget
- [ ] const constructor added (if no runtime args)
- [ ] const keywords on static children
- [ ] Minimal setState scope
- [ ] Using selectors for provider watches

## Before Every List
- [ ] Using ListView.builder (NOT ListView with children)
- [ ] itemExtent provided (if fixed height)
- [ ] Image caching with size limits

## Before Any Animation
- [ ] Using Impeller (Flutter 3.16+)
- [ ] Avoiding Opacity widget (use FadeTransition)
- [ ] TickerProviderStateMixin for AnimationController

## Before Any Release
- [ ] All dispose() methods implemented
- [ ] No print() in production
- [ ] Tested in profile/release mode
- [ ] DevTools performance overlay checked
```

---

> Deep dive into React Native and Flutter performance optimization, 60fps animations, memory management, and battery considerations.
> **This file covers the #1 area where AI-generated code FAILS.**

---

## 4. Animation Performance (Both Platforms)

### The 60fps Imperative

```
Human eye detects:
+-- < 24 fps ? "Slideshow" (broken)
+-- 24-30 fps ? "Choppy" (uncomfortable)
+-- 30-45 fps ? "Noticeably not smooth"
+-- 45-60 fps ? "Smooth" (acceptable)
+-- 60 fps ? "Buttery" (target)
+-- 120 fps ? "Premium" (ProMotion devices)

NEVER ship < 60fps animations.
```

### GPU vs CPU Animation

```
GPU-ACCELERATED (FAST):          CPU-BOUND (SLOW):
+-- transform: translate          +-- width, height
+-- transform: scale              +-- top, left, right, bottom
+-- transform: rotate             +-- margin, padding
+-- opacity                       +-- border-radius (animated)
+-- (Composited, off main)        +-- box-shadow (animated)

RULE: Only animate transform and opacity.
Everything else causes layout recalculation.
```

### Animation Timing Guide

| Animation Type | Duration | Easing |
|----------------|----------|--------|
| Micro-interaction | 100-200ms | ease-out |
| Standard transition | 200-300ms | ease-out |
| Page transition | 300-400ms | ease-in-out |
| Complex/dramatic | 400-600ms | ease-in-out |
| Loading skeletons | 1000-1500ms | linear (loop) |

### Spring Physics

```javascript
// React Native Reanimated
withSpring(targetValue, {
  damping: 15,      // How quickly it settles (higher = faster stop)
  stiffness: 150,   // How "tight" the spring (higher = faster)
  mass: 1,          // Weight of the object
})

// Flutter
SpringSimulation(
  SpringDescription(
    mass: 1,
    stiffness: 150,
    damping: 15,
  ),
  start,
  end,
  velocity,
)

// Natural feel ranges:
// Damping: 10-20 (bouncy to settled)
// Stiffness: 100-200 (loose to tight)
// Mass: 0.5-2 (light to heavy)
```

---

> Deep dive into React Native and Flutter performance optimization, 60fps animations, memory management, and battery considerations.
> **This file covers the #1 area where AI-generated code FAILS.**

---

## 5. Memory Management

### Common Memory Leaks

| Source | Platform | Solution |
|--------|----------|----------|
| Timers | Both | Clear in cleanup/dispose |
| Event listeners | Both | Remove in cleanup/dispose |
| Subscriptions | Both | Cancel in cleanup/dispose |
| Large images | Both | Limit cache, resize |
| Async after unmount | RN | isMounted check or AbortController |
| Animation controllers | Flutter | Dispose controllers |

### Image Memory

```
Image memory = width | height | 4 bytes (RGBA)

1080p image = 1920 × 1080 | 4 = 8.3 MB
4K image = 3840 × 2160 | 4 = 33.2 MB

10 4K images = 332 MB ? App crash!

RULE: Always resize images to display size (or 2-3x for retina).
```

### Memory Profiling

```
React Native:
+-- React Native DevTools ? Performance tab
+-- Reactotron ? State + Memory monitoring
+-- Xcode Instruments (iOS)
+-- Android Studio Profiler

Flutter:
+-- DevTools ? Memory tab
+-- Observatory
+-- flutter run --profile
```

---

## Verification

Cross-check version-sensitive details with the cited official source and verify the resulting behavior in the target environment.

<a id="rule-mobile-performance-3-flutter-performance-the-const-constructo-3"></a>

## Mobile Performance: Flutter Performance - The const Constructor Revolution through 3. Flutter Performance - Dispose Pattern

**Impact:** high
**Kind:** reference
**Source:** `rules/mobile-performance-3-flutter-performance-the-const-constructo-3.md`

# Mobile Performance: Flutter Performance - The const Constructor Revolution through 3. Flutter Performance - Dispose Pattern

## Scope

Apply this guidance only to the declared platforms and repository-confirmed versions.

## Guidance

> Deep dive into React Native and Flutter performance optimization, 60fps animations, memory management, and battery considerations.
> **This file covers the #1 area where AI-generated code FAILS.**

---

## 3. Flutter Performance

### The `const` Constructor Revolution

```dart
// ? CORRECT: const prevents rebuilds

class GoodCounter extends StatefulWidget {
  const GoodCounter({super.key}); // CONST constructor!

  @override
  State<GoodCounter> createState() => _GoodCounterState();
}

class _GoodCounterState extends State<GoodCounter> {
  int _counter = 0;

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        Text('Counter: $_counter'),
        const ExpensiveWidget(), // Won't rebuild!
        const AnotherExpensiveWidget(), // Won't rebuild!
      ],
    );
  }
}

// RULE: Add `const` to EVERY widget that doesn't depend on state
```

> Deep dive into React Native and Flutter performance optimization, 60fps animations, memory management, and battery considerations.
> **This file covers the #1 area where AI-generated code FAILS.**

---

## 3. Flutter Performance

### Targeted State Management

```dart
// ? setState rebuilds whole tree
setState(() => _value = newValue);

// ? ValueListenableBuilder: surgical rebuilds
class TargetedState extends StatelessWidget {
  final ValueNotifier<int> counter = ValueNotifier(0);

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        // Only this rebuilds when counter changes
        ValueListenableBuilder<int>(
          valueListenable: counter,
          builder: (context, value, child) => Text('$value'),
          child: const Icon(Icons.star), // Won't rebuild!
        ),
        const ExpensiveWidget(), // Never rebuilds
      ],
    );
  }
}
```

> Deep dive into React Native and Flutter performance optimization, 60fps animations, memory management, and battery considerations.
> **This file covers the #1 area where AI-generated code FAILS.**

---

## 3. Flutter Performance

### Riverpod/Provider Best Practices

```dart
// ? WRONG: Reading entire provider in build
Widget build(BuildContext context) {
  final state = ref.watch(myProvider); // Rebuilds on ANY change
  return Text(state.name);
}

// ? CORRECT: Select only what you need
Widget build(BuildContext context) {
  final name = ref.watch(myProvider.select((s) => s.name));
  return Text(name); // Only rebuilds when name changes
}
```

> Deep dive into React Native and Flutter performance optimization, 60fps animations, memory management, and battery considerations.
> **This file covers the #1 area where AI-generated code FAILS.**

---

## 3. Flutter Performance

### ListView Optimization

```dart
// ? WRONG: ListView without builder (renders all)
ListView(
  children: items.map((item) => ItemWidget(item)).toList(),
)

// ? CORRECT: ListView.builder (lazy rendering)
ListView.builder(
  itemCount: items.length,
  itemBuilder: (context, index) => ItemWidget(items[index]),
  // Additional optimizations:
  itemExtent: 56, // Fixed height = faster layout
  cacheExtent: 100, // Pre-render distance
)

// ? EVEN BETTER: ListView.separated for dividers
ListView.separated(
  itemCount: items.length,
  itemBuilder: (context, index) => ItemWidget(items[index]),
  separatorBuilder: (context, index) => const Divider(),
)
```

> Deep dive into React Native and Flutter performance optimization, 60fps animations, memory management, and battery considerations.
> **This file covers the #1 area where AI-generated code FAILS.**

---

## 3. Flutter Performance

### Image Optimization

```dart
// ? WRONG: No caching, full resolution
Image.network(url)

// ? CORRECT: Cached with proper sizing
CachedNetworkImage(
  imageUrl: url,
  width: 100,
  height: 100,
  fit: BoxFit.cover,
  memCacheWidth: 200, // Cache at 2x for retina
  memCacheHeight: 200,
  placeholder: (context, url) => const Skeleton(),
  errorWidget: (context, url, error) => const Icon(Icons.error),
)
```

> Deep dive into React Native and Flutter performance optimization, 60fps animations, memory management, and battery considerations.
> **This file covers the #1 area where AI-generated code FAILS.**

---

## 3. Flutter Performance

### Dispose Pattern

```dart
class MyWidget extends StatefulWidget {
  @override
  State<MyWidget> createState() => _MyWidgetState();
}

class _MyWidgetState extends State<MyWidget> {
  late final StreamSubscription _subscription;
  late final AnimationController _controller;
  late final TextEditingController _textController;

  @override
  void initState() {
    super.initState();
    _subscription = stream.listen((_) {});
    _controller = AnimationController(vsync: this);
    _textController = TextEditingController();
  }

  @override
  void dispose() {
    // ALWAYS dispose in reverse order of creation
    _textController.dispose();
    _controller.dispose();
    _subscription.cancel();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) => Container();
}
```

## Verification

Cross-check version-sensitive details with the cited official source and verify the resulting behavior in the target environment.

<a id="rule-mobile-performance-6-battery-optimization-5"></a>

## Mobile Performance: Battery Optimization through 8. Performance Testing

**Impact:** high
**Kind:** reference
**Source:** `rules/mobile-performance-6-battery-optimization-5.md`

# Mobile Performance: Battery Optimization through 8. Performance Testing

## Scope

Apply this guidance only to the declared platforms and repository-confirmed versions.

## Guidance

> Deep dive into React Native and Flutter performance optimization, 60fps animations, memory management, and battery considerations.
> **This file covers the #1 area where AI-generated code FAILS.**

---

## 6. Battery Optimization

### Battery Drain Sources

| Source | Impact | Mitigation |
|--------|--------|------------|
| **Screen on** | ?? Highest | Dark mode on OLED |
| **GPS continuous** | ?? Very high | Use significant change |
| **Network requests** | ?? High | Batch, cache aggressively |
| **Animations** | ?? Medium | Reduce when low battery |
| **Background work** | ?? Medium | Defer non-critical |
| **CPU computation** | ?? Lower | Offload to backend |

### OLED Battery Saving

```
OLED screens: Black pixels = OFF = 0 power

Dark mode savings:
+-- True black (#000000) ? Maximum savings
+-- Dark gray (#1a1a1a) ? Slight savings
+-- Any color ? Some power
+-- White (#FFFFFF) ? Maximum power

RULE: On dark mode, use true black for backgrounds.
```

### Background Task Guidelines

```
iOS:
+-- Background refresh: Limited, system-scheduled
+-- Push notifications: Use for important updates
+-- Background modes: Location, audio, VoIP only
+-- Background tasks: Max ~30 seconds

Android:
+-- WorkManager: System-scheduled, battery-aware
+-- Foreground service: Visible to user, continuous
+-- JobScheduler: Batch network operations
+-- Doze mode: Respect it, batch operations
```

---

> Deep dive into React Native and Flutter performance optimization, 60fps animations, memory management, and battery considerations.
> **This file covers the #1 area where AI-generated code FAILS.**

---

## 7. Network Performance

### Offline-First Architecture

```
                    +--------------+
                    |     UI       |
                    +--------------+
                           |
                    +------?-------+
                    |   Cache      | ? Read from cache FIRST
                    +--------------+
                           |
                    +------?-------+
                    |   Network    | ? Update cache from network
                    +--------------+

Benefits:
+-- Instant UI (no loading spinner for cached data)
+-- Works offline
+-- Reduces data usage
+-- Better UX on slow networks
```

### Request Optimization

```
BATCH: Combine multiple requests into one
+-- 10 small requests ? 1 batch request
+-- Reduces connection overhead
+-- Better for battery (radio on once)

CACHE: Don't re-fetch unchanged data
+-- ETag/If-None-Match headers
+-- Cache-Control headers
+-- Stale-while-revalidate pattern

COMPRESS: Reduce payload size
+-- gzip/brotli compression
+-- Request only needed fields (GraphQL)
+-- Paginate large lists
```

---

> Deep dive into React Native and Flutter performance optimization, 60fps animations, memory management, and battery considerations.
> **This file covers the #1 area where AI-generated code FAILS.**

---

## 8. Performance Testing

### What to Test

| Metric | Target | Tool |
|--------|--------|------|
| **Frame rate** | = 60fps | Performance overlay |
| **Memory** | Stable, no growth | Profiler |
| **Cold start** | < 2s | Manual timing |
| **TTI (Time to Interactive)** | < 3s | Lighthouse |
| **List scroll** | No jank | Manual feel |
| **Animation smoothness** | No drops | Performance monitor |

### Test on Real Devices

```
?? NEVER trust only:
+-- Simulator/emulator (faster than real)
+-- Dev mode (slower than release)
+-- High-end devices only

? ALWAYS test on:
+-- Low-end Android (< $200 phone)
+-- Older iOS device (iPhone 8 or SE)
+-- Release/profile build
+-- With real data (not 10 items)
```

### Performance Monitoring Checklist

```markdown
## During Development
- [ ] Performance overlay enabled
- [ ] Watching for dropped frames
- [ ] Memory usage stable
- [ ] No console warnings about performance

## Before Release
- [ ] Tested on low-end device
- [ ] Profiled memory over extended use
- [ ] Cold start time measured
- [ ] List scroll tested with 1000+ items
- [ ] Animations tested at 60fps
- [ ] Network tested on slow 3G
```

---

## Verification

Cross-check version-sensitive details with the cited official source and verify the resulting behavior in the target environment.

<a id="rule-mobile-performance-9-quick-reference-card-6"></a>

## Mobile Performance: Quick Reference Card

**Impact:** high
**Kind:** reference
**Source:** `rules/mobile-performance-9-quick-reference-card-6.md`

# Mobile Performance: Quick Reference Card

## Scope

Apply this guidance only to the declared platforms and repository-confirmed versions.

## Guidance

> Deep dive into React Native and Flutter performance optimization, 60fps animations, memory management, and battery considerations.
> **This file covers the #1 area where AI-generated code FAILS.**

---

## 9. Quick Reference Card

### React Native Essentials

```javascript
// List: Always use
<FlatList
  data={data}
  renderItem={useCallback(({item}) => <MemoItem item={item} />, [])}
  keyExtractor={useCallback(item => item.id, [])}
  getItemLayout={useCallback((_, i) => ({length: H, offset: H*i, index: i}), [])}
/>

// Animation: Always native
useNativeDriver: true

// Cleanup: Always present
useEffect(() => {
  return () => cleanup();
}, []);
```

### Flutter Essentials

```dart
// Widgets: Always const
const MyWidget()

// Lists: Always builder
ListView.builder(itemBuilder: ...)

// State: Always targeted
ValueListenableBuilder() or ref.watch(provider.select(...))

// Dispose: Always cleanup
@override
void dispose() {
  controller.dispose();
  super.dispose();
}
```

### Animation Targets

```
Transform/Opacity only ? What to animate
16.67ms per frame ? Time budget
60fps minimum ? Target
Low-end Android ? Test device
```

---

> **Remember:** Performance is not optimization|it's baseline quality. A slow app is a broken app. Test on the worst device your users have, not the best device you have.

---

## Verification

Cross-check version-sensitive details with the cited official source and verify the resulting behavior in the target environment.

<a id="rule-mobile-testing-3-what-to-test-at-each-level-2"></a>

## Mobile Testing: What to Test at Each Level through 6. Performance Testing

**Impact:** high
**Kind:** process
**Source:** `rules/mobile-testing-3-what-to-test-at-each-level-2.md`

# Mobile Testing: What to Test at Each Level through 6. Performance Testing

## Preconditions

Capture the baseline, target environment, acceptance criteria, and rollback point.

## Procedure

> **Mobile testing is NOT web testing. Different constraints, different strategies.**
> This file teaches WHEN to use each testing approach and WHY.
> **Code examples are minimal - focus on decision-making.**

---

## 3. What to Test at Each Level

### Unit Tests (Jest)

```
✅ TEST:
├── Utility functions (formatDate, calculatePrice)
├── State reducers (Redux, Zustand stores)
├── API response transformers
├── Validation logic
└── Business rules

❌ DON'T TEST:
├── Component rendering (use component tests)
├── Navigation (use integration tests)
├── Native modules (mock them)
└── Third-party libraries
```

### Component Tests (RNTL / flutter_test)

```
✅ TEST:
├── Component renders correctly
├── User interactions (tap, type, swipe)
├── Loading/error/empty states
├── Accessibility labels exist
└── Props change behavior

❌ DON'T TEST:
├── Internal implementation details
├── Snapshot everything (only key components)
├── Styling specifics (brittle)
└── Third-party component internals
```

### Integration Tests

```
✅ TEST:
├── Form submission flows
├── Navigation between screens
├── State persistence across screens
├── API integration (with mocked server)
└── Context/provider interactions

❌ DON'T TEST:
├── Every possible path (use unit tests)
├── Third-party services (mock them)
└── Backend logic (backend tests)
```

### E2E Tests

```
✅ TEST:
├── Critical user journeys (login, purchase, signup)
├── Offline → online transitions
├── Deep link handling
├── Push notification navigation
├── Permission flows
└── Payment flows

❌ DON'T TEST:
├── Every edge case (too slow)
├── Visual regression (use snapshot tests)
├── Non-critical features
└── Backend-only logic
```

---

> **Mobile testing is NOT web testing. Different constraints, different strategies.**
> This file teaches WHEN to use each testing approach and WHY.
> **Code examples are minimal - focus on decision-making.**

---

## 4. Platform-Specific Testing

### What Differs Between iOS and Android?

| Area | iOS Behavior | Android Behavior | Test Both? |
|------|--------------|------------------|------------|
| **Back navigation** | Edge swipe | System back button | ✅ YES |
| **Permissions** | Ask once, settings | Ask each time, rationale | ✅ YES |
| **Keyboard** | Different appearance | Different behavior | ✅ YES |
| **Date picker** | Wheel/modal | Material dialog | ⚠️ If custom UI |
| **Push format** | APNs payload | FCM payload | ✅ YES |
| **Deep links** | Universal Links | App Links | ✅ YES |
| **Gestures** | Some unique | Material gestures | ⚠️ If custom |

### Platform Testing Strategy

```
FOR EACH PLATFORM:
├── Run unit tests (same on both)
├── Run component tests (same on both)
├── Run E2E on REAL DEVICE
│   ├── iOS: iPhone (not just simulator)
│   └── Android: Mid-range device (not flagship)
└── Test platform-specific features separately
```

---

> **Mobile testing is NOT web testing. Different constraints, different strategies.**
> This file teaches WHEN to use each testing approach and WHY.
> **Code examples are minimal - focus on decision-making.**

---

## 5. Offline & Network Testing

### Offline Scenarios to Test

| Scenario | What to Verify |
|----------|----------------|
| Start app offline | Shows cached data or offline message |
| Go offline mid-action | Action queued, not lost |
| Come back online | Queue synced, no duplicates |
| Slow network (2G) | Loading states, timeouts work |
| Flaky network | Retry logic, error recovery |

### How to Test Network Conditions

```
APPROACH:
├── Unit tests: Mock NetInfo, test logic
├── Integration: Mock API responses, test UI
├── E2E (Detox): Use device.setURLBlacklist()
├── E2E (Maestro): Use network conditions
└── Manual: Use Charles Proxy / Network Link Conditioner
```

---

> **Mobile testing is NOT web testing. Different constraints, different strategies.**
> This file teaches WHEN to use each testing approach and WHY.
> **Code examples are minimal - focus on decision-making.**

---

## 6. Performance Testing

### What to Measure

| Metric | Target | How to Measure |
|--------|--------|----------------|
| **App startup** | < 2 seconds | Profiler, Flashlight |
| **Screen transition** | < 300ms | React DevTools |
| **List scroll** | 60 FPS | Profiler, feel |
| **Memory** | Stable, no leaks | Instruments / Android Profiler |
| **Bundle size** | Minimize | Metro bundler analysis |

### When to Performance Test

```
PERFORMANCE TEST:
├── Before release (required)
├── After adding heavy features
├── After upgrading dependencies
├── When users report slowness
└── On CI (optional, automated benchmarks)

WHERE TO TEST:
├── Real device (REQUIRED)
├── Low-end device (Galaxy A series, old iPhone)
├── NOT on emulator (lies about performance)
└── With production-like data (not 3 items)
```

---

## Rollback

Restore the baseline if required tooling errors or the procedure introduces a regression.

## Exit Gate

Require fresh evidence for the intended behavior and all applicable project checks.

<a id="rule-mobile-testing-7-accessibility-testing-3"></a>

## Mobile Testing: Accessibility Testing through Related

**Impact:** high
**Kind:** process
**Source:** `rules/mobile-testing-7-accessibility-testing-3.md`

# Mobile Testing: Accessibility Testing through Related

## Preconditions

Capture the baseline, target environment, acceptance criteria, and rollback point.

## Procedure

> **Mobile testing is NOT web testing. Different constraints, different strategies.**
> This file teaches WHEN to use each testing approach and WHY.
> **Code examples are minimal - focus on decision-making.**

---

## 7. Accessibility Testing

### What to Verify

| Element | Check |
|---------|-------|
| Interactive elements | Have accessibilityLabel |
| Images | Have alt text or decorative flag |
| Forms | Labels linked to inputs |
| Buttons | Role = button |
| Touch targets | ≥ 44x44 (iOS) / 48x48 (Android) |
| Color contrast | WCAG AA minimum |

### How to Test

```
AUTOMATED:
├── React Native: jest-axe
├── Flutter: Accessibility checker in tests
└── Lint rules for missing labels

MANUAL:
├── Enable VoiceOver (iOS) / TalkBack (Android)
├── Navigate entire app with screen reader
├── Test with increased text size
└── Test with reduced motion
```

---

> **Mobile testing is NOT web testing. Different constraints, different strategies.**
> This file teaches WHEN to use each testing approach and WHY.
> **Code examples are minimal - focus on decision-making.**

---

## 8. CI/CD Integration

### What to Run Where

| Stage | Tests | Devices |
|-------|-------|---------|
| **PR** | Unit + Component | None (fast) |
| **Merge to main** | + Integration | Simulator/Emulator |
| **Pre-release** | + E2E | Real devices (farm) |
| **Nightly** | Full suite | Device farm |

### Device Farm Options

| Service | Pros | Cons |
|---------|------|------|
| **Firebase Test Lab** | Free tier, Google devices | Android focus |
| **AWS Device Farm** | Wide selection | Expensive |
| **BrowserStack** | Good UX | Expensive |
| **Local devices** | Free, reliable | Limited variety |

---

> **Mobile testing is NOT web testing. Different constraints, different strategies.**
> This file teaches WHEN to use each testing approach and WHY.
> **Code examples are minimal - focus on decision-making.**

---

## 📝 MOBILE TESTING CHECKLIST

### Before PR
- [ ] Unit tests for new logic
- [ ] Component tests for new UI
- [ ] No console.logs in tests
- [ ] Tests pass on CI

### Before Release
- [ ] E2E on real iOS device
- [ ] E2E on real Android device
- [ ] Tested on low-end device
- [ ] Offline scenarios verified
- [ ] Performance acceptable
- [ ] Accessibility verified

### What to Skip (Consciously)
- [ ] 100% coverage (aim for meaningful coverage)
- [ ] Every visual permutation (use snapshots sparingly)
- [ ] Third-party library internals
- [ ] Backend logic (separate tests)

---

> **Mobile testing is NOT web testing. Different constraints, different strategies.**
> This file teaches WHEN to use each testing approach and WHY.
> **Code examples are minimal - focus on decision-making.**

---

## 🎯 Testing Questions to Ask

Before writing tests, answer:

1. **What could break?** → Test that
2. **What's critical for users?** → E2E test that
3. **What's complex logic?** → Unit test that
4. **What's platform-specific?** → Test on both platforms
5. **What happens offline?** → Test that scenario

> **Remember:** Good mobile testing is about testing the RIGHT things, not EVERYTHING. A flaky E2E test is worse than no test. A failing unit test that catches a bug is worth 100 passing trivial tests.

---

> **Mobile testing is NOT web testing. Different constraints, different strategies.**
> This file teaches WHEN to use each testing approach and WHY.
> **Code examples are minimal - focus on decision-making.**

---

## 🔗 Related

| File | When to Read |
|------|-------------|
| [mobile-debugging.md](mobile-debugging-debugging-mindset.md) | When tests reveal bugs |
| [mobile-performance.md](mobile-performance-1-the-mobile-performance-mindset.md) | Performance testing deep-dive |
| [decision-trees.md](decision-trees-1-framework-selection.md) | Framework selection (affects tools) |
| [../frameworks/react-native.md](react-native-framework-decision.md) | RN testing patterns |
| [../frameworks/flutter.md](flutter-widget-architecture.md) | Flutter testing patterns |
| [../frameworks/native.md](native-when-to-go-native.md) | Native testing patterns |

---

## Rollback

Restore the baseline if required tooling errors or the procedure introduces a regression.

## Exit Gate

Require fresh evidence for the intended behavior and all applicable project checks.

<a id="rule-mobile-testing-mobile-testing-mindset"></a>

## Mobile Testing: MOBILE TESTING MINDSET through 2. Testing Pyramid for Mobile

**Impact:** high
**Kind:** process
**Source:** `rules/mobile-testing-mobile-testing-mindset.md`

# Mobile Testing: MOBILE TESTING MINDSET through 2. Testing Pyramid for Mobile

## Preconditions

Capture the baseline, target environment, acceptance criteria, and rollback point.

## Procedure

> **Mobile testing is NOT web testing. Different constraints, different strategies.**
> This file teaches WHEN to use each testing approach and WHY.
> **Code examples are minimal - focus on decision-making.**

---

## 🧠 MOBILE TESTING MINDSET

```
Mobile testing differs from web:
├── Real devices matter (emulators hide bugs)
├── Platform differences (iOS vs Android behavior)
├── Network conditions vary wildly
├── Battery/performance under test
├── App lifecycle (background, killed, restored)
├── Permissions and system dialogs
└── Touch interactions vs clicks
```

---

> **Mobile testing is NOT web testing. Different constraints, different strategies.**
> This file teaches WHEN to use each testing approach and WHY.
> **Code examples are minimal - focus on decision-making.**

---

## 🚫 AI MOBILE TESTING ANTI-PATTERNS

| ❌ AI Default | Why It's Wrong | ✅ Mobile-Correct |
|---------------|----------------|-------------------|
| Jest-only testing | Misses native layer | Jest + E2E on device |
| Enzyme patterns | Deprecated, web-focused | React Native Testing Library |
| Browser-based E2E (Cypress) | Can't test native features | Detox / Maestro |
| Mock everything | Misses integration bugs | Real device testing |
| Ignore platform tests | iOS/Android differ | Platform-specific cases |
| Skip performance tests | Mobile perf is critical | Profile on low-end device |
| Test only happy path | Mobile has more edge cases | Offline, permissions, interrupts |
| 100% unit test coverage | False security | Pyramid balance |
| Copy web testing patterns | Different environment | Mobile-specific tools |

---

> **Mobile testing is NOT web testing. Different constraints, different strategies.**
> This file teaches WHEN to use each testing approach and WHY.
> **Code examples are minimal - focus on decision-making.**

---

## 1. Testing Tool Selection

### Decision Tree

```
WHAT ARE YOU TESTING?
        │
        ├── Pure functions, utilities, helpers
        │   └── Jest (unit tests)
        │       └── No special mobile setup needed
        │
        ├── Individual components (isolated)
        │   ├── React Native → React Native Testing Library
        │   └── Flutter → flutter_test (widget tests)
        │
        ├── Components with hooks, context, navigation
        │   ├── React Native → RNTL + mocked providers
        │   └── Flutter → integration_test package
        │
        ├── Full user flows (login, checkout, etc.)
        │   ├── Detox (React Native, fast, reliable)
        │   ├── Maestro (Cross-platform, YAML-based)
        │   └── Appium (Legacy, slow, last resort)
        │
        └── Performance, memory, battery
            ├── Flashlight (RN performance)
            ├── Flutter DevTools
            └── Real device profiling (Xcode/Android Studio)
```

### Tool Comparison

| Tool | Platform | Speed | Reliability | Use When |
|------|----------|-------|-------------|----------|
| **Jest** | RN | ⚡⚡⚡ | ⚡⚡⚡ | Unit tests, logic |
| **RNTL** | RN | ⚡⚡⚡ | ⚡⚡ | Component tests |
| **flutter_test** | Flutter | ⚡⚡⚡ | ⚡⚡⚡ | Widget tests |
| **Detox** | RN | ⚡⚡ | ⚡⚡⚡ | E2E, critical flows |
| **Maestro** | Both | ⚡⚡ | ⚡⚡ | E2E, cross-platform |
| **Appium** | Both | ⚡ | ⚡ | Legacy, last resort |

---

> **Mobile testing is NOT web testing. Different constraints, different strategies.**
> This file teaches WHEN to use each testing approach and WHY.
> **Code examples are minimal - focus on decision-making.**

---

## 2. Testing Pyramid for Mobile

```
                    ┌───────────────┐
                    │    E2E Tests  │  10%
                    │  (Real device) │  Slow, expensive, essential
                    ├───────────────┤
                    │  Integration  │  20%
                    │    Tests      │  Component + context
                    ├───────────────┤
                    │  Component    │  30%
                    │    Tests      │  Isolated UI
                    ├───────────────┤
                    │   Unit Tests  │  40%
                    │    (Jest)     │  Pure logic
                    └───────────────┘
```

### Why This Distribution?

| Level | Why This % |
|-------|------------|
| **E2E 10%** | Slow, flaky, but catches integration bugs |
| **Integration 20%** | Tests real user flows without full app |
| **Component 30%** | Fast feedback on UI changes |
| **Unit 40%** | Fastest, most stable, logic coverage |

> 🔴 **If you have 90% unit tests and 0% E2E, you're testing the wrong things.**

---

## Rollback

Restore the baseline if required tooling errors or the procedure introduces a regression.

## Exit Gate

Require fresh evidence for the intended behavior and all applicable project checks.

<a id="rule-mobile-typography-1-mobile-typography-fundamentals"></a>

## Mobile Typography: Mobile Typography Fundamentals through 3. Type Scale

**Impact:** high
**Kind:** reference
**Source:** `rules/mobile-typography-1-mobile-typography-fundamentals.md`

# Mobile Typography: Mobile Typography Fundamentals through 3. Type Scale

## Scope

Apply only to the declared platforms and repository-confirmed versions.

## Guidance

> Type scale, system fonts, Dynamic Type, accessibility, and dark mode typography.
> **Typography failures are the #1 cause of unreadable mobile apps.**

---

## 1. Mobile Typography Fundamentals

### Why Mobile Type is Different

```
DESKTOP:                        MOBILE:
├── 20-30" viewing distance     ├── 12-15" viewing distance
├── Large viewport              ├── Small viewport, narrow
├── Hover for details           ├── Tap/scroll for details
├── Controlled lighting         ├── Variable (outdoor, etc.)
├── Fixed font size             ├── User-controlled sizing
└── Long reading sessions       └── Quick scanning
```

### Mobile Type Rules

| Rule | Desktop | Mobile |
|------|---------|--------|
| **Minimum body size** | 14px | 16px (14pt/14sp) |
| **Maximum line length** | 75 characters | 40-60 characters |
| **Line height** | 1.4-1.5 | 1.4-1.6 (more generous) |
| **Font weight** | Varies | Regular dominant, bold sparingly |
| **Contrast** | AA (4.5:1) | AA minimum, AAA preferred |

---

> Type scale, system fonts, Dynamic Type, accessibility, and dark mode typography.
> **Typography failures are the #1 cause of unreadable mobile apps.**

---

## 2. System Fonts

### iOS: SF Pro Family

```
San Francisco (SF) Family:
├── SF Pro Display: Large text (≥ 20pt)
├── SF Pro Text: Body text (< 20pt)
├── SF Pro Rounded: Friendly contexts
├── SF Mono: Monospace
└── SF Compact: Apple Watch, compact UI

Features:
├── Optical sizing (auto-adjusts)
├── Dynamic tracking (spacing)
├── Tabular/proportional figures
├── Excellent legibility
```

### Android: Roboto Family

```
Roboto Family:
├── Roboto: Default sans-serif
├── Roboto Flex: Variable font
├── Roboto Serif: Serif option
├── Roboto Mono: Monospace
├── Roboto Condensed: Narrow spaces

Features:
├── Optimized for screens
├── Wide language support
├── Multiple weights
├── Good at small sizes
```

### When to Use System Fonts

```
✅ USE system fonts when:
├── Brand doesn't mandate custom font
├── Reading efficiency is priority
├── App feels native/integrated important
├── Performance is critical
├── Wide language support needed

❌ AVOID system fonts when:
├── Brand identity requires custom
├── Design differentiation needed
├── Editorial/magazine style
└── (But still support accessibility)
```

### Custom Font Considerations

```
If using custom fonts:
├── Include all weights needed
├── Subset for file size
├── Test at all Dynamic Type sizes
├── Provide fallback to system
├── Test rendering quality
└── Check language support
```

---

> Type scale, system fonts, Dynamic Type, accessibility, and dark mode typography.
> **Typography failures are the #1 cause of unreadable mobile apps.**

---

## 3. Type Scale

### iOS Type Scale (Built-in)

| Style | Size | Weight | Line Height |
|-------|------|--------|-------------|
| Large Title | 34pt | Bold | 41pt |
| Title 1 | 28pt | Bold | 34pt |
| Title 2 | 22pt | Bold | 28pt |
| Title 3 | 20pt | Semibold | 25pt |
| Headline | 17pt | Semibold | 22pt |
| Body | 17pt | Regular | 22pt |
| Callout | 16pt | Regular | 21pt |
| Subhead | 15pt | Regular | 20pt |
| Footnote | 13pt | Regular | 18pt |
| Caption 1 | 12pt | Regular | 16pt |
| Caption 2 | 11pt | Regular | 13pt |

### Android Type Scale (Material 3)

| Role | Size | Weight | Line Height |
|------|------|--------|-------------|
| Display Large | 57sp | 400 | 64sp |
| Display Medium | 45sp | 400 | 52sp |
| Display Small | 36sp | 400 | 44sp |
| Headline Large | 32sp | 400 | 40sp |
| Headline Medium | 28sp | 400 | 36sp |
| Headline Small | 24sp | 400 | 32sp |
| Title Large | 22sp | 400 | 28sp |
| Title Medium | 16sp | 500 | 24sp |
| Title Small | 14sp | 500 | 20sp |
| Body Large | 16sp | 400 | 24sp |
| Body Medium | 14sp | 400 | 20sp |
| Body Small | 12sp | 400 | 16sp |
| Label Large | 14sp | 500 | 20sp |
| Label Medium | 12sp | 500 | 16sp |
| Label Small | 11sp | 500 | 16sp |

### Creating Custom Scale

```
If creating custom scale, use modular ratio:

Recommended ratios:
├── 1.125 (Major second): Dense UI
├── 1.200 (Minor third): Compact
├── 1.250 (Major third): Balanced (common)
├── 1.333 (Perfect fourth): Spacious
└── 1.500 (Perfect fifth): Dramatic

Example with 1.25 ratio, 16px base:
├── xs: 10px (16 ÷ 1.25 ÷ 1.25)
├── sm: 13px (16 ÷ 1.25)
├── base: 16px
├── lg: 20px (16 × 1.25)
├── xl: 25px (16 × 1.25 × 1.25)
├── 2xl: 31px
├── 3xl: 39px
└── 4xl: 49px
```

---

## Verification

Cross-check version-sensitive details with the cited official source and verify behavior in the target environment.

<a id="rule-mobile-typography-4-dynamic-type-text-scaling-2"></a>

## Mobile Typography: Dynamic Type / Text Scaling through 7. Typography Anti-Patterns

**Impact:** high
**Kind:** reference
**Source:** `rules/mobile-typography-4-dynamic-type-text-scaling-2.md`

# Mobile Typography: Dynamic Type / Text Scaling through 7. Typography Anti-Patterns

## Scope

Apply only to the declared platforms and repository-confirmed versions.

## Guidance

> Type scale, system fonts, Dynamic Type, accessibility, and dark mode typography.
> **Typography failures are the #1 cause of unreadable mobile apps.**

---

## 4. Dynamic Type / Text Scaling

### iOS Dynamic Type (MANDATORY)

```swift
// ❌ WRONG: Fixed size (doesn't scale)
Text("Hello")
    .font(.system(size: 17))

// ✅ CORRECT: Dynamic Type
Text("Hello")
    .font(.body) // Scales with user setting

// Custom font with scaling
Text("Hello")
    .font(.custom("MyFont", size: 17, relativeTo: .body))
```

### Android Text Scaling (MANDATORY)

```
ALWAYS use sp for text:
├── sp = Scale-independent pixels
├── Scales with user font preference
├── dp does NOT scale (don't use for text)

User can scale from 85% to 200%:
├── Default (100%): 14sp = 14dp
├── Largest (200%): 14sp = 28dp

Test at 200%!
```

### Scaling Challenges

```
Problems at large text sizes:
├── Text overflows containers
├── Buttons become too tall
├── Icons look small relative to text
├── Layouts break

Solutions:
├── Use flexible containers (not fixed height)
├── Allow text wrapping
├── Scale icons with text
├── Test at extremes during development
├── Use scrollable containers for long text
```

---

> Type scale, system fonts, Dynamic Type, accessibility, and dark mode typography.
> **Typography failures are the #1 cause of unreadable mobile apps.**

---

## 5. Typography Accessibility

### Minimum Sizes

| Element | Minimum | Recommended |
|---------|---------|-------------|
| Body text | 14px/pt/sp | 16px/pt/sp |
| Secondary text | 12px/pt/sp | 13-14px/pt/sp |
| Captions | 11px/pt/sp | 12px/pt/sp |
| Buttons | 14px/pt/sp | 14-16px/pt/sp |
| **Nothing smaller** | 11px | - |

### Contrast Requirements (WCAG)

```
Normal text (< 18pt or < 14pt bold):
├── AA: 4.5:1 ratio minimum
├── AAA: 7:1 ratio recommended

Large text (≥ 18pt or ≥ 14pt bold):
├── AA: 3:1 ratio minimum
├── AAA: 4.5:1 ratio recommended

Logos/decorative: No requirement
```

### Line Height for Accessibility

```
WCAG Success Criterion 1.4.12:

Line height (line spacing): ≥ 1.5×
Paragraph spacing: ≥ 2× font size
Letter spacing: ≥ 0.12× font size
Word spacing: ≥ 0.16× font size

Mobile recommendation:
├── Body: 1.4-1.6 line height
├── Headings: 1.2-1.3 line height
├── Never below 1.2
```

---

> Type scale, system fonts, Dynamic Type, accessibility, and dark mode typography.
> **Typography failures are the #1 cause of unreadable mobile apps.**

---

## 6. Dark Mode Typography

### Color Adjustments

```
Light Mode:               Dark Mode:
├── Black text (#000)     ├── White/light gray (#E0E0E0)
├── High contrast         ├── Slightly reduced contrast
├── Full saturation       ├── Desaturated colors
└── Dark = emphasis       └── Light = emphasis

RULE: Don't use pure white (#FFF) on dark.
Use off-white (#E0E0E0 to #F0F0F0) to reduce eye strain.
```

### Dark Mode Hierarchy

| Level | Light Mode | Dark Mode |
|-------|------------|-----------|
| Primary text | #000000 | #E8E8E8 |
| Secondary text | #666666 | #A0A0A0 |
| Tertiary text | #999999 | #707070 |
| Disabled text | #CCCCCC | #505050 |

### Weight in Dark Mode

```
Dark mode text appears thinner due to halation
(light bleeding into dark background)

Consider:
├── Using medium weight for body (instead of regular)
├── Increasing letter-spacing slightly
├── Testing on actual OLED displays
└── Using slightly bolder weight than light mode
```

---

> Type scale, system fonts, Dynamic Type, accessibility, and dark mode typography.
> **Typography failures are the #1 cause of unreadable mobile apps.**

---

## 7. Typography Anti-Patterns

### ❌ Common Mistakes

| Mistake | Problem | Fix |
|---------|---------|-----|
| **Fixed font sizes** | Ignores accessibility | Use dynamic sizing |
| **Too small text** | Unreadable | Min 14pt/sp |
| **Low contrast** | Invisible in sunlight | Min 4.5:1 |
| **Long lines** | Hard to track | Max 60 chars |
| **Tight line height** | Cramped, hard to read | Min 1.4× |
| **Too many sizes** | Visual chaos | Max 5-7 sizes |
| **All caps body** | Hard to read | Headlines only |
| **Light gray on white** | Impossible in bright light | Higher contrast |

### ❌ AI Typography Mistakes

```
AI tends to:
├── Use fixed px values instead of pt/sp
├── Skip Dynamic Type support
├── Use too small text (12-14px body)
├── Ignore line height settings
├── Use low contrast "aesthetic" grays
├── Apply same scale to mobile as desktop
└── Skip testing at large text sizes

RULE: Typography must SCALE.
Test at smallest and largest settings.
```

---

## Verification

Cross-check version-sensitive details with the cited official source and verify behavior in the target environment.

<a id="rule-mobile-typography-8-font-loading-performance-3"></a>

## Mobile Typography: Font Loading & Performance through Related

**Impact:** high
**Kind:** reference
**Source:** `rules/mobile-typography-8-font-loading-performance-3.md`

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

<a id="rule-native-error-handling-android-3"></a>

## Native: Error Handling (Android) through Related Sub-Skills

**Impact:** high
**Kind:** reference
**Source:** `rules/native-error-handling-android-3.md`

# Native: Error Handling (Android) through Related Sub-Skills

## Scope

Apply this guidance only to the declared platforms and repository-confirmed versions.

## Guidance

> **Philosophy:** Platform-first. Use native when you need the deepest integration.

---

## Error Handling (Android)

### Sealed Result

```kotlin
sealed class Result<out T> {
    data class Success<T>(val data: T) : Result<T>()
    data class Error(val exception: AppException) : Result<Nothing>()
}

suspend fun getUser(id: String): Result<User> {
    return try {
        val user = api.fetchUser(id)
        Result.Success(user)
    } catch (e: HttpException) {
        Result.Error(AppException.fromHttp(e))
    } catch (e: IOException) {
        Result.Error(AppException.Network(e))
    }
}
```

### Global Crash Handler

```kotlin
class App : Application() {
    override fun onCreate() {
        super.onCreate()
        Thread.setDefaultUncaughtExceptionHandler { _, throwable ->
            Firebase.crashlytics.recordException(throwable)
        }
    }
}
```

---

> **Philosophy:** Platform-first. Use native when you need the deepest integration.

---

## Accessibility (Android)

```kotlin
Button(
    onClick = { submitOrder() },
    modifier = Modifier.semantics {
        contentDescription = "Submit your order"
    }
) {
    Text("Submit")
}

// Dynamic font scaling — Material3 handles automatically
Text(
    text = "Hello",
    style = MaterialTheme.typography.bodyLarge  // Scales with system
)
```

---

> **Philosophy:** Platform-first. Use native when you need the deepest integration.

---

## Offline Patterns (Android)

| Strategy | Library | Use Case |
|----------|---------|----------|
| Key-value | DataStore | Settings, preferences |
| Database | Room | Structured data, offline-first |
| File cache | OkHttp cache | HTTP response cache |
| Work | WorkManager | Background sync |

```kotlin
// Room entity
@Entity
data class Task(
    @PrimaryKey val id: String,
    val title: String,
    val isComplete: Boolean,
    val createdAt: Long
)

@Dao
interface TaskDao {
    @Query("SELECT * FROM task ORDER BY createdAt DESC")
    fun observeAll(): Flow<List<Task>>

    @Upsert
    suspend fun upsert(task: Task)
}
```

---

> **Philosophy:** Platform-first. Use native when you need the deepest integration.

---

## Security (Android)

| Concern | Solution |
|---------|----------|
| Secrets | EncryptedSharedPreferences / Android Keystore |
| Network | Network Security Config (TLS enforcement) |
| SSL pinning | OkHttp `CertificatePinner` |
| Biometrics | BiometricPrompt API |
| Code obfuscation | R8/ProGuard (default in release) |
| Root detection | SafetyNet / Play Integrity API |

---

> **Philosophy:** Platform-first. Use native when you need the deepest integration.

---

## CI/CD (Android)

| Tool | Use Case |
|------|----------|
| GitHub Actions | `ubuntu-latest` + Gradle build |
| Fastlane | `fastlane android beta` / `release` |
| Firebase App Distribution | Internal testing |
| Play Console | Staged rollout (1% → 10% → 100%) |

---

> **Philosophy:** Platform-first. Use native when you need the deepest integration.

---

## Best Practices (Android)

| ✅ Do | ❌ Don't |
|----|-------|
| Use `remember` wisely | Remember everything |
| Hoist state up | State in leaf composables |
| Use LazyColumn | Column with many items |
| Side effects in LaunchedEffect | Side effects in composition |
| Sealed Result for errors | Generic try-catch |
| Room for persistence | Raw SharedPreferences for data |

---

> **Philosophy:** Platform-first. Use native when you need the deepest integration.

---

## Modifier Chain

```kotlin
// Order matters!
Text(
    text = "Hello",
    modifier = Modifier
        .padding(16.dp)          // Padding inside
        .background(Color.Blue)   // Background
        .padding(8.dp)            // Padding outside
        .clickable { }            // Click area
)
```

---

> **Philosophy:** Platform-first. Use native when you need the deepest integration.

---

## Cross-Platform Comparison

| Feature | SwiftUI | Compose |
|---------|---------|---------|
| UI Declaration | `var body: some View` | `@Composable fun` |
| Local State | `@State` | `remember` |
| Side Effects | `.task {}` | `LaunchedEffect` |
| Lists | `List` / `LazyVStack` | `LazyColumn` |
| Theming | Environment | MaterialTheme |
| Testing | XCTest + XCUITest | JUnit + Compose Testing |
| Error Pattern | `Result<T, AppError>` | `sealed class Result<T>` |
| Offline | SwiftData / Core Data | Room |

---

> **Philosophy:** Platform-first. Use native when you need the deepest integration.

---

## 🔗 Related Sub-Skills

| File | When to Read |
|------|-------------|
| [publishing/app-store-optimization.md](app-store-optimization-core-aso-elements.md) | Preparing for App Store / Play Store |
| [publishing/deep-linking.md](deep-linking-deep-link-types.md) | Universal links, app links |
| [publishing/push-notifications.md](push-notifications-platform-services.md) | FCM / APNs setup |

---

## Verification

Cross-check version-sensitive details with the cited official source and verify the resulting behavior in the target environment.

<a id="rule-native-offline-patterns-ios-2"></a>

## Native: Offline Patterns (iOS) through Testing (Android)

**Impact:** high
**Kind:** reference
**Source:** `rules/native-offline-patterns-ios-2.md`

# Native: Offline Patterns (iOS) through Testing (Android)

## Scope

Apply this guidance only to the declared platforms and repository-confirmed versions.

## Guidance

> **Philosophy:** Platform-first. Use native when you need the deepest integration.

---

## Offline Patterns (iOS)

| Strategy | Framework | Use Case |
|----------|-----------|----------|
| Key-value | UserDefaults / Keychain | Settings, tokens |
| Database | SwiftData / Core Data | Structured data |
| File cache | URLCache | HTTP response cache |
| Sync | CloudKit | iCloud sync |

```swift
// SwiftData (iOS 17+)
@Model
class Task {
    var title: String
    var isComplete: Bool
    var createdAt: Date

    init(title: String) {
        self.title = title
        self.isComplete = false
        self.createdAt = .now
    }
}
```

---

> **Philosophy:** Platform-first. Use native when you need the deepest integration.

---

## Security (iOS)

| Concern | Solution |
|---------|----------|
| Secrets | Keychain Services API |
| Network | App Transport Security (ATS) enforced |
| SSL pinning | `URLSessionDelegate` certificate validation |
| Biometrics | LocalAuthentication framework (Face ID / Touch ID) |
| Code signing | Automatic via Xcode |
| Jailbreak detection | `FileManager` checks + `canOpenURL` |

---

> **Philosophy:** Platform-first. Use native when you need the deepest integration.

---

## CI/CD (iOS)

| Tool | Use Case |
|------|----------|
| Xcode Cloud | Native CI/CD, TestFlight distribution |
| Fastlane | `fastlane ios beta` / `fastlane ios release` |
| GitHub Actions | `macos-latest` runner with `xcodebuild` |

---

> **Philosophy:** Platform-first. Use native when you need the deepest integration.

---

## Best Practices (iOS)

| ✅ Do | ❌ Don't |
|----|-------|
| Use async/await | Completion handlers |
| Prefer @Observable (iOS 17+) | @Published everywhere |
| Extract subviews | Massive body methods |
| Use ViewModifiers | Repeated styling |
| Structured error types | Generic catches |
| SwiftData for persistence | Raw UserDefaults for data |

---

# Kotlin Compose (Android)

> **Philosophy:** Platform-first. Use native when you need the deepest integration.

---

## Composable Functions

```kotlin
@Composable
fun Counter() {
    var count by remember { mutableStateOf(0) }

    Column(
        modifier = Modifier.padding(16.dp),
        verticalArrangement = Arrangement.spacedBy(8.dp)
    ) {
        Text(
            text = "Count: $count",
            style = MaterialTheme.typography.headlineLarge
        )

        Button(onClick = { count++ }) {
            Text("Increment")
        }
    }
}
```

---

> **Philosophy:** Platform-first. Use native when you need the deepest integration.

---

## State Management (Android)

| API | Use Case |
|-----|----------|
| `remember` | Survive recomposition |
| `rememberSaveable` | Survive config changes |
| `collectAsState()` | Flow to State |
| `ViewModel` | Business logic container |

### ViewModel Pattern

```kotlin
class UserViewModel : ViewModel() {
    private val _uiState = MutableStateFlow(UserUiState())
    val uiState: StateFlow<UserUiState> = _uiState.asStateFlow()

    fun loadUser(id: String) {
        viewModelScope.launch {
            _uiState.update { it.copy(isLoading = true) }
            val user = repository.getUser(id)
            _uiState.update { it.copy(user = user, isLoading = false) }
        }
    }
}

@Composable
fun UserScreen(viewModel: UserViewModel = hiltViewModel()) {
    val uiState by viewModel.uiState.collectAsState()

    if (uiState.isLoading) {
        CircularProgressIndicator()
    } else {
        Text(uiState.user?.name ?: "")
    }
}
```

---

> **Philosophy:** Platform-first. Use native when you need the deepest integration.

---

## Navigation (Android)

```kotlin
NavHost(navController = navController, startDestination = "home") {
    composable("home") { HomeScreen(navController) }
    composable(
        "user/{userId}",
        arguments = listOf(navArgument("userId") { type = NavType.StringType })
    ) { backStackEntry ->
        UserScreen(userId = backStackEntry.arguments?.getString("userId"))
    }
}

navController.navigate("user/123")
```

---

> **Philosophy:** Platform-first. Use native when you need the deepest integration.

---

## Testing (Android)

### Testing Stack

| Type | Tool | Purpose |
|------|------|---------|
| Unit | JUnit 5 + MockK | Business logic, ViewModels |
| UI | Compose UI Testing | Composable behavior |
| Integration | Espresso | Full app flows |
| Screenshot | Paparazzi | UI regression |

### Compose UI Test Example

```kotlin
@get:Rule
val composeTestRule = createComposeRule()

@Test
fun counter_increments() {
    composeTestRule.setContent { Counter() }

    composeTestRule.onNodeWithText("Count: 0").assertExists()

    composeTestRule.onNodeWithText("Increment").performClick()

    composeTestRule.onNodeWithText("Count: 1").assertExists()
}
```

### ViewModel Test Example

```kotlin
@Test
fun `loadUser updates uiState`() = runTest {
    val viewModel = UserViewModel(FakeUserRepository())

    viewModel.loadUser("123")

    val state = viewModel.uiState.first { !it.isLoading }
    assertEquals("John", state.user?.name)
}
```

---

## Verification

Cross-check version-sensitive details with the cited official source and verify the resulting behavior in the target environment.

<a id="rule-native-when-to-go-native"></a>

## Native: When to Go Native through Accessibility (iOS)

**Impact:** high
**Kind:** reference
**Source:** `rules/native-when-to-go-native.md`

# Native: When to Go Native through Accessibility (iOS)

## Scope

Apply this guidance only to the declared platforms and repository-confirmed versions.

## Guidance

> **Philosophy:** Platform-first. Use native when you need the deepest integration.

---

## When to Go Native

| Scenario | Recommendation |
|----------|----------------|
| Camera/AR heavy | Native |
| Complex animations | Native |
| System integrations | Native |
| Performance critical | Native |
| Rapid cross-platform | Flutter/RN |

---

# SwiftUI (iOS)

> **Philosophy:** Platform-first. Use native when you need the deepest integration.

---

## View Hierarchy

```swift
struct ContentView: View {
    @State private var count = 0

    var body: some View {
        VStack(spacing: 16) {
            Text("Count: \(count)")
                .font(.largeTitle)

            Button("Increment") {
                count += 1
            }
            .buttonStyle(.borderedProminent)
        }
        .padding()
    }
}
```

---

> **Philosophy:** Platform-first. Use native when you need the deepest integration.

---

## State Management (iOS)

| Property Wrapper | Use Case |
|-----------------|----------|
| `@State` | Local view state |
| `@Binding` | Two-way child binding |
| `@StateObject` | Own ObservableObject |
| `@ObservedObject` | Passed ObservableObject |
| `@EnvironmentObject` | Shared across hierarchy |

### Observable Pattern (iOS 17+)

```swift
@Observable
class UserStore {
    var currentUser: User?
    var isLoading = false

    func fetchUser() async {
        isLoading = true
        currentUser = await api.getUser()
        isLoading = false
    }
}

struct ProfileView: View {
    @State private var store = UserStore()

    var body: some View {
        if store.isLoading {
            ProgressView()
        } else {
            Text(store.currentUser?.name ?? "")
        }
    }
}
```

---

> **Philosophy:** Platform-first. Use native when you need the deepest integration.

---

## Navigation (iOS 16+)

```swift
struct ContentView: View {
    @State private var path = NavigationPath()

    var body: some View {
        NavigationStack(path: $path) {
            List(items) { item in
                NavigationLink(value: item) {
                    Text(item.title)
                }
            }
            .navigationDestination(for: Item.self) { item in
                DetailView(item: item)
            }
        }
    }
}
```

---

> **Philosophy:** Platform-first. Use native when you need the deepest integration.

---

## Testing (iOS)

### Testing Stack

| Type | Tool | Purpose |
|------|------|---------|
| Unit | XCTest | Business logic, models |
| UI | XCUITest | Full UI flows |
| Snapshot | swift-snapshot-testing | UI regression |
| Preview | Xcode Previews | Rapid iteration |

### XCTest Example

```swift
final class UserStoreTests: XCTestCase {
    func testFetchUser() async throws {
        let store = UserStore(api: MockAPI())

        await store.fetchUser()

        XCTAssertNotNil(store.currentUser)
        XCTAssertEqual(store.currentUser?.name, "John")
        XCTAssertFalse(store.isLoading)
    }
}
```

### SwiftUI View Test

```swift
func testProfileView() throws {
    let view = ProfileView()
    let inspector = try view.inspect()

    XCTAssertNoThrow(try inspector.find(text: "Profile"))
}
```

---

> **Philosophy:** Platform-first. Use native when you need the deepest integration.

---

## Error Handling (iOS)

### Structured Error Types

```swift
enum AppError: LocalizedError {
    case network(URLError)
    case decoding(DecodingError)
    case unauthorized
    case unknown(Error)

    var errorDescription: String? {
        switch self {
        case .network(let error): return "Network: \(error.localizedDescription)"
        case .decoding: return "Data format error"
        case .unauthorized: return "Session expired"
        case .unknown(let error): return error.localizedDescription
        }
    }
}
```

### Result Pattern

```swift
func fetchUser(id: String) async -> Result<User, AppError> {
    do {
        let user = try await api.getUser(id)
        return .success(user)
    } catch let error as URLError {
        return .failure(.network(error))
    } catch {
        return .failure(.unknown(error))
    }
}
```

---

> **Philosophy:** Platform-first. Use native when you need the deepest integration.

---

## Accessibility (iOS)

```swift
Button("Submit Order") {
    submitOrder()
}
.accessibilityLabel("Submit your order")
.accessibilityHint("Double tap to confirm and place order")
.accessibilityAddTraits(.isButton)

// Dynamic Type
Text("Hello")
    .font(.body)     // Scales automatically with system settings
    .dynamicTypeSize(...DynamicTypeSize.xxxLarge)  // Cap max size
```

---

## Verification

Cross-check version-sensitive details with the cited official source and verify the resulting behavior in the target environment.

<a id="rule-platform-android-1-material-design-3-philosophy"></a>

## Platform Android: Material Design 3 Philosophy through 3. Material Color System

**Impact:** high
**Kind:** reference
**Source:** `rules/platform-android-1-material-design-3-philosophy.md`

# Platform Android: Material Design 3 Philosophy through 3. Material Color System

## Scope

Apply only to the declared platforms and repository-confirmed versions.

## Guidance

> Material Design 3 essentials, Android design conventions, Roboto typography, and native patterns.
> **Read this file when building for Android devices.**

---

## 1. Material Design 3 Philosophy

### Core Material Principles

```
MATERIAL AS METAPHOR:
+-- Surfaces exist in 3D space
+-- Light and shadow define hierarchy
+-- Motion provides continuity
+-- Bold, graphic, intentional design

ADAPTIVE DESIGN:
+-- Responds to device capabilities
+-- One UI for all form factors
+-- Dynamic color from wallpaper
+-- Personalized per user

ACCESSIBLE BY DEFAULT:
+-- Large touch targets
+-- Clear visual hierarchy
+-- Semantic colors
+-- Motion respects preferences
```

### Material Design Values

| Value | Implementation |
|-------|----------------|
| **Dynamic Color** | Colors adapt to wallpaper/user preference |
| **Personalization** | User-specific themes |
| **Accessibility** | Built into every component |
| **Responsiveness** | Works on all screen sizes |
| **Consistency** | Unified design language |

---

> Material Design 3 essentials, Android design conventions, Roboto typography, and native patterns.
> **Read this file when building for Android devices.**

---

## 2. Android Typography

### Roboto Font Family

```
Android System Fonts:
+-- Roboto: Default sans-serif
+-- Roboto Flex: Variable font (API 33+)
+-- Roboto Serif: Serif alternative
+-- Roboto Mono: Monospace
+-- Google Sans: Google products (special license)
```

### Material Type Scale

| Role | Size | Weight | Line Height | Usage |
|------|------|--------|-------------|-------|
| **Display Large** | 57sp | Regular | 64sp | Hero text, splash |
| **Display Medium** | 45sp | Regular | 52sp | Large headers |
| **Display Small** | 36sp | Regular | 44sp | Medium headers |
| **Headline Large** | 32sp | Regular | 40sp | Page titles |
| **Headline Medium** | 28sp | Regular | 36sp | Section headers |
| **Headline Small** | 24sp | Regular | 32sp | Subsections |
| **Title Large** | 22sp | Regular | 28sp | Dialogs, cards |
| **Title Medium** | 16sp | Medium | 24sp | Lists, navigation |
| **Title Small** | 14sp | Medium | 20sp | Tabs, secondary |
| **Body Large** | 16sp | Regular | 24sp | Primary content |
| **Body Medium** | 14sp | Regular | 20sp | Secondary content |
| **Body Small** | 12sp | Regular | 16sp | Captions |
| **Label Large** | 14sp | Medium | 20sp | Buttons, FAB |
| **Label Medium** | 12sp | Medium | 16sp | Navigation |
| **Label Small** | 11sp | Medium | 16sp | Chips, badges |

### Scalable Pixels (sp)

```
sp = Scale-independent pixels

sp automatically scales with:
+-- User font size preference
+-- Display density
+-- Accessibility settings

RULE: ALWAYS use sp for text, dp for everything else.
```

### Font Weight Usage

| Weight | Use Case |
|--------|----------|
| Regular (400) | Body text, display |
| Medium (500) | Buttons, labels, emphasis |
| Bold (700) | Rarely, strong emphasis only |

---

> Material Design 3 essentials, Android design conventions, Roboto typography, and native patterns.
> **Read this file when building for Android devices.**

---

## 3. Material Color System

### Dynamic Color (Material You)

```
Android 12+ Dynamic Color:

User's wallpaper ? Color extraction ? App theme

Your app automatically adapts to:
+-- Primary color (from wallpaper)
+-- Secondary color (complementary)
+-- Tertiary color (accent)
+-- Surface colors (derived)
+-- All semantic colors adjust

RULE: Implement dynamic color for personalized feel.
```

### Semantic Color Roles

```
Surface Colors:
+-- Surface ? Main background
+-- SurfaceVariant ? Cards, containers
+-- SurfaceTint ? Elevation overlay
+-- InverseSurface ? Snackbars, tooltips

On-Surface Colors:
+-- OnSurface ? Primary text
+-- OnSurfaceVariant ? Secondary text
+-- Outline ? Borders, dividers
+-- OutlineVariant ? Subtle dividers

Primary Colors:
+-- Primary ? Key actions, FAB
+-- OnPrimary ? Text on primary
+-- PrimaryContainer ? Less emphasis
+-- OnPrimaryContainer ? Text on container

Secondary/Tertiary: Similar pattern
```

### Error, Warning, Success Colors

| Role | Light | Dark | Usage |
|------|-------|------|-------|
| Error | #B3261E | #F2B8B5 | Errors, destructive |
| OnError | #FFFFFF | #601410 | Text on error |
| ErrorContainer | #F9DEDC | #8C1D18 | Error backgrounds |

### Dark Theme

```
Material Dark Theme:

+-- Background: #121212 (not pure black by default)
+-- Surface: #1E1E1E, #232323, etc. (elevation)
+-- Elevation: Higher = lighter overlay
+-- Reduce saturation on colors
+-- Check contrast ratios

Elevation overlays (dark mode):
+-- 0dp ? 0% overlay
+-- 1dp ? 5% overlay
+-- 3dp ? 8% overlay
+-- 6dp ? 11% overlay
+-- 8dp ? 12% overlay
+-- 12dp ? 14% overlay
```

---

## Verification

Cross-check version-sensitive details with the cited official source and verify behavior in the target environment.

<a id="rule-platform-android-10-android-checklist-5"></a>

## Platform Android: Android Checklist

**Impact:** high
**Kind:** reference
**Source:** `rules/platform-android-10-android-checklist-5.md`

# Platform Android: Android Checklist

## Scope

Apply only to the declared platforms and repository-confirmed versions.

## Guidance

> Material Design 3 essentials, Android design conventions, Roboto typography, and native patterns.
> **Read this file when building for Android devices.**

---

## 10. Android Checklist

### Before Every Android Screen

- [ ] Using Material 3 components
- [ ] Touch targets = 48dp
- [ ] Ripple effect on all touchables
- [ ] Roboto or Material type scale
- [ ] Semantic colors (dynamic color support)
- [ ] Back navigation works correctly

### Before Android Release

- [ ] Dark theme tested
- [ ] Dynamic color tested (if supported)
- [ ] All font sizes tested (200% scale)
- [ ] TalkBack tested
- [ ] Predictive back implemented (Android 14+)
- [ ] Edge-to-edge display (Android 15+)
- [ ] Different screen sizes tested (phones, tablets)
- [ ] Navigation patterns match platform (back, gestures)

---

> **Remember:** Android users expect Material Design. Custom designs that ignore Material patterns feel foreign and broken. Use Material components as your foundation, customize thoughtfully.

---

## Verification

Cross-check version-sensitive details with the cited official source and verify behavior in the target environment.

<a id="rule-platform-android-4-android-layout-spacing-2"></a>

## Platform Android: Android Layout & Spacing through 5. Android Navigation Patterns

**Impact:** high
**Kind:** reference
**Source:** `rules/platform-android-4-android-layout-spacing-2.md`

# Platform Android: Android Layout & Spacing through 5. Android Navigation Patterns

## Scope

Apply only to the declared platforms and repository-confirmed versions.

## Guidance

> Material Design 3 essentials, Android design conventions, Roboto typography, and native patterns.
> **Read this file when building for Android devices.**

---

## 4. Android Layout & Spacing

### Layout Grid

```
Android uses 8dp baseline grid:

All spacing in multiples of 8dp:
+-- 4dp: Component internal (half-step)
+-- 8dp: Minimum spacing
+-- 16dp: Standard spacing
+-- 24dp: Section spacing
+-- 32dp: Large spacing

Margins:
+-- Compact (phone): 16dp
+-- Medium (small tablet): 24dp
+-- Expanded (large): 24dp+ or columns
```

### Responsive Layout

```
Window Size Classes:

COMPACT (< 600dp width):
+-- Phones in portrait
+-- Single column layout
+-- Bottom navigation

MEDIUM (600-840dp width):
+-- Tablets, foldables
+-- Consider 2 columns
+-- Navigation rail option

EXPANDED (> 840dp width):
+-- Large tablets, desktop
+-- Multi-column layouts
+-- Navigation drawer
```

### Canonical Layouts

| Layout | Use Case | Window Class |
|--------|----------|--------------|
| **List-Detail** | Email, messages | Medium, Expanded |
| **Feed** | Social, news | All |
| **Supporting Pane** | Reference content | Medium, Expanded |

---

> Material Design 3 essentials, Android design conventions, Roboto typography, and native patterns.
> **Read this file when building for Android devices.**

---

## 5. Android Navigation Patterns

### Navigation Components

| Component | Use Case | Position |
|-----------|----------|----------|
| **Bottom Navigation** | 3-5 top-level destinations | Bottom |
| **Navigation Rail** | Tablets, foldables | Left side, vertical |
| **Navigation Drawer** | Many destinations, large screens | Left side, hidden/visible |
| **Top App Bar** | Current context, actions | Top |

### Bottom Navigation

```
+-------------------------------------+
|                                     |
|         Content Area                |
|                                     |
+-------------------------------------+
|  ??     ??     ?     d?     ??    | ? 80dp height
| Home   Search  FAB   Saved  Profile|
+-------------------------------------+

Rules:
+-- 3-5 destinations
+-- Icons: Material Symbols (24dp)
+-- Labels: Always visible (accessibility)
+-- Active: Filled icon + indicator pill
+-- Badge: For notifications
+-- FAB can integrate (optional)
```

### Top App Bar

```
Types:
+-- Center-aligned: Logo apps, simple
+-- Small: Compact, scrolls away
+-- Medium: Title + actions, collapses
+-- Large: Display title, collapses to small

+-------------------------------------+
|  ?   App Title              ?? ?  | ? 64dp (small)
+-------------------------------------+
|                                     |
|         Content Area                |
+-------------------------------------+

Actions: Max 3 icons, overflow menu ( ? ) for more
```

### Navigation Rail (Tablets)

```
+-------------------------------------+
|  =    |                             |
|       |                             |
|  ??   |                             |
| Home  |       Content Area          |
|       |                             |
|  ??   |                             |
|Search |                             |
|       |                             |
|  ??   |                             |
|Profile|                             |
+-------------------------------------+

Width: 80dp
Icons: 24dp
Labels: Below icon
FAB: Can be at top
```

### Back Navigation

```
Android provides system back:
+-- Back button (3-button nav)
+-- Back gesture (swipe from edge)
+-- Predictive back (Android 14+)

Your app must:
+-- Handle back correctly (pop stack)
+-- Support predictive back animation
+-- Never hijack/override back unexpectedly
+-- Confirm before discarding unsaved work
```

---

## Verification

Cross-check version-sensitive details with the cited official source and verify behavior in the target environment.

<a id="rule-platform-android-6-material-components-3"></a>

## Platform Android: Material Components

**Impact:** high
**Kind:** reference
**Source:** `rules/platform-android-6-material-components-3.md`

# Platform Android: Material Components

## Scope

Apply only to the declared platforms and repository-confirmed versions.

## Guidance

> Material Design 3 essentials, Android design conventions, Roboto typography, and native patterns.
> **Read this file when building for Android devices.**

---

## 6. Material Components

### Buttons

```
Button Types:

+----------------------+
|    Filled Button     |  ? Primary action
+----------------------+

+----------------------+
|    Tonal Button      |  ? Secondary, less emphasis
+----------------------+

+----------------------+
|   Outlined Button    |  ? Tertiary, lower emphasis
+----------------------+

    Text Button           ? Lowest emphasis

Heights:
+-- Small: 40dp (when constrained)
+-- Standard: 40dp
+-- Large: 56dp (FAB size when needed)

Min touch target: 48dp (even if visual is smaller)
```

### Floating Action Button (FAB)

```
FAB Types:
+-- Standard: 56dp diameter
+-- Small: 40dp diameter
+-- Large: 96dp diameter
+-- Extended: Icon + text, variable width

Position: Bottom right, 16dp from edges
Elevation: Floats above content

+-------------------------------------+
|                                     |
|         Content                     |
|                                     |
|                              +----+ |
|                              | ? | | ? FAB
|                              +----+ |
+-------------------------------------+
|       Bottom Navigation             |
+-------------------------------------+
```

### Cards

```
Card Types:
+-- Elevated: Shadow, resting state
+-- Filled: Background color, no shadow
+-- Outlined: Border, no shadow

Card Anatomy:
+-------------------------------------+
|           Header Image              | ? Optional
+-------------------------------------+
|  Title / Headline                   |
|  Subhead / Supporting text          |
+-------------------------------------+
|      [ Action ]    [ Action ]       | ? Optional actions
+-------------------------------------+

Corner radius: 12dp (M3 default)
Padding: 16dp
```

### Text Fields

```
Types:
+-- Filled: Background fill, underline
+-- Outlined: Border all around

+-------------------------------------+
|  Label                              | ? Floats up on focus
|  ________________________________________________
|  |     Input text here...          | ? Leading/trailing icons
|  ????????????????????????????????????????????????
|  Supporting text or error           |
+-------------------------------------+

Height: 56dp
Label: Animates from placeholder to top
Error: Red color + icon + message
```

### Chips

```
Types:
+-- Assist: Smart actions (directions, call)
+-- Filter: Toggle filters
+-- Input: Represent entities (tags, contacts)
+-- Suggestion: Dynamic recommendations

+---------------+
|  ??? Filter   |  ? 32dp height, 8dp corner radius
+---------------+

States: Unselected, Selected, Disabled
```

---

## Verification

Cross-check version-sensitive details with the cited official source and verify behavior in the target environment.

<a id="rule-platform-android-7-android-specific-patterns-4"></a>

## Platform Android: Android-Specific Patterns through 9. Android Accessibility

**Impact:** high
**Kind:** reference
**Source:** `rules/platform-android-7-android-specific-patterns-4.md`

# Platform Android: Android-Specific Patterns through 9. Android Accessibility

## Scope

Apply only to the declared platforms and repository-confirmed versions.

## Guidance

> Material Design 3 essentials, Android design conventions, Roboto typography, and native patterns.
> **Read this file when building for Android devices.**

---

## 7. Android-Specific Patterns

### Snackbars

```
Position: Bottom, above navigation
Duration: 4-10 seconds
Action: One optional text action

+-------------------------------------------------+
|  Archived 1 item                    [ UNDO ]    |
+-------------------------------------------------+

Rules:
+-- Brief message, single line if possible
+-- Max 2 lines
+-- One action (text, not icon)
+-- Can be dismissed by swipe
+-- Don't stack, queue them
```

### Bottom Sheets

```
Types:
+-- Standard: Interactive content
+-- Modal: Blocks background (with scrim)

Modal Bottom Sheet:
+-------------------------------------+
|                                     |
|        (Scrim over content)         |
|                                     |
+-------------------------------------+
|  -----  (Drag handle, optional)     |
|                                     |
|        Sheet Content                |
|                                     |
|        Actions / Options            |
|                                     |
+-------------------------------------+

Corner radius: 28dp (top corners)
```

### Dialogs

```
Types:
+-- Basic: Title + content + actions
+-- Full-screen: Complex editing (mobile)
+-- Date/Time picker
+-- Confirmation dialog

+-------------------------------------+
|              Title                  |
|                                     |
|       Supporting text that          |
|       explains the dialog           |
|                                     |
|           [ Cancel ]  [ Confirm ]   |
+-------------------------------------+

Rules:
+-- Centered on screen
+-- Scrim behind (dim background)
+-- Max 2 actions aligned right
+-- Destructive action can be on left
```

### Pull to Refresh

```
Android uses SwipeRefreshLayout pattern:

+-------------------------------------+
|         ? (Spinner)                 | ? Circular progress
+-------------------------------------+
|                                     |
|         Content                     |
|                                     |
+-------------------------------------+

Spinner: Material circular indicator
Position: Top center, pulls down with content
```

### Ripple Effect

```
Every touchable element needs ripple:

Touch down ? Ripple expands from touch point
Touch up ? Ripple completes and fades

Color:
+-- On light: Black at ~12% opacity
+-- On dark: White at ~12% opacity
+-- On colored: Appropriate contrast

This is MANDATORY for Android feel.
```

---

> Material Design 3 essentials, Android design conventions, Roboto typography, and native patterns.
> **Read this file when building for Android devices.**

---

## 8. Material Symbols

### Usage Guidelines

```
Material Symbols: Google's icon library

Styles:
+-- Outlined: Default, most common
+-- Rounded: Softer, friendly
+-- Sharp: Angular, precise

Variable font axes:
+-- FILL: 0 (outline) to 1 (filled)
+-- wght: 100-700 (weight)
+-- GRAD: -25 to 200 (emphasis)
+-- opsz: 20, 24, 40, 48 (optical size)
```

### Icon Sizes

| Size | Usage |
|------|-------|
| 20dp | Dense UI, inline |
| 24dp | Standard (most common) |
| 40dp | Larger touch targets |
| 48dp | Emphasis, standalone |

### States

```
Icon States:
+-- Default: Full opacity
+-- Disabled: 38% opacity
+-- Hover/Focus: Container highlight
+-- Selected: Filled variant + tint

Active vs Inactive:
+-- Inactive: Outlined
+-- Active: Filled + indicator
```

---

> Material Design 3 essentials, Android design conventions, Roboto typography, and native patterns.
> **Read this file when building for Android devices.**

---

## 9. Android Accessibility

### TalkBack Requirements

```
Every interactive element needs:
+-- contentDescription (what it is)
+-- Correct semantics (button, checkbox, etc.)
+-- State announcements (selected, disabled)
+-- Grouping where logical

Jetpack Compose:
Modifier.semantics {
    contentDescription = "Play button"
    role = Role.Button
}

React Native:
accessibilityLabel="Play button"
accessibilityRole="button"
accessibilityState={{ disabled: false }}
```

### Touch Target Size

```
MANDATORY: 48dp × 48dp minimum

Even if visual element is smaller:
+-- Icon: 24dp visual, 48dp touch area
+-- Checkbox: 20dp visual, 48dp touch area
+-- Add padding to reach 48dp

Spacing between targets: 8dp minimum
```

### Font Scaling

```
Android supports font scaling:
+-- 85% (smaller)
+-- 100% (default)
+-- 115%, 130%, 145%...
+-- Up to 200% (largest)

RULE: Test your UI at 200% font scale.
Use sp units and avoid fixed heights.
```

### Reduce Motion

```kotlin
// Check motion preference
val reduceMotion = Settings.Global.getFloat(
    contentResolver,
    Settings.Global.ANIMATOR_DURATION_SCALE,
    1f
) == 0f

if (reduceMotion) {
    // Skip or reduce animations
}
```

---

## Verification

Cross-check version-sensitive details with the cited official source and verify behavior in the target environment.

<a id="rule-platform-ios-1-human-interface-guidelines-philosophy"></a>

## Platform Ios: Human Interface Guidelines Philosophy through 3. iOS Color System

**Impact:** high
**Kind:** reference
**Source:** `rules/platform-ios-1-human-interface-guidelines-philosophy.md`

# Platform Ios: Human Interface Guidelines Philosophy through 3. iOS Color System

## Scope

Apply only to the declared platforms and repository-confirmed versions.

## Guidance

> Human Interface Guidelines (HIG) essentials, iOS design conventions, SF Pro typography, and native patterns.
> **Read this file when building for iPhone/iPad.**

---

## 1. Human Interface Guidelines Philosophy

### Core Apple Design Principles

```
CLARITY:
+-- Text is legible at every size
+-- Icons are precise and lucid
+-- Adornments are subtle and appropriate
+-- Focus on functionality drives design

DEFERENCE:
+-- UI helps people understand and interact
+-- Content fills the screen
+-- UI never competes with content
+-- Translucency hints at more content

DEPTH:
+-- Distinct visual layers convey hierarchy
+-- Transitions provide sense of depth
+-- Touch reveals functionality
+-- Content is elevated over UI
```

### iOS Design Values

| Value | Implementation |
|-------|----------------|
| **Aesthetic Integrity** | Design matches function (game ? productivity) |
| **Consistency** | Use system controls, familiar patterns |
| **Direct Manipulation** | Touch directly affects content |
| **Feedback** | Actions are acknowledged |
| **Metaphors** | Real-world comparisons aid understanding |
| **User Control** | User initiates actions, can cancel |

---

> Human Interface Guidelines (HIG) essentials, iOS design conventions, SF Pro typography, and native patterns.
> **Read this file when building for iPhone/iPad.**

---

## 2. iOS Typography

### SF Pro Font Family

```
iOS System Fonts:
+-- SF Pro Text: Body text (< 20pt)
+-- SF Pro Display: Large titles (= 20pt)
+-- SF Pro Rounded: Friendly contexts
+-- SF Mono: Code, tabular data
+-- SF Compact: Apple Watch, smaller screens
```

### iOS Type Scale (Dynamic Type)

| Style | Default Size | Weight | Usage |
|-------|--------------|--------|-------|
| **Large Title** | 34pt | Bold | Navigation bar (scroll collapse) |
| **Title 1** | 28pt | Bold | Page titles |
| **Title 2** | 22pt | Bold | Section headers |
| **Title 3** | 20pt | Semibold | Subsection headers |
| **Headline** | 17pt | Semibold | Emphasized body |
| **Body** | 17pt | Regular | Primary content |
| **Callout** | 16pt | Regular | Secondary content |
| **Subhead** | 15pt | Regular | Tertiary content |
| **Footnote** | 13pt | Regular | Caption, timestamps |
| **Caption 1** | 12pt | Regular | Annotations |
| **Caption 2** | 11pt | Regular | Fine print |

### Dynamic Type Support (MANDATORY)

```swift
// ? WRONG: Fixed font size
Text("Hello")
    .font(.system(size: 17))

// ? CORRECT: Dynamic Type
Text("Hello")
    .font(.body) // Scales with user settings

// React Native equivalent
<Text style={{ fontSize: 17 }}> // ? Fixed
<Text style={styles.body}> // Use a dynamic scale system
```

### Font Weight Usage

| Weight | iOS Constant | Use Case |
|--------|--------------|----------|
| Regular (400) | `.regular` | Body text |
| Medium (500) | `.medium` | Buttons, emphasis |
| Semibold (600) | `.semibold` | Subheadings |
| Bold (700) | `.bold` | Titles, key info |
| Heavy (800) | `.heavy` | Rarely, marketing |

---

> Human Interface Guidelines (HIG) essentials, iOS design conventions, SF Pro typography, and native patterns.
> **Read this file when building for iPhone/iPad.**

---

## 3. iOS Color System

### System Colors (Semantic)

```
Use semantic colors for automatic dark mode:

Primary:
+-- .label ? Primary text
+-- .secondaryLabel ? Secondary text
+-- .tertiaryLabel ? Tertiary text
+-- .quaternaryLabel ? Watermarks

Backgrounds:
+-- .systemBackground ? Main background
+-- .secondarySystemBackground ? Grouped content
+-- .tertiarySystemBackground ? Elevated content

Fills:
+-- .systemFill ? Large shapes
+-- .secondarySystemFill ? Medium shapes
+-- .tertiarySystemFill ? Small shapes
+-- .quaternarySystemFill ? Subtle shapes
```

### System Accent Colors

| Color | Light Mode | Dark Mode | Usage |
|-------|------------|-----------|-------|
| Blue | #007AFF | #0A84FF | Links, highlights, default tint |
| Green | #34C759 | #30D158 | Success, positive |
| Red | #FF3B30 | #FF453A | Errors, destructive |
| Orange | #FF9500 | #FF9F0A | Warnings |
| Yellow | #FFCC00 | #FFD60A | Attention |
| Purple | #AF52DE | #BF5AF2 | Special features |
| Pink | #FF2D55 | #FF375F | Affection, favorites |
| Teal | #5AC8FA | #64D2FF | Information |

### Dark Mode Considerations

```
iOS Dark Mode is not inverted light mode:

LIGHT MODE:              DARK MODE:
+-- White backgrounds    +-- True black (#000) or near-black
+-- High saturation      +-- Desaturated colors
+-- Black text           +-- White/light gray text
+-- Drop shadows         +-- Glows or no shadows

RULE: Always use semantic colors for automatic adaptation.
```

---

## Verification

Cross-check version-sensitive details with the cited official source and verify behavior in the target environment.

<a id="rule-platform-ios-4-ios-layout-spacing-2"></a>

## Platform Ios: iOS Layout & Spacing through 5. iOS Navigation Patterns

**Impact:** high
**Kind:** reference
**Source:** `rules/platform-ios-4-ios-layout-spacing-2.md`

# Platform Ios: iOS Layout & Spacing through 5. iOS Navigation Patterns

## Scope

Apply only to the declared platforms and repository-confirmed versions.

## Guidance

> Human Interface Guidelines (HIG) essentials, iOS design conventions, SF Pro typography, and native patterns.
> **Read this file when building for iPhone/iPad.**

---

## 4. iOS Layout & Spacing

### Safe Areas

```
+-------------------------------------+
------------ Status Bar ------------|| ? Top safe area inset
+-------------------------------------+
|                                     |
|                                     |
|         Safe Content Area           |
|                                     |
|                                     |
+-------------------------------------+
---------- Home Indicator ---------- ? Bottom safe area inset
+-------------------------------------+

RULE: Never place interactive content in unsafe areas.
```

### Standard Margins & Padding

| Element | Margin | Notes |
|---------|--------|-------|
| Screen edge ? content | 16pt | Standard horizontal margin |
| Grouped table sections | 16pt top/bottom | Breathing room |
| List item padding | 16pt horizontal | Standard cell padding |
| Card internal padding | 16pt | Content within cards |
| Button internal padding | 12pt vertical, 16pt horizontal | Minimum |

### iOS Grid System

```
iPhone Grid (Standard):
+-- 16pt margins (left/right)
+-- 8pt minimum spacing
+-- Content in 8pt multiples

iPhone Grid (Compact):
+-- 8pt margins (when needed)
+-- 4pt minimum spacing

iPad Grid:
+-- 20pt margins (or more)
+-- Consider multi-column layouts
```

---

> Human Interface Guidelines (HIG) essentials, iOS design conventions, SF Pro typography, and native patterns.
> **Read this file when building for iPhone/iPad.**

---

## 5. iOS Navigation Patterns

### Navigation Types

| Pattern | Use Case | Implementation |
|---------|----------|----------------|
| **Tab Bar** | 3-5 top-level sections | Bottom, always visible |
| **Navigation Controller** | Hierarchical drill-down | Stack-based, back button |
| **Modal** | Focused task, interruption | Sheet or full-screen |
| **Sidebar** | iPad, multi-column | Left sidebar (iPad) |

### Tab Bar Guidelines

```
+-------------------------------------+
|                                     |
|         Content Area                |
|                                     |
+-------------------------------------+
|  ??     ??     ?     d?     ??    | ? Tab bar (49pt height)
| Home   Search  New   Saved  Profile |
+-------------------------------------+

Rules:
+-- 3-5 items maximum
+-- Icons: SF Symbols or custom (25 × 25pt)
+-- Labels: Always include (accessibility)
+-- Active state: Filled icon + tint color
+-- Tab bar always visible (don't hide on scroll)
```

### Navigation Bar Guidelines

```
+-------------------------------------+
| < Back     Page Title      Edit    | ? Navigation bar (44pt)
+-------------------------------------+
|                                     |
|         Content Area                |
|                                     |
+-------------------------------------+

Rules:
+-- Back button: System chevron + previous title (or "Back")
+-- Title: Centered, dynamic font
+-- Right actions: Max 2 items
+-- Large title: Collapses on scroll (optional)
+-- Prefer text buttons over icons (clarity)
```

### Modal Presentations

| Style | Use Case | Appearance |
|-------|----------|------------|
| **Sheet (default)** | Secondary tasks | Card slides up, parent visible |
| **Full Screen** | Immersive tasks | Covers entire screen |
| **Popover** | iPad, quick info | Arrow-pointed bubble |
| **Alert** | Critical interruption | Centered dialog |
| **Action Sheet** | Choices from context | Bottom sheet with options |

### Gestures

| Gesture | iOS Convention |
|---------|----------------|
| **Edge swipe (left)** | Navigate back |
| **Pull down (sheet)** | Dismiss modal |
| **Long press** | Context menu |
| **Deep press** | Peek/Pop (legacy) |
| **Two-finger swipe** | Scroll in nested scroll |

---

## Verification

Cross-check version-sensitive details with the cited official source and verify behavior in the target environment.

<a id="rule-platform-ios-6-ios-components-3"></a>

## Platform Ios: iOS Components through 8. SF Symbols

**Impact:** high
**Kind:** reference
**Source:** `rules/platform-ios-6-ios-components-3.md`

# Platform Ios: iOS Components through 8. SF Symbols

## Scope

Apply only to the declared platforms and repository-confirmed versions.

## Guidance

> Human Interface Guidelines (HIG) essentials, iOS design conventions, SF Pro typography, and native patterns.
> **Read this file when building for iPhone/iPad.**

---

## 6. iOS Components

### Buttons

```
Button Styles (UIKit/SwiftUI):

+------------------------------+
|         Tinted               | ? Primary action (filled)
+------------------------------|
|         Bordered             | ? Secondary action (outline)
+------------------------------|
|         Plain                | ? Tertiary action (text only)
+------------------------------+

Sizes:
+-- Mini: Tight spaces
+-- Small: Compact UI
+-- Medium: Inline actions
+-- Large: Primary CTAs (44pt minimum height)
```

### Lists & Tables

```
List Styles:

.plain         ? No separators, edge-to-edge
.insetGrouped  ? Rounded cards (default iOS 14+)
.grouped       ? Full-width sections
.sidebar       ? iPad sidebar navigation

Cell Accessories:
+-- Disclosure indicator (>) ? Navigates to detail
+-- Detail button (i) ? Shows info without navigation
+-- Checkmark (?) ? Selection
+-- Reorder (=) ? Drag to reorder
+-- Delete (-) ? Swipe/edit mode delete
```

### Text Fields

```
iOS Text Field Anatomy:

+-------------------------------------+
| ?? Search...                    ?  |
+-------------------------------------+
  ?                               ?
  Leading icon                   Clear button

Borders: Rounded rectangle
Height: 36pt minimum
Placeholder: Secondary text color
Clear button: Appears when has text
```

### Segmented Controls

```
When to Use:
+-- 2-5 related options
+-- Filter content
+-- Switch views

+-----------------------+
|  All  | Active| Done  |
+-----------------------+

Rules:
+-- Equal width segments
+-- Text or icons (not both mixed)
+-- Max 5 segments
+-- Consider tabs if more complex
```

---

> Human Interface Guidelines (HIG) essentials, iOS design conventions, SF Pro typography, and native patterns.
> **Read this file when building for iPhone/iPad.**

---

## 7. iOS Specific Patterns

### Pull to Refresh

```
Native UIRefreshControl behavior:
+-- Pull beyond threshold ? Spinner appears
+-- Release ? Refresh action triggered
+-- Loading state ? Spinner spins
+-- Complete ? Spinner disappears

RULE: Always use native UIRefreshControl (don't custom build).
```

### Swipe Actions

```
iOS swipe actions:

? Swipe Left (Destructive)      Swipe Right (Constructive) ?
+-------------------------------------------------------------+
|                    List Item Content                        |
+-------------------------------------------------------------+

Left swipe reveals: Archive, Delete, Flag
Right swipe reveals: Pin, Star, Mark as Read

Full swipe: Triggers first action
```

### Context Menus

```
Long press ? Context menu appears

+-----------------------------+
|       Preview Card          |
+-----------------------------+
|  ?? Copy                    |
|  ?? Share                   |
|  ? Add to...               |
+-----------------------------+
|  ??? Delete          (Red)   |
+-----------------------------+

Rules:
+-- Preview: Show enlarged content
+-- Actions: Related to content
+-- Destructive: Last, in red
+-- Max ~8 actions (scrollable if more)
```

### Sheets & Half-Sheets

```
iOS 15+ Sheets:

+-------------------------------------+
|                                     |
|        Parent View (dimmed)          |
|                                     |
+-------------------------------------+
|  ---  (Grabber)                     | ? Drag to resize
|                                     |
|        Sheet Content                |
|                                     |
|                                     |
+-------------------------------------+

Detents:
+-- .medium ? Half screen
+-- .large ? Full screen (with safe area)
+-- Custom ? Specific height
```

---

> Human Interface Guidelines (HIG) essentials, iOS design conventions, SF Pro typography, and native patterns.
> **Read this file when building for iPhone/iPad.**

---

## 8. SF Symbols

### Usage Guidelines

```
SF Symbols: Apple's icon library (5000+ icons)

Weights: Match text weight
+-- Ultralight / Thin / Light
+-- Regular / Medium / Semibold
+-- Bold / Heavy / Black

Scales:
+-- .small ? Inline with small text
+-- .medium ? Standard UI
+-- .large ? Emphasis, standalone
```

### Symbol Configurations

```swift
// SwiftUI
Image(systemName: "star.fill")
    .font(.title2)
    .foregroundStyle(.yellow)

// With rendering mode
Image(systemName: "heart.fill")
    .symbolRenderingMode(.multicolor)

// Animated (iOS 17+)
Image(systemName: "checkmark.circle")
    .symbolEffect(.bounce)
```

### Symbol Best Practices

| Guideline | Implementation |
|-----------|----------------|
| Match text weight | Symbol weight = font weight |
| Use standard symbols | Users recognize them |
| Multicolor when meaningful | Not just decoration |
| Fallback for older iOS | Check availability |

---

## Verification

Cross-check version-sensitive details with the cited official source and verify behavior in the target environment.

<a id="rule-platform-ios-9-ios-accessibility-4"></a>

## Platform Ios: iOS Accessibility through 10. iOS Checklist

**Impact:** high
**Kind:** reference
**Source:** `rules/platform-ios-9-ios-accessibility-4.md`

# Platform Ios: iOS Accessibility through 10. iOS Checklist

## Scope

Apply only to the declared platforms and repository-confirmed versions.

## Guidance

> Human Interface Guidelines (HIG) essentials, iOS design conventions, SF Pro typography, and native patterns.
> **Read this file when building for iPhone/iPad.**

---

## 9. iOS Accessibility

### VoiceOver Requirements

```
Every interactive element needs:
+-- Accessibility label (what it is)
+-- Accessibility hint (what it does) - optional
+-- Accessibility traits (button, link, etc.)
+-- Accessibility value (current state)

SwiftUI:
.accessibilityLabel("Play")
.accessibilityHint("Plays the selected track")

React Native:
accessibilityLabel="Play"
accessibilityHint="Plays the selected track"
accessibilityRole="button"
```

### Dynamic Type Scaling

```
MANDATORY: Support Dynamic Type

Users can set text size from:
+-- xSmall ? 14pt body
+-- Small ? 15pt body
+-- Medium ? 16pt body
+-- Large (Default) ? 17pt body
+-- xLarge ? 19pt body
+-- xxLarge ? 21pt body
+-- xxxLarge ? 23pt body
+-- Accessibility sizes ? up to 53pt

Your app MUST scale gracefully at all sizes.
```

### Reduce Motion

```
Respect motion preferences:

@Environment(\.accessibilityReduceMotion) var reduceMotion

if reduceMotion {
    // Use instant transitions
} else {
    // Use animations
}

React Native:
import { AccessibilityInfo } from 'react-native';
AccessibilityInfo.isReduceMotionEnabled()
```

---

> Human Interface Guidelines (HIG) essentials, iOS design conventions, SF Pro typography, and native patterns.
> **Read this file when building for iPhone/iPad.**

---

## 10. iOS Checklist

### Before Every iOS Screen

- [ ] Using SF Pro or SF Symbols
- [ ] Dynamic Type supported
- [ ] Safe areas respected
- [ ] Navigation follows HIG (back gesture works)
- [ ] Tab bar items = 5
- [ ] Touch targets = 44pt

### Before iOS Release

- [ ] Dark mode tested
- [ ] All text sizes tested (Accessibility Inspector)
- [ ] VoiceOver tested
- [ ] Edge swipe back works everywhere
- [ ] Keyboard avoidance implemented
- [ ] Notch/Dynamic Island handled
- [ ] Home indicator area respected
- [ ] Native components used where possible

---

> **Remember:** iOS users have strong expectations from other iOS apps. Deviating from HIG patterns feels "broken" to them. When in doubt, use the native component.

---

## Verification

Cross-check version-sensitive details with the cited official source and verify behavior in the target environment.

<a id="rule-production-gates"></a>

## Production verification gates

**Impact:** high
**Kind:** process
**Source:** `rules/production-gates.md`

# Production verification gates

## Preconditions

- Confirm the target platform and dependency versions from the repository.
- Capture a reproducible baseline and define observable acceptance criteria.
- Identify a recoverable rollback point before changing code or configuration.

## Procedure

1. Apply the smallest change that satisfies the documented requirement.
2. Exercise the affected success and failure paths with the narrowest reliable check.
3. Run the repository typecheck, tests, and policy checks that cover the changed surface.
4. Inspect diagnostics for redacted, actionable evidence; a missing or failed checker is not success.

## Rollback

Restore the recorded baseline when a required check errors, the result is inconclusive, or a new regression appears. Re-run the baseline check after restoration.

## Exit Gate

Finish only when required checks execute and pass, acceptance behavior is reproduced, rollback remains available, and residual risks are reported explicitly.

<a id="rule-push-notifications-native-android-setup-compose-2"></a>

## Push Notifications: Native Android Setup (Compose) through Android Notification Channels

**Impact:** high
**Kind:** reference
**Source:** `rules/push-notifications-native-android-setup-compose-2.md`

# Push Notifications: Native Android Setup (Compose) through Android Notification Channels

## Scope

Apply this guidance only to the declared platforms and repository-confirmed versions.

## Guidance

> **Philosophy:** Respect the user's attention. Every notification should provide value.

---

## Native Android Setup (Compose)

### FirebaseMessagingService

```kotlin
class MyFirebaseMessagingService : FirebaseMessagingService() {
    override fun onNewToken(token: String) {
        saveTokenToServer(token)
    }

    override fun onMessageReceived(remoteMessage: RemoteMessage) {
        remoteMessage.notification?.let { notification ->
            showNotification(
                title = notification.title ?: "",
                body = notification.body ?: "",
                data = remoteMessage.data
            )
        }
    }

    private fun showNotification(title: String, body: String, data: Map<String, String>) {
        val intent = Intent(this, MainActivity::class.java).apply {
            putExtra("screen", data["screen"])
            flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TASK
        }

        val notification = NotificationCompat.Builder(this, "messages")
            .setSmallIcon(R.drawable.ic_notification)
            .setContentTitle(title)
            .setContentText(body)
            .setContentIntent(PendingIntent.getActivity(this, 0, intent, PendingIntent.FLAG_IMMUTABLE))
            .setAutoCancel(true)
            .build()

        NotificationManagerCompat.from(this).notify(System.currentTimeMillis().toInt(), notification)
    }
}
```

---

> **Philosophy:** Respect the user's attention. Every notification should provide value.

---

## Server-Side Sending (FCM Admin SDK)

### Node.js

```typescript
import admin from 'firebase-admin';

admin.initializeApp({
  credential: admin.credential.applicationDefault(),
});

// Send to single device
async function sendPush(token: string, title: string, body: string, data?: Record<string, string>) {
  const message: admin.messaging.Message = {
    token,
    notification: { title, body },
    data,
    android: {
      priority: 'high',
      notification: { channelId: 'messages' },
    },
    apns: {
      payload: { aps: { badge: 1, sound: 'default' } },
    },
  };

  const response = await admin.messaging().send(message);
  console.log('Sent:', response);
}

// Send to topic
async function sendToTopic(topic: string, title: string, body: string) {
  await admin.messaging().send({
    topic,
    notification: { title, body },
  });
}

// Send to multiple devices (batch)
async function sendMulticast(tokens: string[], title: string, body: string) {
  const response = await admin.messaging().sendEachForMulticast({
    tokens,
    notification: { title, body },
  });
  console.log(`${response.successCount} sent, ${response.failureCount} failed`);
}
```

### Python

```python
from firebase_admin import messaging, initialize_app

initialize_app()

message = messaging.Message(
    token="device_token",
    notification=messaging.Notification(title="Hello", body="World"),
    android=messaging.AndroidConfig(priority="high"),
    apns=messaging.APNSConfig(payload=messaging.APNSPayload(
        aps=messaging.Aps(badge=1, sound="default")
    )),
)

response = messaging.send(message)
```

---

> **Philosophy:** Respect the user's attention. Every notification should provide value.

---

## Notification Payload

### Data vs Notification Message

| Type | Behavior | When to Use |
|------|----------|-------------|
| **Notification** | System shows automatically | Simple alerts |
| **Data** | App handles in code | Custom handling, silent updates |
| **Both** | Notification shown, data accessible | Most common |

### Payload Structure

```json
{
  "message": {
    "token": "device_token_here",
    "notification": {
      "title": "New Message",
      "body": "You have a new message from John"
    },
    "data": {
      "screen": "chat",
      "chatId": "123",
      "senderId": "user_456"
    },
    "android": {
      "priority": "high",
      "notification": {
        "channel_id": "messages",
        "click_action": "OPEN_CHAT"
      }
    },
    "apns": {
      "payload": {
        "aps": {
          "badge": 1,
          "sound": "default",
          "category": "MESSAGE"
        }
      }
    }
  }
}
```

---

> **Philosophy:** Respect the user's attention. Every notification should provide value.

---

## Android Notification Channels

Required for Android 8.0+:

```typescript
// React Native (notifee)
import notifee, { AndroidImportance } from '@notifee/react-native';

async function createChannels() {
  await notifee.createChannel({
    id: 'messages',
    name: 'Messages',
    importance: AndroidImportance.HIGH,
    sound: 'default',
    vibration: true,
  });

  await notifee.createChannel({
    id: 'promotions',
    name: 'Promotions',
    importance: AndroidImportance.LOW,
  });
}
```

---

## Verification

Cross-check version-sensitive details with the cited official source and verify the resulting behavior in the target environment.

<a id="rule-push-notifications-notification-grouping-3"></a>

## Push Notifications: Notification Grouping through Opt-Out Metrics

**Impact:** high
**Kind:** reference
**Source:** `rules/push-notifications-notification-grouping-3.md`

# Push Notifications: Notification Grouping through Opt-Out Metrics

## Scope

Apply this guidance only to the declared platforms and repository-confirmed versions.

## Guidance

> **Philosophy:** Respect the user's attention. Every notification should provide value.

---

## Notification Grouping

### iOS (Thread Identifier)

```json
{
  "apns": {
    "payload": {
      "aps": {
        "thread-id": "chat-123",
        "summary-arg": "John"
      }
    }
  }
}
```

### Android (Group Key)

```kotlin
NotificationCompat.Builder(this, "messages")
    .setGroup("chat_123")
    .setGroupSummary(false)
    .build()

// Summary notification
NotificationCompat.Builder(this, "messages")
    .setGroup("chat_123")
    .setGroupSummary(true)
    .setStyle(NotificationCompat.InboxStyle()
        .addLine("John: Hey!")
        .addLine("Jane: Hello!")
        .setSummaryText("2 new messages"))
    .build()
```

---

> **Philosophy:** Respect the user's attention. Every notification should provide value.

---

## iOS Rich Notifications

### Notification Service Extension

```swift
class NotificationService: UNNotificationServiceExtension {
    override func didReceive(_ request: UNNotificationRequest,
                           withContentHandler contentHandler: @escaping (UNNotificationContent) -> Void) {
        guard let bestAttempt = request.content.mutableCopy() as? UNMutableNotificationContent else { return }

        if let imageURL = request.content.userInfo["image"] as? String {
            downloadImage(imageURL) { attachment in
                bestAttempt.attachments = [attachment]
                contentHandler(bestAttempt)
            }
        }
    }
}
```

---

> **Philosophy:** Respect the user's attention. Every notification should provide value.

---

## Provisional Authorization (iOS 12+)

> Deliver notifications quietly (Notification Center only) without explicit permission prompt.

```typescript
// React Native
const authStatus = await messaging().requestPermission({
  provisional: true, // No prompt — delivers quietly
});
```

```swift
// Native iOS
UNUserNotificationCenter.current().requestAuthorization(options: [.provisional]) { granted, _ in
    // Always returns true — notifications go to Notification Center quietly
}
```

**Strategy:** Start provisional → user engages → prompt for full authorization later.

---

> **Philosophy:** Respect the user's attention. Every notification should provide value.

---

## Local & Scheduled Notifications

```typescript
// React Native (notifee)
import notifee, { TriggerType, TimestampTrigger } from '@notifee/react-native';

// Immediate local notification
await notifee.displayNotification({
  title: 'Reminder',
  body: 'Time to check in!',
  android: { channelId: 'reminders' },
});

// Scheduled notification
const trigger: TimestampTrigger = {
  type: TriggerType.TIMESTAMP,
  timestamp: Date.now() + 60 * 60 * 1000, // 1 hour from now
};

await notifee.createTriggerNotification(
  { title: 'Reminder', body: 'Time to check in!', android: { channelId: 'reminders' } },
  trigger,
);
```

---

> **Philosophy:** Respect the user's attention. Every notification should provide value.

---

## Silent Push (Background Updates)

```json
{
  "apns": {
    "payload": {
      "aps": { "content-available": 1 }
    }
  },
  "data": {
    "type": "sync",
    "resource": "messages"
  }
}
```

```typescript
messaging().setBackgroundMessageHandler(async remoteMessage => {
  await syncMessages(remoteMessage.data.resource);
});
```

---

> **Philosophy:** Respect the user's attention. Every notification should provide value.

---

## Engagement Best Practices

### When to Send

| Good Timing | Bad Timing |
|-------------|------------|
| User's active hours (analyze data) | 3 AM |
| After meaningful event | Random promotional |
| Time-sensitive info | Same message daily |
| Personalized content | Generic blast |

### Segmentation

| Segment | Strategy |
|---------|----------|
| New users (0-7 days) | Onboarding tips |
| Active users | New features, achievements |
| Dormant users (7+ days) | Re-engagement, incentives |
| Power users | Early access, feedback requests |

### A/B Testing Elements

1. **Title** — length, emojis, personalization
2. **Body** — benefit-focused vs action-focused
3. **Timing** — morning vs evening
4. **Frequency** — daily vs weekly

---

> **Philosophy:** Respect the user's attention. Every notification should provide value.

---

## Privacy & Compliance

| Requirement | Detail |
|-------------|--------|
| **iOS permission** | Required before any push (except provisional) |
| **Android 13+** | `POST_NOTIFICATIONS` runtime permission required |
| **GDPR** | Consent before marketing notifications; unsubscribe mechanism |
| **CAN-SPAM** | Commercial push must allow opt-out |
| **ATT** | Not required for push itself, but needed if tracking attribution |
| **Token storage** | Encrypt device tokens at rest; delete on user account deletion |

---

> **Philosophy:** Respect the user's attention. Every notification should provide value.

---

## Opt-Out Metrics

| Metric | Warning Threshold |
|--------|-------------------|
| Opt-out rate | > 5% per campaign |
| Uninstall after notification | > 1% |
| Click-through rate | < 2% |

---

## Verification

Cross-check version-sensitive details with the cited official source and verify the resulting behavior in the target environment.

<a id="rule-push-notifications-platform-services"></a>

## Push Notifications: Platform Services through Native iOS Setup (SwiftUI)

**Impact:** high
**Kind:** reference
**Source:** `rules/push-notifications-platform-services.md`

# Push Notifications: Platform Services through Native iOS Setup (SwiftUI)

## Scope

Apply this guidance only to the declared platforms and repository-confirmed versions.

## Guidance

> **Philosophy:** Respect the user's attention. Every notification should provide value.

---

## Platform Services

| Platform | Service | Transport |
|----------|---------|-----------|
| iOS | APNs (Apple Push Notification service) | HTTP/2 |
| Android | FCM (Firebase Cloud Messaging) | HTTP v1 API |
| Cross-platform | FCM (handles both) | Recommended |

---

> **Philosophy:** Respect the user's attention. Every notification should provide value.

---

## React Native Setup (FCM)

### 1. Install

```bash
npm install @react-native-firebase/app @react-native-firebase/messaging
npm install @notifee/react-native  # Local notification display & channels
```

> **@notifee** provides local notification creation, Android channels, grouping, and foreground display — complementing FCM's remote delivery.

### 2. Request Permission

```typescript
import messaging from '@react-native-firebase/messaging';

async function requestPermission() {
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  if (enabled) {
    const token = await messaging().getToken();
    await saveTokenToServer(token);
  }
}
```

### 3. Handle Notifications

```typescript
// Foreground — display via notifee
import notifee from '@notifee/react-native';

messaging().onMessage(async remoteMessage => {
  await notifee.displayNotification({
    title: remoteMessage.notification?.title,
    body: remoteMessage.notification?.body,
    android: { channelId: 'messages' },
  });
});

// Background — app opened via notification
messaging().onNotificationOpenedApp(remoteMessage => {
  navigation.navigate(remoteMessage.data.screen);
});

// App opened from quit state
messaging().getInitialNotification().then(remoteMessage => {
  if (remoteMessage) {
    navigation.navigate(remoteMessage.data.screen);
  }
});
```

---

> **Philosophy:** Respect the user's attention. Every notification should provide value.

---

## Flutter Setup (firebase_messaging)

### 1. Install

```yaml
# pubspec.yaml
dependencies:
  firebase_core: ^latest
  firebase_messaging: ^latest
  flutter_local_notifications: ^latest
```

### 2. Request Permission & Handle

```dart
import 'package:firebase_messaging/firebase_messaging.dart';

Future<void> initPush() async {
  final messaging = FirebaseMessaging.instance;

  // Request permission
  final settings = await messaging.requestPermission(
    alert: true,
    badge: true,
    sound: true,
    provisional: false, // Set true for provisional (iOS)
  );

  if (settings.authorizationStatus == AuthorizationStatus.authorized) {
    final token = await messaging.getToken();
    await saveTokenToServer(token!);
  }

  // Foreground messages
  FirebaseMessaging.onMessage.listen((RemoteMessage message) {
    showLocalNotification(message);
  });

  // Background tap → navigate
  FirebaseMessaging.onMessageOpenedApp.listen((RemoteMessage message) {
    navigateToScreen(message.data['screen']);
  });
}

// Background handler — must be top-level function
@pragma('vm:entry-point')
Future<void> _firebaseMessagingBackgroundHandler(RemoteMessage message) async {
  await Firebase.initializeApp();
  // Handle background data
}

void main() {
  FirebaseMessaging.onBackgroundMessage(_firebaseMessagingBackgroundHandler);
  runApp(const MyApp());
}
```

---

> **Philosophy:** Respect the user's attention. Every notification should provide value.

---

## Native iOS Setup (SwiftUI)

### UNUserNotificationCenter

```swift
import UserNotifications
import FirebaseMessaging

class AppDelegate: NSObject, UIApplicationDelegate, UNUserNotificationCenterDelegate {
    func application(_ application: UIApplication,
                     didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -> Bool {
        UNUserNotificationCenter.current().delegate = self
        UNUserNotificationCenter.current().requestAuthorization(options: [.alert, .badge, .sound]) { granted, _ in
            if granted {
                DispatchQueue.main.async { application.registerForRemoteNotifications() }
            }
        }
        return true
    }

    func application(_ application: UIApplication,
                     didRegisterForRemoteNotificationsWithDeviceToken deviceToken: Data) {
        Messaging.messaging().apnsToken = deviceToken
    }

    // Foreground display
    func userNotificationCenter(_ center: UNUserNotificationCenter,
                                willPresent notification: UNNotification) async -> UNNotificationPresentationOptions {
        return [.banner, .badge, .sound]
    }

    // Tap handler
    func userNotificationCenter(_ center: UNUserNotificationCenter,
                                didReceive response: UNNotificationResponse) async {
        let data = response.notification.request.content.userInfo
        handleDeepLink(data)
    }
}

@main
struct MyApp: App {
    @UIApplicationDelegateAdaptor(AppDelegate.self) var delegate
    var body: some Scene { WindowGroup { ContentView() } }
}
```

---

## Verification

Cross-check version-sensitive details with the cited official source and verify the resulting behavior in the target environment.

<a id="rule-push-notifications-troubleshooting-4"></a>

## Push Notifications: Troubleshooting through Related

**Impact:** high
**Kind:** reference
**Source:** `rules/push-notifications-troubleshooting-4.md`

# Push Notifications: Troubleshooting through Related

## Scope

Apply only to the declared platforms and repository-confirmed versions.

## Guidance

> **Philosophy:** Respect the user's attention. Every notification should provide value.

---

## Troubleshooting

| Problem | Cause | Fix |
|---------|-------|-----|
| Not receiving on iOS | Missing APNs certificate/key | Upload p8 key in Firebase Console |
| Not receiving on Android | Missing channel (8.0+) | Create channel before sending |
| Delayed delivery | Low priority | Set `priority: "high"` (Android) |
| Token expired | User reinstalled / long inactive | Handle `onNewToken` callback |
| Foreground not displaying | Not handled | Use notifee/flutter_local_notifications |
| Background handler not firing | Not registered at top level | Register before `runApp()` / `AppRegistry` |

---

> **Philosophy:** Respect the user's attention. Every notification should provide value.

---

## Anti-Patterns

| ❌ Don't | ✅ Do |
|---------|-------|
| Ask permission immediately | Ask after user sees value |
| Send same notification to all | Segment and personalize |
| Only promotional content | Mix value + promotional |
| Ignore opt-out signals | Reduce frequency for disengaged |
| Deep link to home screen | Deep link to relevant content |
| Store tokens in plaintext | Encrypt at rest |
| Skip Android 13 permission | Request POST_NOTIFICATIONS |

---

> **Philosophy:** Respect the user's attention. Every notification should provide value.

---

## 🔗 Related

| File | When to Read |
|------|-------------|
| [app-store-optimization.md](app-store-optimization-core-aso-elements.md) | Re-engagement strategy |
| [deep-linking.md](deep-linking-deep-link-types.md) | Push → deep link routing |
| [../frameworks/react-native.md](react-native-framework-decision.md) | RN notification setup |
| [../frameworks/flutter.md](flutter-widget-architecture.md) | Flutter notification setup |
| [../frameworks/native.md](native-when-to-go-native.md) | Native iOS/Android handlers |

---

## Verification

Cross-check version-sensitive details with the cited official source and verify behavior in the target environment.

<a id="rule-react-native-expo-specific-patterns-3"></a>

## React Native: Expo-Specific Patterns through Related Sub-Skills

**Impact:** high
**Kind:** reference
**Source:** `rules/react-native-expo-specific-patterns-3.md`

# React Native: Expo-Specific Patterns through Related Sub-Skills

## Scope

Apply this guidance only to the declared platforms and repository-confirmed versions.

## Guidance

> **Philosophy:** Native-first thinking. Expo when possible. New Architecture by default.

---

## Expo-Specific Patterns

### Config Plugins

```javascript
// app.config.js
export default {
  expo: {
    plugins: [
      ['expo-camera', { cameraPermission: 'Allow camera for scanning' }],
      ['expo-location', { locationAlwaysPermission: false }],
    ],
  },
};
```

---

> **Philosophy:** Native-first thinking. Expo when possible. New Architecture by default.

---

## Anti-Patterns

| ❌ Don't | ✅ Do |
|---------|-------|
| Use `index` as key in lists | Use unique IDs |
| Store large data in AsyncStorage | Use MMKV or WatermelonDB |
| Ignore New Architecture | Enable Fabric + TurboModules |
| Mix business logic in components | Separate hooks/services (MVVM) |
| Skip error boundaries | Wrap every navigator with ErrorBoundary |
| Hardcode API keys in JS | Use `react-native-config` + Keychain |

---

> **Philosophy:** Native-first thinking. Expo when possible. New Architecture by default.

---

## 🔗 Related Sub-Skills

| File | When to Read |
|------|-------------|
| [publishing/app-store-optimization.md](app-store-optimization-core-aso-elements.md) | Preparing for App Store / Play Store |
| [publishing/deep-linking.md](deep-linking-deep-link-types.md) | Universal links, app links |
| [publishing/push-notifications.md](push-notifications-platform-services.md) | FCM / APNs setup |

---

## Verification

Cross-check version-sensitive details with the cited official source and verify the resulting behavior in the target environment.

<a id="rule-react-native-framework-decision"></a>

## React Native: Framework Decision through Performance Optimization

**Impact:** high
**Kind:** reference
**Source:** `rules/react-native-framework-decision.md`

# React Native: Framework Decision through Performance Optimization

## Scope

Apply this guidance only to the declared platforms and repository-confirmed versions.

## Guidance

> **Philosophy:** Native-first thinking. Expo when possible. New Architecture by default.

---

## Framework Decision

| Scenario | Recommendation |
|----------|----------------|
| Rapid prototyping | Expo managed workflow |
| OTA updates needed | Expo EAS Update |
| Deep native modules | Bare workflow + native code |
| Existing native app | React Native for specific screens |

---

> **Philosophy:** Native-first thinking. Expo when possible. New Architecture by default.

---

## New Architecture (Fabric + TurboModules)

> Default since RN 0.76. All new projects should use New Architecture.

### Key Changes

| Legacy | New Architecture |
|--------|-----------------|
| Bridge (async, JSON serialization) | JSI (synchronous, direct memory access) |
| Old Renderer | Fabric (concurrent rendering) |
| Native Modules (bridge) | TurboModules (lazy, typed) |
| No codegen | Codegen from TypeScript specs |

### TurboModule Example

```typescript
// specs/NativeCalculator.ts
import type { TurboModule } from 'react-native';
import { TurboModuleRegistry } from 'react-native';

export interface Spec extends TurboModule {
  multiply(a: number, b: number): number; // synchronous via JSI
}

export default TurboModuleRegistry.getEnforcing<Spec>('Calculator');
```

### Migration Checklist

| Step | Action |
|------|--------|
| 1 | Enable in `react-native.config.js`: `newArchEnabled: true` |
| 2 | Replace `requireNativeComponent` with `codegenNativeComponent` |
| 3 | Replace `NativeModules` with TurboModule specs |
| 4 | Test all native modules for JSI compatibility |

---

> **Philosophy:** Native-first thinking. Expo when possible. New Architecture by default.

---

## Navigation Patterns

### React Navigation (Standard)

```typescript
const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function MainTabs() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen name="Home" component={HomeStack} />
      <Tab.Screen name="Profile" component={ProfileStack} />
    </Tab.Navigator>
  );
}

// Deep linking config
const linking = {
  prefixes: ['myapp://', 'https://myapp.com'],
  config: {
    screens: { Home: 'home', Profile: 'user/:id' },
  },
};
```

### Navigation Patterns Matrix

| Pattern | When to Use |
|---------|-------------|
| Stack | Linear flows (auth, checkout) |
| Tab | 3-5 main sections |
| Drawer | Many sections, less frequent access |
| Modal | Overlays, confirmations |

---

> **Philosophy:** Native-first thinking. Expo when possible. New Architecture by default.

---

## State Management

| Complexity | Solution | When |
|------------|----------|------|
| Simple | React Context + useReducer | < 5 screens |
| Medium | Zustand | Cross-component, persistent |
| Complex | TanStack Query + Zustand | API-heavy apps |
| Offline-first | WatermelonDB | Large datasets, sync |

---

> **Philosophy:** Native-first thinking. Expo when possible. New Architecture by default.

---

## Architecture Patterns (MVVM)

```
src/
├── features/
│   └── user/
│       ├── screens/        # Views (React components)
│       ├── hooks/           # ViewModels (useUser, useAuth)
│       ├── services/        # Model (API calls, business logic)
│       ├── types/           # TypeScript interfaces
│       └── __tests__/       # Co-located tests
├── shared/
│   ├── components/          # Reusable UI
│   ├── hooks/               # Shared hooks
│   └── utils/               # Helpers
└── navigation/              # Navigation config
```

| Layer | Responsibility | Example |
|-------|---------------|---------|
| View | UI rendering only | `UserScreen.tsx` |
| ViewModel | State + logic | `useUser()` hook |
| Model | Data access | `userService.ts` |

---

> **Philosophy:** Native-first thinking. Expo when possible. New Architecture by default.

---

## Performance Optimization

### Critical Rules

1. **Stable references in render**
   ```typescript
   // ❌ Bad — new function every render
   <Button onPress={() => handlePress(id)} />

   // ✅ Good — stable reference
   const handleItemPress = useCallback(() => handlePress(id), [id]);
   <Button onPress={handleItemPress} />
   ```

2. **FlashList for large lists**
   ```typescript
   import { FlashList } from "@shopify/flash-list";

   <FlashList
     data={items}
     renderItem={({ item }) => <ItemComponent item={item} />}
     estimatedItemSize={80}
   />
   ```

3. **Memoize expensive components**
   ```typescript
   const MemoizedItem = React.memo(ItemComponent, (prev, next) =>
     prev.item.id === next.item.id
   );
   ```

### JSI Performance (New Architecture)

| Avoid | Prefer |
|-------|--------|
| Frequent bridge calls | JSI synchronous calls |
| Large JSON over bridge | Direct memory sharing via JSI |
| Synchronous native calls (legacy) | TurboModules with async/sync as needed |
| Hermes disabled | Hermes enabled (default since RN 0.70) |

---

## Verification

Cross-check version-sensitive details with the cited official source and verify the resulting behavior in the target environment.

<a id="rule-react-native-testing-2"></a>

## React Native: Testing through CI/CD & Build

**Impact:** high
**Kind:** reference
**Source:** `rules/react-native-testing-2.md`

# React Native: Testing through CI/CD & Build

## Scope

Apply this guidance only to the declared platforms and repository-confirmed versions.

## Guidance

> **Philosophy:** Native-first thinking. Expo when possible. New Architecture by default.

---

## Testing

### Testing Stack

| Type | Tool | Purpose |
|------|------|---------|
| Unit | Jest | Business logic, hooks |
| Component | React Native Testing Library | UI behavior |
| E2E | Detox / Maestro | Full device flows |
| Snapshot | Jest | UI regression |

### Component Test Example

```typescript
import { render, fireEvent, screen } from '@testing-library/react-native';
import { Counter } from '../Counter';

test('increments counter on press', () => {
  render(<Counter />);

  fireEvent.press(screen.getByRole('button', { name: 'Increment' }));

  expect(screen.getByText('Count: 1')).toBeTruthy();
});
```

### Hook Test Example

```typescript
import { renderHook, act } from '@testing-library/react-native';
import { useCounter } from '../useCounter';

test('increments value', () => {
  const { result } = renderHook(() => useCounter());

  act(() => result.current.increment());

  expect(result.current.count).toBe(1);
});
```

---

> **Philosophy:** Native-first thinking. Expo when possible. New Architecture by default.

---

## Error Handling

### Error Boundary

```typescript
import { ErrorBoundary } from 'react-error-boundary';

function ErrorFallback({ error, resetErrorBoundary }) {
  return (
    <View style={styles.center}>
      <Text>Something went wrong</Text>
      <Button title="Try Again" onPress={resetErrorBoundary} />
    </View>
  );
}

// Wrap screens
<ErrorBoundary FallbackComponent={ErrorFallback}>
  <HomeScreen />
</ErrorBoundary>
```

### Crash Reporting

```typescript
// Initialize in app entry
import crashlytics from '@react-native-firebase/crashlytics';

// Global unhandled JS errors
ErrorUtils.setGlobalHandler((error, isFatal) => {
  crashlytics().recordError(error);
  if (isFatal) crashlytics().log('Fatal JS error');
});
```

### API Error Pattern

```typescript
async function fetchUser(id: string): Promise<Result<User>> {
  try {
    const response = await api.get(`/users/${id}`);
    return { ok: true, data: response.data };
  } catch (error) {
    crashlytics().recordError(error);
    return { ok: false, error: parseApiError(error) };
  }
}
```

---

> **Philosophy:** Native-first thinking. Expo when possible. New Architecture by default.

---

## Accessibility

| Element | Implementation |
|---------|---------------|
| Labels | `accessibilityLabel="Submit order"` |
| Roles | `accessibilityRole="button"` |
| State | `accessibilityState={{ disabled: true }}` |
| Hints | `accessibilityHint="Double tap to submit"` |
| Live regions | `accessibilityLiveRegion="polite"` |

### Dynamic Type

```typescript
import { useWindowDimensions } from 'react-native';

// Respect system font scale
const { fontScale } = useWindowDimensions();
const dynamicFontSize = 16 * fontScale;
```

### Testing A11y

```bash
# iOS: Accessibility Inspector (Xcode → Open Developer Tool)
# Android: Accessibility Scanner from Play Store
# Automated: detox --configuration ios.sim.debug --testNamePattern "a11y"
```

---

> **Philosophy:** Native-first thinking. Expo when possible. New Architecture by default.

---

## Offline Patterns

| Strategy | Library | Use Case |
|----------|---------|----------|
| Simple cache | `@tanstack/react-query` `persistQueryClient` | API response caching |
| Key-value | `react-native-mmkv` | Settings, tokens |
| Relational | WatermelonDB | Large datasets with sync |
| Queue | NetInfo + custom queue | Offline write operations |

### Offline Queue Pattern

```typescript
import NetInfo from '@react-native-community/netinfo';

const offlineQueue: QueueItem[] = [];

async function enqueueOrExecute(action: () => Promise<void>) {
  const { isConnected } = await NetInfo.fetch();
  if (isConnected) {
    await action();
  } else {
    offlineQueue.push({ action, timestamp: Date.now() });
  }
}

// Flush on reconnect
NetInfo.addEventListener(({ isConnected }) => {
  if (isConnected) flushQueue(offlineQueue);
});
```

---

> **Philosophy:** Native-first thinking. Expo when possible. New Architecture by default.

---

## Security

| Concern | Solution |
|---------|----------|
| Secrets storage | `react-native-keychain` (Keychain/Keystore) |
| API keys | `.env` via `react-native-config` (never in JS bundle) |
| SSL pinning | `react-native-ssl-pinning` |
| Root/Jailbreak detection | `jail-monkey` |
| Code obfuscation | Hermes bytecode (default) |
| Secure network | Certificate pinning + TLS 1.3 |

---

> **Philosophy:** Native-first thinking. Expo when possible. New Architecture by default.

---

## CI/CD & Build

### Expo EAS

```bash
# Development build
eas build --profile development --platform ios

# Production build
eas build --profile production --platform all

# OTA update (no app store review)
eas update --branch production --message "Bug fix v1.2.1"
```

### Fastlane (Bare Workflow)

```bash
# iOS
fastlane ios beta     # TestFlight
fastlane ios release  # App Store

# Android
fastlane android beta     # Internal testing
fastlane android release  # Play Store
```

---

## Verification

Cross-check version-sensitive details with the cited official source and verify the resulting behavior in the target environment.

<a id="rule-touch-psychology-1-fitts-law-for-touch"></a>

## Touch Psychology: Fitts' Law for Touch through 2. Thumb Zone Anatomy

**Impact:** high
**Kind:** reference
**Source:** `rules/touch-psychology-1-fitts-law-for-touch.md`

# Touch Psychology: Fitts' Law for Touch through 2. Thumb Zone Anatomy

## Scope

Apply only to the declared platforms and repository-confirmed versions.

## Guidance

> Deep dive into mobile touch interaction, Fitts' Law for touch, thumb zone anatomy, gesture psychology, and haptic feedback.
> **This is the mobile equivalent of ux-psychology.md - CRITICAL for all mobile work.**

---

## 1. Fitts' Law for Touch

### The Fundamental Difference

```
DESKTOP (Mouse/Trackpad):
+-- Cursor size: 1 pixel (precision)
+-- Visual feedback: Hover states
+-- Error cost: Low (easy to retry)
+-- Target acquisition: Fast, precise

MOBILE (Finger):
+-- Contact area: ~7mm diameter (imprecise)
+-- Visual feedback: No hover, only tap
+-- Error cost: High (frustrating retries)
+-- Occlusion: Finger covers the target
+-- Target acquisition: Slower, needs larger targets
```

### Fitts' Law Formula Adapted

```
Touch acquisition time = a + b × log2(1 + D/W)

Where:
+-- D = Distance to target
+-- W = Width of target
+-- For touch: W must be MUCH larger than desktop
```

### Minimum Touch Target Sizes

| Platform | Minimum | Recommended | Use For |
|----------|---------|-------------|---------|
| **iOS (HIG)** | 44pt × 44pt | 48pt+ | All tappable elements |
| **Android (Material)** | 48dp × 48dp | 56dp+ | All tappable elements |
| **WCAG 2.2** | 44px × 44px | - | Accessibility compliance |
| **Critical Actions** | - | 56-64px | Primary CTAs, destructive actions |

### Visual Size vs Hit Area

```
+-------------------------------------+
|                                     |
|    +-------------------------+      |
|    |                         |      |
|    |    [  BUTTON  ]         | ? Visual: 36px
|    |                         |      |
|    +-------------------------+      |
|                                     | ? Hit area: 48px (padding extends)
+-------------------------------------+

? CORRECT: Visual can be smaller if hit area is minimum 44-48px
? WRONG: Making hit area same as small visual element
```

### Application Rules

| Element | Visual Size | Hit Area |
|---------|-------------|----------|
| Icon buttons | 24-32px | 44-48px (padding) |
| Text links | Any | 44px height minimum |
| List items | Full width | 48-56px height |
| Checkboxes/Radio | 20-24px | 44-48px tap area |
| Close/X buttons | 24px | 44px minimum |
| Tab bar items | Icon 24-28px | Full tab width, 49px height (iOS) |

---

> Deep dive into mobile touch interaction, Fitts' Law for touch, thumb zone anatomy, gesture psychology, and haptic feedback.
> **This is the mobile equivalent of ux-psychology.md - CRITICAL for all mobile work.**

---

## 2. Thumb Zone Anatomy

### One-Handed Phone Usage

```
Research shows: 49% of users hold phone one-handed.

+-------------------------------------+
|                                     |
|  +-----------------------------+    |
|  |       HARD TO REACH         |    | ? Status bar, top nav
|  |      (requires stretch)     |    |    Put: Back, menu, settings
|  |                             |    |
|  +-----------------------------+    |
|  |                             |    |
|  |       OK TO REACH           |    | ? Content area
|  |      (comfortable)          |    |    Put: Secondary actions, content
|  |                             |    |
|  +-----------------------------+    |
|  |                             |    |
|  |       EASY TO REACH         |    | ? Tab bar, FAB zone
|  |      (thumb's arc)          |    |    Put: PRIMARY CTAs!
|  |                             |    |
|  +-----------------------------+    |
|                                     |
|          [    HOME    ]             |
+-------------------------------------+
```

### Thumb Arc (Right-Handed User)

```
Right hand holding phone:

+-------------------------------+
|  STRETCH      STRETCH    OK   |
|                               |
|  STRETCH        OK       EASY |
|                               |
|    OK          EASY      EASY |
|                               |
|   EASY         EASY      EASY |
+-------------------------------+

Left hand is mirrored.
? Design for BOTH hands or assume right-dominant
```

### Placement Guidelines

| Element Type | Ideal Position | Reason |
|--------------|----------------|--------|
| **Primary CTA** | Bottom center/right | Easy thumb reach |
| **Tab bar** | Bottom | Natural thumb position |
| **FAB** | Bottom right | Easy for right hand |
| **Navigation** | Top (stretch) | Less frequent use |
| **Destructive actions** | Top left | Hard to reach = harder to accidentally tap |
| **Dismiss/Cancel** | Top left | Convention + safety |
| **Confirm/Done** | Top right or bottom | Convention |

### Large Phone Considerations (>6")

```
On large phones, top 40% becomes "dead zone" for one-handed use.

Solutions:
+-- Reachability features (iOS)
+-- Pull-down interfaces (drawer pulls content down)
+-- Bottom sheet navigation
+-- Floating action buttons
+-- Gesture-based alternatives to top actions
```

---

## Verification

Cross-check version-sensitive details with the cited official source and verify behavior in the target environment.

<a id="rule-touch-psychology-3-touch-vs-click-psychology-2"></a>

## Touch Psychology: Touch vs Click Psychology through 4. Gesture Psychology

**Impact:** high
**Kind:** reference
**Source:** `rules/touch-psychology-3-touch-vs-click-psychology-2.md`

# Touch Psychology: Touch vs Click Psychology through 4. Gesture Psychology

## Scope

Apply only to the declared platforms and repository-confirmed versions.

## Guidance

> Deep dive into mobile touch interaction, Fitts' Law for touch, thumb zone anatomy, gesture psychology, and haptic feedback.
> **This is the mobile equivalent of ux-psychology.md - CRITICAL for all mobile work.**

---

## 3. Touch vs Click Psychology

### Expectation Differences

| Aspect | Click (Desktop) | Touch (Mobile) |
|--------|-----------------|----------------|
| **Feedback timing** | Can wait 100ms | Expect instant (<50ms) |
| **Visual feedback** | Hover ? Click | Immediate tap response |
| **Error tolerance** | Easy retry | Frustrating, feels broken |
| **Precision** | High | Low |
| **Context menu** | Right-click | Long press |
| **Cancel action** | ESC key | Swipe away, outside tap |

### Touch Feedback Requirements

```
Tap ? Immediate visual change (< 50ms)
+-- Highlight state (background color change)
+-- Scale down slightly (0.95-0.98)
+-- Ripple effect (Android Material)
+-- Haptic feedback for confirmation
+-- Never nothing!

Loading ? Show within 100ms
+-- If action takes > 100ms
+-- Show spinner/progress
+-- Disable button (prevent double tap)
+-- Optimistic UI when possible
```

### The "Fat Finger" Problem

```
Problem: Finger occludes target during tap
+-- User can't see exactly where they're tapping
+-- Visual feedback appears UNDER finger
+-- Increases error rate

Solutions:
+-- Show feedback ABOVE touch point (tooltips)
+-- Use cursor-like offset for precision tasks
+-- Magnification loupe for text selection
+-- Large enough targets that precision doesn't matter
```

---

> Deep dive into mobile touch interaction, Fitts' Law for touch, thumb zone anatomy, gesture psychology, and haptic feedback.
> **This is the mobile equivalent of ux-psychology.md - CRITICAL for all mobile work.**

---

## 4. Gesture Psychology

### Gesture Discoverability Problem

```
Problem: Gestures are INVISIBLE.
+-- User must discover/remember them
+-- No hover/visual hint
+-- Different mental model than tap
+-- Many users never discover gestures

Solution: Always provide visible alternative
+-- Swipe to delete ? Also show delete button or menu
+-- Pull to refresh ? Also show refresh button
+-- Pinch to zoom ? Also show zoom controls
+-- Gestures as shortcuts, not only way
```

### Common Gesture Conventions

| Gesture | Universal Meaning | Usage |
|---------|-------------------|-------|
| **Tap** | Select, activate | Primary action |
| **Double tap** | Zoom in, like/favorite | Quick action |
| **Long press** | Context menu, selection mode | Secondary options |
| **Swipe horizontal** | Navigation, delete, actions | List actions |
| **Swipe down** | Refresh, dismiss | Pull to refresh |
| **Pinch** | Zoom in/out | Maps, images |
| **Two-finger scroll** | Scroll within scroll | Nested scrolls |

### Gesture Affordance Design

```
Swipe actions need visual hints:

+-----------------------------------------+
|  +---+                                  |
|  | = |  Item with hidden actions...   ? | ? Edge hint (partial color)
|  +---+                                  |
+-----------------------------------------+

? Good: Slight color peek at edge suggesting swipe
? Good: Drag handle icon ( = ) suggesting reorder
? Good: Onboarding tooltip explaining gesture
? Bad: Hidden gestures with no visual affordance
```

### Platform Gesture Differences

| Gesture | iOS | Android |
|---------|-----|---------|
| **Back** | Edge swipe from left | System back button/gesture |
| **Share** | Action sheet | Share sheet |
| **Context menu** | Long press / Force touch | Long press |
| **Dismiss modal** | Swipe down | Back button or swipe |
| **Delete in list** | Swipe left, tap delete | Swipe left, immediate or undo |

---

## Verification

Cross-check version-sensitive details with the cited official source and verify behavior in the target environment.

<a id="rule-touch-psychology-5-haptic-feedback-patterns-3"></a>

## Touch Psychology: Haptic Feedback Patterns through 6. Mobile Cognitive Load

**Impact:** high
**Kind:** reference
**Source:** `rules/touch-psychology-5-haptic-feedback-patterns-3.md`

# Touch Psychology: Haptic Feedback Patterns through 6. Mobile Cognitive Load

## Scope

Apply only to the declared platforms and repository-confirmed versions.

## Guidance

> Deep dive into mobile touch interaction, Fitts' Law for touch, thumb zone anatomy, gesture psychology, and haptic feedback.
> **This is the mobile equivalent of ux-psychology.md - CRITICAL for all mobile work.**

---

## 5. Haptic Feedback Patterns

### Why Haptics Matter

```
Haptics provide:
+-- Confirmation without looking
+-- Richer, more premium feel
+-- Accessibility (blind users)
+-- Reduced error rate
+-- Emotional satisfaction

Without haptics:
+-- Feels "cheap" or web-like
+-- User unsure if action registered
+-- Missed opportunity for delight
```

### iOS Haptic Types

| Type | Intensity | Use Case |
|------|-----------|----------|
| `selection` | Light | Picker scroll, toggle, selection |
| `light` | Light | Minor actions, hover equivalent |
| `medium` | Medium | Standard tap confirmation |
| `heavy` | Strong | Important completed, drop |
| `success` | Pattern | Task completed successfully |
| `warning` | Pattern | Warning, attention needed |
| `error` | Pattern | Error occurred |

### Android Haptic Types

| Type | Use Case |
|------|----------|
| `CLICK` | Standard tap feedback |
| `HEAVY_CLICK` | Important actions |
| `DOUBLE_CLICK` | Confirm actions |
| `TICK` | Scroll/scrub feedback |
| `LONG_PRESS` | Long press activation |
| `REJECT` | Error/invalid action |

### Haptic Usage Guidelines

```
? DO use haptics for:
+-- Button taps
+-- Toggle switches
+-- Picker/slider values
+-- Pull to refresh trigger
+-- Successful action completion
+-- Errors and warnings
+-- Swipe action thresholds
+-- Important state changes

? DON'T use haptics for:
+-- Every scroll position
+-- Every list item
+-- Background events
+-- Passive displays
+-- Too frequently (haptic fatigue)
```

### Haptic Intensity Mapping

| Action Importance | Haptic Level | Example |
|-------------------|--------------|---------|
| Minor/Browsing | Light / None | Scrolling, hovering |
| Standard Action | Medium / Selection | Tap, toggle |
| Significant Action | Heavy / Success | Complete, confirm |
| Critical/Destructive | Heavy / Warning | Delete, payment |
| Error | Error pattern | Failed action |

---

> Deep dive into mobile touch interaction, Fitts' Law for touch, thumb zone anatomy, gesture psychology, and haptic feedback.
> **This is the mobile equivalent of ux-psychology.md - CRITICAL for all mobile work.**

---

## 6. Mobile Cognitive Load

### How Mobile Differs from Desktop

| Factor | Desktop | Mobile | Implication |
|--------|---------|--------|-------------|
| **Attention** | Focused sessions | Interrupted constantly | Design for micro-sessions |
| **Context** | Controlled environment | Anywhere, any condition | Handle bad lighting, noise |
| **Multitasking** | Multiple windows | One app visible | Complete task in-app |
| **Input speed** | Fast (keyboard) | Slow (touch typing) | Minimize input, smart defaults |
| **Error recovery** | Easy (undo, back) | Harder (no keyboard shortcuts) | Prevent errors, easy recovery |

### Reducing Mobile Cognitive Load

```
1. ONE PRIMARY ACTION per screen
   +-- Clear what to do next

2. PROGRESSIVE DISCLOSURE
   +-- Show only what's needed now

3. SMART DEFAULTS
   +-- Pre-fill what you can

4. CHUNKING
   +-- Break long forms into steps

5. RECOGNITION over RECALL
   +-- Show options, don't make user remember

6. CONTEXT PERSISTENCE
   +-- Save state on interrupt/background
```

### Miller's Law for Mobile

```
Desktop: 7 × 2 items in working memory
Mobile: Reduce to 5 × 1 (more distractions)

Navigation: Max 5 tab bar items
Options: Max 5 per menu level
Steps: Max 5 visible steps in progress
```

### Hick's Law for Mobile

```
More choices = slower decisions

Mobile impact: Even worse than desktop
+-- Smaller screen = less overview
+-- Scrolling required = items forgotten
+-- Interruptions = lost context
+-- Decision fatigue faster

Solution: Progressive disclosure
+-- Start with 3-5 options
+-- "More" for additional
+-- Smart ordering (most used first)
+-- Previous selections remembered
```

---

## Verification

Cross-check version-sensitive details with the cited official source and verify behavior in the target environment.

<a id="rule-touch-psychology-7-touch-accessibility-4"></a>

## Touch Psychology: Touch Accessibility through 10. Quick Reference Card

**Impact:** high
**Kind:** reference
**Source:** `rules/touch-psychology-7-touch-accessibility-4.md`

# Touch Psychology: Touch Accessibility through 10. Quick Reference Card

## Scope

Apply only to the declared platforms and repository-confirmed versions.

## Guidance

> Deep dive into mobile touch interaction, Fitts' Law for touch, thumb zone anatomy, gesture psychology, and haptic feedback.
> **This is the mobile equivalent of ux-psychology.md - CRITICAL for all mobile work.**

---

## 7. Touch Accessibility

### Motor Impairment Considerations

```
Users with motor impairments may:
+-- Have tremors (need larger targets)
+-- Use assistive devices (different input method)
+-- Have limited reach (one-handed necessity)
+-- Need more time (avoid timeouts)
+-- Make accidental touches (need confirmation)

Design responses:
+-- Generous touch targets (48dp+)
+-- Adjustable timing for gestures
+-- Undo for destructive actions
+-- Switch control support
+-- Voice control support
```

### Touch Target Spacing (A11y)

```
WCAG 2.2 Success Criterion 2.5.8:

Touch targets MUST have:
+-- Width: = 44px
+-- Height: = 44px
+-- Spacing: = 8px from adjacent targets

OR the target is:
+-- Inline (within text)
+-- User-controlled (user can resize)
+-- Essential (no alternative design)
```

### Accessible Touch Patterns

| Pattern | Accessible Implementation |
|---------|---------------------------|
| Swipe actions | Provide menu alternative |
| Drag and drop | Provide select + move option |
| Pinch zoom | Provide zoom buttons |
| Force touch | Provide long press alternative |
| Shake gesture | Provide button alternative |

---

> Deep dive into mobile touch interaction, Fitts' Law for touch, thumb zone anatomy, gesture psychology, and haptic feedback.
> **This is the mobile equivalent of ux-psychology.md - CRITICAL for all mobile work.**

---

## 8. Emotion in Touch

### The Premium Feel

```
What makes touch feel "premium":
+-- Instant response (< 50ms)
+-- Appropriate haptic feedback
+-- Smooth 60fps animations
+-- Correct resistance/physics
+-- Sound feedback (when appropriate)
+-- Attention to spring physics
```

### Emotional Touch Feedback

| Emotion | Touch Response |
|---------|----------------|
| Success | Haptic success + confetti/check |
| Error | Haptic error + shake animation |
| Warning | Haptic warning + attention color |
| Delight | Unexpected smooth animation |
| Power | Heavy haptic on significant action |

### Trust Building Through Touch

```
Trust signals in touch interactions:
+-- Consistent behavior (same action = same response)
+-- Reliable feedback (never fails silently)
+-- Secure feel for sensitive actions
+-- Professional animations (not janky)
+-- No accidental actions (confirmation for destructive)
```

---

> Deep dive into mobile touch interaction, Fitts' Law for touch, thumb zone anatomy, gesture psychology, and haptic feedback.
> **This is the mobile equivalent of ux-psychology.md - CRITICAL for all mobile work.**

---

## 9. Touch Psychology Checklist

### Before Every Screen

- [ ] **All touch targets = 44-48px?**
- [ ] **Primary CTA in thumb zone?**
- [ ] **Destructive actions require confirmation?**
- [ ] **Gesture alternatives exist (visible buttons)?**
- [ ] **Haptic feedback on important actions?**
- [ ] **Immediate visual feedback on tap?**
- [ ] **Loading states for actions > 100ms?**

### Before Release

- [ ] **Tested on smallest supported device?**
- [ ] **Tested one-handed on large phone?**
- [ ] **All gestures have visible alternatives?**
- [ ] **Haptics work correctly (test on device)?**
- [ ] **Touch targets tested with accessibility settings?**
- [ ] **No tiny close buttons or icons?**

---

> Deep dive into mobile touch interaction, Fitts' Law for touch, thumb zone anatomy, gesture psychology, and haptic feedback.
> **This is the mobile equivalent of ux-psychology.md - CRITICAL for all mobile work.**

---

## 10. Quick Reference Card

### Touch Target Sizes

```
                     iOS        Android     WCAG
Minimum:           44pt       48dp       44px
Recommended:       48pt+      56dp+      -
Spacing:           8pt+       8dp+       8px+
```

### Thumb Zone Actions

```
TOP:      Navigation, settings, back (infrequent)
MIDDLE:   Content, secondary actions
BOTTOM:   Primary CTA, tab bar, FAB (frequent)
```

### Haptic Selection

```
Light:    Selection, toggle, minor
Medium:   Tap, standard action
Heavy:    Confirm, complete, drop
Success:  Task done
Error:    Failed action
Warning:  Attention needed
```

---

> **Remember:** Every touch is a conversation between user and device. Make it feel natural, responsive, and respectful of human fingers — not precise cursor points.

---

## Verification

Cross-check version-sensitive details with the cited official source and verify behavior in the target environment.
