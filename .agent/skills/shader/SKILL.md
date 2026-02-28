---
name: shader
description: >-
  Write GLSL fragment shaders for procedural graphics, textures, and visual effects.
  SDF, noise, patterns, animations.
  Triggers on: shader, GLSL, procedural, texture, visual effect.
  Coordinates with: game-development, media-processing.
metadata:
  version: "1.0.0"
  category: "graphics"
  triggers: "shader, GLSL, procedural, texture, visual effect, WebGL"
  success_metrics: "shader compiles, visuals render"
  coordinates_with: "game-development, media-processing"
---

# Shader

> GLSL fragment shaders. Every pixel in parallel. Math → Visuals.

---

## Core Concept

Fragment shaders execute **on every pixel simultaneously**:
- Input: `gl_FragCoord` (pixel position)
- Output: `gl_FragColor` (RGBA 0.0-1.0)
- Stateless: No cross-thread communication

---

## Standard Uniforms

```glsl
uniform float u_time;       // Elapsed seconds
uniform vec2 u_resolution;  // Canvas size
uniform vec2 u_mouse;       // Mouse position

// Normalize coordinates
vec2 st = gl_FragCoord.xy / u_resolution;
```

---

## Essential Functions

| Function | Purpose |
|----------|---------|
| `mix(a,b,t)` | Linear interpolate |
| `step(edge,x)` | Hard threshold |
| `smoothstep(e0,e1,x)` | Smooth threshold |
| `fract(x)` | Fractional part |
| `length(v)` | Vector magnitude |
| `distance(a,b)` | Euclidean distance |

---

## Quick Patterns

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

## Topics

| Category | Techniques |
|----------|------------|
| Shapes | SDF, circles, rectangles, polar |
| Patterns | Tiling, fract, matrices |
| Noise | Random, Perlin, simplex, Voronoi |
| Textures | Clouds, marble, wood, terrain |

---

## Tools

| Tool | Purpose |
|------|---------|
| **Book of Shaders** | thebookofshaders.com |
| **ShaderToy** | shadertoy.com |
| **glslViewer** | CLI for .frag files |
| **LYGIA** | lygia.xyz shader library |

---

## 🔗 Related

| Item | Type | Purpose |
|------|------|---------|
| `game-development` | Skill | Game graphics |
| `media-processing` | Skill | Visual effects |

---

⚡ PikaKit v3.9.66
