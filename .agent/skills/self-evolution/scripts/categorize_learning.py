#!/usr/bin/env python3
"""
Learning Categorization Algorithm for SelfEvolution v4.0

PURPOSE: Precisely determine if a learning is a MISTAKE or an IMPROVEMENT

PHILOSOPHY:
- MISTAKE = Something went WRONG (anti-pattern, error, bug)
- IMPROVEMENT = Something can be done BETTER (best practice, optimization)

This is a CRITICAL component that must be 100% accurate.
"""

import re
from typing import Dict, Literal

# ============================================================================
# CATEGORIZATION ALGORITHM
# ============================================================================

def categorize_learning(user_message: str, ai_context: str = "", lesson: str = "") -> Literal["mistake", "improvement"]:
    """
    Categorize a learning as MISTAKE or IMPROVEMENT
    
    Algorithm (in priority order):
    1. Check explicit mistake indicators (highest priority)
    2. Check explicit improvement indicators
    3. Analyze severity keywords
    4. Analyze lesson content
    5. Default to mistake (conservative)
    
    Args:
        user_message: User's original message
        ai_context: AI's previous response (optional)
        lesson: Extracted lesson text (optional)
        
    Returns:
        "mistake" or "improvement"
    """
    
    # Normalize for analysis
    msg_lower = user_message.lower()
    lesson_lower = lesson.lower() if lesson else ""
    combined = f"{msg_lower} {lesson_lower}"
    
    # ========================================
    # RULE 1: EXPLICIT MISTAKE INDICATORS
    # ========================================
    # These keywords indicate something WENT WRONG
    
    mistake_keywords = [
        # Vietnamese - Error indicators
        "lỗi", "sai", "hỏng", "lỗi nghiêm trọng", "bug",
        "không đúng", "sai lầm", "nhầm", "vỡ", "crash",
        
        # Vietnamese - Fix requests
        "sửa lại", "fix", "repair", "khắc phục",
        
        # Vietnamese - Negative outcomes
        "bị mất", "bị xóa", "bị hư", "không work", "không hoạt động",
        "fail", "failed", "thất bại", "không thành công",
        
        # English - Error indicators
        "error", "wrong", "incorrect", "broken", "bug",
        "mistake", "issue", "problem", "critical",
        
        # English - Negative outcomes
        "doesn't work", "not working", "failed", "crash",
        "deleted by accident", "lost data", "broke",
        
        # Anti-patterns
        "never do", "don't use", "avoid", "bad practice",
        "anti-pattern", "code smell", "tránh", "đừng bao giờ"
    ]
    
    for keyword in mistake_keywords:
        if keyword in combined:
            return "mistake"
    
    # ========================================
    # RULE 2: EXPLICIT IMPROVEMENT INDICATORS
    # ========================================
    # These keywords indicate BETTER WAYS to do things
    
    improvement_keywords = [
        # Vietnamese - Better practices
        "tốt hơn", "nên dùng", "best practice", "cải thiện",
        "tối ưu", "hiệu quả hơn", "chuẩn hơn", "professional",
        
        # Vietnamese - Suggestions
        "khuyên nên", "đề xuất", "gợi ý", "recommendation",
        
        # English - Better practices
        "better", "best practice", "recommended", "improve",
        "optimize", "efficient", "cleaner", "preferred",
        
        # English - Positive patterns
        "should use", "it's better to", "consider using",
        "best to", "ideal", "optimal", "enhancement"
    ]
    
    for keyword in improvement_keywords:
        if keyword in combined:
            return "improvement"
    
    # ========================================
    # RULE 3: SEVERITY-BASED CLASSIFICATION
    # ========================================
    # High severity = mistake, Low severity = improvement
    
    high_severity_indicators = [
        "critical", "nghiêm trọng", "severe", "blocking",
        "data loss", "mất dữ liệu", "security", "vulnerability"
    ]
    
    for indicator in high_severity_indicators:
        if indicator in combined:
            return "mistake"
    
    # ========================================
    # RULE 4: LESSON CONTENT ANALYSIS
    # ========================================
    
    if lesson:
        # Check for negative patterns in lesson
        negative_patterns = [
            r"never\s+\w+",  # "never do X"
            r"don't\s+\w+",  # "don't use X"
            r"avoid\s+\w+",  # "avoid X"
            r"missing\s+\w+",  # "missing X"
            r"forgot\s+to",  # "forgot to X"
            r"failed\s+to",  # "failed to X"
        ]
        
        for pattern in negative_patterns:
            if re.search(pattern, lesson_lower):
                return "mistake"
        
        # Check for positive patterns in lesson
        positive_patterns = [
            r"use\s+\w+\s+instead",  # "use X instead"
            r"better\s+to\s+\w+",  # "better to X"
            r"prefer\s+\w+",  # "prefer X"
            r"optimize\s+by",  # "optimize by X"
            r"enhance\s+\w+",  # "enhance X"
        ]
        
        for pattern in positive_patterns:
            if re.search(pattern, lesson_lower):
                return "improvement"
    
    # ========================================
    # RULE 5: CONTEXT-BASED HEURISTICS
    # ========================================
    
    # If user is reporting something that happened (past tense)
    # → Likely a mistake
    past_tense_indicators = [
        "vừa", "đã", "bị", "did", "was", "were",
        "happened", "occurred", "caused"
    ]
    
    for indicator in past_tense_indicators:
        if f" {indicator} " in f" {msg_lower} ":
            return "mistake"
    
    # If user is suggesting future action (should/could)
    # → Likely an improvement
    future_indicators = [
        "should", "could", "nên", "có thể",
        "would be better", "sẽ tốt hơn"
    ]
    
    for indicator in future_indicators:
        if f" {indicator} " in f" {msg_lower} ":
            return "improvement"
    
    # ========================================
    # DEFAULT: CONSERVATIVE APPROACH
    # ========================================
    # When in doubt, classify as MISTAKE
    # Reason: Mistakes are more critical to track and prevent
    
    return "mistake"


# ============================================================================
# VALIDATION HELPERS
# ============================================================================

def validate_categorization(category: str, user_message: str, lesson: str) -> Dict:
    """
    Validate and explain the categorization
    
    Returns:
        Dict with category, confidence, and reasoning
    """
    reasons = []
    confidence = 0.5  # Default
    
    msg_lower = user_message.lower()
    lesson_lower = lesson.lower() if lesson else ""
    
    if category == "mistake":
        # Check why it's classified as mistake
        if any(kw in msg_lower for kw in ["lỗi", "sai", "error", "wrong", "bug"]):
            reasons.append("Explicit error keywords detected")
            confidence = 0.9
        elif any(kw in msg_lower for kw in ["fix", "sửa", "repair"]):
            reasons.append("Fix request detected")
            confidence = 0.8
        elif any(kw in lesson_lower for kw in ["never", "don't", "avoid"]):
            reasons.append("Anti-pattern language in lesson")
            confidence = 0.85
        else:
            reasons.append("Default classification (conservative)")
            confidence = 0.6
    
    else:  # improvement
        if any(kw in msg_lower for kw in ["tốt hơn", "better", "best practice"]):
            reasons.append("Better practice keywords detected")
            confidence = 0.9
        elif any(kw in msg_lower for kw in ["should", "nên", "recommend"]):
            reasons.append("Recommendation language detected")
            confidence = 0.85
        elif any(kw in lesson_lower for kw in ["optimize", "enhance", "improve"]):
            reasons.append("Positive improvement language in lesson")
            confidence = 0.8
        else:
            reasons.append("Improvement indicators found")
            confidence = 0.7
    
    return {
        "category": category,
        "confidence": confidence,
        "reasons": reasons
    }


# ============================================================================
# EXAMPLES & TESTS
# ============================================================================

def test_categorization():
    """Test the categorization algorithm"""
    test_cases = [
        # Clear mistakes
        {
            "message": "Lỗi nghiêm trọng: bạn đã xóa file quan trọng",
            "lesson": "Never delete files without confirmation",
            "expected": "mistake"
        },
        {
            "message": "This is wrong, you broke the code",
            "lesson": "Don't modify production directly",
            "expected": "mistake"
        },
        {
            "message": "Sai rồi, phải import function từ module khác",
            "lesson": "Missing import statement causes error",
            "expected": "mistake"
        },
        
        # Clear improvements
        {
            "message": "Nên dùng async/await thay vì callbacks",
            "lesson": "Use async/await for better readability",
            "expected": "improvement"
        },
        {
            "message": "Best practice: use TypeScript instead of JavaScript",
            "lesson": "TypeScript provides better type safety",
            "expected": "improvement"
        },
        {
            "message": "Tối ưu hơn nếu dùng useMemo",
            "lesson": "Optimize re-renders with useMemo",
            "expected": "improvement"
        },
        
        # Edge cases
        {
            "message": "ESC key không work trong submenu",
            "lesson": "Missing p.isCancel() check after select",
            "expected": "mistake"  # "không work" = error
        },
        {
            "message": "Should refactor this for better performance",
            "lesson": "Use Map instead of Object for lookups",
            "expected": "improvement"  # "should" + "better"
        }
    ]
    
    print("🧪 Testing Categorization Algorithm\n")
    print("=" * 60)
    
    passed = 0
    failed = 0
    
    for i, test in enumerate(test_cases, 1):
        result = categorize_learning(test["message"], lesson=test["lesson"])
        validation = validate_categorization(result, test["message"], test["lesson"])
        
        is_correct = result == test["expected"]
        status = "✅" if is_correct else "❌"
        
        print(f"\n{status} Test {i}:")
        print(f"   Message: {test['message'][:50]}...")
        print(f"   Expected: {test['expected']}")
        print(f"   Got: {result} (confidence: {validation['confidence']:.0%})")
        print(f"   Reasons: {', '.join(validation['reasons'])}")
        
        if is_correct:
            passed += 1
        else:
            failed += 1
    
    print("\n" + "=" * 60)
    print(f"Results: {passed}/{len(test_cases)} passed")
    
    if passed == len(test_cases):
        print("🎉 All tests passed!")
        return 0
    else:
        print(f"⚠️  {failed} test(s) failed")
        return 1


# ============================================================================
# MAIN
# ============================================================================

def main():
    """CLI for testing"""
    import sys
    import argparse
    
    parser = argparse.ArgumentParser(description='Learning Categorization Algorithm')
    parser.add_argument('--test', action='store_true', help='Run tests')
    parser.add_argument('--message', type=str, help='User message to categorize')
    parser.add_argument('--lesson', type=str, default='', help='Lesson text')
    
    args = parser.parse_args()
    
    if args.test:
        sys.exit(test_categorization())
    
    if args.message:
        category = categorize_learning(args.message, lesson=args.lesson)
        validation = validate_categorization(category, args.message, args.lesson)
        
        print(f"\n📊 Categorization Result:")
        print(f"   Category: {category.upper()}")
        print(f"   Confidence: {validation['confidence']:.0%}")
        print(f"   Reasons:")
        for reason in validation['reasons']:
            print(f"     • {reason}")
    else:
        parser.print_help()

if __name__ == "__main__":
    main()
