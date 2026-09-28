---
name: game-art
description: Game art principles. Visual style selection, asset pipeline, animation workflow.
metadata:
  id: game-development/game-art
  schema_version: "2.0.0"
  type: knowledge
  category: game
  risk_tier: standard
  version: "3.9.224"
  author: pikakit
  triggers: ["game art","art style","asset pipeline","animation workflow"]
  negative_triggers: ["sound design","network protocol","physics tuning"]
  coordinates_with: ["game-development","game-development/game-audio","ai-artist"]
  capabilities: ["art style guides","texture compression","rigging conventions","sprite sheet generation"]
  platforms: ["cross-platform"]
  last_reviewed: "2026-09-28"
  review_interval_days: 365
---

# Game Art Principles

> Visual design thinking for games - style selection, asset pipelines, and art direction.

---

## 1. Art Style Selection

### Decision Tree

```
What feeling should the game evoke?
│
├── Nostalgic / Retro
│   ├── Limited palette? → Pixel Art
│   └── Hand-drawn feel? → Vector / Flash style
│
├── Realistic / Immersive
│   ├── High budget? → PBR 3D
│   └── Stylized realism? → Hand-painted textures
│
├── Approachable / Casual
│   ├── Clean shapes? → Flat / Minimalist
│   └── Soft feel? → Gradient / Soft shadows
│
└── Unique / Experimental
    └── Define custom style guide
```

### Style Comparison Matrix

| Style | Production Speed | Skill Floor | Scalability | Best For |
|-------|------------------|-------------|-------------|----------|
| **Pixel Art** | Medium | Medium | Hard to hire | Indie, retro |
| **Vector/Flat** | Fast | Low | Easy | Mobile, casual |
| **Hand-painted** | Slow | High | Medium | Fantasy, stylized |
| **PBR 3D** | Slow | High | AAA pipeline | Realistic games |
| **Low-poly** | Fast | Medium | Easy | Indie 3D |
| **Cel-shaded** | Medium | Medium | Medium | Anime, cartoon |

---

## 2. Asset Pipeline Decisions

### 2D Pipeline

| Phase | Tool Options | Output |
|-------|--------------|--------|
| **Concept** | Paper, Procreate, Photoshop | Reference sheet |
| **Creation** | Aseprite, Photoshop, Krita | Individual sprites |
| **Atlas** | TexturePacker, Aseprite | Spritesheet |
| **Animation** | Spine, DragonBones, Frame-by-frame | Animation data |
| **Integration** | Engine import | Game-ready assets |

### 3D Pipeline

| Phase | Tool Options | Output |
|-------|--------------|--------|
| **Concept** | 2D art, Blockout | Reference |
| **Modeling** | Blender, Maya, 3ds Max | High-poly mesh |
| **Retopology** | Blender, ZBrush | Game-ready mesh |
| **UV/Texturing** | Substance Painter, Blender | Texture maps |
| **Rigging** | Blender, Maya | Skeletal rig |
| **Animation** | Blender, Maya, Mixamo | Animation clips |
| **Export** | FBX, glTF | Engine-ready |

---

## 3. Color Theory Decisions

### Palette Selection

| Goal | Strategy | Example |
|------|----------|---------|
| **Harmony** | Complementary or analogous | Nature games |
| **Contrast** | High saturation differences | Action games |
| **Mood** | Warm/cool temperature | Horror, cozy |
| **Readability** | Value contrast over hue | Gameplay clarity |

### Color Principles

- **Hierarchy:** Important elements should pop
- **Consistency:** Same object = same color family
- **Context:** Colors read differently on backgrounds
- **Accessibility:** Don't rely only on color

---

## 4. Animation Principles

### Core Principles

Apply squash & stretch, anticipation, clear staging, follow-through, arcs, and readable exaggeration to ensure impactful player feedback.

### Frame Count Guidelines

| Action Type | Typical Frames | Feel |
|-------------|----------------|------|
| Idle breathing | 4-8 | Subtle |
| Walk cycle | 6-12 | Smooth |
| Run cycle | 4-8 | Energetic |
| Attack | 3-6 | Snappy |
| Death | 8-16 | Dramatic |

---

## 5. Resolution & Scale Decisions

### 2D Resolution by Platform

| Platform | Base Resolution | Sprite Scale |
|----------|-----------------|--------------|
| Mobile | 1080p | 64-128px characters |
| Desktop | 1080p-4K | 128-256px characters |
| Pixel art | 320x180 to 640x360 | 16-32px characters |

### Consistency Rule

Choose a base unit and stick to it:
- Pixel art: Work at 1x, scale up (never down)
- HD art: Define DPI, maintain ratio
- 3D: 1 unit = 1 meter (industry standard)

---

## 6. Asset Organization

### Naming Convention

```
[type]_[object]_[variant]_[state].[ext]

Examples:
spr_player_idle_01.png
tex_stone_wall_normal.png
mesh_tree_oak_lod2.fbx
```

### Folder Structure Principle

Organize assets by domain: characters/, environment/, ui/, and effects/.

---

## 7. Anti-Patterns

| Don't | Do |
|-------|-----|
| Mix art styles randomly | Define and follow style guide |
| Work at final resolution only | Create at source resolution |
| Ignore silhouette readability | Test at gameplay distance |
| Over-detail background | Focus detail on player area |
| Skip color testing | Test on target display |

---

> **Remember:** Art serves gameplay. If it doesn't help the player, it's decoration.

---

## 🔗 Related

| Item | Type | When to Read |
|------|------|--------------|
| [../SKILL.md](../SKILL.md) | Parent | Game loop and pattern selection |
| `game-development/2d-games` | Sibling | Sprite and tilemap systems |
| `game-development/3d-games` | Sibling | 3D rendering and LOD |
| `game-development/game-audio` | Sibling | Audio to complement visuals |
| `ai-artist` | Skill | AI-generated game assets |

---

⚡ PikaKit v3.9.224
