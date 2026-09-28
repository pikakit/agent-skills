---
"title": "Ux Psychology: Trust Building System through 4. Cognitive Load Management"
"kind": "reference"
"impact": "high"
"tags":
  - "ux"
  - "psychology"
"applies_to":
  - "web"
  - "android"
  - "ios"
"last_reviewed": "2026-09-28"
"sources":
  - "title": "Official documentation"
    "url": "https://www.w3.org/WAI/standards-guidelines/wcag/"
---

# Ux Psychology: Trust Building System through 4. Cognitive Load Management

## Scope

Apply only to the declared platforms and repository-confirmed versions.

## Guidance

> Deep dive into UX laws, emotional design, trust building, and behavioral psychology.

---

## 3. Trust Building System

### Trust Signal Categories

| Category | Elements | Implementation |
|----------|----------|----------------|
| **Security** | SSL, badges, encryption | Visible padlock, security logos on forms |
| **Social Proof** | Reviews, testimonials, logos | Star ratings, customer photos, brand logos |
| **Transparency** | Policies, pricing, contact | Clear links, no hidden fees, real address |
| **Professional** | Design quality, consistency | No broken elements, consistent branding |
| **Authority** | Certifications, awards, media | "As seen in...", industry certifications |

### Trust Signal Placement

```
┌────────────────────────────────────────────────────┐
│  HEADER: Trust banner ("Free shipping | 30-day    │
│          returns | Secure checkout")               │
├────────────────────────────────────────────────────┤
│  HERO: Social proof ("Trusted by 10,000+")        │
├────────────────────────────────────────────────────┤
│  PRODUCT: Reviews visible, security badges         │
├────────────────────────────────────────────────────┤
│  CHECKOUT: Payment icons, SSL badge, guarantee     │
├────────────────────────────────────────────────────┤
│  FOOTER: Contact info, policies, certifications    │
└────────────────────────────────────────────────────┘
```

### Trust-Building CSS Patterns

```css
/* Trust badge styling */
.trust-badge {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  background: #F0FDF4;  /* Light green = security */
  border-radius: 2px; /* Sharp for trust = precision feel */
  font-size: 14px;
  color: #166534;
}

/* Secure form indicator */
.secure-form::before {
  content: '🔒 Secure form';
  display: block;
  font-size: 12px;
  color: #166534;
  margin-bottom: 8px;
}

/* Testimonial card */
.testimonial {
  display: flex;
  gap: 16px;
  padding: 24px;
  background: white;
  border-radius: 16px; /* Friendly = larger radius */
  box-shadow: var(--shadow-sm);
}

.testimonial-avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;  /* Real photos > initials */
}
```

---

> Deep dive into UX laws, emotional design, trust building, and behavioral psychology.

---

## 4. Cognitive Load Management

### Three Types of Cognitive Load

| Type | Definition | Designer's Role |
|------|------------|-----------------|
| **Intrinsic** | Inherent complexity of task | Break into smaller steps |
| **Extraneous** | Load from poor design | Eliminate this! |
| **Germane** | Effort for learning | Support and encourage |

### Reduction Strategies

**1. Simplify (Reduce Extraneous)**
```css
/* Visual noise → Clean */
.card-busy {
  border: 2px solid red;
  background: linear-gradient(...);
  box-shadow: 0 0 20px ...;
  /* Too much! */
}

.card-clean {
  background: white;
  border-radius: 16px;
  box-shadow: 0 10px 30px -10px rgba(0,0,0,0.1);
  /* Calm, focused */
}
```

**2. Chunk Information**
```html
<!-- Overwhelming -->
<form>
  <!-- 15 fields at once -->
</form>

<!-- Chunked -->
<form>
  <fieldset>
    <legend>Step 1: Personal Info</legend>
    <!-- 3-4 fields -->
  </fieldset>
  <fieldset>
    <legend>Step 2: Shipping</legend>
    <!-- 3-4 fields -->
  </fieldset>
</form>
```

**3. Progressive Disclosure**
```html
<!-- Hide complexity until needed -->
<div class="filters">
  <div class="filters-basic">
    <!-- Common filters visible -->
  </div>
  <button onclick="toggleAdvanced()">
    Advanced Options ▼
  </button>
  <div class="filters-advanced" hidden>
    <!-- Complex filters hidden -->
  </div>
</div>
```

**4. Use Familiar Patterns**
```
✅ Standard navigation placement
✅ Expected icon meanings (🔍 = search)
✅ Conventional form layouts
✅ Common gesture patterns (swipe, pinch)
```

**5. Offload Information**
```html
<!-- Don't make users remember -->
<label>
  Card Number
  <input type="text" inputmode="numeric" 
         autocomplete="cc-number" 
         placeholder="1234 5678 9012 3456">
</label>

<!-- Show what they entered -->
<div class="order-summary">
  <p>Shipping to: <strong>John Doe, 123 Main St...</strong></p>
  <a href="#">Edit</a>
</div>
```

---

## Verification

Cross-check version-sensitive details with the cited official source and verify behavior in the target environment.
