---
"title": "Flutter: Widget Architecture through Navigation (GoRouter)"
"kind": "reference"
"impact": "high"
"tags":
  - "flutter"
"applies_to":
  - "android"
  - "ios"
"last_reviewed": "2026-09-28"
"sources":
  - "title": "Flutter widget catalog and architecture"
    "url": "https://docs.flutter.dev/ui/widgets"
---

# Flutter: Widget Architecture through Navigation (GoRouter)

## Scope

Apply this guidance only to the declared platforms and repository-confirmed versions.

## Guidance

> **Philosophy:** Everything is a widget. Composition over inheritance. Dart-first.

---

## Widget Architecture

### Widget Selection Matrix

| Need | Widget Type |
|------|-------------|
| Static content | StatelessWidget |
| Local state | StatefulWidget |
| Inherited data | InheritedWidget / Provider |
| Animations | AnimatedWidget / AnimatedBuilder |

### Composition Pattern

```dart
// ✅ Good — composed small widgets
class UserCard extends StatelessWidget {
  final User user;
  const UserCard({required this.user});

  @override
  Widget build(BuildContext context) {
    return Card(
      child: Column(
        children: [
          UserAvatar(url: user.avatarUrl),
          UserName(name: user.name),
          UserBio(bio: user.bio),
        ],
      ),
    );
  }
}

// ❌ Bad — monolithic widget with everything inline
```

---

> **Philosophy:** Everything is a widget. Composition over inheritance. Dart-first.

---

## State Management

### Riverpod (Recommended)

```dart
// 1. Define provider
@riverpod
Future<List<User>> fetchUsers(FetchUsersRef ref) async {
  final response = await ref.watch(apiClientProvider).get('/users');
  return response.data.map(User.fromJson).toList();
}

// 2. Consume in widget
class UserList extends ConsumerWidget {
  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final users = ref.watch(fetchUsersProvider);
    return users.when(
      data: (data) => ListView.builder(
        itemCount: data.length,
        itemBuilder: (_, i) => UserTile(user: data[i]),
      ),
      loading: () => const CircularProgressIndicator(),
      error: (e, st) => ErrorDisplay(error: e),
    );
  }
}
```

### State Management Selection

| Complexity | Solution | Status |
|------------|----------|--------|
| Simple | setState + InheritedWidget | Built-in |
| Medium | **Riverpod** | ✅ Recommended |
| Complex | **Riverpod + freezed** | ✅ Recommended |
| Legacy | Provider | Maintenance mode |
| Very Large | Bloc | Enterprise alternative |

---

> **Philosophy:** Everything is a widget. Composition over inheritance. Dart-first.

---

## Dart 3 Features

### Sealed Classes (Exhaustive Patterns)

```dart
sealed class AuthState {}
class Authenticated extends AuthState {
  final User user;
  Authenticated(this.user);
}
class Unauthenticated extends AuthState {}
class Loading extends AuthState {}

// Exhaustive switch — compiler enforces all cases
Widget buildAuth(AuthState state) => switch (state) {
  Authenticated(:final user) => HomeScreen(user: user),
  Unauthenticated() => LoginScreen(),
  Loading() => const CircularProgressIndicator(),
};
```

### Records & Destructuring

```dart
// Named record fields
typedef UserResult = ({User user, DateTime fetchedAt});

Future<UserResult> getUser(String id) async {
  final user = await api.fetchUser(id);
  return (user: user, fetchedAt: DateTime.now());
}

// Destructure
final (:user, :fetchedAt) = await getUser('123');
```

### Pattern Matching

```dart
// Guard clauses with patterns
String describe(Object obj) => switch (obj) {
  int n when n < 0 => 'negative',
  int n when n == 0 => 'zero',
  int n => 'positive: $n',
  String s when s.isEmpty => 'empty string',
  String s => 'string: $s',
  _ => 'unknown',
};
```

---

> **Philosophy:** Everything is a widget. Composition over inheritance. Dart-first.

---

## Architecture Patterns (Clean Architecture)

```
lib/
├── features/
│   └── user/
│       ├── presentation/    # Widgets, pages, controllers
│       ├── domain/          # Entities, use cases, repository interfaces
│       ├── data/            # Repository implementations, DTOs, data sources
│       └── providers/       # Riverpod providers for this feature
├── core/
│   ├── network/             # Dio client, interceptors
│   ├── error/               # Failure classes, error handling
│   └── utils/               # Extensions, helpers
└── main.dart
```

| Layer | Rule | Example |
|-------|------|---------|
| Presentation | Depends on Domain only | `UserPage`, `UserController` |
| Domain | No dependencies | `User`, `GetUserUseCase` |
| Data | Implements Domain interfaces | `UserRepositoryImpl`, `UserDto` |

---

> **Philosophy:** Everything is a widget. Composition over inheritance. Dart-first.

---

## Navigation (GoRouter)

```dart
final router = GoRouter(
  routes: [
    GoRoute(
      path: '/',
      builder: (context, state) => HomeScreen(),
      routes: [
        GoRoute(
          path: 'user/:id',
          builder: (context, state) {
            final id = state.pathParameters['id']!;
            return UserScreen(userId: id);
          },
        ),
      ],
    ),
  ],
);

// Deep linking automatic with GoRouter
```

---

## Verification

Cross-check version-sensitive details with the cited official source and verify the resulting behavior in the target environment.
