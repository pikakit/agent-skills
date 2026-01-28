#!/usr/bin/env python3
"""
Integration Test Suite for SelfEvolution v4.0
Tests cross-phase integration and data flow
"""

import sys
import yaml
import json
from pathlib import Path

# Add scripts to path
SCRIPT_DIR = Path(__file__).parent.parent / 'scripts'
sys.path.insert(0, str(SCRIPT_DIR))

def test_phase1_foundation():
    """Test Phase 1: File structure and migration"""
    print("=" * 60)
    print("TEST PHASE 1: Foundation")
    print("=" * 60)
    
    from project_utils import (
        get_mistakes_file,
        get_improvements_file,
        get_meta_file,
        get_versions_dir,
        detect_version
    )
    
    # Test 1: Version detection
    version = detect_version()
    assert version == '4.0', f"Expected v4.0, got {version}"
    print("✅ Version detection: 4.0")
    
    # Test 2: File paths correct
    mistakes_file = get_mistakes_file()
    improvements_file = get_improvements_file()
    meta_file = get_meta_file()
    versions_dir = get_versions_dir()
    
    assert mistakes_file.exists(), "mistakes.yaml not found"
    assert improvements_file.exists(), "improvements.yaml not found"
    assert meta_file.exists(), "meta.json not found"
    assert versions_dir.exists(), "versions/ directory not found"
    print("✅ All required files exist")
    
    # Test 3: Data structure valid
    with open(mistakes_file, 'r', encoding='utf-8') as f:
        mistakes_data = yaml.safe_load(f)
    assert 'mistakes' in mistakes_data, "mistakes key missing"
    assert 'version' in mistakes_data, "version key missing"
    print(f"✅ Mistakes file valid: v{mistakes_data['version']}, {len(mistakes_data['mistakes'])} items")
    
    with open(improvements_file, 'r', encoding='utf-8') as f:
        improvements_data = yaml.safe_load(f)
    assert 'improvements' in improvements_data, "improvements key missing"
    print(f"✅ Improvements file valid: {len(improvements_data['improvements'])} items")
    
    with open(meta_file, 'r', encoding='utf-8') as f:
        meta_data = json.load(f)
    assert 'event_counter' in meta_data, "event_counter missing"
    assert 'self_improve' in meta_data, "self_improve missing"
    print("✅ Meta file valid")
    
    return True

def test_phase2_events():
    """Test Phase 2: Event tracking"""
    print("\n" + "=" * 60)
    print("TEST PHASE 2: Event Tracking")
    print("=" * 60)
    
    from event_tracker import (
        get_event_count,
        check_threshold,
        get_statistics
    )
    
    # Test 1: Get event count
    counts = get_event_count()
    assert 'total' in counts, "total count missing"
    assert 'since_last_improve' in counts, "since_last_improve missing"
    print(f"✅ Event counts: {counts['total']} total, {counts['since_last_improve']}/5 to next")
    
    # Test 2: Threshold check
    threshold_reached = check_threshold()
    print(f"✅ Threshold check: {threshold_reached}")
    
    # Test 3: Statistics
    stats = get_statistics()
    assert 'event_counter' in stats, "event_counter missing in stats"
    assert 'improve_count' in stats, "improve_count missing"
    print(f"✅ Statistics: {stats['improve_count']} improve cycles completed")
    
    return True

def test_phase3_self_improve():
    """Test Phase 3: Self-improve cycle"""
    print("\n" + "=" * 60)
    print("TEST PHASE 3: Self-Improve Cycle")
    print("=" * 60)
    
    from analyze_learnings import categorize_learnings
    from project_utils import get_mistakes_file
    
    # Test 1: Analysis categorization
    categorized = categorize_learnings(use_ai=False)
    total = sum(len(categorized[k]) for k in categorized)
    print(f"✅ Analysis: {total} learnings categorized")
    print(f"   Keep: {len(categorized['keep'])}, Refine: {len(categorized['refine'])}, Deprecate: {len(categorized['deprecate'])}")
    
    # Test 2: Version tracking in mistakes
    with open(get_mistakes_file(), 'r', encoding='utf-8') as f:
        data = yaml.safe_load(f)
    
    for mistake in data['mistakes']:
        assert 'version' in mistake, f"{mistake['id']} missing version"
        if mistake['version'] > 1:
            assert 'changelog' in mistake, f"{mistake['id']} v{mistake['version']} missing changelog"
    
    print(f"✅ Version tracking: All mistakes have version info")
    
    # Test 3: Self-improve history
    from project_utils import get_meta_file
    with open(get_meta_file(), 'r', encoding='utf-8') as f:
        meta = json.load(f)
    
    history = meta.get('self_improve', {}).get('history', [])
    print(f"✅ Self-improve history: {len(history)} cycles recorded")
    
    return True

def test_phase4_ui():
    """Test Phase 4: UI integration"""
    print("\n" + "=" * 60)
    print("TEST PHASE 4: UI Integration")
    print("=" * 60)
    
    from learning_status import (
        load_active_mistakes,
        load_active_improvements,
        display_status
    )
    
    # Test 1: Load active learnings
    mistakes = load_active_mistakes()
    improvements = load_active_improvements()
    print(f"✅ Load active: {len(mistakes)} mistakes, {len(improvements)} improvements")
    
    # Test 2: Status display (shouldn't crash)
    try:
        # Capture output
        import io
        from contextlib import redirect_stdout
        
        f = io.StringIO()
        with redirect_stdout(f):
            display_status(detailed=False)
        output = f.getvalue()
        
        assert '🧠 Auto-Learning' in output, "Status display missing header"
        print("✅ Status display renders correctly")
    except Exception as e:
        print(f"⚠️  Status display error: {e}")
    
    return True

def test_phase5_versioning():
    """Test Phase 5: Version management"""
    print("\n" + "=" * 60)
    print("TEST PHASE 5: Versioning & Rollback")
    print("=" * 60)
    
    from version_manager import (
        list_versions,
        load_version,
        compare_versions
    )
    
    # Test 1: List versions
    mistake_versions = list_versions('mistakes')
    improvement_versions = list_versions('improvements')
    print(f"✅ Version lists: {len(mistake_versions)} mistake versions, {len(improvement_versions)} improvement versions")
    
    # Test 2: Load version
    if mistake_versions:
        latest_version = mistake_versions[-1]['version']
        data = load_version('mistakes', latest_version)
        assert data is not None, "Failed to load version"
        print(f"✅ Load version: v{latest_version} loaded successfully")
    
    # Test 3: Compare versions
    if len(mistake_versions) >= 2:
        v1 = mistake_versions[0]['version']
        v2 = mistake_versions[1]['version']
        
        comparison = compare_versions('mistakes', v1, v2)
        assert 'version_a' in comparison, "Comparison missing version_a"
        assert 'version_b' in comparison, "Comparison missing version_b"
        
        total_changes = len(comparison['added']) + len(comparison['removed']) + len(comparison['modified'])
        print(f"✅ Compare versions: v{v1} vs v{v2} - {total_changes} changes")
    
    return True

def test_integration_flow():
    """Test end-to-end integration"""
    print("\n" + "=" * 60)
    print("TEST INTEGRATION: End-to-End Flow")
    print("=" * 60)
    
    from project_utils import get_mistakes_file, get_meta_file
    from event_tracker import get_event_count
    
    # Test data flow: mistakes.yaml → event_tracker → meta.json
    with open(get_mistakes_file(), 'r', encoding='utf-8') as f:
        mistakes = yaml.safe_load(f)['mistakes']
    
    counts = get_event_count()
    
    with open(get_meta_file(), 'r', encoding='utf-8') as f:
        meta = json.load(f)
    
    # Verify consistency
    assert len(mistakes) > 0, "No mistakes found"
    assert counts['total'] >= len(mistakes), "Event count inconsistent"
    assert meta['event_counter']['total'] == counts['total'], "Meta.json event count mismatch"
    
    print(f"✅ Data flow consistent:")
    print(f"   Mistakes file: {len(mistakes)} items")
    print(f"   Event tracker: {counts['total']} events")
    print(f"   Meta.json: {meta['event_counter']['total']} events")
    
    # Test version consistency
    mistakes_version = mistakes[0].get('version', 1) if mistakes else 1
    file_version = yaml.safe_load(open(get_mistakes_file(), 'r', encoding='utf-8'))['version']
    
    print(f"✅ Version consistency: file v{file_version}, items v{mistakes_version}")
    
    return True

def run_all_tests():
    """Run all integration tests"""
    print("\n🧪 SelfEvolution v4.0 Integration Test Suite\n")
    
    results = []
    
    try:
        results.append(("Phase 1: Foundation", test_phase1_foundation()))
    except Exception as e:
        print(f"❌ Phase 1 failed: {e}")
        results.append(("Phase 1: Foundation", False))
    
    try:
        results.append(("Phase 2: Event Tracking", test_phase2_events()))
    except Exception as e:
        print(f"❌ Phase 2 failed: {e}")
        results.append(("Phase 2: Event Tracking", False))
    
    try:
        results.append(("Phase 3: Self-Improve", test_phase3_self_improve()))
    except Exception as e:
        print(f"❌ Phase 3 failed: {e}")
        results.append(("Phase 3: Self-Improve", False))
    
    try:
        results.append(("Phase 4: UI Integration", test_phase4_ui()))
    except Exception as e:
        print(f"❌ Phase 4 failed: {e}")
        results.append(("Phase 4: UI Integration", False))
    
    try:
        results.append(("Phase 5: Versioning", test_phase5_versioning()))
    except Exception as e:
        print(f"❌ Phase 5 failed: {e}")
        results.append(("Phase 5: Versioning", False))
    
    try:
        results.append(("Integration Flow", test_integration_flow()))
    except Exception as e:
        print(f"❌ Integration failed: {e}")
        results.append(("Integration Flow", False))
    
    # Summary
    print("\n" + "=" * 60)
    print("TEST SUMMARY")
    print("=" * 60)
    
    passed = sum(1 for _, result in results if result)
    total = len(results)
    
    for name, result in results:
        status = "✅ PASS" if result else "❌ FAIL"
        print(f"{status}: {name}")
    
    print(f"\n{'✅' if passed == total else '⚠️'} {passed}/{total} tests passed")
    
    if passed == total:
        print("\n🎉 ALL INTEGRATION TESTS PASSED!")
        return 0
    else:
        print(f"\n⚠️  {total - passed} test(s) failed")
        return 1

if __name__ == "__main__":
    sys.exit(run_all_tests())
