#!/usr/bin/env python3
"""
Mistake Trigger Detection Engine
Detects when user indicates a mistake in conversation
"""

import re
import sys
import json
from typing import Dict, List, Tuple

# Vietnamese trigger words
VIETNAMESE_TRIGGERS = [
    r'\blỗi\b',
    r'\bsai\b', 
    r'\bhỏng\b',
    r'\bkhông đúng\b',
    r'\bsửa lại\b',
    r'\blỗi nghiêm trọng\b',
    r'\bbạn làm sai\b',
    r'\bđây là lỗi\b',
    r'\bkhông phải vậy\b',
    r'\brevert\b',
    r'\brollback\b'
]

# English trigger words
ENGLISH_TRIGGERS = [
    r'\bmistake\b',
    r'\bwrong\b',
    r'\bincorrect\b',
    r'\bfix this\b',
    r'\byou broke\b',
    r'\bthat\'s wrong\b',
    r'\bnot right\b',
    r'\bbroke\b',
    r'\bbroken\b'
]

# Negative sentiment patterns
NEGATIVE_PATTERNS = [
    r'why did you',
    r'should not have',
    r'don\'t do that',
    r'never do',
    r'stop doing'
]

def calculate_confidence(message: str, triggers_found: List[str]) -> int:
    """
    Calculate confidence score (0-100) that this is a mistake indication
    
    Args:
        message: User message
        triggers_found: List of trigger keywords found
        
    Returns:
        Confidence score 0-100
    """
    confidence = 0
    
    # Base score from trigger count
    confidence += min(len(triggers_found) * 25, 50)
    
    # High confidence triggers
    high_conf = ['lỗi nghiêm trọng', 'you broke', 'that\'s wrong', 'mistake']
    if any(t in message.lower() for t in high_conf):
        confidence += 30
    
    # Negative sentiment
    if any(re.search(p, message.lower()) for p in NEGATIVE_PATTERNS):
        confidence += 15
    
    # Exclamation marks (frustration indicator)
    if message.count('!') >= 2:
        confidence += 5
    
    return min(confidence, 100)

def detect_mistake(user_message: str, ai_context: str = "") -> Dict:
    """
    Detect if user is indicating a mistake
    
    Args:
        user_message: User's message
        ai_context: Previous AI response (optional)
        
    Returns:
        {
            "detected": bool,
            "confidence": int (0-100),
            "triggers": List[str],
            "context": {
                "mistake_type": str,
                "user_msg": str
            }
        }
    """
    msg_lower = user_message.lower()
    triggers_found = []
    
    # Check Vietnamese triggers
    for trigger in VIETNAMESE_TRIGGERS:
        if re.search(trigger, msg_lower):
            triggers_found.append(trigger)
    
    # Check English triggers
    for trigger in ENGLISH_TRIGGERS:
        if re.search(trigger, msg_lower):
            triggers_found.append(trigger)
    
    detected = len(triggers_found) > 0
    confidence = calculate_confidence(user_message, triggers_found) if detected else 0
    
    # Determine mistake type
    mistake_type = "unknown"
    if any(re.search(r'\bfile\b|\bxóa\b|\bdelete\b', msg_lower) for _ in [1]):
        mistake_type = "file-safety"
    elif any(re.search(r'\bcode\b|\bfunction\b|\bimport\b', msg_lower) for _ in [1]):
        mistake_type = "code-quality"
    elif any(re.search(r'\bESC\b|\bmenu\b|\bnavigation\b', msg_lower) for _ in [1]):
        mistake_type = "user-experience"
    
    return {
        "detected": detected,
        "confidence": confidence,
        "triggers": triggers_found,
        "context": {
            "mistake_type": mistake_type,
            "user_msg": user_message[:200],  # Truncate for storage
            "ai_context": ai_context[:200] if ai_context else ""
        }
    }

def main():
    """CLI entry point for testing"""
    import argparse
    
    parser = argparse.ArgumentParser(description='Detect mistake triggers in text')
    parser.add_argument('--message', '-m', help='User message to analyze')
    parser.add_argument('--context', '-c', default='', help='AI context (optional)')
    parser.add_argument('--test', action='store_true', help='Test mode with sample data')
    
    args = parser.parse_args()
    
    if args.test:
        # Test cases
        test_cases = [
            "Đây là lỗi nghiêm trọng",
            "This is a mistake",
            "Why did you delete the file?",
            "The menu is broken",
            "Everything works fine"
        ]
        
        print("Running test cases...")
        for msg in test_cases:
            result = detect_mistake(msg)
            print(f"\nMessage: {msg}")
            print(f"Result: {json.dumps(result, indent=2)}")
    elif args.message:
        result = detect_mistake(args.message, args.context)
        print(json.dumps(result, indent=2))
    else:
        parser.error("--message is required when not in test mode")

if __name__ == "__main__":
    main()
