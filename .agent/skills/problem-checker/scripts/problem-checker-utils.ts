export function errorMessage(error: unknown): string {
    return error instanceof Error ? error.message : String(error);
}

export function outputText(value: string | Buffer | undefined): string {
    return typeof value === 'string' ? value : value?.toString('utf-8') ?? '';
}
