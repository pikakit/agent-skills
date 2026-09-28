---
"title": "Push Notifications: Native Android Setup (Compose) through Android Notification Channels"
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

# Push Notifications: Native Android Setup (Compose) through Android Notification Channels

## Scope

Apply this guidance only to the declared platforms and repository-confirmed versions.

## Guidance

> **Philosophy:** Respect the user's attention. Every notification should provide value.

---

## Native Android Setup (Compose)

### FirebaseMessagingService

```kotlin
class MyFirebaseMessagingService : FirebaseMessagingService() {
    override fun onNewToken(token: String) {
        saveTokenToServer(token)
    }

    override fun onMessageReceived(remoteMessage: RemoteMessage) {
        remoteMessage.notification?.let { notification ->
            showNotification(
                title = notification.title ?: "",
                body = notification.body ?: "",
                data = remoteMessage.data
            )
        }
    }

    private fun showNotification(title: String, body: String, data: Map<String, String>) {
        val intent = Intent(this, MainActivity::class.java).apply {
            putExtra("screen", data["screen"])
            flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TASK
        }

        val notification = NotificationCompat.Builder(this, "messages")
            .setSmallIcon(R.drawable.ic_notification)
            .setContentTitle(title)
            .setContentText(body)
            .setContentIntent(PendingIntent.getActivity(this, 0, intent, PendingIntent.FLAG_IMMUTABLE))
            .setAutoCancel(true)
            .build()

        NotificationManagerCompat.from(this).notify(System.currentTimeMillis().toInt(), notification)
    }
}
```

---

> **Philosophy:** Respect the user's attention. Every notification should provide value.

---

## Server-Side Sending (FCM Admin SDK)

### Node.js

```typescript
import admin from 'firebase-admin';

admin.initializeApp({
  credential: admin.credential.applicationDefault(),
});

// Send to single device
async function sendPush(token: string, title: string, body: string, data?: Record<string, string>) {
  const message: admin.messaging.Message = {
    token,
    notification: { title, body },
    data,
    android: {
      priority: 'high',
      notification: { channelId: 'messages' },
    },
    apns: {
      payload: { aps: { badge: 1, sound: 'default' } },
    },
  };

  const response = await admin.messaging().send(message);
  console.log('Sent:', response);
}

// Send to topic
async function sendToTopic(topic: string, title: string, body: string) {
  await admin.messaging().send({
    topic,
    notification: { title, body },
  });
}

// Send to multiple devices (batch)
async function sendMulticast(tokens: string[], title: string, body: string) {
  const response = await admin.messaging().sendEachForMulticast({
    tokens,
    notification: { title, body },
  });
  console.log(`${response.successCount} sent, ${response.failureCount} failed`);
}
```

### Python

```python
from firebase_admin import messaging, initialize_app

initialize_app()

message = messaging.Message(
    token="device_token",
    notification=messaging.Notification(title="Hello", body="World"),
    android=messaging.AndroidConfig(priority="high"),
    apns=messaging.APNSConfig(payload=messaging.APNSPayload(
        aps=messaging.Aps(badge=1, sound="default")
    )),
)

response = messaging.send(message)
```

---

> **Philosophy:** Respect the user's attention. Every notification should provide value.

---

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

---

> **Philosophy:** Respect the user's attention. Every notification should provide value.

---

## Android Notification Channels

Required for Android 8.0+:

```typescript
// React Native (notifee)
import notifee, { AndroidImportance } from '@notifee/react-native';

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

---

## Verification

Cross-check version-sensitive details with the cited official source and verify the resulting behavior in the target environment.
