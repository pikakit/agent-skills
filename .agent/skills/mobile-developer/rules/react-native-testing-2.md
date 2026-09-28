---
"title": "React Native: Testing through CI/CD & Build"
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
