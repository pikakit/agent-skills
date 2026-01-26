# Commit Validation Rules

## Overview
These rules enforce commit message standards for CoinPika codebase.

## Mandatory Rules

### 1. Conventional Commits Format
All commits MUST follow Conventional Commits specification:

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

### 2. Doctrine Tagging
Commits touching the following areas MUST include doctrine tags:

| Scope/Area | Required Tags |
|------------|---------------|
| api/, server/ | Law-1, Architecture |
| chart, graph | Law-3, Law-4 |
| mobile, gesture | Frontend-Mobile |
| data, price | Law-1, Law-2 |

Format: `[doctrine: Tag1, Tag2]`

### 3. Breaking Changes
Breaking changes MUST:
- Include `!` after type/scope
- Include `BREAKING CHANGE:` in footer
- Document rollback plan

## Validation Checklist

- [ ] Type is valid (feat, fix, refactor, etc.)
- [ ] Description is imperative mood, lowercase
- [ ] Doctrine tags present if required
- [ ] Body explains WHY, not what
- [ ] Breaking changes properly marked

## Enforcement

Run validation:
```bash
bash scripts/validate-commit-msg.sh .git/COMMIT_EDITMSG
```

Or use interactive formatter:
```bash
node scripts/format-commit.js
```
