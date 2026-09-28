# Ai Artist Full Agent Rules

> Deterministic compilation of 5 source rules for ai-artist v4.0.0. Do not edit directly.

## Rule Index

- [Code Generation Prompt Patterns](#rule-domain-code) (standard, reference, source: `rules/domain-code.md`)
- [Marketing Prompt Patterns](#rule-domain-marketing) (standard, reference, source: `rules/domain-marketing.md`)
- [Image Generation Prompts](#rule-image-prompts) (standard, reference, source: `rules/image-prompts.md`)
- [Model-Specific Syntax](#rule-model-syntax) (standard, reference, source: `rules/model-syntax.md`)
- [Production verification gates](#rule-production-gates) (high, process, source: `rules/production-gates.md`)

<a id="rule-domain-code"></a>

## Code Generation Prompt Patterns

**Impact:** standard
**Kind:** reference
**Source:** `rules/domain-code.md`

# Code Generation Prompt Patterns

## Scope

Apply this guidance only to the declared platforms and repository-confirmed versions.

## Guidance

# Code Generation Prompt Patterns

> Templates for generating code with AI.

---

## Function Generation

```markdown
[Role] You are a senior [language] developer.
[Context] Project uses [framework], follows [style guide].
[Task] Write a function that [specific behavior].
[Format] TypeScript with JSDoc, include error handling.

[Constraints]
- Pure function (no side effects)
- Handle edge cases: null, empty, invalid input
- Include type definitions
- Add unit test examples

[Example signature]
function processPayment(amount: number, currency: string): PaymentResult
```

---

## Code Review

```markdown
[Role] You are a code reviewer with security focus.
[Context] PR for [feature], affects [components].
[Task] Review this code for issues.
[Format] Categorized feedback: Critical, Important, Suggestion.

[Check for]
- Security vulnerabilities (OWASP Top 10)
- Performance issues (N+1, memory leaks)
- Code style violations
- Missing error handling
- Test coverage gaps
```

---

## Refactoring

```markdown
[Role] You are a software architect.
[Context] Legacy code in [language], needs modernization.
[Task] Refactor this code to [goal: reduce complexity, improve performance].
[Format] Show before/after with explanation.

[Constraints]
- Maintain backward compatibility
- Improve readability
- Add types if missing
- Keep same public API
```

---

## Debugging

```markdown
[Role] You are a debugging expert.
[Context] Error: [error message], Environment: [prod/dev], Stack: [tech stack]
[Task] Analyze this error and suggest fixes.
[Format]
1. Root cause analysis
2. Immediate fix
3. Long-term solution
4. Prevention strategy

[Provide]
- Error logs
- Relevant code
- Steps to reproduce
```

---

## API Design

```markdown
[Role] You are an API architect.
[Context] Building [REST/GraphQL] API for [domain].
[Task] Design endpoints for [feature].
[Format] OpenAPI spec with examples.

[Include]
- Request/response schemas
- Error codes and messages
- Rate limiting considerations
- Authentication requirements
```

---

## 🔗 Related

| File | When to Read |
|------|-------------|
| [domain-marketing.md](domain-marketing.md) | Marketing copy prompt patterns |
| [model-syntax.md](model-syntax.md) | Model-specific parameters |
| [../SKILL.md](../SKILL.md) | LLM prompt pattern and anti-patterns |

## Verification

Cross-check version-sensitive details with the cited official source and verify the resulting behavior in the target environment.

<a id="rule-domain-marketing"></a>

## Marketing Prompt Patterns

**Impact:** standard
**Kind:** reference
**Source:** `rules/domain-marketing.md`

# Marketing Prompt Patterns

## Scope

Apply this guidance only to the declared platforms and repository-confirmed versions.

## Guidance

# Marketing Prompt Patterns

> Templates for generating marketing copy with AI.

---

## Headlines

```markdown
[Role] You are a conversion-focused copywriter.
[Context] Product: [product], Audience: [target], Goal: [objective]
[Task] Write 5 headline variations using proven formulas.
[Format] Each headline with formula name in parentheses.

[Formulas]
- AIDA: Attention, Interest, Desire, Action
- PAS: Problem, Agitate, Solution
- 4U: Useful, Urgent, Unique, Ultra-specific
```

---

## Product Descriptions

```markdown
[Role] You are a persuasive product copywriter.
[Context] Product: [name], Price: [range], Audience: [demographic]
[Task] Write a [length] product description.
[Format] Structure: Hook, 3 benefits with emotional triggers, CTA.

[Example]
Good: "Silence the chaos. ProSound X500 delivers studio-grade quiet so you focus on what matters."
Bad: "These headphones have good noise cancellation features."
```

---

## Email Sequences

```markdown
[Role] You are an email marketing specialist.
[Context] Product: [name], Sequence: [welcome/nurture/sales]
[Task] Write a [N]-email sequence for [goal].
[Format] For each email: Subject line, Preview text, Body (150 words max), CTA.

[Constraints]
- Subject lines under 50 characters
- One clear CTA per email
- Progressive disclosure of value
```

---

## Ad Copy

```markdown
[Role] You are a performance marketing copywriter.
[Context] Platform: [FB/Google/LinkedIn], Objective: [awareness/conversion]
[Task] Write [N] ad variations for A/B testing.
[Format] Headline (30 chars), Description (90 chars), CTA.

[Guidelines]
- Lead with benefit, not feature
- Include social proof if available
- Use power words: free, new, proven, guaranteed
```

---

## Social Media

```markdown
[Role] You are a social media content creator.
[Context] Brand: [tone], Platform: [platform], Goal: [engagement/traffic]
[Task] Write [N] post variations for [topic].
[Format] Post text, Hashtags (5 max), Best posting time.

[Platform-specific]
- Twitter: Under 280 chars, conversational
- LinkedIn: Professional, 1300 chars max
- Instagram: Story-driven, emoji-friendly
```

---

## 🔗 Related

| File | When to Read |
|------|-------------|
| [domain-code.md](domain-code.md) | Code generation prompt patterns |
| [image-prompts.md](image-prompts.md) | Visual prompts for marketing assets |
| [../SKILL.md](../SKILL.md) | LLM prompt pattern and anti-patterns |

## Verification

Cross-check version-sensitive details with the cited official source and verify the resulting behavior in the target environment.

<a id="rule-image-prompts"></a>

## Image Generation Prompts

**Impact:** standard
**Kind:** reference
**Source:** `rules/image-prompts.md`

# Image Generation Prompts

## Scope

Apply this guidance only to the declared platforms and repository-confirmed versions.

## Guidance

# Image Generation Prompts

> Techniques for Midjourney, DALL-E, Stable Diffusion, Flux.

---

## Prompt Structure (Fixed Order)

```
[Subject] + [Style] + [Composition] + [Quality] + [Parameters]
```

**Order matters.** Subject first, model parameters last. Never rearrange.

---

## Subject Types

| Type | Example | Tips |
|------|---------|------|
| Portrait | "portrait of young woman with silver hair" | Describe features, expression, clothing |
| Product | "floating smartphone mockup" | Clean background, studio lighting |
| Scene | "cozy coffee shop interior" | Set time of day, weather, mood |
| Abstract | "geometric patterns in motion" | Describe shapes, flow, color |
| Architecture | "brutalist concrete building" | Mention materials, era, setting |
| Food | "artisan sourdough bread on wooden board" | Describe texture, steam, props |

### Multi-Subject Rules

| # Subjects | Technique |
|-----------|-----------|
| 1 | Direct description (best quality) |
| 2 | "A and B" or "A with B" |
| 3+ | Simplify — each extra subject reduces quality |

---

## Style Keywords

| Category | Keywords |
|----------|----------|
| **Lighting** | golden hour, neon, rim lighting, volumetric, backlighting, studio, rembrandt |
| **Mood** | cinematic, ethereal, dramatic, moody, serene, intense, peaceful |
| **Art style** | watercolor, oil painting, digital art, 3D render, pencil sketch, pixel art |
| **Era** | cyberpunk, retro 80s, futuristic, vintage, art deco, medieval |
| **Medium** | photograph, illustration, concept art, anime, vector art |

### Style Combinations (Recipes)

| Recipe | Prompt Snippet | Best For |
|--------|---------------|----------|
| **Cinematic Hero** | cinematic, dramatic lighting, shallow depth of field, 8k | Landing pages, headers |
| **Product Clean** | studio lighting, white background, professional product photo | E-commerce, mockups |
| **Editorial Film** | 35mm film grain, natural light, candid, editorial photography | Blog, magazine |
| **Digital Art** | digital painting, vibrant colors, artstation quality, trending | Gaming, creative |
| **Dark Moody** | dark atmospheric, volumetric fog, rim lighting, desaturated | Tech, premium |
| **Watercolor Soft** | watercolor wash, soft edges, pastel palette, handmade texture | Organic, lifestyle |

---

## Composition

| Element | Keywords |
|---------|----------|
| **Angle** | close-up, wide shot, bird's eye, dutch angle, low angle, over-the-shoulder |
| **Focus** | shallow depth of field, bokeh, tilt-shift, macro, sharp focus |
| **Environment** | fog, rain, particles, lens flare, golden dust, smoke |
| **Framing** | rule of thirds, centered, symmetrical, negative space |

### Aspect Ratio Guide

| Ratio | Use Case |
|-------|----------|
| `1:1` | Social media, avatars, icons |
| `4:3` | Product photos, presentations |
| `16:9` | Hero images, headers, cinematic |
| `9:16` | Mobile, stories, vertical content |
| `2:3` | Portrait, Pinterest, posters |

---

## Quality Boosters

```
8k, ultra detailed, professional, artstation quality,
award-winning, masterpiece, highly detailed
```

### Quality Tier

| Level | Keywords | When |
|-------|----------|------|
| **Standard** | detailed, professional | Most use cases |
| **High** | 8k, ultra detailed, artstation quality | Hero images |
| **Maximum** | masterpiece, award-winning, photorealistic, hyperrealistic | Key visuals |

---

## Negative Prompts (Stable Diffusion / Flux)

### Universal Negative

```
blurry, low quality, distorted, bad anatomy, watermark,
signature, text, cropped, out of frame, worst quality
```

### Domain-Specific Negatives

| Domain | Additional Negatives |
|--------|---------------------|
| **Portrait** | deformed face, extra fingers, mutated hands, bad proportions |
| **Product** | background clutter, text overlay, logo, shadow artifacts |
| **Architecture** | distorted perspective, floating elements, impossible geometry |
| **Food** | unappetizing, artificial look, oversaturated |

---

## Weighted Tokens (Stable Diffusion)

```
(keyword:1.3)   → Increase emphasis (1.0-1.5 range)
(keyword:0.7)   → Decrease emphasis (0.5-1.0 range)
[keyword]       → De-prioritize
```

### Weight Guidelines

| Weight | Effect | Use |
|--------|--------|-----|
| `1.0` | Normal | Default |
| `1.1-1.2` | Subtle boost | Ensure element appears |
| `1.3-1.5` | Strong boost | Make element dominant |
| `>1.5` | ⚠️ Artifacts | Avoid — causes distortion |
| `0.5-0.7` | Subtle reduce | Background element |

**Example:**

```
(cyberpunk:1.3), neon city at night, (rain reflections:1.2),
cinematic wide shot, volumetric fog, 8k render

Negative: blurry, low quality, text, watermark
```

---

## Complete Prompt Examples

### Product Photography

```
Floating wireless earbuds on marble surface, soft studio lighting,
clean white background, professional product photo, 8k, sharp focus,
commercial photography --ar 4:3
```

### Cinematic Portrait

```
Portrait of elderly fisherman, weathered face, golden hour
backlighting, shallow depth of field, 35mm film grain,
editorial photography, National Geographic quality --ar 2:3
```

### Tech Hero Image

```
Abstract network visualization, glowing blue nodes connected by
light threads, dark background, volumetric lighting, futuristic,
data visualization art, 8k render --ar 16:9 --style raw
```

---

## 🔗 Related

| File | When to Read |
|------|-------------|
| [model-syntax.md](model-syntax.md) | Model-specific parameters (--ar, --style, etc.) |
| [domain-marketing.md](domain-marketing.md) | Marketing visual prompts |
| [../SKILL.md](../SKILL.md) | Image prompt pattern and anti-patterns |

## Verification

Cross-check version-sensitive details with the cited official source and verify the resulting behavior in the target environment.

<a id="rule-model-syntax"></a>

## Model-Specific Syntax

**Impact:** standard
**Kind:** reference
**Source:** `rules/model-syntax.md`

# Model-Specific Syntax

## Scope

This reference applies only to the platforms declared in metadata and the versions confirmed in the target repository.

## Guidance

# Model-Specific Syntax

> Parameters and syntax for different AI image models.

---

## Midjourney

| Parameter | Purpose | Example |
|-----------|---------|---------|
| `--ar` | Aspect ratio | `--ar 16:9` |
| `--style` | Style preset | `--style raw` |
| `--v` | Version | `--v 6.1` |
| `--chaos` | Variation (0-100) | `--chaos 50` |
| `--weird` | Unusual outputs (0-3000) | `--weird 250` |
| `--tile` | Seamless pattern | `--tile` |
| `--no` | Negative prompt | `--no text, watermark` |

**Example:**
```
cyberpunk city at night, neon signs, rain reflections
--ar 16:9 --style raw --v 6.1
```

---

## DALL-E 3

- Natural language prompts (no special parameters)
- Supports HD quality option
- Good at photorealism and text rendering

**Example:**
```
A professional product photo of wireless earbuds on a marble surface,
soft studio lighting, high definition, clean white background
```

---

## Stable Diffusion

| Syntax | Purpose | Example |
|--------|---------|---------|
| `(word:1.3)` | Increase weight | `(neon:1.3)` |
| `(word:0.7)` | Decrease weight | `(blur:0.5)` |
| `[word]` | De-prioritize | `[watermark]` |
| Negative: | What to avoid | `Negative: blurry` |

**CFG Scale:** 7-12 (balance between prompt adherence and creativity)
**Steps:** 20-50 (quality vs speed tradeoff)

**Example:**
```
(cyberpunk:1.3) portrait, neon lights, (detailed face:1.2),
cinematic, 8k, professional

Negative: blurry, low quality, bad anatomy, watermark
```

---

## Flux

- Natural language prompts
- Strong prompt adherence
- Supports style mixing

| Parameter | Purpose | Example |
|-----------|---------|---------|
| `--guidance` | Prompt strength | `--guidance 7.5` |

**Example:**
```
Photorealistic portrait of a scientist in a lab,
dramatic lighting, shallow depth of field --guidance 7.5
```

---

## Imagen / Veo

- Pure natural language
- Describe in detail what you want
- Aspect ratio specified naturally

**Example:**
```
16:9 cinematic shot of a futuristic city at sunset,
flying cars, holographic advertisements, warm orange and
purple sky, volumetric lighting, movie quality
```

---

## 🔗 Related

| File | When to Read |
|------|-------------|
| [image-prompts.md](image-prompts.md) | Image prompt techniques and recipes |
| [domain-code.md](domain-code.md) | Code generation prompt patterns |
| [../SKILL.md](../SKILL.md) | Supported models quick reference |

## Verification

Cross-check version-sensitive details with the cited official source and verify the resulting behavior in the target environment.

<a id="rule-production-gates"></a>

## Production verification gates

**Impact:** high
**Kind:** process
**Source:** `rules/production-gates.md`

# Production verification gates

## Preconditions

- Confirm the target platform and dependency versions from the repository.
- Capture a reproducible baseline and define observable acceptance criteria.
- Identify a recoverable rollback point before changing code or configuration.

## Procedure

1. Apply the smallest change that satisfies the documented requirement.
2. Exercise the affected success and failure paths with the narrowest reliable check.
3. Run the repository typecheck, tests, and policy checks that cover the changed surface.
4. Inspect diagnostics for redacted, actionable evidence; a missing or failed checker is not success.

## Rollback

Restore the recorded baseline when a required check errors, the result is inconclusive, or a new regression appears. Re-run the baseline check after restoration.

## Exit Gate

Finish only when required checks execute and pass, acceptance behavior is reproduced, rollback remains available, and residual risks are reported explicitly.
