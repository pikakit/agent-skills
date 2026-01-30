---
name: flutter-patterns
description: Flutter and Dart best practices, widget patterns, and state management
---

# Flutter Patterns

> **Philosophy:** Everything is a widget. Composition over inheritance. Dart-first.

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
// ✅ Good - composed small widgets
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

// ❌ Bad - monolithic widget with everything inline
```

## State Management

### Provider (Recommended for Most Apps)

```dart
// 1. Create ChangeNotifier
class CartNotifier extends ChangeNotifier {
  final List<Item> _items = [];
  
  List<Item> get items => UnmodifiableListView(_items);
  
  void add(Item item) {
    _items.add(item);
    notifyListeners();
  }
}

// 2. Provide at top
MultiProvider(
  providers: [
    ChangeNotifierProvider(create: (_) => CartNotifier()),
  ],
  child: MyApp(),
)

// 3. Consume with context.watch/read
final cart = context.watch<CartNotifier>();
```

### State Management Selection

| Complexity | Solution |
|------------|----------|
| Simple | setState + InheritedWidget |
| Medium | Provider / Riverpod |
| Complex | Bloc / Riverpod |
| Very Large | Bloc with clean architecture |

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

## Performance Optimization

### const Constructors

```dart
// ✅ Good - const prevents rebuilds
const Padding(
  padding: EdgeInsets.all(16),
  child: Text('Hello'),
)

// Mark widgets as const when possible
class MyIcon extends StatelessWidget {
  const MyIcon({super.key}); // Add const constructor
}
```

### ListView Optimization

```dart
// ✅ Good - lazy loading
ListView.builder(
  itemCount: items.length,
  itemBuilder: (context, index) => ItemTile(item: items[index]),
)

// ❌ Bad - loads all at once
ListView(
  children: items.map((i) => ItemTile(item: i)).toList(),
)
```

### Image Caching

```dart
// Use cached_network_image
CachedNetworkImage(
  imageUrl: url,
  placeholder: (context, url) => CircularProgressIndicator(),
  errorWidget: (context, url, error) => Icon(Icons.error),
)
```

## Platform-Specific Code

```dart
import 'dart:io' show Platform;

Widget build(BuildContext context) {
  if (Platform.isIOS) {
    return CupertinoButton(child: Text('iOS Style'));
  }
  return ElevatedButton(child: Text('Material Style'));
}

// Or use flutter_platform_widgets for automatic switching
```

## Dart Best Practices

### Null Safety

```dart
// Required parameters
void greet({required String name}) {}

// Nullable with default
String format(String? value) => value ?? 'default';

// Late initialization
late final Database _db;
```

### Immutable Models

```dart
@immutable
class User {
  final String id;
  final String name;
  
  const User({required this.id, required this.name});
  
  User copyWith({String? name}) => User(
    id: id,
    name: name ?? this.name,
  );
}
```

## Anti-Patterns

| Don't | Do |
|-------|-----|
| Deep widget nesting | Extract to smaller widgets |
| Business logic in widgets | Use services/repositories |
| Ignore widget keys | Use keys for list items |
| Blocking main isolate | Use compute() for heavy work |
