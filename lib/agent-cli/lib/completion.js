/**
 * @fileoverview Shell completion scripts generator
 * Supports PowerShell, Bash, and Zsh
 */

/**
 * All available commands for completion
 */
const COMMANDS = [
    { name: "learn", description: "Teach a new pattern" },
    { name: "recall", description: "Scan for violations" },
    { name: "stats", description: "View statistics" },
    { name: "audit", description: "Run compliance check" },
    { name: "watch", description: "Real-time monitoring" },
    { name: "settings", description: "Configure agent behavior" },
    { name: "backup", description: "Backup & restore data" },
    { name: "export", description: "Export & import data" },
    { name: "proposals", description: "AI agent skill updates" },
    { name: "completion", description: "Shell completion scripts" },
    { name: "init", description: "Initialize agent config" },
    { name: "help", description: "Show help" }
];

/**
 * Generate PowerShell completion script
 * @returns {string}
 */
export function generatePowerShellCompletion() {
    const commands = COMMANDS.map(c => `'${c.name}'`).join(", ");

    return `
# PikaKit PowerShell Completion
# Add to your $PROFILE

Register-ArgumentCompleter -Native -CommandName agent -ScriptBlock {
    param($wordToComplete, $commandAst, $cursorPosition)
    
    $commands = @(
${COMMANDS.map(c => `        @{ Name = '${c.name}'; Description = '${c.description}' }`).join("\n")}
    )
    
    $commands | Where-Object { $_.Name -like "$wordToComplete*" } | ForEach-Object {
        [System.Management.Automation.CompletionResult]::new(
            $_.Name,
            $_.Name,
            'ParameterValue',
            $_.Description
        )
    }
}

Write-Host "PikaKit completion loaded" -ForegroundColor Green
`;
}

/**
 * Generate Bash completion script
 * @returns {string}
 */
export function generateBashCompletion() {
    const commands = COMMANDS.map(c => c.name).join(" ");

    return `
# PikaKit Bash Completion
# Add to ~/.bashrc or ~/.bash_completion

_agent_completions() {
    local cur="\${COMP_WORDS[COMP_CWORD]}"
    local commands="${commands}"
    
    COMPREPLY=($(compgen -W "$commands" -- "$cur"))
}

complete -F _agent_completions agent

echo "PikaKit completion loaded"
`;
}

/**
 * Generate Zsh completion script
 * @returns {string}
 */
export function generateZshCompletion() {
    return `
#compdef agent

# PikaKit Zsh Completion
# Add to ~/.zshrc or place in $fpath

_agent() {
    local -a commands
    commands=(
${COMMANDS.map(c => `        '${c.name}:${c.description}'`).join("\n")}
    )
    
    _describe 'command' commands
}

compdef _agent agent

echo "PikaKit completion loaded"
`;
}

/**
 * Get shell type from environment
 * @returns {string} 'powershell' | 'bash' | 'zsh' | 'unknown'
 */
export function detectShell() {
    if (process.platform === "win32") {
        return "powershell";
    }

    const shell = process.env.SHELL || "";
    if (shell.includes("zsh")) return "zsh";
    if (shell.includes("bash")) return "bash";

    return "unknown";
}

/**
 * Get completion script for current or specified shell
 * @param {string} [shell] - Optional shell type
 * @returns {{ shell: string, script: string }}
 */
export function getCompletionScript(shell) {
    const targetShell = shell || detectShell();

    switch (targetShell) {
        case "powershell":
            return { shell: "powershell", script: generatePowerShellCompletion() };
        case "bash":
            return { shell: "bash", script: generateBashCompletion() };
        case "zsh":
            return { shell: "zsh", script: generateZshCompletion() };
        default:
            return { shell: "unknown", script: "" };
    }
}

export default {
    COMMANDS,
    generatePowerShellCompletion,
    generateBashCompletion,
    generateZshCompletion,
    detectShell,
    getCompletionScript
};
