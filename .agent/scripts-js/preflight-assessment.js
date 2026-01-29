#!/usr/bin/env node
/**
 * Pre-Flight Assessment Module
 * 
 * Integrates with impact-assessor agent for risk evaluation before execution.
 * Used by /autopilot and other multi-phase workflows.
 * 
 * Usage:
 *   import { PreFlightAssessment } from './preflight-assessment.js';
 *   const assessment = new PreFlightAssessment(taskContext);
 *   const result = await assessment.evaluate();
 *   if (result.riskLevel === 'CRITICAL') { requireApproval(); }
 * 
 * @version 1.0.0
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Risk level thresholds
const RISK_LEVELS = {
    LOW: { min: 1.0, max: 2.0, action: 'PROCEED' },
    MEDIUM: { min: 2.1, max: 3.5, action: 'PROCEED_WITH_CAUTION' },
    HIGH: { min: 3.6, max: 4.5, action: 'EXTRA_CHECKPOINTS' },
    CRITICAL: { min: 4.6, max: 5.0, action: 'REQUIRE_APPROVAL' }
};

// Trigger patterns that require assessment
const ASSESSMENT_TRIGGERS = [
    { pattern: /database|schema|migration|prisma/i, risk: 'CRITICAL', reason: 'Database changes' },
    { pattern: /auth|login|password|jwt|token|security/i, risk: 'CRITICAL', reason: 'Auth system' },
    { pattern: /api|endpoint|route/i, risk: 'HIGH', reason: 'API contract change' },
    { pattern: /deploy|production|release/i, risk: 'HIGH', reason: 'Production deployment' },
    { pattern: /refactor|restructure|reorganize/i, risk: 'MEDIUM', reason: 'Code restructuring' },
    { pattern: /dependency|package|npm|upgrade/i, risk: 'MEDIUM', reason: 'Dependency changes' },
    { pattern: /config|environment|env/i, risk: 'MEDIUM', reason: 'Configuration changes' }
];

/**
 * Pre-Flight Assessment Class
 */
export class PreFlightAssessment {
    constructor(taskContext) {
        this.task = taskContext.task || '';
        this.domains = taskContext.domains || [];
        this.files = taskContext.files || [];
        this.agents = taskContext.agents || [];
        this.timestamp = Date.now();
    }

    /**
     * Evaluate risk based on task context
     */
    evaluate() {
        const triggers = this.detectTriggers();
        const fileRisk = this.assessFileRisk();
        const domainRisk = this.assessDomainRisk();

        const overallScore = this.calculateOverallRisk(triggers, fileRisk, domainRisk);
        const riskLevel = this.scoreToLevel(overallScore);

        return {
            timestamp: new Date().toISOString(),
            task: this.task,

            // Risk analysis
            riskLevel,
            riskScore: overallScore,
            action: RISK_LEVELS[riskLevel].action,

            // Triggers found
            triggers: triggers.map(t => ({
                pattern: t.reason,
                risk: t.risk
            })),

            // Impact scope
            impactScope: {
                filesAffected: this.files.length,
                domainsAffected: this.domains.length,
                agentsInvolved: this.agents.length
            },

            // Recommendations
            recommendations: this.generateRecommendations(riskLevel, triggers),

            // Checkpoints required
            checkpointsRequired: riskLevel === 'HIGH' || riskLevel === 'CRITICAL',

            // User approval required
            userApprovalRequired: riskLevel === 'CRITICAL'
        };
    }

    /**
     * Detect triggers from task description
     */
    detectTriggers() {
        const found = [];
        for (const trigger of ASSESSMENT_TRIGGERS) {
            if (trigger.pattern.test(this.task)) {
                found.push(trigger);
            }
        }
        return found;
    }

    /**
     * Assess risk based on file count
     */
    assessFileRisk() {
        const count = this.files.length;
        if (count > 20) return 5;
        if (count > 10) return 4;
        if (count > 5) return 3;
        if (count > 2) return 2;
        return 1;
    }

    /**
     * Assess risk based on domains involved
     */
    assessDomainRisk() {
        const criticalDomains = ['database', 'security', 'auth', 'payment'];
        const hasCritical = this.domains.some(d =>
            criticalDomains.some(cd => d.toLowerCase().includes(cd))
        );

        if (hasCritical) return 5;
        if (this.domains.length > 3) return 4;
        if (this.domains.length > 1) return 2;
        return 1;
    }

    /**
     * Calculate overall risk score
     */
    calculateOverallRisk(triggers, fileRisk, domainRisk) {
        // If critical/high triggers detected, they dominate the score
        if (triggers.length > 0) {
            const hasCritical = triggers.some(t => t.risk === 'CRITICAL');
            const hasHigh = triggers.some(t => t.risk === 'HIGH');
            const hasMedium = triggers.some(t => t.risk === 'MEDIUM');

            if (hasCritical) return 5.0;  // CRITICAL
            if (hasHigh) return 4.0;      // HIGH
            if (hasMedium) return 3.0;    // MEDIUM
        }

        // No triggers detected - use file and domain risk
        const combinedRisk = (fileRisk * 0.5) + (domainRisk * 0.5);
        return Math.min(5.0, Math.max(1.0, combinedRisk));
    }

    /**
     * Convert score to risk level
     */
    scoreToLevel(score) {
        for (const [level, config] of Object.entries(RISK_LEVELS)) {
            if (score >= config.min && score <= config.max) {
                return level;
            }
        }
        return 'LOW';
    }

    /**
     * Generate recommendations based on risk
     */
    generateRecommendations(riskLevel, triggers) {
        const recommendations = [];

        // Always recommend checkpoint for HIGH/CRITICAL
        if (riskLevel === 'HIGH' || riskLevel === 'CRITICAL') {
            recommendations.push({
                priority: 'REQUIRED',
                action: 'Create state checkpoint before execution',
                agent: 'recovery'
            });
        }

        // Specific trigger-based recommendations
        for (const trigger of triggers) {
            if (trigger.pattern.test(/database|schema/i)) {
                recommendations.push({
                    priority: 'REQUIRED',
                    action: 'Backup database before migration',
                    agent: 'recovery'
                });
            }
            if (trigger.pattern.test(/auth|security/i)) {
                recommendations.push({
                    priority: 'RECOMMENDED',
                    action: 'Run security scan before and after',
                    agent: 'security-auditor'
                });
            }
            if (trigger.pattern.test(/api|endpoint/i)) {
                recommendations.push({
                    priority: 'RECOMMENDED',
                    action: 'Review API contract changes',
                    agent: 'backend-specialist'
                });
            }
        }

        // Learning recommendation
        recommendations.push({
            priority: 'STANDARD',
            action: 'Log outcome to lessons-learned after completion',
            agent: 'learner'
        });

        return recommendations;
    }

    /**
     * Format assessment for display
     */
    formatReport() {
        const result = this.evaluate();

        const statusIcon = {
            LOW: '✅',
            MEDIUM: '⚠️',
            HIGH: '🔶',
            CRITICAL: '🔴'
        }[result.riskLevel];

        return `
## Pre-Flight Assessment ${statusIcon}

**Task:** ${this.task}  
**Risk Level:** ${result.riskLevel} (${result.riskScore.toFixed(1)}/5.0)  
**Action:** ${result.action}

### Impact Scope

| Dimension | Count |
|-----------|-------|
| Files | ${result.impactScope.filesAffected} |
| Domains | ${result.impactScope.domainsAffected} |
| Agents | ${result.impactScope.agentsInvolved} |

### Triggers Detected

${result.triggers.length > 0
                ? result.triggers.map(t => `- **${t.risk}**: ${t.pattern}`).join('\n')
                : '- None detected'}

### Recommendations

${result.recommendations.map(r => `- **[${r.priority}]** ${r.action} → \`${r.agent}\``).join('\n')}

${result.userApprovalRequired
                ? '> 🔴 **User approval required before proceeding**'
                : ''}
${result.checkpointsRequired
                ? '> 📸 **State checkpoint required before execution**'
                : ''}
`.trim();
    }
}

/**
 * Quick risk check for a task string
 */
export function quickRiskCheck(taskDescription) {
    const assessment = new PreFlightAssessment({
        task: taskDescription,
        domains: [],
        files: [],
        agents: []
    });

    const result = assessment.evaluate();
    return {
        riskLevel: result.riskLevel,
        requiresAssessment: result.riskLevel !== 'LOW',
        requiresApproval: result.userApprovalRequired
    };
}

/**
 * CLI for testing
 */
async function main() {
    const args = process.argv.slice(2);

    if (args.length === 0) {
        console.log(`
Pre-Flight Assessment Module

Usage:
  node preflight-assessment.js "<task description>"
  node preflight-assessment.js --test

Examples:
  node preflight-assessment.js "refactor user authentication"
  node preflight-assessment.js "add new button component"
  node preflight-assessment.js "deploy to production"
`);
        return;
    }

    if (args[0] === '--test') {
        runTests();
        return;
    }

    const task = args.join(' ');
    const assessment = new PreFlightAssessment({
        task,
        domains: ['frontend', 'backend'],
        files: Array(5).fill('file.ts'),
        agents: ['frontend-specialist', 'test-engineer']
    });

    console.log(assessment.formatReport());
}

function runTests() {
    console.log('Running Pre-Flight Assessment Tests...\n');

    const testCases = [
        { task: 'add new button', expected: 'LOW' },
        { task: 'update npm packages', expected: 'MEDIUM' },
        { task: 'refactor API endpoints', expected: 'HIGH' },
        { task: 'modify database schema', expected: 'CRITICAL' },
        { task: 'fix login authentication bug', expected: 'CRITICAL' }
    ];

    for (const test of testCases) {
        const check = quickRiskCheck(test.task);
        const status = check.riskLevel === test.expected ? '✅' : '❌';
        console.log(`${status} "${test.task}" → ${check.riskLevel} (expected: ${test.expected})`);
    }
}

// Run if executed directly
if (process.argv[1] === __filename) {
    main().catch(console.error);
}
