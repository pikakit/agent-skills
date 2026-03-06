---
name: remotion
description: >-
  Video creation in React with animations, compositions, and programmatic rendering.
  Timing, interpolation, sequencing, audio sync.
  Triggers on: Remotion, video creation, programmatic video, React animation.
  Coordinates with: react-architect, media-processing.
metadata:
  version: "2.0.0"
  category: "media"
  triggers: "Remotion, video creation, programmatic video, React animation, composition"
  success_metrics: "video renders, animations smooth, audio synced"
  coordinates_with: "react-architect, media-processing, ai-artist"
---

# Remotion — Programmatic Video in React

> Frame math: fps × seconds = frames. Spring for motion. Sequence for scenes.

---

## When to Use

| Need | Pattern |
|------|---------|
| Sequence scenes | `<Sequence from={frame} durationInFrames={frames}>` |
| Animate values | `interpolate()` (linear) or `spring()` (natural) |
| Control audio | `<Audio>` with `startFrom`, `endAt`, `volume` |
| Display captions | Word highlighting, SRT import |
| Render output | CLI: `npx remotion render` |

---

## System Boundaries

| Owned by This Skill | NOT Owned |
|---------------------|-----------|
| Composition architecture | React component design (→ react-architect) |
| Animation patterns (interpolate, spring) | Video post-processing (→ media-processing) |
| Audio sync configuration | Image asset generation (→ ai-artist) |
| Render configuration | CLI execution |

**Expert decision skill:** Produces pattern recommendations. Does not render video.

---

## Frame Math (Deterministic)

```
durationInFrames = fps × seconds
```

Default fps: **30**. All timing in frame numbers (0-indexed).

---

## Animation Selection (Deterministic)

| Motion Type | Method | Use |
|-------------|--------|-----|
| Linear (fade, slide) | `interpolate(frame, [0,30], [0,1], {extrapolateRight:'clamp'})` | Opacity, position |
| Natural (bounce, ease) | `spring({frame, fps, config: {damping: 200}})` | Entrances, exits |

**Rule:** If animation looks jittery → switch from interpolate to spring.

---

## Composition Patterns (3 — Fixed)

| Pattern | Use For |
|---------|---------|
| `<Sequence>` | Timed scenes with `from` and `durationInFrames` |
| `<Series>` | Sequential scenes (auto-calculated offsets) |
| `<Folder>` | Grouping compositions in Studio sidebar |

---

## Audio Configuration (3 Controls)

| Control | Type | Description |
|---------|------|-------------|
| `startFrom` | frame number | Start playback at this frame |
| `endAt` | frame number | Stop playback at this frame |
| `volume` | 0.0 - 1.0 | Playback volume |

---

## Topic Domains (8)

| Domain | Key Concepts |
|--------|-------------|
| Animations | Timing, springs, interpolation |
| Compositions | Defining, stills, folders |
| Assets | Images, videos, fonts |
| Audio | Volume, speed, pitch |
| Captions | TikTok-style, SRT import |
| 3D | Three.js, React Three Fiber |
| Transitions | Scene transitions |
| Measuring | Text dimensions, fit text |

---

## CLI Commands (3)

```bash
npx remotion preview                              # Preview in browser
npx remotion render my-video out/video.mp4         # Render to file
npx remotion render --props='{"title":"Hello"}'    # Render with props
```

---

## Codec Routing (Deterministic)

| Output Format | Codec |
|---------------|-------|
| `.mp4` | h264 |
| `.webm` | vp8 |
| `.gif` | gif |

---

## Error Taxonomy

| Code | Recoverable | Trigger |
|------|-------------|---------|
| `ERR_INVALID_REQUEST_TYPE` | No | Request type not supported |
| `ERR_INVALID_FPS` | Yes | fps is not a positive integer |
| `ERR_UNKNOWN_FORMAT` | Yes | Format not mp4, webm, or gif |

**Zero internal retries.** Same context = same recommendation.

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| Audio not synced | Check fps matches audio and verify startFrom frame |
| Animation jittery | Use `spring()` instead of `interpolate()` |
| Slow render | Reduce resolution or increase `--concurrency` |
| Text overflow | Use `measureText()` for dynamic sizing |

---

## 📑 Content Map

| File | Description | When to Read |
|------|-------------|--------------|
| [engineering-spec.md](references/engineering-spec.md) | Full spec | Architecture review |

---

## 🔗 Related

| Item | Type | Purpose |
|------|------|---------|
| `react-architect` | Skill | React patterns |
| `media-processing` | Skill | Video processing |
| `ai-artist` | Skill | Asset generation |

---

⚡ PikaKit v3.9.84
