---
name: shader
description: >-
  Write GLSL fragment shaders for procedural graphics, textures, and visual effects.
  SDF, noise, patterns, animations.
  Triggers on: shader, GLSL, procedural, texture, visual effect.
  Coordinates with: game-development, media-processing.
metadata:
  version: "2.0.0"
  category: "graphics"
  triggers: "shader, GLSL, procedural, texture, visual effect, WebGL"
  success_metrics: "shader compiles, visuals render"
  coordinates_with: "game-development, media-processing"
---

# Shader — GLSL Fragment Shaders

> Every pixel in parallel. Math → Visuals. Stateless per-pixel execution.

---

## When to Use

| Situation | Approach |
|-----------|----------|
| Procedural graphics | Use quick patterns (circle, tiling, gradient) |
| Visual effects | Use noise/SDF techniques |
| Game textures | Use procedural texture domain |
| WebGL animation | Use u_time + sin/cos patterns |

---

## System Boundaries

| Owned by This Skill | NOT Owned |
|---------------------|-----------|
| GLSL fragment shader patterns | Game engine integration (→ game-development) |
| Standard uniform interface | Video processing (→ media-processing) |
| Essential GLSL functions (6) | Shader compilation |
| Technique domains (4) | GPU resource management |

**Expert (pure function) skill:** Produces GLSL code patterns. Does not compile or run shaders.

---

## Core Concept

Fragment shaders execute **on every pixel simultaneously**:
- Input: `gl_FragCoord` (pixel position)
- Output: `gl_FragColor` (RGBA 0.0-1.0)
- Stateless: No cross-pixel communication

---

## Standard Uniforms (3 — Fixed)

```glsl
uniform float u_time;       // Elapsed seconds
uniform vec2 u_resolution;  // Canvas size (pixels)
uniform vec2 u_mouse;       // Mouse position (pixels)

// Normalize coordinates to 0.0-1.0
vec2 st = gl_FragCoord.xy / u_resolution;
```

---

## Essential Functions (6 — Fixed)

| Function | Purpose | Use For |
|----------|---------|---------|
| `mix(a,b,t)` | Linear interpolate | Gradients, blending |
| `step(edge,x)` | Hard threshold | Sharp edges |
| `smoothstep(e0,e1,x)` | Smooth threshold | Anti-aliased edges |
| `fract(x)` | Fractional part | Tiling, repeat |
| `length(v)` | Vector magnitude | Circle shapes |
| `distance(a,b)` | Euclidean distance | SDF shapes |

---

## Quick Patterns (4 — Fixed)

### Circle
```glsl
float d = distance(st, vec2(0.5));
float circle = 1.0 - smoothstep(0.2, 0.21, d);
```

### Tiling
```glsl
st = fract(st * 4.0);  // 4x4 grid
```

### Animation
```glsl
float wave = sin(st.x * 10.0 + u_time) * 0.5 + 0.5;
```

### Gradient
```glsl
vec3 color = mix(vec3(1,0,0), vec3(0,0,1), st.x);
```

---

## Technique Domains (4)

| Domain | Techniques |
|--------|-----------|
| Shapes | SDF, circles, rectangles, polar coords |
| Patterns | Tiling, fract(), rotation matrices |
| Noise | Random, Perlin, simplex, Voronoi |
| Textures | Clouds, marble, wood, terrain |

---

## Error Taxonomy

| Code | Recoverable | Trigger |
|------|-------------|---------|
| `ERR_INVALID_REQUEST_TYPE` | No | Request type not supported |
| `ERR_UNKNOWN_EFFECT` | Yes | Effect type not in known set |
| `ERR_UNKNOWN_DOMAIN` | Yes | Domain not one of 4 |

**Zero internal retries.** Same effect = same GLSL pattern.

---

## Anti-Patterns

| ❌ Don't | ✅ Do |
|---------|-------|
| Use pixel coords directly | Normalize: `gl_FragCoord.xy / u_resolution` |
| Use `step()` for soft edges | Use `smoothstep()` for anti-aliasing |
| Hardcode canvas size | Use `u_resolution` uniform |
| Use 0-255 color values | Use 0.0-1.0 float range |

---

## Tools

| Tool | Purpose |
|------|---------|
| **Book of Shaders** | thebookofshaders.com |
| **ShaderToy** | shadertoy.com |
| **glslViewer** | CLI for .frag files |
| **LYGIA** | lygia.xyz shader library |

---

## 📑 Content Map

| File | Description | When to Read |
|------|-------------|--------------|
| [engineering-spec.md](references/engineering-spec.md) | Full spec | Architecture review |

---

## 🔗 Related

| Item | Type | Purpose |
|------|------|---------|
| `game-development` | Skill | Game graphics |
| `media-processing` | Skill | Visual effects |

---

⚡ PikaKit v3.9.71
