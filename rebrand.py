#!/usr/bin/env python3
"""
Universal Rebrand Script - Agent Skill Kit
===========================================
Automatically rebrand entire codebase with intelligent pattern matching.

Usage:
    python rebrand.py "Old Name" "New Name" [--dry-run]
    
Example:
    python rebrand.py "Antigravity Kit" "Agent Skill Kit"
    python rebrand.py "AgentSkillKit" "SuperAI" --dry-run
"""

import re
import sys
import argparse
from pathlib import Path
from typing import List, Dict, Tuple
import json

class SmartRebrander:
    def __init__(self, old_name: str, new_name: str, root_dir: Path):
        self.old_name = old_name
        self.new_name = new_name
        self.root_dir = root_dir
        
        # Generate all name variations
        self.variations = self._generate_variations()
        
        # Files to scan
        self.file_patterns = ["*.py", "*.md", "*.json", "*.js", "*.ts", "*.tsx", "*.jsx"]
        
        # Exclusions
        self.exclude_dirs = {".git", "node_modules", ".next", "dist", "build", "__pycache__", ".venv"}
        self.exclude_files = {"package-lock.json", "yarn.lock", "pnpm-lock.yaml"}
        
        # Results
        self.changes = []
        self.errors = []
        
    def _generate_variations(self) -> Dict[str, str]:
        """Generate all naming convention variations"""
        # Helper functions
        def to_kebab(text): return text.lower().replace(" ", "-")
        def to_snake(text): return text.lower().replace(" ", "_").replace("-", "_")
        def to_camel(text): return ''.join(word.capitalize() for word in text.split())
        def to_pascal(text): return to_camel(text)
        def to_lower(text): return text.lower().replace(" ", "")
        def to_upper(text): return text.upper().replace(" ", "_")
        
        variations = {
            # Original
            "original": (self.old_name, self.new_name),
            
            # Case variations
            "lowercase": (self.old_name.lower(), self.new_name.lower()),
            "uppercase": (self.old_name.upper(), self.new_name.upper()),
            
            # Naming conventions
            "kebab-case": (to_kebab(self.old_name), to_kebab(self.new_name)),
            "snake_case": (to_snake(self.old_name), to_snake(self.new_name)),
            "camelCase": (to_camel(self.old_name), to_camel(self.new_name)),
            "PascalCase": (to_pascal(self.old_name), to_pascal(self.new_name)),
            
            # Special formats
            "no-spaces-lower": (to_lower(self.old_name), to_lower(self.new_name)),
            "SCREAMING_SNAKE": (to_upper(self.old_name), to_upper(self.new_name)),
        }
        
        return variations
    
    def find_files(self) -> List[Path]:
        """Find all files to process"""
        files = []
        
        for pattern in self.file_patterns:
            for file in self.root_dir.rglob(pattern):
                # Skip excluded directories
                if any(excluded in file.parts for excluded in self.exclude_dirs):
                    continue
                
                # Skip excluded files
                if file.name in self.exclude_files:
                    continue
                
                files.append(file)
        
        return files
    
    def process_file(self, file_path: Path, dry_run: bool = False) -> Dict:
        """Process a single file"""
        try:
            # Read file
            content = file_path.read_text(encoding='utf-8')
            original_content = content
            
            # Track changes for this file
            file_changes = []
            
            # Apply all variations
            for variant_name, (old_variant, new_variant) in self.variations.items():
                # Skip if old variant not in content
                if old_variant not in content:
                    continue
                
                # Count occurrences
                count = content.count(old_variant)
                
                # Context-aware replacement
                # Don't replace inside URLs, git commits, etc.
                if self._should_replace(content, old_variant, file_path):
                    content = content.replace(old_variant, new_variant)
                    file_changes.append({
                        "variant": variant_name,
                        "old": old_variant,
                        "new": new_variant,
                        "count": count
                    })
            
            # Write back if changed
            if content != original_content:
                if not dry_run:
                    file_path.write_text(content, encoding='utf-8')
                
                return {
                    "file": str(file_path.relative_to(self.root_dir)),
                    "changes": file_changes,
                    "modified": not dry_run
                }
            
            return None
            
        except Exception as e:
            self.errors.append({
                "file": str(file_path.relative_to(self.root_dir)),
                "error": str(e)
            })
            return None
    
    def _should_replace(self, content: str, old_text: str, file_path: Path) -> bool:
        """Determine if we should replace in this context"""
        # Skip if in URLs (heuristic)
        url_patterns = [
            r'https?://[^\s]*' + re.escape(old_text),
            r'git\+https://[^\s]*' + re.escape(old_text),
        ]
        
        for pattern in url_patterns:
            if re.search(pattern, content, re.IGNORECASE):
                # If it's a URL, only replace if explicitly domain-related
                if file_path.suffix not in ['.md', '.txt']:
                    return False
        
        # Skip if in git commit hashes (SHA patterns)
        if re.match(r'^[a-f0-9]{7,40}$', old_text):
            return False
        
        # Otherwise safe to replace
        return True
    
    def run(self, dry_run: bool = False):
        """Execute rebrand"""
        print("🚀 Starting Smart Rebrand")
        print(f"   Old Name: {self.old_name}")
        print(f"   New Name: {self.new_name}")
        print(f"   Mode: {'DRY RUN' if dry_run else 'LIVE'}")
        print()
        
        # Show variations
        print("📝 Name Variations:")
        for variant_name, (old, new) in self.variations.items():
            if old != new:  # Only show if different
                print(f"   {variant_name:20s}: {old:30s} → {new}")
        print()
        
        # Find files
        files = self.find_files()
        print(f"🔍 Scanning {len(files)} files...\n")
        
        # Process each file
        for file in files:
            result = self.process_file(file, dry_run)
            if result:
                self.changes.append(result)
        
        # Print results
        self._print_results(dry_run)
    
    def _print_results(self, dry_run: bool):
        """Print summary results"""
        print("\n" + "="*70)
        print("📊 REBRAND SUMMARY")
        print("="*70)
        
        if not self.changes:
            print("\n✅ No changes needed - all references already use new name!")
            return
        
        # Group by file
        print(f"\n📝 Modified Files: {len(self.changes)}")
        print("-" * 70)
        
        total_replacements = 0
        for change in self.changes:
            file_name = change['file']
            changes = change['changes']
            
            file_total = sum(c['count'] for c in changes)
            total_replacements += file_total
            
            print(f"\n{file_name} ({file_total} replacements)")
            for c in changes:
                print(f"  • {c['variant']:15s}: {c['old']:25s} → {c['new']} ({c['count']}x)")
        
        # Errors
        if self.errors:
            print("\n" + "="*70)
            print("❌ ERRORS")
            print("="*70)
            for error in self.errors:
                print(f"  {error['file']}: {error['error']}")
        
        # Summary
        print("\n" + "="*70)
        print(f"Total Replacements: {total_replacements}")
        print(f"Files Modified: {len(self.changes)}")
        print(f"Errors: {len(self.errors)}")
        print("="*70)
        
        if dry_run:
            print("\n⚠️  DRY RUN - No files were modified")
            print("   Run without --dry-run to apply changes")
        else:
            print("\n✅ Rebrand complete!")
            print("   Don't forget to:")
            print("   1. Review changes with: git diff")
            print("   2. Test the application")
            print("   3. Commit: git add . && git commit -m 'rebrand: ...'")
    
    def export_report(self, filename: str = "rebrand_report.json"):
        """Export detailed report"""
        report = {
            "old_name": self.old_name,
            "new_name": self.new_name,
            "variations": {k: {"old": v[0], "new": v[1]} for k, v in self.variations.items()},
            "summary": {
                "files_modified": len(self.changes),
                "total_replacements": sum(
                    sum(c['count'] for c in change['changes'])
                    for change in self.changes
                ),
                "errors": len(self.errors)
            },
            "changes": self.changes,
            "errors": self.errors
        }
        
        with open(filename, 'w') as f:
            json.dump(report, f, indent=2)
        
        print(f"\n📄 Detailed report saved to: {filename}")


def main():
    parser = argparse.ArgumentParser(
        description="Smart rebrand tool for entire codebase",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  python rebrand.py "Antigravity Kit" "Agent Skill Kit" --dry-run
  python rebrand.py "OldCompany" "NewCompany"
  python rebrand.py "Legacy AI" "Modern AI" --export-report
        """
    )
    
    parser.add_argument("old_name", help="Old name to replace")
    parser.add_argument("new_name", help="New name to use")
    parser.add_argument("--dry-run", action="store_true", help="Preview changes without modifying files")
    parser.add_argument("--export-report", action="store_true", help="Export detailed JSON report")
    parser.add_argument("--root", default=".", help="Root directory to search (default: current)")
    
    args = parser.parse_args()
    
    # Validate
    if args.old_name == args.new_name:
        print("❌ Error: Old name and new name are the same!")
        sys.exit(1)
    
    # Confirm if not dry run
    if not args.dry_run:
        print(f"⚠️  You are about to rebrand '{args.old_name}' to '{args.new_name}'")
        print("   This will modify files in:", Path(args.root).resolve())
        response = input("\n   Continue? (yes/no): ")
        if response.lower() not in ['yes', 'y']:
            print("Aborted.")
            sys.exit(0)
        print()
    
    # Execute
    root = Path(args.root).resolve()
    rebrander = SmartRebrander(args.old_name, args.new_name, root)
    rebrander.run(dry_run=args.dry_run)
    
    # Export report if requested
    if args.export_report:
        rebrander.export_report()


if __name__ == "__main__":
    main()
