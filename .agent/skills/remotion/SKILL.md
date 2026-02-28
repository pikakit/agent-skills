---
name: remotion
description: >-
  Video creation in React with animations, compositions, and programmatic rendering.
  Timing, interpolation, sequencing, audio sync.
  Triggers on: Remotion, video creation, programmatic video, React animation.
  Coordinates with: react-architect, media-processing.
metadata:
  version: "1.0.0"
  category: "media"
  triggers: "Remotion, video creation, programmatic video, React animation, composition"
  success_metrics: "video renders, animations smooth, audio synced"
  coordinates_with: "react-architect, media-processing, ai-artist"
---

# Remotion

> Programmatic video creation in React.

---

## When to Use

| Need | Pattern |
|------|---------|
| Sequence scenes | `<Sequence>` |
| Animate values | `interpolate()` |
| Control audio | `<Audio>` with trim |
| Display captions | Word highlighting |
| Render output | CLI render |

---

## Core Patterns

### Sequencing

```tsx
<Sequence from={30} durationInFrames={90}>
  <MyComponent />
</Sequence>
```

### Animation (Interpolation)

```tsx
const opacity = interpolate(
  frame, 
  [0, 30],      // Frame range
  [0, 1],       // Value range
  { extrapolateRight: 'clamp' }
);
```

### Audio Trimming

```tsx
<Audio 
  src={audioFile} 
  startFrom={150}  // Start at frame 150
  endAt={450}      // End at frame 450
/>
```

### Dynamic Metadata

```tsx
export const calculateMetadata = ({ props }) => ({
  durationInFrames: props.duration * fps,
  fps: 30,
});
```

---

## Topics

| Topic | Description |
|-------|-------------|
| Animations | Timing, springs, interpolation |
| Compositions | Defining, stills, folders |
| Assets | Images, videos, fonts |
| Audio | Volume, speed, pitch |
| Captions | TikTok-style, SRT import |
| 3D | Three.js, React Three Fiber |
| Transitions | Scene transitions |
| Measuring | Text dimensions, fit |

---

## CLI Commands

```bash
# Preview
npx remotion preview

# Render
npx remotion render my-video out/video.mp4

# Render with props
npx remotion render --props='{"title":"Hello"}'
```

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| Audio not synced | Check fps and startFrom |
| Animation jittery | Use spring() instead |
| Slow render | Reduce resolution, use concurrency |
| Text overflow | Use measureText() |

---

## 🔗 Related

| Item | Type | Purpose |
|------|------|---------|
| `react-architect` | Skill | React patterns |
| `media-processing` | Skill | Video processing |

---

⚡ PikaKit v3.9.66
