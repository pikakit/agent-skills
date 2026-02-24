---
description: Mobile app development workflow with React Native/Flutter/Native. Full lifecycle from requirements to app store.
---

# /mobile - Mobile App Development

$ARGUMENTS

---

## Purpose

Orchestrates mobile app development from concept to app store. Supports React Native, Flutter, and native iOS/Android. Includes push notifications, deep linking, offline sync, CI/CD pipeline, and analytics.

---

## 🤖 Meta-Agents Integration

| Phase | Agent | Action |
|-------|-------|--------|
| **Requirements** | `assessor` | Evaluate platform and framework risks |
| **Checkpoint** | `recovery` | Save state before major changes |
| **Implementation** | `orchestrator` | Coordinate parallel tasks |
| **Post-Build** | `learner` | Log mobile patterns for reuse |

---

## Phase 1: Requirements

1. **Ask critical questions:**

   | Question | Options | Impact |
   |----------|---------|--------|
   | Platform? | iOS / Android / Both | Build pipeline |
   | Framework? | React Native / Flutter / Native | Architecture |
   | Navigation? | Tabs / Drawer / Stack | UX pattern |
   | Offline? | Required / Nice-to-have / No | Sync architecture |
   | Devices? | Phone / Tablet / Both | Layout strategy |

2. **Calculate MFRI** (Mobile Feasibility Risk Index) from `mobile-design/SKILL.md`. MFRI < 3 → Redesign.

---

## Phase 2: Design & Architecture

3. **Load:** `.agent/skills/mobile-design/SKILL.md`

4. **Platform conventions:**

   | Aspect | iOS | Android |
   |--------|-----|---------|
   | Font | SF Pro | Roboto |
   | Touch target | ≥44pt | ≥48dp |
   | Back | Edge swipe | System back |
   | Navigation | Tab bar (bottom) | Bottom nav / drawer |

---

## Phase 3: Implementation

5. **Initialize project:**

   | Framework | Command |
   |-----------|---------|
   | React Native | `npx create-expo-app@latest ./` |
   | Flutter | `flutter create .` |
   | iOS Native | SwiftUI project |
   | Android | Kotlin + Compose |

6. **Performance patterns:**
   - Lists: FlatList/FlashList (NEVER ScrollView for lists)
   - Memoization: React.memo + useCallback / const widgets
   - Images: Lazy load, cache, progressive quality
   - Navigation: Lazy screens, pre-fetch next screen data

---

## Phase 4: Push Notifications

7. **Setup push infrastructure:**

   | Platform | Service | Package |
   |----------|---------|---------|
   | iOS | APNs | `@notifee/react-native` / firebase_messaging |
   | Android | FCM | `@react-native-firebase/messaging` / firebase_messaging |
   | Cross-platform | OneSignal | `onesignal-expo-plugin` |

8. **Push notification checklist:**
   - [ ] Permission request (show value before asking)
   - [ ] Foreground + background + killed state handling
   - [ ] Deep link from notification tap
   - [ ] Badge count management
   - [ ] Notification channels (Android)
   - [ ] Rich notifications (images, actions)

---

## Phase 5: Deep Linking

9. **Universal/App Links setup:**

   | Platform | Config | Domain |
   |----------|--------|--------|
   | iOS | `apple-app-site-association` | `/.well-known/` |
   | Android | `assetlinks.json` | `/.well-known/` |
   | Expo | `app.json` → scheme + intentFilters | Custom scheme |

10. **Link routing patterns:**
    ```
    myapp://product/123     → ProductScreen(id=123)
    myapp://profile         → ProfileScreen
    https://app.com/invite  → InviteFlow (deferred deep link)
    ```

---

## Phase 6: Offline Sync

11. **Offline architecture:**

    | Pattern | Use When |
    |---------|----------|
    | **Cache-first** | Read-heavy, eventual consistency OK |
    | **Optimistic UI** | Writes need instant feedback |
    | **Queue + retry** | Writes must not be lost |
    | **CRDT** | Multi-device conflict resolution |

12. **Offline checklist:**
    - [ ] Local database (SQLite / WatermelonDB / Hive)
    - [ ] Sync queue for pending writes
    - [ ] Conflict resolution strategy (last-write-wins / merge)
    - [ ] Connectivity listener (online/offline banner)
    - [ ] Background sync (when connection restored)

---

## Phase 7: Security

13. **Load:** `.agent/skills/mobile-security-coder/SKILL.md`

    - [ ] Secure storage (Keychain / Keystore)
    - [ ] Certificate pinning
    - [ ] Biometric auth (Face ID / fingerprint)
    - [ ] No sensitive data in logs
    - [ ] Root/jailbreak detection

---

## Phase 8: CI/CD & App Store

14. **Mobile CI/CD pipeline:**

    | Tool | Purpose |
    |------|---------|
    | **EAS Build** (Expo) | Cloud builds, OTA updates |
    | **Fastlane** | Automate screenshots, signing, upload |
    | **GitHub Actions** | CI pipeline, automated testing |
    | **App Center** | Distribution, crash reporting |

15. **Store submission checklist:**

    | iOS App Store | Google Play |
    |--------------|-------------|
    | Privacy labels | Target current SDK |
    | Screenshots (all sizes) | 64-bit build |
    | App Transport Security | App bundle (AAB) |
    | TestFlight beta | Internal testing track |

---

## Phase 9: Analytics & Monitoring

16. **Analytics integration:**

    | Tool | Purpose |
    |------|---------|
    | **Firebase Analytics** | Events, funnels, retention |
    | **Crashlytics** | Crash reporting, ANR detection |
    | **Amplitude/Mixpanel** | Product analytics, cohorts |
    | **Sentry** | Error tracking, performance |

17. **Key metrics to track:**
    - DAU/MAU, retention (D1/D7/D30)
    - Crash-free rate (target: >99.5%)
    - App startup time (target: <2s cold start)
    - Screen load times, API latency

---

## Anti-Patterns

| ❌ Don't | ✅ Do |
|----------|-------|
| ScrollView for long lists | FlatList / FlashList |
| Ask notification permission on launch | Show value, then ask |
| Ignore offline | Design for bad connectivity |
| Skip deep linking | Deep link from day one |

---

## 🔗 Workflow Chain

**Skills (4):** `mobile-first` · `mobile-developer` · `mobile-design` · `mobile-security-coder`

| After /mobile | Run | Purpose |
|---------------|-----|---------|
| Need testing | `/validate` | Mobile tests |
| Performance | `/optimize` | Profiling |
| Ready to ship | `/launch` | Store submission |

---

**Version:** 2.0.0 · **Updated:** v3.9.64
