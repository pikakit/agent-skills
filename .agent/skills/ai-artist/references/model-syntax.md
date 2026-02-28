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

⚡ PikaKit v3.9.67
