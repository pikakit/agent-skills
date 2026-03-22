import fs from 'node:fs';
import path from 'node:path';

const dir = 'C:/Users/sofma/Desktop/agent-skill-kit/.agent/workflows';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.md'));

for (const f of files) {
  let txt = fs.readFileSync(path.join(dir, f), 'utf8');
  
  // Extract all skills mentioned
  const regex = /`([a-z0-9-]+)`/g;
  let match;
  let allSkills = new Set();
  
  // Find all text after 'Skills Loaded' or within SKILLS rows
  const skillLines = txt.match(/SKILLS.*|Skills Loaded.*/gi);
  if (skillLines) {
    // If we have explicit 'Skills Loaded' section, extract from the rest of document
    const skillsSectionIdx = txt.toLowerCase().indexOf('skills loaded');
    if (skillsSectionIdx > -1) {
      const remainingTxt = txt.slice(skillsSectionIdx);
      while ((match = regex.exec(remainingTxt)) !== null) {
        if (!['assessor', 'recovery', 'learner', 'critic', 'orchestrator'].includes(match[1])) {
          allSkills.add(match[1]);
        }
      }
    }
    
    // Also parse inline tables
    skillLines.forEach(line => {
      let r = /`([a-z0-9-]+)`/g;
      let m;
      while ((m = r.exec(line)) !== null) {
          if (!['assessor', 'recovery', 'learner', 'critic', 'orchestrator'].includes(m[1])) {
            allSkills.add(m[1]);
          }
      }
    });
  }

  if (allSkills.size > 0) {
    const list = Array.from(allSkills).join(', ');
    txt = txt.replace(/skills: \[.*\]/m, `skills: [${list}]`);
    fs.writeFileSync(path.join(dir, f), txt, 'utf8');
    console.log(`✅ Fixed skills for ${f}: ${list}`);
  }
}
