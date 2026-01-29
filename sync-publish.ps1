# Sync and Publish Script - Agent Skill Kit
# Usage: .\sync-publish.ps1 -Version "3.3.0"

param(
    [Parameter(Mandatory = $false)]
    [string]$Version
)

# Get version from package.json if not provided
if (-not $Version) {
    $packageJson = Get-Content "package.json" | ConvertFrom-Json
    $Version = $packageJson.version
}

Write-Host "🚀 Publishing Agent Skill Kit v$Version" -ForegroundColor Cyan

# Validation
Write-Host "`n📋 Pre-publish checks..." -ForegroundColor Yellow

# 1. Run tests
Write-Host "  Running tests..."
npm run test:studio 2>&1 | Out-Null
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Tests failed!" -ForegroundColor Red
    exit 1
}
Write-Host "  ✓ Tests passed" -ForegroundColor Green

# 2. Run audit
Write-Host "  Running security audit..."
npm audit 2>&1 | Out-Null
if ($LASTEXITCODE -ne 0) {
    Write-Host "  ⚠ Vulnerabilities found (continuing...)" -ForegroundColor Yellow
}

# 3. Git operations
Write-Host "`n📦 Git operations..." -ForegroundColor Yellow
git add -A
git commit -m "chore: release v$Version"
git tag "v$Version"
git push origin main
git push --tags

Write-Host "`n✅ Successfully published v$Version!" -ForegroundColor Green
Write-Host "   GitHub Release will be created automatically by CI/CD"
