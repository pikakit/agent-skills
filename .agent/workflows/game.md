---
description: Game development workflow with platform-specific routing. From concept to polished game.
---

# Game Development Workflow

> **This workflow orchestrates game development with routing to specialized sub-skills.**

## Phase 1: Requirements Clarification

1. **Ask critical questions:**
   - Platform: Web, Mobile, PC, or VR/AR?
   - Dimension: 2D or 3D?
   - Genre: Platformer, puzzle, shooter, RPG, etc.?
   - Multiplayer: Single-player or multiplayer?

2. **Load game-development orchestrator:**
   ```
   Read: .agent/skills/game-development/SKILL.md
   ```

---

## Phase 2: Platform Routing

3. **Route to platform sub-skill:**

   | Target Platform | Load Sub-skill |
   |-----------------|----------------|
   | Web browser | `game-development/web-games` |
   | Mobile | `game-development/mobile-games` |
   | PC/Desktop | `game-development/pc-games` |
   | VR/AR | `game-development/vr-ar` |

4. **Route to dimension sub-skill:**

   | Dimension | Load Sub-skill |
   |-----------|----------------|
   | 2D (sprites) | `game-development/2d-games` |
   | 3D (meshes) | `game-development/3d-games` |

---

## Phase 3: Core Game Loop

5. **Implement game loop pattern:**
   ```
   INPUT  → Read player actions
   UPDATE → Process game logic (fixed timestep)
   RENDER → Draw the frame (interpolated)
   ```

6. **Apply performance budget (60 FPS = 16.67ms):**
   | System | Budget |
   |--------|--------|
   | Input | 1ms |
   | Physics | 3ms |
   | AI | 2ms |
   | Game Logic | 4ms |
   | Rendering | 5ms |
   | Buffer | 1.67ms |

---

## Phase 4: Specialty Areas

7. **Load specialty sub-skills as needed:**

   | Need | Load Sub-skill |
   |------|----------------|
   | Game design, balancing | `game-development/game-design` |
   | Art, animation | `game-development/game-art` |
   | Audio, music | `game-development/game-audio` |
   | Networking | `game-development/multiplayer` |

---

## Phase 5: Pattern Selection

8. **Choose patterns based on complexity:**

   | Pattern | Use When |
   |---------|----------|
   | State Machine | 3-5 discrete states |
   | Object Pooling | Frequent spawn/destroy |
   | Observer/Events | Cross-system communication |
   | ECS | Thousands of similar entities |
   | Command | Undo, replay, networking |
   | Behavior Tree | Complex AI decisions |

   **Rule:** Start with State Machine. Add ECS only when performance demands.

---

## Phase 6: Input & Collision

9. **Abstract input into actions:**
   ```
   "jump"  → Space, Gamepad A, Touch tap
   "move"  → WASD, Left stick, Virtual joystick
   ```

10. **Choose collision strategy:**
    | Type | Best For |
    |------|----------|
    | AABB | Rectangles, fast |
    | Circle | Round objects |
    | Spatial Hash | Many similar objects |
    | Quadtree | Large worlds |

---

## Phase 7: Optimization & Testing

11. **Apply optimization priority:**
    1. Algorithm (O(n²) → O(n log n))
    2. Batching (reduce draw calls)
    3. Pooling (avoid GC spikes)
    4. LOD (detail by distance)
    5. Culling (skip invisible)

12. **Test checklist:**
    - [ ] Maintains 60 FPS
    - [ ] No memory leaks
    - [ ] Works on target platform
    - [ ] Input feels responsive

---

## Anti-Patterns to Avoid

| ❌ Don't | ✅ Do |
|----------|-------|
| Update everything every frame | Use events, dirty flags |
| Create objects in hot loops | Object pooling |
| Cache nothing | Cache references |
| Optimize without profiling | Profile first |
| Mix input with logic | Abstract input layer |

---

> **Remember:** Great games come from iteration, not perfection. Prototype fast, then polish.
