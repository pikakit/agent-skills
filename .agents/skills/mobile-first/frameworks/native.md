---
name: native-patterns
description: SwiftUI (iOS) and Kotlin Compose (Android) native development patterns
---

# Native Development Patterns

> **Philosophy:** Platform-first. Use native when you need the deepest integration.

## When to Go Native

| Scenario | Recommendation |
|----------|----------------|
| Camera/AR heavy | Native |
| Complex animations | Native |
| System integrations | Native |
| Performance critical | Native |
| Rapid cross-platform | Flutter/RN |

---

# SwiftUI (iOS)

## View Hierarchy

```swift
struct ContentView: View {
    @State private var count = 0
    
    var body: some View {
        VStack(spacing: 16) {
            Text("Count: \(count)")
                .font(.largeTitle)
            
            Button("Increment") {
                count += 1
            }
            .buttonStyle(.borderedProminent)
        }
        .padding()
    }
}
```

## State Management

| Property Wrapper | Use Case |
|-----------------|----------|
| `@State` | Local view state |
| `@Binding` | Two-way child binding |
| `@StateObject` | Own ObservableObject |
| `@ObservedObject` | Passed ObservableObject |
| `@EnvironmentObject` | Shared across hierarchy |

### Observable Pattern

```swift
@Observable
class UserStore {
    var currentUser: User?
    var isLoading = false
    
    func fetchUser() async {
        isLoading = true
        currentUser = await api.getUser()
        isLoading = false
    }
}

// Usage
struct ProfileView: View {
    @State private var store = UserStore()
    
    var body: some View {
        if store.isLoading {
            ProgressView()
        } else {
            Text(store.currentUser?.name ?? "")
        }
    }
}
```

## Navigation (iOS 16+)

```swift
struct ContentView: View {
    @State private var path = NavigationPath()
    
    var body: some View {
        NavigationStack(path: $path) {
            List(items) { item in
                NavigationLink(value: item) {
                    Text(item.title)
                }
            }
            .navigationDestination(for: Item.self) { item in
                DetailView(item: item)
            }
        }
    }
}
```

## Best Practices

| Do | Don't |
|----|-------|
| Use async/await | Completion handlers |
| Prefer @Observable | @Published everywhere |
| Extract subviews | Massive body methods |
| Use ViewModifiers | Repeated styling |

---

# Kotlin Compose (Android)

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

## State Management

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

## Navigation

```kotlin
// NavHost setup
NavHost(navController = navController, startDestination = "home") {
    composable("home") { HomeScreen(navController) }
    composable(
        "user/{userId}",
        arguments = listOf(navArgument("userId") { type = NavType.StringType })
    ) { backStackEntry ->
        UserScreen(userId = backStackEntry.arguments?.getString("userId"))
    }
}

// Navigate
navController.navigate("user/123")
```

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

## Best Practices

| Do | Don't |
|----|-------|
| Use `remember` wisely | Remember everything |
| Hoist state up | State in leaf composables |
| Use LazyColumn | Column with many items |
| Side effects in LaunchedEffect | Side effects in composition |

---

## Cross-Platform Comparison

| Feature | SwiftUI | Compose |
|---------|---------|---------|
| UI Declaration | `var body: some View` | `@Composable fun` |
| Local State | `@State` | `remember` |
| Side Effects | `.task {}` | `LaunchedEffect` |
| Lists | `List` / `LazyVStack` | `LazyColumn` |
| Theming | Environment | MaterialTheme |
