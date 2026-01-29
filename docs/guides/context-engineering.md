---
name: context-engineering-guide
description: Best practices for managing AI agent context windows efficiently
---

# Context Engineering Guide

> **Bài học từ ClaudeKit-Skills REFACTOR.md**

## 🎯 Core Principle

> "Context engineering isn't about loading more information. It's about loading the **right information at the right time**."

## ❌ Sai lầm phổ biến

```
Skills ≠ Documentation dumps
1,000+ lines SKILL.md = Context sludge
Loading 5-7 skills = 5,000-7,000 tokens wasted
```

## ✅ Progressive Disclosure Architecture

### 3-Tier Loading System

| Tier | Content | Size | When Loaded |
|------|---------|------|-------------|
| **1. Metadata** | YAML frontmatter (name, description) | ~100 words | Always |
| **2. Entry Point** | SKILL.md body | <200 lines | When skill activates |
| **3. References** | references/*.md, scripts/*.py | 200-300 lines each | On-demand |

### 200-Line Rule

```
SKILL.md         < 200 lines  (entry point + navigation)
references/*.md  < 300 lines  (detailed docs)
scripts/*.py     < 300 lines  (executable code)
```

**Nếu > 200 lines → Split thành multiple files**

## 📊 Kết quả đo được

| Metric | Before | After | Improvement |
|--------|--------|-------|-------------|
| Token efficiency | 1x | 4.8x | **380% better** |
| Activation time | 500ms | <100ms | **5x faster** |
| Relevant info ratio | 10% | 90% | **9x more relevant** |
| Initial context load | 15,000 lines | 2,200 lines | **85% reduction** |

## 🔧 Workflow-Centric Skills

### ❌ Tool-centric (bad)
```
cloudflare/        → "Cloudflare docs"
cloudflare-workers/→ "Workers docs"
docker/            → "Docker docs"
gcloud/            → "GCloud docs"
```

### ✅ Workflow-centric (good)
```
devops/            → "Deploy serverless functions"
  ├── references/cloudflare.md
  ├── references/docker.md
  └── references/gcloud.md
```

**Key insight:** Skills là *khả năng thực hiện workflow* chứ không phải *documentation*

## 📝 Writing Style

| ❌ Avoid | ✅ Prefer |
|----------|----------|
| "You should do X" | "To accomplish X, do Y" |
| "If you need to..." | "When X is required, do Y" |
| Second person | Imperative/infinitive form |

## 🧪 Testing Cold Start

1. Clear context completely
2. Activate the skill
3. Measure lines loaded

**Target:** < 500 lines on first activation

## 📋 Checklist for New Skills

- [ ] SKILL.md < 200 lines
- [ ] Each reference file < 300 lines
- [ ] Description contains use cases (for auto-activation)
- [ ] References folder for detailed docs
- [ ] Scripts folder for executable code
- [ ] No duplicate info between SKILL.md and references

## 🔗 Related Skills

- `skill-creator` - Guide for creating effective skills
- `context-engineering` - Advanced context optimization techniques
