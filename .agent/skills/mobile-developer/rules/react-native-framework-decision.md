---
"title": "React Native: Framework Decision through Performance Optimization"
"kind": "reference"
"impact": "high"
"tags":
  - "react"
  - "native"
"applies_to":
  - "android"
  - "ios"
"last_reviewed": "2026-09-28"
"sources":
  - "title": "React Documentation"
    "url": "https://react.dev/learn"
  - "title": "Vitest Testing Guide"
    "url": "https://vitest.dev/guide/"
---

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
