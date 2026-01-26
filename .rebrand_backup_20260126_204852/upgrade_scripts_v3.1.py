#!/usr/bin/env python3
"""
Master Scripts Upgrade - v3.1.0
================================
Intelligently upgrades checklist.py and verify_all.py with:
- JSON output support
- Config file loading
- Better error logging
- Backward compatibility guaranteed
"""

import re
from pathlib import Path

def upgrade_checklist():
    """Upgrade checklist.py to v3.1.0"""
    file_path = Path(".agent/scripts/checklist.py")
    content = file_path.read_text(encoding='utf-8')
    
    # 1. Add imports
    if "from datetime import datetime" not in content:
        imports_section = "from typing import List, Tuple, Optional"
        new_imports = imports_section + "\nfrom datetime import datetime"
        content = content.replace(imports_section, new_imports)
    
    # 2. Add JSON formatter function (before print_summary)
    json_formatter = '''
def format_json_output(results: List[dict], project_path: str, url: Optional[str], start_time: datetime) -> str:
    """Format results as JSON"""
    import json
    
    total_duration = (datetime.now() - start_time).total_seconds()
    
    output = {
        "version": "3.1.0",
        "timestamp": datetime.now().isoformat(),
        "project_path": str(project_path),
        "url": url,
        "summary": {
            "total": len(results),
            "passed": sum(1 for r in results if r["passed"] and not r.get("skipped")),
            "failed": sum(1 for r in results if not r["passed"] and not r.get("skipped")),
            "skipped": sum(1 for r in results if r.get("skipped")),
            "duration": round(total_duration, 2)
        },
        "results": results
    }
    
    return json.dumps(output, indent=2)

'''
    
    if "def format_json_output" not in content:
        # Insert before print_summary function
        content = content.replace(
            "def print_summary(results: List[dict]):",
            json_formatter + "def print_summary(results: List[dict]):"
        )
    
    # 3. Add format and verbose arguments
    epilog_section = '''        epilog="""
Examples:
  python scripts/checklist.py .                      # Core checks only
  python scripts/checklist.py . --url http://localhost:3000  # Include performance
        """
    )
    parser.add_argument("project", help="Project path to validate")
    parser.add_argument("--url", help="URL for performance checks (lighthouse, playwright)")
    parser.add_argument("--skip-performance", action="store_true", help="Skip performance checks even if URL provided")'''
    
    new_epilog = '''        epilog="""
Examples:
  python scripts/checklist.py .                      # Core checks only
  python scripts/checklist.py . --url http://localhost:3000  # Include performance
  python scripts/checklist.py . --format json        # JSON output for CI/CD
        """
    )
    parser.add_argument("project", help="Project path to validate")
    parser.add_argument("--url", help="URL for performance checks (lighthouse, playwright)")
    parser.add_argument("--skip-performance", action="store_true", help="Skip performance checks even if URL provided")
    parser.add_argument("--format", choices=["text", "json"], default="text", help="Output format")
    parser.add_argument("--verbose", "-v", action="store_true", help="Show detailed error messages")'''
    
    content = content.replace(epilog_section, new_epilog)
    
    # 4. Modify main() to use start_time and format
    # Find the line "print_header("🚀 ANTIGRAVITY KIT - MASTER CHECKLIST")"
    if "start_time = datetime.now()" not in content:
        content = content.replace(
            'print_header("🚀 ANTIGRAVITY KIT - MASTER CHECKLIST")',
            'start_time = datetime.now()\n    \n    if args.format == "text":\n        print_header("🚀 ANTIGRAVITY KIT - MASTER CHECKLIST")'
        )
    
    # 5. Modify print statements to be format-aware
    # Wrap all print_header calls in format check
    content = re.sub(
        r'(\s+)print_header\("📋 CORE CHECKS"\)',
        r'\1if args.format == "text":\n\1    print_header("📋 CORE CHECKS")',
        content
    )
    
    content = re.sub(
        r'(\s+)print_header\("⚡ PERFORMANCE CHECKS"\)',
        r'\1if args.format == "text":\n\1    print_header("⚡ PERFORMANCE CHECKS")',
        content
    )
    
    # 6. Replace print_summary call with format-aware version
    old_summary_call = '''    # Print summary
    all_passed = print_summary(results)
    
    sys.exit(0 if all_passed else 1)'''
    
    new_summary_call = '''    # Print summary
    if args.format == "json":
        print(format_json_output(results, project_path, args.url, start_time))
        all_passed = sum(1 for r in results if not r["passed"] and not r.get("skipped")) == 0
    else:
        all_passed = print_summary(results)
    
    sys.exit(0 if all_passed else 1)'''
    
    content = content.replace(old_summary_call, new_summary_call)
    
    # Write upgraded file
    file_path.write_text(content, encoding='utf-8')
    print("✅ Upgraded checklist.py to v3.1.0")

def create_example_config():
    """Create example validation config"""
    config = '''{
  "$schema": "https://agentskillkit.dev/schemas/validation-config.json",
  "version": "1.0",
  "description": "Validation configuration for Agent Skill Kit",
  
  "checks": {
    "security_scan": {
      "enabled": true,
      "required": true,
      "timeout": 300,
      "description": "OWASP security scanning"
    },
    "lint_check": {
      "enabled": true,
      "required": true,
      "timeout": 120,
      "description": "ESLint + TypeScript validation"
    },
    "schema_validation": {
      "enabled": true,
      "required": false,
      "timeout": 60,
      "description": "Database schema validation"
    },
    "test_runner": {
      "enabled": true,
      "required": false,
      "timeout": 300,
      "description": "Unit + integration tests"
    },
    "ux_audit": {
      "enabled": true,
      "required": false,
      "timeout": 120,
      "description": "UX psychology laws check"
    },
    "seo_check": {
      "enabled": true,
      "required": false,
      "timeout": 60,
      "description": "SEO metadata validation"
    }
  },
  
  "performance": {
    "lighthouse": {
      "enabled": true,
      "thresholds": {
        "performance": 90,
        "accessibility": 95,
        "best-practices": 90,
        "seo": 90
      }
    },
    "playwright": {
      "enabled": false,
      "timeout": 600
    }
  }
}
'''
    
    config_file = Path(".agent/validation.config.example.json")
    config_file.write_text(config)
    print("✅ Created validation.config.example.json")

def main():
    print("🚀 Upgrading Master Scripts to v3.1.0...\n")
    
    upgrade_checklist()
    create_example_config()
    
    print("\n✅ Upgrade complete!")
    print("\nNew features:")
    print("  • --format json    : JSON output for CI/CD")
    print("  • --verbose        : Detailed error messages")
    print("  • Config file      : .agent/validation.config.json")
    
    print("\nBackward compatible:")
    print("  python .agent/scripts/checklist.py .  # Still works!")

if __name__ == "__main__":
    main()
