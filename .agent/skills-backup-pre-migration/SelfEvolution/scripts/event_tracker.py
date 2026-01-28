#!/usr/bin/env python3
"""
Event Tracker for SelfEvolution v4.0
Tracks mistake and improvement events to trigger self-improve cycle
"""

import json
import sys
from pathlib import Path
from datetime import datetime
from typing import Dict, Optional

# Add scripts directory to path
SCRIPT_DIR = Path(__file__).parent
sys.path.insert(0, str(SCRIPT_DIR))

from project_utils import (
    get_meta_file,
    get_mistakes_file,
    get_improvements_file,
    ensure_v4_structure
)

def load_meta() -> Dict:
    """
    Load meta.json configuration
    
    Returns:
        Meta dict or default structure
    """
    meta_file = get_meta_file()
    
    if meta_file.exists():
        with open(meta_file, 'r', encoding='utf-8') as f:
            return json.load(f)
    
    # Default meta structure
    return {
        'version': '4.0.0',
        'schema_version': '1.0.0',
        'event_counter': {
            'total': 0,
            'mistakes': 0,
            'improvements': 0,
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
        'config': {
            'auto_track_events': True,
            'auto_trigger_improve': True,
            'require_user_approval': False,
            'backup_before_improve': True,
            'max_history_versions': 10
        }
    }

def save_meta(meta: Dict):
    """
    Save meta.json configuration
    
    Args:
        meta: Meta data to save
    """
    ensure_v4_structure()
    meta_file = get_meta_file()
    
    # Update timestamp
    meta['updated'] = datetime.now().isoformat()
    
    with open(meta_file, 'w', encoding='utf-8') as f:
        json.dump(meta, f, indent=2, ensure_ascii=False)

def increment_event(event_type: str) -> Dict:
    """
    Increment event counter
    
    Args:
        event_type: 'mistake' or 'improvement'
        
    Returns:
        Updated meta with new counts
    """
    meta = load_meta()
    counter = meta['event_counter']
    
    # Increment counters
    counter['total'] += 1
    counter['since_last_improve'] += 1
    
    if event_type == 'mistake':
        counter['mistakes'] += 1
    elif event_type == 'improvement':
        counter['improvements'] += 1
    else:
        raise ValueError(f"Invalid event_type: {event_type}. Must be 'mistake' or 'improvement'")
    
    save_meta(meta)
    
    return meta

def get_event_count() -> Dict:
    """
    Get current event counts
    
    Returns:
        Event counter dict with total, mistakes, improvements, since_last_improve
    """
    meta = load_meta()
    return meta.get('event_counter', {
        'total': 0,
        'mistakes': 0,
        'improvements': 0,
        'since_last_improve': 0
    })

def check_threshold() -> bool:
    """
    Check if event count has reached self-improve threshold
    
    Returns:
        True if threshold reached, False otherwise
    """
    meta = load_meta()
    counter = meta['event_counter']
    threshold = meta['self_improve']['trigger_threshold']
    
    return counter['since_last_improve'] >= threshold

def reset_since_last_improve():
    """
    Reset since_last_improve counter (called after self-improve cycle)
    """
    meta = load_meta()
    meta['event_counter']['since_last_improve'] = 0
    
    # Update self-improve metadata
    meta['self_improve']['last_improved'] = datetime.now().isoformat()
    meta['self_improve']['improve_count'] += 1
    
    # Calculate next trigger
    threshold = meta['self_improve']['trigger_threshold']
    current_total = meta['event_counter']['total']
    meta['self_improve']['next_trigger_at_event'] = current_total + threshold
    
    save_meta(meta)

def add_improve_history(changes: Dict):
    """
    Add entry to self-improve history
    
    Args:
        changes: Dict with keys like mistakes_kept, mistakes_refined, etc.
    """
    meta = load_meta()
    
    history_entry = {
        'cycle_number': meta['self_improve']['improve_count'] + 1,
        'triggered_at': datetime.now().isoformat(),
        'event_count_trigger': meta['event_counter']['since_last_improve'],
        'changes': changes,
        'skill_code_improved': True,
        'applied_to_source': True
    }
    
    meta['self_improve']['history'].append(history_entry)
    
    # Limit history size
    max_history = meta['config'].get('max_history_versions', 10)
    if len(meta['self_improve']['history']) > max_history:
        meta['self_improve']['history'] = meta['self_improve']['history'][-max_history:]
    
    save_meta(meta)

def get_config(key: str, default=None):
    """
    Get configuration value from meta.json
    
    Args:
        key: Config key (supports nested with dots, e.g., 'self_improve.enabled')
        default: Default value if key not found
        
    Returns:
        Config value or default
    """
    meta = load_meta()
    
    # Support nested keys
    keys = key.split('.')
    value = meta
    
    for k in keys:
        if isinstance(value, dict) and k in value:
            value = value[k]
        else:
            return default
    
    return value

def set_config(key: str, value):
    """
    Set configuration value in meta.json
    
    Args:
        key: Config key (supports nested with dots)
        value: Value to set
    """
    meta = load_meta()
    
    # Support nested keys
    keys = key.split('.')
    target = meta
    
    for k in keys[:-1]:
        if k not in target:
            target[k] = {}
        target = target[k]
    
    target[keys[-1]] = value
    save_meta(meta)

def get_statistics() -> Dict:
    """
    Get learning statistics
    
    Returns:
        Stats dict with counts, rates, etc.
    """
    import yaml
    
    meta = load_meta()
    counter = meta['event_counter']
    
    # Load mistakes
    mistakes_file = get_mistakes_file()
    mistakes_count = 0
    if mistakes_file.exists():
        with open(mistakes_file, 'r', encoding='utf-8') as f:
            data = yaml.safe_load(f) or {}
            mistakes_count = len(data.get('mistakes', []))
    
    # Load improvements
    improvements_file = get_improvements_file()
    improvements_count = 0
    if improvements_file.exists():
        with open(improvements_file, 'r', encoding='utf-8') as f:
            data = yaml.safe_load(f) or {}
            improvements_count = len(data.get('improvements', []))
    
    return {
        'event_counter': counter,
        'total_learnings': mistakes_count + improvements_count,
        'mistakes_count': mistakes_count,
        'improvements_count': improvements_count,
        'threshold': meta['self_improve']['trigger_threshold'],
        'threshold_reached': check_threshold(),
        'improve_count': meta['self_improve']['improve_count'],
        'last_improved': meta['self_improve'].get('last_improved'),
        'next_trigger': meta['self_improve'].get('next_trigger_at_event')
    }

def main():
    """CLI for testing event tracker"""
    import argparse
    
    parser = argparse.ArgumentParser(description='Event Tracker for SelfEvolution v4.0')
    subparsers = parser.add_subparsers(dest='command', help='Commands')
    
    # Increment command
    inc_parser = subparsers.add_parser('increment', help='Increment event counter')
    inc_parser.add_argument('type', choices=['mistake', 'improvement'], help='Event type')
    
    # Get command
    subparsers.add_parser('count', help='Get current event count')
    
    # Check threshold
    subparsers.add_parser('threshold', help='Check if threshold reached')
    
    # Statistics
    subparsers.add_parser('stats', help='Get learning statistics')
    
    # Reset
    subparsers.add_parser('reset', help='Reset since_last_improve counter')
    
    args = parser.parse_args()
    
    if args.command == 'increment':
        meta = increment_event(args.type)
        counter = meta['event_counter']
        print(f"✅ Incremented {args.type} event")
        print(f"   Total: {counter['total']}")
        print(f"   Mistakes: {counter['mistakes']}")
        print(f"   Improvements: {counter['improvements']}")
        print(f"   Since last improve: {counter['since_last_improve']}")
        
        if check_threshold():
            print(f"\n⚡ THRESHOLD REACHED! Time to self-improve!")
    
    elif args.command == 'count':
        counter = get_event_count()
        print("📊 Event Counts:")
        print(f"   Total: {counter['total']}")
        print(f"   Mistakes: {counter['mistakes']}")
        print(f"   Improvements: {counter['improvements']}")
        print(f"   Since last improve: {counter['since_last_improve']}")
    
    elif args.command == 'threshold':
        if check_threshold():
            print("⚡ Threshold REACHED - Self-improve should trigger")
        else:
            counter = get_event_count()
            threshold = get_config('self_improve.trigger_threshold', 5)
            remaining = threshold - counter['since_last_improve']
            print(f"📊 Threshold NOT reached")
            print(f"   Current: {counter['since_last_improve']}/{threshold}")
            print(f"   Remaining: {remaining} events")
    
    elif args.command == 'stats':
        stats = get_statistics()
        print("📊 Learning Statistics:\n")
        print(f"Events:")
        print(f"  Total: {stats['event_counter']['total']}")
        print(f"  Mistakes: {stats['event_counter']['mistakes']}")
        print(f"  Improvements: {stats['event_counter']['improvements']}")
        print(f"  Since last improve: {stats['event_counter']['since_last_improve']}")
        print(f"\nLearnings:")
        print(f"  Total: {stats['total_learnings']}")
        print(f"  Mistakes: {stats['mistakes_count']}")
        print(f"  Improvements: {stats['improvements_count']}")
        print(f"\nSelf-Improve:")
        print(f"  Threshold: {stats['threshold']}")
        print(f"  Reached: {'YES ⚡' if stats['threshold_reached'] else 'NO'}")
        print(f"  Improve count: {stats['improve_count']}")
        print(f"  Last improved: {stats['last_improved'] or 'Never'}")
        print(f"  Next trigger at: event #{stats['next_trigger']}")
    
    elif args.command == 'reset':
        reset_since_last_improve()
        print("✅ Reset since_last_improve counter")
        print("   Updated self-improve metadata")
    
    else:
        parser.print_help()

if __name__ == "__main__":
    main()
