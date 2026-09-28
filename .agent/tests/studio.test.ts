import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { readdir, readFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'node:test';
import {
    AVAILABLE_STACKS,
    CSV_CONFIG,
    clearSearchCache,
    getCacheStats,
    search,
    searchStack
} from '../skills/studio/scripts/core.ts';
import {
    DesignSystemGenerator,
    parseDecisionRules
} from '../skills/studio/scripts/design_system.ts';
import { loadCSV, loadCSVSafe } from '../skills/studio/scripts/utils/csv-loader.ts';
import { StudioError } from '../skills/studio/scripts/types.ts';
import { validateStudioData } from '../skills/studio/scripts/validate_data.ts';

const TEST_DIR = dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = resolve(TEST_DIR, '..', '..');
const STUDIO_SCRIPTS = resolve(ROOT_DIR, '.agent', 'skills', 'studio', 'scripts');

async function findTypeScriptFiles(directory: string): Promise<string[]> {
    const entries = await readdir(directory, { withFileTypes: true });
    const results = await Promise.all(entries.map(async entry => {
        const path = resolve(directory, entry.name);
        return entry.isDirectory()
            ? findTypeScriptFiles(path)
            : entry.isFile() && entry.name.endsWith('.ts') ? [path] : [];
    }));
    return results.flat();
}

test('all Studio CSV databases pass strict structural validation', async () => {
    const report = await validateStudioData();
    assert.equal(report.files, 24);
    assert.equal(report.rows, 1392);
    assert.equal(report.sources.find(source => source.file === 'landing.csv')?.rows, 30);
    assert.equal(report.sources.find(source => source.file === 'stacks/shadcn.csv')?.rows, 60);
});

test('CSV loader fails closed and safe loader preserves the error', async () => {
    await assert.rejects(
        () => loadCSV('does-not-exist.csv'),
        (error: unknown) => error instanceof StudioError
            && error.code === 'ERR_DATABASE_LOAD'
            && error.details?.source === 'does-not-exist.csv'
    );

    const safe = await loadCSVSafe('does-not-exist.csv');
    assert.equal(safe.ok, false);
    if (!safe.ok) assert.equal(safe.error.code, 'ERR_DATABASE_LOAD');
});

test('search distinguishes invalid input from a valid zero-match result', async () => {
    await assert.rejects(
        () => search('   '),
        (error: unknown) => error instanceof StudioError && error.code === 'ERR_EMPTY_QUERY'
    );
    await assert.rejects(
        () => search('query', 'not-a-domain'),
        (error: unknown) => error instanceof StudioError && error.code === 'ERR_UNKNOWN_CATEGORY'
    );
    await assert.rejects(
        () => search('query', 'style', 0),
        (error: unknown) => error instanceof StudioError && error.code === 'ERR_INVALID_ARGUMENT'
    );

    const noMatch = await search('zzzzzzzzzzzzzz', 'style', 3, { useCache: false });
    assert.equal(noMatch.count, 0);
    assert.deepEqual(noMatch.results, []);
});

test('every configured domain and stack loads without a database error', async () => {
    for (const domain of Object.keys(CSV_CONFIG)) {
        const result = await search('design component accessibility performance', domain, 1, {
            useCache: false
        });
        assert.equal(result.domain, domain);
    }
    for (const stack of AVAILABLE_STACKS) {
        const result = await searchStack('component performance', stack, 1);
        assert.equal(result.stack, stack);
    }
});

test('repaired CSV sources return searchable records', async () => {
    const chart = await search('real-time streaming ticker', 'chart', 3, { useCache: false });
    assert.equal(chart.results[0]?.['Best Chart Type'], 'Streaming Area Chart');

    const landing = await search('marketplace directory listing', 'landing', 3, { useCache: false });
    assert.equal(landing.results[0]?.['Pattern Name'], 'Marketplace / Directory');

    const icons = await search('loading spinner wait', 'icons', 3, { useCache: false });
    assert.equal(icons.results[0]?.['Icon Name'], 'loader');

    const web = await search('preconnect cdn', 'web', 3, { useCache: false });
    assert.equal(web.results[0]?.["Don't"], 'Skip preconnect for known CDN domains');

    for (const stack of ['nuxt-ui', 'nuxtjs', 'shadcn']) {
        const result = await searchStack('component button rendering', stack, 3);
        assert.ok(result.count > 0, `${stack} should return at least one result`);
    }
});

test('cache hit statistics and clearing use the same cache instance', async () => {
    clearSearchCache();
    const first = await search('minimal design', 'style', 1);
    const second = await search('minimal design', 'style', 1);
    assert.equal(first.cached, false);
    assert.equal(second.cached, true);
    assert.deepEqual(getCacheStats(), {
        hits: 1,
        misses: 1,
        hitRate: '50.0%',
        cacheSize: 1
    });
    clearSearchCache();
    assert.equal(getCacheStats().cacheSize, 0);
});

test('reasoning CSV preserves quoted JSON and anti-pattern fields', async () => {
    const designSystem = await new DesignSystemGenerator().generate('micro saas', 'Reasoning Test');
    assert.deepEqual(designSystem.decision_rules, {
        if_quick_onboarding: 'reduce-steps',
        if_demo_available: 'feature-interactive-demo'
    });
    assert.equal(designSystem.anti_patterns, 'Complex onboarding flow + Cluttered layout');
    assert.notEqual(designSystem.pattern.name, 'Hero + Features + CTA');
});

test('malformed reasoning JSON fails closed with database context', () => {
    assert.throws(
        () => parseDecisionRules('{not-json}', 'Broken Category'),
        (error: unknown) => error instanceof StudioError
            && error.code === 'ERR_DATABASE_LOAD'
            && error.details?.source === 'ui-reasoning.csv'
            && error.details?.category === 'Broken Category'
    );
});

test('Studio CLI returns structured errors with a nonzero exit code', () => {
    const cli = resolve(STUDIO_SCRIPTS, 'search.ts');
    const invalid = spawnSync(
        process.execPath,
        ['--import', 'tsx', cli, 'query', '--domain', 'not-a-domain', '--json'],
        { cwd: ROOT_DIR, encoding: 'utf8' }
    );
    assert.equal(invalid.status, 1);
    const error = JSON.parse(invalid.stderr.trim()) as { code: string };
    assert.equal(error.code, 'ERR_UNKNOWN_CATEGORY');

    const valid = spawnSync(
        process.execPath,
        ['--import', 'tsx', cli, 'preconnect cdn', '--domain', 'web', '--json'],
        { cwd: ROOT_DIR, encoding: 'utf8' }
    );
    assert.equal(valid.status, 0, valid.stderr);
    const result = JSON.parse(valid.stdout) as { count: number };
    assert.ok(result.count > 0);
});

test('Studio source contains no TypeScript suppression directive', async () => {
    const files = await findTypeScriptFiles(STUDIO_SCRIPTS);
    const suppressionDirective = ['@ts', 'nocheck'].join('-');
    for (const file of files) {
        const content = await readFile(file, 'utf8');
        assert.equal(content.includes(suppressionDirective), false, file);
    }
});
