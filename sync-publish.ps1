# Sync and Publish Script - v3.2.0
param([string]$Version = "3.2.0")

Write-Host "Syncing and Publishing v$Version"

$AddSkillKitPath = "C:\Users\sofma\Desktop\add-agent-skill-kit"

if (Test-Path $AddSkillKitPath) {
    Set-Location $AddSkillKitPath
    
    Write-Host "Updating version..."
    npm version $Version --no-git-tag-version
    
    Write-Host "Git operations..."
    git add -A
    git commit -m "chore: bump version to $Version"
    git tag "v$Version"
    git push
    git push --tags
    
    Write-Host "Publishing to npm..."
    npm publish --access public
    
    Write-Host "SUCCESS: add-skill-kit@$Version published!"
} else {
    Write-Host "ERROR: Path not found"
    exit 1
}
