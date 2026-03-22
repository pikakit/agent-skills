const fs = require('fs');
const path = require('path');
const dir = 'C:/Users/sofma/Desktop/agent-skill-kit/.agent/workflows';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.md'));
for (const f of files) {
  const txt = fs.readFileSync(path.join(dir, f), 'utf8');
  const issues = [];
  if (!/^skills:/m.test(txt)) issues.push('Missing skills in YAML');
  if (!/^agents:/m.test(txt)) issues.push('Missing agents in YAML');
  if (!/auto-learned|Auto-Learned/i.test(txt)) issues.push('Missing Auto-Learned Pattern check');
  if (!/Exit Gate|Problem Verification|@\[current_problems\]/i.test(txt)) issues.push('Missing Exit Gates');
  if (!/Rollback/i.test(txt)) issues.push('Missing Rollback section');
  if (issues.length) console.log('❌ ' + f + ' -> ' + issues.join(', '));
  else console.log('✅ ' + f + ' -> FAANG compliant!');
}
