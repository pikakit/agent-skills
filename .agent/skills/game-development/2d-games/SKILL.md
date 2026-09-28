---
name: 2d-games
description: 2D game development principles. Sprites, tilemaps, physics, camera.
metadata:
  id: game-development/2d-games
  schema_version: "2.0.0"
  type: knowledge
  category: game
  risk_tier: standard
  version: "3.9.224"
  author: pikakit
  triggers: ["2D game","sprite animation","tilemap","2D physics","2D camera"]
  negative_triggers: ["3D mesh modeling","photorealistic rendering","XR tracking"]
  coordinates_with: ["game-development","game-development/game-art","perf-optimizer"]
  capabilities: ["sprite atlas packing","tilemap layering","fixed-step 2D physics","pixel-perfect camera"]
  platforms: ["cross-platform"]
  last_reviewed: "2026-09-28"
  review_interval_days: 365
---

# 2D Game Development

> Principles for 2D game systems.

---

## 1. Sprite Systems

### Sprite Organization

| Component | Purpose |
|-----------|---------|
| **Atlas** | Combine textures, reduce draw calls |
| **Animation** | Frame sequences |
| **Pivot** | Rotation/scale origin |
| **Layering** | Z-order control |

### Animation Principles

- Frame rate: 8-24 FPS typical
- Squash and stretch for impact
- Anticipation before action
- Follow-through after action

---

## 2. Tilemap Design

### Tile Considerations

| Factor | Recommendation |
|--------|----------------|
| **Size** | 16x16, 32x32, 64x64 |
| **Auto-tiling** | Use for terrain |
| **Collision** | Simplified shapes |

### Layers

| Layer | Content |
|-------|---------|
| Background | Non-interactive scenery |
| Terrain | Walkable ground |
| Props | Interactive objects |
| Foreground | Parallax overlay |

---

## 3. 2D Physics

### Collision Shapes

| Shape | Use Case |
|-------|----------|
| Box | Rectangular objects |
| Circle | Balls, rounded |
| Capsule | Characters |
| Polygon | Complex shapes |

### Physics Considerations

- Pixel-perfect vs physics-based
- Fixed timestep for consistency
- Layers for filtering

---

## 4. Camera Systems

### Camera Types

| Type | Use |
|------|-----|
| **Follow** | Track player |
| **Look-ahead** | Anticipate movement |
| **Multi-target** | Two-player |
| **Room-based** | Metroidvania |

### Screen Shake

- Short duration (50-200ms)
- Diminishing intensity
- Use sparingly

---

## 5. Genre Patterns

### Platformer

- Coyote time (leniency after edge)
- Jump buffering
- Variable jump height

### Top-down

- 8-directional or free movement
- Aim-based or auto-aim
- Consider rotation or not

---

## 6. Anti-Patterns

| ❌ Don't | ✅ Do |
|----------|-------|
| Separate textures | Use atlases |
| Complex collision shapes | Simplified collision |
| Jittery camera | Smooth following |
| Pixel-perfect on physics | Choose one approach |

---

> **Remember:** 2D is about clarity. Every pixel should communicate.

---

## 🔗 Related

| Item | Type | When to Read |
|------|------|--------------|
| [../SKILL.md](../SKILL.md) | Parent | Game loop, perf budget, pattern selection |
| `game-development/3d-games` | Sibling | If project has 3D elements |
| `game-development/game-art` | Sibling | Sprite art style and animation |
| `game-development/web-games` | Sibling | If targeting browser |

---

⚡ PikaKit v3.9.224
