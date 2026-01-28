/**
 * Page Type Detection Tests - Studio Design System
 * =================================================
 * Unit tests for detectPageType() function
 */

import { describe, test, expect } from 'vitest';
import { detectPageType } from '../../.agent/studio/scripts-js/utils/page-type-detector.js';

describe('Page Type Detection', () => {
    describe('detectPageType - keyword matching', () => {
        test('detects Dashboard / Data View', () => {
            expect(detectPageType('dashboard analytics')).toBe('Dashboard / Data View');
            expect(detectPageType('admin panel')).toBe('Dashboard / Data View');
            expect(detectPageType('metrics overview')).toBe('Dashboard / Data View');
            expect(detectPageType('data visualization')).toBe('Dashboard / Data View');
        });

        test('detects Checkout / Payment', () => {
            expect(detectPageType('checkout page')).toBe('Checkout / Payment');
            expect(detectPageType('payment flow')).toBe('Checkout / Payment');
            expect(detectPageType('shopping cart')).toBe('Checkout / Payment');
            expect(detectPageType('order summary')).toBe('Checkout / Payment');
        });

        test('detects Settings / Profile', () => {
            expect(detectPageType('settings page')).toBe('Settings / Profile');
            expect(detectPageType('user profile')).toBe('Settings / Profile');
            expect(detectPageType('account preferences')).toBe('Settings / Profile');
            expect(detectPageType('config panel')).toBe('Settings / Profile');
        });

        test('detects Landing / Marketing', () => {
            expect(detectPageType('landing page')).toBe('Landing / Marketing');
            expect(detectPageType('marketing site')).toBe('Landing / Marketing');
            expect(detectPageType('homepage hero')).toBe('Landing / Marketing');
            expect(detectPageType('promo page')).toBe('Landing / Marketing');
        });

        test('detects Authentication', () => {
            expect(detectPageType('login form')).toBe('Authentication');
            expect(detectPageType('signup page')).toBe('Authentication');
            expect(detectPageType('register account')).toBe('Authentication');
            expect(detectPageType('password reset')).toBe('Authentication');
        });

        test('detects Pricing / Plans', () => {
            expect(detectPageType('pricing table')).toBe('Pricing / Plans');
            expect(detectPageType('subscription plans')).toBe('Pricing / Plans');
            expect(detectPageType('pricing tiers')).toBe('Pricing / Plans');
            expect(detectPageType('package options')).toBe('Pricing / Plans');
        });

        test('detects Blog / Article', () => {
            expect(detectPageType('blog post')).toBe('Blog / Article');
            expect(detectPageType('article page')).toBe('Blog / Article');
            expect(detectPageType('news story')).toBe('Blog / Article');
            expect(detectPageType('content page')).toBe('Blog / Article');
        });

        test('detects Product Detail', () => {
            expect(detectPageType('product page')).toBe('Product Detail');
            expect(detectPageType('item detail')).toBe('Product Detail');
            expect(detectPageType('pdp layout')).toBe('Product Detail');
            expect(detectPageType('shop product')).toBe('Product Detail');
        });

        test('detects Search Results', () => {
            expect(detectPageType('search results')).toBe('Search Results');
            expect(detectPageType('browse catalog')).toBe('Search Results');
            expect(detectPageType('filter list')).toBe('Search Results');
        });

        test('detects Empty State', () => {
            expect(detectPageType('404 page')).toBe('Empty State');
            expect(detectPageType('empty state')).toBe('Empty State');
            expect(detectPageType('error not found')).toBe('Empty State');
            expect(detectPageType('zero results')).toBe('Empty State');
        });
    });

    describe('detectPageType - case insensitive', () => {
        test('handles uppercase input', () => {
            expect(detectPageType('DASHBOARD')).toBe('Dashboard / Data View');
            expect(detectPageType('CHECKOUT')).toBe('Checkout / Payment');
        });

        test('handles mixed case input', () => {
            expect(detectPageType('Dashboard Analytics')).toBe('Dashboard / Data View');
            expect(detectPageType('Checkout Page')).toBe('Checkout / Payment');
        });
    });

    describe('detectPageType - fallback logic', () => {
        test('uses style results fallback for dashboard', () => {
            const styleResults = [
                {
                    'Style Category': 'Modern Dashboard',
                    'Best For': 'Dashboard applications, data visualization'
                }
            ];
            expect(detectPageType('unknown page', styleResults)).toBe('Dashboard / Data View');
        });

        test('uses style results fallback for landing', () => {
            const styleResults = [
                {
                    'Style Category': 'Hero Design',
                    'Best For': 'Landing pages, marketing sites'
                }
            ];
            expect(detectPageType('unknown page', styleResults)).toBe('Landing / Marketing');
        });

        test('returns General for unknown context', () => {
            expect(detectPageType('unknown random page')).toBe('General');
        });

        test('returns General when no style results', () => {
            expect(detectPageType('unknown page', [])).toBe('General');
        });

        test('handles null/undefined context', () => {
            expect(detectPageType(null)).toBe('General');
            expect(detectPageType(undefined)).toBe('General');
            expect(detectPageType('')).toBe('General');
        });
    });

    describe('detectPageType - priority matching', () => {
        test('matches first keyword when multiple patterns possible', () => {
            // "dashboard" appears before "data" in patterns
            expect(detectPageType('dashboard data analytics')).toBe('Dashboard / Data View');
        });

        test('handles partial keyword matches', () => {
            expect(detectPageType('dashboards')).toBe('Dashboard / Data View'); // plural
            expect(detectPageType('checkout-page')).toBe('Checkout / Payment'); // hyphenated
        });
    });
});
