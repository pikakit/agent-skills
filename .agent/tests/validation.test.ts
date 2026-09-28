import test from 'node:test';
import assert from 'node:assert/strict';
import { access, mkdtemp, mkdir, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import {
    createCheckResult,
    formatJsonOutput,
    getReportVerdict,
    summarizeResults
} from '../scripts/utils/reporter.ts';
import { runScript, ScriptTimeoutError } from '../scripts/utils/runner.ts';
import { auditWorkflowContent, auditWorkflows, main as workflowAuditMain } from '../scripts/audit_workflows.ts';
import { auditSkill, main as skillAuditMain } from '../scripts/skill-audit.ts';
import { main as checklistMain } from '../scripts/checklist.ts';
import { main as verifyMain } from '../scripts/verify_all.ts';

const passed = createCheckResult({ name: 'pass', status: 'passed', required: true });
const skipped = createCheckResult({ name: 'skip', status: 'skipped', required: false, reason: 'not_configured' });
const failed = createCheckResult({ name: 'fail', status: 'failed', required: false, exitCode: 1 });
const error = createCheckResult({ name: 'error', status: 'error', required: true, reason: 'required_script_missing' });

test('report verdict distinguishes pass, failure, incomplete, and all-skipped', () => {
    assert.deepEqual(getReportVerdict([passed]), { status: 'passed', exitCode: 0 });
    assert.deepEqual(getReportVerdict([passed, skipped]), { status: 'passed_with_skips', exitCode: 0 });
    assert.deepEqual(getReportVerdict([passed, failed]), { status: 'failed', exitCode: 1 });
    assert.deepEqual(getReportVerdict([passed, error]), { status: 'incomplete', exitCode: 2 });
    assert.deepEqual(getReportVerdict([skipped]), { status: 'incomplete', exitCode: 2 });

    const summary = summarizeResults([passed, skipped, failed, error]);
    assert.deepEqual(
        { passed: summary.passed, skipped: summary.skipped, failed: summary.failed, errors: summary.errors },
        { passed: 1, skipped: 1, failed: 1, errors: 1 }
    );
});

test('JSON report preserves compatibility fields and adds explicit status', () => {
    const parsed = JSON.parse(formatJsonOutput([passed, skipped], 'C:/project', null, new Date())) as {
        schema_version: string;
        summary: { total: number; passed: number; skipped: number; verdict: string; exit_code: number; deployment_ready: boolean };
        results: Array<{ status: string; passed: boolean; skipped: boolean; required: boolean; duration_ms: number; stdout: string; stderr: string }>;
    };
    assert.equal(parsed.schema_version, '1.0.0');
    assert.equal(parsed.summary.total, 2);
    assert.equal(parsed.summary.passed, 1);
    assert.equal(parsed.summary.skipped, 1);
    assert.equal(parsed.summary.verdict, 'passed_with_skips');
    assert.equal(parsed.summary.exit_code, 0);
    assert.equal(parsed.summary.deployment_ready, false);
    assert.deepEqual(
        parsed.results.map(result => [result.status, result.passed, result.skipped, result.required]),
        [['passed', true, false, true], ['skipped', false, true, false]]
    );
    assert.ok(parsed.results.every(result =>
        typeof result.duration_ms === 'number'
        && typeof result.stdout === 'string'
        && typeof result.stderr === 'string'
    ));
});

test('runner passes arguments literally without a shell and reports exit codes', async () => {
    const directory = await mkdtemp(join(tmpdir(), 'pikakit-runner-'));
    const spacedDirectory = join(directory, 'path with spaces');
    await mkdir(spacedDirectory);
    const echoScript = join(spacedDirectory, 'echo.mjs');
    const failScript = join(directory, 'fail.mjs');
    await writeFile(echoScript, 'console.log(JSON.stringify(process.argv.slice(2)));\n', 'utf8');
    await writeFile(failScript, 'console.error("expected failure"); process.exitCode = 1;\n', 'utf8');

    const result = await runScript(echoScript, ['hello world', '& echo injected'], { cwd: directory });
    assert.equal(result.code, 0);
    assert.deepEqual(JSON.parse(result.stdout.trim()), ['hello world', '& echo injected']);

    const failure = await runScript(failScript, [], { cwd: directory });
    assert.equal(failure.code, 1);
    assert.equal(failure.passed, false);
    assert.match(failure.stderr, /expected failure/);

    await assert.rejects(runScript(join(directory, 'missing.bin'), [], { cwd: directory }), /ENOENT/);
});

test('runner timeout settles with a typed timeout error', async () => {
    const directory = await mkdtemp(join(tmpdir(), 'pikakit-timeout-'));
    const script = join(directory, 'hang.mjs');
    await writeFile(script, 'setInterval(() => {}, 1000);\n', 'utf8');
    await assert.rejects(
        runScript(script, [], { cwd: directory, timeout: 50 }),
        (caught: unknown) => caught instanceof ScriptTimeoutError && caught.timeout === 50
    );
});

test('runner timeout preserves output produced before termination', async () => {
    const directory = await mkdtemp(join(tmpdir(), 'pikakit-timeout-output-'));
    const script = join(directory, 'output-then-hang.mjs');
    await writeFile(script, `console.log('captured stdout');\nconsole.error('captured stderr');\nsetInterval(() => {}, 1000);\n`, 'utf8');
    await assert.rejects(
        runScript(script, [], { cwd: directory, timeout: 300 }),
        (caught: unknown) => caught instanceof ScriptTimeoutError
            && caught.stdout.includes('captured stdout')
            && caught.stderr.includes('captured stderr')
    );
});

test('runner timeout terminates the spawned process tree', async () => {
    const directory = await mkdtemp(join(tmpdir(), 'pikakit-tree-timeout-'));
    const marker = join(directory, 'grandchild-survived.txt');
    const childScript = join(directory, 'child.mjs');
    const parentScript = join(directory, 'parent.mjs');
    await writeFile(
        childScript,
        `import { writeFile } from 'node:fs/promises';\nsetTimeout(() => void writeFile(process.argv[2], 'alive'), 400);\nsetInterval(() => {}, 1000);\n`,
        'utf8'
    );
    await writeFile(
        parentScript,
        `import { spawn } from 'node:child_process';\nspawn(process.execPath, [${JSON.stringify(childScript)}, process.argv[2]], { stdio: 'ignore' });\nsetInterval(() => {}, 1000);\n`,
        'utf8'
    );

    await assert.rejects(
        runScript(parentScript, [marker], { cwd: directory, timeout: 100 }),
        (caught: unknown) => caught instanceof ScriptTimeoutError
    );
    await new Promise(resolve => setTimeout(resolve, 650));
    await assert.rejects(access(marker));
});

test('workflow audit validates YAML fields and fails an empty directory', async () => {
    const valid = `---\nskills:\n  - code-craft\nagents:\n  - backend\n---\nAuto-Learned Pattern\nExit Gate\nRollback\n`;
    assert.deepEqual(auditWorkflowContent('valid.md', valid).issues, []);
    assert.deepEqual(
        auditWorkflowContent('invalid.md', 'skills:\nagents:\nRollback\n').issues,
        ['Missing YAML frontmatter', 'Missing Auto-Learned Pattern check', 'Missing Exit Gates']
    );
    const malformed = `---\nskills: [\nagents: {\n---\nAuto-Learned Pattern\nExit Gate\nRollback\n`;
    assert.ok(auditWorkflowContent('malformed.md', malformed).issues.some(issue =>
        issue.startsWith('Invalid YAML frontmatter:')
    ));

    const project = await mkdtemp(join(tmpdir(), 'pikakit-workflows-'));
    await mkdir(join(project, '.agent', 'workflows'), { recursive: true });
    assert.deepEqual(auditWorkflows(project), [{ file: '<none>', issues: ['No workflow files found'] }]);
});

test('skill audit rejects malformed YAML instead of matching field names', async () => {
    const skillsDirectory = await mkdtemp(join(tmpdir(), 'pikakit-skill-yaml-'));
    const skillDirectory = join(skillsDirectory, 'invalid-skill');
    await mkdir(skillDirectory);
    await writeFile(
        join(skillDirectory, 'SKILL.md'),
        `---\nname: invalid-skill\ndescription: Use when testing. NOT for production.\nmetadata: {\n  triggers: [test]\n  coordinates_with: [test]\n  version: 1\n---\n## When to Use\n## Scope\n`,
        'utf8'
    );
    const result = auditSkill('invalid-skill', skillsDirectory);
    assert.ok(result.issues.some(issue => issue.startsWith('Invalid YAML frontmatter:')));
});

test('audit CLIs return 0/1/2 for success, validation failure, and usage errors', async () => {
    const emptyProject = await mkdtemp(join(tmpdir(), 'pikakit-audit-exit-'));
    await mkdir(join(emptyProject, '.agent', 'workflows'), { recursive: true });
    const originalLog = console.log;
    const originalError = console.error;
    console.log = () => undefined;
    console.error = () => undefined;
    try {
        assert.equal(workflowAuditMain([emptyProject]), 1);
        assert.equal(workflowAuditMain(['one', 'two']), 2);
        assert.equal(skillAuditMain(['missing-skill-for-validation-test']), 1);
        assert.equal(skillAuditMain(['.']), 2);
    } finally {
        console.log = originalLog;
        console.error = originalError;
    }
});

async function captureStdout<T>(action: () => Promise<T>): Promise<{ value: T; stdout: string; stderr: string }> {
    const logs: string[] = [];
    const errors: string[] = [];
    const originalLog = console.log;
    const originalError = console.error;
    console.log = (...args: unknown[]) => logs.push(args.map(String).join(' '));
    console.error = (...args: unknown[]) => errors.push(args.map(String).join(' '));
    try {
        return { value: await action(), stdout: logs.join('\n'), stderr: errors.join('\n') };
    } finally {
        console.log = originalLog;
        console.error = originalError;
    }
}

test('checklist JSON is a single document and records optional coverage gaps', async () => {
    const project = await mkdtemp(join(tmpdir(), 'pikakit-checklist-'));
    const requiredScripts = [
        ['.agent/scripts/audit_workflows.ts', 'if (process.argv.length !== 2) process.exitCode = 1;\n'],
        ['.agent/scripts/skill-audit.ts', 'if (process.argv.length !== 2) process.exitCode = 1;\n'],
        ['.agent/skills/knowledge-compiler/scripts/secret-scanner.ts', 'if (process.argv[2] !== "--all") process.exitCode = 1;\n'],
        ['.agent/scripts/typecheck.ts', 'process.exitCode = 0;\n'],
        ['.agent/scripts/run-tests.ts', 'process.exitCode = 0;\n'],
        ['.agent/skills/studio/scripts/validate_data.ts', 'process.exitCode = 0;\n'],
        ['.agent/scripts/validate_docs.ts', 'process.exitCode = 0;\n']
    ];
    for (const [relativePath, content] of requiredScripts) {
        const target = join(project, relativePath);
        await mkdir(join(target, '..'), { recursive: true });
        await writeFile(target, content, 'utf8');
    }

    const result = await captureStdout(() => checklistMain([project, '--format', 'json']));
    assert.equal(result.value, 0);
    assert.equal(result.stderr, '');
    const report = JSON.parse(result.stdout) as {
        summary: { verdict: string; exit_code: number; deployment_ready: boolean };
        results: Array<{ name: string; status: string; reason: string }>;
    };
    assert.equal(report.summary.verdict, 'passed_with_skips');
    assert.equal(report.summary.exit_code, 0);
    assert.equal(report.summary.deployment_ready, false);
    assert.ok(report.results.some(item => item.status === 'skipped' && item.reason === 'not_configured'));
    assert.ok(report.results.some(item => item.name === 'Lighthouse Audit' && item.reason === 'url_not_provided'));
});

test('verify fails closed when a required checker is missing', async () => {
    const project = await mkdtemp(join(tmpdir(), 'pikakit-verify-'));
    const secretScanner = join(project, '.agent', 'skills', 'knowledge-compiler', 'scripts', 'secret-scanner.ts');
    await mkdir(join(secretScanner, '..'), { recursive: true });
    await writeFile(secretScanner, 'if (process.argv[2] !== "--all") process.exitCode = 1;\n', 'utf8');
    const result = await captureStdout(() => verifyMain([
        project, '--url', 'http://127.0.0.1:1', '--stop-on-fail', '--format', 'json'
    ]));
    assert.equal(result.value, 2);
    const report = JSON.parse(result.stdout) as {
        summary: { verdict: string; exit_code: number };
        results: Array<{ name: string; status: string; reason: string }>;
    };
    assert.equal(report.summary.verdict, 'incomplete');
    assert.equal(report.summary.exit_code, 2);
    assert.ok(report.results.some(item =>
        item.name === 'Workflow Audit' && item.status === 'error' && item.reason === 'required_script_missing'
    ));
});

test('JSON mode returns a parseable report for configuration errors', async () => {
    const missingProject = join(tmpdir(), `pikakit-missing-${Date.now()}`);
    const checklist = await captureStdout(() => checklistMain([
        missingProject, '--format', 'json'
    ]));
    assert.equal(checklist.value, 2);
    assert.equal(checklist.stderr, '');
    const checklistReport = JSON.parse(checklist.stdout) as {
        summary: { verdict: string; exit_code: number; deployment_ready: boolean };
        results: Array<{ status: string; reason: string }>;
    };
    assert.equal(checklistReport.summary.verdict, 'incomplete');
    assert.equal(checklistReport.summary.exit_code, 2);
    assert.equal(checklistReport.summary.deployment_ready, false);
    assert.deepEqual(checklistReport.results.map(result => [result.status, result.reason]), [
        ['error', 'project_not_found']
    ]);

    const verify = await captureStdout(() => verifyMain(['--format', 'json']));
    assert.equal(verify.value, 2);
    assert.equal(verify.stderr, '');
    const verifyReport = JSON.parse(verify.stdout) as {
        summary: { verdict: string; exit_code: number };
        results: Array<{ status: string; reason: string }>;
    };
    assert.equal(verifyReport.summary.verdict, 'incomplete');
    assert.equal(verifyReport.summary.exit_code, 2);
    assert.deepEqual(verifyReport.results.map(result => [result.status, result.reason]), [
        ['error', 'missing_url']
    ]);
});
