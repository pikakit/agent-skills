import os, re, glob

skills_dir = r"c:\Users\sofma\Desktop\agent-skill-kit\.agent\skills"
fixed = 0

for skill_md in glob.glob(os.path.join(skills_dir, "*", "SKILL.md")):
    skill_name = os.path.basename(os.path.dirname(skill_md))
    
    with open(skill_md, "r", encoding="utf-8") as f:
        content = f.read()
    
    if "## Rule Categories by Priority" not in content:
        continue
    
    # Remove from "## Rule Categories by Priority" to just before Content Map
    # Pattern covers: Rule Categories, Quick Reference, How to Use, Full Compiled Document
    pattern = r'\n---\n\n## Rule Categories by Priority.*?(?=## [\U0001F4D1\U0001F4CB] Content Map)'
    new_content = re.sub(pattern, '\n\n## \U0001F4D1 Content Map', content, flags=re.DOTALL)
    
    # Also try without --- separator
    if new_content == content:
        pattern2 = r'\n\n## Rule Categories by Priority.*?(?=## [\U0001F4D1\U0001F4CB] Content Map)'
        new_content = re.sub(pattern2, '\n\n## \U0001F4D1 Content Map', content, flags=re.DOTALL)
    
    if new_content != content:
        old_lines = content.count('\n')
        new_lines = new_content.count('\n')
        removed = old_lines - new_lines
        
        with open(skill_md, "w", encoding="utf-8") as f:
            f.write(new_content)
        
        print(f"  {skill_name} -- removed {removed} lines")
        fixed += 1
    else:
        print(f"  {skill_name} -- pattern not matched (check manually)")

print(f"\nFixed {fixed} skills")
