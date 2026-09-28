---
name: media-processing
description: This skill should be used when the user asks to convert, inspect, resize, transcode, or optimize video, audio, or raster image files.
metadata:
  id: media-processing
  schema_version: "2.0.0"
  type: knowledge
  category: operations
  risk_tier: high
  version: "3.9.224"
  author: pikakit
  triggers: ["transcode a video", "convert an audio file", "resize an image", "inspect media metadata"]
  negative_triggers: ["generate a new image from a prompt", "design UI assets", "optimize a web page without source media"]
  coordinates_with: [perf-optimizer, studio, ai-artist]
  capabilities: ["media tool selection", "non-destructive command planning", "quality verification"]
  platforms: [linux, macos, windows]
  last_reviewed: "2026-09-28"
  review_interval_days: 180
---

# Media Processing

Select FFmpeg for video and audio and ImageMagick for raster transformations. Inspect inputs before choosing codecs, dimensions, frame rates, color handling, or quality parameters.

## Workflow

1. Identify format, streams, duration, dimensions, color metadata, and output constraints.
2. Preserve the original and write to a new explicit path.
3. Choose supported codecs and filters from local tool capabilities.
4. Bound resource use and reject ambiguous batches or path traversal.
5. Run the conversion and capture diagnostics.
6. Probe the output and compare duration, streams, dimensions, and perceptual quality.

## Boundaries

Do not advertise a background-removal CLI unless it is installed and its model/license are verified. Route generative work to `ai-artist` and UI asset design to `studio`.

Read `rules/engineering-spec.md` for safe command patterns and exit gates.
