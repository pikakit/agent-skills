/**
 * Strict TypeScript utility examples used by the typescript-expert skill.
 */

export type Result<T, E> =
  | { success: true; data: T }
  | { success: false; error: E };

export const ok = <T>(data: T): Result<T, never> => ({ success: true, data });
export const err = <E>(error: E): Result<never, E> => ({ success: false, error });

export type Option<T> = { type: 'some'; value: T } | { type: 'none' };
export const some = <T>(value: T): Option<T> => ({ type: 'some', value });
export const none: Option<never> = { type: 'none' };
export const isSome = <T>(option: Option<T>): option is { type: 'some'; value: T } => option.type === 'some';
export const isNone = <T>(option: Option<T>): option is { type: 'none' } => option.type === 'none';

export type Branded<T, B extends string> = T & { readonly __brand: B };

export const createBrand = <B extends string>(brand: B) => <T>(value: T): Branded<T, B> => {
  const branded = Object(value) as Branded<T, B>;
  return Object.defineProperty(branded, '__brand', {
    value: brand,
    enumerable: false,
    writable: false,
  });
};

export const hasBrand = <B extends string>(value: unknown, brand: B): value is Branded<unknown, B> => {
  return typeof value === 'object' && value !== null && '__brand' in value
    && (value as { __brand?: unknown }).__brand === brand;
};

export const UserId = createBrand('UserId');
export const Email = createBrand('Email');
export const UUID = createBrand('UUID');
export const Timestamp = createBrand('Timestamp');
export const PositiveNumber = createBrand('PositiveNumber');

type DeepReadonly<T> = T extends (...args: never[]) => unknown
  ? T
  : T extends readonly (infer U)[]
    ? readonly DeepReadonly<U>[]
    : T extends object
      ? { readonly [K in keyof T]: DeepReadonly<T[K]> }
      : T;

export const deepFreeze = <T>(value: T): DeepReadonly<T> => {
  if (value === null || typeof value !== 'object') return value as DeepReadonly<T>;
  Object.freeze(value);
  for (const property of Object.getOwnPropertyNames(value)) {
    const nested = (value as Record<string, unknown>)[property];
    if (nested !== null && typeof nested === 'object') deepFreeze(nested);
  }
  return value as DeepReadonly<T>;
};

export const deepClone = <T>(value: T): T => {
  if (value === null || typeof value !== 'object') return value;
  if (Array.isArray(value)) return value.map(item => deepClone(item)) as T;
  return Object.fromEntries(
    Object.entries(value).map(([key, nested]) => [key, deepClone(nested)]),
  ) as T;
};

export const pick = <T extends object, K extends keyof T>(value: T, keys: readonly K[]): Pick<T, K> => {
  const result = {} as Pick<T, K>;
  for (const key of keys) {
    if (key in value) result[key] = value[key];
  }
  return result;
};

export const omit = <T extends object, K extends keyof T>(value: T, keys: readonly K[]): Omit<T, K> => {
  const excluded = new Set<PropertyKey>(keys);
  return Object.fromEntries(
    Object.entries(value).filter(([key]) => !excluded.has(key)),
  ) as Omit<T, K>;
};

export const merge = <A extends object, B extends object>(left: A, right: B): A & B => ({ ...left, ...right });
export const first = <T>(items: readonly T[]): T | undefined => items[0];
export const last = <T>(items: readonly T[]): T | undefined => items[items.length - 1];
export const isNonEmpty = <T>(items: readonly T[]): items is readonly [T, ...T[]] => items.length > 0;
export const tuple = <T>(length: number, fill: T): T[] => Array<T>(length).fill(fill);

export function assertNever(value: never, message?: string): never {
  throw new Error(message ?? `Unexpected value: ${String(value)}`);
}

export function exhaustiveCheck(_value: never): void {
  // Compile-time exhaustiveness helper.
}

export const safeJsonParse = <T>(text: string, fallback: T): unknown | T => {
  try {
    return JSON.parse(text) as unknown;
  } catch {
    return fallback;
  }
};

export const isJsonSerializable = (value: unknown): boolean => {
  if (value === null || typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
    return true;
  }
  if (Array.isArray(value)) return value.every(isJsonSerializable);
  if (typeof value === 'object') return Object.values(value).every(isJsonSerializable);
  return false;
};
