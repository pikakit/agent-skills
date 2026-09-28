---
"title": "Mobile Navigation: Navigation State Persistence through 10. Navigation Checklist"
"kind": "reference"
"impact": "high"
"tags":
  - "mobile"
  - "navigation"
"applies_to":
  - "android"
  - "ios"
"last_reviewed": "2026-09-28"
"sources":
  - "title": "Android Navigation Component"
    "url": "https://developer.android.com/guide/navigation"
  - "title": "Apple HIG Navigation"
    "url": "https://developer.apple.com/design/human-interface-guidelines/navigation"
---

# Mobile Navigation: Navigation State Persistence through 10. Navigation Checklist

## Scope

Apply this guidance only to the declared platforms and repository-confirmed versions.

## Guidance

> Navigation patterns, deep linking, back handling, and tab/stack/drawer decisions.
> **Navigation is the skeleton of your app—get it wrong and everything feels broken.**

---

## 7. Navigation State Persistence

### What to Persist

```
SHOULD persist:
├── Current tab selection
├── Scroll position in lists
├── Form draft data
├── Recent navigation stack
└── User preferences

SHOULD NOT persist:
├── Modal states (dialogs)
├── Temporary UI states
├── Stale data (refresh on return)
├── Authentication state (use secure storage)
```

### Implementation

```javascript
// React Navigation - State Persistence
const [isReady, setIsReady] = useState(false);
const [initialState, setInitialState] = useState();

useEffect(() => {
  const loadState = async () => {
    const savedState = await AsyncStorage.getItem('NAV_STATE');
    if (savedState) setInitialState(JSON.parse(savedState));
    setIsReady(true);
  };
  loadState();
}, []);

const handleStateChange = (state) => {
  AsyncStorage.setItem('NAV_STATE', JSON.stringify(state));
};

<NavigationContainer
  initialState={initialState}
  onStateChange={handleStateChange}
>
```

---

> Navigation patterns, deep linking, back handling, and tab/stack/drawer decisions.
> **Navigation is the skeleton of your app—get it wrong and everything feels broken.**

---

## 8. Transition Animations

### Platform Defaults

```
iOS Transitions:
├── Push: Slide from right
├── Modal: Slide from bottom (sheet) or fade
├── Tab switch: Cross-fade
├── Interactive: Swipe to go back

Android Transitions:
├── Push: Fade + slide from right
├── Modal: Slide from bottom
├── Tab switch: Cross-fade or none
├── Shared element: Hero animations
```

### Custom Transitions

```
When to custom:
├── Brand identity requires it
├── Shared element connections
├── Special reveal effects
└── Keep it subtle, <300ms

When to use default:
├── Most of the time
├── Standard drill-down
├── Platform consistency
└── Performance critical paths
```

### Shared Element Transitions

```
Connect elements between screens:

Screen A: Product card with image
            ↓ (tap)
Screen B: Product detail with same image (expanded)

Image animates from card position to detail position.

Implementation:
├── React Navigation: shared element library
├── Flutter: Hero widget
├── SwiftUI: matchedGeometryEffect
└── Compose: Shared element transitions
```

---

> Navigation patterns, deep linking, back handling, and tab/stack/drawer decisions.
> **Navigation is the skeleton of your app—get it wrong and everything feels broken.**

---

## 9. Navigation Anti-Patterns

### ❌ Navigation Sins

| Anti-Pattern | Problem | Solution |
|--------------|---------|----------|
| **Inconsistent back** | User confused, can't predict | Always pop stack |
| **Hidden navigation** | Features undiscoverable | Visible tabs/drawer trigger |
| **Deep nesting** | User gets lost | Max 3-4 levels, breadcrumbs |
| **Breaking swipe back** | iOS users frustrated | Never override gesture |
| **No deep links** | Can't share, bad notifications | Plan from start |
| **Tab stack reset** | Work lost on switch | Preserve tab states |
| **Modal for primary flow** | Can't back track | Use stack navigation |

### ❌ AI Navigation Mistakes

```
AI tends to:
├── Use modals for everything (wrong)
├── Forget tab state preservation (wrong)
├── Skip deep linking (wrong)
├── Override platform back behavior (wrong)
├── Reset stack on tab switch (wrong)
└── Ignore predictive back (Android 14+)

RULE: Use platform navigation patterns.
Don't reinvent navigation.
```

---

> Navigation patterns, deep linking, back handling, and tab/stack/drawer decisions.
> **Navigation is the skeleton of your app—get it wrong and everything feels broken.**

---

## 10. Navigation Checklist

### Before Navigation Architecture

- [ ] App type determined (tabs/drawer/stack)
- [ ] Number of top-level destinations counted
- [ ] Deep link URL scheme planned
- [ ] Auth flow integrated with navigation
- [ ] Tablet/large screen considered

### Before Every Screen

- [ ] Can user navigate back? (not dead end)
- [ ] Deep link to this screen planned
- [ ] State preserved on navigate away/back
- [ ] Transition appropriate for relationship
- [ ] Auth required? Handled?

### Before Release

- [ ] All deep links tested
- [ ] Back button works everywhere
- [ ] Tab states preserved correctly
- [ ] Edge swipe back works (iOS)
- [ ] Predictive back works (Android 14+)
- [ ] Universal/App links configured
- [ ] Push notification deep links work

---

> **Remember:** Navigation is invisible when done right. Users shouldn't think about HOW to get somewhere—they just get there. If they notice navigation, something is wrong.

---

## Verification

Cross-check version-sensitive details with the cited official source and verify the resulting behavior in the target environment.
