---
"title": "Deep Linking: Flutter Configuration through Testing Deep Links"
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
  - "title": "Flutter Deep Linking"
    "url": "https://docs.flutter.dev/ui/navigation/deep-linking"
---

# Deep Linking: Flutter Configuration through Testing Deep Links

## Scope

Apply this guidance only to the declared platforms and repository-confirmed versions.

## Guidance

> **Philosophy:** Every screen should be linkable. Users expect seamless web-to-app transitions.

---

## Flutter Configuration

### GoRouter Deep Linking

```dart
final router = GoRouter(
  routes: [
    GoRoute(
      path: '/',
      builder: (context, state) => const HomeScreen(),
      routes: [
        GoRoute(
          path: 'product/:id',
          builder: (context, state) {
            final id = state.pathParameters['id']!;
            return ProductScreen(productId: id);
          },
        ),
        GoRoute(
          path: 'user/:userId',
          builder: (context, state) {
            final userId = state.pathParameters['userId']!;
            return UserScreen(userId: userId);
          },
        ),
      ],
    ),
  ],
);
```

### AndroidManifest (Flutter)

```xml
<!-- android/app/src/main/AndroidManifest.xml -->
<meta-data android:name="flutter_deeplinking_enabled" android:value="true" />

<intent-filter android:autoVerify="true">
  <action android:name="android.intent.action.VIEW" />
  <category android:name="android.intent.category.DEFAULT" />
  <category android:name="android.intent.category.BROWSABLE" />
  <data android:scheme="https" android:host="example.com" />
</intent-filter>
```

### iOS (Flutter)

Add associated domains in Xcode Runner target → Signing & Capabilities → Associated Domains: `applinks:example.com`

---

> **Philosophy:** Every screen should be linkable. Users expect seamless web-to-app transitions.

---

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

| Service | Features | Status |
|---------|----------|--------|
| **Branch.io** | Full attribution, deferred links | ✅ Active, recommended |
| **Adjust** | Analytics + attribution | ✅ Active |
| **AppsFlyer** | Marketing attribution focus | ✅ Active |
| ~~Firebase Dynamic Links~~ | ~~Free, Google ecosystem~~ | ❌ **Deprecated Aug 2025** |

### Branch.io Example

```typescript
import branch from 'react-native-branch';

// Listen for deep links
branch.subscribe(({ error, params }) => {
  if (error) return console.error(error);
  if (params['+clicked_branch_link']) {
    const productId = params.productId;
    navigation.navigate('Product', { id: productId });
  }
});

// Create deep link
const branchObject = await branch.createBranchUniversalObject('product/123', {
  title: 'Cool Product',
  contentDescription: 'Check out this product',
});

const { url } = await branchObject.generateShortUrl({
  feature: 'sharing',
  channel: 'sms',
});
```

---

> **Philosophy:** Every screen should be linkable. Users expect seamless web-to-app transitions.

---

## QR Code Deep Links

| Library | Platform | Purpose |
|---------|----------|---------|
| `react-native-qrcode-svg` | RN | Generate QR codes |
| `qr_flutter` | Flutter | Generate QR codes |
| Core Image (`CIFilter`) | iOS Native | Generate QR codes |
| `zxing` | Android | Generate/scan QR codes |

```typescript
// React Native QR generation
import QRCode from 'react-native-qrcode-svg';

<QRCode value="https://example.com/product/123" size={200} />
```

---

> **Philosophy:** Every screen should be linkable. Users expect seamless web-to-app transitions.

---

## Link Preview (OG Tags)

Universal Links display previews on social media. Add meta tags to your web pages:

```html
<meta property="og:title" content="Cool Product" />
<meta property="og:description" content="Check out this amazing product" />
<meta property="og:image" content="https://example.com/images/product.jpg" />
<meta property="og:url" content="https://example.com/product/123" />
```

---

> **Philosophy:** Every screen should be linkable. Users expect seamless web-to-app transitions.

---

## Privacy & Compliance

| Concern | Guidance |
|---------|---------|
| **ATT (iOS)** | Deep link attribution may require ATT prompt if tracking across apps |
| **GDPR** | Store referral data only with consent; honor right-to-erasure |
| **Fingerprinting** | Probabilistic matching (IP/UA) is restricted on iOS — avoid |
| **Data minimization** | Pass only necessary params in deep link URLs |

---

> **Philosophy:** Every screen should be linkable. Users expect seamless web-to-app transitions.

---

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
| Branch | Branch link debugger dashboard |

---

## Verification

Cross-check version-sensitive details with the cited official source and verify the resulting behavior in the target environment.
