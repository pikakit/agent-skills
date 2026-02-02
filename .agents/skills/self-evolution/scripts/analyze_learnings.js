#!/usr/bin/env node
/**
 * Learning Analysis Engine for SelfEvolution v4.0
 * AI-powered analysis to categorize learnings as keep/refine/add/deprecate
 */

import fs from 'fs';
import yaml from 'js-yaml';
import { fileURLToPath } from 'url';
import {
    getMistakesFile,
    getImprovementsFile,
    getMetaFile
} from './project_utils.js';
import { resolveApiKey, configureGenai } from './api_key_resolver.js';

const __filename = fileURLToPath(import.meta.url);

/**
 * Load all current learnings (mistakes + improvements)
 */
export function loadLearnings() {
    const result = {
        mistakes: [],
        improvements: []
    };

    try {
        const mistakesFile = getMistakesFile();
        if (fs.existsSync(mistakesFile)) {
            const data = yaml.load(fs.readFileSync(mistakesFile, 'utf-8')) || {};
            result.mistakes = data.mistakes || [];
        }
    } catch (e) { /* ignore */ }

    try {
        const improvementsFile = getImprovementsFile();
        if (fs.existsSync(improvementsFile)) {
            const data = yaml.load(fs.readFileSync(improvementsFile, 'utf-8')) || {};
            result.improvements = data.improvements || [];
        }
    } catch (e) { /* ignore */ }

    return result;
}

/**
 * Use AI to analyze if learning should be kept/refined/deprecated
 */
export async function analyzeLearningWithAI(learning, learningType, recentEvents) {
    const resolution = resolveApiKey();
    if (!resolution.api_key) {
        return 'keep';
    }

    try {
        const genai = await configureGenai(resolution.api_key);
        if (!genai) return 'keep';

        const model = genai.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });

        const prompt = `You are an AI assistant analyzing a coding lesson for quality and relevance.

Learning Type: ${learningType}
Learning ID: ${learning.id}
Learning Content:
${yaml.dump(learning)}

Recent Events (last 5):
${JSON.stringify(recentEvents.slice(-5), null, 2)}

Task: Categorize this learning into ONE of these categories:

1. **keep** - Learning is still valid and accurate. No changes needed.
2. **refine** - Learning is valid but could be improved (more specific, better examples, clearer message).
3. **deprecate** - Learning is outdated, no longer applicable, or superseded by newer knowledge.

Criteria:
- If hitCount = 0 and appliedCount > 0: likely 'keep' (working well)
- If hitCount > appliedCount: likely 'refine' (not being applied enough)
- If last applied > 30 days ago: consider 'deprecate' or 'refine'
- If lesson is vague or generic: 'refine'
- If lesson contradicts recent events: 'deprecate' or 'refine'

Respond with ONLY ONE WORD: keep, refine, or deprecate`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const category = response.text().trim().toLowerCase();

        if (['keep', 'refine', 'deprecate'].includes(category)) {
            return category;
        }
        return 'keep';
    } catch (e) {
        console.log(`⚠️  AI analysis failed: ${e.message}`);
        return 'keep';
    }
}

/**
 * Heuristic-based analysis (fallback if no AI)
 */
export function analyzeLearningsHeuristic(learning, learningType) {
    const hitCount = learning.hitCount || 0;
    const appliedCount = learning.appliedCount || 0;
    const status = learning.status || 'active';

    // Already deprecated
    if (status !== 'active') {
        return 'deprecate';
    }

    // Never applied = might need refinement
    if (appliedCount === 0 && learningType === 'mistake') {
        return 'refine';
    }

    // Applied successfully with no violations = keep
    if (appliedCount > 0 && hitCount === 0) {
        return 'keep';
    }

    // More violations than applications = needs refinement
    if (hitCount > appliedCount) {
        return 'refine';
    }

    return 'keep';
}

/**
 * Categorize all learnings into keep/refine/add_new/deprecate
 */
export async function categorizeLearnings(useAI = true) {
    const learnings = loadLearnings();

    const categorized = {
        keep: [],
        refine: [],
        add_new: [],
        deprecate: []
    };

    // Get recent events for context
    let recentEvents = [];
    try {
        const metaFile = getMetaFile();
        if (fs.existsSync(metaFile)) {
            const meta = JSON.parse(fs.readFileSync(metaFile, 'utf-8'));
            recentEvents = (meta.self_improve || {}).history || [];
        }
    } catch (e) { /* ignore */ }

    console.log(`🔍 Analyzing ${learnings.mistakes.length} mistakes...`);
    for (const mistake of learnings.mistakes) {
        let category;
        if (useAI) {
            category = await analyzeLearningWithAI(mistake, 'mistake', recentEvents);
        } else {
            category = analyzeLearningsHeuristic(mistake, 'mistake');
        }

        categorized[category].push({ type: 'mistake', learning: mistake });
        console.log(`  • ${mistake.id}: ${category}`);
    }

    console.log(`\n🔍 Analyzing ${learnings.improvements.length} improvements...`);
    for (const improvement of learnings.improvements) {
        let category;
        if (useAI) {
            category = await analyzeLearningWithAI(improvement, 'improvement', recentEvents);
        } else {
            category = analyzeLearningsHeuristic(improvement, 'improvement');
        }

        categorized[category].push({ type: 'improvement', learning: improvement });
        console.log(`  • ${improvement.id}: ${category}`);
    }

    return categorized;
}

/**
 * Generate suggestions for refining a learning
 */
export async function generateRefinementSuggestions(learning, learningType) {
    const currentLesson = learningType === 'mistake'
        ? learning.lesson
        : learning.improvement;

    const resolution = resolveApiKey();
    if (!resolution.api_key) {
        return {
            lesson: currentLesson || '',
            reason: 'No API key - manual refinement needed'
        };
    }

    try {
        const genai = await configureGenai(resolution.api_key);
        if (!genai) {
            return { lesson: currentLesson || '', reason: 'AI not available' };
        }

        const model = genai.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });

        const prompt = `You are refining a coding lesson to make it more specific, actionable, and clear.

Current Lesson (${learningType}):
ID: ${learning.id}
Current Text: ${currentLesson}
Hit Count: ${learning.hitCount || 0}
Applied Count: ${learning.appliedCount || 0}

Task: Improve this lesson by making it:
1. More specific (add concrete examples or patterns)
2. More actionable (clear do's and don'ts)
3. More memorable (concise but impactful)

Respond in JSON format:
{
  "refined_lesson": "improved lesson text here",
  "changelog": "brief explanation of what was improved"
}`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        let text = response.text().trim();

        // Extract JSON
        if (text.includes('```json')) {
            text = text.split('```json')[1].split('```')[0];
        } else if (text.includes('```')) {
            text = text.split('```')[1].split('```')[0];
        }

        const parsed = JSON.parse(text);
        return {
            lesson: parsed.refined_lesson || currentLesson,
            changelog: parsed.changelog || 'AI refinement'
        };
    } catch (e) {
        console.log(`⚠️  Refinement failed: ${e.message}`);
        return {
            lesson: currentLesson || '',
            reason: e.message
        };
    }
}

async function main() {
    const args = process.argv.slice(2);

    const useAI = args.includes('--ai');
    const refineIdx = args.indexOf('--refine');

    if (refineIdx !== -1 && args[refineIdx + 1]) {
        const learningId = args[refineIdx + 1];
        const learnings = loadLearnings();

        let target = null;
        let learningType = null;

        for (const mistake of learnings.mistakes) {
            if (mistake.id === learningId) {
                target = mistake;
                learningType = 'mistake';
                break;
            }
        }

        if (!target) {
            for (const improvement of learnings.improvements) {
                if (improvement.id === learningId) {
                    target = improvement;
                    learningType = 'improvement';
                    break;
                }
            }
        }

        if (!target) {
            console.log(`❌ Learning ${learningId} not found`);
            process.exit(1);
        }

        console.log(`🔄 Refining ${learningId}...\n`);
        console.log(`Current: ${target.lesson || target.improvement}\n`);

        const suggestion = await generateRefinementSuggestions(target, learningType);

        console.log(`Suggested: ${suggestion.lesson}`);
        console.log(`Reason: ${suggestion.changelog || suggestion.reason}`);
    } else {
        console.log('📊 Learning Analysis\n');

        const categorized = await categorizeLearnings(useAI);

        console.log('\n📊 Results:');
        console.log(`  ✅ Keep: ${categorized.keep.length} learnings`);
        console.log(`  🔄 Refine: ${categorized.refine.length} learnings`);
        console.log(`  ➕ Add New: ${categorized.add_new.length} learnings`);
        console.log(`  ❌ Deprecate: ${categorized.deprecate.length} learnings`);

        if (categorized.refine.length > 0) {
            console.log('\n🔄 Needs Refinement:');
            for (const item of categorized.refine) {
                const learning = item.learning;
                console.log(`  • ${learning.id}: hits=${learning.hitCount || 0}, applied=${learning.appliedCount || 0}`);
            }
        }

        if (categorized.deprecate.length > 0) {
            console.log('\n❌ Should Deprecate:');
            for (const item of categorized.deprecate) {
                const learning = item.learning;
                console.log(`  • ${learning.id}: ${learning.status || 'unknown'}`);
            }
        }
    }
}

if (process.argv[1] === __filename) {
    main();
}
