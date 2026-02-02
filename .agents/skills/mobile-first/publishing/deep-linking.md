---
name: deep-linking
description: Universal Links (iOS), App Links (Android), and deferred deep linking patterns
---

# Deep Linking

> **Philosophy:** Every screen should be linkable. Users expect seamless web-to-app transitions.

## Deep Link Types

| Type | Description | Use Case |
|------|-------------|----------|
| **URI Scheme** | `myapp://path` | App-to-app, legacy |
| **Universal Links** (iOS) | `https://example.com/path` | Web-to-app, secure |
| **App Links** (Android) | `https://example.com/path` | Web-to-app, verified |
| **Deferred Deep Links** | Works even if app not installed | Marketing campaigns |

## Universal Links (iOS)

### 1. Host AASA File

```json
// https://example.com/.well-known/apple-app-site-association
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

**Critical:**
- Must be HTTPS
- Must be valid JSON (no comments)
- Content-Type: `application/json`
- No redirects

### 2. Configure Entitlements

```xml
<!-- MyApp.entitlements -->
<key>com.apple.developer.associated-domains</key>
<array>
  <string>applinks:example.com</string>
  <string>applinks:www.example.com</string>
</array>
```

### 3. Handle in App

```swift
// SwiftUI
.onOpenURL { url in
    handleDeepLink(url)
}

// UIKit
func application(_ application: UIApplication,
                 continue userActivity: NSUserActivity,
                 restorationHandler: @escaping ([UIUserActivityRestoring]?) -> Void) -> Bool {
    guard let url = userActivity.webpageURL else { return false }
    return handleDeepLink(url)
}
```

## App Links (Android)

### 1. Host assetlinks.json

```json
// https://example.com/.well-known/assetlinks.json
[{
  "relation": ["delegate_permission/common.handle_all_urls"],
  "target": {
    "namespace": "android_app",
    "package_name": "com.example.myapp",
    "sha256_cert_fingerprints": [
      "AA:BB:CC:DD:..." 
    ]
  }
}]
```

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

### 3. Handle Intent

```kotlin
override fun onCreate(savedInstanceState: Bundle?) {
    super.onCreate(savedInstanceState)
    intent?.data?.let { uri ->
        handleDeepLink(uri)
    }
}
```

## React Native Configuration

### react-native-linking

```typescript
import { Linking } from 'react-native';

// Listen for links
useEffect(() => {
  const subscription = Linking.addEventListener('url', ({ url }) => {
    handleDeepLink(url);
  });
  
  // Handle app opened from link
  Linking.getInitialURL().then(url => {
    if (url) handleDeepLink(url);
  });
  
  return () => subscription.remove();
}, []);
```

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
        parse: {
          userId: (id: string) => id,
        },
      },
    },
  },
};

<NavigationContainer linking={linking}>
  {/* ... */}
</NavigationContainer>
```

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

| Service | Features |
|---------|----------|
| **Branch.io** | Full attribution, deferred links |
| **Firebase Dynamic Links** | Free, Google ecosystem |
| **AppsFlyer** | Marketing attribution focus |
| **Adjust** | Analytics + attribution |

### Firebase Example

```typescript
import dynamicLinks from '@react-native-firebase/dynamic-links';

// Create link
const link = await dynamicLinks().buildShortLink({
  link: 'https://example.com/product/123',
  domainUriPrefix: 'https://example.page.link',
  android: { packageName: 'com.example.myapp' },
  ios: { bundleId: 'com.example.myapp' },
});

// Handle on app open
dynamicLinks()
  .getInitialLink()
  .then(link => {
    if (link) {
      handleDeepLink(link.url);
    }
  });
```

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

## Common Issues

| Issue | Cause | Fix |
|-------|-------|-----|
| Links open in browser | AASA/assetlinks not found | Check file hosting |
| Intermittent failures | Caching | Clear link cache, reinstall |
| Only works on some links | Path matching wrong | Check path patterns |
| Doesn't work after install | Deferred linking not set up | Use Branch/Firebase |
