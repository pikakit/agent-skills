/**
 * @fileoverview Help command
 */

import { step, stepLine, S, c, select, isCancel, cancel } from "../ui.js";
import { VERSION } from "../config.js";

/**
 * Show interactive help menu
 */
export async function run() {
  let running = true;

  while (running) {

    const choice = await select({
      message: "Select a topic",
      options: [
        { value: "commands", label: "Commands", hint: "View all available commands" },
        { value: "options", label: "Options", hint: "View all flags and options" },
        { value: "quickstart", label: "Quick Start", hint: "Get started quickly" },
        { value: "exit", label: "Exit", hint: "Close help" }
      ]
    });

    if (isCancel(choice) || choice === "exit") {
      stepLine();
      step("Goodbye!");
      stepLine();
      return;
    }

    stepLine();

    switch (choice) {
      case "commands":
        await showCommands();
        break;
      case "options":
        showOptions();
        break;
      case "quickstart":
        showQuickStart();
        break;
    }

    stepLine();

    // Ask what to do next
    const next = await select({
      message: "What's next?",
      options: [
        { value: "back", label: "Back to menu", hint: "See other topics" },
        { value: "exit", label: "Exit", hint: "Close help" }
      ]
    });

    if (isCancel(next) || next === "exit") {
      stepLine();
      step("Goodbye!");
      stepLine();
      running = false;
    }
  }
}

async function showCommands() {
  step(c.bold("Available Commands"), S.diamondFilled, "cyan");
  stepLine();

  step(c.cyan("<org/repo>") + c.dim("          Install all skills from repository"));
  step(c.dim("Example: kit pikakit/agent-skills"));
  stepLine();

  step(c.cyan("<org/repo#skill>") + c.dim("    Install specific skill"));
  step(c.dim("Example: kit pikakit/agent-skills#react-patterns"));
  stepLine();

  step(c.cyan("list") + c.dim("                List installed skills"));
  step(c.cyan("uninstall") + c.dim("          Remove skill(s) (interactive)"));
  step(c.cyan("uninstall all") + c.dim("       Remove everything (automatic)"));
  step(c.cyan("update <skill>") + c.dim("      Update a skill"));
  step(c.cyan("verify") + c.dim("              Verify checksums"));
  step(c.cyan("doctor") + c.dim("              Check health"));
  step(c.cyan("lock") + c.dim("                Generate skill-lock.json"));
  step(c.cyan("init") + c.dim("                Initialize skills directory"));
  step(c.cyan("validate [skill]") + c.dim("    Validate against Antigravity spec"));
  step(c.cyan("analyze <skill>") + c.dim("     Analyze skill structure"));
  step(c.cyan("cache [info|clear]") + c.dim("  Manage cache"));
  step(c.cyan("info <skill>") + c.dim("        Show skill info"));

  stepLine();

  // Interactive command selection
  const executeCmd = await select({
    message: "Execute a command?",
    options: [
      { value: "list", label: "list", hint: "List installed skills" },
      { value: "doctor", label: "doctor", hint: "Check health" },
      { value: "verify", label: "verify", hint: "Verify checksums" },
      { value: "uninstall", label: "uninstall", hint: "Interactive removal" },
      { value: "lock", label: "lock", hint: "Generate lockfile" },
      { value: "init", label: "init", hint: "Initialize directory" },
      { value: "none", label: "← Back", hint: "Return to topics" }
    ]
  });

  if (!isCancel(executeCmd) && executeCmd !== "none") {
    stepLine();
    step(c.cyan(`Running: kit ${executeCmd}`));
    stepLine();

    // Dynamic import and execute command
    try {
      const commandModule = await import(`./${executeCmd}.js`);
      await commandModule.run();
    } catch (err) {
      step(c.red(`Command not yet implemented: ${executeCmd}`));
    }
  }
}

function showOptions() {
  step(c.bold("Available Options"), S.diamondFilled, "cyan");
  stepLine();

  step(c.cyan("--global, -g") + c.dim("        Use global scope (~/.gemini)"));
  step(c.cyan("--force, -f") + c.dim("         Force operation without confirmation"));
  step(c.cyan("--strict") + c.dim("            Fail on any violations"));
  step(c.cyan("--fix") + c.dim("               Auto-fix issues (e.g., checksums)"));
  step(c.cyan("--dry-run") + c.dim("           Preview changes without executing"));
  step(c.cyan("--verbose, -v") + c.dim("       Show detailed output"));
  step(c.cyan("--json") + c.dim("              Output in JSON format"));
}

function showQuickStart() {
  step(c.bold("Quick Start Guide"), S.diamondFilled, "cyan");
  stepLine();

  step(c.bold("1. Install skills"));
  step("   " + c.cyan("kit pikakit/agent-skills"));
  stepLine();

  step(c.bold("2. Choose scope"));
  step("   " + c.dim("→ Current Project (local .agent/)"));
  step("   " + c.dim("→ Global System (available everywhere)"));
  stepLine();

  step(c.bold("3. Check installation"));
  step("   " + c.cyan("kit doctor"));
  stepLine();

  step(c.bold("4. Use in your AI"));
  step("   " + c.dim("Skills are now available in .agent/skills/"));
}
