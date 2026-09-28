---
"title": "Mobile Performance: The Mobile Performance Mindset through 2. React Native Performance - FlashList: The Better Option"
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
├── Unlimited power               ├── Battery matters
├── Abundant RAM                  ├── RAM is shared, limited
├── Stable network                ├── Network is unreliable
├── CPU always available          ├── CPU throttles when hot
└── User expects fast anyway      └── User expects INSTANT
```

### Performance Budget Concept

```
Every frame must complete in:
├── 60fps → 16.67ms per frame
├── 120fps (ProMotion) → 8.33ms per frame

If your code takes longer:
├── Frame drops → Janky scroll/animation
├── User perceives as "slow" or "broken"
└── They WILL uninstall your app
```

---

> Deep dive into React Native and Flutter performance optimization, 60fps animations, memory management, and battery considerations.
> **This file covers the #1 area where AI-generated code FAILS.**

---

## 2. React Native Performance

### 🚫 The #1 AI Mistake: ScrollView for Lists

```javascript
// ❌ NEVER DO THIS - AI's favorite mistake
<ScrollView>
  {items.map(item => (
    <ItemComponent key={item.id} item={item} />
  ))}
</ScrollView>

// Why it's catastrophic:
// ├── Renders ALL items immediately (1000 items = 1000 renders)
// ├── Memory explodes
// ├── Initial render takes seconds
// └── Scroll becomes janky

// ✅ ALWAYS USE FlatList
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
// ✅ CORRECT: All optimizations applied

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
| `React.memo` | Re-render on parent change | 🔴 Critical |
| `useCallback renderItem` | New function every render | 🔴 Critical |
| Stable `keyExtractor` | Wrong item recycling | 🔴 Critical |
| `getItemLayout` | Async layout calculation | 🟡 High |
| `removeClippedSubviews` | Memory from off-screen | 🟡 High |
| `maxToRenderPerBatch` | Blocking main thread | 🟢 Medium |
| `windowSize` | Memory usage | 🟢 Medium |

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
// ├── Faster recycling
// ├── Better memory management
// ├── Simpler API
// └── Fewer optimization props needed
```

## Verification

Cross-check version-sensitive details with the cited official source and verify the resulting behavior in the target environment.
