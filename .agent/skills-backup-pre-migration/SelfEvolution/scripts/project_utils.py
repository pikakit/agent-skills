#!/usr/bin/env python3
"""
Project Detection Utility
Finds project root and manages project-scoped paths
"""

import os
from pathlib import Path
from typing import Optional

def find_project_root(start_path: Path = None) -> Optional[Path]:
    """
    Find project root by looking for marker files
    
    Searches upward from start_path for:
    - .git directory
    - package.json (Node.js)
    - pyproject.toml (Python)
    - Cargo.toml (Rust)
    
    Args:
        start_path: Directory to start search from (default: cwd)
        
    Returns:
        Path to project root or None if not found
    """
    if start_path is None:
        start_path = Path.cwd()
    
    current = start_path.resolve()
    
    # Markers that indicate project root
    markers = ['.git', 'package.json', 'pyproject.toml', 'Cargo.toml', 'go.mod']
    
    # Search upward until we hit filesystem root
    while current != current.parent:
        for marker in markers:
            if (current / marker).exists():
                return current
        current = current.parent
    
    return None

def get_project_lessons_dir(project_root: Path = None) -> Path:
    """
    Get project-specific lessons directory
    
    Args:
        project_root: Project root path (auto-detected if None)
        
    Returns:
        Path to lessons directory
    """
    if project_root is None:
        project_root = find_project_root()
        if project_root is None:
            raise ValueError(
                "Not in a project directory. "
                "Need .git, package.json, or other project marker."
            )
    
    lessons_dir = project_root / '.agent' / 'skills' / 'SelfEvolution' / 'lessons'
    return lessons_dir

def get_project_lessons_file(project_root: Path = None) -> Path:
    """
    Get project-specific lessons YAML file
    
    Args:
        project_root: Project root path (auto-detected if None)
        
    Returns:
        Path to project.yaml file
    """
    lessons_dir = get_project_lessons_dir(project_root)
    return lessons_dir / 'project.yaml'

def ensure_lessons_dir(project_root: Path = None) -> Path:
    """
    Ensure lessons directory exists
    
    Args:
        project_root: Project root path (auto-detected if None)
        
    Returns:
        Path to lessons directory
    """
    lessons_dir = get_project_lessons_dir(project_root)
    lessons_dir.mkdir(parents=True, exist_ok=True)
    return lessons_dir

def get_global_lessons_file() -> Path:
    """
    Get global (legacy) lessons file path
    
    Returns:
        Path to global lessons-learned.yaml
    """
    # Find .agent directory (4 levels up from scripts/)
    script_dir = Path(__file__).parent
    agent_dir = script_dir.parent.parent.parent.parent
    return agent_dir / '.agent' / 'knowledge' / 'lessons-learned.yaml'

# ============================================================================
# v4.0 Paths (Mistake/Improvement Separation)
# ============================================================================

def get_mistakes_file(project_root: Path = None) -> Path:
    """
    Get project-specific mistakes.yaml file (v4.0)
    
    Args:
        project_root: Project root path (auto-detected if None)
        
    Returns:
        Path to mistakes.yaml file
    """
    lessons_dir = get_project_lessons_dir(project_root)
    return lessons_dir / 'mistakes.yaml'

def get_improvements_file(project_root: Path = None) -> Path:
    """
    Get project-specific improvements.yaml file (v4.0)
    
    Args:
        project_root: Project root path (auto-detected if None)
        
    Returns:
        Path to improvements.yaml file
    """
    lessons_dir = get_project_lessons_dir(project_root)
    return lessons_dir / 'improvements.yaml'

def get_meta_file(project_root: Path = None) -> Path:
    """
    Get project-specific meta.json config file (v4.0)
    
    Args:
        project_root: Project root path (auto-detected if None)
        
    Returns:
        Path to meta.json file
    """
    lessons_dir = get_project_lessons_dir(project_root)
    return lessons_dir / 'meta.json'

def get_versions_dir(project_root: Path = None) -> Path:
    """
    Get version history directory (v4.0)
    
    Args:
        project_root: Project root path (auto-detected if None)
        
    Returns:
        Path to versions/ directory
    """
    lessons_dir = get_project_lessons_dir(project_root)
    return lessons_dir / 'versions'

def detect_version() -> str:
    """
    Detect which version of learning storage is in use
    
    Returns:
        '4.0' if v4.0 (mistakes + improvements)
        '3.0' if v3.0 (project.yaml)
        'none' if no learning files found
    """
    try:
        # Check for v4.0 files
        if get_mistakes_file().exists() or get_improvements_file().exists():
            return '4.0'
        
        # Check for v3.0 file
        if get_project_lessons_file().exists():
            return '3.0'
        
        # No learning files
        return 'none'
    
    except ValueError:
        # Not in project directory
        return 'none'

def ensure_v4_structure() -> bool:
    """
    Ensure v4.0 directory structure exists
    
    Creates:
    - lessons/
    - versions/
    
    Returns:
        True if created/exists, False if not in project
    """
    try:
        lessons_dir = ensure_lessons_dir()
        versions_dir = get_versions_dir()
        versions_dir.mkdir(exist_ok=True)
        return True
    except ValueError:
        return False

def is_project_scoped() -> bool:
    """
    Check if current directory is in a project
    
    Returns:
        True if project root found, False otherwise
    """
    return find_project_root() is not None

def main():
    """CLI for testing project detection"""
    import sys
    
    print("🔍 Project Detection Test\n")
    
    # Find project root
    root = find_project_root()
    if root:
        print(f"✅ Project root: {root}")
        print(f"   Lessons dir:  {get_project_lessons_dir(root)}")
        print(f"   Lessons file: {get_project_lessons_file(root)}")
    else:
        print("❌ Not in a project directory")
        sys.exit(1)
    
    # Check if lessons dir exists
    lessons_file = get_project_lessons_file(root)
    if lessons_file.exists():
        print(f"\n📚 Lessons file exists ({lessons_file.stat().st_size} bytes)")
    else:
        print(f"\n📭 No lessons file yet (will be created at {lessons_file})")
    
    # Show global lessons location
    global_file = get_global_lessons_file()
    if global_file.exists():
        print(f"\n🌍 Global lessons: {global_file} ({global_file.stat().st_size} bytes)")

if __name__ == "__main__":
    main()
