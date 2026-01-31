/**
 * LessonSynthesizer - Core Business Logic
 * 
 * Synthesizes cognitive lessons from raw mistakes and improvements.
 * Groups by tag, applies cognitive enhancements, and sorts by maturity.
 * 
 * Pure function - no side effects.
 */

import { CognitiveEnhancer } from './cognitive-enhancer.js';

export class LessonSynthesizer {
    /**
     * Synthesize cognitive lessons from mistakes and improvements
     * @param {Array} mistakes - Raw mistake data
     * @param {Array} improvements - Raw improvement data
     * @returns {Array} Cognitive lesson units
     */
    static synthesize(mistakes, improvements) {
        // Group by tag
        const groups = new Map();

        // Add mistakes to groups
        mistakes.forEach(m => {
            const tags = m.tags || ['uncategorized'];
            tags.forEach(tag => {
                if (!groups.has(tag)) {
                    groups.set(tag, { mistakes: [], improvements: [] });
                }
                groups.get(tag).mistakes.push(m);
            });
        });

        // Add improvements to groups
        improvements.forEach(i => {
            const tags = i.tags || ['uncategorized'];
            tags.forEach(tag => {
                if (!groups.has(tag)) {
                    groups.set(tag, { mistakes: [], improvements: [] });
                }
                groups.get(tag).improvements.push(i);
            });
        });

        // Build Cognitive Lessons
        const lessons = [];
        let lessonId = 1;

        groups.forEach((group, tag) => {
            const allTags = [tag, ...group.mistakes.flatMap(m => m.tags || [])];
            const intent = CognitiveEnhancer.inferIntent(allTags);
            const maturity = CognitiveEnhancer.calculateMaturity(group.mistakes, group.improvements);
            const evolution = CognitiveEnhancer.analyzeEvolution(group.mistakes, group.improvements, intent);

            lessons.push({
                id: `LESSON-${String(lessonId++).padStart(3, '0')}`,
                title: CognitiveEnhancer.formatTagAsTitle(tag),
                tag,
                intent,
                mistakes: group.mistakes,
                improvements: group.improvements,
                maturity,
                evolution,
            });
        });

        // Sort by maturity (MATURE first, RAW last)
        return this.sortByMaturity(lessons);
    }

    /**
     * Sort lessons by maturity state and confidence
     */
    static sortByMaturity(lessons) {
        const stateOrder = { 'IDEAL': 0, 'MATURE': 1, 'LEARNING': 2, 'RAW': 3 };

        return lessons.sort((a, b) => {
            const stateCompare = stateOrder[a.maturity.state] - stateOrder[b.maturity.state];
            if (stateCompare !== 0) return stateCompare;
            return b.maturity.confidence - a.maturity.confidence; // Higher confidence first
        });
    }
}
