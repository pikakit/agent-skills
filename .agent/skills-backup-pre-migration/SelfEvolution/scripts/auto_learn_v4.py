#!/usr/bin/env python3
"""
Auto-Learn v4.0 - Integrated Learning Pipeline

FEATURES:
- Smart categorization (mistake vs improvement)
- Dual storage (mistakes.yaml + improvements.yaml)
- Event tracking with self-improve trigger
- Smart API key resolution
- AI-powered extraction (optional)
"""

import yaml
import sys
from pathlib import Path
from datetime import datetime
from typing import Dict

# Add scripts to path
SCRIPT_DIR = Path(__file__).parent
sys.path.insert(0, str(SCRIPT_DIR))

from detect_triggers import detect_mistake_trigger
from extract_lesson import extract_lesson_with_ai
from project_utils import (
    find_project_root,
    get_mistakes_file,
    get_improvements_file,
    ensure_v4_structure
)
from categorize_learning import categorize_learning, validate_categorization
from event_tracker import increment_event, check_threshold
from api_key_resolver import get_configured_genai

def format_lesson_message(lesson: Dict) -> str:
    """Format lesson for storage"""
    mistake = lesson.get('mistake', '')
    correction = lesson.get('correction', '')
    
    if mistake and correction:
        return f"{mistake} → {correction}"
    elif mistake:
        return mistake
    elif correction:
        return correction
    else:
        return "Lesson learned from conversation"

def determine_severity(lesson: Dict) -> str:
    """Determine severity from lesson"""
    impact = lesson.get('impact', '').lower()
    
    if any(word in impact for word in ['critical', 'severe', 'nghiêm trọng', 'data loss']):
        return 'CRITICAL'
    elif any(word in impact for word in ['high', 'important', 'quan trọng']):
        return 'ERROR'
    else:
        return 'WARNING'

def auto_learn_v4(user_message: str, ai_context: str = "", use_ai: bool = False) -> Dict:
    """
    Main auto-learn function (v4.0)
    
    Features:
    - Smart categorization (mistake vs improvement)
    - Dual storage (mistakes.yaml + improvements.yaml)
    - Event tracking with self-improve trigger
    - Smart API key resolution
    
    Args:
        user_message: User's message
        ai_context: Previous AI response (optional)
        use_ai: If True, use AI-powered extraction
        
    Returns:
        Dict with lesson info or error
    """
    # Ensure v4.0 structure exists
    ensure_v4_structure()
    
    # Step 1: Detect mistake trigger
    trigger = detect_mistake_trigger(user_message)
    
    if not trigger['detected']:
        return {
            "success": False,
            "error": "No mistake/improvement trigger detected",
            "confidence": trigger.get('confidence', 0)
        }
    
    # Step 2: Extract lesson
    if use_ai:
        # Try AI extraction
        genai = get_configured_genai(allow_prompt=False)
        
        if genai:
            try:
                lesson_data = extract_lesson_with_ai(user_message, ai_context, trigger)
                
                if not lesson_data:
                    return {"success": False, "error": "AI extraction failed"}
                
                # Convert to lesson format
                lesson = {
                    "mistake": lesson_data.get("mistake", ""),
                    "correction": lesson_data.get("correction", ""),
                    "impact": lesson_data.get("impact", "Medium")
                }
                
                lesson_text = f"{lesson['mistake']} → {lesson['correction']}"
            except Exception as e:
                return {"success": False, "error": f"AI extraction error: {e}"}
        else:
            return {"success": False, "error": "AI not available. Set GEMINI_API_KEY or run without --ai"}
    else:
        # Manual extraction
        lesson = {
            "mistake": user_message,
            "correction": "See context",
            "impact": "Medium"
        }
        lesson_text = user_message
    
    # Step 3: Categorize (mistake or improvement)
    category = categorize_learning(user_message, ai_context, lesson_text)
    validation = validate_categorization(category, user_message, lesson_text)
    
    # Step 4: Save to appropriate v4.0 file
    project_root = find_project_root()
    if not project_root:
        return {"success": False, "error": "Not in a project directory"}
    
    # Get target file
    if category == "mistake":
        target_file = get_mistakes_file()
        file_key = 'mistakes'
        id_prefix = 'MISTAKE'
    else:
        target_file = get_improvements_file()
        file_key = 'improvements'
        id_prefix = 'IMPROVE'
    
    # Load existing
    if target_file.exists():
        with open(target_file, 'r', encoding='utf-8') as f:
            data = yaml.safe_load(f) or {}
    else:
        data = {file_key: [], 'version': 1, 'last_improved': datetime.now().isoformat()}
    
    # Get next ID
    existing_ids = [l.get('id', '') for l in data.get(file_key, [])]
    existing_nums = [int(id.split('-')[1]) for id in existing_ids if '-' in id and id.split('-')[1].isdigit()]
    next_num = max(existing_nums) + 1 if existing_nums else 1
    next_id = f"{id_prefix}-{next_num:03d}"
    
    # Create entry
    if category == "mistake":
        entry = {
            'id': next_id,
            'version': 1,
            'problem': lesson.get('mistake', ''),
            'lesson': format_lesson_message(lesson),
            'severity': determine_severity(lesson),
            'impact': lesson.get('impact', 'Medium'),
            'anti_pattern': lesson.get('mistake', ''),
            'correct_pattern': lesson.get('correction', ''),
            'category': 'auto-detected',
            'source': 'auto-conversation',
            'addedAt': datetime.now().isoformat(),
            'hitCount': 0,
            'appliedCount': 0,
            'status': 'active',
            'changelog': []
        }
    else:
        entry = {
            'id': next_id,
            'version': 1,
            'improvement': format_lesson_message(lesson),
            'benefit': lesson.get('impact', 'Better code quality'),
            'pattern': lesson.get('correction', ''),
            'when_to_use': 'General development',
            'category': 'auto-detected',
            'source': 'auto-conversation',
            'addedAt': datetime.now().isoformat(),
            'hitCount': 0,
            'appliedCount': 0,
            'status': 'active',
            'changelog': []
        }
    
    # Add to data
    data.setdefault(file_key, []).append(entry)
    
    # Save
    with open(target_file, 'w', encoding='utf-8') as f:
        yaml.dump(data, f, allow_unicode=True, default_flow_style=False, sort_keys=False)
    
    # Step 5: Track event and check threshold
    increment_event(category)
    threshold_reached = check_threshold()
    
    threshold_msg = ""
    if threshold_reached:
        threshold_msg = "\n⚡ Self-improve threshold reached! Run: python self_improve.py"
    
    return {
        "success": True,
        "lesson_id": next_id,
        "category": category,
        "confidence": validation['confidence'],
        "message": entry.get('lesson', entry.get('improvement', '')),
        "file": str(target_file),
        "trigger": trigger.get('keyword', 'unknown'),
        "threshold_reached": threshold_reached,
        "threshold_message": threshold_msg
    }

def main():
    """CLI entry point"""
    import argparse
    
    parser = argparse.ArgumentParser(description='Auto-Learn v4.0')
    parser.add_argument('--message', '-m', type=str, help='User message with mistake/improvement')
    parser.add_argument('--context', '-c', type=str, default='', help='AI context (optional)')
    parser.add_argument('--ai', action='store_true', help='Use AI extraction (requires API key)')
    
    args = parser.parse_args()
    
    if not args.message:
        parser.print_help()
        return
    
    # Run auto-learn
    result = auto_learn_v4(args.message, args.context, args.ai)
    
    if result['success']:
        print(f"\n✅ Learned: {result['lesson_id']} ({result['category'].upper()})")
        print(f"   Message: {result['message']}")
        print(f"   Confidence: {result['confidence']:.0%}")
        print(f"   File: {result['file']}")
        print(f"   Trigger: {result['trigger']}")
        
        if result.get('threshold_message'):
            print(result['threshold_message'])
    else:
        print(f"\n❌ Failed: {result.get('error', 'Unknown error')}")
        if 'confidence' in result:
            print(f"   Confidence: {result['confidence']}%")

if __name__ == "__main__":
    main()
