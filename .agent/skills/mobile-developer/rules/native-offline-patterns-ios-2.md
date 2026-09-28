---
"title": "Native: Offline Patterns (iOS) through Testing (Android)"
"kind": "reference"
"impact": "high"
"tags":
  - "native"
"applies_to":
  - "android"
  - "ios"
"last_reviewed": "2026-09-28"
"sources":
  - "title": "Apple Developer Documentation"
    "url": "https://developer.apple.com/documentation"
---

# Native: Offline Patterns (iOS) through Testing (Android)

## Scope

Apply this guidance only to the declared platforms and repository-confirmed versions.

## Guidance

> **Philosophy:** Platform-first. Use native when you need the deepest integration.

---

## Offline Patterns (iOS)

| Strategy | Framework | Use Case |
|----------|-----------|----------|
| Key-value | UserDefaults / Keychain | Settings, tokens |
| Database | SwiftData / Core Data | Structured data |
| File cache | URLCache | HTTP response cache |
| Sync | CloudKit | iCloud sync |

```swift
// SwiftData (iOS 17+)
@Model
class Task {
    var title: String
    var isComplete: Bool
    var createdAt: Date

    init(title: String) {
        self.title = title
        self.isComplete = false
        self.createdAt = .now
    }
}
```

---

> **Philosophy:** Platform-first. Use native when you need the deepest integration.

---

## Security (iOS)

| Concern | Solution |
|---------|----------|
| Secrets | Keychain Services API |
| Network | App Transport Security (ATS) enforced |
| SSL pinning | `URLSessionDelegate` certificate validation |
| Biometrics | LocalAuthentication framework (Face ID / Touch ID) |
| Code signing | Automatic via Xcode |
| Jailbreak detection | `FileManager` checks + `canOpenURL` |

---

> **Philosophy:** Platform-first. Use native when you need the deepest integration.

---

## CI/CD (iOS)

| Tool | Use Case |
|------|----------|
| Xcode Cloud | Native CI/CD, TestFlight distribution |
| Fastlane | `fastlane ios beta` / `fastlane ios release` |
| GitHub Actions | `macos-latest` runner with `xcodebuild` |

---

> **Philosophy:** Platform-first. Use native when you need the deepest integration.

---

## Best Practices (iOS)

| ✅ Do | ❌ Don't |
|----|-------|
| Use async/await | Completion handlers |
| Prefer @Observable (iOS 17+) | @Published everywhere |
| Extract subviews | Massive body methods |
| Use ViewModifiers | Repeated styling |
| Structured error types | Generic catches |
| SwiftData for persistence | Raw UserDefaults for data |

---

# Kotlin Compose (Android)

> **Philosophy:** Platform-first. Use native when you need the deepest integration.

---

## Composable Functions

```kotlin
@Composable
fun Counter() {
    var count by remember { mutableStateOf(0) }

    Column(
        modifier = Modifier.padding(16.dp),
        verticalArrangement = Arrangement.spacedBy(8.dp)
    ) {
        Text(
            text = "Count: $count",
            style = MaterialTheme.typography.headlineLarge
        )

        Button(onClick = { count++ }) {
            Text("Increment")
        }
    }
}
```

---

> **Philosophy:** Platform-first. Use native when you need the deepest integration.

---

## State Management (Android)

| API | Use Case |
|-----|----------|
| `remember` | Survive recomposition |
| `rememberSaveable` | Survive config changes |
| `collectAsState()` | Flow to State |
| `ViewModel` | Business logic container |

### ViewModel Pattern

```kotlin
class UserViewModel : ViewModel() {
    private val _uiState = MutableStateFlow(UserUiState())
    val uiState: StateFlow<UserUiState> = _uiState.asStateFlow()

    fun loadUser(id: String) {
        viewModelScope.launch {
            _uiState.update { it.copy(isLoading = true) }
            val user = repository.getUser(id)
            _uiState.update { it.copy(user = user, isLoading = false) }
        }
    }
}

@Composable
fun UserScreen(viewModel: UserViewModel = hiltViewModel()) {
    val uiState by viewModel.uiState.collectAsState()

    if (uiState.isLoading) {
        CircularProgressIndicator()
    } else {
        Text(uiState.user?.name ?: "")
    }
}
```

---

> **Philosophy:** Platform-first. Use native when you need the deepest integration.

---

## Navigation (Android)

```kotlin
NavHost(navController = navController, startDestination = "home") {
    composable("home") { HomeScreen(navController) }
    composable(
        "user/{userId}",
        arguments = listOf(navArgument("userId") { type = NavType.StringType })
    ) { backStackEntry ->
        UserScreen(userId = backStackEntry.arguments?.getString("userId"))
    }
}

navController.navigate("user/123")
```

---

> **Philosophy:** Platform-first. Use native when you need the deepest integration.

---

## Testing (Android)

### Testing Stack

| Type | Tool | Purpose |
|------|------|---------|
| Unit | JUnit 5 + MockK | Business logic, ViewModels |
| UI | Compose UI Testing | Composable behavior |
| Integration | Espresso | Full app flows |
| Screenshot | Paparazzi | UI regression |

### Compose UI Test Example

```kotlin
@get:Rule
val composeTestRule = createComposeRule()

@Test
fun counter_increments() {
    composeTestRule.setContent { Counter() }

    composeTestRule.onNodeWithText("Count: 0").assertExists()

    composeTestRule.onNodeWithText("Increment").performClick()

    composeTestRule.onNodeWithText("Count: 1").assertExists()
}
```

### ViewModel Test Example

```kotlin
@Test
fun `loadUser updates uiState`() = runTest {
    val viewModel = UserViewModel(FakeUserRepository())

    viewModel.loadUser("123")

    val state = viewModel.uiState.first { !it.isLoading }
    assertEquals("John", state.user?.name)
}
```

---

## Verification

Cross-check version-sensitive details with the cited official source and verify the resulting behavior in the target environment.
