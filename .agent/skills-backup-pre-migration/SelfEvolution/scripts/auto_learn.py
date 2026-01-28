#!/usr/bin/env python3
"""
Auto-Learn Main Orchestrator
Coordinates mistake detection → lesson extraction → knowledge base update
"""

import os
import sys
import json
import yaml
from pathlib import Path
from datetime import datetime

# Add scripts directory to path
SCRIPT_DIR = Path(__file__).parent
sys.path.insert(0, str(SCRIPT_DIR))

from detect_triggers import detect_mistake
from extract_lesson import extract_lesson
from project_utils import (
    find_project_root,
    get_project_lessons_file,
    ensure_lessons_dir,
    get_global_lessons_file,
    is_project_scoped
)


def load_knowledge():
    """
    Load project-scoped lessons with fallback to global
    
    Migration strategy:
    1. Try project-local lessons first
    2. If not found, import from global
    3. Future loads use project-local only
    """
    try:
        # Get project-scoped path
        lessons_file = get_project_lessons_file()
        
        if lessons_file.exists():
            # Load project lessons
            with open(lessons_file, 'r', encoding='utf-8') as f:
                data = yaml.safe_load(f) or {"version": 1, "lessons": [], "scope": "project"}
                return data
        
        # First time: migrate from global
        global_file = get_global_lessons_file()
        if global_file.exists():
            print(f"📦 Migrating lessons from global to project-scoped storage...")
            with open(global_file, 'r', encoding='utf-8') as f:
                global_data = yaml.safe_load(f) or {"version": 1, "lessons": []}
            
            # Mark as project-scoped
            global_data["scope"] = "project"
            global_data["migrated_from"] = "global"
            global_data["migrated_at"] = datetime.now().isoformat()
            
            # Save to project location
            ensure_lessons_dir()
            with open(lessons_file, 'w', encoding='utf-8') as f:
                yaml.dump(global_data, f, allow_unicode=True, default_flow_style=False, sort_keys=False)
            
            print(f"✅ Migrated {len(global_data.get('lessons', []))} lessons to {lessons_file}")
            return global_data
        
        # No global, no project → empty
        return {"version": 1, "lessons": [], "scope": "project"}
    
    except ValueError as e:
        # Not in project directory
        print(f"⚠️  Warning: {e}")
        print("   Using global lessons instead.")
        
        global_file = get_global_lessons_file()
        if global_file.exists():
            with open(global_file, 'r', encoding='utf-8') as f:
                return yaml.safe_load(f) or {"version": 1, "lessons": []}
        return {"version": 1, "lessons": [], "scope": "global"}

def save_knowledge(data):
    """Save lessons to project-scoped storage"""
    try:
        lessons_file = get_project_lessons_file()
        ensure_lessons_dir()
        
        # Ensure scope is set
        if "scope" not in data:
            data["scope"] = "project"
        data["updated_at"] = datetime.now().isoformat()
        
        with open(lessons_file, 'w', encoding='utf-8') as f:
            yaml.dump(data, f, allow_unicode=True, default_flow_style=False, sort_keys=False)
    
    except ValueError as e:
        # Fallback to global if not in project
        print(f"⚠️  Warning: {e}")
        print("   Saving to global lessons instead.")
        
        global_file = get_global_lessons_file()
        global_file.parent.mkdir(parents=True, exist_ok=True)
        with open(global_file, 'w', encoding='utf-8') as f:
            yaml.dump(data, f, allow_unicode=True, default_flow_style=False, sort_keys=False)

def get_next_lesson_id(lessons):
    """Generate next LEARN-XXX ID"""
    if not lessons:
        return "LEARN-001"
    
    # Find highest number
    max_num = 0
    for lesson in lessons:
        lesson_id = lesson.get('id', '')
        if lesson_id.startswith('LEARN-'):
            try:
                num = int(lesson_id.split('-')[1])
                max_num = max(max_num, num)
            except ValueError:
                continue
    
    return f"LEARN-{str(max_num + 1).zfill(3)}"

def is_duplicate(new_lesson, existing_lessons):
    """
    Check if lesson already exists
    
    Args:
        new_lesson: New lesson dict
        existing_lessons: List of existing lessons
        
    Returns:
        (bool, Optional[str]) - (is_duplicate, existing_id)
    """
    new_pattern = new_lesson.get('pattern', '').lower()
    new_message = new_lesson.get('message', '').lower()
    
    for lesson in existing_lessons:
        # Check pattern match
        if lesson.get('pattern', '').lower() == new_pattern:
            return (True, lesson.get('id'))
        
        # Check message similarity (simple word overlap)
        existing_msg = lesson.get('message', '').lower()
        new_words = set(new_message.split())
        existing_words = set(existing_msg.split())
        
        # If 70% words overlap, consider duplicate
        if len(new_words & existing_words) / len(new_words | existing_words) > 0.7:
            return (True, lesson.get('id'))
    
    return (False, None)

def auto_learn(user_message, ai_context="", force=False, use_ai=True):
    """
    Enhanced auto-learning pipeline with AI extraction
    
    Args:
        user_message: User's message indicating mistake
        ai_context: Previous AI response (optional)
        force: Force add even if confidence is low
        use_ai: If True, use AI to extract lesson automatically
        
    Returns:
        {
            "success": bool,
            "message": str,
            "method": str (AI or manual),
            "lesson_id": Optional[str],
            "confidence": int
        }
    """
    # Step 1: Detect mistake
    detection = detect_mistake(user_message, ai_context)
    
    if not detection['detected'] and not force:
        return {
            "success": False,
            "message": "No mistake trigger detected",
            "confidence": detection['confidence']
        }
    
    # Low confidence warning
    if detection['confidence'] < 50 and not force:
        return {
            "success": False,
            "message": f"Low confidence ({detection['confidence']}%). Use --force to override.",
            "confidence": detection['confidence']
        }
    
    # Step 2: Try AI extraction if enabled and confidence is decent
    if use_ai and detection['confidence'] >= 50:
        try:
            from extract_lesson import extract_lesson_with_ai, extract_lesson
            
            # Extract using AI
            extracted = extract_lesson_with_ai(
                user_message,
                ai_context,
                detection
            )
            
            # Generate lesson from extracted context
            lesson_context = {
                "mistake": extracted['mistake'],
                "correction": extracted['correction'],
                "impact": extracted['impact'],
                "mistake_type": extracted['mistake_type']
            }
            lesson = extract_lesson(lesson_context)
            
            # Add to knowledge base
            knowledge = load_knowledge()
            lessons = knowledge.get('lessons', [])
            
            # Check duplicates
            is_dup, existing_id = is_duplicate(lesson, lessons)
            if is_dup:
                return {
                    "success": False,
                    "message": f"Duplicate lesson (similar to {existing_id})",
                    "method": "AI",
                    "lesson_id": existing_id
                }
            
            # Generate ID and add
            lesson_id = get_next_lesson_id(lessons)
            lesson['id'] = lesson_id
            lessons.append(lesson)
            knowledge['lessons'] = lessons
            save_knowledge(knowledge)
            
            return {
                "success": True,
                "method": "AI",
                "message": f"Lesson {lesson_id} created using AI extraction",
                "lesson_id": lesson_id,
                "lesson": lesson,
                "confidence": int(extracted['confidence'] * 100)
            }
        
        except ImportError as e:
            return {
                "success": False,
                "message": f"AI extraction unavailable: {e}. Install: pip install google-generativeai",
                "fallback": "manual",
                "confidence": detection['confidence']
            }
        
        except ValueError as e:
            return {
                "success": False,
                "message": f"AI extraction failed: {e}",
                "fallback": "manual",
                "confidence": detection['confidence']
            }
        
        except Exception as e:
            return {
                "success": False,
                "message": f"Unexpected error: {e}. Use manual mode.",
                "fallback": "manual",
                "confidence": detection['confidence']
            }
    
    # Fallback: Manual extraction mode
    return {
        "success": True,
        "message": "Mistake detected. Use manual extraction or add --ai flag.",
        "method": "manual",
        "confidence": detection['confidence'],
        "triggers": detection['triggers'],
        "context": detection['context']
    }

def add_lesson(context_dict):
    """
    Add a lesson to knowledge base
    
    Args:
        context_dict: {
            "mistake": str,
            "correction": str,
            "impact": str,
            "mistake_type": str (optional)
        }
        
    Returns:
        {
            "success": bool,
            "message": str,
            "lesson_id": str
        }
    """
    # Load knowledge base
    knowledge = load_knowledge()
    lessons = knowledge.get('lessons', [])
    
    # Extract lesson
    lesson = extract_lesson(context_dict)
    
    # Check for duplicates
    is_dup, existing_id = is_duplicate(lesson, lessons)
    if is_dup:
        return {
            "success": False,
            "message": f"Duplicate lesson detected (similar to {existing_id})",
            "lesson_id": existing_id
        }
    
    # Generate ID
    lesson_id = get_next_lesson_id(lessons)
    lesson['id'] = lesson_id
    
    # Add to knowledge base
    lessons.append(lesson)
    knowledge['lessons'] = lessons
    
    # Save
    save_knowledge(knowledge)
    
    return {
        "success": True,
        "message": f"Lesson {lesson_id} added successfully",
        "lesson_id": lesson_id,
        "lesson": lesson
    }

def main():
    """CLI entry point"""
    import argparse
    
    parser = argparse.ArgumentParser(description='Auto-learn from mistakes')
    subparsers = parser.add_subparsers(dest='command', help='Commands')
    
    # Detect command
    detect_parser = subparsers.add_parser('detect', help='Detect mistake in message')
    detect_parser.add_argument('--message', '-m', required=True, help='User message')
    detect_parser.add_argument('--context', '-c', default='', help='AI context')
    detect_parser.add_argument('--force', '-f', action='store_true', help='Force detection')
    detect_parser.add_argument('--ai', action='store_true', help='Use AI to extract lesson automatically')
    
    # Add command
    add_parser = subparsers.add_parser('add', help='Add lesson from context')
    add_parser.add_argument('--context', '-c', required=True, help='JSON context')
    
    # Test command
    test_parser = subparsers.add_parser('test', help='Run test suite')
    
    args = parser.parse_args()
    
    if args.command == 'detect':
        use_ai = args.ai if hasattr(args, 'ai') else False
        result = auto_learn(args.message, args.context, args.force, use_ai)
        print(json.dumps(result, indent=2, ensure_ascii=False))
    
    elif args.command == 'add':
        context = json.loads(args.context)
        result = add_lesson(context)
        print(json.dumps(result, indent=2, ensure_ascii=False))
        
        if result['success']:
            print(f"\n📚 Đã học: [{result['lesson_id']}] - {result['lesson']['message']}")
    
    elif args.command == 'test':
        print("🧪 Running auto-learn test suite...\n")
        
        # Test 1: Mistake detection
        print("Test 1: Mistake Detection")
        test_msg = "Đây là lỗi nghiêm trọng, bạn tạo file sai"
        result = auto_learn(test_msg)
        print(f"Message: {test_msg}")
        print(f"Result: {json.dumps(result, indent=2, ensure_ascii=False)}\n")
        
        # Test 2: Lesson extraction
        print("Test 2: Lesson Extraction")
        test_context = {
            "mistake": "Used customSelect instead of p.select",
            "correction": "Always use p.select() + p.isCancel()",
            "impact": "ESC key broke menu navigation",
            "mistake_type": "code-quality"
        }
        lesson = extract_lesson(test_context)
        print(f"Context: {test_context}")
        print(f"Lesson: {json.dumps(lesson, indent=2, ensure_ascii=False)}\n")
        
        print("✅ Test suite completed")
    
    else:
        parser.print_help()

if __name__ == "__main__":
    main()
