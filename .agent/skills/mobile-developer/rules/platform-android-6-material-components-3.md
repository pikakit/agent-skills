---
"title": "Platform Android: Material Components"
"kind": "reference"
"impact": "high"
"tags":
  - "mobile-developer"
"applies_to":
  - "android"
  - "ios"
"last_reviewed": "2026-09-28"
"sources":
  - "title": "Material Design 3 Mobile"
    "url": "https://developer.android.com/design/ui/mobile"
  - "title": "Jetpack Compose Documentation"
    "url": "https://developer.android.com/develop/ui/compose"
---

# Platform Android: Material Components

## Scope

Apply only to the declared platforms and repository-confirmed versions.

## Guidance

> Material Design 3 essentials, Android design conventions, Roboto typography, and native patterns.
> **Read this file when building for Android devices.**

---

## 6. Material Components

### Buttons

```
Button Types:

+----------------------+
|    Filled Button     |  ? Primary action
+----------------------+

+----------------------+
|    Tonal Button      |  ? Secondary, less emphasis
+----------------------+

+----------------------+
|   Outlined Button    |  ? Tertiary, lower emphasis
+----------------------+

    Text Button           ? Lowest emphasis

Heights:
+-- Small: 40dp (when constrained)
+-- Standard: 40dp
+-- Large: 56dp (FAB size when needed)

Min touch target: 48dp (even if visual is smaller)
```

### Floating Action Button (FAB)

```
FAB Types:
+-- Standard: 56dp diameter
+-- Small: 40dp diameter
+-- Large: 96dp diameter
+-- Extended: Icon + text, variable width

Position: Bottom right, 16dp from edges
Elevation: Floats above content

+-------------------------------------+
|                                     |
|         Content                     |
|                                     |
|                              +----+ |
|                              | ? | | ? FAB
|                              +----+ |
+-------------------------------------+
|       Bottom Navigation             |
+-------------------------------------+
```

### Cards

```
Card Types:
+-- Elevated: Shadow, resting state
+-- Filled: Background color, no shadow
+-- Outlined: Border, no shadow

Card Anatomy:
+-------------------------------------+
|           Header Image              | ? Optional
+-------------------------------------+
|  Title / Headline                   |
|  Subhead / Supporting text          |
+-------------------------------------+
|      [ Action ]    [ Action ]       | ? Optional actions
+-------------------------------------+

Corner radius: 12dp (M3 default)
Padding: 16dp
```

### Text Fields

```
Types:
+-- Filled: Background fill, underline
+-- Outlined: Border all around

+-------------------------------------+
|  Label                              | ? Floats up on focus
|  ________________________________________________
|  |     Input text here...          | ? Leading/trailing icons
|  ????????????????????????????????????????????????
|  Supporting text or error           |
+-------------------------------------+

Height: 56dp
Label: Animates from placeholder to top
Error: Red color + icon + message
```

### Chips

```
Types:
+-- Assist: Smart actions (directions, call)
+-- Filter: Toggle filters
+-- Input: Represent entities (tags, contacts)
+-- Suggestion: Dynamic recommendations

+---------------+
|  ??? Filter   |  ? 32dp height, 8dp corner radius
+---------------+

States: Unselected, Selected, Disabled
```

---

## Verification

Cross-check version-sensitive details with the cited official source and verify behavior in the target environment.
