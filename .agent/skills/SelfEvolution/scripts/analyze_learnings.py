#!/usr/bin/env python3
"""
Learning Analysis Engine for SelfEvolution v4.0
AI-powered analysis to categorize learnings as keep/refine/add/deprecate
"""

import yaml
import json
import sys
import os
from pathlib import Path
from datetime import datetime
from typing import Dict, List, Optional
from dotenv import load_dotenv

# Add scripts directory to path
SCRIPT_DIR = Path(__file__).parent
sys.path.insert(0, str(SCRIPT_DIR))

from project_utils import (
    get_mistakes_file,
    get_improvements_file,
    get_meta_file
)

# Load environment variables
load_dotenv(SCRIPT_DIR.parent / '.env')

# Optional: Import Gemini API if available
try:
    import google.generativeai as genai
    GEMINI_AVAILABLE = True
except ImportError:
    GEMINI_AVAILABLE = False

def load_learnings() -> Dict:
    """
    Load all current learnings (mistakes + improvements)
    
    Returns:
        Dict with 'mistakes' and 'improvements' lists
    """
    result = {
        'mistakes': [],
        'improvements': []
    }
    
    # Load mistakes
    mistakes_file = get_mistakes_file()
    if mistakes_file.exists():
        with open(mistakes_file, 'r', encoding='utf-8') as f:
            data = yaml.safe_load(f) or {}
            result['mistakes'] = data.get('mistakes', [])
    
    # Load improvements
    improvements_file = get_improvements_file()
    if improvements_file.exists():
        with open(improvements_file, 'r', encoding='utf-8') as f:
            data = yaml.safe_load(f) or {}
            result['improvements'] = data.get('improvements', [])
    
    return result

def analyze_learning_with_ai(learning: Dict, learning_type: str, recent_events: List[Dict]) -> str:
    """
    Use AI to analyze if learning should be kept/refined/deprecated
    
    Args:
        learning: Mistake or improvement dict
        learning_type: 'mistake' or 'improvement'
        recent_events: Recent learning events for context
        
    Returns:
        'keep', 'refine', 'add_new', or 'deprecate'
    """
    if not GEMINI_AVAILABLE:
        return 'keep'  # Conservative default
    
    # Use smart API key resolver
    sys.path.insert(0, str(SCRIPT_DIR))
    from api_key_resolver import resolve_api_key
    
    resolution = resolve_api_key()
    if not resolution['api_key']:
        return 'keep'  # Fallback to heuristic
    
    try:
        genai.configure(api_key=resolution['api_key'])
        model = genai.GenerativeModel('gemini-2.0-flash-exp')
        
        prompt = f"""You are an AI assistant analyzing a coding lesson for quality and relevance.

Learning Type: {learning_type}
Learning ID: {learning.get('id')}
Learning Content:
{yaml.dump(learning, allow_unicode=True)}

Recent Events (last 5):
{json.dumps(recent_events[-5:], indent=2)}

Task: Categorize this learning into ONE of these categories:

1. **keep** - Learning is still valid and accurate. No changes needed.
2. **refine** - Learning is valid but could be improved (more specific, better examples, clearer message).
3. **deprecate** - Learning is outdated, no longer applicable, or superseded by newer knowledge.

Criteria:
- If hitCount = 0 and appliedCount > 0: likely 'keep' (working well)
- If hitCount > appliedCount: likely 'refine' (not being applied enough)
- If last applied > 30 days ago: consider 'deprecate' or 'refine'
- If lesson is vague or generic: 'refine'
- If lesson contradicts recent events: 'deprecate' or 'refine'

Respond with ONLY ONE WORD: keep, refine, or deprecate
"""
        
        response = model.generate_content(prompt)
        category = response.text.strip().lower()
        
        if category in ['keep', 'refine', 'deprecate']:
            return category
        else:
            return 'keep'  # Default if unexpected response
    
    except Exception as e:
        print(f"⚠️  AI analysis failed: {e}")
        return 'keep'

def analyze_learnings_heuristic(learning: Dict, learning_type: str) -> str:
    """
    Heuristic-based analysis (fallback if no AI)
    
    Args:
        learning: Mistake or improvement dict
        learning_type: 'mistake' or 'improvement'
        
    Returns:
        'keep', 'refine', or 'deprecate'
    """
    hit_count = learning.get('hitCount', 0)
    applied_count = learning.get('appliedCount', 0)
    status = learning.get('status', 'active')
    
    # Already deprecated
    if status != 'active':
        return 'deprecate'
    
    # Never applied = might need refinement
    if applied_count == 0 and learning_type == 'mistake':
        return 'refine'
    
    # Applied successfully with no violations = keep
    if applied_count > 0 and hit_count == 0:
        return 'keep'
    
    # More violations than applications = needs refinement
    if hit_count > applied_count:
        return 'refine'
    
    # Default: keep
    return 'keep'

def categorize_learnings(use_ai: bool = True) -> Dict:
    """
    Categorize all learnings into keep/refine/add_new/deprecate
    
    Args:
        use_ai: If True, use AI analysis. Otherwise use heuristics.
        
    Returns:
        Dict with categorized learnings
    """
    learnings = load_learnings()
    
    categorized = {
        'keep': [],
        'refine': [],
        'add_new': [],  # Populated by pattern detection, not here
        'deprecate': []
    }
    
    # Get recent events for context (if available)
    recent_events = []
    try:
        meta_file = get_meta_file()
        if meta_file.exists():
            with open(meta_file, 'r', encoding='utf-8') as f:
                meta = json.load(f)
                recent_events = meta.get('self_improve', {}).get('history', [])
    except:
        pass
    
    print(f"🔍 Analyzing {len(learnings['mistakes'])} mistakes...")
    for mistake in learnings['mistakes']:
        if use_ai:
            category = analyze_learning_with_ai(mistake, 'mistake', recent_events)
        else:
            category = analyze_learnings_heuristic(mistake, 'mistake')
        
        categorized[category].append({
            'type': 'mistake',
            'learning': mistake
        })
        print(f"  • {mistake['id']}: {category}")
    
    print(f"\n🔍 Analyzing {len(learnings['improvements'])} improvements...")
    for improvement in learnings['improvements']:
        if use_ai:
            category = analyze_learning_with_ai(improvement, 'improvement', recent_events)
        else:
            category = analyze_learnings_heuristic(improvement, 'improvement')
        
        categorized[category].append({
            'type': 'improvement',
            'learning': improvement
        })
        print(f"  • {improvement['id']}: {category}")
    
    return categorized

def generate_refinement_suggestions(learning: Dict, learning_type: str) -> Dict:
    """
    Generate suggestions for refining a learning
    
    Args:
        learning: Learning to refine
        learning_type: 'mistake' or 'improvement'
        
    Returns:
        Dict with suggested changes
    """
    if not GEMINI_AVAILABLE:
        return {
            'lesson': learning.get('lesson', learning.get('improvement', '')),
            'reason': 'No AI available - manual refinement needed'
        }
    
    api_key = os.getenv('GEMINI_API_KEY')
    if not api_key:
        return {
            'lesson': learning.get('lesson', learning.get('improvement', '')),
            'reason': 'No API key - manual refinement needed'
        }
    
    try:
        genai.configure(api_key=api_key)
        model = genai.GenerativeModel('gemini-2.0-flash-exp')
        
        current_lesson = learning.get('lesson') if learning_type == 'mistake' else learning.get('improvement')
        
        prompt = f"""You are refining a coding lesson to make it more specific, actionable, and clear.

Current Lesson ({learning_type}):
ID: {learning.get('id')}
Current Text: {current_lesson}
Hit Count: {learning.get('hitCount', 0)}
Applied Count: {learning.get('appliedCount', 0)}

Task: Improve this lesson by making it:
1. More specific (add concrete examples or patterns)
2. More actionable (clear do's and don'ts)
3. More memorable (concise but impactful)

Respond in JSON format:
{{
  "refined_lesson": "improved lesson text here",
  "changelog": "brief explanation of what was improved"
}}
"""
        
        response = model.generate_content(prompt)
        text = response.text.strip()
        
        # Extract JSON
        if '```json' in text:
            text = text.split('```json')[1].split('```')[0]
        elif '```' in text:
            text = text.split('```')[1].split('```')[0]
        
        result = json.loads(text)
        return {
            'lesson': result.get('refined_lesson', current_lesson),
            'changelog': result.get('changelog', 'AI refinement')
        }
    
    except Exception as e:
        print(f"⚠️  Refinement failed: {e}")
        return {
            'lesson': current_lesson,
            'reason': str(e)
        }

def detect_new_patterns() -> List[Dict]:
    """
    Detect new patterns from recent events that should become learnings
    
    Returns:
        List of potential new learnings
    """
    # TODO: Implement pattern detection from code analysis
    # For now, return empty list
    return []

def main():
    """CLI for testing learning analysis"""
    import argparse
    
    parser = argparse.ArgumentParser(description='Analyze learnings for self-improvement')
    parser.add_argument('--ai', action='store_true', help='Use AI analysis (requires GEMINI_API_KEY)')
    parser.add_argument('--refine', type=str, help='Generate refinement for specific learning ID')
    
    args = parser.parse_args()
    
    if args.refine:
        # Refine specific learning
        learnings = load_learnings()
        
        # Find learning
        target = None
        learning_type = None
        
        for mistake in learnings['mistakes']:
            if mistake['id'] == args.refine:
                target = mistake
                learning_type = 'mistake'
                break
        
        if not target:
            for improvement in learnings['improvements']:
                if improvement['id'] == args.refine:
                    target = improvement
                    learning_type = 'improvement'
                    break
        
        if not target:
            print(f"❌ Learning {args.refine} not found")
            sys.exit(1)
        
        print(f"🔄 Refining {args.refine}...\n")
        print(f"Current: {target.get('lesson', target.get('improvement'))}\n")
        
        suggestion = generate_refinement_suggestions(target, learning_type)
        
        print(f"Suggested: {suggestion['lesson']}")
        print(f"Reason: {suggestion.get('changelog', suggestion.get('reason'))}")
    
    else:
        # Analyze all
        print("📊 Learning Analysis\n")
        
        categorized = categorize_learnings(use_ai=args.ai)
        
        print(f"\n📊 Results:")
        print(f"  ✅ Keep: {len(categorized['keep'])} learnings")
        print(f"  🔄 Refine: {len(categorized['refine'])} learnings")
        print(f"  ➕ Add New: {len(categorized['add_new'])} learnings")
        print(f"  ❌ Deprecate: {len(categorized['deprecate'])} learnings")
        
        # Show details
        if categorized['refine']:
            print(f"\n🔄 Needs Refinement:")
            for item in categorized['refine']:
                learning = item['learning']
                print(f"  • {learning['id']}: hits={learning.get('hitCount', 0)}, applied={learning.get('appliedCount', 0)}")
        
        if categorized['deprecate']:
            print(f"\n❌ Should Deprecate:")
            for item in categorized['deprecate']:
                learning = item['learning']
                print(f"  • {learning['id']}: {learning.get('status', 'unknown')}")

if __name__ == "__main__":
    main()
