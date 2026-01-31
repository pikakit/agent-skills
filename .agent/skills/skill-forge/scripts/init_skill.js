#!/usr/bin/env node
/**
 * Skill Initializer - Creates a new skill from template
 * Usage: node init_skill.js <skill-name> --path <path>
 */

import { mkdirSync, writeFileSync, existsSync, chmodSync } from 'fs';
import { resolve, join } from 'path';

const SKILL_TEMPLATE = `---
name: {skill_name}
description: [TODO: Complete and informative explanation of what the skill does and when to use it.]
---

# {skill_title}

## Overview

[TODO: 1-2 sentences explaining what this skill enables]

## [TODO: Replace with the first main section]

[TODO: Add content here]

## Resources

This skill includes example resource directories:

### scripts/
Executable code (Python/Bash/etc.) that can be run directly.

### references/
Documentation and reference material intended to be loaded into context.

### assets/
Files not intended to be loaded into context, but used in output.

---
**Any unneeded directories can be deleted.**
`;

const EXAMPLE_SCRIPT = `#!/usr/bin/env node
/**
 * Example helper script for {skill_name}
 * Replace with actual implementation or delete if not needed.
 */

function main() {
  console.log("This is an example script for {skill_name}");
  // TODO: Add actual script logic here
}

main();
`;

const EXAMPLE_REFERENCE = `# Reference Documentation for {skill_title}

This is a placeholder for detailed reference documentation.
Replace with actual reference content or delete if not needed.

## When Reference Docs Are Useful
- Comprehensive API documentation
- Detailed workflow guides
- Complex multi-step processes
`;

function titleCaseSkillName(skillName) {
    return skillName.split('-').map(word =>
        word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
}

function initSkill(skillName, path) {
    const skillDir = resolve(path, skillName);

    if (existsSync(skillDir)) {
        console.log(`[X] Error: Skill directory already exists: ${skillDir}`);
        return null;
    }

    try {
        mkdirSync(skillDir, { recursive: true });
        console.log(`[OK] Created skill directory: ${skillDir}`);
    } catch (e) {
        console.log(`[X] Error creating directory: ${e.message}`);
        return null;
    }

    const skillTitle = titleCaseSkillName(skillName);
    const skillContent = SKILL_TEMPLATE
        .replace(/{skill_name}/g, skillName)
        .replace(/{skill_title}/g, skillTitle);

    try {
        writeFileSync(join(skillDir, 'SKILL.md'), skillContent);
        console.log('[OK] Created SKILL.md');

        // scripts/
        const scriptsDir = join(skillDir, 'scripts');
        mkdirSync(scriptsDir);
        const exampleScript = EXAMPLE_SCRIPT.replace(/{skill_name}/g, skillName);
        writeFileSync(join(scriptsDir, 'example.js'), exampleScript);
        console.log('[OK] Created scripts/example.js');

        // references/
        const refsDir = join(skillDir, 'references');
        mkdirSync(refsDir);
        const exampleRef = EXAMPLE_REFERENCE.replace(/{skill_title}/g, skillTitle);
        writeFileSync(join(refsDir, 'api_reference.md'), exampleRef);
        console.log('[OK] Created references/api_reference.md');

        // assets/
        const assetsDir = join(skillDir, 'assets');
        mkdirSync(assetsDir);
        writeFileSync(join(assetsDir, '.gitkeep'), '');
        console.log('[OK] Created assets/');

    } catch (e) {
        console.log(`[X] Error creating files: ${e.message}`);
        return null;
    }

    console.log(`\n[OK] Skill '${skillName}' initialized successfully at ${skillDir}`);
    console.log('\nNext steps:');
    console.log('1. Edit SKILL.md to complete the TODO items');
    console.log('2. Customize or delete the example files');
    console.log('3. Run the validator when ready');

    return skillDir;
}

function main() {
    const args = process.argv.slice(2);

    if (args.length < 3 || args[1] !== '--path') {
        console.log('Usage: node init_skill.js <skill-name> --path <path>');
        console.log('\nExamples:');
        console.log('  node init_skill.js my-new-skill --path skills/public');
        console.log('  node init_skill.js my-api-helper --path skills/private');
        process.exit(1);
    }

    const skillName = args[0];
    const path = args[2];

    console.log(`[*] Initializing skill: ${skillName}`);
    console.log(`    Location: ${path}\n`);

    const result = initSkill(skillName, path);
    process.exit(result ? 0 : 1);
}

main();
