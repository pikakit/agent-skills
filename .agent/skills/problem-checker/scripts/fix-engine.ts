import path from 'node:path';

import type { Diagnostic, FixCandidate } from './problem-checker-types.ts';

function escapeRegex(value: string): string {
    return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function hasImportedName(content: string, name: string): boolean {
    const escaped = escapeRegex(name);
    return new RegExp(`import\\s+(?:type\\s+)?(?:[^;\\n]*\\b${escaped}\\b)[^;\\n]*from\\s*['"][^'"]+['"]`).test(content);
}

function addNamedReactImport(content: string, name: string): string {
    const namedReact = /import\s*{([^}]+)}\s*from\s*['"]react['"];?/;
    const match = content.match(namedReact);
    if (!match) return `import { ${name} } from 'react';\n${content}`;
    const imports = match[1].split(',').map(value => value.trim()).filter(Boolean);
    if (!imports.some(value => new RegExp(`\\b${escapeRegex(name)}\\b`).test(value))) imports.push(name);
    return content.replace(namedReact, `import { ${imports.join(', ')} } from 'react';`);
}

export function tryFix(content: string, problem: Diagnostic, filePath: string): FixCandidate | null {
    const ext = path.extname(filePath).toLowerCase();
    const missingName = problem.message.match(/Cannot find name '([A-Za-z_$][\w$]*)'/)?.[1];
    if (missingName) {
        const reactImports = new Set([
            'Fragment', 'Suspense', 'createContext', 'forwardRef', 'lazy', 'memo',
            'useCallback', 'useContext', 'useEffect', 'useMemo', 'useReducer',
            'useRef', 'useState',
        ]);
        if (reactImports.has(missingName) && !hasImportedName(content, missingName)) {
            return {
                content: addNamedReactImport(content, missingName),
                description: `Added '${missingName}' to React imports`,
            };
        }

        const nextImports: Record<string, { module: string; named: boolean }> = {
            Image: { module: 'next/image', named: false },
            Link: { module: 'next/link', named: false },
            usePathname: { module: 'next/navigation', named: true },
            useRouter: { module: 'next/navigation', named: true },
            useSearchParams: { module: 'next/navigation', named: true },
        };
        const nextImport = nextImports[missingName];
        if (nextImport && !hasImportedName(content, missingName)) {
            const statement = nextImport.named
                ? `import { ${missingName} } from '${nextImport.module}';`
                : `import ${missingName} from '${nextImport.module}';`;
            return {
                content: `${statement}\n${content}`,
                description: `Added '${missingName}' import from '${nextImport.module}'`,
            };
        }
    }

    if (problem.message.includes("Cannot find namespace 'JSX'") && !hasImportedName(content, 'JSX')) {
        return {
            content: `import type { JSX } from 'react';\n${content}`,
            description: "Imported React's JSX namespace",
        };
    }

    if (problem.message.includes('is declared but') && problem.message.includes('never used')) {
        const variable = problem.message.match(/'([^']+)'/)?.[1];
        if (variable && !variable.startsWith('_')) {
            const declaration = new RegExp(`\\b(const|let|var|function)\\s+${escapeRegex(variable)}\\b`);
            if (declaration.test(content)) {
                return {
                    content: content.replace(declaration, `$1 _${variable}`),
                    description: `Prefixed unused '${variable}' with '_'`,
                };
            }
        }
    }

    if (problem.message.includes('@import') && problem.message.includes('precede') && (ext === '.css' || ext === '.scss')) {
        const newline = content.includes('\r\n') ? '\r\n' : '\n';
        const lines = content.split(/\r?\n/);
        const imports = lines.filter(line => line.trimStart().startsWith('@import '));
        if (imports.length > 0) {
            const remaining = lines.filter(line => !line.trimStart().startsWith('@import '));
            const charsetIndex = remaining.findIndex(line => /^\uFEFF?\s*@charset\b/i.test(line));
            const insertAt = charsetIndex >= 0 ? charsetIndex + 1 : 0;
            remaining.splice(insertAt, 0, ...imports);
            return {
                content: remaining.join(newline),
                description: `Moved ${imports.length} @import rule(s) after @charset`,
            };
        }
    }

    return null;
}
