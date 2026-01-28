#!/usr/bin/env python3
"""
Smart API Key Resolver for SelfEvolution

PURPOSE: Auto-detect and use API key from multiple sources:
1. Agent's current session (GEMINI_API_KEY from parent environment)
2. Project-specific .env file
3. User's custom API key
4. Fallback to manual input

This allows seamless integration - if Agent is coding with its own API key,
scripts automatically inherit it. No need for separate configuration.
"""

import os
import sys
from pathlib import Path
from typing import Optional, Dict

def get_api_key_from_env() -> Optional[str]:
    """
    Get API key from environment variable
    Priority:
    1. GEMINI_API_KEY (current session - from Agent)
    2. GOOGLE_API_KEY (alternative name)
    
    Returns:
        API key string or None
    """
    # Check standard name
    api_key = os.getenv('GEMINI_API_KEY')
    if api_key:
        return api_key
    
    # Check alternative name
    api_key = os.getenv('GOOGLE_API_KEY')
    if api_key:
        return api_key
    
    return None

def get_api_key_from_dotenv(skill_dir: Path) -> Optional[str]:
    """
    Load API key from .env file
    
    Args:
        skill_dir: Path to SelfEvolution skill directory
        
    Returns:
        API key or None
    """
    try:
        from dotenv import load_dotenv
        
        env_file = skill_dir / '.env'
        if not env_file.exists():
            return None
        
        # Load without overriding existing env vars
        load_dotenv(env_file, override=False)
        
        return os.getenv('GEMINI_API_KEY') or os.getenv('GOOGLE_API_KEY')
    except ImportError:
        # python-dotenv not installed
        return None

def get_api_key_from_cache() -> Optional[str]:
    """
    Get cached API key from previous session
    
    Returns:
        API key or None
    """
    cache_file = Path.home() / '.selfevolution_cache' / 'api_key.txt'
    
    if not cache_file.exists():
        return None
    
    try:
        with open(cache_file, 'r') as f:
            api_key = f.read().strip()
            if api_key and len(api_key) > 10:  # Basic validation
                return api_key
    except:
        pass
    
    return None

def cache_api_key(api_key: str):
    """
    Cache API key for future use
    
    Args:
        api_key: API key to cache
    """
    cache_dir = Path.home() / '.selfevolution_cache'
    cache_dir.mkdir(exist_ok=True)
    
    cache_file = cache_dir / 'api_key.txt'
    
    try:
        with open(cache_file, 'w') as f:
            f.write(api_key)
        
        # Set file permissions (user only)
        os.chmod(cache_file, 0o600)
    except Exception as e:
        print(f"⚠️  Could not cache API key: {e}")

def resolve_api_key(skill_dir: Optional[Path] = None, allow_prompt: bool = False) -> Dict:
    """
    Smart API key resolution with multiple fallbacks
    
    Args:
        skill_dir: Path to SelfEvolution skill directory
        allow_prompt: If True, prompt user for API key if none found
        
    Returns:
        Dict with:
        - 'api_key': str or None
        - 'source': where it came from
        - 'cached': bool, if it should be cached
    """
    if not skill_dir:
        skill_dir = Path(__file__).parent.parent
    
    result = {
        'api_key': None,
        'source': 'none',
        'cached': False
    }
    
    # Priority 1: Current environment (from Agent session)
    api_key = get_api_key_from_env()
    if api_key:
        result['api_key'] = api_key
        result['source'] = 'agent_session'
        result['cached'] = False
        return result
    
    # Priority 2: Project .env file
    api_key = get_api_key_from_dotenv(skill_dir)
    if api_key:
        result['api_key'] = api_key
        result['source'] = 'project_env'
        result['cached'] = False
        return result
    
    # Priority 3: Cached from previous session
    api_key = get_api_key_from_cache()
    if api_key:
        result['api_key'] = api_key
        result['source'] = 'cache'
        result['cached'] = True
        return result
    
    # Priority 4: Prompt user (if allowed)
    if allow_prompt:
        print("\n🔑 No API key found. Please provide one:")
        print("   Get free key at: https://aistudio.google.com/app/apikey\n")
        
        api_key = input("Enter GEMINI_API_KEY (or 'skip' to continue without AI): ").strip()
        
        if api_key and api_key.lower() != 'skip':
            # Ask to cache
            cache_choice = input("Cache this key for future use? (y/n): ").strip().lower()
            
            if cache_choice == 'y':
                cache_api_key(api_key)
                result['cached'] = True
            
            result['api_key'] = api_key
            result['source'] = 'user_input'
            return result
    
    # No API key found
    return result

def configure_genai(api_key: str) -> bool:
    """
    Configure Gemini API with given key
    
    Args:
        api_key: API key to use
        
    Returns:
        True if successful, False otherwise
    """
    try:
        import google.generativeai as genai
        genai.configure(api_key=api_key)
        return True
    except ImportError:
        print("❌ google-generativeai not installed")
        print("   Run: pip install google-generativeai")
        return False
    except Exception as e:
        print(f"❌ Failed to configure API: {e}")
        return False

def get_configured_genai(allow_prompt: bool = False):
    """
    Get configured Gemini API or None
    
    Args:
        allow_prompt: If True, prompt for API key if not found
        
    Returns:
        genai module if configured, None otherwise
    """
    resolution = resolve_api_key(allow_prompt=allow_prompt)
    
    if not resolution['api_key']:
        return None
    
    if configure_genai(resolution['api_key']):
        # Print source for transparency
        source_msg = {
            'agent_session': '🤖 Using Agent\'s current API key',
            'project_env': '📁 Using project .env API key',
            'cache': '💾 Using cached API key',
            'user_input': '⌨️  Using manually entered API key'
        }
        print(f"ℹ️  {source_msg.get(resolution['source'], 'Using API key')}")
        
        try:
            import google.generativeai as genai
            return genai
        except:
            return None
    
    return None

def main():
    """CLI for testing API key resolution"""
    import argparse
    
    parser = argparse.ArgumentParser(description='Smart API Key Resolver')
    parser.add_argument('--test', action='store_true', help='Test resolution')
    parser.add_argument('--clear-cache', action='store_true', help='Clear cached API key')
    parser.add_argument('--prompt', action='store_true', help='Prompt for API key if not found')
    
    args = parser.parse_args()
    
    if args.clear_cache:
        cache_file = Path.home() / '.selfevolution_cache' / 'api_key.txt'
        if cache_file.exists():
            cache_file.unlink()
            print("✅ Cache cleared")
        else:
            print("ℹ️  No cache found")
        return
    
    if args.test:
        print("🔍 Testing API Key Resolution\n")
        print("=" * 60)
        
        resolution = resolve_api_key(allow_prompt=args.prompt)
        
        print(f"\nSource: {resolution['source']}")
        
        if resolution['api_key']:
            # Mask API key for security
            masked = resolution['api_key'][:8] + '...' + resolution['api_key'][-4:]
            print(f"API Key: {masked}")
            print(f"Cached: {'Yes' if resolution['cached'] else 'No'}")
            
            # Test configuration
            if configure_genai(resolution['api_key']):
                print("\n✅ API key is valid and configured")
            else:
                print("\n❌ Failed to configure API")
        else:
            print("❌ No API key found")
            print("\nOptions:")
            print("1. Set GEMINI_API_KEY in current environment")
            print("2. Create .env file with GEMINI_API_KEY")
            print("3. Run with --prompt to enter manually")
    else:
        parser.print_help()

if __name__ == "__main__":
    main()
