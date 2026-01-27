#!/usr/bin/env python3
"""
Version Manager for SelfEvolution v4.0
Manages version history, changelog, and rollback capability
"""

import yaml
import json
import shutil
import sys
from pathlib import Path
from datetime import datetime
from typing import Dict, List, Optional

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

def save_version(version_type: str, version_number: int, data: Dict) -> Path:
    """
    Save a version snapshot
    
    Args:
        version_type: 'mistakes' or 'improvements'
        version_number: Version number
        data: Data to save
        
    Returns:
        Path to saved version file
    """
    ensure_v4_structure()
    versions_dir = get_versions_dir()
    
    version_file = versions_dir / f'{version_type}-v{version_number}.yaml'
    
    with open(version_file, 'w', encoding='utf-8') as f:
        yaml.dump(data, f, allow_unicode=True, default_flow_style=False, sort_keys=False)
    
    return version_file

def load_version(version_type: str, version_number: int) -> Optional[Dict]:
    """
    Load a specific version
    
    Args:
        version_type: 'mistakes' or 'improvements'
        version_number: Version number to load
        
    Returns:
        Version data or None if not found
    """
    versions_dir = get_versions_dir()
    version_file = versions_dir / f'{version_type}-v{version_number}.yaml'
    
    if not version_file.exists():
        return None
    
    with open(version_file, 'r', encoding='utf-8') as f:
        return yaml.safe_load(f)

def list_versions(version_type: str) -> List[Dict]:
    """
    List all versions of a type
    
    Args:
        version_type: 'mistakes' or 'improvements'
        
    Returns:
        List of version info dicts
    """
    versions_dir = get_versions_dir()
    
    if not versions_dir.exists():
        return []
    
    version_files = sorted(versions_dir.glob(f'{version_type}-v*.yaml'))
    
    versions = []
    for v_file in version_files:
        # Extract version number
        version_str = v_file.stem.split('-v')[1]
        version_num = int(version_str)
        
        # Get file stats
        stat = v_file.stat()
        
        # Load data to get metadata
        with open(v_file, 'r', encoding='utf-8') as f:
            data = yaml.safe_load(f) or {}
        
        count = len(data.get(version_type, []))
        last_improved = data.get('last_improved')
        
        versions.append({
            'version': version_num,
            'file': str(v_file),
            'size': stat.st_size,
            'modified': datetime.fromtimestamp(stat.st_mtime).isoformat(),
            'count': count,
            'last_improved': last_improved
        })
    
    return versions

def get_current_version(version_type: str) -> int:
    """
    Get current version number
    
    Args:
        version_type: 'mistakes' or 'improvements'
        
    Returns:
        Current version number
    """
    if version_type == 'mistakes':
        file_path = get_mistakes_file()
    else:
        file_path = get_improvements_file()
    
    if not file_path.exists():
        return 0
    
    with open(file_path, 'r', encoding='utf-8') as f:
        data = yaml.safe_load(f) or {}
    
    return data.get('version', 1)

def rollback_to_version(version_type: str, target_version: int) -> bool:
    """
    Rollback to a specific version
    
    Args:
        version_type: 'mistakes' or 'improvements'  
        target_version: Version number to rollback to
        
    Returns:
        True if successful, False otherwise
    """
    # Load target version
    target_data = load_version(version_type, target_version)
    
    if not target_data:
        print(f"❌ Version {target_version} not found")
        return False
    
    # Get current file
    if version_type == 'mistakes':
        current_file = get_mistakes_file()
    else:
        current_file = get_improvements_file()
    
    # Backup current version first
    current_version = get_current_version(version_type)
    backup_file = current_file.parent / f'{version_type}.backup-v{current_version}.yaml'
    
    if current_file.exists():
        shutil.copy2(current_file, backup_file)
        print(f"💾 Backed up current version to {backup_file.name}")
    
    # Restore target version
    with open(current_file, 'w', encoding='utf-8') as f:
        yaml.dump(target_data, f, allow_unicode=True, default_flow_style=False, sort_keys=False)
    
    print(f"✅ Rolled back to version {target_version}")
    
    # Update meta.json
    try:
        meta_file = get_meta_file()
        if meta_file.exists():
            with open(meta_file, 'r', encoding='utf-8') as f:
                meta = json.load(f)
            
            # Add rollback entry to history
            if 'rollbacks' not in meta:
                meta['rollbacks'] = []
            
            meta['rollbacks'].append({
                'type': version_type,
                'from_version': current_version,
                'to_version': target_version,
                'rolled_back_at': datetime.now().isoformat()
            })
            
            meta['updated'] = datetime.now().isoformat()
            
            with open(meta_file, 'w', encoding='utf-8') as f:
                json.dump(meta, f, indent=2, ensure_ascii=False)
    except Exception as e:
        print(f"⚠️  Could not update meta.json: {e}")
    
    return True

def compare_versions(version_type: str, version_a: int, version_b: int) -> Dict:
    """
    Compare two versions
    
    Args:
        version_type: 'mistakes' or 'improvements'
        version_a: First version
        version_b: Second version
        
    Returns:
        Dict with comparison results
    """
    data_a = load_version(version_type, version_a)
    data_b = load_version(version_type, version_b)
    
    if not data_a or not data_b:
        return {'error': 'One or both versions not found'}
    
    items_a = data_a.get(version_type, [])
    items_b = data_b.get(version_type, [])
    
    # Get IDs
    ids_a = set(item['id'] for item in items_a)
    ids_b = set(item['id'] for item in items_b)
    
    # Find differences
    added = ids_b - ids_a
    removed = ids_a - ids_b
    common = ids_a & ids_b
    
    # Check for modifications in common items
    modified = []
    for item_id in common:
        item_a = next(i for i in items_a if i['id'] == item_id)
        item_b = next(i for i in items_b if i['id'] == item_id)
        
        if item_a.get('version', 1) != item_b.get('version', 1):
            modified.append({
                'id': item_id,
                'version_a': item_a.get('version', 1),
                'version_b': item_b.get('version', 1)
            })
    
    return {
        'version_a': version_a,
        'version_b': version_b,
        'total_a': len(items_a),
        'total_b': len(items_b),
        'added': list(added),
        'removed': list(removed),
        'modified': modified
    }

def display_changelog(version_type: str, version_number: int):
    """
    Display changelog for a version
    
    Args:
        version_type: 'mistakes' or 'improvements'
        version_number: Version to display
    """
    data = load_version(version_type, version_number)
    
    if not data:
        print(f"Version {version_number} not found")
        return
    
    items = data.get(version_type, [])
    
    print(f"\n📋 Changelog for {version_type} v{version_number}")
    print(f"Last improved: {data.get('last_improved', 'Never')}")
    print(f"Total items: {len(items)}\n")
    
    for item in items:
        changelog = item.get('changelog', [])
        if not changelog:
            continue
        
        print(f"{item['id']} (v{item.get('version', 1)}):")
        for entry in changelog:
            print(f"  v{entry.get('version', '?')}: {entry.get('change', 'No details')}")
            print(f"     Date: {entry.get('date', 'Unknown')[:10]}")
        print()

def main():
    """CLI entry point"""
    import argparse
    
    parser = argparse.ArgumentParser(description='Version Manager for SelfEvolution v4.0')
    subparsers = parser.add_subparsers(dest='command', help='Commands')
    
    # List versions
    list_parser = subparsers.add_parser('list', help='List all versions')
    list_parser.add_argument('type', choices=['mistakes', 'improvements'], help='Type')
    
    # Show version details
    show_parser = subparsers.add_parser('show', help='Show version details')
    show_parser.add_argument('type', choices=['mistakes', 'improvements'], help='Type')
    show_parser.add_argument('version', type=int, help='Version number')
    
    # Rollback
    rollback_parser = subparsers.add_parser('rollback', help='Rollback to version')
    rollback_parser.add_argument('type', choices=['mistakes', 'improvements'], help='Type')
    rollback_parser.add_argument('version', type=int, help='Target version')
    
    # Compare
    compare_parser = subparsers.add_parser('compare', help='Compare versions')
    compare_parser.add_argument('type', choices=['mistakes', 'improvements'], help='Type')
    compare_parser.add_argument('version_a', type=int, help='First version')
    compare_parser.add_argument('version_b', type=int, help='Second version')
    
    # Changelog
    changelog_parser = subparsers.add_parser('changelog', help='Show changelog')
    changelog_parser.add_argument('type', choices=['mistakes', 'improvements'], help='Type')
    changelog_parser.add_argument('version', type=int, help='Version number')
    
    args = parser.parse_args()
    
    if args.command == 'list':
        versions = list_versions(args.type)
        
        if not versions:
            print(f"No versions found for {args.type}")
            return
        
        print(f"\n📚 {args.type.capitalize()} Versions:\n")
        for v in versions:
            print(f"v{v['version']}: {v['modified'][:10]} - {v['count']} items ({v['size']} bytes)")
    
    elif args.command == 'show':
        data = load_version(args.type, args.version)
        
        if not data:
            print(f"Version {args.version} not found")
            return
        
        print(f"\n{args.type.capitalize()} v{args.version}:")
        print(f"Last improved: {data.get('last_improved', 'Never')}")
        print(f"Total items: {len(data.get(args.type, []))}")
        
        print(f"\nItems:")
        for item in data.get(args.type, []):
            print(f"  {item['id']} (v{item.get('version', 1)}): {item.get('lesson', item.get('improvement', ''))[:60]}")
    
    elif args.command == 'rollback':
        confirm = input(f"⚠️  Rollback {args.type} to v{args.version}? (yes/no): ")
        
        if confirm.lower() == 'yes':
            rollback_to_version(args.type, args.version)
        else:
            print("Cancelled")
    
    elif args.command == 'compare':
        result = compare_versions(args.type, args.version_a, args.version_b)
        
        if 'error' in result:
            print(f"❌ {result['error']}")
            return
        
        print(f"\n📊 Comparing v{args.version_a} vs v{args.version_b}:")
        print(f"  v{args.version_a}: {result['total_a']} items")
        print(f"  v{args.version_b}: {result['total_b']} items")
        print(f"\n  Added: {len(result['added'])} - {result['added']}")
        print(f"  Removed: {len(result['removed'])} - {result['removed']}")
        print(f"  Modified: {len(result['modified'])}")
        
        for mod in result['modified']:
            print(f"    {mod['id']}: v{mod['version_a']} → v{mod['version_b']}")
    
    elif args.command == 'changelog':
        display_changelog(args.type, args.version)
    
    else:
        parser.print_help()

if __name__ == "__main__":
    main()
