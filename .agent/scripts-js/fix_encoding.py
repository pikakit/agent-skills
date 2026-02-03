#!/usr/bin/env python3
"""
Comprehensive fix for double-encoded UTF-8 (UTF-8 -> CP1252 -> UTF-8).
Uses ftfy library algorithm for robust fixing.
"""
import glob
import os

def fix_mojibake_char(char):
    """Try to fix a single character by reversing CP1252 encoding."""
    try:
        # Try encoding as CP1252 then decoding as UTF-8
        return char.encode('cp1252').decode('utf-8')
    except (UnicodeEncodeError, UnicodeDecodeError):
        return char

def fix_mojibake_text(text):
    """Fix mojibake by processing character by character."""
    result = []
    i = 0
    while i < len(text):
        # Try to fix sequences of 2-4 chars
        fixed = False
        for length in [4, 3, 2]:
            if i + length <= len(text):
                chunk = text[i:i+length]
                try:
                    fixed_chunk = chunk.encode('cp1252').decode('utf-8')
                    if fixed_chunk != chunk and len(fixed_chunk) < len(chunk):
                        result.append(fixed_chunk)
                        i += length
                        fixed = True
                        break
                except:
                    pass
        
        if not fixed:
            # Try single char
            try:
                c = text[i].encode('cp1252').decode('utf-8')
                result.append(c)
            except:
                result.append(text[i])
            i += 1
    
    return ''.join(result)

def has_mojibake(text):
    """Check for mojibake patterns."""
    mojibake_chars = [
        '\xc3', '\xc5', '\xc2',  # Latin supplement
        'ðŸ', 'âœ', 'â†', 'âš', 'â€', 'ï¸'
    ]
    return any(c in text for c in mojibake_chars)

def fix_file(filepath):
    """Fix a workflow file."""
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Strip BOM
    content = content.lstrip('\ufeff')
    
    if not has_mojibake(content):
        return False, "OK"
    
    fixed = fix_mojibake_text(content)
    
    # Check if we actually fixed something
    if fixed == content:
        return False, "No changes"
    
    with open(filepath, 'w', encoding='utf-8', newline='\n') as f:
        f.write(fixed)
    
    return True, "FIXED"

def main():
    files = glob.glob('.agent/workflows/*.md')
    
    for filepath in sorted(files):
        if 'README' in filepath:
            continue
        basename = os.path.basename(filepath)
        try:
            was_fixed, msg = fix_file(filepath)
            status = "[FIXED]" if was_fixed else "[OK]"
            print(f'{status} {basename}')
        except Exception as e:
            print(f'[ERROR] {basename}: {e}')

if __name__ == '__main__':
    main()
