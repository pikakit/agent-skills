#!/usr/bin/env python3
"""
SKILL.md Overview Generator

Auto-generates dynamic overview section showing:
- Latest learnings (mistakes + improvements)
- Current version numbers
- Recent self-improve cycles
- Statistics
"""

import yaml
import json
import sys
from pathlib import Path
from datetime import datetime
from typing import List, Dict

# Add scripts to path
SCRIPT_DIR = Path(__file__).parent
sys.path.insert(0, str(SCRIPT_DIR))

from project_utils import (
    get_mistakes_file,
    get_improvements_file,
    get_meta_file
)

def load_recent_learnings(limit: int = 5) -> Dict:
    """
    Load recent learnings from mistakes and improvements
    
    Args:
        limit: Max number of recent items per category
        
    Returns:
        Dict with mistakes and improvements lists
    """
    result = {
        'mistakes': [],
        'improvements': [],
        'mistakes_version': 1,
        'improvements_version': 1
    }
    
    # Load mistakes
    mistakes_file = get_mistakes_file()
    if mistakes_file.exists():
        with open(mistakes_file, 'r', encoding='utf-8') as f:
            data = yaml.safe_load(f) or {}
            mistakes = data.get('mistakes', [])
            
            # Sort by addedAt (most recent first)
            sorted_mistakes = sorted(
                mistakes,
                key=lambda x: x.get('addedAt', ''),
                reverse=True
            )
            
            result['mistakes'] = sorted_mistakes[:limit]
            result['mistakes_version'] = data.get('version', 1)
    
    # Load improvements
    improvements_file = get_improvements_file()
    if improvements_file.exists():
        with open(improvements_file, 'r', encoding='utf-8') as f:
            data = yaml.safe_load(f) or {}
            improvements = data.get('improvements', [])
            
            # Sort by addedAt (most recent first)
            sorted_improvements = sorted(
                improvements,
                key=lambda x: x.get('addedAt', ''),
                reverse=True
            )
            
            result['improvements'] = sorted_improvements[:limit]
            result['improvements_version'] = data.get('version', 1)
    
    return result

def load_statistics() -> Dict:
    """Load statistics from meta.json"""
    meta_file = get_meta_file()
    
    if not meta_file.exists():
        return {
            'total_mistakes': 0,
            'total_improvements': 0,
            'event_count': 0,
            'improve_count': 0,
            'last_improved': None
        }
    
    with open(meta_file, 'r', encoding='utf-8') as f:
        meta = json.load(f)
    
    return {
        'total_mistakes': meta.get('event_counter', {}).get('mistakes', 0),
        'total_improvements': meta.get('event_counter', {}).get('improvements', 0),
        'event_count': meta.get('event_counter', {}).get('total', 0),
        'improve_count': meta.get('self_improve', {}).get('improve_count', 0),
        'last_improved': meta.get('self_improve', {}).get('last_improved')
    }

def format_date(iso_date: str) -> str:
    """Format ISO date to readable format"""
    if not iso_date:
        return "Unknown"
    
    try:
        dt = datetime.fromisoformat(iso_date)
        return dt.strftime("%Y-%m-%d %H:%M")
    except:
        return iso_date[:10] if len(iso_date) >= 10 else iso_date

def generate_overview_markdown() -> str:
    """
    Generate dynamic overview markdown section
    
    Returns:
        Markdown string for overview
    """
    learnings = load_recent_learnings(limit=5)
    stats = load_statistics()
    
    # Calculate version info
    mistakes_v = learnings['mistakes_version']
    improvements_v = learnings['improvements_version']
    
    overview = []
    
    # Header
    overview.append("## 📊 Current Learning Status")
    overview.append("")
    overview.append(f"**Knowledge Base Version**: Mistakes v{mistakes_v} | Improvements v{improvements_v}")
    overview.append(f"**Total Learnings**: {stats['total_mistakes']} mistakes, {stats['total_improvements']} improvements")
    overview.append(f"**Self-Improve Cycles**: {stats['improve_count']} completed")
    
    if stats['last_improved']:
        overview.append(f"**Last Improved**: {format_date(stats['last_improved'])}")
    
    overview.append("")
    overview.append("---")
    overview.append("")
    
    # Recent Mistakes
    if learnings['mistakes']:
        overview.append("### 🔴 Recent Mistakes Learned")
        overview.append("")
        
        for i, mistake in enumerate(learnings['mistakes'], 1):
            lesson = mistake.get('lesson', mistake.get('problem', 'No description'))
            mistake_id = mistake.get('id', 'UNKNOWN')
            version = mistake.get('version', 1)
            added_at = format_date(mistake.get('addedAt', ''))
            
            # Truncate long lessons
            if len(lesson) > 80:
                lesson = lesson[:77] + "..."
            
            overview.append(f"{i}. **{mistake_id}** (v{version}): {lesson}")
            overview.append(f"   *Added: {added_at}*")
        
        overview.append("")
    else:
        overview.append("### 🔴 Recent Mistakes Learned")
        overview.append("")
        overview.append("*No mistakes recorded yet. Start learning by reporting errors!*")
        overview.append("")
    
    # Recent Improvements
    if learnings['improvements']:
        overview.append("### 🟢 Recent Improvements Learned")
        overview.append("")
        
        for i, improvement in enumerate(learnings['improvements'], 1):
            text = improvement.get('improvement', 'No description')
            improve_id = improvement.get('id', 'UNKNOWN')
            version = improvement.get('version', 1)
            added_at = format_date(improvement.get('addedAt', ''))
            
            # Truncate long text
            if len(text) > 80:
                text = text[:77] + "..."
            
            overview.append(f"{i}. **{improve_id}** (v{version}): {text}")
            overview.append(f"   *Added: {added_at}*")
        
        overview.append("")
    else:
        overview.append("### 🟢 Recent Improvements Learned")
        overview.append("")
        overview.append("*No improvements recorded yet. Share best practices to build knowledge!*")
        overview.append("")
    
    overview.append("---")
    overview.append("")
    
    return "\n".join(overview)

def update_skill_md():
    """
    Update SKILL.md with generated overview
    
    Looks for markers:
    <!-- OVERVIEW_START -->
    <!-- OVERVIEW_END -->
    """
    skill_md = SCRIPT_DIR.parent / 'SKILL.md'
    
    if not skill_md.exists():
        print("❌ SKILL.md not found")
        return False
    
    # Read current content
    with open(skill_md, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Generate new overview
    new_overview = generate_overview_markdown()
    
    # Check for markers
    if '<!-- OVERVIEW_START -->' in content and '<!-- OVERVIEW_END -->' in content:
        # Replace between markers
        start_marker = '<!-- OVERVIEW_START -->'
        end_marker = '<!-- OVERVIEW_END -->'
        
        start_idx = content.index(start_marker) + len(start_marker)
        end_idx = content.index(end_marker)
        
        updated_content = (
            content[:start_idx] + 
            "\n" + new_overview + 
            content[end_idx:]
        )
        
        # Write back
        with open(skill_md, 'w', encoding='utf-8') as f:
            f.write(updated_content)
        
        print("✅ SKILL.md overview updated")
        return True
    else:
        print("⚠️  No markers found in SKILL.md")
        print("   Add <!-- OVERVIEW_START --> and <!-- OVERVIEW_END --> to enable auto-update")
        print("\nGenerated overview:")
        print(new_overview)
        return False

def main():
    """CLI entry point"""
    import argparse
    
    parser = argparse.ArgumentParser(description='SKILL.md Overview Generator')
    parser.add_argument('--generate', action='store_true', help='Generate overview markdown')
    parser.add_argument('--update', action='store_true', help='Update SKILL.md with overview')
    parser.add_argument('--print', action='store_true', help='Print overview to console')
    
    args = parser.parse_args()
    
    if args.update:
        update_skill_md()
    elif args.generate or args.print:
        overview = generate_overview_markdown()
        print(overview)
    else:
        # Default: print
        overview = generate_overview_markdown()
        print(overview)

if __name__ == "__main__":
    main()
