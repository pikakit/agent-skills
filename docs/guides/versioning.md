# Versioning Guidelines

This project follows [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## Version Format

```
MAJOR.MINOR.PATCH
  │      │     └── Bug fixes, small improvements
  │      └──────── New features, non-breaking changes
  └─────────────── Breaking changes, major restructures
```

## When to Bump Versions

### MAJOR (1.0.0 → 2.0.0)
- Breaking changes to content structure
- Incompatible skill format changes
- Major architecture overhaul

### MINOR (1.0.0 → 1.1.0)
- New agents added
- New skills added
- New workflows added
- Significant content improvements

### PATCH (1.0.0 → 1.0.1)
- Bug fixes in agents/skills
- Typo corrections
- Documentation updates
- Minor content improvements

## Examples

| Change | Version Bump |
|--------|--------------|
| Add 3 new agents | 1.0.0 → 1.1.0 |
| Fix typo in skill | 1.1.0 → 1.1.1 |
| Add 5 new skills | 1.1.1 → 1.2.0 |
| Update workflow logic | 1.2.0 → 1.2.1 |
| New skill format | 1.2.1 → 2.0.0 |

---

**Current Version:** 3.7.1

