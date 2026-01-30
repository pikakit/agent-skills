---
name: push-notifications
description: FCM (Firebase Cloud Messaging), APNs (Apple Push Notification service), and notification strategies
---

# Push Notifications

> **Philosophy:** Respect the user's attention. Every notification should provide value.

## Platform Services

| Platform | Service | Transport |
|----------|---------|-----------|
| iOS | APNs (Apple Push Notification service) | HTTP/2 |
| Android | FCM (Firebase Cloud Messaging) | HTTP v1 API |
| Cross-platform | FCM (handles both) | Recommended |

## FCM Setup (Cross-Platform)

### 1. Project Configuration

```bash
# React Native
npm install @react-native-firebase/app @react-native-firebase/messaging
```

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
    // Send token to your server
    await saveTokenToServer(token);
  }
}
```

### 3. Handle Notifications

```typescript
// Foreground
messaging().onMessage(async remoteMessage => {
  // Show local notification or update UI
  displayLocalNotification(remoteMessage);
});

// Background/Quit → App opened via notification
messaging().onNotificationOpenedApp(remoteMessage => {
  // Navigate to relevant screen
  navigation.navigate(remoteMessage.data.screen);
});

// App opened from quit state
messaging()
  .getInitialNotification()
  .then(remoteMessage => {
    if (remoteMessage) {
      navigation.navigate(remoteMessage.data.screen);
    }
  });
```

## Notification Payload

### Data vs Notification Message

| Type | Behavior | When to Use |
|------|----------|-------------|
| **Notification** | System shows automatically | Simple alerts |
| **Data** | App handles in code | Custom handling, silent updates |
| **Both** | Notification shown, data accessible | Most common |

### Payload Structure

```json
{
  "message": {
    "token": "device_token_here",
    "notification": {
      "title": "New Message",
      "body": "You have a new message from John"
    },
    "data": {
      "screen": "chat",
      "chatId": "123",
      "senderId": "user_456"
    },
    "android": {
      "priority": "high",
      "notification": {
        "channel_id": "messages",
        "click_action": "OPEN_CHAT"
      }
    },
    "apns": {
      "payload": {
        "aps": {
          "badge": 1,
          "sound": "default",
          "category": "MESSAGE"
        }
      }
    }
  }
}
```

## Android Notification Channels

Required for Android 8.0+:

```typescript
// Create channel on app start
import notifee from '@notifee/react-native';

async function createChannels() {
  await notifee.createChannel({
    id: 'messages',
    name: 'Messages',
    importance: AndroidImportance.HIGH,
    sound: 'default',
    vibration: true,
  });
  
  await notifee.createChannel({
    id: 'promotions',
    name: 'Promotions',
    importance: AndroidImportance.LOW,
  });
}
```

## iOS Rich Notifications

### Notification Service Extension

```swift
// NotificationService.swift
class NotificationService: UNNotificationServiceExtension {
    override func didReceive(_ request: UNNotificationRequest,
                           withContentHandler contentHandler: @escaping (UNNotificationContent) -> Void) {
        guard let bestAttempt = request.content.mutableCopy() as? UNMutableNotificationContent else { return }
        
        // Download and attach image
        if let imageURL = request.content.userInfo["image"] as? String {
            downloadImage(imageURL) { attachment in
                bestAttempt.attachments = [attachment]
                contentHandler(bestAttempt)
            }
        }
    }
}
```

## Engagement Best Practices

### When to Send

| Good Timing | Bad Timing |
|-------------|------------|
| User's active hours (analyze data) | 3 AM |
| After meaningful event | Random promotional |
| Time-sensitive info | Same message daily |
| Personalized content | Generic blast |

### Segmentation

| Segment | Strategy |
|---------|----------|
| New users (0-7 days) | Onboarding tips |
| Active users | New features, achievements |
| Dormant users (7+ days) | Re-engagement, incentives |
| Power users | Early access, feedback requests |

### A/B Testing Elements

1. **Title** - Test length, emojis, personalization
2. **Body** - Benefit-focused vs action-focused
3. **Timing** - Morning vs evening
4. **Frequency** - Daily vs weekly

## Opt-Out Metrics

Track and act on:

| Metric | Warning Threshold |
|--------|-------------------|
| Opt-out rate | > 5% per campaign |
| Uninstall after notification | > 1% |
| Click-through rate | < 2% |

## Silent Push (Background Updates)

```json
// iOS
{
  "aps": {
    "content-available": 1
  },
  "data": {
    "type": "sync",
    "resource": "messages"
  }
}
```

```typescript
// Handle silent push
messaging().setBackgroundMessageHandler(async remoteMessage => {
  // Update local database
  await syncMessages(remoteMessage.data.resource);
});
```

## Common Anti-Patterns

| Don't | Do |
|-------|-----|
| Ask permission immediately | Ask after user sees value |
| Send same notification to all | Segment and personalize |
| Only promotional content | Mix value + promotional |
| Ignore opt-out signals | Reduce frequency for disengaged |
| Deep link to home screen | Deep link to relevant content |
