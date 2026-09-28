---
"title": "Native: Error Handling (Android) through Related Sub-Skills"
"kind": "reference"
"impact": "high"
"tags":
  - "native"
"applies_to":
  - "android"
  - "ios"
"last_reviewed": "2026-09-28"
"sources":
  - "title": "Guide to app architecture"
    "url": "https://developer.android.com/topic/architecture"
---

# Native: Error Handling (Android) through Related Sub-Skills

## Scope

Apply this guidance only to the declared platforms and repository-confirmed versions.

## Guidance

> **Philosophy:** Platform-first. Use native when you need the deepest integration.

---

## Error Handling (Android)

### Sealed Result

```kotlin
sealed class Result<out T> {
    data class Success<T>(val data: T) : Result<T>()
    data class Error(val exception: AppException) : Result<Nothing>()
}

suspend fun getUser(id: String): Result<User> {
    return try {
        val user = api.fetchUser(id)
        Result.Success(user)
    } catch (e: HttpException) {
        Result.Error(AppException.fromHttp(e))
    } catch (e: IOException) {
        Result.Error(AppException.Network(e))
    }
}
```

### Global Crash Handler

```kotlin
class App : Application() {
    override fun onCreate() {
        super.onCreate()
        Thread.setDefaultUncaughtExceptionHandler { _, throwable ->
            Firebase.crashlytics.recordException(throwable)
        }
    }
}
```

---

> **Philosophy:** Platform-first. Use native when you need the deepest integration.

---

## Accessibility (Android)

```kotlin
Button(
    onClick = { submitOrder() },
    modifier = Modifier.semantics {
        contentDescription = "Submit your order"
    }
) {
    Text("Submit")
}

// Dynamic font scaling — Material3 handles automatically
Text(
    text = "Hello",
    style = MaterialTheme.typography.bodyLarge  // Scales with system
)
```

---

> **Philosophy:** Platform-first. Use native when you need the deepest integration.

---

## Offline Patterns (Android)

| Strategy | Library | Use Case |
|----------|---------|----------|
| Key-value | DataStore | Settings, preferences |
| Database | Room | Structured data, offline-first |
| File cache | OkHttp cache | HTTP response cache |
| Work | WorkManager | Background sync |

```kotlin
// Room entity
@Entity
data class Task(
    @PrimaryKey val id: String,
    val title: String,
    val isComplete: Boolean,
    val createdAt: Long
)

@Dao
interface TaskDao {
    @Query("SELECT * FROM task ORDER BY createdAt DESC")
    fun observeAll(): Flow<List<Task>>

    @Upsert
    suspend fun upsert(task: Task)
}
```

---

> **Philosophy:** Platform-first. Use native when you need the deepest integration.

---

## Security (Android)

| Concern | Solution |
|---------|----------|
| Secrets | EncryptedSharedPreferences / Android Keystore |
| Network | Network Security Config (TLS enforcement) |
| SSL pinning | OkHttp `CertificatePinner` |
| Biometrics | BiometricPrompt API |
| Code obfuscation | R8/ProGuard (default in release) |
| Root detection | SafetyNet / Play Integrity API |

---

> **Philosophy:** Platform-first. Use native when you need the deepest integration.

---

## CI/CD (Android)

| Tool | Use Case |
|------|----------|
| GitHub Actions | `ubuntu-latest` + Gradle build |
| Fastlane | `fastlane android beta` / `release` |
| Firebase App Distribution | Internal testing |
| Play Console | Staged rollout (1% → 10% → 100%) |

---

> **Philosophy:** Platform-first. Use native when you need the deepest integration.

---

## Best Practices (Android)

| ✅ Do | ❌ Don't |
|----|-------|
| Use `remember` wisely | Remember everything |
| Hoist state up | State in leaf composables |
| Use LazyColumn | Column with many items |
| Side effects in LaunchedEffect | Side effects in composition |
| Sealed Result for errors | Generic try-catch |
| Room for persistence | Raw SharedPreferences for data |

---

> **Philosophy:** Platform-first. Use native when you need the deepest integration.

---

## Modifier Chain

```kotlin
// Order matters!
Text(
    text = "Hello",
    modifier = Modifier
        .padding(16.dp)          // Padding inside
        .background(Color.Blue)   // Background
        .padding(8.dp)            // Padding outside
        .clickable { }            // Click area
)
```

---

> **Philosophy:** Platform-first. Use native when you need the deepest integration.

---

## Cross-Platform Comparison

| Feature | SwiftUI | Compose |
|---------|---------|---------|
| UI Declaration | `var body: some View` | `@Composable fun` |
| Local State | `@State` | `remember` |
| Side Effects | `.task {}` | `LaunchedEffect` |
| Lists | `List` / `LazyVStack` | `LazyColumn` |
| Theming | Environment | MaterialTheme |
| Testing | XCTest + XCUITest | JUnit + Compose Testing |
| Error Pattern | `Result<T, AppError>` | `sealed class Result<T>` |
| Offline | SwiftData / Core Data | Room |

---

> **Philosophy:** Platform-first. Use native when you need the deepest integration.

---

## 🔗 Related Sub-Skills

| File | When to Read |
|------|-------------|
| [publishing/app-store-optimization.md](app-store-optimization-core-aso-elements.md) | Preparing for App Store / Play Store |
| [publishing/deep-linking.md](deep-linking-deep-link-types.md) | Universal links, app links |
| [publishing/push-notifications.md](push-notifications-platform-services.md) | FCM / APNs setup |

---

## Verification

Cross-check version-sensitive details with the cited official source and verify the resulting behavior in the target environment.
