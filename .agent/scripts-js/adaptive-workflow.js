#!/usr/bin/env node
/**
 * Adaptive Workflow Engine
 * 
 * Optimizes workflow execution by:
 * - Skipping unnecessary steps based on context
 * - Parallelizing independent operations
 * - Caching previous results to avoid redundant work
 * - Providing intelligent recommendations
 * 
 * Usage:
 *   import { AdaptiveWorkflow } from './adaptive-workflow.js';
 *   const workflow = new AdaptiveWorkflow(workflowConfig);
 *   const optimizedPlan = await workflow.optimize(context);
 * 
 * @version 1.0.0
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Skip conditions for common workflow steps
const SKIP_CONDITIONS = {
    // Planning phase
    'explorer-agent': {
        skipIf: (ctx) => ctx.isSimpleTask || ctx.hasExistingPlan || ctx.fileCount < 10,
        reason: 'Small codebase or existing plan'
    },

    // Design phase
    'design-system-generation': {
        skipIf: (ctx) => ctx.hasExistingDesignSystem || !ctx.hasUIComponents,
        reason: 'No UI components or design system exists'
    },

    // Testing phase
    'e2e-tests': {
        skipIf: (ctx) => ctx.isRefactorOnly || ctx.noNewFeatures,
        reason: 'Refactor-only change, no new features'
    },

    // Security phase
    'security-audit': {
        skipIf: (ctx) => ctx.isUIOnly && !ctx.hasAuth,
        reason: 'UI-only change with no auth'
    },

    // Documentation phase
    'api-docs': {
        skipIf: (ctx) => !ctx.hasAPIChanges,
        reason: 'No API changes'
    },

    // Deployment phase
    'staging-deploy': {
        skipIf: (ctx) => ctx.isLocalOnly,
        reason: 'Local development only'
    }
};

// Parallelization opportunities
const PARALLEL_GROUPS = [
    {
        name: 'foundation',
        steps: ['database-architect', 'security-auditor'],
        condition: (ctx) => ctx.hasDatabase && ctx.hasSecurity
    },
    {
        name: 'core',
        steps: ['backend-specialist', 'frontend-specialist'],
        condition: (ctx) => ctx.isFullStack
    },
    {
        name: 'quality',
        steps: ['test-engineer', 'documentation-writer'],
        condition: (ctx) => true
    },
    {
        name: 'validation',
        steps: ['lint-check', 'type-check', 'security-scan'],
        condition: (ctx) => true
    }
];

/**
 * Adaptive Workflow Engine
 */
export class AdaptiveWorkflow {
    constructor(config = {}) {
        this.steps = config.steps || [];
        this.agents = config.agents || [];
        this.cacheDir = config.cacheDir || path.join(__dirname, '..', 'cache');
        this.history = [];
    }

    /**
     * Analyze context and optimize workflow
     */
    async optimize(context) {
        const analysis = this.analyzeContext(context);
        const skippable = this.findSkippableSteps(analysis);
        const parallelizable = this.findParallelizableSteps(analysis);
        const reusable = await this.findReusableResults(analysis);

        return {
            original: this.steps.length,
            optimized: this.steps.length - skippable.length,

            skippedSteps: skippable,
            parallelGroups: parallelizable,
            cachedResults: reusable,

            recommendations: this.generateRecommendations(analysis, skippable, parallelizable),

            estimatedTimeSaving: this.estimateTimeSaving(skippable, parallelizable),

            executionPlan: this.generateExecutionPlan(skippable, parallelizable)
        };
    }

    /**
     * Analyze task context
     */
    analyzeContext(context) {
        return {
            isSimpleTask: context.complexity === 'simple',
            hasExistingPlan: !!context.planPath,
            hasExistingDesignSystem: !!context.designSystemPath,
            hasUIComponents: context.domains?.includes('frontend') || context.domains?.includes('ui'),
            hasDatabase: context.domains?.includes('database') || context.domains?.includes('backend'),
            hasSecurity: context.domains?.includes('security') || context.domains?.includes('auth'),
            hasAPIChanges: context.changes?.some(c => c.includes('api') || c.includes('route')),
            hasAuth: context.changes?.some(c => c.includes('auth') || c.includes('login')),
            isFullStack: context.domains?.includes('frontend') && context.domains?.includes('backend'),
            isUIOnly: context.domains?.length === 1 && context.domains?.[0] === 'frontend',
            isRefactorOnly: context.type === 'refactor',
            noNewFeatures: context.type === 'fix' || context.type === 'refactor',
            isLocalOnly: !context.deployTarget,
            fileCount: context.files?.length || 0,
            ...context
        };
    }

    /**
     * Find steps that can be skipped
     */
    findSkippableSteps(analysis) {
        const skippable = [];

        for (const [stepName, condition] of Object.entries(SKIP_CONDITIONS)) {
            if (condition.skipIf(analysis)) {
                skippable.push({
                    step: stepName,
                    reason: condition.reason
                });
            }
        }

        return skippable;
    }

    /**
     * Find steps that can run in parallel
     */
    findParallelizableSteps(analysis) {
        const eligible = [];

        for (const group of PARALLEL_GROUPS) {
            if (group.condition(analysis)) {
                const relevantSteps = group.steps.filter(s =>
                    !this.isSkipped(s, analysis)
                );

                if (relevantSteps.length > 1) {
                    eligible.push({
                        name: group.name,
                        steps: relevantSteps,
                        estimatedParallelGain: this.estimateParallelGain(relevantSteps)
                    });
                }
            }
        }

        return eligible;
    }

    /**
     * Check if step is skipped
     */
    isSkipped(stepName, analysis) {
        const condition = SKIP_CONDITIONS[stepName];
        return condition && condition.skipIf(analysis);
    }

    /**
     * Find reusable cached results
     */
    async findReusableResults(analysis) {
        const reusable = [];

        // Check for cached design system
        if (analysis.hasExistingDesignSystem) {
            reusable.push({
                type: 'design-system',
                path: analysis.designSystemPath,
                age: 'recent'
            });
        }

        // Check for cached security scan
        const lastSecurityScan = this.getLastResult('security-scan');
        if (lastSecurityScan && !analysis.hasSecurityRelevantChanges) {
            reusable.push({
                type: 'security-scan',
                path: lastSecurityScan.path,
                age: this.formatAge(lastSecurityScan.timestamp)
            });
        }

        return reusable;
    }

    /**
     * Get last cached result
     */
    getLastResult(type) {
        const cachePath = path.join(this.cacheDir, `${type}.json`);
        if (fs.existsSync(cachePath)) {
            return JSON.parse(fs.readFileSync(cachePath, 'utf-8'));
        }
        return null;
    }

    /**
     * Format age of cached result
     */
    formatAge(timestamp) {
        const age = Date.now() - timestamp;
        const hours = Math.floor(age / 3600000);
        if (hours < 1) return 'less than 1 hour';
        if (hours < 24) return `${hours} hours`;
        return `${Math.floor(hours / 24)} days`;
    }

    /**
     * Generate optimization recommendations
     */
    generateRecommendations(analysis, skippable, parallelizable) {
        const recommendations = [];

        // Skipping recommendations
        if (skippable.length > 0) {
            recommendations.push({
                type: 'SKIP',
                priority: 'HIGH',
                message: `Skip ${skippable.length} unnecessary steps to save time`,
                steps: skippable.map(s => s.step)
            });
        }

        // Parallel execution recommendations
        if (parallelizable.length > 0) {
            const totalSteps = parallelizable.reduce((sum, g) => sum + g.steps.length, 0);
            recommendations.push({
                type: 'PARALLEL',
                priority: 'MEDIUM',
                message: `Run ${totalSteps} steps in parallel across ${parallelizable.length} groups`,
                groups: parallelizable.map(g => g.name)
            });
        }

        // Context-specific recommendations
        if (analysis.isSimpleTask) {
            recommendations.push({
                type: 'SIMPLIFY',
                priority: 'HIGH',
                message: 'Simple task detected - use lightweight workflow',
                suggestion: 'Consider using /build instead of /autopilot'
            });
        }

        if (analysis.isRefactorOnly) {
            recommendations.push({
                type: 'FOCUS',
                priority: 'MEDIUM',
                message: 'Refactor-only change - skip new feature tests',
                suggestion: 'Run regression tests only'
            });
        }

        return recommendations;
    }

    /**
     * Estimate time saved from optimizations
     */
    estimateTimeSaving(skippable, parallelizable) {
        // Rough estimates per step type (in seconds)
        const stepTimes = {
            'explorer-agent': 30,
            'design-system-generation': 45,
            'e2e-tests': 120,
            'security-audit': 60,
            'api-docs': 30,
            'staging-deploy': 90,
            'database-architect': 45,
            'security-auditor': 40,
            'backend-specialist': 60,
            'frontend-specialist': 90,
            'test-engineer': 60,
            'documentation-writer': 30
        };

        // Time saved from skipping
        let skipSaving = 0;
        for (const s of skippable) {
            skipSaving += stepTimes[s.step] || 30;
        }

        // Time saved from parallelization (assume 40% efficiency gain)
        let parallelSaving = 0;
        for (const group of parallelizable) {
            const groupTime = group.steps.reduce((sum, s) => sum + (stepTimes[s] || 30), 0);
            parallelSaving += groupTime * 0.4;
        }

        const totalSaving = skipSaving + parallelSaving;

        return {
            skipSaving: Math.round(skipSaving),
            parallelSaving: Math.round(parallelSaving),
            totalSaving: Math.round(totalSaving),
            formatted: this.formatDuration(totalSaving)
        };
    }

    /**
     * Estimate parallel execution gain
     */
    estimateParallelGain(steps) {
        return `~${Math.round(steps.length * 0.4 * 100)}% faster`;
    }

    /**
     * Format duration in human readable form
     */
    formatDuration(seconds) {
        if (seconds < 60) return `${seconds}s`;
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${minutes}m ${secs}s`;
    }

    /**
     * Generate optimized execution plan
     */
    generateExecutionPlan(skippable, parallelizable) {
        const skippedSet = new Set(skippable.map(s => s.step));
        const parallelMap = new Map();

        for (const group of parallelizable) {
            for (const step of group.steps) {
                parallelMap.set(step, group.name);
            }
        }

        const plan = {
            phases: [],
            currentPhase: null
        };

        // Group steps into phases
        for (const step of this.steps) {
            if (skippedSet.has(step)) {
                continue; // Skip this step
            }

            const parallelGroup = parallelMap.get(step);

            if (parallelGroup) {
                // Add to parallel group
                let phase = plan.phases.find(p => p.name === parallelGroup && p.type === 'parallel');
                if (!phase) {
                    phase = { name: parallelGroup, type: 'parallel', steps: [] };
                    plan.phases.push(phase);
                }
                phase.steps.push(step);
            } else {
                // Add as sequential step
                plan.phases.push({ name: step, type: 'sequential', steps: [step] });
            }
        }

        return plan;
    }

    /**
     * Format optimization report
     */
    formatReport(optimization) {
        const lines = [];

        lines.push('## 🚀 Workflow Optimization Report\n');
        lines.push(`**Original Steps:** ${optimization.original}`);
        lines.push(`**Optimized Steps:** ${optimization.optimized}`);
        lines.push(`**Estimated Time Saved:** ${optimization.estimatedTimeSaving.formatted}\n`);

        if (optimization.skippedSteps.length > 0) {
            lines.push('### ⏭️ Skipped Steps\n');
            lines.push('| Step | Reason |');
            lines.push('|------|--------|');
            for (const s of optimization.skippedSteps) {
                lines.push(`| ${s.step} | ${s.reason} |`);
            }
            lines.push('');
        }

        if (optimization.parallelGroups.length > 0) {
            lines.push('### ⚡ Parallel Execution\n');
            for (const g of optimization.parallelGroups) {
                lines.push(`**${g.name}:** ${g.steps.join(', ')} (${g.estimatedParallelGain})`);
            }
            lines.push('');
        }

        if (optimization.recommendations.length > 0) {
            lines.push('### 💡 Recommendations\n');
            for (const r of optimization.recommendations) {
                const icon = r.priority === 'HIGH' ? '🔴' : r.priority === 'MEDIUM' ? '🟡' : '🟢';
                lines.push(`${icon} **[${r.type}]** ${r.message}`);
            }
        }

        return lines.join('\n');
    }
}

/**
 * Quick optimization check
 */
export function quickOptimize(steps, context) {
    const workflow = new AdaptiveWorkflow({ steps });
    return workflow.optimize(context);
}

/**
 * CLI
 */
async function main() {
    const args = process.argv.slice(2);

    if (args[0] === '--demo') {
        // Demo with sample context
        const sampleContext = {
            complexity: 'standard',
            domains: ['frontend', 'backend'],
            type: 'feature',
            files: Array(20).fill('file.ts'),
            changes: ['api/users.ts', 'components/Form.tsx']
        };

        const sampleSteps = [
            'explorer-agent',
            'design-system-generation',
            'database-architect',
            'security-auditor',
            'backend-specialist',
            'frontend-specialist',
            'test-engineer',
            'documentation-writer',
            'security-audit',
            'staging-deploy'
        ];

        const workflow = new AdaptiveWorkflow({ steps: sampleSteps });
        const optimization = await workflow.optimize(sampleContext);

        console.log(workflow.formatReport(optimization));
        return;
    }

    console.log(`
Adaptive Workflow Engine

Usage:
  node adaptive-workflow.js --demo    Run demo with sample context

Programmatic usage:
  import { AdaptiveWorkflow, quickOptimize } from './adaptive-workflow.js';
  
  const workflow = new AdaptiveWorkflow({ steps: [...] });
  const optimization = await workflow.optimize(context);
  console.log(workflow.formatReport(optimization));
`);
}

// Run if executed directly
if (process.argv[1] === __filename) {
    main().catch(console.error);
}
