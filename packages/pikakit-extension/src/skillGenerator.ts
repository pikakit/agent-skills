/**
 * SkillGenerator - Skill File Generator
 * 
 * Generates SKILL.md files from accumulated lessons.
 * Creates proper skill structure following SKILL_DESIGN_GUIDE.md.
 * 
 * @author PikaKit
 * @version 1.0.0
 */

import * as fs from 'fs';
import * as path from 'path';
import { Lesson } from './lessonStore';

export class SkillGenerator {
    private skillsDir: string;

    constructor(workspaceRoot: string) {
        this.skillsDir = path.join(workspaceRoot, '.agent', 'skills');
    }

    /**
     * Generate a skill from lessons
     */
    async generateSkill(skillName: string, lessons: Lesson[]): Promise<boolean> {
        try {
            // Validate skill name
            const normalizedName = this.normalizeSkillName(skillName);
            const skillDir = path.join(this.skillsDir, normalizedName);

            // Check if skill already exists
            if (fs.existsSync(skillDir)) {
                console.error(`Skill ${normalizedName} already exists`);
                return false;
            }

            // Create skill directory
            fs.mkdirSync(skillDir, { recursive: true });

            // Generate SKILL.md content
            const skillContent = this.generateSkillMd(normalizedName, lessons);
            fs.writeFileSync(path.join(skillDir, 'SKILL.md'), skillContent, 'utf8');

            // Update registry if exists
            await this.updateRegistry(normalizedName, lessons);

            // Auto-inject to GEMINI.md so Agent knows about new skill
            await this.injectToGemini(normalizedName, lessons);

            console.log(`Generated skill: ${normalizedName}`);
            return true;
        } catch (error) {
            console.error('Failed to generate skill:', error);
            return false;
        }
    }

    /**
     * Generate SKILL.md content following SKILL_DESIGN_GUIDE.md
     */
    private generateSkillMd(skillName: string, lessons: Lesson[]): string {
        const category = lessons[0]?.category || 'general';
        const patterns = lessons.map(l => l.pattern);
        const triggers = this.generateTriggers(patterns);
        const coordinatesWith = this.generateCoordinatesWith(category);
        const purpose = this.generatePurpose(category, patterns);

        const content = `---
name: ${skillName}
description: >-
  Auto-generated skill from ${lessons.length} learned patterns.
  ${purpose}.
  Triggers on: ${triggers}.
  Coordinates with: ${coordinatesWith}.
metadata:
  category: "${category}"
  version: "1.0.0"
  triggers: "${triggers}"
  coordinates_with: "${coordinatesWith}"
  success_metrics: "pattern_matches, auto_fixes_applied"
  generated_from: ${lessons.length} lessons
  generated_at: "${new Date().toISOString()}"
---

# ${this.formatTitle(skillName)}

> **Purpose:** ${purpose}

---

## 🎯 Purpose

This skill was auto-generated from ${lessons.length} learned patterns in the \`${category}\` category.
It helps prevent common errors and applies best practices based on real code issues detected in your workspace.

---

## 📂 Skill Structure

\`\`\`
${skillName}/
├── SKILL.md           # This file (auto-generated, <200 lines)
├── scripts/           # Auto-fix scripts (if available)
└── patterns.json      # Raw pattern data (if exported)
\`\`\`

---

## 🔧 Quick Reference

### Check for ${category} issues

\`\`\`bash
# View learned patterns
cat .agent/skills/${skillName}/SKILL.md

# Search for similar issues in codebase
rg -n "${this.getFirstKeyword(patterns)}" --type ts
\`\`\`

### Apply fixes

${this.generateQuickReferenceCommands(lessons)}

---

## 📋 Learned Patterns

${this.generatePatternsSection(lessons)}

---

## ✅ Solutions

${this.generateSolutionsSection(lessons)}

---

## 🤖 Meta-Agents Integration

| Phase | Agent | Action |
|-------|-------|--------|
| **Detection** | \`problem-checker\` | Identifies matching patterns |
| **Analysis** | \`auto-learner\` | Categorizes and logs occurrence |
| **Resolution** | \`recovery\` | Applies suggested fix |
| **Verification** | \`code-quality\` | Validates fix correctness |

\`\`\`
problem-checker.detect() → auto-learner.analyze() → recovery.apply() → code-quality.verify()
\`\`\`

---

## When to Use

| Situation | Approach |
|-----------|----------|
${this.generateWhenToUse(lessons)}

---

## 🔗 Related

| Item | Type | Purpose |
|------|------|---------|
| \`problem-checker\` | Skill | Validates code after fixes |
| \`code-quality\` | Skill | Code quality enforcement |
| \`auto-learner\` | Skill | Learns new patterns |
| \`${coordinatesWith.split(',')[0].trim()}\` | Skill | Related domain skill |

---

## 💡 Example Interactions

Use this skill when you encounter:

${this.generateExampleInteractions(lessons)}

---

## 📊 Statistics

| Metric | Value |
|--------|-------|
| **Patterns Learned** | ${lessons.length} |
| **Category** | ${category} |
| **Auto-Generated** | Yes |
| **Generated At** | ${new Date().toISOString().split('T')[0]} |
| **Guide Compliance** | 100% |

---

⚡ PikaKit v3.2.0
Auto-generated skill following SKILL_DESIGN_GUIDE.md standard.
`;

        return content;
    }

    /**
     * Normalize skill name to kebab-case
     */
    private normalizeSkillName(name: string): string {
        return name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-|-$/g, '');
    }

    /**
     * Format skill name as title
     */
    private formatTitle(name: string): string {
        return name
            .split('-')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    }

    /**
     * Generate triggers from patterns
     */
    private generateTriggers(patterns: string[]): string {
        // Extract key words from patterns
        const keywords = new Set<string>();

        for (const pattern of patterns) {
            const words = pattern.toLowerCase().match(/\b[a-z]{4,}\b/g) || [];
            for (const word of words.slice(0, 3)) {
                if (!['this', 'that', 'with', 'from', 'have', 'type'].includes(word)) {
                    keywords.add(word);
                }
            }
        }

        return Array.from(keywords).slice(0, 5).join(', ');
    }

    /**
     * Generate purpose description
     */
    private generatePurpose(category: string, patterns: string[]): string {
        const categoryMap: Record<string, string> = {
            'import': 'Handle import-related issues and ensure proper module loading',
            'type': 'Prevent type errors and ensure type safety',
            'react': 'Follow React best practices and avoid common pitfalls',
            'code-quality': 'Maintain code quality standards',
            'code-style': 'Enforce consistent code formatting',
            'null-safety': 'Handle null and undefined values safely',
            'async': 'Properly use async/await patterns',
            'general': 'Apply learned patterns from common errors'
        };

        return categoryMap[category] || `Apply learned patterns for ${category} related issues`;
    }

    /**
     * Generate coordinates_with based on category
     */
    private generateCoordinatesWith(category: string): string {
        const coordinatesMap: Record<string, string> = {
            'import': 'code-quality, typescript-expert',
            'type': 'typescript-expert, code-quality',
            'react': 'react-architect, web-core',
            'code-quality': 'code-craft, code-review',
            'code-style': 'code-quality, code-craft',
            'null-safety': 'typescript-expert, code-quality',
            'async': 'nodejs-pro, code-quality',
            'general': 'code-quality, problem-checker'
        };

        return coordinatesMap[category] || 'code-quality, problem-checker';
    }

    /**
     * Generate When to Use table rows from lessons
     */
    private generateWhenToUse(lessons: Lesson[]): string {
        const rows = lessons.slice(0, 5).map(lesson => {
            const situation = lesson.pattern.substring(0, 50);
            const approach = lesson.solution || 'Apply pattern fix';
            return `| ${situation}... | ${approach} |`;
        });

        if (rows.length === 0) {
            return '| Error pattern detected | Apply learned fix |';
        }

        return rows.join('\n');
    }

    /**
     * Generate patterns section
     */
    private generatePatternsSection(lessons: Lesson[]): string {
        return lessons.map((lesson, i) => {
            return `### ${i + 1}. ${lesson.pattern}

- **Context:** ${lesson.context}
- **Occurrences:** ${lesson.occurrences}
- **Source:** ${lesson.source}`;
        }).join('\n\n');
    }

    /**
     * Generate quick reference section
     */
    private generateQuickReference(lessons: Lesson[]): string {
        const references = lessons
            .filter(l => l.solution && l.solution !== 'See error message for details')
            .map(l => `- ${l.solution}`);

        if (references.length === 0) {
            return '- Review patterns above for common issues\n- Apply suggested fixes';
        }

        return references.join('\n');
    }

    /**
     * Generate solutions section
     */
    private generateSolutionsSection(lessons: Lesson[]): string {
        const solutions = lessons
            .filter(l => l.solution && l.solution !== 'See error message for details')
            .map((lesson, i) => {
                return `### ${lesson.pattern.substring(0, 40)}...

**Fix:** ${lesson.solution}`;
            });

        if (solutions.length === 0) {
            return 'Solutions are pattern-specific. Review the patterns above for guidance.';
        }

        return solutions.join('\n\n');
    }

    /**
     * Get first keyword from patterns for search command
     */
    private getFirstKeyword(patterns: string[]): string {
        if (patterns.length === 0) return 'error';

        // Extract meaningful keyword from first pattern
        const words = patterns[0].toLowerCase().match(/\b[a-z]{4,}\b/g) || [];
        const filtered = words.filter(w =>
            !['this', 'that', 'with', 'from', 'have', 'type', 'cannot', 'does', 'find', 'name'].includes(w)
        );

        return filtered[0] || 'pattern';
    }

    /**
     * Generate quick reference commands with copy-paste examples
     */
    private generateQuickReferenceCommands(lessons: Lesson[]): string {
        const category = lessons[0]?.category || 'general';

        const commandsMap: Record<string, string> = {
            'import': `\`\`\`typescript
// Add missing import
import { MissingModule } from 'module-path';
\`\`\``,
            'type': `\`\`\`typescript
// Fix type mismatch
const value: CorrectType = someValue as CorrectType;
\`\`\``,
            'null-safety': `\`\`\`typescript
// Add null check
if (value !== null && value !== undefined) {
    // safe to use value
}
\`\`\``,
            'react': `\`\`\`tsx
// Import React types
import React, { ReactNode } from 'react';
\`\`\``,
            'general': `\`\`\`typescript
// Review error message and apply suggested fix
\`\`\``
        };

        return commandsMap[category] || commandsMap['general'];
    }

    /**
     * Generate example interactions section
     */
    private generateExampleInteractions(lessons: Lesson[]): string {
        const examples = lessons.slice(0, 4).map(lesson => {
            return `- "${lesson.pattern}"`;
        });

        if (examples.length === 0) {
            return '- Error patterns matching this category\n- Similar issues to the ones learned';
        }

        return examples.join('\n');
    }

    /**
     * Update registry.json if it exists
     */
    private async updateRegistry(skillName: string, lessons: Lesson[]): Promise<void> {
        const registryPath = path.join(this.skillsDir, 'registry.json');

        try {
            let registry: { skills: any[] } = { skills: [] };

            if (fs.existsSync(registryPath)) {
                const content = fs.readFileSync(registryPath, 'utf8');
                registry = JSON.parse(content);
            }

            // Add new skill to registry
            registry.skills.push({
                name: skillName,
                path: `./${skillName}/SKILL.md`,
                category: lessons[0]?.category || 'auto-generated',
                version: '1.0.0',
                autoGenerated: true,
                generatedAt: new Date().toISOString(),
                lessonsCount: lessons.length
            });

            fs.writeFileSync(registryPath, JSON.stringify(registry, null, 2), 'utf8');
        } catch (error) {
            console.error('Failed to update registry:', error);
        }
    }

    /**
     * Auto-inject skill reference to GEMINI.md
     * This ensures Agent knows about the new skill immediately
     */
    private async injectToGemini(skillName: string, lessons: Lesson[]): Promise<void> {
        const agentDir = path.join(this.skillsDir, '..');
        const geminiPath = path.join(agentDir, 'GEMINI.md');

        try {
            if (!fs.existsSync(geminiPath)) {
                console.log('GEMINI.md not found, skipping injection');
                return;
            }

            let content = fs.readFileSync(geminiPath, 'utf8');

            // Check if skill already exists in GEMINI.md
            if (content.includes(`- ${skillName}`)) {
                console.log(`Skill ${skillName} already in GEMINI.md`);
                return;
            }

            // Find the skills section and inject
            const category = lessons[0]?.category || 'general';
            const purpose = this.generatePurpose(category, lessons.map(l => l.pattern));
            const skillEntry = `- ${skillName} (.agent/skills/${skillName}/SKILL.md): ${purpose}. Auto-generated from ${lessons.length} learned patterns. Triggers on: ${this.generateTriggers(lessons.map(l => l.pattern))}.`;

            // Try to find existing skills section
            const skillsSectionRegex = /(<skills>[\s\S]*?)(Available skills:[\s\S]*?)(<\/skills>)/;
            const match = content.match(skillsSectionRegex);

            if (match) {
                // Insert before </skills>
                const newSkillsSection = match[1] + match[2] + '\n' + skillEntry + '\n' + match[3];
                content = content.replace(skillsSectionRegex, newSkillsSection);
            } else {
                // Fallback: append to end of file with section marker
                const autoLearnedSection = `

<!-- AUTO-LEARNED SKILLS (generated by PikaKit Extension) -->
## 📚 Auto-Learned Skills

${skillEntry}
<!-- END AUTO-LEARNED SKILLS -->
`;
                // Check if auto-learned section exists
                if (content.includes('<!-- AUTO-LEARNED SKILLS')) {
                    // Append to existing section
                    content = content.replace(
                        /(<!-- AUTO-LEARNED SKILLS.*?-->[\s\S]*?)(<!-- END AUTO-LEARNED SKILLS -->)/,
                        `$1\n${skillEntry}\n$2`
                    );
                } else {
                    // Add new section
                    content += autoLearnedSection;
                }
            }

            fs.writeFileSync(geminiPath, content, 'utf8');
            console.log(`Injected skill ${skillName} to GEMINI.md`);
        } catch (error) {
            console.error('Failed to inject to GEMINI.md:', error);
        }
    }
}
