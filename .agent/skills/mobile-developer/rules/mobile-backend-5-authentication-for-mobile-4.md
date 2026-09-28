---
"title": "Mobile Backend: Authentication for Mobile through 7. Media & Binary Handling"
"kind": "reference"
"impact": "high"
"tags":
  - "mobile"
  - "backend"
"applies_to":
  - "android"
  - "ios"
"last_reviewed": "2026-09-28"
"sources":
  - "title": "Android Authentication"
    "url": "https://developer.android.com/privacy-and-security/authenticating"
---

# Mobile Backend: Authentication for Mobile through 7. Media & Binary Handling

## Scope

Apply this guidance only to the declared platforms and repository-confirmed versions.

## Guidance

> **This file covers backend/API patterns SPECIFIC to mobile clients.**
> Generic backend patterns are in `nodejs-best-practices` and `api-patterns`.
> **Mobile backend is NOT the same as web backend. Different constraints, different patterns.**

---

## 5. Authentication for Mobile

### Token Strategy

```
ACCESS TOKEN:
├── Short-lived (15 min - 1 hour)
├── Stored in memory (not persistent)
├── Used for API requests
└── Refresh when expired

REFRESH TOKEN:
├── Long-lived (30-90 days)
├── Stored in SecureStore/Keychain
├── Used only to get new access token
└── Rotate on each use (security)

DEVICE TOKEN:
├── Identifies this device
├── Allows "log out all devices"
├── Stored alongside refresh token
└── Server tracks active devices
```

### Silent Re-authentication

```
REQUEST FLOW:
├── Make request with access token
├── 401 Unauthorized?
│   ├── Have refresh token?
│   │   ├── Yes → Call /auth/refresh
│   │   │   ├── Success → Retry original request
│   │   │   └── Failure → Force logout
│   │   └── No → Force logout
│   └── Token just expired (not invalid)
│       └── Auto-refresh, user doesn't notice
└── Success → Continue
```

---

> **This file covers backend/API patterns SPECIFIC to mobile clients.**
> Generic backend patterns are in `nodejs-best-practices` and `api-patterns`.
> **Mobile backend is NOT the same as web backend. Different constraints, different patterns.**

---

## 6. Error Handling for Mobile

### Mobile-Specific Error Format

```json
{
  "error": {
    "code": "PAYMENT_DECLINED",
    "message": "Your payment was declined",
    "user_message": "Please check your card details or try another payment method",
    "action": {
      "type": "navigate",
      "destination": "payment_methods"
    },
    "retry": {
      "allowed": true,
      "after_seconds": 5
    }
  }
}
```

### Error Categories

| Code Range | Category | Mobile Handling |
|------------|----------|-----------------|
| 400-499 | Client error | Show message, user action needed |
| 401 | Auth expired | Silent refresh or re-login |
| 403 | Forbidden | Show upgrade/permission screen |
| 404 | Not found | Remove from local cache |
| 409 | Conflict | Show sync conflict UI |
| 429 | Rate limit | Retry after header, backoff |
| 500-599 | Server error | Retry with backoff, show "try later" |
| Network | No connection | Use cached data, queue for sync |

---

> **This file covers backend/API patterns SPECIFIC to mobile clients.**
> Generic backend patterns are in `nodejs-best-practices` and `api-patterns`.
> **Mobile backend is NOT the same as web backend. Different constraints, different patterns.**

---

## 7. Media & Binary Handling

### Image Optimization

```
CLIENT REQUEST:
GET /images/{id}?w=400&h=300&q=80&format=webp

SERVER RESPONSE:
├── Resize on-the-fly OR use CDN
├── WebP for Android (smaller)
├── HEIC for iOS 14+ (if supported)
├── JPEG fallback
└── Cache-Control: max-age=31536000
```

### Chunked Upload (Large Files)

```
UPLOAD FLOW:
1. POST /uploads/init
   { filename, size, mime_type }
   → { upload_id, chunk_size }

2. PUT /uploads/{upload_id}/chunks/{n}
   → Upload each chunk (1-5 MB)
   → Can resume if interrupted

3. POST /uploads/{upload_id}/complete
   → Server assembles chunks
   → Return final file URL
```

### Streaming Audio/Video

```
REQUIREMENTS:
├── HLS (HTTP Live Streaming) for iOS
├── DASH or HLS for Android
├── Multiple quality levels (adaptive bitrate)
├── Range request support (seeking)
└── Offline download chunks

ENDPOINTS:
GET /media/{id}/manifest.m3u8  → HLS manifest
GET /media/{id}/segment_{n}.ts → Video segment
GET /media/{id}/download       → Full file for offline
```

---

## Verification

Cross-check version-sensitive details with the cited official source and verify the resulting behavior in the target environment.
