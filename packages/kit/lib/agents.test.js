/**
 * @fileoverview Tests for agents.js
 */
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { AGENTS, detectInstalledAgents, getAgentConfig, getAllAgentNames } from './agents.js';

describe('agents.js', () => {
    describe('AGENTS constant', () => {
        it('should define all supported agents', () => {
            expect(AGENTS).toBeDefined();
            expect(typeof AGENTS).toBe('object');
        });

        it('should include antigravity agent', () => {
            expect(AGENTS.antigravity).toBeDefined();
            expect(AGENTS.antigravity.name).toBe('antigravity');
            expect(AGENTS.antigravity.displayName).toBe('Antigravity');
            expect(AGENTS.antigravity.skillsDir).toBe('.agent/skills');
        });

        it('should include claude-code agent', () => {
            expect(AGENTS['claude-code']).toBeDefined();
            expect(AGENTS['claude-code'].name).toBe('claude-code');
            expect(AGENTS['claude-code'].displayName).toBe('Claude Code');
        });

        it('should include all major agents', () => {
            const expectedAgents = [
                'antigravity',
                'claude-code',
                'codex',
                'gemini-cli',
                'github-copilot',
                'windsurf',
                'cursor',
                'cline',
                'roo',
                'continue',
                'goose'
            ];

            expectedAgents.forEach(agentName => {
                expect(AGENTS[agentName], `Missing agent: ${agentName}`).toBeDefined();
            });
        });

        it('each agent should have required properties', () => {
            Object.entries(AGENTS).forEach(([key, config]) => {
                expect(config.name, `${key}.name`).toBeDefined();
                expect(config.displayName, `${key}.displayName`).toBeDefined();
                expect(config.skillsDir, `${key}.skillsDir`).toBeDefined();
                expect(config.globalSkillsDir, `${key}.globalSkillsDir`).toBeDefined();
                expect(typeof config.detect, `${key}.detect`).toBe('function');
            });
        });
    });

    describe('getAllAgentNames()', () => {
        it('should return array of all agent names', () => {
            const names = getAllAgentNames();
            expect(Array.isArray(names)).toBe(true);
            expect(names.length).toBeGreaterThan(10);
        });

        it('should include known agents', () => {
            const names = getAllAgentNames();
            expect(names).toContain('antigravity');
            expect(names).toContain('claude-code');
            expect(names).toContain('cursor');
        });
    });

    describe('getAgentConfig()', () => {
        it('should return config for valid agent', () => {
            const config = getAgentConfig('antigravity');
            expect(config).toBeDefined();
            expect(config.name).toBe('antigravity');
        });

        it('should return undefined for invalid agent', () => {
            const config = getAgentConfig('nonexistent');
            expect(config).toBeUndefined();
        });
    });

    describe('detectInstalledAgents()', () => {
        it('should return an array', () => {
            const detected = detectInstalledAgents();
            expect(Array.isArray(detected)).toBe(true);
        });

        it('detected agents should have required properties', () => {
            const detected = detectInstalledAgents();
            detected.forEach(agent => {
                expect(agent.name).toBeDefined();
                expect(agent.displayName).toBeDefined();
                expect(agent.skillsDir).toBeDefined();
                expect(agent.globalSkillsDir).toBeDefined();
            });
        });
    });
});
