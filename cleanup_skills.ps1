param()

$skillsDir = "c:\Users\sofma\Desktop\agent-skill-kit\.agent\skills"
$fixed = 0

Get-ChildItem "$skillsDir\*\SKILL.md" | ForEach-Object {
    $file = $_.FullName
    $skillName = Split-Path (Split-Path $file -Parent) -Leaf
    $content = Get-Content $file -Raw
    
    # Pattern: from "## Rule Categories by Priority" to just before "## 📑 Content Map"
    # This removes: Rule Categories, Quick Reference, How to Use, Full Compiled Document
    $pattern = '(?s)\r?\n---\r?\n\r?\n## Rule Categories by Priority.*?(?=\r?\n## 📑 Content Map)'
    
    if ($content -match '## Rule Categories by Priority') {
        $newContent = $content -replace $pattern, "`n`n## 📑 Content Map"
        
        # Also handle case without --- separator before Rule Categories
        $pattern2 = '(?s)\r?\n\r?\n## Rule Categories by Priority.*?(?=## 📑 Content Map)'
        $newContent = $newContent -replace $pattern2, "`n`n## 📑 Content Map"
        
        if ($newContent -ne $content) {
            $oldLines = ($content -split "`n").Count
            Set-Content $file $newContent -NoNewline
            $newLines = ($newContent -split "`n").Count
            $removed = $oldLines - $newLines
            Write-Host "✅ $skillName — removed $removed lines"
            $script:fixed++
        } else {
            Write-Host "⚠️ $skillName — pattern not matched (check manually)"
        }
    }
}

Write-Host "`n📊 Fixed $fixed skills"
