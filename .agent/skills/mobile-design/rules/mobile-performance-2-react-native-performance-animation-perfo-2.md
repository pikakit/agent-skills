---
"title": "Mobile Performance: React Native Performance - Animation Performance through 3. Flutter Performance - The #1
  AI Mistake: setState Overuse"
"kind": "reference"
"impact": "high"
"tags":
  - "mobile"
  - "performance"
"applies_to":
  - "android"
  - "ios"
"last_reviewed": "2026-09-28"
"sources":
  - "title": "Official documentation"
    "url": "https://www.w3.org/WAI/standards-guidelines/wcag/"
---

# Mobile Performance: React Native Performance - Animation Performance through 3. Flutter Performance - The #1 AI Mistake: setState Overuse

## Scope

Apply this guidance only to the declared platforms and repository-confirmed versions.

## Guidance

> Deep dive into React Native and Flutter performance optimization, 60fps animations, memory management, and battery considerations.
> **This file covers the #1 area where AI-generated code FAILS.**

---

## 2. React Native Performance

### Animation Performance

```javascript
// ❌ JS-driven animation (blocks JS thread)
Animated.timing(value, {
  toValue: 1,
  duration: 300,
  useNativeDriver: false, // BAD!
}).start();

// ✅ Native-driver animation (runs on UI thread)
Animated.timing(value, {
  toValue: 1,
  duration: 300,
  useNativeDriver: true, // GOOD!
}).start();

// Native driver supports ONLY:
// ├── transform (translate, scale, rotate)
// └── opacity
// 
// Does NOT support:
// ├── width, height
// ├── backgroundColor
// ├── borderRadius changes
// └── margin, padding
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
// ├── Runs on the UI thread; measure frame pacing on target devices
// ├── Can animate any property
// ├── Gesture-driven animations
// └── Worklets for complex logic
```

> Deep dive into React Native and Flutter performance optimization, 60fps animations, memory management, and battery considerations.
> **This file covers the #1 area where AI-generated code FAILS.**

---

## 2. React Native Performance

### Memory Leak Prevention

```javascript
// ❌ Memory leak: uncleared interval
useEffect(() => {
  const interval = setInterval(() => {
    fetchData();
  }, 5000);
  // Missing cleanup!
}, []);

// ✅ Proper cleanup
useEffect(() => {
  const interval = setInterval(() => {
    fetchData();
  }, 5000);
  
  return () => clearInterval(interval); // CLEANUP!
}, []);

// Common memory leak sources:
// ├── Timers (setInterval, setTimeout)
// ├── Event listeners
// ├── Subscriptions (WebSocket, PubSub)
// ├── Async operations that update state after unmount
// └── Image caching without limits
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

### 🚫 The #1 AI Mistake: setState Overuse

```dart
// ❌ WRONG: setState rebuilds ENTIRE widget tree
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
