/**
 * @fileoverview Intelligent Routing UI for Agent Skill Kit
 * FAANG-level professional agent display with Clack UI
 */

import * as p from "@clack/prompts";
import pc from "picocolors";

// ============================================================================
// CLACK SYMBOLS
// ============================================================================

const S = {
    BAR: "│",
    BAR_END: "└",
    CORNER_TOP_RIGHT: "╮",
    CORNER_BOTTOM_RIGHT: "╯",
    STEP_ACTIVE: "◆",
    STEP_SUBMIT: "◇",
    RADIO_ACTIVE: "●",
    RADIO_INACTIVE: "○",
    CONNECT_LEFT: "├",
    H_LINE: "─"
};

// ============================================================================
// AGENT BRANDING
// ============================================================================

const AGENT_EMOJI = "🤖";

const COMPLEXITY_CONFIG = {
    "SIMPLE": {
        color: pc.green,
        icon: S.RADIO_ACTIVE,
        label: "Focused",
        description: "Single specialist engaged"
    },
    "MODERATE": {
        color: pc.yellow,
        icon: `${S.RADIO_ACTIVE}${S.RADIO_ACTIVE}`,
        label: "Collaborative",
        description: "Multi-specialist coordination"
    },
    "COMPLEX": {
        color: pc.red,
        icon: `${S.RADIO_ACTIVE}${S.RADIO_ACTIVE}${S.RADIO_ACTIVE}`,
        label: "Full Stack",
        description: "Complete team mobilized"
    }
};

// FAANG-level professional messages
const ROUTING_MESSAGES = {
    simple: [
        "Specialist locked in",
        "Expert matched to your task",
        "Best-fit agent selected",
        "Precision routing complete"
    ],
    moderate: [
        "Cross-functional team assembled",
        "Specialists synchronized",
        "Multi-domain expertise activated",
        "Collaborative intelligence engaged"
    ],
    complex: [
        "Full engineering squad deployed",
        "Maximum capability unlocked",
        "Enterprise-grade orchestration",
        "Complete specialist coverage"
    ]
};

// ============================================================================
// CORE FUNCTIONS
// ============================================================================

/**
 * Get icon for an agent
 * @param {string} agentName 
 * @param {boolean} isMain - Is this the main/first agent?
 * @returns {string}
 */
function getAgentIcon(agentName, isMain = false) {
    if (isMain || agentName === "orchestrator") {
        return S.STEP_ACTIVE;
    }
    return S.STEP_SUBMIT;
}

/**
 * Format agent names with professional styling
 * @param {string[]} agents - List of agent names
 * @returns {string}
 */
function formatAgents(agents) {
    if (!agents || agents.length === 0) return pc.dim("analyzing...");

    return agents
        .map((agent, index) => {
            const icon = getAgentIcon(agent, index === 0);
            const name = `@${agent}`;
            const colorFn = index === 0 ? pc.cyan : pc.blue;
            return `${colorFn(icon)} ${pc.bold(colorFn(name))}`;
        })
        .join(pc.dim("  →  "));
}

/**
 * Format domains with professional styling
 * @param {string[]} domains 
 * @returns {string}
 */
function formatDomains(domains) {
    if (!domains || domains.length === 0) return pc.dim("general");
    return domains.map(d => pc.magenta(d)).join(pc.dim(" · "));
}

/**
 * Get random message from array
 * @param {string[]} messages 
 * @returns {string}
 */
function getRandomMessage(messages) {
    return messages[Math.floor(Math.random() * messages.length)];
}

/**
 * Show routing result using Clack native styling
 * @param {object} routing - Routing result object
 */
export function showRoutingResult(routing) {
    const { selectedAgents = [], domains = [], complexity = "SIMPLE", reasoning } = routing;

    const config = COMPLEXITY_CONFIG[complexity] || COMPLEXITY_CONFIG.SIMPLE;

    // Build content lines
    const lines = [];
    lines.push(`${pc.dim("Agents")}     ${formatAgents(selectedAgents)}`);
    lines.push(`${pc.dim("Domains")}    ${formatDomains(domains)}`);
    lines.push(`${pc.dim("Mode")}       ${config.color(config.icon)} ${config.color(config.label)}`);

    if (reasoning) {
        lines.push("");
        lines.push(`${pc.dim("→")} ${pc.italic(reasoning)}`);
    }

    // Use Clack's native note for consistent styling
    p.note(lines.join("\n"), `${AGENT_EMOJI} Agent Routing`);
}

/**
 * Show compact inline routing info
 * @param {string[]} selectedAgents 
 */
export function showRoutingInline(selectedAgents) {
    const formatted = selectedAgents
        .map((agent, i) => `${getAgentIcon(agent, i === 0)} ${pc.cyan(`@${agent}`)}`)
        .join(pc.dim("  →  "));

    console.log("");
    console.log(`${pc.gray(S.BAR)}`);
    console.log(`${pc.cyan(S.STEP_ACTIVE)}  ${AGENT_EMOJI} ${pc.bold("Engaging")} ${formatted}`);
}

/**
 * Show routing with Clack log message style
 * @param {object} routing 
 */
export function showRoutingLog(routing) {
    const { selectedAgents = [], complexity = "SIMPLE" } = routing;
    const config = COMPLEXITY_CONFIG[complexity] || COMPLEXITY_CONFIG.SIMPLE;

    const agentList = selectedAgents
        .map((a, i) => `${getAgentIcon(a, i === 0)} @${a}`)
        .join(" → ");

    p.log.info(`${AGENT_EMOJI} ${pc.bold("Routing:")} ${pc.cyan(agentList)} ${config.color(`[${config.label}]`)}`);
}

/**
 * Show routing step (for multi-step flows)
 * @param {string} agent - Agent name
 * @param {string} status - active | complete | pending
 */
export function showRoutingStep(agent, status = "active") {
    const icons = {
        active: pc.cyan(S.STEP_ACTIVE),
        complete: pc.green(S.STEP_SUBMIT),
        pending: pc.dim(S.RADIO_INACTIVE)
    };

    const labels = {
        active: pc.cyan("working"),
        complete: pc.green("done"),
        pending: pc.dim("queued")
    };

    const icon = icons[status] || icons.pending;
    const label = labels[status] || labels.pending;
    const name = status === "active" ? pc.bold(pc.cyan(`@${agent}`)) : pc.dim(`@${agent}`);

    console.log(`${pc.gray(S.BAR)}  ${icon}  ${name} ${pc.dim("·")} ${label}`);
}

/**
 * Analyze request and show routing decision
 * @param {string} userRequest - The user's request text
 * @returns {object} - The routing decision
 */
export function analyzeAndShowRouting(userRequest) {
    // Domain detection patterns
    const patterns = {
        "security": /auth|login|password|jwt|token|vulnerability|security|encrypt/i,
        "frontend": /component|react|vue|css|html|tailwind|button|layout|style|ui/i,
        "backend": /api|endpoint|server|express|route|post|get|database/i,
        "mobile": /react native|flutter|ios|android|mobile|expo|screen/i,
        "database": /prisma|sql|mongodb|schema|migration|table|query/i,
        "testing": /test|jest|vitest|playwright|coverage|e2e/i,
        "debug": /error|bug|crash|not working|broken|fix/i,
        "performance": /slow|optimize|performance|speed|cache/i,
        "analysis": /analyze|review|refactor|clean|improve|upgrade/i
    };

    // Detect domains
    const domains = [];
    for (const [domain, pattern] of Object.entries(patterns)) {
        if (pattern.test(userRequest)) {
            domains.push(domain);
        }
    }

    // Determine complexity
    let complexity = "SIMPLE";
    let messagePool = ROUTING_MESSAGES.simple;

    if (domains.length >= 3) {
        complexity = "COMPLEX";
        messagePool = ROUTING_MESSAGES.complex;
    } else if (domains.length === 2) {
        complexity = "MODERATE";
        messagePool = ROUTING_MESSAGES.moderate;
    }

    // Select agents based on domains
    const agentMap = {
        "security": "security-auditor",
        "frontend": "frontend-specialist",
        "backend": "backend-specialist",
        "mobile": "mobile-developer",
        "database": "database-architect",
        "testing": "test-engineer",
        "debug": "debugger",
        "performance": "performance-optimizer",
        "analysis": "code-archaeologist"
    };

    let selectedAgents = domains.map(d => agentMap[d] || "orchestrator");

    // If complex or no agents, add orchestrator
    if (complexity === "COMPLEX" || selectedAgents.length === 0) {
        selectedAgents = ["orchestrator", ...selectedAgents];
    }

    // Remove duplicates
    selectedAgents = [...new Set(selectedAgents)];

    const routing = {
        selectedAgents,
        domains,
        complexity,
        reasoning: getRandomMessage(messagePool)
    };

    // Show the routing result
    showRoutingResult(routing);

    return routing;
}

/**
 * Show agent intro message
 * @param {string} message - Custom message
 */
export function showAgentIntro(message = "Ready to assist") {
    p.intro(`${AGENT_EMOJI} ${pc.bold(message)}`);
}

/**
 * Show agent outro message
 * @param {string} message - Custom message
 */
export function showAgentOutro(message = "Task complete") {
    p.outro(`${AGENT_EMOJI} ${pc.green(message)}`);
}

/**
 * Show agent thinking indicator
 * @param {string} action - What the agent is doing
 */
export function showAgentThinking(action = "Analyzing") {
    console.log(`${pc.gray(S.BAR)}`);
    console.log(`${pc.cyan(S.STEP_ACTIVE)}  ${AGENT_EMOJI} ${pc.dim(action)}...`);
}

// ============================================================================
// EXPORTS
// ============================================================================

export default {
    showRoutingResult,
    showRoutingInline,
    showRoutingLog,
    showRoutingStep,
    analyzeAndShowRouting,
    showAgentIntro,
    showAgentOutro,
    showAgentThinking,
    getAgentIcon,
    AGENT_EMOJI,
    S,
    COMPLEXITY_CONFIG,
    ROUTING_MESSAGES
};
