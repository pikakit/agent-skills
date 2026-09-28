---
"title": "Push Notifications: Notification Grouping through Opt-Out Metrics"
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

# Push Notifications: Notification Grouping through Opt-Out Metrics

## Scope

Apply this guidance only to the declared platforms and repository-confirmed versions.

## Guidance

> **Philosophy:** Respect the user's attention. Every notification should provide value.

---

## Notification Grouping

### iOS (Thread Identifier)

```json
{
  "apns": {
    "payload": {
      "aps": {
        "thread-id": "chat-123",
        "summary-arg": "John"
      }
    }
  }
}
```

### Android (Group Key)

```kotlin
NotificationCompat.Builder(this, "messages")
    .setGroup("chat_123")
    .setGroupSummary(false)
    .build()

// Summary notification
NotificationCompat.Builder(this, "messages")
    .setGroup("chat_123")
    .setGroupSummary(true)
    .setStyle(NotificationCompat.InboxStyle()
        .addLine("John: Hey!")
        .addLine("Jane: Hello!")
        .setSummaryText("2 new messages"))
    .build()
```

---

> **Philosophy:** Respect the user's attention. Every notification should provide value.

---

## iOS Rich Notifications

### Notification Service Extension

```swift
class NotificationService: UNNotificationServiceExtension {
    override func didReceive(_ request: UNNotificationRequest,
                           withContentHandler contentHandler: @escaping (UNNotificationContent) -> Void) {
        guard let bestAttempt = request.content.mutableCopy() as? UNMutableNotificationContent else { return }

        if let imageURL = request.content.userInfo["image"] as? String {
            downloadImage(imageURL) { attachment in
                bestAttempt.attachments = [attachment]
                contentHandler(bestAttempt)
            }
        }
    }
}
```

---

> **Philosophy:** Respect the user's attention. Every notification should provide value.

---

## Provisional Authorization (iOS 12+)

> Deliver notifications quietly (Notification Center only) without explicit permission prompt.

```typescript
// React Native
const authStatus = await messaging().requestPermission({
  provisional: true, // No prompt — delivers quietly
});
```

```swift
// Native iOS
UNUserNotificationCenter.current().requestAuthorization(options: [.provisional]) { granted, _ in
    // Always returns true — notifications go to Notification Center quietly
}
```

**Strategy:** Start provisional → user engages → prompt for full authorization later.

---

> **Philosophy:** Respect the user's attention. Every notification should provide value.

---

## Local & Scheduled Notifications

```typescript
// React Native (notifee)
import notifee, { TriggerType, TimestampTrigger } from '@notifee/react-native';

// Immediate local notification
await notifee.displayNotification({
  title: 'Reminder',
  body: 'Time to check in!',
  android: { channelId: 'reminders' },
});

// Scheduled notification
const trigger: TimestampTrigger = {
  type: TriggerType.TIMESTAMP,
  timestamp: Date.now() + 60 * 60 * 1000, // 1 hour from now
};

await notifee.createTriggerNotification(
  { title: 'Reminder', body: 'Time to check in!', android: { channelId: 'reminders' } },
  trigger,
);
```

---

> **Philosophy:** Respect the user's attention. Every notification should provide value.

---

## Silent Push (Background Updates)

```json
{
  "apns": {
    "payload": {
      "aps": { "content-available": 1 }
    }
  },
  "data": {
    "type": "sync",
    "resource": "messages"
  }
}
```

```typescript
messaging().setBackgroundMessageHandler(async remoteMessage => {
  await syncMessages(remoteMessage.data.resource);
});
```

---

> **Philosophy:** Respect the user's attention. Every notification should provide value.

---

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

1. **Title** — length, emojis, personalization
2. **Body** — benefit-focused vs action-focused
3. **Timing** — morning vs evening
4. **Frequency** — daily vs weekly

---

> **Philosophy:** Respect the user's attention. Every notification should provide value.

---

## Privacy & Compliance

| Requirement | Detail |
|-------------|--------|
| **iOS permission** | Required before any push (except provisional) |
| **Android 13+** | `POST_NOTIFICATIONS` runtime permission required |
| **GDPR** | Consent before marketing notifications; unsubscribe mechanism |
| **CAN-SPAM** | Commercial push must allow opt-out |
| **ATT** | Not required for push itself, but needed if tracking attribution |
| **Token storage** | Encrypt device tokens at rest; delete on user account deletion |

---

> **Philosophy:** Respect the user's attention. Every notification should provide value.

---

## Opt-Out Metrics

| Metric | Warning Threshold |
|--------|-------------------|
| Opt-out rate | > 5% per campaign |
| Uninstall after notification | > 1% |
| Click-through rate | < 2% |

---

## Verification

Cross-check version-sensitive details with the cited official source and verify the resulting behavior in the target environment.
