---
"title": "Deep Linking: Deep Link Types through Expo Configuration"
"kind": "reference"
"impact": "high"
"tags":
  - "deep"
  - "linking"
"applies_to":
  - "android"
  - "ios"
"last_reviewed": "2026-09-28"
"sources":
  - "title": "Android App Links"
    "url": "https://developer.android.com/training/app-links"
  - "title": "Apple Associated Domains"
    "url": "https://developer.apple.com/documentation/xcode/supporting-associated-domains"
---

# Deep Linking: Deep Link Types through Expo Configuration

## Scope

Apply this guidance only to the declared platforms and repository-confirmed versions.

## Guidance

> **Philosophy:** Every screen should be linkable. Users expect seamless web-to-app transitions.

---

## Deep Link Types

| Type | Description | Use Case |
|------|-------------|----------|
| **URI Scheme** | `myapp://path` | App-to-app, legacy |
| **Universal Links** (iOS) | `https://example.com/path` | Web-to-app, secure |
| **App Links** (Android) | `https://example.com/path` | Web-to-app, verified |
| **Deferred Deep Links** | Works even if app not installed | Marketing campaigns |

---

> **Philosophy:** Every screen should be linkable. Users expect seamless web-to-app transitions.

---

## Universal Links (iOS)

### 1. Host AASA File

```json
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

**Host at:** `https://example.com/.well-known/apple-app-site-association`

**Critical:**
- Must be HTTPS, no redirects
- Must be valid JSON (no comments allowed)
- Content-Type: `application/json`
- File must be at root or `.well-known` path

### 2. Configure Entitlements

```xml
<!-- MyApp.entitlements -->
<key>com.apple.developer.associated-domains</key>
<array>
  <string>applinks:example.com</string>
  <string>applinks:www.example.com</string>
</array>
```

### 3. Handle in App (SwiftUI)

```swift
@main
struct MyApp: App {
    var body: some Scene {
        WindowGroup {
            ContentView()
                .onOpenURL { url in
                    DeepLinkRouter.handle(url)
                }
        }
    }
}
```

---

> **Philosophy:** Every screen should be linkable. Users expect seamless web-to-app transitions.

---

## App Links (Android)

### 1. Host assetlinks.json

```json
[{
  "relation": ["delegate_permission/common.handle_all_urls"],
  "target": {
    "namespace": "android_app",
    "package_name": "com.example.myapp",
    "sha256_cert_fingerprints": [
      "AA:BB:CC:DD:EE:FF:00:11:22:33:44:55:66:77:88:99:AA:BB:CC:DD:EE:FF:00:11:22:33:44:55:66:77:88:99"
    ]
  }
}]
```

**Host at:** `https://example.com/.well-known/assetlinks.json`

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

### 3. Handle Intent (Compose)

```kotlin
@Composable
fun DeepLinkHandler(navController: NavController) {
    val context = LocalContext.current
    val activity = context as? Activity

    LaunchedEffect(Unit) {
        activity?.intent?.data?.let { uri ->
            when {
                uri.path?.startsWith("/product/") == true -> {
                    val id = uri.lastPathSegment
                    navController.navigate("product/$id")
                }
                uri.path?.startsWith("/user/") == true -> {
                    val id = uri.lastPathSegment
                    navController.navigate("user/$id")
                }
            }
        }
    }
}
```

---

> **Philosophy:** Every screen should be linkable. Users expect seamless web-to-app transitions.

---

## React Native Configuration

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
        parse: { userId: (id: string) => id },
      },
    },
  },
};

<NavigationContainer linking={linking}>
  {/* ... */}
</NavigationContainer>
```

### Listening for Links

```typescript
import { Linking } from 'react-native';

useEffect(() => {
  const subscription = Linking.addEventListener('url', ({ url }) => {
    handleDeepLink(url);
  });

  Linking.getInitialURL().then(url => {
    if (url) handleDeepLink(url);
  });

  return () => subscription.remove();
}, []);
```

---

> **Philosophy:** Every screen should be linkable. Users expect seamless web-to-app transitions.

---

## Expo Configuration

### expo-router (Recommended)

```typescript
// app/_layout.tsx — automatic file-based deep linking
export default function RootLayout() {
  return <Stack />;
}

// app/product/[id].tsx — matches /product/:id
export default function ProductScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return <ProductDetail id={id} />;
}
```

### app.json Configuration

```json
{
  "expo": {
    "scheme": "myapp",
    "web": { "bundler": "metro" },
    "plugins": [
      ["expo-router", { "origin": "https://example.com" }]
    ],
    "ios": {
      "associatedDomains": ["applinks:example.com"]
    },
    "android": {
      "intentFilters": [{
        "action": "VIEW",
        "autoVerify": true,
        "data": [{ "scheme": "https", "host": "example.com", "pathPrefix": "/product" }],
        "category": ["BROWSABLE", "DEFAULT"]
      }]
    }
  }
}
```

---

## Verification

Cross-check version-sensitive details with the cited official source and verify the resulting behavior in the target environment.
