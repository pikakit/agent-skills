---
name: mobile-developer
description: >-
  Develop React Native, Flutter, or native mobile apps with modern architecture patterns.
  Masters cross-platform development, native integrations, offline sync, and app store optimization.
  Triggers on: React Native, Flutter, iOS, Android, mobile app, cross-platform.
  Coordinates with: mobile-first, mobile-design, perf-optimizer.
metadata:
  version: "2.0.0"
  category: "mobile-games"
  triggers: "React Native, Flutter, iOS, Android, mobile app"
  coordinates_with: "mobile-first, mobile-design, perf-optimizer"
  success_metrics: "app builds, no crashes, store approved"
---

# Mobile Developer

> **Purpose:** Cross-platform and native mobile development expert.

---

## When to Use This Skill

- Building React Native, Flutter, or native iOS/Android apps
- Implementing mobile features (auth, push, payments)
- Optimizing mobile app performance
- Preparing for App Store/Play Store submission

---

## Framework Decision

| Need | Framework |
|------|-----------|
| OTA updates, rapid iteration | React Native + Expo |
| Pixel-perfect custom UI | Flutter |
| Deep iOS features | SwiftUI |
| Deep Android features | Kotlin + Compose |

---

## Architecture Patterns

| Pattern | Use When |
|---------|----------|
| **Clean Architecture** | Complex apps, team scaling |
| **MVVM** | UI-driven apps |
| **BLoC/Redux** | Complex state management |
| **Repository** | Data abstraction |

---

## Core Capabilities

### Cross-Platform
- React Native New Architecture (Fabric, TurboModules, JSI)
- Flutter 3.x with Dart 3 null safety
- Expo SDK 50+ with EAS services

### Native Integration
- Swift/SwiftUI for iOS, Kotlin/Compose for Android
- Camera, sensors, hardware APIs
- Background processing, push notifications

### Performance
- Startup time optimization
- Memory management, leak prevention
- 60fps animation maintenance
- List virtualization for large datasets

### Data & Sync
- Offline-first with SQLite, Realm, Hive
- GraphQL/REST with caching
- Real-time sync with WebSockets/Firebase
- Conflict resolution patterns

---

## Platform Services

| Service | Technologies |
|---------|--------------|
| Push | FCM, APNs |
| Auth | OAuth, Biometric, Social |
| Payments | Stripe, Apple Pay, Google Pay |
| Maps | Google Maps, Apple MapKit |
| Analytics | Firebase, Sentry |

---

## Testing Strategy

| Level | Tools |
|-------|-------|
| Unit | Jest, Dart test, XCTest |
| Component | React Native Testing Library |
| E2E | Detox, Maestro, Patrol |
| Device | Firebase Test Lab, Bitrise |

---

## DevOps & Deployment

| Task | Tools |
|------|-------|
| CI/CD | Bitrise, GitHub Actions, Codemagic |
| Automation | Fastlane |
| OTA Updates | CodePush, EAS Update |
| Beta Testing | TestFlight, Internal App Sharing |

---

## Security Checklist

- [ ] OWASP MASVS compliance
- [ ] Certificate pinning
- [ ] Biometric authentication
- [ ] Secure storage (Keychain/Keystore)
- [ ] Code obfuscation (ProGuard/R8)
- [ ] GDPR/privacy compliance

---

## App Store Optimization

- [ ] Metadata optimization
- [ ] Screenshots and preview videos
- [ ] A/B testing store listings
- [ ] Privacy nutrition labels
- [ ] Bundle size optimization

---

## Response Approach

1. **Assess** platform requirements
2. **Recommend** architecture based on complexity
3. **Implement** with platform-specific patterns
4. **Optimize** for performance from start
5. **Plan** offline scenarios and error handling
6. **Test** with mobile-specific strategies
7. **Deploy** with proper automation

---

## Example Tasks

- "Architect cross-platform e-commerce app with offline"
- "Migrate React Native to New Architecture"
- "Implement biometric auth across iOS/Android"
- "Optimize Flutter for 60fps animations"
- "Set up CI/CD for automated store deployments"

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| Build fails on iOS | Run `pod install --repo-update` |
| Android Gradle error | Check Gradle version, sync project |
| Hot reload not working | Restart Metro/Flutter, clear cache |
| Native module linking | Run `npx react-native link` or `flutter pub get` |
| App store rejection | Check guidelines, test on real devices |

---

## 🔗 Related

| Item | Type | Purpose |
|------|------|---------|
| `mobile-first` | Skill | Orchestrator |
| `mobile-design` | Skill | Design patterns |
| `mobile-security-coder` | Skill | Security |

---

⚡ PikaKit v3.9.68
