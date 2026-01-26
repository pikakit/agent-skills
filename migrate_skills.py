#!/usr/bin/env python3
"""
Skill Rebranding Migration Script
Automatically renames all 49 skills to FAANG-friendly names
"""

import os
import json
import shutil
from pathlib import Path
from typing import Dict, List
import re

# Skill name mapping (old_name -> new_name)
SKILL_MAPPING = {
    # AI & Agent
    "intelligent-routing": "SmartRouter",
    "context-engineering": "ContextOptimizer",
    "sequential-thinking": "ReasoningEngine",
    "problem-solving": "CreativeThinking",
    "auto-learn": "SelfEvolution",
    "brainstorming": "IdeaStorm",
    
    # Frontend & Design
    "frontend-design": "DesignSystem",
    "react-patterns": "ReactArchitect",
    "nextjs-best-practices": "NextJSPro",
    "tailwind-patterns": "TailwindKit",
    "aesthetic": "VisualExcellence",
    "frontend": "WebCore",
    
    # Backend & Security
    "api-patterns": "APIArchitect",
    "database-design": "DataModeler",
    "nodejs-best-practices": "NodeJSPro",
    "vulnerability-scanner": "SecurityScanner",
    "red-team-tactics": "OffensiveSec",
    
    # Mobile
    "mobile-design": "MobileFirst",
    "game-development": "GameEngine",
    
    # Testing & Quality
    "testing-patterns": "TestArchitect",
    "tdd-workflow": "TestDrivenDev",
    "webapp-testing": "E2EAutomation",
    "systematic-debugging": "DebugPro",
    "lint-and-validate": "CodeQuality",
    
    # DevOps
    "deployment-procedures": "CICDPipeline",
    "server-management": "ServerOps",
    "performance-profiling": "PerfOptimizer",
    
    # Planning & Docs
    "plan-writing": "ProjectPlanner",
    "document-skills": "DocProcessor",
    "documentation-templates": "DocTemplates",
    "code-review-checklist": "CodeReview",
    
    # Specialized
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

class SkillMigrator:
    def __init__(self, agent_dir: Path):
        self.agent_dir = agent_dir
        self.skills_dir = agent_dir / "skills"
        self.backup_dir = agent_dir.parent / ".agent_backup"
        self.errors = []
        
    def create_backup(self):
        """Backup entire .agent directory"""
        print("📦 Creating backup...")
        if self.backup_dir.exists():
            shutil.rmtree(self.backup_dir)
        shutil.copytree(self.agent_dir, self.backup_dir)
        print(f"✅ Backup created: {self.backup_dir}")
        
    def rename_skill_folders(self):
        """Rename all skill folders"""
        print("\n📁 Renaming skill folders...")
        renamed_count = 0
        
        for old_name, new_name in SKILL_MAPPING.items():
            old_path = self.skills_dir / old_name
            new_path = self.skills_dir / new_name
            
            if old_path.exists():
                try:
                    old_path.rename(new_path)
                    print(f"  ✓ {old_name} → {new_name}")
                    renamed_count += 1
                except Exception as e:
                    self.errors.append(f"Failed to rename {old_name}: {e}")
                    print(f"  ✗ {old_name} → Error: {e}")
            else:
                print(f"  ⚠ {old_name} not found (skipping)")
                
        print(f"\n✅ Renamed {renamed_count}/{len(SKILL_MAPPING)} skill folders")
        
    def update_file_references(self, file_path: Path):
        """Update skill references in a single file"""
        try:
            content = file_path.read_text(encoding='utf-8')
            original_content = content
            
            # Replace all old skill names with new ones
            for old_name, new_name in SKILL_MAPPING.items():
                # Match patterns: skills/old-name, @[skills/old-name], "old-name", 'old-name'
                patterns = [
                    (f"skills/{old_name}", f"skills/{new_name}"),
                    (f"@[skills/{old_name}]", f"@[skills/{new_name}]"),
                    (f'"{old_name}"', f'"{new_name}"'),
                    (f"'{old_name}'", f"'{new_name}'"),
                    (f"`{old_name}`", f"`{new_name}`"),
                ]
                
                for old_pattern, new_pattern in patterns:
                    content = content.replace(old_pattern, new_pattern)
            
            if content != original_content:
                file_path.write_text(content, encoding='utf-8')
                return True
            return False
        except Exception as e:
            self.errors.append(f"Failed to update {file_path}: {e}")
            return False
            
    def update_all_references(self):
        """Update references in all relevant files"""
        print("\n📝 Updating references...")
        
        # Files to update
        files_to_check = [
            self.agent_dir / "GEMINI.md",
            self.agent_dir.parent / "README.md",
            self.agent_dir.parent / "INSTALLATION.md",
            self.agent_dir / "ARCHITECTURE.md",
            self.skills_dir / "registry.json",
            self.agent_dir / "skill-lock.json",
        ]
        
        # Add all agent files
        agents_dir = self.agent_dir / "agents"
        if agents_dir.exists():
            files_to_check.extend(agents_dir.glob("*.md"))
        
        # Add all workflow files
        workflows_dir = self.agent_dir / "workflows"
        if workflows_dir.exists():
            files_to_check.extend(workflows_dir.glob("*.md"))
        
        updated_count = 0
        for file_path in files_to_check:
            if file_path.exists():
                if self.update_file_references(file_path):
                    print(f"  ✓ Updated: {file_path.name}")
                    updated_count += 1
        
        print(f"\n✅ Updated references in {updated_count} files")
        
    def update_registry(self):
        """Update registry.json with new skill names"""
        print("\n📋 Updating registry.json...")
        registry_path = self.skills_dir / "registry.json"
        
        if not registry_path.exists():
            print("  ⚠ registry.json not found (skipping)")
            return
            
        try:
            with open(registry_path, 'r', encoding='utf-8') as f:
                registry = json.load(f)
            
            # Update skill names in registry
            if isinstance(registry, dict) and 'skills' in registry:
                updated_skills = []
                for skill in registry.get('skills', []):
                    if 'name' in skill:
                        old_name = skill['name']
                        if old_name in SKILL_MAPPING:
                            skill['name'] = SKILL_MAPPING[old_name]
                    updated_skills.append(skill)
                registry['skills'] = updated_skills
                
            with open(registry_path, 'w', encoding='utf-8') as f:
                json.dump(registry, f, indent=2)
                
            print("  ✓ registry.json updated")
        except Exception as e:
            self.errors.append(f"Failed to update registry: {e}")
            print(f"  ✗ Error: {e}")
            
    def verify_migration(self):
        """Verify all skills exist and no broken references"""
        print("\n🔍 Verifying migration...")
        
        # Check all new skill folders exist
        missing_skills = []
        for new_name in SKILL_MAPPING.values():
            skill_path = self.skills_dir / new_name
            if not skill_path.exists():
                missing_skills.append(new_name)
                
        if missing_skills:
            print(f"  ✗ Missing skills: {', '.join(missing_skills)}")
            return False
        
        print(f"  ✓ All {len(SKILL_MAPPING)} skills exist")
        
        # Check for any remaining old skill name references
        old_refs_found = []
        for file_path in self.agent_dir.rglob("*.md"):
            try:
                content = file_path.read_text(encoding='utf-8')
                for old_name in SKILL_MAPPING.keys():
                    if f"skills/{old_name}" in content:
                        old_refs_found.append(f"{file_path.name}: {old_name}")
            except:
                pass
                
        if old_refs_found:
            print(f"  ⚠ Found {len(old_refs_found)} old skill references:")
            for ref in old_refs_found[:5]:  # Show first 5
                print(f"    - {ref}")
            return False
            
        print("  ✓ No old skill references found")
        return True
        
    def rollback(self):
        """Rollback to backup if something went wrong"""
        print("\n🔄 Rolling back changes...")
        if self.backup_dir.exists():
            shutil.rmtree(self.agent_dir)
            shutil.copytree(self.backup_dir, self.agent_dir)
            print("✅ Rollback complete")
        else:
            print("✗ No backup found!")
            
    def run(self, dry_run=False):
        """Execute full migration"""
        print("🚀 Starting Skill Migration")
        print(f"   Agent Directory: {self.agent_dir}")
        print(f"   Skills to rename: {len(SKILL_MAPPING)}")
        print(f"   Dry run: {dry_run}\n")
        
        if dry_run:
            print("⚠️  DRY RUN MODE - No changes will be made\n")
            for old_name, new_name in SKILL_MAPPING.items():
                print(f"  Would rename: {old_name} → {new_name}")
            return
        
        try:
            # Step 1: Backup
            self.create_backup()
            
            # Step 2: Rename folders
            self.rename_skill_folders()
            
            # Step 3: Update references
            self.update_all_references()
            
            # Step 4: Update registry
            self.update_registry()
            
            # Step 5: Verify
            if self.verify_migration():
                print("\n✅ Migration completed successfully!")
                print(f"\n📊 Summary:")
                print(f"   - Skills renamed: {len(SKILL_MAPPING)}")
                print(f"   - Backup location: {self.backup_dir}")
                
                if self.errors:
                    print(f"\n⚠️  Encountered {len(self.errors)} errors:")
                    for error in self.errors:
                        print(f"   - {error}")
            else:
                print("\n✗ Verification failed!")
                user_input = input("Rollback changes? (y/n): ")
                if user_input.lower() == 'y':
                    self.rollback()
                    
        except Exception as e:
            print(f"\n✗ Migration failed: {e}")
            print("🔄 Rolling back...")
            self.rollback()


if __name__ == "__main__":
    import sys
    
    # Get agent directory path
    if len(sys.argv) > 1:
        agent_dir = Path(sys.argv[1])
    else:
        agent_dir = Path.cwd() / ".agent"
    
    # Check if dry run
    dry_run = "--dry-run" in sys.argv
    
    migrator = SkillMigrator(agent_dir)
    migrator.run(dry_run=dry_run)
