#!/usr/bin/env python3
"""
Migration Script: v3.0 → v4.0
Splits project.yaml into mistakes.yaml + improvements.yaml
"""

import yaml
import json
import sys
from pathlib import Path
from datetime import datetime
from typing import Dict, List

# Add scripts directory to path
SCRIPT_DIR = Path(__file__).parent
sys.path.insert(0, str(SCRIPT_DIR))

from project_utils import (
    find_project_root,
    get_project_lessons_dir,
    ensure_lessons_dir
)

def load_v3_lessons() -> Dict:
    """
    Load v3.0 project.yaml
    
    Returns:
        Lessons data or empty dict
    """
    lessons_dir = get_project_lessons_dir()
    v3_file = lessons_dir / 'project.yaml'
    
    if not v3_file.exists():
        return None
    
    with open(v3_file, 'r', encoding='utf-8') as f:
        return yaml.safe_load(f) or {}

def categorize_lesson(lesson: Dict) -> str:
    """
    Determine if lesson is MISTAKE or IMPROVEMENT
    
    Logic:
    - severity ERROR/WARNING → MISTAKE
    - category improvement → IMPROVEMENT
    - Default: MISTAKE (conservative)
    
    Args:
        lesson: v3.0 lesson dict
        
    Returns:
        'mistake' or 'improvement'
    """
    severity = lesson.get('severity', '').upper()
    category = lesson.get('category', '').lower()
    
    # Explicit improvement indicators
    if 'improve' in category or 'benefit' in lesson.get('message', '').lower():
        return 'improvement'
    
    # High/Medium severity → mistake
    if severity in ['ERROR', 'HIGH', 'WARNING', 'MEDIUM']:
        return 'mistake'
    
    # Has anti-pattern keywords
    message = lesson.get('message', '').lower()
    anti_patterns = ['never', 'don\'t', 'avoid', 'not', 'wrong', 'bad', 'error']
    if any(word in message for word in anti_patterns):
        return 'mistake'
    
    # Default: mistake (conservative - better to prevent than miss)
    return 'mistake'

def convert_to_mistake(lesson: Dict, new_id: str) -> Dict:
    """
    Convert v3.0 lesson to v4.0 mistake format
    
    Args:
        lesson: v3.0 lesson
        new_id: New MISTAKE-XXX ID
        
    Returns:
        v4.0 mistake dict
    """
    now = datetime.now().isoformat()
    
    return {
        'id': new_id,
        'version': 1,
        'scope': lesson.get('scope', 'general'),
        
        # Core info
        'problem': f"Anti-pattern or error: {lesson.get('pattern', 'unknown')}",
        'lesson': lesson.get('message', ''),
        'severity': lesson.get('severity', 'medium').lower(),
        'impact': lesson.get('impact', 'Code quality degradation'),
        
        # Categorization
        'category': lesson.get('category', 'code-quality'),
        'tags': lesson.get('tags', []),
        'applies_to_files': lesson.get('files', []),
        
        # Lifecycle
        'created': lesson.get('addedAt', now),
        'updated': now,
        'previous_versions': [],
        'changelog': [
            {
                'version': 1,
                'date': now,
                'change': 'Migrated from v3.0 project.yaml'
            }
        ],
        
        # Metrics
        'hitCount': lesson.get('hitCount', 0),
        'appliedCount': lesson.get('appliedCount', 0),
        'lastHit': lesson.get('lastHit'),
        'lastApplied': lesson.get('lastApplied'),
        
        # Status
        'status': lesson.get('status', 'active'),
        'superseded_by': lesson.get('replacedBy'),
        'deprecated_at': None,
        'deprecated_reason': None,
        
        # Relationships
        'related_improvements': []
    }

def convert_to_improvement(lesson: Dict, new_id: str) -> Dict:
    """
    Convert v3.0 lesson to v4.0 improvement format
    
    Args:
        lesson: v3.0 lesson
        new_id: New IMPROVE-XXX ID
        
    Returns:
        v4.0 improvement dict
    """
    now = datetime.now().isoformat()
    
    return {
        'id': new_id,
        'version': 1,
        'scope': lesson.get('scope', 'general'),
        
        # Core info
        'improvement': lesson.get('pattern', 'Good practice'),
        'benefit': lesson.get('message', ''),
        'context': f"Learned: {lesson.get('source', 'manual')}",
        
        # Pattern (if available from message)
        'pattern': lesson.get('correct_pattern', ''),
        'when_to_use': '',
        
        # Metrics
        'improves_metrics': [],
        
        # Categorization
        'category': lesson.get('category', 'code-quality'),
        'tags': lesson.get('tags', []),
        'applies_to_files': lesson.get('files', []),
        
        # Lifecycle
        'created': lesson.get('addedAt', now),
        'updated': now,
        'previous_versions': [],
        'changelog': [
            {
                'version': 1,
                'date': now,
                'change': 'Migrated from v3.0 project.yaml'
            }
        ],
        
        # Metrics
        'appliedCount': lesson.get('appliedCount', 0),
        'lastApplied': lesson.get('lastApplied'),
        'effectiveness_score': None,
        
        # Status
        'status': lesson.get('status', 'active'),
        'superseded_by': lesson.get('replacedBy'),
        'deprecated_at': None,
        'deprecated_reason': None,
        
        # Relationships
        'related_mistakes': [],
        'replaces_pattern': None
    }

def migrate_v3_to_v4():
    """
    Main migration function
    
    Process:
    1. Load v3.0 project.yaml
    2. Categorize each lesson
    3. Split into mistakes + improvements
    4. Generate new IDs
    5. Save to separate files
    6. Create meta.json
    7. Backup original
    """
    print("🔄 Starting v3.0 → v4.0 migration...\n")
    
    # 1. Load v3.0 data
    v3_data = load_v3_lessons()
    if not v3_data:
        print("❌ No v3.0 project.yaml found. Nothing to migrate.")
        return False
    
    lessons = v3_data.get('lessons', [])
    if not lessons:
        print("❌ No lessons found in project.yaml")
        return False
    
    print(f"📚 Found {len(lessons)} lessons in v3.0 format\n")
    
    # 2. Categorize and convert
    mistakes = []
    improvements = []
    
    mistake_counter = 1
    improvement_counter = 1
    
    for lesson in lessons:
        lesson_type = categorize_lesson(lesson)
        
        if lesson_type == 'mistake':
            new_id = f"MISTAKE-{mistake_counter:03d}"
            mistakes.append(convert_to_mistake(lesson, new_id))
            print(f"  ✓ {lesson.get('id', '?')} → {new_id} (mistake)")
            mistake_counter += 1
        else:
            new_id = f"IMPROVE-{improvement_counter:03d}"
            improvements.append(convert_to_improvement(lesson, new_id))
            print(f"  ✓ {lesson.get('id', '?')} → {new_id} (improvement)")
            improvement_counter += 1
    
    print(f"\n📊 Split result:")
    print(f"  • Mistakes: {len(mistakes)}")
    print(f"  • Improvements: {len(improvements)}\n")
    
    # 3. Prepare output files
    lessons_dir = get_project_lessons_dir()
    ensure_lessons_dir()
    
    # Create versions directory
    versions_dir = lessons_dir / 'versions'
    versions_dir.mkdir(exist_ok=True)
    
    # 4. Save mistakes.yaml
    mistakes_file = lessons_dir / 'mistakes.yaml'
    mistakes_data = {
        'version': 1,
        'scope': 'project',
        'event_count': len(mistakes),
        'last_improved': None,
        'mistakes': mistakes,
        'metadata': {
            'total_mistakes': len(mistakes),
            'active_mistakes': len([m for m in mistakes if m['status'] == 'active']),
            'deprecated_mistakes': len([m for m in mistakes if m['status'] != 'active'])
        }
    }
    
    with open(mistakes_file, 'w', encoding='utf-8') as f:
        yaml.dump(mistakes_data, f, allow_unicode=True, default_flow_style=False, sort_keys=False)
    
    print(f"✅ Created {mistakes_file}")
    
    # 5. Save improvements.yaml
    improvements_file = lessons_dir / 'improvements.yaml'
    improvements_data = {
        'version': 1,
        'scope': 'project',
        'event_count': len(improvements),
        'last_improved': None,
        'improvements': improvements,
        'metadata': {
            'total_improvements': len(improvements),
            'active_improvements': len([i for i in improvements if i['status'] == 'active']),
            'deprecated_improvements': len([i for i in improvements if i['status'] != 'active'])
        }
    }
    
    with open(improvements_file, 'w', encoding='utf-8') as f:
        yaml.dump(improvements_data, f, allow_unicode=True, default_flow_style=False, sort_keys=False)
    
    print(f"✅ Created {improvements_file}")
    
    # 6. Create meta.json
    meta_file = lessons_dir / 'meta.json'
    project_root = find_project_root()
    now = datetime.now().isoformat()
    
    meta_data = {
        'version': '4.0.0',
        'schema_version': '1.0.0',
        'project': {
            'root': str(project_root),
            'name': project_root.name if project_root else 'unknown',
            'created': v3_data.get('created', now),
            'updated': now
        },
        'event_counter': {
            'total': len(lessons),
            'mistakes': len(mistakes),
            'improvements': len(improvements),
            'since_last_improve': 0
        },
        'self_improve': {
            'enabled': True,
            'trigger_threshold': 5,
            'apply_immediately': True,
            'notify_user': True,
            'history': [],
            'last_improved': None,
            'improve_count': 0,
            'next_trigger_at_event': 5
        },
        'files': {
            'mistakes': 'mistakes.yaml',
            'improvements': 'improvements.yaml',
            'versions_dir': 'versions/'
        },
        'versions': {
            'mistakes': {
                'current': 1,
                'history': [{
                    'version': 1,
                    'date': now,
                    'file': 'versions/mistakes-v1.yaml',
                    'change_summary': 'Initial split from project.yaml'
                }]
            },
            'improvements': {
                'current': 1,
                'history': [{
                    'version': 1,
                    'date': now,
                    'file': 'versions/improvements-v1.yaml',
                    'change_summary': 'Initial creation'
                }]
            }
        },
        'migration': {
            'from_version': '3.0.0',
            'migrated': True,
            'migration_date': now,
            'source_file': 'project.yaml',
            'lessons_count': len(lessons),
            'split_result': {
                'mistakes': len(mistakes),
                'improvements': len(improvements)
            }
        },
        'config': {
            'auto_track_events': True,
            'auto_trigger_improve': True,
            'require_user_approval': False,
            'backup_before_improve': True,
            'max_history_versions': 10
        }
    }
    
    with open(meta_file, 'w', encoding='utf-8') as f:
        json.dump(meta_data, f, indent=2, ensure_ascii=False)
    
    print(f"✅ Created {meta_file}")
    
    # 7. Backup original v3.0 file
    v3_file = lessons_dir / 'project.yaml'
    backup_file = lessons_dir / 'project.yaml.v3.backup'
    
    if v3_file.exists():
        import shutil
        shutil.copy2(v3_file, backup_file)
        print(f"\n💾 Backed up v3.0 file to {backup_file}")
    
    # 8. Save initial versions
    with open(versions_dir / 'mistakes-v1.yaml', 'w', encoding='utf-8') as f:
        yaml.dump(mistakes_data, f, allow_unicode=True, default_flow_style=False, sort_keys=False)
    
    with open(versions_dir / 'improvements-v1.yaml', 'w', encoding='utf-8') as f:
        yaml.dump(improvements_data, f, allow_unicode=True, default_flow_style=False, sort_keys=False)
    
    print(f"✅ Saved version history\n")
    
    print("🎉 Migration complete!")
    print(f"\n📁 New structure:")
    print(f"  {lessons_dir}/")
    print(f"  ├── mistakes.yaml ({len(mistakes)} mistakes)")
    print(f"  ├── improvements.yaml ({len(improvements)} improvements)")
    print(f"  ├── meta.json (config)")
    print(f"  ├── versions/ (history)")
    print(f"  └── project.yaml.v3.backup (backup)")
    
    return True

def main():
    """CLI entry point"""
    try:
        success = migrate_v3_to_v4()
        sys.exit(0 if success else 1)
    except Exception as e:
        print(f"\n❌ Migration failed: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)

if __name__ == "__main__":
    main()
