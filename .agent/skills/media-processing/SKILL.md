---
name: media-processing
description: >-
  Process video, audio, image with FFmpeg, ImageMagick, RMBG.
  Triggers on: video, audio, image, compress, resize, convert, background removal.
  Coordinates with: perf-optimizer, studio.
metadata:
  category: "devops"
  version: "1.0.0"
  triggers: "video, audio, image, compress, resize, convert, ffmpeg, imagemagick, rmbg"
  coordinates_with: "perf-optimizer, studio"
  success_metrics: "media optimized, correct format"
---

# Media Processing

> **Purpose:** FFmpeg + ImageMagick + RMBG for multimedia processing.

---

## When to Use

| Task | Tool |
|------|------|
| Video encoding/conversion | FFmpeg |
| Audio extraction | FFmpeg |
| Image resize/optimize | ImageMagick |
| Background removal | RMBG |
| GIF from video | FFmpeg |

---

## 🔧 Quick Reference

### Video (FFmpeg)

```bash
# Convert with web optimization
ffmpeg -i input.mov -c:v libx264 -crf 22 -movflags +faststart output.mp4

# Extract audio
ffmpeg -i video.mp4 -vn -c:a copy audio.m4a

# Thumbnail at 5s
ffmpeg -i video.mp4 -ss 00:00:05 -vframes 1 thumb.jpg
```

### Image (ImageMagick)

```bash
# Resize (maintain aspect)
magick input.jpg -resize 800x600 output.jpg

# Batch resize (overwrites!)
mogrify -resize 800x -quality 85 *.jpg

# Optimize JPEG
magick input.jpg -quality 85 -strip output.jpg
```

### Background (RMBG)

```bash
# Basic removal
rmbg input.jpg -o output.png

# High quality
rmbg input.jpg -m briaai -o output.png
```

---

## CRF Quality Guide

| CRF | Quality |
|-----|---------|
| 18 | Visually lossless |
| 22 | Recommended |
| 28 | Smaller, lower quality |

---

## RMBG Models

| Model | Quality | Speed |
|-------|---------|-------|
| briaai | Highest | Slow |
| u2netp | Good | Fast |
| modnet | Balanced | Medium |

---

## Prerequisites

```bash
# macOS
brew install ffmpeg imagemagick
npm install -g rmbg-cli

# Ubuntu
sudo apt-get install ffmpeg imagemagick
npm install -g rmbg-cli
```

---

## Best Practices

- **Backup before `mogrify`** (modifies in-place)
- **Test on single file** before batch
- **Use CRF 22** for video balance
- **Use quality 85** for JPEG balance

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| FFmpeg not found | Install: `brew install ffmpeg` (macOS) or `apt install ffmpeg` |
| ImageMagick policy error | Edit `/etc/ImageMagick-6/policy.xml` to allow operations |
| Output file too large | Increase compression, reduce resolution |
| RMBG quality issues | Use higher resolution source, try different models |

---

## 🔗 Related

| Item | Type | Purpose |
|------|------|---------|
| `perf-optimizer` | Skill | Performance optimization |
| `studio` | Skill | Design assets |

---

⚡ PikaKit v3.9.67
