---
name: react-native-patterns
description: React Native and Expo best practices, navigation patterns, and performance optimization
---

# React Native Patterns

> **Philosophy:** JavaScript bridge efficiency. Native-first thinking. Expo when possible.

## Framework Decision

| Scenario | Recommendation |
|----------|----------------|
| Rapid prototyping | Expo managed workflow |
| OTA updates needed | Expo EAS Update |
| Deep native modules | Bare workflow + native code |
| Existing native app | React Native for specific screens |

## Navigation Patterns

### React Navigation (Standard)

```typescript
// Stack + Tab hybrid (most common)
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
    screens: {
      Home: 'home',
      Profile: 'user/:id',
    },
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

## State Management

| Complexity | Solution | When |
|------------|----------|------|
| Simple | React Context + useReducer | < 5 screens |
| Medium | Zustand | Cross-component, persistent |
| Complex | TanStack Query + Zustand | API-heavy apps |
| Offline-first | WatermelonDB | Large datasets, sync |

## Performance Optimization

### Critical Rules

1. **Avoid inline functions in render**
   ```typescript
   // ❌ Bad - creates new function every render
   <Button onPress={() => handlePress(id)} />
   
   // ✅ Good - stable reference
   const handleItemPress = useCallback(() => handlePress(id), [id]);
   <Button onPress={handleItemPress} />
   ```

2. **Use FlashList for large lists**
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

### Bridge Optimization

| Avoid | Prefer |
|-------|--------|
| Frequent bridge calls | Batch operations |
| Large JSON over bridge | Native modules for heavy data |
| Synchronous native calls | Async operations |

## Expo-Specific Patterns

### EAS Build + Update

```bash
# Development build
eas build --profile development --platform ios

# OTA update (no app store)
eas update --branch production --message "Bug fix"
```

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

## Anti-Patterns

| Don't | Do |
|-------|-----|
| Use `index` as key in lists | Use unique IDs |
| Store large data in AsyncStorage | Use SQLite/WatermelonDB |
| Ignore Hermes | Enable Hermes for performance |
| Mix business logic in components | Separate hooks/services |
