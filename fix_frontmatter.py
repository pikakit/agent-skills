#!/usr/bin/env python3
"""
Fix SKILL.md frontmatter - Update name field to match new folder names
"""

import os
import re
from pathlib import Path

# Skill name mapping (old_name -> new_name)
SKILL_MAPPING = {
    "intelligent-routing": "SmartRouter",
    "context-engineering": "ContextOptimizer",
    "sequential-thinking": "ReasoningEngine",
    "problem-solving": "CreativeThinking",
    "auto-learn": "SelfEvolution",
    "brainstorming": "IdeaStorm",
    "frontend-design": "DesignSystem",
    "react-patterns": "ReactArchitect",
    "nextjs-best-practices": "NextJSPro",
    "tailwind-patterns": "TailwindKit",
    "aesthetic": "VisualExcellence",
    "frontend": "WebCore",
    "api-patterns": "APIArchitect",
    "database-design": "DataModeler",
    "nodejs-best-practices": "NodeJSPro",
    "vulnerability-scanner": "SecurityScanner",
    "red-team-tactics": "OffensiveSec",
    "mobile-design": "MobileFirst",
    "game-development": "GameEngine",
    "testing-patterns": "TestArchitect",
    "tdd-workflow": "TestDrivenDev",
    "webapp-testing": "E2EAutomation",
    "systematic-debugging": "DebugPro",
    "lint-and-validate": "CodeQuality",
    "deployment-procedures": "CICDPipeline",
    "server-management": "ServerOps",
    "performance-profiling": "PerfOptimizer",
    "plan-writing": "ProjectPlanner",
    "document-skills": "DocProcessor",
    "documentation-templates": "DocTemplates",
    "code-review-checklist": "CodeReview",
    "mcp-builder": "MCPServer",
    "mermaidjs-v11": "DiagramKit",
    "seo-fundamentals": "SEOOptimizer",
    "i18n-localization": "GlobalizationKit",
    "geo-fundamentals": "GeoSpatial",
    "clean-code": "CodeCraft",
    "code-reviewer": "ReviewAutomation",
    "architecture": "SystemDesign",
    "app-builder": "AppScaffold",
    "bash-linux": "ShellScript",
    "behavioral-modes": "AgentModes",
    "debugging": "DebugToolkit",
    "git-conventions": "GitWorkflow",
    "governance": "CodeConstitution",
    "parallel-agents": "MultiAgent",
    "powershell-windows": "PowerShell",
    "python-patterns": "PythonPro",
    "skill-creator": "SkillForge",
}

def update_skill_frontmatter(skill_path: Path, old_name: str, new_name: str):
    """Update YAML frontmatter in SKILL.md"""
    skill_md = skill_path / "SKILL.md"
    
    if not skill_md.exists():
        return False
        
    try:
        content = skill_md.read_text(encoding='utf-8')
        
        # Update name field in frontmatter (handle both formats)
        # Pattern 1: name: old-name
        content = re.sub(
            rf'^name:\s*{re.escape(old_name)}\s*$',
            f'name: {new_name}',
            content,
            flags=re.MULTILINE
        )
        
        # Pattern 2: name: "old-name"
        content = re.sub(
            rf'^name:\s*["\']?{re.escape(old_name)}["\']?\s*$',
            f'name: {new_name}',
            content,
            flags=re.MULTILINE
        )
        
        # Update version to 3.0.0
        content = re.sub(
            r'^version:\s*[\d.]+\s*$',
            'version: 3.0.0',
            content,
            flags=re.MULTILINE
        )
        
        skill_md.write_text(content, encoding='utf-8')
        return True
    except Exception as e:
        print(f"  ✗ Error updating {new_name}: {e}")
        return False

def main():
    skills_dir = Path(".agent/skills")
    
    if not skills_dir.exists():
        print("✗ .agent/skills directory not found!")
        return
        
    print("🔧 Updating SKILL.md frontmatter...")
    print(f"   Skills directory: {skills_dir.absolute()}\n")
    
    updated_count = 0
    
    for old_name, new_name in SKILL_MAPPING.items():
        new_skill_path = skills_dir / new_name
        
        if new_skill_path.exists():
            if update_skill_frontmatter(new_skill_path, old_name, new_name):
                print(f"  ✓ {new_name}/SKILL.md")
                updated_count += 1
        else:
            print(f"  ⚠ {new_name} folder not found")
    
    print(f"\n✅ Updated {updated_count}/{len(SKILL_MAPPING)} SKILL.md files")

if __name__ == "__main__":
    main()
