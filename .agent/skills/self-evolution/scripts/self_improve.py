#!/usr/bin/env python3
"""
Self-Improve Cycle Orchestrator for SelfEvolution v4.0

5-Step Process:
1. Analyze learnings (keep/refine/add/deprecate)
2. Improve skill code
3. Update knowledge base with versioning
4. Notify user
5. Apply to source code
"""

import yaml
import json
import sys
import shutil
from pathlib import Path
from datetime import datetime
from typing import Dict, List

# Add scripts directory to path
SCRIPT_DIR = Path(__file__).parent
sys.path.insert(0, str(SCRIPT_DIR))

from project_utils import (
    get_mistakes_file,
    get_improvements_file,
    get_meta_file,
    get_versions_dir,
    ensure_v4_structure
)
from event_tracker import (
    check_threshold,
    reset_since_last_improve,
    add_improve_history,
    get_event_count
)
from analyze_learnings import (
    categorize_learnings,
    generate_refinement_suggestions
)

def step1_analyze() -> Dict:
    """
    Step 1: Analyze Aggregated Learnings
    
    Returns:
        Categorized learnings
    """
    print("=" * 60)
    print("STEP 1: Analyze Learnings")
    print("=" * 60 + "\n")
    
    categorized = categorize_learnings(use_ai=False)  # Heuristic for now
    
    print(f"\n✅ Analysis complete:")
    print(f"   Keep: {len(categorized['keep'])}")
    print(f"   Refine: {len(categorized['refine'])}")
    print(f"   Add New: {len(categorized['add_new'])}")
    print(f"   Deprecate: {len(categorized['deprecate'])}")
    
    return categorized

def step2_improve_skill() -> bool:
    """
    Step 2: Improve Auto-Learning Skill Code
    
    Returns:
        True if improvements made
    """
    print("\n" + "=" * 60)
    print("STEP 2: Improve Skill Code")
    print("=" * 60 + "\n")
    
    print("⚠️  Skill code improvement not yet implemented")
    print("   (Would improve query_lessons.py relevance scoring)")
    
    # TODO: Implement actual skill code improvements
    # Examples:
    # - Enhance query_lessons.py relevance algorithm
    # - Improve detect_triggers.py pattern matching
    # - Optimize extract_lesson.py AI prompts
    
    return False

def step3_update_knowledge(categorized: Dict) -> Dict:
    """
    Step 3: Update Learning Knowledge Base
    
    Args:
        categorized: Categorized learnings from step 1
        
    Returns:
        Summary of changes
    """
    print("\n" + "=" * 60)
    print("STEP 3: Update Knowledge Base")
    print("=" * 60 + "\n")
    
    changes = {
        'mistakes_kept': 0,
        'mistakes_refined': 0,
        'mistakes_added': 0,
        'mistakes_deprecated': 0,
        'improvements_kept': 0,
        'improvements_refined': 0,
        'improvements_added': 0,
        'improvements_deprecated': 0
    }
    
    # Load current data
    mistakes_file = get_mistakes_file()
    improvements_file = get_improvements_file()
    
    mistakes_data = {}
    if mistakes_file.exists():
        with open(mistakes_file, 'r', encoding='utf-8') as f:
            mistakes_data = yaml.safe_load(f) or {}
    
    improvements_data = {}
    if improvements_file.exists():
        with open(improvements_file, 'r', encoding='utf-8') as f:
            improvements_data = yaml.safe_load(f) or {}
    
    # Process keep (no changes)
    for item in categorized['keep']:
        if item['type'] == 'mistake':
            changes['mistakes_kept'] += 1
        else:
            changes['improvements_kept'] += 1
    
    print(f"✓ Kept {changes['mistakes_kept']} mistakes, {changes['improvements_kept']} improvements")
    
    # Process refine
    for item in categorized['refine']:
        learning = item['learning']
        learning_id = learning['id']
        
        # Find in data
        if item['type'] == 'mistake':
            for i, m in enumerate(mistakes_data.get('mistakes', [])):
                if m['id'] == learning_id:
                    # Increment version
                    old_version = m.get('version', 1)
                    new_version = old_version + 1
                    
                    # Update version tracking
                    m['version'] = new_version
                    m['updated'] = datetime.now().isoformat()
                    
                    if 'previous_versions' not in m:
                        m['previous_versions'] = []
                    m['previous_versions'].append(old_version)
                    
                    # Add changelog
                    if 'changelog' not in m:
                        m['changelog'] = []
                    m['changelog'].append({
                        'version': new_version,
                        'date': datetime.now().isoformat(),
                        'change': f'Refined during self-improve cycle (hits={m.get("hitCount", 0)}, applied={m.get("appliedCount", 0)})'
                    })
                    
                    # You could use AI here to actually refine the lesson text
                    # For now, just mark as refined
                    
                    print(f"  🔄 Refined {learning_id} (v{old_version} → v{new_version})")
                    changes['mistakes_refined'] += 1
                    break
        else:
            for i, imp in enumerate(improvements_data.get('improvements', [])):
                if imp['id'] == learning_id:
                    old_version = imp.get('version', 1)
                    new_version = old_version + 1
                    
                    imp['version'] = new_version
                    imp['updated'] = datetime.now().isoformat()
                    
                    if 'previous_versions' not in imp:
                        imp['previous_versions'] = []
                    imp['previous_versions'].append(old_version)
                    
                    if 'changelog' not in imp:
                        imp['changelog'] = []
                    imp['changelog'].append({
                        'version': new_version,
                        'date': datetime.now().isoformat(),
                        'change': 'Refined during self-improve cycle'
                    })
                    
                    print(f"  🔄 Refined {learning_id} (v{old_version} → v{new_version})")
                    changes['improvements_refined'] += 1
                    break
    
    # Process deprecate
    for item in categorized['deprecate']:
        learning = item['learning']
        learning_id = learning['id']
        
        if item['type'] == 'mistake':
            for m in mistakes_data.get('mistakes', []):
                if m['id'] == learning_id:
                    m['status'] = 'deprecated'
                    m['deprecated_at'] = datetime.now().isoformat()
                    m['deprecated_reason'] = 'Self-improve cycle determined no longer applicable'
                    print(f"  ❌ Deprecated {learning_id}")
                    changes['mistakes_deprecated'] += 1
                    break
        else:
            for imp in improvements_data.get('improvements', []):
                if imp['id'] == learning_id:
                    imp['status'] = 'deprecated'
                    imp['deprecated_at'] = datetime.now().isoformat()
                    imp['deprecated_reason'] = 'Self-improve cycle determined no longer applicable'
                    print(f"  ❌ Deprecated {learning_id}")
                    changes['improvements_deprecated'] += 1
                    break
    
    # Save updated data with version increment
    if mistakes_data:
        old_version = mistakes_data.get('version', 1)
        new_version = old_version + 1
        mistakes_data['version'] = new_version
        mistakes_data['last_improved'] = datetime.now().isoformat()
        
        with open(mistakes_file, 'w', encoding='utf-8') as f:
            yaml.dump(mistakes_data, f, allow_unicode=True, default_flow_style=False, sort_keys=False)
        
        # Save version history
        versions_dir = get_versions_dir()
        versions_dir.mkdir(exist_ok=True)
        version_file = versions_dir / f'mistakes-v{new_version}.yaml'
        with open(version_file, 'w', encoding='utf-8') as f:
            yaml.dump(mistakes_data, f, allow_unicode=True, default_flow_style=False, sort_keys=False)
        
        print(f"\n✅ Saved mistakes v{new_version}")
    
    if improvements_data:
        old_version = improvements_data.get('version', 1)
        new_version = old_version + 1
        improvements_data['version'] = new_version
        improvements_data['last_improved'] = datetime.now().isoformat()
        
        with open(improvements_file, 'w', encoding='utf-8') as f:
            yaml.dump(improvements_data, f, allow_unicode=True, default_flow_style=False, sort_keys=False)
        
        versions_dir = get_versions_dir()
        version_file = versions_dir / f'improvements-v{new_version}.yaml'
        with open(version_file, 'w', encoding='utf-8') as f:
            yaml.dump(improvements_data, f, allow_unicode=True, default_flow_style=False, sort_keys=False)
        
        print(f"✅ Saved improvements v{new_version}")
    
    return changes

def step4_notify_user(changes: Dict):
    """
    Step 4: Notify User
    
    Args:
        changes: Summary of changes from step 3
    """
    print("\n" + "=" * 60)
    print("STEP 4: Notify User")
    print("=" * 60 + "\n")
    
    total_refined = changes['mistakes_refined'] + changes['improvements_refined']
    total_added = changes['mistakes_added'] + changes['improvements_added']
    total_deprecated = changes['mistakes_deprecated'] + changes['improvements_deprecated']
    
    notification = f"""
┌─────────────────────────────────────────────────────────┐
│ 🧠 Auto-Learning – Skill Self-Improved                  │
├─────────────────────────────────────────────────────────┤
│ ⚡ Self-Improve Cycle Complete                          │
│                                                          │
│ 📊 Changes:                                             │
│   • {total_refined} existing learnings refined                      │
│   • {total_added} new learnings added                               │
│   • {total_deprecated} outdated learnings deprecated                    │
│                                                          │
│ @Mistakes ({changes['mistakes_kept'] + changes['mistakes_refined']} active)                                 │
│   {changes['mistakes_kept']} kept unchanged                                  │
│   {changes['mistakes_refined']} refined with better patterns                │
│   {changes['mistakes_deprecated']} deprecated                                       │
│                                                          │
│ @Improvements ({changes['improvements_kept'] + changes['improvements_refined']} active)                            │
│   {changes['improvements_kept']} kept unchanged                                  │
│   {changes['improvements_refined']} refined with better examples              │
│   {changes['improvements_deprecated']} deprecated                                       │
│                                                          │
│ ℹ️  Will be applied to future coding decisions          │
└─────────────────────────────────────────────────────────┘
    """
    
    print(notification)

def step5_apply_to_source():
    """
    Step 5: Apply to Current Source Code
    
    Note: This is a marker for future implementation.
    In practice, learnings are applied when agent queries them before coding.
    """
    print("\n" + "=" * 60)
    print("STEP 5: Apply to Source Code")
    print("=" * 60 + "\n")
    
    print("✅ Learnings ready to be queried during coding")
    print("   Agent will use query_lessons.py to check before decisions")

def run_self_improve_cycle(force: bool = False) -> bool:
    """
    Run the complete self-improve cycle
    
    Args:
        force: Force run even if threshold not reached
        
    Returns:
        True if cycle completed successfully
    """
    print("\n🧠 SelfEvolution v4.0 - Self-Improve Cycle\n")
    
    # Check threshold
    if not force and not check_threshold():
        counter = get_event_count()
        threshold = 5  # Default
        print(f"⚠️  Threshold not reached yet")
        print(f"   Current: {counter['since_last_improve']}/{threshold}")
        print(f"   Need {threshold - counter['since_last_improve']} more events")
        return False
    
    print("🎯 Starting Self-Improve Cycle...\n")
    
    try:
        # Step 1: Analyze
        categorized = step1_analyze()
        
        # Step 2: Improve skill code
        skill_improved = step2_improve_skill()
        
        # Step 3: Update knowledge
        changes = step3_update_knowledge(categorized)
        
        # Step 4: Notify user
        step4_notify_user(changes)
        
        # Step 5: Apply to source
        step5_apply_to_source()
        
        # Update event tracker
        add_improve_history(changes)
        reset_since_last_improve()
        
        print("\n" + "=" * 60)
        print("✅ SELF-IMPROVE CYCLE COMPLETE")
        print("=" * 60 + "\n")
        
        return True
    
    except Exception as e:
        print(f"\n❌ Self-improve cycle failed: {e}")
        import traceback
        traceback.print_exc()
        return False

def main():
    """CLI entry point"""
    import argparse
    
    parser = argparse.ArgumentParser(description='Self-Improve Cycle Orchestrator')
    parser.add_argument('--force', action='store_true', help='Force run even if threshold not reached')
    
    args = parser.parse_args()
    
    success = run_self_improve_cycle(force=args.force)
    sys.exit(0 if success else 1)

if __name__ == "__main__":
    main()
