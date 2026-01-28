#!/usr/bin/env python3
"""
Lesson Query Engine
Query relevant lessons BEFORE coding to prevent mistakes
"""

import sys
import json
from pathlib import Path
from typing import List, Dict, Optional
from datetime import datetime

# Add scripts directory to path
SCRIPT_DIR = Path(__file__).parent
sys.path.insert(0, str(SCRIPT_DIR))

from project_utils import get_project_lessons_file, is_project_scoped
from auto_learn import load_knowledge

def calculate_relevance(lesson: Dict, context: str, scope: str = None) -> float:
    """
    Calculate relevance score for a lesson given context
    
    Args:
        lesson: Lesson dict
        context: What user is about to do
        scope: Optional scope filter
        
    Returns:
        Relevance score (0.0 - 1.0)
    """
    score = 0.0
    context_lower = context.lower()
    
    # Check scope match (highest priority)
    if scope and lesson.get('scope') == scope:
        score += 0.4
    
    # Check tags match
    tags = lesson.get('tags', [])
    for tag in tags:
        if tag.lower() in context_lower:
            score += 0.2
    
    # Check category match
    category = lesson.get('category', '')
    if category and category in context_lower:
        score += 0.15
    
    # Check message keywords
    message = lesson.get('message', '').lower()
    message_words = set(message.split())
    context_words = set(context_lower.split())
    
    # Word overlap
    overlap = message_words & context_words
    if overlap:
        score += min(len(overlap) * 0.05, 0.25)
    
    return min(score, 1.0)

def query_lessons(
    context: str,
    scope: str = None,
    severity: str = None,
    limit: int = 10,
    min_relevance: float = 0.1
) -> List[Dict]:
    """
    Query relevant lessons for current coding task
    
    Args:
        context: What agent is about to do (e.g., "writing menu navigation code")
        scope: Filter by scope (cli-navigation, api-design, etc.)
        severity: Filter by severity (ERROR, WARNING)
        limit: Max results to return
        min_relevance: Minimum relevance threshold
        
    Returns:
        List of relevant lessons sorted by relevance
    """
    # Load lessons
    knowledge = load_knowledge()
    lessons = knowledge.get('lessons', [])
    
    if not lessons:
        return []
    
    # Calculate relevance for each lesson
    scored_lessons = []
    for lesson in lessons:
        # Skip deprecated lessons
        if lesson.get('status') == 'deprecated':
            continue
        
        # Apply severity filter
        if severity and lesson.get('severity') != severity:
            continue
        
        # Calculate relevance
        relevance = calculate_relevance(lesson, context, scope)
        
        if relevance >= min_relevance:
            lesson_copy = lesson.copy()
            lesson_copy['relevance'] = relevance
            scored_lessons.append(lesson_copy)
    
    # Sort by relevance (highest first)
    scored_lessons.sort(key=lambda x: x['relevance'], reverse=True)
    
    # Return top N
    return scored_lessons[:limit]

def format_lessons_for_prompt(lessons: List[Dict]) -> str:
    """
    Format lessons for inclusion in AI generation prompt
    
    Args:
        lessons: List of relevant lessons
        
    Returns:
        Formatted string to add to prompt
    """
    if not lessons:
        return ""
    
    prompt_section = "\n📚 **Learned Lessons to Apply** (from past mistakes):\n\n"
    
    for lesson in lessons:
        relevance_pct = int(lesson['relevance'] * 100)
        prompt_section += f"- [{lesson['id']}] ({relevance_pct}% relevant, {lesson['severity']})\n"
        prompt_section += f"  {lesson['message']}\n\n"
    
    return prompt_section

def mark_lesson_applied(lesson_id: str):
    """
    Mark a lesson as applied (for analytics)
    
    Args:
        lesson_id: ID of lesson that was applied
    """
    knowledge = load_knowledge()
    lessons = knowledge.get('lessons', [])
    
    for lesson in lessons:
        if lesson.get('id') == lesson_id:
            # Increment apply count
            lesson['appliedCount'] = lesson.get('appliedCount', 0) + 1
            lesson['lastApplied'] = datetime.now().isoformat()
            break
    
    # Save updated knowledge
    from auto_learn import save_knowledge
    save_knowledge(knowledge)

def main():
    """CLI for querying lessons"""
    import argparse
    
    parser = argparse.ArgumentParser(description='Query relevant lessons before coding')
    parser.add_argument('context', help='What you are about to do')
    parser.add_argument('--scope', '-s', help='Filter by scope')
    parser.add_argument('--severity', choices=['ERROR', 'WARNING'], help='Filter by severity')
    parser.add_argument('--limit', '-l', type=int, default=5, help='Max results')
    parser.add_argument('--json', action='store_true', help='Output as JSON')
    parser.add_argument('--for-prompt', action='store_true', help='Format for AI prompt')
    
    args = parser.parse_args()
    
    # Query lessons
    lessons = query_lessons(
        args.context,
        scope=args.scope,
        severity=args.severity,
        limit=args.limit
    )
    
    if not lessons:
        print("📭 No relevant lessons found.")
        return
    
    # Output format
    if args.json:
        print(json.dumps(lessons, indent=2, ensure_ascii=False))
    
    elif args.for_prompt:
        print(format_lessons_for_prompt(lessons))
    
    else:
        # Human-readable format
        print(f"\n📚 {len(lessons)} relevant lesson(s) found:\n")
        
        for lesson in lessons:
            relevance_pct = int(lesson['relevance'] * 100)
            print(f"  [{lesson['id']}] {relevance_pct}% relevant | {lesson['severity']}")
            print(f"  {lesson['message']}")
            
            if lesson.get('scope'):
                print(f"  Scope: {lesson['scope']}")
            
            if lesson.get('tags'):
                print(f"  Tags: {', '.join(lesson['tags'])}")
            
            print()
        
        print("💡 Use these lessons to avoid repeating past mistakes!")

if __name__ == "__main__":
    main()
