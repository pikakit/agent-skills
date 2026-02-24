---
description: Game development workflow with platform-specific routing. From concept to polished game with multiplayer, asset pipeline, and platform builds.
---

# /game - Game Development

$ARGUMENTS

---

## Purpose

Orchestrates game development from concept to published game. Routes to sub-skills for platform, multiplayer, audio, and visual effects. Includes asset pipeline, build matrix, and store submission.

---

## 🤖 Meta-Agents Integration

| Phase | Agent | Action |
|-------|-------|--------|
| **Design** | `assessor` | Evaluate scope, platform risks, perf budget |
| **Checkpoint** | `recovery` | Save state before major changes |
| **Build** | `orchestrator` | Coordinate parallel tasks (art + audio + code) |
| **Conflict** | `critic` | Design vs. performance trade-offs |
| **Post-Build** | `learner` | Log patterns for reuse |

---

## Phase 1: Requirements

1. **Ask critical questions:**

   | Question | Options | Impact |
   |----------|---------|--------|
   | Platform? | Web / Mobile / PC / Console / VR-AR | Engine + build pipeline |
   | Dimension? | 2D / 2.5D / 3D | Rendering pipeline |
   | Genre? | Platformer / Puzzle / Shooter / RPG / Sandbox | Core mechanics |
   | Multiplayer? | Solo / Local co-op / Online PvP / MMO | Networking stack |
   | Target FPS? | 30 / 60 / 120 | Performance budget |

2. **Load:** `.agent/skills/game-development/SKILL.md`

---

## Phase 2: Platform Routing

| Target | Sub-skill | Engine |
|--------|-----------|--------|
| Web | `game-development/web-games` | Phaser / PixiJS / Three.js |
| Mobile | `game-development/mobile-games` | Unity / Godot |
| PC | `game-development/pc-games` | Unity / Godot / Unreal |
| VR/AR | `game-development/vr-ar` | Unity XR / A-Frame |

| Dimension | Sub-skill | Key Concerns |
|-----------|-----------|-------------|
| 2D | `game-development/2d-games` | Sprite batching, atlas, tile maps |
| 3D | `game-development/3d-games` | LOD, occlusion culling, lighting |

---

## Phase 3: Core Game Loop

```
FIXED TIMESTEP LOOP:
accumulator = 0
while (running):
    deltaTime = now() - lastTime
    accumulator += deltaTime
    INPUT  → Read player actions
    while (accumulator >= FIXED_DT):
        UPDATE → Physics + game logic (deterministic)
        accumulator -= FIXED_DT
    RENDER → Interpolated draw (smooth)
```

| Target | Budget/Frame | Breakdown |
|--------|-------------|-----------|
| **60 FPS** | 16.67ms | Input 1ms · Physics 3ms · AI 2ms · Logic 4ms · Render 5ms |
| **30 FPS** | 33.33ms | Input 1ms · Physics 5ms · AI 5ms · Logic 10ms · Render 10ms |

---

## Phase 4: Architecture Patterns

| Pattern | Use When |
|---------|----------|
| **State Machine** | 3-5 discrete states (Player: Idle→Run→Jump) |
| **Object Pooling** | Frequent spawn/destroy (bullets, particles) |
| **Observer/Events** | Cross-system communication |
| **ECS** | Thousands of similar entities |
| **Command** | Undo, replay, networking |
| **Behavior Tree** | Complex AI decisions |

**Rule:** Start with State Machine. Add ECS only when profiler shows bottleneck.

---

## Phase 5: Multiplayer & Networking

| Model | Use When | Complexity |
|-------|----------|------------|
| **Lock-step** | Turn-based, RTS | Low |
| **Client-server (authoritative)** | FPS, action, MMO | High |
| **Client prediction + reconciliation** | Fast-paced PvP | Very high |
| **Relay (P2P via server)** | Co-op, casual | Medium |

**Networking checklist:**
- [ ] State serialization / delta compression
- [ ] Client-side prediction + server reconciliation
- [ ] Lobby + matchmaking system
- [ ] Anti-cheat (server-authoritative)
- [ ] Graceful disconnect / reconnection

| Component | Web | Native |
|-----------|-----|--------|
| Transport | WebSocket / WebRTC | TCP/UDP (ENet) |
| Protocol | JSON (dev) → Binary (prod) | Protobuf |
| Server | Colyseus / Socket.io | Photon / Mirror |

---

## Phase 6: Asset Pipeline

```
assets/
├── sprites/       # 2D art (PNG → atlas)
├── models/        # 3D meshes (glTF → optimized)
├── audio/sfx/     # Sound effects (WAV → OGG)
├── audio/music/   # Background music (OGG, loopable)
├── shaders/       # Visual effects (GLSL/HLSL)
└── data/          # JSON configs, level data
```

| Asset | Optimization | Target |
|-------|-------------|--------|
| Sprites | Texture atlasing | <4096×4096 per atlas |
| 3D Models | LOD, mesh simplification | <10K tris (mobile) |
| Audio SFX | Mono, 22kHz, OGG | <100KB per sound |
| Shaders | Load `shader` skill | GPU-efficient |

---

## Phase 7: Audio & Input

**Audio:** Pool sources (max 32). Priority: UI > Player > Enemies > Ambient. Crossfade music (500ms).

**Input abstraction (mandatory):**
```
"jump"   → Space / Gamepad A / Touch tap
"move"   → WASD / Left stick / Virtual joystick
"attack" → Left click / Gamepad X / Touch tap
```

---

## Phase 8: Build & Export

| Platform | Build Tool | Distribution |
|----------|-----------|-------------|
| Web | Vite / esbuild | itch.io / Newgrounds |
| Android | Gradle / Unity | Google Play |
| iOS | Xcode / Unity | App Store |
| Windows | Electron / Unity / Godot | Steam |
| macOS/Linux | Electron / Unity / Godot | Steam / itch.io |

**Optimization:** Tree shake (-30-50%) → Minify (-20%) → Compress assets (-40-60%) → Code split → CDN.

---

## Phase 9: Optimization & Testing

**Profiling priority:** Algorithm → Batching → Pooling → LOD → Culling → Atlas

**Test checklist:**
- [ ] Maintains target FPS on lowest-spec device
- [ ] No memory leaks after 10+ minutes
- [ ] Works on all target platforms
- [ ] Input responsive (<100ms lag)
- [ ] Save/load works correctly
- [ ] Multiplayer sync verified (if applicable)

---

## Anti-Patterns

| ❌ Don't | ✅ Do |
|----------|-------|
| Update everything every frame | Events, dirty flags |
| Create objects in hot loops | Object pooling |
| Optimize without profiling | Profile first |
| Mix input with logic | Abstract input layer |
| Hardcode level data | Data-driven (JSON) |
| Ship without playtesting | Playtest early |

---

## Examples

```
/game 2D platformer for web browser
/game mobile puzzle game with Unity
/game 3D RPG with multiplayer support
/game online multiplayer shooter with client prediction
```

---

## 🔗 Workflow Chain

**Skills (3):** `game-development` · `shader` · `perf-optimizer`

| After /game | Run | Purpose |
|-------------|-----|---------|
| Need testing | `/validate` | Run game tests |
| Performance | `/optimize` | Profile bottlenecks |
| UI polish | `/studio` | Design game UI/HUD |
| Ready to ship | `/launch` | Publish to store |

---

**Version:** 2.0.0 · **Chain:** game-development · **Updated:** v3.9.62
