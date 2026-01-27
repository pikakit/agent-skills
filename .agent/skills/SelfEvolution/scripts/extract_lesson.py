#!/usr/bin/env python3
"""
Lesson Extraction Engine
Converts mistake context into structured lesson entries
"""

import re
import json
import os
from datetime import datetime
from typing import Dict, Optional
from pathlib import Path

# Load environment variables
from dotenv import load_dotenv
load_dotenv(Path(__file__).parent.parent / '.env')

def extract_lesson_with_ai(user_message: str, ai_context: str = "", mistake_trigger: Dict = None) -> Dict:
    """
    Use Gemini API to extract mistake/correction/impact from conversation
    
    Args:
        user_message: User's message indicating mistake
        ai_context: Previous AI response (optional)
        mistake_trigger: Trigger info from detector (optional)
        
    Returns:
        {
            "mistake": str,
            "correction": str,
            "impact": str,
            "confidence": float,
            "mistake_type": str
        }
    """
    # Use smart API key resolver
    import sys
    sys.path.insert(0, str(Path(__file__).parent))
    from api_key_resolver import get_configured_genai
    
    genai = get_configured_genai(allow_prompt=False)
    if not genai:
        raise ValueError(
            "No API key found. Options:\n"
            "1. Agent auto-detects: Set GEMINI_API_KEY in your terminal\n"
            "2. Project-specific: Create .env file with GEMINI_API_KEY\n"
            "3. Get free key at: https://aistudio.google.com/app/apikey"
        )
    
    # Configure Gemini
    genai.configure(api_key=api_key)
    model = genai.GenerativeModel('gemini-pro')
    
    # Build context info
    trigger_info = ""
    if mistake_trigger and mistake_trigger.get('triggers'):
        trigger_info = f"\nTrigger keywords detected: {', '.join(mistake_trigger['triggers'])}"
    
    # Create extraction prompt
    prompt = f"""Analyze this conversation where a user is indicating a mistake or error:

USER MESSAGE: {user_message}
AI CONTEXT (what AI did before): {ai_context or "Not provided"}{trigger_info}

Extract the following information and respond ONLY with valid JSON (no markdown):

1. MISTAKE: What went wrong? What did the AI do incorrectly? (1 concise sentence)
2. CORRECTION: What should be done instead? The correct approach. (1 concise sentence)
3. IMPACT: What was the negative effect or consequence? (1 concise sentence)
4. CATEGORY: Choose ONE: file-safety, code-quality, architecture, user-experience, communication

Format (JSON only, no markdown blocks):
{{
    "mistake": "...",
    "correction": "...",
    "impact": "...",
    "category": "..."
}}"""
    
    # Generate response
    response = model.generate_content(prompt)
    text = response.text.strip()
    
    # Clean up markdown code blocks if present
    if text.startswith('```'):
        # Remove ```json or ``` at start
        text = re.sub(r'^```(?:json)?\s*', '', text)
        # Remove ``` at end
        text = re.sub(r'\s*```$', '', text)
        text = text.strip()
    
    # Parse JSON
    try:
        extracted = json.loads(text)
    except json.JSONDecodeError as e:
        raise ValueError(f"Failed to parse Gemini response as JSON: {e}\nResponse: {text}")
    
    # Validate required fields
    required = ['mistake', 'correction', 'impact']
    for field in required:
        if field not in extracted or not extracted[field]:
            raise ValueError(f"Missing required field: {field}")
    
    return {
        "mistake": extracted['mistake'],
        "correction": extracted['correction'],
        "impact": extracted['impact'],
        "mistake_type": extracted.get('category', 'code-quality'),
        "confidence": 0.85  # AI extraction confidence
    }

def extract_pattern(mistake_context: Dict) -> str:
    """
    Extract a searchable pattern from mistake description
    
    Args:
        mistake_context: Dict with mistake details
        
    Returns:
        Regex pattern or keyword
    """
    mistake_desc = mistake_context.get('mistake', '').lower()
    
    # Pattern extraction rules
    patterns = {
        'import': r'import.*from.*["\'](\\.\/|\\.\\.\/)',
        'customselect': r'customSelect',
        'recursive': r'function\\s+\\w+Menu.*\\{[\\s\\S]*\\1\\(',
        'null check': r'p\\.select.*===\\s*(null|undefined)',
        'delete': r'(rm|unlink|delete|fs\\.unlink)',
        'overwrite': r'overwrite|replace.*file',
    }
    
    for keyword, pattern in patterns.items():
        if keyword in mistake_desc:
            return pattern
    
    # Fallback: use first significant word
    words = re.findall(r'\b\w{4,}\b', mistake_desc)
    return words[0] if words else 'unknown'

def determine_severity(impact: str, mistake_type: str) -> str:
    """
    Determine severity level based on impact
    
    Args:
        impact: Description of impact
        mistake_type: Type of mistake
        
    Returns:
        'ERROR' or 'WARNING'
    """
    high_impact_keywords = [
        'data loss', 'broke', 'crash', 'không hoạt động',
        'stuck', 'blocked', 'critical', 'nghiêm trọng'
    ]
    
    impact_lower = impact.lower()
    
    # ERROR conditions
    if any(keyword in impact_lower for keyword in high_impact_keywords):
        return 'ERROR'
    
    if mistake_type in ['file-safety', 'security']:
        return 'ERROR'
    
    # Default to WARNING
    return 'WARNING'

def determine_category(mistake_type: str, mistake_desc: str) -> str:
    """
    Categorize the lesson
    
    Args:
        mistake_type: Auto-detected type
        mistake_desc: Mistake description
        
    Returns:
        Category string
    """
    desc_lower = mistake_desc.lower()
    
    # Category mapping
    if 'file' in desc_lower or 'delete' in desc_lower or 'overwrite' in desc_lower:
        return 'file-safety'
    elif 'import' in desc_lower or 'code' in desc_lower or 'function' in desc_lower:
        return 'code-quality'
    elif 'recursive' in desc_lower or 'loop' in desc_lower or 'design' in desc_lower:
        return 'architecture'
    elif 'esc' in desc_lower or 'menu' in desc_lower or 'navigation' in desc_lower:
        return 'user-experience'
    elif 'brand' in desc_lower or 'naming' in desc_lower:
        return 'branding'
    
    # Fallback to auto-detected type or generic
    return mistake_type if mistake_type != 'unknown' else 'code-quality'

def extract_lesson(context: Dict) -> Dict:
    """
    Extract a complete lesson from mistake context
    
    Args:
        context: {
            "mistake": str - What went wrong
            "correction": str - What should be done instead
            "impact": str - What was the impact
            "mistake_type": str - Auto-detected type
        }
        
    Returns:
        Lesson dict ready for YAML
    """
    mistake = context.get('mistake', 'Unknown mistake')
    correction = context.get('correction', 'Unknown correction')
    impact = context.get('impact', 'Minor impact')
    mistake_type = context.get('mistake_type', 'unknown')
    
    # Extract pattern
    pattern = extract_pattern(context)
    
    # Generate message
    message = f"{correction.strip()}. AVOID: {mistake.strip()}"
    if len(message) > 150:
        # Truncate if too long
        message = correction.strip()[:147] + "..."
    
    # Determine severity
    severity = determine_severity(impact, mistake_type)
    
    # Determine category
    category = determine_category(mistake_type, mistake)
    
    # Build lesson
    lesson = {
        "pattern": pattern,
        "message": message,
        "severity": severity,
        "category": category,
        "source": "auto-conversation",
        "hitCount": 0,
        "lastHit": None,
        "autoEscalated": False,
        "addedAt": datetime.now().isoformat()
    }
    
    # Add excludePaths for code-quality lessons
    if category == 'code-quality':
        lesson["excludePaths"] = ["*.test.js", "*.spec.js"]
    
    return lesson

def main():
    """CLI entry point for testing"""
    import argparse
    
    parser = argparse.ArgumentParser(description='Extract lesson from mistake context')
    parser.add_argument('--context', '-c', required=True, help='JSON context')
    parser.add_argument('--test', action='store_true', help='Test mode')
    
    args = parser.parse_args()
    
    if args.test:
        # Test cases
        test_contexts = [
            {
                "mistake": "Used customSelect instead of p.select",
                "correction": "Always use p.select() + p.isCancel()",
                "impact": "ESC key navigation broken, menu stuck",
                "mistake_type": "code-quality"
            },
            {
                "mistake": "Recursive menu calls",
                "correction": "Use while(true) loop for menu navigation",
                "impact": "State bugs and memory issues",
                "mistake_type": "architecture"
            }
        ]
        
        print("Running test cases...")
        for ctx in test_contexts:
            lesson = extract_lesson(ctx)
            print(f"\nContext: {ctx['mistake']}")
            print(f"Lesson: {json.dumps(lesson, indent=2)}")
    else:
        context = json.loads(args.context)
        lesson = extract_lesson(context)
        print(json.dumps(lesson, indent=2))

if __name__ == "__main__":
    main()
