---
"title": "Mobile Performance: Flutter Performance - The const Constructor Revolution through 3. Flutter Performance -
  Dispose Pattern"
"kind": "reference"
"impact": "high"
"tags":
  - "mobile-developer"
"applies_to":
  - "android"
  - "ios"
"last_reviewed": "2026-09-28"
"sources":
  - "title": "Flutter Performance Best Practices"
    "url": "https://docs.flutter.dev/perf/best-practices"
---

# Mobile Performance: Flutter Performance - The const Constructor Revolution through 3. Flutter Performance - Dispose Pattern

## Scope

Apply this guidance only to the declared platforms and repository-confirmed versions.

## Guidance

> Deep dive into React Native and Flutter performance optimization, 60fps animations, memory management, and battery considerations.
> **This file covers the #1 area where AI-generated code FAILS.**

---

## 3. Flutter Performance

### The `const` Constructor Revolution

```dart
// ? CORRECT: const prevents rebuilds

class GoodCounter extends StatefulWidget {
  const GoodCounter({super.key}); // CONST constructor!
  
  @override
  State<GoodCounter> createState() => _GoodCounterState();
}

class _GoodCounterState extends State<GoodCounter> {
  int _counter = 0;
  
  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        Text('Counter: $_counter'),
        const ExpensiveWidget(), // Won't rebuild!
        const AnotherExpensiveWidget(), // Won't rebuild!
      ],
    );
  }
}

// RULE: Add `const` to EVERY widget that doesn't depend on state
```

> Deep dive into React Native and Flutter performance optimization, 60fps animations, memory management, and battery considerations.
> **This file covers the #1 area where AI-generated code FAILS.**

---

## 3. Flutter Performance

### Targeted State Management

```dart
// ? setState rebuilds whole tree
setState(() => _value = newValue);

// ? ValueListenableBuilder: surgical rebuilds
class TargetedState extends StatelessWidget {
  final ValueNotifier<int> counter = ValueNotifier(0);
  
  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        // Only this rebuilds when counter changes
        ValueListenableBuilder<int>(
          valueListenable: counter,
          builder: (context, value, child) => Text('$value'),
          child: const Icon(Icons.star), // Won't rebuild!
        ),
        const ExpensiveWidget(), // Never rebuilds
      ],
    );
  }
}
```

> Deep dive into React Native and Flutter performance optimization, 60fps animations, memory management, and battery considerations.
> **This file covers the #1 area where AI-generated code FAILS.**

---

## 3. Flutter Performance

### Riverpod/Provider Best Practices

```dart
// ? WRONG: Reading entire provider in build
Widget build(BuildContext context) {
  final state = ref.watch(myProvider); // Rebuilds on ANY change
  return Text(state.name);
}

// ? CORRECT: Select only what you need
Widget build(BuildContext context) {
  final name = ref.watch(myProvider.select((s) => s.name));
  return Text(name); // Only rebuilds when name changes
}
```

> Deep dive into React Native and Flutter performance optimization, 60fps animations, memory management, and battery considerations.
> **This file covers the #1 area where AI-generated code FAILS.**

---

## 3. Flutter Performance

### ListView Optimization

```dart
// ? WRONG: ListView without builder (renders all)
ListView(
  children: items.map((item) => ItemWidget(item)).toList(),
)

// ? CORRECT: ListView.builder (lazy rendering)
ListView.builder(
  itemCount: items.length,
  itemBuilder: (context, index) => ItemWidget(items[index]),
  // Additional optimizations:
  itemExtent: 56, // Fixed height = faster layout
  cacheExtent: 100, // Pre-render distance
)

// ? EVEN BETTER: ListView.separated for dividers
ListView.separated(
  itemCount: items.length,
  itemBuilder: (context, index) => ItemWidget(items[index]),
  separatorBuilder: (context, index) => const Divider(),
)
```

> Deep dive into React Native and Flutter performance optimization, 60fps animations, memory management, and battery considerations.
> **This file covers the #1 area where AI-generated code FAILS.**

---

## 3. Flutter Performance

### Image Optimization

```dart
// ? WRONG: No caching, full resolution
Image.network(url)

// ? CORRECT: Cached with proper sizing
CachedNetworkImage(
  imageUrl: url,
  width: 100,
  height: 100,
  fit: BoxFit.cover,
  memCacheWidth: 200, // Cache at 2x for retina
  memCacheHeight: 200,
  placeholder: (context, url) => const Skeleton(),
  errorWidget: (context, url, error) => const Icon(Icons.error),
)
```

> Deep dive into React Native and Flutter performance optimization, 60fps animations, memory management, and battery considerations.
> **This file covers the #1 area where AI-generated code FAILS.**

---

## 3. Flutter Performance

### Dispose Pattern

```dart
class MyWidget extends StatefulWidget {
  @override
  State<MyWidget> createState() => _MyWidgetState();
}

class _MyWidgetState extends State<MyWidget> {
  late final StreamSubscription _subscription;
  late final AnimationController _controller;
  late final TextEditingController _textController;
  
  @override
  void initState() {
    super.initState();
    _subscription = stream.listen((_) {});
    _controller = AnimationController(vsync: this);
    _textController = TextEditingController();
  }
  
  @override
  void dispose() {
    // ALWAYS dispose in reverse order of creation
    _textController.dispose();
    _controller.dispose();
    _subscription.cancel();
    super.dispose();
  }
  
  @override
  Widget build(BuildContext context) => Container();
}
```

## Verification

Cross-check version-sensitive details with the cited official source and verify the resulting behavior in the target environment.
