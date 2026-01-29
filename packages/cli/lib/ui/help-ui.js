/**
 * Help/Guide UI - Ultra Compact
 */
import * as p from "@clack/prompts";
import pc from "picocolors";

export async function runHelpUI() {
  process.stdout.write('\x1Bc');
  p.intro(pc.cyan("📖 Quick Guide"));

  const guide = [
    `${pc.bold(" Lessons")}   View/edit learned patterns`,
    `${pc.bold("💡 Insights")}  Stats & top violations`,
    `${pc.bold("⚙️  Settings")} Auto-learn, threshold`,
    `${pc.bold("💾 Backup")}    Export/import data`,
    ``,
    `${pc.dim("Agent Coding → learns mistakes → warns you")}`
  ].join('\n');

  p.note(guide, "Menu");

  await p.select({
    message: "",
    options: [{ value: "back", label: "← Back" }]
  });
}
