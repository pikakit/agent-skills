const fs = require('fs');
const path = require('path');

const SKILLS_DIR = path.join(__dirname, '../../..', '.agent', 'skills');
const OUTPUT_FILE = path.join(SKILLS_DIR, 'registry.json');

const registry = {
    updatedAt: new Date().toISOString(),
    skills: []
};

if (fs.existsSync(SKILLS_DIR)) {
    const skills = fs.readdirSync(SKILLS_DIR, { withFileTypes: true })
        .filter(dirent => dirent.isDirectory())
        .map(dirent => dirent.name);

    skills.forEach(skill => {
        const skillPath = path.join(SKILLS_DIR, skill);
        const skillData = {
            name: skill,
            rules: [],
            scripts: []
        };

        // Find rules
        const rulesDir = path.join(skillPath, 'rules');
        if (fs.existsSync(rulesDir)) {
            skillData.rules = fs.readdirSync(rulesDir).filter(f => f.endsWith('.md'));
        }

        // Find scripts
        const scriptsDir = path.join(skillPath, 'scripts');
        if (fs.existsSync(scriptsDir)) {
            skillData.scripts = fs.readdirSync(scriptsDir).filter(f => f.endsWith('.js') || f.endsWith('.py'));
        }

        registry.skills.push(skillData);
    });
}

fs.writeFileSync(OUTPUT_FILE, JSON.stringify(registry, null, 2));
console.log(`Registry generated at ${OUTPUT_FILE}`);
