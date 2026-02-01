#!/usr/bin/env node
/**
 * Demo: FAANG-level Agent Routing UI
 * Run: node packages/agent/lib/ui/routing-demo.js
 */

import {
    showRoutingResult,
    showRoutingInline,
    showRoutingLog,
    showRoutingStep,
    analyzeAndShowRouting,
    showAgentIntro,
    showAgentOutro,
    showAgentThinking
} from "./routing-ui.js";
import * as p from "@clack/prompts";
import pc from "picocolors";

showAgentIntro("Agent Routing Demo");

// Demo 1: Focused (Single specialist)
p.log.step("1. Focused Mode — Single Specialist");
showRoutingResult({
    selectedAgents: ["frontend-specialist"],
    domains: ["frontend"],
    complexity: "SIMPLE",
    reasoning: "Expert matched to your task"
});

// Demo 2: Collaborative (Multi-specialist)
p.log.step("2. Collaborative Mode — Multi-specialist");
showRoutingResult({
    selectedAgents: ["security-auditor", "backend-specialist"],
    domains: ["security", "backend"],
    complexity: "MODERATE",
    reasoning: "Cross-functional team assembled"
});

// Demo 3: Full Stack (Complete team)
p.log.step("3. Full Stack Mode — Complete Team");
showRoutingResult({
    selectedAgents: ["orchestrator", "frontend-specialist", "backend-specialist", "database-architect"],
    domains: ["frontend", "backend", "database"],
    complexity: "COMPLEX",
    reasoning: "Enterprise-grade orchestration"
});

// Demo 4: Inline engagement
p.log.step("4. Inline Engagement");
showRoutingInline(["orchestrator", "code-archaeologist"]);
console.log(`${pc.gray("│")}  ${pc.dim("Your response continues here...")}`);
console.log("");

// Demo 5: Log style
p.log.step("5. Log Message Style");
showRoutingLog({
    selectedAgents: ["debugger", "test-engineer"],
    complexity: "MODERATE"
});

// Demo 6: Multi-step flow
p.log.step("6. Multi-step Agent Flow");
console.log(`${pc.gray("│")}`);
showRoutingStep("orchestrator", "complete");
showRoutingStep("security-auditor", "active");
showRoutingStep("backend-specialist", "pending");
console.log(`${pc.gray("│")}`);

// Demo 7: Agent thinking
p.log.step("7. Agent Thinking Indicator");
showAgentThinking("Processing your request");
console.log(`${pc.gray("│")}`);

// Demo 8: Auto-analysis
p.log.step("8. Auto-analysis from Request");
analyzeAndShowRouting("Implement secure OAuth2 login with React frontend and PostgreSQL database");

showAgentOutro("Demo complete");
