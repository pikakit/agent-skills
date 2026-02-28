---
name: ai-artist
description: >-
  Prompt engineering for AI text and image generation models.
  LLM prompting (Claude, GPT, Gemini), image generation (Midjourney, DALL-E, Stable Diffusion, Flux).
  Triggers on: prompt, AI prompt, image generation, Midjourney, DALL-E, Stable Diffusion.
  Coordinates with: studio, media-processing.
allowed-tools: Read, Write, Edit
metadata:
  version: "1.0.0"
  category: "ai"
  triggers: "prompt, AI prompt, image generation, Midjourney, DALL-E, Stable Diffusion, Flux"
  success_metrics: "prompt produces desired output, minimal iterations"
  coordinates_with: "studio, media-processing"
---

# AI Artist - Prompt Engineering

> Craft effective prompts for AI text and image generation models.

---

## When to Use

| Situation | Reference |
|-----------|-----------|
| LLM prompt structure | This file |
| Image generation | `references/image-prompts.md` |
| Marketing copy | `references/domain-marketing.md` |
| Code generation | `references/domain-code.md` |
| Model-specific syntax | `references/model-syntax.md` |

---

## Core Principles

| Principle | Application |
|-----------|-------------|
| **Clarity** | Be specific, avoid ambiguity |
| **Context** | Set role, constraints, audience upfront |
| **Structure** | Use consistent formatting (headers, XML tags) |
| **Iteration** | Refine based on outputs, A/B test |

---

## LLM Prompt Pattern

```markdown
[Role] You are a [expertise] specializing in [domain].
[Context] [Background, constraints, audience]
[Task] [Specific action to perform]
[Format] [Output structure: markdown, JSON, etc.]
[Examples]
Good: [Example of desired output]
Bad: [Example to avoid]
```

---

## Image Prompt Pattern

```
[Subject] + [Style] + [Composition] + [Quality] + [Parameters]
```

**Example:**
```
Portrait of cyberpunk hacker, neon purple lighting, cinematic close-up,
volumetric fog, 8k render, artstation quality --ar 16:9 --style raw
```

---

## Quick Reference

| Element | Purpose | Example |
|---------|---------|---------|
| Subject | What to generate | "portrait of cyberpunk hacker" |
| Style | Visual aesthetic | "neon lighting, cinematic" |
| Composition | Framing | "close-up, shallow depth of field" |
| Quality | Render quality | "8k, artstation quality" |
| Parameters | Model-specific | `--ar 16:9 --style raw` |

---

## Anti-Patterns

| ❌ Don't | ✅ Do |
|---------|-------|
| "Make it better" | "Increase contrast by 20%" |
| "Professional but casual" | Choose one tone |
| Missing context | Set role, audience, constraints |
| Over-prompting | Focus on core requirements |

---

## Best Practices

1. **Start broad, refine narrow**: Simple prompt first, add constraints
2. **Use examples over descriptions**: "Like Stripe's docs" > "clean and minimalist"
3. **Specify output format explicitly**: Markdown, JSON, CSV
4. **Include success criteria**: "Under 150 words", "p95 <200ms"
5. **Version your prompts**: Track what works

---

## 📑 Content Map

| File | Description | When to Read |
|------|-------------|--------------|
| `references/image-prompts.md` | Image generation techniques | Visual AI |
| `references/domain-marketing.md` | Marketing copy patterns | Copywriting |
| `references/domain-code.md` | Code generation patterns | Programming |
| `references/model-syntax.md` | Model-specific parameters | Midjourney, SD, DALL-E |

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| Vague/generic output | Add specific constraints and examples |
| Wrong style | Use style references: "in the style of [artist/work]" |
| Busy composition | Reduce elements, focus on one subject |
| Inconsistent results | Add seed parameter, use same prompt base |
| Model-specific syntax ignored | Check `references/model-syntax.md` for correct format |

---

## 🔗 Related

| Item | Type | Purpose |
|------|------|---------|
| `studio` | Skill | Design system generation |
| `media-processing` | Skill | Post-processing images |

---

⚡ PikaKit v3.9.67
