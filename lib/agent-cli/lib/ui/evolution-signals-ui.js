/**
 * Evolution Signals UI - View and manage pending evolution signals
 */
import * as p from "@clack/prompts";
import pc from "picocolors";
import { signalQueue, getEvolutionStats, reviewGate } from "../evolution-signal.js";
import { loadKnowledge } from "../recall.js";
import { loadSettings } from "../settings.js";

/**
 * Show pending evolution signals
 */
export async function runEvolutionSignalsUI() {
    p.intro("📡 Evolution Signals");

    const pending = signalQueue.getPending();
    const stats = getEvolutionStats();

    // Show summary
    p.note(
        `Pending: ${pc.yellow(stats.pending)}\n` +
        `Approved: ${pc.green(stats.approved)}\n` +
        `Rejected: ${pc.red(stats.rejected)}\n` +
        `Executed: ${pc.cyan(stats.executed)}`,
        "📊 Signal Queue Status"
    );

    if (pending.length === 0) {
        p.note(pc.dim("No pending evolution signals"), "✅ All Clear");
        return;
    }

    // Load lessons for context
    const db = loadKnowledge();
    const settings = loadSettings();

    // Display pending signals with details
    const signalChoices = pending.map(signal => {
        const lesson = db.lessons.find(l => l.id === signal.lessonId);
        const lessonName = lesson ? lesson.id : signal.lessonId;
        const gate = reviewGate(signal, {
            autoUpdating: settings.autoUpdating,
            confidenceThreshold: 0.8
        });

        return {
            value: signal.id,
            label: `${pc.yellow('●')} ${lessonName}`,
            hint: `${signal.reason} · confidence: ${(signal.confidence * 100).toFixed(0)}% ${gate.shouldAuto ? pc.green('(auto-eligible)') : pc.dim('(review)')}`
        };
    });

    const action = await p.select({
        message: "Pending Evolution Signals",
        options: [
            ...signalChoices,
            { value: "back", label: "← Back" }
        ]
    });

    if (p.isCancel(action) || action === "back") {
        return;
    }

    // Show signal details
    const signal = pending.find(s => s.id === action);
    if (!signal) return;

    const lesson = db.lessons.find(l => l.id === signal.lessonId);

    p.note(
        `${pc.bold('Lesson:')} ${signal.lessonId}\n` +
        `${pc.bold('Reason:')} ${signal.reason}\n` +
        `${pc.bold('Confidence:')} ${(signal.confidence * 100).toFixed(0)}%\n` +
        `${pc.bold('Created:')} ${new Date(signal.createdAt).toLocaleString()}\n\n` +
        `${pc.bold('Current Stats:')}\n` +
        `  Hit Count: ${lesson?.hitCount || 0}\n` +
        `  Maturity: ${lesson?.cognitive?.maturity || 'unknown'}\n` +
        `  Intent: ${lesson?.intent || 'unknown'}\n\n` +
        `${pc.bold('Metadata:')}\n` +
        `  Trigger: ${signal.metadata.triggerEvent}\n` +
        `  File: ${signal.metadata.file || 'N/A'}`,
        "🔍 Signal Details"
    );

    // Action options
    const signalAction = await p.select({
        message: "What would you like to do?",
        options: [
            { value: "approve", label: "✅ Approve", hint: "Mark for evolution" },
            { value: "reject", label: "❌ Reject", hint: "Dismiss this signal" },
            { value: "back", label: "← Back" }
        ]
    });

    if (p.isCancel(signalAction) || signalAction === "back") {
        return;
    }

    if (signalAction === "approve") {
        signalQueue.approve(signal.id);
        p.note(pc.green(`✅ Signal approved for [${signal.lessonId}]`));
    } else if (signalAction === "reject") {
        signalQueue.reject(signal.id);
        p.note(pc.red(`❌ Signal rejected for [${signal.lessonId}]`));
    }
}
