---
"title": "Flutter: Performance Optimization through Security"
"kind": "reference"
"impact": "high"
"tags":
  - "flutter"
"applies_to":
  - "android"
  - "ios"
"last_reviewed": "2026-09-28"
"sources":
  - "title": "Flutter performance best practices"
    "url": "https://docs.flutter.dev/perf/best-practices"
---

# Flutter: Performance Optimization through Security

## Scope

Apply this guidance only to the declared platforms and repository-confirmed versions.

## Guidance

> **Philosophy:** Everything is a widget. Composition over inheritance. Dart-first.

---

## Performance Optimization

### const Constructors

```dart
// ✅ Good — const prevents rebuilds
const Padding(
  padding: EdgeInsets.all(16),
  child: Text('Hello'),
)

class MyIcon extends StatelessWidget {
  const MyIcon({super.key}); // const constructor
}
```

### ListView Optimization

```dart
// ✅ Good — lazy loading
ListView.builder(
  itemCount: items.length,
  itemBuilder: (context, index) => ItemTile(item: items[index]),
)

// ❌ Bad — loads all at once
ListView(
  children: items.map((i) => ItemTile(item: i)).toList(),
)
```

### Image Caching

```dart
CachedNetworkImage(
  imageUrl: url,
  placeholder: (context, url) => CircularProgressIndicator(),
  errorWidget: (context, url, error) => Icon(Icons.error),
)
```

---

> **Philosophy:** Everything is a widget. Composition over inheritance. Dart-first.

---

## Testing

### Testing Stack

| Type | Tool | Purpose |
|------|------|---------|
| Unit | `flutter_test` | Business logic, models |
| Widget | `flutter_test` + `mocktail` | UI components |
| Integration | `integration_test` | Full app flows |
| Golden | `golden_toolkit` | UI regression screenshots |

### Widget Test Example

```dart
testWidgets('Counter increments', (tester) async {
  await tester.pumpWidget(const MaterialApp(home: CounterPage()));

  expect(find.text('0'), findsOneWidget);

  await tester.tap(find.byIcon(Icons.add));
  await tester.pump();

  expect(find.text('1'), findsOneWidget);
});
```

### Riverpod Test Example

```dart
test('fetchUsers returns list', () async {
  final container = ProviderContainer(overrides: [
    apiClientProvider.overrideWithValue(MockApiClient()),
  ]);

  final users = await container.read(fetchUsersProvider.future);
  expect(users, isNotEmpty);
  expect(users.first.name, equals('John'));
});
```

---

> **Philosophy:** Everything is a widget. Composition over inheritance. Dart-first.

---

## Error Handling

### Global Error Handler

```dart
void main() {
  FlutterError.onError = (details) {
    FirebaseCrashlytics.instance.recordFlutterFatalError(details);
  };

  PlatformDispatcher.instance.onError = (error, stack) {
    FirebaseCrashlytics.instance.recordError(error, stack, fatal: true);
    return true;
  };

  runApp(const MyApp());
}
```

### Result Type Pattern

```dart
sealed class Result<T> {
  const Result();
}
class Success<T> extends Result<T> {
  final T data;
  const Success(this.data);
}
class Failure<T> extends Result<T> {
  final AppException error;
  const Failure(this.error);
}

// Usage
Future<Result<User>> getUser(String id) async {
  try {
    final user = await api.fetchUser(id);
    return Success(user);
  } on DioException catch (e) {
    return Failure(AppException.fromDio(e));
  }
}
```

---

> **Philosophy:** Everything is a widget. Composition over inheritance. Dart-first.

---

## Accessibility

| Element | Implementation |
|---------|---------------|
| Labels | `Semantics(label: 'Submit order', child: ...)` |
| Exclude | `ExcludeSemantics(child: decorativeIcon)` |
| Merge | `MergeSemantics(child: row)` |
| Custom actions | `SemanticsAction.tap`, `.scrollUp` |
| Focus order | `FocusTraversalOrder` |

### Dynamic Type

```dart
// Respect system text scale
final textScale = MediaQuery.textScaleFactorOf(context);

// Use relative sizes
Text('Hello', style: Theme.of(context).textTheme.bodyLarge)
```

### Testing A11y

```dart
testWidgets('has correct semantics', (tester) async {
  await tester.pumpWidget(const MyApp());
  final semantics = tester.getSemantics(find.byType(SubmitButton));
  expect(semantics.label, 'Submit order');
});
```

---

> **Philosophy:** Everything is a widget. Composition over inheritance. Dart-first.

---

## Offline Patterns

| Strategy | Package | Use Case |
|----------|---------|----------|
| API cache | `dio_cache_interceptor` | HTTP response caching |
| Key-value | `hive` / `shared_preferences` | Settings, tokens |
| Relational | `drift` (SQLite) | Complex queries, offline-first |
| Sync | `brick_offline_first` | Bi-directional sync |

### Connectivity-Aware Pattern

```dart
final connectivityProvider = StreamProvider<bool>((ref) {
  return Connectivity().onConnectivityChanged.map(
    (result) => result != ConnectivityResult.none,
  );
});

// In widget
final isOnline = ref.watch(connectivityProvider).valueOrNull ?? true;
if (!isOnline) showOfflineBanner();
```

---

> **Philosophy:** Everything is a widget. Composition over inheritance. Dart-first.

---

## Security

| Concern | Solution |
|---------|----------|
| Secrets storage | `flutter_secure_storage` (Keychain/Keystore) |
| API keys | `--dart-define=KEY=value` (compile-time) |
| SSL pinning | `dio` + `SecurityContext` |
| Root detection | `flutter_jailbreak_detection` |
| Code obfuscation | `flutter build --obfuscate --split-debug-info=debug/` |
| Secure network | Certificate pinning + TLS 1.3 |

---

## Verification

Cross-check version-sensitive details with the cited official source and verify the resulting behavior in the target environment.
