---
name: imports
description: Maintain clean, maintainable code structure
maturity: IDEAL
confidence: 0.97
evidence: 1 patterns, 2312 detections
trigger: always_on
---

# Imports

> **Intent:** Maintain clean, maintainable code structure
> **Maturity:** IDEAL (97% confidence)
> **Coverage:** 0 mistakes / 1 improvements

**Recommendation:** Perfect - all best practices, no anti-patterns

## ✅ Best Practices (Do This Instead)

### ✅ IMPROVE-004: Before import: verify function exists in target module. Common errors: getLearnedPatterns (use db.lessons), saveKnowledge (in recall.js not common.js)

**Pattern:** `import.*from.*["'](\.\/|\.\.\/)`  
**Applied Count:** 2312 times  
**Last Applied:** 1/27/2026  

**Tags:** code-quality, imports  

## 📊 Evolution Status

**Next Action:** Continue normal learning

## 🎯 When to Apply

This skill applies when:
- Working with **maintainability**
- Goal: Maintain clean, maintainable code structure
- Confidence level: High

## 📈 Confidence Metrics

- **Balance Score:** 100% (improvement/total ratio)
- **Evidence Score:** 90% (validation from hits)
- **Recency Score:** 100% (freshness)
- **Overall Confidence:** 97%

---

*Auto-generated from PikaKit*  
*Source: `.agent/knowledge/mistakes.yaml` + `improvements.yaml`*  
*Generated: 2026-01-27T15:35:44.394Z*