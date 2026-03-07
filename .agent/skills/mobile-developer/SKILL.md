---
name: mobile-developer
summary: >-
  Develop React Native, Flutter, or native mobile apps with modern architecture patterns.
  Masters cross-platform development, native integrations, offline sync, and app store optimization.
  Triggers on: React Native, Flutter, iOS, Android, mobile app, cross-platform.
  Coordinates with: mobile-first, mobile-design, perf-optimizer.
metadata:
  version: "2.0.0"
  category: "mobile-games"
  triggers: "React Native, Flutter, iOS, Android, mobile app"
  success_metrics: "framework selected, architecture matched, security checklist passed"
  coordinates_with: "mobile-first, mobile-design, perf-optimizer"
---

# Mobile Developer — Cross-Platform & Native Expert

> 4 frameworks. 4 architectures. 4 test levels. 6 security items. 60fps target.

---

## When to Use

| Situation | Action |
|-----------|--------|
| Choose mobile framework | Framework selection tree |
| Design app architecture | Architecture routing |
| Plan testing strategy | 4-level test plan |
| Security compliance | OWASP MASVS checklist |
| Store submission | ASO checklist |

---

## System Boundaries

| Owned by This Skill | NOT Owned |
|---------------------|-----------|
| Framework selection (4 options) | Mobile design (→ mobile-design) |
| Architecture routing (4 patterns) | Mobile orchestration (→ mobile-first) |
| Testing strategy (4 levels) | Security code review (→ mobile-security-coder) |
| Security checklist (6 items) | Performance profiling (→ perf-optimizer) |

**Expert decision skill:** Produces recommendations and checklists. Does not write code.

---

## Framework Selection (Deterministic)

| Need | Framework |
|------|-----------|
| OTA updates, rapid iteration | **React Native + Expo** |
| Pixel-perfect custom UI | **Flutter** |
| Deep iOS platform features | **SwiftUI** |
| Deep Android platform features | **Kotlin + Compose** |
| Cross-platform, no special needs | **React Native + Expo** (default) |

---

## Architecture Routing (Deterministic)

| Context | Pattern |
|---------|---------|
| Complex app + large team (6+) | **Clean Architecture** |
| UI-driven app, moderate complexity | **MVVM** |
| Complex state management | **BLoC / Redux** |
| Data abstraction needed | **Repository** |

---

## Performance Targets (Fixed)

| Target | Value |
|--------|-------|
| Animation framerate | 60fps |
| App startup (cold) | < 2,000 ms |
| List rendering | Virtualized (FlatList / ListView) |
| Memory leaks | Zero (enforce cleanup) |

---

## Platform Services

| Service | Technologies |
|---------|-------------|
| Push | FCM, APNs |
| Auth | OAuth, Biometric, Social |
| Payments | Stripe, Apple Pay, Google Pay |
| Maps | Google Maps, Apple MapKit |
| Analytics | Firebase, Sentry |

---

## Testing Strategy (4 Levels)

| Level | Tools |
|-------|-------|
| Unit | Jest, Dart test, XCTest |
| Component | React Native Testing Library |
| E2E | Detox, Maestro, Patrol |
| Device | Firebase Test Lab, Bitrise |

---

## Security Checklist (OWASP MASVS — 6 Items)

- [ ] OWASP MASVS compliance
- [ ] Certificate pinning
- [ ] Biometric authentication
- [ ] Secure storage (Keychain/Keystore)
- [ ] Code obfuscation (ProGuard/R8)
- [ ] GDPR/privacy compliance

---

## Error Taxonomy

| Code | Recoverable | Trigger |
|------|-------------|---------|
| `ERR_INVALID_REQUEST_TYPE` | No | Request type not supported |
| `ERR_UNKNOWN_PLATFORM` | Yes | Platform not ios/android/both |
| `ERR_MISSING_PLATFORM` | Yes | Platform not provided |
| `WARN_CONFLICT` | Yes | Conflicting requirements |

**Zero internal retries.** Deterministic; same context = same recommendation.

---

## Anti-Patterns

| ❌ Don't | ✅ Do |
|---------|-------|
| Pick framework without criteria | Use framework selection tree |
| Skip architecture for "simple" apps | At minimum use Repository pattern |
| Assume network availability | Design offline-first |
| Skip security for MVP | OWASP MASVS from day 1 |
| Test only on simulator | Include real device testing |

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| iOS build fails | `pod install --repo-update` |
| Android Gradle error | Check Gradle version, sync project |
| Hot reload broken | Restart Metro/Flutter, clear cache |
| Native module linking | `npx react-native link` or `flutter pub get` |
| App store rejection | Check guidelines, test on real devices |

---

## 📑 Content Map

| File | Description | When to Read |
|------|-------------|--------------|
| [engineering-spec.md](references/engineering-spec.md) | Full engineering spec | Architecture review |

---

## 🔗 Related

| Item | Type | Purpose |
|------|------|---------|
| `mobile-first` | Skill | Mobile orchestrator |
| `mobile-design` | Skill | Design patterns |
| `mobile-security-coder` | Skill | Security implementation |

---

⚡ PikaKit v3.9.100
