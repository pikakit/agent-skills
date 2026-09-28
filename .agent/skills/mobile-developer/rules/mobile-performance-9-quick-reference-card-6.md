---
"title": "Mobile Performance: Quick Reference Card"
"kind": "reference"
"impact": "high"
"tags":
  - "mobile-developer"
"applies_to":
  - "android"
  - "ios"
"last_reviewed": "2026-09-28"
"sources":
  - "title": "Android Performance Overview"
    "url": "https://developer.android.com/topic/performance"
---

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
