/**
 * CognitiveEnhancer - Core Business Logic
 * 
 * Transforms raw lessons into cognitive lessons with intelligence layers:
 * 1. Intent Inference - detect purpose
 * 2. Pattern Classification - categorize by type
 * 3. Maturity Calculation - confidence & state
 * 4. Evolution Analysis - gap detection
 * 
 * Pure business logic with NO external dependencies.
 */

// ============================================================================
// INTENT INFERENCE
// ============================================================================

const INTENT_PATTERNS = {
    'safe-rebranding': {
        keywords: ['rebrand', 'rename', 'file-safety'],
        goal: 'Rename files/entities without data loss or breaking changes',
        category: 'file-operations',
    },
    'cli-ux-consistency': {
        keywords: ['cli', 'ux', 'menu', 'navigation', 'clack'],
        goal: 'Provide consistent, intuitive CLI user experience',
        category: 'user-experience',
    },
    'error-prevention': {
        keywords: ['validation', 'error', 'check', 'verify'],
        goal: 'Prevent runtime errors through proactive validation',
        category: 'reliability',
    },
    'code-quality': {
        keywords: ['import', 'architecture', 'quality'],
        goal: 'Maintain clean, maintainable code structure',
        category: 'maintainability',
    },
};

export class CognitiveEnhancer {
    /**
     * Infer lesson intent from tags
     * @param {Array<string>} tags
     * @returns {{id: string, goal: string, strength: number, category: string}}
     */
    static inferIntent(tags) {
        if (!tags || tags.length === 0) {
            return {
                id: 'unknown',
                goal: 'General code quality improvement',
                strength: 0.3,
                category: 'general',
            };
        }

        let bestMatch = null;
        let bestScore = 0;

        for (const [intentId, pattern] of Object.entries(INTENT_PATTERNS)) {
            const matchCount = tags.filter(tag =>
                pattern.keywords.some(kw => tag.toLowerCase().includes(kw.toLowerCase()))
            ).length;

            const score = matchCount / tags.length; // 0-1 confidence

            if (score > bestScore) {
                bestScore = score;
                bestMatch = {
                    id: intentId,
                    goal: pattern.goal,
                    strength: score,
                    category: pattern.category,
                };
            }
        }

        return bestMatch || {
            id: 'unknown',
            goal: 'General code quality improvement',
            strength: 0.3,
            category: 'general',
        };
    }

    /**
     * Calculate lesson maturity metrics
     * @param {Array} mistakes
     * @param {Array} improvements
     * @returns {{state: string, confidence: number, indicators: object, coverage: string, recommendation: string}}
     */
    static calculateMaturity(mistakes, improvements) {
        const m = mistakes.length;
        const i = improvements.length;

        // State determination
        let state;
        if (i === 0 && m > 0) state = 'RAW';          // 🟥 Only mistakes
        else if (i > 0 && m === 0) state = 'IDEAL';   // 🟦 Only improvements (rare)
        else if (i >= m) state = 'MATURE';            // 🟩 Balanced or improvement-heavy
        else state = 'LEARNING';                       // 🟨 More mistakes than solutions

        // Multi-factor confidence
        const balanceScore = i / (m + i) || 0;
        const evidenceScore = this.calculateEvidenceScore(mistakes, improvements);
        const recencyScore = this.calculateRecencyScore(mistakes, improvements);

        const confidence = (
            balanceScore * 0.5 +      // Balance is most important
            evidenceScore * 0.3 +      // Evidence validates
            recencyScore * 0.2         // Fresh is better
        );

        return {
            state,
            confidence: Math.round(confidence * 100) / 100,
            indicators: {
                balance: Math.round(balanceScore * 100) / 100,
                evidence: Math.round(evidenceScore * 100) / 100,
                recency: Math.round(recencyScore * 100) / 100,
            },
            coverage: `${m} mistakes / ${i} improvements`,
            recommendation: this.getRecommendation(state, confidence),
        };
    }

    /**
     * Calculate evidence score based on hit counts
     */
    static calculateEvidenceScore(mistakes, improvements) {
        const totalMistakeHits = mistakes.reduce((sum, m) => sum + (m.hitCount || 0), 0);
        const totalImprovementHits = improvements.reduce((sum, i) => sum + (i.appliedCount || 0), 0);
        const totalHits = totalMistakeHits + totalImprovementHits;

        if (totalHits === 0) return 0.1; // No evidence
        if (totalHits < 5) return 0.3;   // Weak
        if (totalHits < 20) return 0.6;  // Moderate
        return 0.9;                       // Strong
    }

    /**
     * Calculate recency score
     */
    static calculateRecencyScore(mistakes, improvements) {
        const now = Date.now();

        const allDates = [
            ...mistakes.map(m => new Date(m.lastHit || m.added).getTime()),
            ...improvements.map(i => new Date(i.lastApplied || i.added).getTime()),
        ];

        if (allDates.length === 0) return 0.5;

        const lastUpdate = Math.max(...allDates);
        const daysSinceUpdate = (now - lastUpdate) / (1000 * 60 * 60 * 24);

        if (daysSinceUpdate < 7) return 1.0;    // This week
        if (daysSinceUpdate < 30) return 0.8;   // This month
        if (daysSinceUpdate < 90) return 0.5;   // This quarter
        return 0.3;                              // Stale
    }

    /**
     * Get recommendation based on state and confidence
     */
    static getRecommendation(state, confidence) {
        if (state === 'RAW') {
            return 'URGENT: Discover best practices for this area';
        }
        if (state === 'LEARNING' && confidence < 0.5) {
            return 'Needs more improvements to balance anti-patterns';
        }
        if (state === 'MATURE' && confidence > 0.8) {
            return 'Stable - can be trusted for skill injection';
        }
        if (state === 'IDEAL') {
            return 'Perfect - all best practices, no anti-patterns';
        }
        return 'Continue learning';
    }

    /**
     * Analyze evolution needs and gaps
     * @param {Array} mistakes
     * @param {Array} improvements
     * @param {object} intent
     * @returns {{signals: Array, missingAreas: Array, nextAction: string}}
     */
    static analyzeEvolution(mistakes, improvements, intent) {
        const signals = [];
        const missingAreas = [];

        // Signal 1: Many mistakes, few solutions
        if (mistakes.length > improvements.length * 2) {
            signals.push({
                type: 'SUGGEST_IMPROVEMENT_DISCOVERY',
                priority: 'HIGH',
                reason: `${mistakes.length} anti-patterns but only ${improvements.length} solution(s)`,
            });
        }

        // Signal 2: Uncovered tags
        const mistakeTags = new Set(mistakes.flatMap(m => m.tags || []));
        const improvementTags = new Set(improvements.flatMap(i => i.tags || []));
        const uncoveredTags = [...mistakeTags].filter(tag => !improvementTags.has(tag));

        uncoveredTags.forEach(tag => {
            missingAreas.push({
                area: tag,
                reason: 'Anti-patterns detected but no best practice documented',
                mistakeCount: mistakes.filter(m => m.tags && m.tags.includes(tag)).length,
            });
        });

        // Signal 3: High-hit mistakes without solution
        mistakes.forEach(m => {
            if ((m.hitCount || 0) > 10 && !this.hasRelatedImprovement(m, improvements)) {
                signals.push({
                    type: 'HOT_MISTAKE_NEEDS_SOLUTION',
                    priority: 'CRITICAL',
                    mistake: m.id,
                    reason: `${m.title} hit ${m.hitCount} times but no solution documented`,
                });

                missingAreas.push({
                    area: `solution-for-${m.id}`,
                    reason: 'Frequently violated anti-pattern needs best practice',
                    hitCount: m.hitCount,
                });
            }
        });

        // Signal 4: Intent under-served
        if (intent && intent.strength > 0.7) {
            const coverageScore = improvements.length / (mistakes.length + improvements.length);
            if (coverageScore < 0.5) {
                signals.push({
                    type: 'INTENT_UNDER_SERVED',
                    priority: 'MEDIUM',
                    reason: `Intent "${intent.goal}" is clear but solutions are scarce`,
                });
            }
        }

        return {
            signals,
            missingAreas,
            nextAction: this.determineNextAction(signals),
        };
    }

    /**
     * Check if mistake has related improvement
     */
    static hasRelatedImprovement(mistake, improvements) {
        return improvements.some(i =>
            i.tags && mistake.tags && i.tags.some(tag => mistake.tags.includes(tag))
        );
    }

    /**
     * Determine next action from signals
     */
    static determineNextAction(signals) {
        if (signals.some(s => s.priority === 'CRITICAL')) {
            return 'Document solution for high-frequency violations immediately';
        }
        if (signals.some(s => s.type === 'SUGGEST_IMPROVEMENT_DISCOVERY')) {
            return 'Research and document best practices in underserved areas';
        }
        return 'Continue normal learning';
    }

    /**
     * Format tag as title
     */
    static formatTagAsTitle(tag) {
        return tag
            .split('-')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    }
}
