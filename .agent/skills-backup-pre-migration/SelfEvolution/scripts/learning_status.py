#!/usr/bin/env python3
"""
Learning Status Display for SelfEvolution v4.0
Shows active mistakes and improvements before coding
"""

import yaml
import json
import sys
from pathlib import Path
from typing import Dict, List, Optional

# Add scripts directory to path
SCRIPT_DIR = Path(__file__).parent
sys.path.insert(0, str(SCRIPT_DIR))

from project_utils import (
    get_mistakes_file,
    get_improvements_file,
    get_meta_file,
    detect_version
)
from event_tracker import get_statistics

def load_active_mistakes() -> List[Dict]:
    """Load active mistakes (not deprecated)"""
    mistakes_file = get_mistakes_file()
    
    if not mistakes_file.exists():
        return []
    
    with open(mistakes_file, 'r', encoding='utf-8') as f:
        data = yaml.safe_load(f) or {}
    
    mistakes = data.get('mistakes', [])
    return [m for m in mistakes if m.get('status', 'active') == 'active']

def load_active_improvements() -> List[Dict]:
    """Load active improvements (not deprecated)"""
    improvements_file = get_improvements_file()
    
    if not improvements_file.exists():
        return []
    
    with open(improvements_file, 'r', encoding='utf-8') as f:
        data = yaml.safe_load(f) or {}
    
    improvements = data.get('improvements', [])
    return [i for i in improvements if i.get('status', 'active') == 'active']

def format_mistake_short(mistake: Dict) -> str:
    """Format mistake for summary display"""
    lesson = mistake.get('lesson', '').split('.')[0]  # First sentence
    if len(lesson) > 60:
        lesson = lesson[:57] + '...'
    
    version = f"v{mistake.get('version', 1)}"
    return f"❌ {mistake['id']} {version}: {lesson}"

def format_improvement_short(improvement: Dict) -> str:
    """Format improvement for summary display"""
    imp_text = improvement.get('improvement', '').split('.')[0]
    if len(imp_text) > 60:
        imp_text = imp_text[:57] + '...'
    
    version = f"v{improvement.get('version', 1)}"
    return f"✅ {improvement['id']} {version}: {imp_text}"

def display_status(detailed: bool = False):
    """
    Display current learning status
    
    Args:
        detailed: If True, show full details. Otherwise show summary.
    """
    version = detect_version()
    
    if version != '4.0':
        print(f"⚠️  SelfEvolution v{version} detected")
        print("   Run migration to v4.0 first")
        return
    
    stats = get_statistics()
    mistakes = load_active_mistakes()
    improvements = load_active_improvements()
    
    # Header
    print("┌" + "─" * 60 + "┐")
    print("│ 🧠 Auto-Learning – Active for this Project" + " " * 13 + "│")
    print("├" + "─" * 60 + "┤")
    
    # Self-improve status
    if stats['improve_count'] > 0:
        print(f"│ ⚡ Skill Self-Improved ({stats['improve_count']} times)" + " " * 30 + "│")
        print(f"│   Last improved: {stats['last_improved'][:10] if stats['last_improved'] else 'Never'}" + " " * 33 + "│")
        print("│" + " " * 60 + "│")
    
    # Event counter
    threshold_status = f"{stats['event_counter']['since_last_improve']}/{stats['threshold']}"
    next_trigger = stats.get('next_trigger', 5)
    print(f"│ 📊 Events: {stats['event_counter']['total']} total, {threshold_status} to next improve (at #{next_trigger})" + " " * (35 - len(threshold_status) - len(str(stats['event_counter']['total'])) - len(str(next_trigger))) + "│")
    print("│" + " " * 60 + "│")
    
    # Mistakes
    print(f"│ @Mistakes ({len(mistakes)} active)" + " " * (60 - 17 - len(str(len(mistakes)))) + "│")
    
    if mistakes:
        for mistake in mistakes[:5]:  # Show max 5
            lesson = mistake.get('lesson', '')[:50]
            version_info = f"v{mistake.get('version', 1)}"
            print(f"│   ❌ {mistake['id']} {version_info}: {lesson}" + " " * (60 - 8 - len(mistake['id']) - len(version_info) - len(lesson)) + "│")
        
        if len(mistakes) > 5:
            print(f"│   ... and {len(mistakes) - 5} more" + " " * (60 - 17 - len(str(len(mistakes) - 5))) + "│")
    else:
        print("│   (none)" + " " * 51 + "│")
    
    print("│" + " " * 60 + "│")
    
    # Improvements
    print(f"│ @Improvements ({len(improvements)} active)" + " " * (60 - 21 - len(str(len(improvements)))) + "│")
    
    if improvements:
        for improvement in improvements[:5]:
            imp_text = improvement.get('improvement', '')[:47]
            version_info = f"v{improvement.get('version', 1)}"
            print(f"│   ✅ {improvement['id']} {version_info}: {imp_text}" + " " * (60 - 8 - len(improvement['id']) - len(version_info) - len(imp_text)) + "│")
        
        if len(improvements) > 5:
            print(f"│   ... and {len(improvements) - 5} more" + " " * (60 - 17 - len(str(len(improvements) - 5))) + "│")
    else:
        print("│   (none)" + " " * 51 + "│")
    
    print("│" + " " * 60 + "│")
    print("│ ℹ️  Applied to coding decisions via query_lessons.py" + " " * 8 + "│")
    print("└" + "─" * 60 + "┘")
    
    # Detailed view
    if detailed and (mistakes or improvements):
        print("\n" + "=" * 60)
        print("DETAILED VIEW")
        print("=" * 60 + "\n")
        
        if mistakes:
            print("@Mistakes:")
            for mistake in mistakes:
                print(f"\n{mistake['id']} (v{mistake.get('version', 1)}, {mistake.get('severity', 'medium')})")
                print(f"  Problem: {mistake.get('problem', 'N/A')}")
                print(f"  Lesson: {mistake.get('lesson', 'N/A')}")
                print(f"  Stats: {mistake.get('hitCount', 0)} hits, {mistake.get('appliedCount', 0)} applied")
        
        if improvements:
            print("\n@Improvements:")
            for improvement in improvements:
                print(f"\n{improvement['id']} (v{improvement.get('version', 1)})")
                print(f"  Improvement: {improvement.get('improvement', 'N/A')}")
                print(f"  Benefit: {improvement.get('benefit', 'N/A')}")
                print(f"  Stats: {improvement.get('appliedCount', 0)} applied")

def display_versions():
    """Display version history"""
    from project_utils import get_versions_dir
    
    versions_dir = get_versions_dir()
    
    if not versions_dir.exists():
        print("No version history found")
        return
    
    # List all version files
    mistake_versions = sorted(versions_dir.glob('mistakes-v*.yaml'))
    improvement_versions = sorted(versions_dir.glob('improvements-v*.yaml'))
    
    print("📚 Version History\n")
    
    if mistake_versions:
        print("Mistakes:")
        for v_file in mistake_versions:
            version = v_file.stem.split('-v')[1]
            size = v_file.stat().st_size
            modified = v_file.stat().st_mtime
            from datetime import datetime
            modified_str = datetime.fromtimestamp(modified).strftime('%Y-%m-%d %H:%M')
            print(f"  v{version}: {modified_str} ({size} bytes)")
    
    if improvement_versions:
        print("\nImprovements:")
        for v_file in improvement_versions:
            version = v_file.stem.split('-v')[1]
            size = v_file.stat().st_size
            modified = v_file.stat().st_mtime
            from datetime import datetime
            modified_str = datetime.fromtimestamp(modified).strftime('%Y-%m-%d %H:%M')
            print(f"  v{version}: {modified_str} ({size} bytes)")

def display_history():
    """Display self-improve history"""
    meta_file = get_meta_file()
    
    if not meta_file.exists():
        print("No history found")
        return
    
    with open(meta_file, 'r', encoding='utf-8') as f:
        meta = json.load(f)
    
    history = meta.get('self_improve', {}).get('history', [])
    
    if not history:
        print("No self-improve cycles yet")
        return
    
    print("🔄 Self-Improve History\n")
    
    for entry in history:
        cycle = entry.get('cycle_number', '?')
        triggered_at = entry.get('triggered_at', '')[:19]
        changes = entry.get('changes', {})
        
        print(f"Cycle #{cycle} - {triggered_at}")
        print(f"  Mistakes: {changes.get('mistakes_refined', 0)} refined, {changes.get('mistakes_added', 0)} added, {changes.get('mistakes_deprecated', 0)} deprecated")
        print(f"  Improvements: {changes.get('improvements_refined', 0)} refined, {changes.get('improvements_added', 0)} added, {changes.get('improvements_deprecated', 0)} deprecated")
        print()

def main():
    """CLI entry point"""
    import argparse
    
    parser = argparse.ArgumentParser(description='Learning Status Display')
    parser.add_argument('command', nargs='?', default='status', 
                       choices=['status', 'versions', 'history'],
                       help='Command to run')
    parser.add_argument('--detailed', '-d', action='store_true',
                       help='Show detailed view')
    
    args = parser.parse_args()
    
    if args.command == 'status':
        display_status(detailed=args.detailed)
    elif args.command == 'versions':
        display_versions()
    elif args.command == 'history':
        display_history()

if __name__ == "__main__":
    main()
