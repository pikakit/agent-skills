#!/usr/bin/env node

import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { discoverSkillDocuments, normalizeNewlines } from './utils/skill-docs.ts';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const SKILLS = join(ROOT, '.agent', 'skills');
const FIXTURES = join(ROOT, '.agent', 'evals', 'routing.json');
const EXPECTED_DESCRIPTORS = 65;

interface RouteDefinition {
  id: string;
  triggers: string[];
  negativeTriggers: string[];
  coordinatesWith: string[];
}

interface RoutingCase {
  id: string;
  positive: string[];
  negative: string[];
  overlap: { prompt: string; expected_top3: string[] };
}

interface RoutingFixtures {
  schema_version: '1.0.0';
  cases: RoutingCase[];
}

function strings(value: unknown): string[] {
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === 'string') : [];
}

function definitions(skillsDirectory = SKILLS): RouteDefinition[] {
  return discoverSkillDocuments(skillsDirectory).map(document => {
    const metadata = document.parsed.frontmatter.metadata as Record<string, unknown> | undefined;
    if (!metadata) throw new Error(`${document.id}: missing metadata`);
    return {
      id: document.id,
      triggers: strings(metadata.triggers),
      negativeTriggers: strings(metadata.negative_triggers),
      coordinatesWith: strings(metadata.coordinates_with),
    };
  });
}

function normalize(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
}

function tokens(value: string): Set<string> {
  return new Set(normalize(value).split(/\s+/).filter(token => token.length > 1));
}

export function rankRoutes(prompt: string, routes: RouteDefinition[]): string[] {
  const normalizedPrompt = normalize(prompt);
  const promptTokens = tokens(prompt);
  return routes.map(route => {
    const excluded = route.negativeTriggers.some(trigger => normalizedPrompt.includes(normalize(trigger)));
    let score = excluded ? Number.NEGATIVE_INFINITY : 0;
    if (!excluded) {
      for (const trigger of route.triggers) {
        const normalizedTrigger = normalize(trigger);
        if (normalizedPrompt.includes(normalizedTrigger)) score += 100 + normalizedTrigger.length;
        const triggerTokens = tokens(trigger);
        const matches = [...triggerTokens].filter(token => promptTokens.has(token)).length;
        score += triggerTokens.size === 0 ? 0 : 10 * matches / triggerTokens.size;
      }
      const idTokens = tokens(route.id);
      score += 20 * [...idTokens].filter(token => promptTokens.has(token)).length;
    }
    return { id: route.id, score };
  }).filter(result => Number.isFinite(result.score) && result.score > 0)
    .sort((a, b) => b.score - a.score || a.id.localeCompare(b.id))
    .map(result => result.id);
}

export function buildFixtures(routes: RouteDefinition[]): RoutingFixtures {
  const routeMap = new Map(routes.map(route => [route.id, route]));
  const topLevelMap = new Map(routes.map(route => [route.id.split('/')[0], route]));
  return {
    schema_version: '1.0.0',
    cases: routes.map((route, index) => {
      if (route.triggers.length < 3 || route.negativeTriggers.length < 2) {
        throw new Error(`${route.id}: routing evaluation needs at least 3 triggers and 2 negative triggers`);
      }
      const coordinate = route.coordinatesWith
        .map(id => routeMap.get(id) ?? topLevelMap.get(id))
        .find(candidate => candidate && candidate.id !== route.id)
        ?? routes[(index + 1) % routes.length];
      return {
        id: route.id,
        positive: route.triggers.slice(0, 3).map(trigger => `Use ${route.id} to handle this request: ${trigger}.`),
        negative: route.negativeTriggers.slice(0, 2).map(trigger => `This request is ${trigger}; do not route it to ${route.id}.`),
        overlap: {
          prompt: `Coordinate ${route.triggers[0]} with ${coordinate.triggers[0]}.`,
          expected_top3: [route.id, coordinate.id],
        },
      };
    }),
  };
}

export interface RoutingMetrics {
  top1: number;
  top3: number;
  negativeViolations: number;
  failures: string[];
}

export function evaluateFixtures(fixtures: RoutingFixtures, routes: RouteDefinition[]): RoutingMetrics {
  let positiveTotal = 0;
  let top1Hits = 0;
  let top3Hits = 0;
  let negativeViolations = 0;
  const failures: string[] = [];
  for (const fixture of fixtures.cases) {
    for (const prompt of fixture.positive) {
      const ranked = rankRoutes(prompt, routes);
      positiveTotal += 1;
      if (ranked[0] === fixture.id) top1Hits += 1;
      else failures.push(`${fixture.id}: positive top-1 was ${ranked[0] ?? '<none>'}`);
      if (ranked.slice(0, 3).includes(fixture.id)) top3Hits += 1;
      else failures.push(`${fixture.id}: missing from positive top-3`);
    }
    for (const prompt of fixture.negative) {
      if (rankRoutes(prompt, routes).slice(0, 3).includes(fixture.id)) {
        negativeViolations += 1;
        failures.push(`${fixture.id}: negative-trigger violation`);
      }
    }
    const overlapRanked = rankRoutes(fixture.overlap.prompt, routes).slice(0, 3);
    for (const expected of fixture.overlap.expected_top3) {
      positiveTotal += 1;
      if (overlapRanked.includes(expected)) top3Hits += 1;
      else failures.push(`${fixture.id}: overlap missing ${expected} from top-3`);
    }
  }
  return {
    top1: positiveTotal === 0 ? 0 : top1Hits / (fixtures.cases.length * 3),
    top3: positiveTotal === 0 ? 0 : top3Hits / positiveTotal,
    negativeViolations,
    failures,
  };
}

export function main(args = process.argv.slice(2)): 0 | 1 | 2 {
  const update = args.length === 1 && args[0] === '--update';
  if (args.length > (update ? 1 : 0)) {
    console.error('Usage: npx tsx .agent/scripts/routing-eval.ts [--update]');
    return 2;
  }
  try {
    const routes = definitions();
    if (routes.length !== EXPECTED_DESCRIPTORS) throw new Error(`Expected ${EXPECTED_DESCRIPTORS} descriptors, found ${routes.length}`);
    const generated = buildFixtures(routes);
    const serialized = `${JSON.stringify(generated, null, 2)}\n`;
    if (update) {
      mkdirSync(dirname(FIXTURES), { recursive: true });
      writeFileSync(FIXTURES, serialized, 'utf8');
    }
    else {
      if (!existsSync(FIXTURES)) throw new Error('Routing fixtures are missing; run with --update');
      if (normalizeNewlines(readFileSync(FIXTURES, 'utf8')) !== serialized) {
        console.error('Routing fixtures are stale; run with --update');
        return 1;
      }
    }
    const metrics = evaluateFixtures(generated, routes);
    for (const failure of metrics.failures) console.error(failure);
    console.log(`Routing eval: top-1 ${(metrics.top1 * 100).toFixed(2)}%, top-3 ${(metrics.top3 * 100).toFixed(2)}%, negative violations ${metrics.negativeViolations}.`);
    return metrics.top1 >= 0.95 && metrics.top3 === 1 && metrics.negativeViolations === 0 ? 0 : 1;
  } catch (error: unknown) {
    console.error(`Routing eval error: ${error instanceof Error ? error.message : String(error)}`);
    return 2;
  }
}

const isMain = process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isMain) process.exitCode = main();
