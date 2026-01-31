/**
 * SkillFormatter - Presentation Layer
 * 
 * Formats cognitive lessons into Gemini-compatible skill markdown.
 * Pure formatter - no business logic, no side effects.
 */

export class SkillFormatter {
    /**
     * Format a cognitive lesson as a Gemini skill
     * @param {object} lesson - Cognitive lesson from LessonSynthesizer
     * @returns {{name: string, filename: string, content: string}}
     */
    format(lesson) {
        const name = this.sanitizeName(lesson.tag);
        const frontmatter = this.buildFrontmatter(lesson);
        const content = this.buildContent(lesson);

        return {
            name,
            filename: `learned-${name}.md`,
            content: `---\n${frontmatter}\n---\n\n${content}`
        };
    }

    /**
     * Sanitize tag as filename-safe name
     */
    sanitizeName(tag) {
        return tag.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    }

    /**
     * Build YAML frontmatter
     */
    buildFrontmatter(lesson) {
        const totalHits = this.calculateTotalHits(lesson);
        const evidenceCount = lesson.mistakes.length + lesson.improvements.length;

        return [
            `name: ${lesson.tag}`,
            `description: ${lesson.intent.goal}`,
            `maturity: ${lesson.maturity.state}`,
            `confidence: ${lesson.maturity.confidence}`,
            `evidence: ${evidenceCount} patterns, ${totalHits} detections`,
            `trigger: always_on`
        ].join('\n');
    }

    /**
     * Calculate total hits across mistakes and improvements
     */
    calculateTotalHits(lesson) {
        const mistakeHits = lesson.mistakes.reduce((sum, m) => sum + (m.hitCount || 0), 0);
        const improvementHits = lesson.improvements.reduce((sum, i) => sum + (i.appliedCount || 0), 0);
        return mistakeHits + improvementHits;
    }

    /**
     * Build main content
     */
    buildContent(lesson) {
        let md = `# ${lesson.title}\n\n`;

        // Header section
        md += this.buildHeader(lesson);

        // Anti-patterns section
        if (lesson.mistakes.length > 0) {
            md += this.buildAntiPatterns(lesson.mistakes);
        }

        // Best practices section
        if (lesson.improvements.length > 0) {
            md += this.buildBestPractices(lesson.improvements);
        }

        // Evolution status
        md += this.buildEvolutionStatus(lesson);

        // When to apply
        md += this.buildApplicationGuide(lesson);

        // Confidence metrics
        md += this.buildMetrics(lesson);

        // Footer
        md += this.buildFooter();

        return md;
    }

    /**
     * Build header section
     */
    buildHeader(lesson) {
        return [
            `> **Intent:** ${lesson.intent.goal}`,
            `> **Maturity:** ${lesson.maturity.state} (${(lesson.maturity.confidence * 100).toFixed(0)}% confidence)`,
            `> **Coverage:** ${lesson.maturity.coverage}`,
            '',
            `**Recommendation:** ${lesson.maturity.recommendation}`,
            '',
            ''
        ].join('\n');
    }

    /**
     * Build anti-patterns section
     */
    buildAntiPatterns(mistakes) {
        let md = `## 🚫 Anti-Patterns (Avoid These)\n\n`;

        mistakes.forEach(mistake => {
            md += `### ❌ ${mistake.id}: ${mistake.message}\n\n`;
            md += `**Pattern:** \`${mistake.pattern}\`  \n`;
            md += `**Severity:** ${mistake.severity}  \n`;
            md += `**Hit Count:** ${mistake.hitCount || 0} detections  \n`;

            if (mistake.lastHit) {
                const lastHit = new Date(mistake.lastHit).toLocaleDateString();
                md += `**Last Seen:** ${lastHit}  \n`;
            }

            md += '\n';

            // Add tags if available
            if (mistake.tags && mistake.tags.length > 0) {
                md += `**Tags:** ${mistake.tags.join(', ')}  \n\n`;
            }
        });

        return md;
    }

    /**
     * Build best practices section
     */
    buildBestPractices(improvements) {
        let md = `## ✅ Best Practices (Do This Instead)\n\n`;

        improvements.forEach(improvement => {
            md += `### ✅ ${improvement.id}: ${improvement.message}\n\n`;
            md += `**Pattern:** \`${improvement.pattern}\`  \n`;
            md += `**Applied Count:** ${improvement.appliedCount || 0} times  \n`;

            if (improvement.lastApplied) {
                const lastApplied = new Date(improvement.lastApplied).toLocaleDateString();
                md += `**Last Applied:** ${lastApplied}  \n`;
            }

            md += '\n';

            // Add tags if available
            if (improvement.tags && improvement.tags.length > 0) {
                md += `**Tags:** ${improvement.tags.join(', ')}  \n\n`;
            }
        });

        return md;
    }

    /**
     * Build evolution status section
     */
    buildEvolutionStatus(lesson) {
        let md = `## 📊 Evolution Status\n\n`;

        if (lesson.evolution.signals && lesson.evolution.signals.length > 0) {
            md += `**Active Signals:**\n`;
            lesson.evolution.signals.forEach(signal => {
                md += `- **${signal.type}** (${signal.priority}): ${signal.reason}\n`;
            });
            md += '\n';
        }

        if (lesson.evolution.missingAreas && lesson.evolution.missingAreas.length > 0) {
            md += `**Missing Areas:**\n`;
            lesson.evolution.missingAreas.forEach(area => {
                md += `- ${area.area}: ${area.reason}\n`;
            });
            md += '\n';
        }

        md += `**Next Action:** ${lesson.evolution.nextAction}\n\n`;

        return md;
    }

    /**
     * Build application guide
     */
    buildApplicationGuide(lesson) {
        let md = `## 🎯 When to Apply\n\n`;
        md += `This skill applies when:\n`;
        md += `- Working with **${lesson.intent.category}**\n`;
        md += `- Goal: ${lesson.intent.goal}\n`;
        md += `- Confidence level: ${lesson.intent.strength >= 0.7 ? 'High' : 'Moderate'}\n\n`;

        return md;
    }

    /**
     * Build confidence metrics
     */
    buildMetrics(lesson) {
        let md = `## 📈 Confidence Metrics\n\n`;

        const indicators = lesson.maturity.indicators;
        md += `- **Balance Score:** ${(indicators.balance * 100).toFixed(0)}% (improvement/total ratio)\n`;
        md += `- **Evidence Score:** ${(indicators.evidence * 100).toFixed(0)}% (validation from hits)\n`;
        md += `- **Recency Score:** ${(indicators.recency * 100).toFixed(0)}% (freshness)\n`;
        md += `- **Overall Confidence:** ${(lesson.maturity.confidence * 100).toFixed(0)}%\n\n`;

        return md;
    }

    /**
     * Build footer
     */
    buildFooter() {
        const timestamp = new Date().toISOString();

        return [
            '---',
            '',
            '*Auto-generated from PikaKit*  ',
            `*Source: \`.agent/knowledge/mistakes.yaml\` + \`improvements.yaml\`*  `,
            `*Generated: ${timestamp}*`
        ].join('\n');
    }
}
