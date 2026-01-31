# Publishing Guide

## Quick Publish (Automated)

```powershell
# Run sync script to publish both packages
.\sync-publish.ps1
```

This will:

1. ✅ Bump version in add-agent-skill-kit
2. ✅ Git commit & push both repos
3. ✅ Create tags
4. ✅ Publish to npm with --access public

---

## Manual Steps (If Needed)

### add-agent-skill-kit

```powershell
cd C:\Users\sofma\Desktop\add-agent-skill-kit

# 1. Bump version
npm version 3.2.0 --no-git-tag-version

# 2. Commit and push
git add -A
git commit -m "chore: bump version to 3.2.0"
git tag v3.2.0
git push
git push --tags

# 3. Publish to npm
npm publish --access public
```

---

## Version Sync Checklist

When releasing a new version:

- [ ] agent-skill-kit version bumped
- [ ] add-agent-skill-kit version bumped (SAME version!)
- [ ] Both committed to GitHub
- [ ] Both tags created
- [ ] Both pushed to GitHub
- [ ] agentskillskit-cli published to npm
- [ ] add-skill-kit published to npm
- [ ] Test installation:
  ```bash
  npx add-skill-kit@3.2.0 pikakit/agent-skills
  ```

---

## Troubleshooting

### npm login expired

```bash
npm login
# Follow browser authentication
```

### Workspace validation error

Script handles this automatically by running commands in correct directories.

### Permission denied

Ensure you're logged in to npm with correct account and have 2FA set up.

---

## Current Versions

- **agent-skill-kit**: 3.2.0
- **agentskillskit-cli**: 3.2.0
- **add-skill-kit**: 3.2.0

**GitHub Repos:**

- https://github.com/pikakit/agent-skills
- https://github.com/pikakit/add-skill-kit
