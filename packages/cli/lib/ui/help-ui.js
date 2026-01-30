/**
 * Help/Guide UI - Compact Visual Guide
 */
import * as p from "@clack/prompts";
import pc from "picocolors";

/**
 * Show compact visual guide (fits in one screen)
 */
export async function runHelpUI() {
  // Clear terminal và reset cursor về top-left
  process.stdout.write('\x1Bc'); // Full terminal reset

  p.intro(pc.cyan("📖 Agent Skill Kit - Quick Guide"));

  console.log(`
${pc.bold(pc.yellow("🎯 HOW IT WORKS"))}
  ${pc.green("Write Code")} → ${pc.yellow("Agent Scans")} → ${pc.blue("Learns Patterns")} → ${pc.magenta("Auto Warns")}

${pc.bold(pc.yellow("🔧 MENU OPTIONS"))}
  ${pc.cyan("🔎 Scan All")}     - Check violations + option to auto-fix
  ${pc.cyan("📝 Learn")}        - Teach agent new patterns (manual mode only)
  ${pc.cyan("📚 Knowledge")}    - View lessons & review pending patterns
  ${pc.cyan("📊 Stats")}        - Project metrics & insights
  ${pc.cyan("⚙️  Settings")}    - Configure auto-learning, API keys
  ${pc.cyan("💾 Backup")}       - Manage knowledge backups

${pc.bold(pc.yellow("🚀 QUICK START"))}
  ${pc.bold("1.")} ${pc.cyan("Scan All")} ${pc.dim("→ See current violations")}
  ${pc.bold("2.")} ${pc.cyan("Fix All")} ${pc.dim("→ Auto-fix simple issues")}
  ${pc.bold("3.")} ${pc.cyan("Knowledge")} ${pc.dim("→ Review what agent learned")}

${pc.green("✓")} Agent learns from your code automatically
${pc.green("✓")} All fixes are backed up safely
${pc.green("✓")} The more you use it, the smarter it gets!
`);

  // User selects next action
  const action = await p.select({
    message: "What's next?",
    options: [
      { value: "back", label: "← Back to Main Menu" }
    ]
  });

  if (!p.isCancel(action)) {
    p.outro(pc.cyan("👋 Returning to menu"));
  }
}
