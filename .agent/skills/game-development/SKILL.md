---
name: game-development
description: This skill should be used when the user asks to architect a game, choose a game platform workflow, coordinate game subsystems, or route work to a game-development specialty.
metadata:
  id: game-development
  schema_version: "2.0.0"
  type: knowledge
  category: game
  risk_tier: high
  version: "3.9.224"
  author: pikakit
  triggers: ["architect a game", "choose a game platform workflow", "coordinate game subsystems", "route game-development work"]
  negative_triggers: ["build a non-game web application", "create only a static illustration", "profile a general backend service"]
  coordinates_with: [game-development/game-design, game-development/game-art, game-development/game-audio, perf-optimizer]
  capabilities: ["game architecture routing", "runtime loop design", "subsystem coordination", "release verification"]
  platforms: [desktop, console, mobile, web, XR]
  last_reviewed: "2026-09-28"
  review_interval_days: 180
---

# Game Development

Route game work by player experience, dimension, platform, networking model, and production discipline.

## Routing

| Need | Skill |
|---|---|
| Mechanics, economy, progression, playtests | `game-design` |
| Sprites, tilemaps, 2D physics | `2d-games` |
| Rendering, shaders, 3D worlds | `3d-games` |
| Asset pipeline and art direction | `game-art` |
| Sound, music, mixing | `game-audio` |
| Networked simulation | `multiplayer` |
| Browser runtime | `web-games` |
| Phones and tablets | `mobile-games` |
| Desktop and console | `pc-games` |
| Immersive interaction | `vr-ar` |

## Core Workflow

1. Define target devices, player count, input, accessibility needs, content scale, persistence, performance targets, and release constraints.
2. Build the smallest playable loop and establish deterministic ownership of input, simulation, rendering, audio, and persistence.
3. Measure frame time, memory, loading, network behavior, and device constraints on representative hardware.
4. Add content through versioned, validated pipelines with fallback behavior.
5. Test gameplay, accessibility, save compatibility, failure recovery, and platform lifecycle events.
6. Use `rules/production-gates.md` before release.

Treat frame rates and budgets as project targets derived from platform requirements, not universal constants.
