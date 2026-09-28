---
"title": "Push Notifications: Platform Services through Native iOS Setup (SwiftUI)"
"kind": "reference"
"impact": "high"
"tags":
  - "push"
  - "notifications"
"applies_to":
  - "android"
  - "ios"
"last_reviewed": "2026-09-28"
"sources":
  - "title": "Android Notifications Overview"
    "url": "https://developer.android.com/develop/ui/views/notifications"
  - "title": "Apple User Notifications"
    "url": "https://developer.apple.com/documentation/usernotifications"
---

# Push Notifications: Platform Services through Native iOS Setup (SwiftUI)

## Scope

Apply this guidance only to the declared platforms and repository-confirmed versions.

## Guidance

> **Philosophy:** Respect the user's attention. Every notification should provide value.

---

## Platform Services

| Platform | Service | Transport |
|----------|---------|-----------| 
| iOS | APNs (Apple Push Notification service) | HTTP/2 |
| Android | FCM (Firebase Cloud Messaging) | HTTP v1 API |
| Cross-platform | FCM (handles both) | Recommended |

---

> **Philosophy:** Respect the user's attention. Every notification should provide value.

---

## React Native Setup (FCM)

### 1. Install

```bash
npm install @react-native-firebase/app @react-native-firebase/messaging
npm install @notifee/react-native  # Local notification display & channels
```

> **@notifee** provides local notification creation, Android channels, grouping, and foreground display — complementing FCM's remote delivery.

### 2. Request Permission

```typescript
import messaging from '@react-native-firebase/messaging';

async function requestPermission() {
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  if (enabled) {
    const token = await messaging().getToken();
    await saveTokenToServer(token);
  }
}
```

### 3. Handle Notifications

```typescript
// Foreground — display via notifee
import notifee from '@notifee/react-native';

messaging().onMessage(async remoteMessage => {
  await notifee.displayNotification({
    title: remoteMessage.notification?.title,
    body: remoteMessage.notification?.body,
    android: { channelId: 'messages' },
  });
});

// Background — app opened via notification
messaging().onNotificationOpenedApp(remoteMessage => {
  navigation.navigate(remoteMessage.data.screen);
});

// App opened from quit state
messaging().getInitialNotification().then(remoteMessage => {
  if (remoteMessage) {
    navigation.navigate(remoteMessage.data.screen);
  }
});
```

---

> **Philosophy:** Respect the user's attention. Every notification should provide value.

---

## Flutter Setup (firebase_messaging)

### 1. Install

```yaml
# pubspec.yaml
dependencies:
  firebase_core: ^latest
  firebase_messaging: ^latest
  flutter_local_notifications: ^latest
```

### 2. Request Permission & Handle

```dart
import 'package:firebase_messaging/firebase_messaging.dart';

Future<void> initPush() async {
  final messaging = FirebaseMessaging.instance;

  // Request permission
  final settings = await messaging.requestPermission(
    alert: true,
    badge: true,
    sound: true,
    provisional: false, // Set true for provisional (iOS)
  );

  if (settings.authorizationStatus == AuthorizationStatus.authorized) {
    final token = await messaging.getToken();
    await saveTokenToServer(token!);
  }

  // Foreground messages
  FirebaseMessaging.onMessage.listen((RemoteMessage message) {
    showLocalNotification(message);
  });

  // Background tap → navigate
  FirebaseMessaging.onMessageOpenedApp.listen((RemoteMessage message) {
    navigateToScreen(message.data['screen']);
  });
}

// Background handler — must be top-level function
@pragma('vm:entry-point')
Future<void> _firebaseMessagingBackgroundHandler(RemoteMessage message) async {
  await Firebase.initializeApp();
  // Handle background data
}

void main() {
  FirebaseMessaging.onBackgroundMessage(_firebaseMessagingBackgroundHandler);
  runApp(const MyApp());
}
```

---

> **Philosophy:** Respect the user's attention. Every notification should provide value.

---

## Native iOS Setup (SwiftUI)

### UNUserNotificationCenter

```swift
import UserNotifications
import FirebaseMessaging

class AppDelegate: NSObject, UIApplicationDelegate, UNUserNotificationCenterDelegate {
    func application(_ application: UIApplication,
                     didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -> Bool {
        UNUserNotificationCenter.current().delegate = self
        UNUserNotificationCenter.current().requestAuthorization(options: [.alert, .badge, .sound]) { granted, _ in
            if granted {
                DispatchQueue.main.async { application.registerForRemoteNotifications() }
            }
        }
        return true
    }

    func application(_ application: UIApplication,
                     didRegisterForRemoteNotificationsWithDeviceToken deviceToken: Data) {
        Messaging.messaging().apnsToken = deviceToken
    }

    // Foreground display
    func userNotificationCenter(_ center: UNUserNotificationCenter,
                                willPresent notification: UNNotification) async -> UNNotificationPresentationOptions {
        return [.banner, .badge, .sound]
    }

    // Tap handler
    func userNotificationCenter(_ center: UNUserNotificationCenter,
                                didReceive response: UNNotificationResponse) async {
        let data = response.notification.request.content.userInfo
        handleDeepLink(data)
    }
}

@main
struct MyApp: App {
    @UIApplicationDelegateAdaptor(AppDelegate.self) var delegate
    var body: some Scene { WindowGroup { ContentView() } }
}
```

---

## Verification

Cross-check version-sensitive details with the cited official source and verify the resulting behavior in the target environment.
