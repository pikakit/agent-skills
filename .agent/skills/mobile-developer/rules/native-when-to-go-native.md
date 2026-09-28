---
"title": "Native: When to Go Native through Accessibility (iOS)"
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

# Native: When to Go Native through Accessibility (iOS)

## Scope

Apply this guidance only to the declared platforms and repository-confirmed versions.

## Guidance

> **Philosophy:** Platform-first. Use native when you need the deepest integration.

---

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

> **Philosophy:** Platform-first. Use native when you need the deepest integration.

---

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

---

> **Philosophy:** Platform-first. Use native when you need the deepest integration.

---

## State Management (iOS)

| Property Wrapper | Use Case |
|-----------------|----------|
| `@State` | Local view state |
| `@Binding` | Two-way child binding |
| `@StateObject` | Own ObservableObject |
| `@ObservedObject` | Passed ObservableObject |
| `@EnvironmentObject` | Shared across hierarchy |

### Observable Pattern (iOS 17+)

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

---

> **Philosophy:** Platform-first. Use native when you need the deepest integration.

---

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

---

> **Philosophy:** Platform-first. Use native when you need the deepest integration.

---

## Testing (iOS)

### Testing Stack

| Type | Tool | Purpose |
|------|------|---------|
| Unit | XCTest | Business logic, models |
| UI | XCUITest | Full UI flows |
| Snapshot | swift-snapshot-testing | UI regression |
| Preview | Xcode Previews | Rapid iteration |

### XCTest Example

```swift
final class UserStoreTests: XCTestCase {
    func testFetchUser() async throws {
        let store = UserStore(api: MockAPI())

        await store.fetchUser()

        XCTAssertNotNil(store.currentUser)
        XCTAssertEqual(store.currentUser?.name, "John")
        XCTAssertFalse(store.isLoading)
    }
}
```

### SwiftUI View Test

```swift
func testProfileView() throws {
    let view = ProfileView()
    let inspector = try view.inspect()

    XCTAssertNoThrow(try inspector.find(text: "Profile"))
}
```

---

> **Philosophy:** Platform-first. Use native when you need the deepest integration.

---

## Error Handling (iOS)

### Structured Error Types

```swift
enum AppError: LocalizedError {
    case network(URLError)
    case decoding(DecodingError)
    case unauthorized
    case unknown(Error)

    var errorDescription: String? {
        switch self {
        case .network(let error): return "Network: \(error.localizedDescription)"
        case .decoding: return "Data format error"
        case .unauthorized: return "Session expired"
        case .unknown(let error): return error.localizedDescription
        }
    }
}
```

### Result Pattern

```swift
func fetchUser(id: String) async -> Result<User, AppError> {
    do {
        let user = try await api.getUser(id)
        return .success(user)
    } catch let error as URLError {
        return .failure(.network(error))
    } catch {
        return .failure(.unknown(error))
    }
}
```

---

> **Philosophy:** Platform-first. Use native when you need the deepest integration.

---

## Accessibility (iOS)

```swift
Button("Submit Order") {
    submitOrder()
}
.accessibilityLabel("Submit your order")
.accessibilityHint("Double tap to confirm and place order")
.accessibilityAddTraits(.isButton)

// Dynamic Type
Text("Hello")
    .font(.body)     // Scales automatically with system settings
    .dynamicTypeSize(...DynamicTypeSize.xxxLarge)  // Cap max size
```

---

## Verification

Cross-check version-sensitive details with the cited official source and verify the resulting behavior in the target environment.
